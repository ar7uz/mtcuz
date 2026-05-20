# Настройка Supabase для MTC

Эта инструкция — пошаговая. Сделайте по порядку, после этого админка заработает.

---

## 1. Запуск SQL-миграции

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard) → ваш проект.
2. В левом меню → **SQL Editor** → **New query**.
3. Откройте файл [`supabase-setup.sql`](supabase-setup.sql) в этом репозитории, скопируйте всё содержимое в SQL Editor.
4. Нажмите **Run** (Ctrl/Cmd+Enter).
5. В нижней части должно появиться `Success. No rows returned.`

Этот скрипт безопасно перезапускать — он идемпотентный.

**Что он делает:**
- Создаёт таблицы `projects`, `gov_cases`, `news`, связанные таблицы под планировки/спецификации/прогресс
- Создаёт `admins` (whitelist администраторов) и `audit_log` (журнал изменений)
- Включает **RLS** на всех таблицах
- Создаёт политики: публичное чтение, запись только админам
- Создаёт Storage bucket `content-images` с лимитом 5 МБ и проверкой MIME-типов
- Триггеры аудита на все контентные таблицы

---

## 2. Настройки аутентификации

**Dashboard → Authentication → Providers → Email:**
- ✅ Enable Email provider — включено
- ❌ **Confirm email** — **выключить** (упрощает первый запуск; можно включить позже)
- ❌ **Enable Email Signups** — **выключить**. Это критично: иначе любой посторонний может зарегистрироваться. Админов мы добавляем вручную.
- ✅ **Secure password change** — включить (требует свежий вход для смены пароля)

**Dashboard → Authentication → Policies:**
- **Minimum password length** — поставить **12**
- **Password requirements** — включить `Lowercase, Uppercase, Digits, Symbols`
- **Leaked password protection** — **включить** (проверка пароля по базе HaveIBeenPwned)

**Dashboard → Authentication → Multi-Factor Authentication:**
- ✅ Включить **TOTP** (Time-based One-Time Password)
- После этого все админы при первом входе должны привязать Google Authenticator / Authy / 1Password

**Dashboard → Authentication → URL Configuration:**
- **Site URL**: `https://mtcuz.vercel.app`
- **Redirect URLs**: добавить `https://mtcuz.vercel.app/**` и `http://localhost:*/**` (для локальной разработки)

**Dashboard → Authentication → Rate Limits:**
- Оставить значения по умолчанию (Supabase сам режет brute-force)

**Dashboard → Authentication → Attack Protection:**
- Включить **CAPTCHA** (hCaptcha) — потребует получить ключи на hcaptcha.com и вставить sitekey/secret. **Рекомендуется**, но можно отложить и сделать позже.

---

## 3. Создание первого админа

1. **Dashboard → Authentication → Users → Add user → Create new user.**
2. Введите email и сильный пароль (минимум 12 символов, рекомендую сгенерировать в менеджере паролей).
3. Уберите галочку «Auto Confirm User» если хотите получить письмо для подтверждения, или оставьте — тогда юзер сразу активен.
4. После создания вернитесь в **SQL Editor** и выполните (подставьте свой email):

```sql
insert into public.admins(user_id, email)
select id, email from auth.users where email = 'ваш@email.com';
```

Должно вернуть `INSERT 0 1`. Это и есть выдача прав админа.

Чтобы добавить ещё админов — повторите шаги 1, 2, 4 с новым email.

---

## 4. Конфигурация фронтенда

URL и anon-ключ уже прописаны в [src/config.jsx](src/config.jsx). Если они поменяются — обновите там.

---

## 5. Проверка

1. Откройте `https://mtcuz.vercel.app/#/admin`
2. Залогиньтесь email/паролем
3. Если включён MFA — система предложит привязать аутентификатор при первом входе
4. После входа должна открыться панель администратора

---

## 6. Безопасность — что под капотом

| Угроза | Защита |
|---|---|
| Любой посетитель пишет в БД через anon-ключ | RLS-политики: SELECT всем, INSERT/UPDATE/DELETE только `is_admin()` |
| Регистрация постороннего как админа | Email signups выключены + whitelist в `public.admins` |
| Brute-force пароля | Rate limit Supabase + hCaptcha + сильный пароль + MFA |
| Утечка пароля админа | MFA — без второго фактора войти нельзя |
| XSS через текст новости | React автоэкранирует. Нигде нет `dangerouslySetInnerHTML` |
| Загрузка `.exe` под видом картинки | Storage bucket режет по MIME (jpeg/png/webp) и размеру (5 МБ) |
| Path traversal через имя файла | Имена файлов = UUID, расширение по MIME, ничего от пользователя |
| Clickjacking | `X-Frame-Options: DENY` + `frame-ancestors 'none'` в CSP |
| Загрузка чужих скриптов | CSP с белым списком (Supabase, unpkg, tailwindcss) |
| MITM | HSTS на 2 года + HTTPS Vercel |
| Утечка `service_role` ключа | Не используем нигде в коде; не передаём в чате |
| Без журнала изменений | Триггер `log_audit()` пишет в `audit_log` каждое INSERT/UPDATE/DELETE |
| Слежка через Referer | `Referrer-Policy: strict-origin-when-cross-origin` |

---

## 7. Регулярные проверки (раз в месяц)

- **Authentication → Logs** — просмотр неудачных входов, подозрительной активности
- **SQL Editor**: `select * from public.audit_log order by occurred_at desc limit 100;` — кто что менял
- **Database → Backups** — убедиться что бэкапы идут (есть на любом тарифе)
- Обновить anon-ключ если он попал в публичный лог (Settings → API → roll keys)

---

## 8. Если service_role ключ всё же утёк

1. **Settings → API → Roll service_role key** — немедленно
2. Просмотрите `audit_log` за весь период с момента утечки
3. Если есть подозрения — пересоздайте проект и восстановите из бэкапа
