// Edge Function: notify-telegram
// Триггерится из БД при INSERT в public.leads.
// Достаёт заявку → форматирует → шлёт в групповой чат операторов с inline-кнопками.
//
// Env vars (Project Settings → Edge Functions → Secrets):
//   TELEGRAM_BOT_TOKEN — токен бота от BotFather
//   TELEGRAM_CHAT_ID   — id группы операторов (отрицательное число)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const BOT_TOKEN  = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
const CHAT_ID    = Deno.env.get("TELEGRAM_CHAT_ID")!;
const SB_URL     = Deno.env.get("SUPABASE_URL")!;
const SVC_KEY    = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ADMIN_BASE = Deno.env.get("ADMIN_BASE_URL") ?? "https://mtcuz.vercel.app";

const sb = createClient(SB_URL, SVC_KEY, { auth: { persistSession: false } });

const cors = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function md(s?: string | null) {
  if (!s) return "";
  return s.replace(/([_*\[\]()~`>#+=|{}.!\\-])/g, "\\$1");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST")    return new Response("method not allowed", { status: 405, headers: cors });

  if (!BOT_TOKEN || !CHAT_ID) {
    return new Response("env not configured", { status: 500, headers: cors });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const leadId = body.lead_id;
    if (!leadId) return new Response("missing lead_id", { status: 400, headers: cors });

    const { data: lead, error } = await sb.from("leads").select("*").eq("id", leadId).single();
    if (error || !lead) {
      return new Response(JSON.stringify({ error: "lead not found", details: error }), {
        status: 404, headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const lines = [
      "🆕 *Новая заявка с сайта*",
      "",
      `*Имя:* ${md(lead.name)}`,
      `*Телефон:* \`${md(lead.phone)}\``,
    ];
    if (lead.email)   lines.push(`*Email:* ${md(lead.email)}`);
    lines.push("");
    if (lead.message) lines.push(`*Сообщение:*\n${md(lead.message)}`);
    else              lines.push("_(без сообщения)_");
    lines.push("");
    if (lead.source_page) lines.push(`📍 Страница: \`${md(lead.source_page)}\``);
    const ts = new Date(lead.created_at).toLocaleString("ru-RU", { timeZone: "Asia/Tashkent" });
    lines.push(`🕒 ${md(ts)} (Tashkent)`);

    const text = lines.join("\n");

    const keyboard = {
      inline_keyboard: [
        [
          { text: "✋ Беру в работу", callback_data: `take:${lead.id}` },
          { text: "✅ Закрыть",        callback_data: `close:${lead.id}` },
        ],
        [
          { text: "🚫 Спам",           callback_data: `spam:${lead.id}` },
          { text: "🌐 Открыть в админке", url: `${ADMIN_BASE}/#/admin/leads/${lead.id}` },
        ],
      ],
    };

    const resp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id:      CHAT_ID,
        text,
        parse_mode:   "MarkdownV2",
        reply_markup: keyboard,
      }),
    });

    const tg = await resp.json();
    if (!tg.ok) {
      console.error("Telegram API error:", tg);
      return new Response(JSON.stringify({ ok: false, telegram: tg }), {
        status: 502, headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    // Сохраняем id сообщения, чтобы потом редактировать клавиатуру при смене статуса
    await sb.from("leads").update({
      telegram_message_id: tg.result.message_id,
      telegram_chat_id:    tg.result.chat.id,
    }).eq("id", lead.id);

    return new Response(JSON.stringify({ ok: true, message_id: tg.result.message_id }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
