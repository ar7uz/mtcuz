// Edge Function: telegram-webhook
// Принимает callback-запросы от Telegram (нажатия на inline-кнопки в карточке заявки).
// Обновляет статус лида в БД и редактирует сообщение в группе.
//
// Env vars:
//   TELEGRAM_BOT_TOKEN       — тот же токен бота
//   TELEGRAM_WEBHOOK_SECRET  — любая случайная строка; Telegram отправит её в заголовке
//                              X-Telegram-Bot-Api-Secret-Token
//
// Регистрация вебхука у Telegram (одна команда):
//   curl "https://api.telegram.org/bot<TOKEN>/setWebhook" \
//        -d "url=https://<project>.supabase.co/functions/v1/telegram-webhook" \
//        -d "secret_token=<TELEGRAM_WEBHOOK_SECRET>" \
//        -d "allowed_updates=[\"callback_query\"]"

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
const SECRET    = Deno.env.get("TELEGRAM_WEBHOOK_SECRET")!;
const SB_URL    = Deno.env.get("SUPABASE_URL")!;
const SVC_KEY   = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ADMIN_BASE = Deno.env.get("ADMIN_BASE_URL") ?? "https://mtcuz.vercel.app";

const sb = createClient(SB_URL, SVC_KEY, { auth: { persistSession: false } });

async function tg(method: string, body: unknown) {
  return fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });
}

Deno.serve(async (req) => {
  // Telegram передаёт секрет в этом заголовке — без него отбиваем
  const incoming = req.headers.get("X-Telegram-Bot-Api-Secret-Token");
  if (!SECRET || incoming !== SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const update = await req.json();
    const cb = update.callback_query;

    // Игнорируем сообщения, реагируем только на нажатия кнопок
    if (!cb) return new Response("ok");

    const [action, leadId] = String(cb.data || "").split(":");
    const operator = cb.from.username
      ? `@${cb.from.username}`
      : [cb.from.first_name, cb.from.last_name].filter(Boolean).join(" ");

    const statusMap: Record<string, string> = {
      take:  "in_progress",
      close: "closed",
      spam:  "spam",
    };
    const newStatus = statusMap[action];

    if (!newStatus || !leadId) {
      await tg("answerCallbackQuery", { callback_query_id: cb.id, text: "Неизвестная команда" });
      return new Response("ok");
    }

    // Обновляем БД
    const { error: updErr } = await sb.from("leads").update({
      status:      newStatus,
      notes:       `Из Telegram: ${operator} → ${newStatus} в ${new Date().toISOString()}`,
    }).eq("id", leadId);

    if (updErr) {
      console.error("DB update error:", updErr);
      await tg("answerCallbackQuery", { callback_query_id: cb.id, text: "Ошибка БД, попробуйте позже" });
      return new Response("ok");
    }

    // Редактируем клавиатуру в исходном сообщении — показываем кто что сделал
    const emoji = newStatus === "in_progress" ? "⏳"
                : newStatus === "closed"      ? "✅"
                                              : "🚫";
    const label = newStatus === "in_progress" ? "В работе" : newStatus === "closed" ? "Закрыто" : "Спам";

    await tg("editMessageReplyMarkup", {
      chat_id:    cb.message.chat.id,
      message_id: cb.message.message_id,
      reply_markup: {
        inline_keyboard: [[
          { text: `${emoji} ${label} — ${operator}`, callback_data: "noop" },
          { text: "🌐 Админка", url: `${ADMIN_BASE}/#/admin/leads/${leadId}` },
        ]],
      },
    });

    // Всплывашка оператору
    await tg("answerCallbackQuery", {
      callback_query_id: cb.id,
      text: `Статус → ${label}`,
    });

    return new Response("ok");
  } catch (e) {
    console.error(e);
    return new Response("error", { status: 500 });
  }
});
