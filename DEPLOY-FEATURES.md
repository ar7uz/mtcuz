# Деплой фичей: заявки + Telegram + аналитика

Делайте по порядку. Каждый шаг ~2-5 минут.

## Шаг 1 — Запуск SQL-миграции 002

1. Supabase Dashboard → **SQL Editor** → **+ New query**
2. Откройте файл [`supabase-002-features.sql`](supabase-002-features.sql), скопируйте всё содержимое, вставьте в редактор
3. **Run**
4. ✅ «Success. No rows returned»

Создаст: таблицы `leads`, `events`, `app_config`; поля `is_published` + SEO в projects/news/gov_cases; триггер для Telegram-уведомлений; helper-функции для статистики.

## Шаг 2 — Получите chat_id группы операторов

1. Откройте свою группу в Telegram (где сидит бот)
2. Напишите в группу любое сообщение — например `/start`
3. В **браузере** откройте (подставьте свой токен):

```
https://api.telegram.org/bot<НОВЫЙ_ТОКЕН>/getUpdates
```

4. В JSON-ответе найдите блок `chat`:
```json
"chat": { "id": -1001234567890, "title": "MTC — заявки", "type": "supergroup" }
```
5. **Скопируйте `id`** (отрицательное число с минусом, например `-1001234567890`)

⚠️ Если JSON пустой `{"ok":true,"result":[]}` — напишите в группу ещё раз и обновите страницу.

## Шаг 3 — Добавьте секреты в Supabase

Supabase Dashboard → **Project Settings** (шестерёнка снизу слева) → **Edge Functions** → раздел **Secrets** → **+ Add new secret**.

Добавьте **три** секрета:

| Name | Value |
|---|---|
| `TELEGRAM_BOT_TOKEN` | ваш новый токен от BotFather |
| `TELEGRAM_CHAT_ID` | chat_id группы (отрицательное число) |
| `TELEGRAM_WEBHOOK_SECRET` | любая случайная строка длиной 32+ символов (например: `mtc_wh_8f3a9b2e7c1d4f6a0e8b9c2d3e4f5a6b`) |

Запишите `TELEGRAM_WEBHOOK_SECRET` себе — он понадобится в Шаге 5.

## Шаг 4 — Задеплойте Edge Functions

Dashboard → **Edge Functions** (левое меню) → **+ Deploy a new function**.

### Функция 1: `notify-telegram`
1. Name: `notify-telegram` (точно так)
2. Откройте у себя файл [`supabase/functions/notify-telegram/index.ts`](supabase/functions/notify-telegram/index.ts) → скопируйте всё содержимое → вставьте в редактор кода
3. ✅ **Verify JWT** — оставьте включённым (триггер из SQL пошлёт с anon ключом, JWT валиден)
4. **Deploy function**

### Функция 2: `telegram-webhook`
1. Снова **+ Deploy a new function**
2. Name: `telegram-webhook`
3. Откройте [`supabase/functions/telegram-webhook/index.ts`](supabase/functions/telegram-webhook/index.ts) → копируйте → вставьте
4. ❌ **Verify JWT** — **ВЫКЛЮЧИТЕ** (Telegram не знает JWT, авторизуем через секретный заголовок)
5. **Deploy function**

После деплоя у каждой будет URL вида `https://ddehpawakrgzuqrqjjuu.supabase.co/functions/v1/notify-telegram` — Supabase его покажет.

## Шаг 5 — Зарегистрируйте Telegram webhook

Чтобы кнопки в Telegram работали (✋ Беру / ✅ Закрыть / 🚫 Спам), нужно сказать Telegram куда слать события. Откройте в **браузере** один URL (подставьте свой токен и секрет):

```
https://api.telegram.org/bot<НОВЫЙ_ТОКЕН>/setWebhook?url=https://ddehpawakrgzuqrqjjuu.supabase.co/functions/v1/telegram-webhook&secret_token=<ВАШ_TELEGRAM_WEBHOOK_SECRET>&allowed_updates=["callback_query"]
```

✅ Ответ должен быть: `{"ok":true,"result":true,"description":"Webhook was set"}`

Проверить статус: открыть `https://api.telegram.org/bot<ТОКЕН>/getWebhookInfo`

## Шаг 6 — Включите Vercel Analytics

1. Откройте [vercel.com/dashboard](https://vercel.com/dashboard) → проект `mtcuz`
2. Вкладка **Analytics** наверху
3. **Enable** (бесплатный тариф, anonymous, GDPR-OK)
4. Через 5-10 минут на сайт начнут приходить тестовые запросы — статистика появится в Vercel Dashboard

## Шаг 7 — Тестовая заявка end-to-end

1. Откройте https://mtcuz.vercel.app/#/contacts
2. Заполните форму (имя, телефон, любое сообщение) → Отправить
3. Подождите 5 секунд (это анти-бот защита)
4. ✅ Должно появиться зелёное «Заявка отправлена»

В течение нескольких секунд:
5. **В группе операторов в Telegram** должно прилететь сообщение с кнопками
6. **В админке** → раздел **Заявки** → заявка появится со статусом «Новая»

### Тест кнопок Telegram
7. В группе нажмите **✋ Беру в работу**
8. ✅ Кнопка должна замениться на `⏳ В работе — @ваш_username`
9. В админке статус заявки обновится на «В работе»

---

## Что НЕ работает — диагностика

### Форма выдаёт ошибку при отправке
- Откройте F12 → Console → пришлите мне текст ошибки

### Заявка появилась в админке, но Telegram молчит
1. Dashboard → Edge Functions → `notify-telegram` → вкладка **Logs**
2. Посмотрите последний запуск — что говорит
3. Часто это означает:
   - Неверный `TELEGRAM_BOT_TOKEN` (опечатка)
   - Неверный `TELEGRAM_CHAT_ID` (без минуса или с пробелом)
   - Бот не добавлен в группу
   - Бот добавлен но не имеет права писать (Group privacy mode — отключите в BotFather: `/setprivacy` → Disable)

### Кнопка в Telegram нажимается, но статус не меняется
1. Edge Functions → `telegram-webhook` → Logs
2. Возможно неверный `TELEGRAM_WEBHOOK_SECRET` — должен совпадать с тем, что в `setWebhook` URL

### Получение getUpdates даёт пусто, но я писал в группу
Сначала зарегистрируйте webhook (Шаг 5) — getUpdates перестанет работать (это нормально, Telegram пересылает события на webhook). Чтобы вернуть getUpdates, временно удалите webhook: `https://api.telegram.org/bot<TOKEN>/deleteWebhook`

---

## Что нового в админке

- **Заявки** в сайдбаре — список всех лидов, фильтры по статусу (Активные / Новые / В работе / Закрытые / Спам / Все), поиск, детальная карточка с управлением статусом, заметками и историей изменений.
- **Аналитика** в сайдбаре — графики просмотров и заявок за 7/30/90 дней, топ просматриваемых объектов и новостей.
- **Backup** на главной — кнопка `Скачать backup`, выгружает весь контент в один JSON. Делать раз в месяц.
- **Черновики** в редакторах новостей/объектов/госзаказов — переключатель «Опубликовано / Черновик» рядом с кнопкой Сохранить.
- **SEO** — отдельная вкладка в редакторах для заголовка и описания в Google + картинки для Telegram/WhatsApp шеринга.

## Что я ещё могу доделать в следующем заходе

- History viewer (UI для просмотра журнала аудита по любой записи)
- Применение `is_published = false` фильтра на публичном сайте (сейчас черновики тоже показываются — поправлю в data-loader-ах)
- Применение SEO-полей на публичных страницах (генерация `<title>`, `og:image` мета-тегов)
- Удаление seed-данных из кода (раз контент уже в БД, fallback не нужен)
