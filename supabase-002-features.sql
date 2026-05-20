-- ============================================================================
-- MTC migration 002 — Leads, Events, Drafts, SEO fields, Telegram trigger
-- Запустить в Supabase SQL Editor после первой миграции.
-- Идемпотентно.
-- ============================================================================

-- pg_net для вызова Edge Function из триггера (включён в Supabase по умолчанию)
create extension if not exists pg_net;

-- 1. App config (для хранения URL/ключей, доступ только триггерам) ----
create table if not exists public.app_config (
  key   text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);
alter table public.app_config enable row level security;
-- Никаких политик — нет доступа никому, кроме security definer функций

-- Записываем конфиг для триггера Telegram
insert into public.app_config(key, value) values
  ('supabase_url', 'https://ddehpawakrgzuqrqjjuu.supabase.co'),
  ('anon_key',     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZWhwYXdha3JnenVxcnFqanV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMDU1MzUsImV4cCI6MjA5NDc4MTUzNX0.6NG4m1SyXLIR8dn8DwvDFfvikXCInknYexlUxPI4wgU')
on conflict (key) do update set value = excluded.value, updated_at = now();

-- 2. LEADS (заявки с формы) -------------------------------------------
create table if not exists public.leads (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  -- данные с формы
  name                text not null check (char_length(name) between 2 and 200),
  phone               text not null check (char_length(phone) between 5 and 50),
  email               text check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  message             text check (message is null or char_length(message) <= 5000),

  -- контекст
  source_page         text,
  source_referrer     text,
  user_agent          text,
  ip_hash             text,

  -- workflow
  status              text not null default 'new'
                          check (status in ('new','in_progress','closed','spam')),
  assigned_to         uuid references auth.users(id),
  notes               text,

  -- telegram references
  telegram_message_id bigint,
  telegram_chat_id    bigint
);
create index if not exists leads_status_time_idx on public.leads(status, created_at desc);
create index if not exists leads_created_idx     on public.leads(created_at desc);

-- 3. EVENTS (аналитика) -----------------------------------------------
create table if not exists public.events (
  id          bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  event_name  text not null check (char_length(event_name) <= 60),
  page_path   text check (page_path is null or char_length(page_path) <= 500),
  ref_table   text check (ref_table is null or char_length(ref_table) <= 60),
  ref_id      text check (ref_id is null or char_length(ref_id) <= 200),
  session_id  text check (session_id is null or char_length(session_id) <= 60),
  meta        jsonb
);
create index if not exists events_time_idx on public.events(occurred_at desc);
create index if not exists events_name_idx on public.events(event_name, occurred_at desc);
create index if not exists events_ref_idx  on public.events(ref_table, ref_id);

-- 4. Drafts + SEO поля на контентных таблицах -------------------------
alter table public.projects
  add column if not exists is_published       boolean not null default true,
  add column if not exists seo_title_ru       text,
  add column if not exists seo_title_uz       text,
  add column if not exists seo_title_en       text,
  add column if not exists seo_description_ru text,
  add column if not exists seo_description_uz text,
  add column if not exists seo_description_en text,
  add column if not exists seo_og_image       text;

alter table public.news
  add column if not exists is_published       boolean not null default true,
  add column if not exists seo_title_ru       text,
  add column if not exists seo_title_uz       text,
  add column if not exists seo_title_en       text,
  add column if not exists seo_description_ru text,
  add column if not exists seo_description_uz text,
  add column if not exists seo_description_en text,
  add column if not exists seo_og_image       text;

alter table public.gov_cases
  add column if not exists is_published       boolean not null default true,
  add column if not exists seo_title_ru       text,
  add column if not exists seo_title_uz       text,
  add column if not exists seo_title_en       text,
  add column if not exists seo_description_ru text,
  add column if not exists seo_description_uz text,
  add column if not exists seo_description_en text,
  add column if not exists seo_og_image       text;

-- 5. RLS + триггеры на leads/events -----------------------------------
alter table public.leads  enable row level security;
alter table public.events enable row level security;

do $$
declare p record;
begin
  for p in
    select policyname, tablename from pg_policies
    where schemaname='public' and tablename in ('leads','events')
  loop
    execute format('drop policy if exists %I on public.%I;', p.policyname, p.tablename);
  end loop;
end $$;

-- Anon может INSERT в leads (это и есть форма)
create policy leads_anon_insert on public.leads for insert with check (true);
-- Анонимный SELECT/UPDATE/DELETE запрещён, админу — всё
create policy leads_admin_all   on public.leads for all using (public.is_admin()) with check (public.is_admin());

-- Anon может INSERT в events (трекинг с публичного сайта)
create policy events_anon_insert on public.events for insert with check (true);
create policy events_admin_read  on public.events for select using (public.is_admin());

-- Updated_at автообновление
do $$
declare t text;
begin
  for t in select unnest(array['leads']) loop
    execute format('drop trigger if exists trg_touch_%I on public.%I;', t, t);
    execute format('create trigger trg_touch_%I before update on public.%I
                    for each row execute function public.touch_updated_at();', t, t);
  end loop;
end $$;

-- Audit log для leads тоже
drop trigger if exists trg_audit_leads on public.leads;
create trigger trg_audit_leads after insert or update or delete on public.leads
  for each row execute function public.log_audit();

-- 6. Триггер: при INSERT в leads — вызов Edge Function notify-telegram
create or replace function public.notify_telegram_on_lead()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_url  text;
  v_key  text;
  v_fn_url text;
begin
  select value into v_url from public.app_config where key = 'supabase_url';
  select value into v_key from public.app_config where key = 'anon_key';
  if v_url is null or v_key is null then
    raise notice 'app_config missing supabase_url or anon_key';
    return NEW;
  end if;

  v_fn_url := v_url || '/functions/v1/notify-telegram';

  -- pg_net.http_post — асинхронный, не блокирует INSERT.
  -- Если Telegram упадёт, форма всё равно отправится корректно.
  perform net.http_post(
    url     := v_fn_url,
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || v_key
    ),
    body    := jsonb_build_object('lead_id', NEW.id::text)
  );

  return NEW;
end $$;

drop trigger if exists trg_notify_telegram on public.leads;
create trigger trg_notify_telegram
  after insert on public.leads
  for each row execute function public.notify_telegram_on_lead();

-- 7. Helper для админки: статистика заявок ----------------------------
create or replace function public.leads_stats()
returns table (
  total            bigint,
  new_count        bigint,
  in_progress      bigint,
  closed           bigint,
  spam             bigint,
  today            bigint,
  last_7_days      bigint,
  last_30_days     bigint
)
language sql
security definer
set search_path = public
stable as $$
  select
    count(*),
    count(*) filter (where status = 'new'),
    count(*) filter (where status = 'in_progress'),
    count(*) filter (where status = 'closed'),
    count(*) filter (where status = 'spam'),
    count(*) filter (where created_at >= now()::date),
    count(*) filter (where created_at >= now() - interval '7 days'),
    count(*) filter (where created_at >= now() - interval '30 days')
  from public.leads;
$$;
revoke all on function public.leads_stats() from public;
grant execute on function public.leads_stats() to authenticated;

-- 8. Helper: события по дням за период --------------------------------
create or replace function public.events_daily(
  p_event_name text default 'page_view',
  p_days       int default 30
) returns table (day date, n bigint)
language sql
security definer
set search_path = public
stable as $$
  select date_trunc('day', occurred_at)::date as day, count(*)::bigint as n
  from public.events
  where event_name = p_event_name
    and occurred_at >= now() - (p_days || ' days')::interval
  group by 1
  order by 1;
$$;
revoke all on function public.events_daily(text,int) from public;
grant execute on function public.events_daily(text,int) to authenticated;

-- 9. Helper: топ просматриваемых объектов/новостей --------------------
create or replace function public.top_viewed(
  p_table text,
  p_days  int default 30,
  p_limit int default 10
) returns table (ref_id text, n bigint)
language sql
security definer
set search_path = public
stable as $$
  select ref_id, count(*)::bigint as n
  from public.events
  where event_name = 'detail_view'
    and ref_table = p_table
    and occurred_at >= now() - (p_days || ' days')::interval
    and ref_id is not null
  group by ref_id
  order by n desc
  limit p_limit;
$$;
revoke all on function public.top_viewed(text,int,int) from public;
grant execute on function public.top_viewed(text,int,int) to authenticated;

-- ============================================================================
-- ГОТОВО. Следующие шаги (вне SQL):
-- 1. Установить Supabase Secrets для Edge Functions:
--      TELEGRAM_BOT_TOKEN          = новый токен из BotFather
--      TELEGRAM_CHAT_ID            = id группы операторов (отрицательное число)
--      TELEGRAM_WEBHOOK_SECRET     = любая случайная строка (для верификации callbacks)
-- 2. Задеплоить Edge Functions notify-telegram и telegram-webhook
-- 3. Зарегистрировать webhook у Telegram (один curl-запрос — есть в инструкции)
-- ============================================================================
