-- ============================================================================
-- MTC — Supabase initial migration
-- Запустить в Supabase Dashboard → SQL Editor → New query → Paste → Run
-- Идемпотентно: повторный запуск безопасен (использует IF NOT EXISTS / OR REPLACE).
-- ============================================================================

-- 1. Расширения -----------------------------------------------------------
create extension if not exists pgcrypto;        -- gen_random_uuid()

-- 2. Whitelist админов -----------------------------------------------------
-- Добавление сюда = выдача прав на запись контента.
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  note       text,
  created_at timestamptz not null default now()
);

-- Helper: проверка что текущий пользователь — админ.
-- SECURITY DEFINER чтобы обходить RLS на самой admins (иначе бесконечная рекурсия).
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

-- 3. PROJECTS (активные стройки) -----------------------------------------
create table if not exists public.projects (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  sort_order      int  not null default 0,
  status          text not null default 'building',
  status_class    text not null default 'bg-accent-blue text-white',
  price_from_num  int  not null default 0,
  lat             numeric, lng numeric,
  main_image      text,
  gallery         text[] not null default '{}'::text[],

  -- multilingual
  name_ru text not null, name_uz text, name_en text,
  full_name_ru text, full_name_uz text, full_name_en text,
  tier_ru text, tier_uz text, tier_en text,
  status_label_ru text, status_label_uz text, status_label_en text,
  location_ru text, location_uz text, location_en text,
  district_ru text, district_uz text, district_en text,
  delivery_ru text, delivery_uz text, delivery_en text,
  floors_ru text, floors_uz text, floors_en text,
  apartments_from_ru text, apartments_from_uz text, apartments_from_en text,
  price_from_ru text, price_from_uz text, price_from_en text,
  price_per_meter_ru text, price_per_meter_uz text, price_per_meter_en text,
  description_ru text, description_uz text, description_en text,

  features_ru        text[] not null default '{}'::text[],
  features_uz        text[] not null default '{}'::text[],
  features_en        text[] not null default '{}'::text[],
  infrastructure_ru  text[] not null default '{}'::text[],
  infrastructure_uz  text[] not null default '{}'::text[],
  infrastructure_en  text[] not null default '{}'::text[],

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_floor_plans (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  sort_order  int  not null default 0,
  image       text,
  rooms_ru text, rooms_uz text, rooms_en text,
  area_ru  text, area_uz  text, area_en  text,
  price_ru text, price_uz text, price_en text
);
create index if not exists project_floor_plans_project_idx on public.project_floor_plans(project_id);

create table if not exists public.project_construction_log (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  sort_order  int  not null default 0,
  image       text,
  month_ru text,  month_uz text,  month_en text,
  status_ru text, status_uz text, status_en text
);
create index if not exists project_construction_log_project_idx on public.project_construction_log(project_id);

-- 4. GOV CASES (госзаказ / завершённые) ----------------------------------
create table if not exists public.gov_cases (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  sort_order  int  not null default 0,
  image       text,
  gallery     text[] not null default '{}'::text[],

  name_ru text not null, name_uz text, name_en text,
  full_name_ru text, full_name_uz text, full_name_en text,
  customer_ru text, customer_uz text, customer_en text,
  year_ru text,    year_uz text,    year_en text,
  budget_ru text,  budget_uz text,  budget_en text,
  area_ru text,    area_uz text,    area_en text,
  capacity_ru text, capacity_uz text, capacity_en text,
  deadline_ru text, deadline_uz text, deadline_en text,
  description_ru text, description_uz text, description_en text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gov_specs (
  id           uuid primary key default gen_random_uuid(),
  gov_case_id  uuid not null references public.gov_cases(id) on delete cascade,
  sort_order   int  not null default 0,
  label_ru text, label_uz text, label_en text,
  value_ru text, value_uz text, value_en text
);
create index if not exists gov_specs_case_idx on public.gov_specs(gov_case_id);

-- 5. NEWS ----------------------------------------------------------------
create table if not exists public.news (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  iso_date    date not null,
  sort_order  int  not null default 0,
  image       text,

  date_label_ru text, date_label_uz text, date_label_en text,
  category_ru text,  category_uz text,  category_en text,
  title_ru text not null, title_uz text, title_en text,
  excerpt_ru text, excerpt_uz text, excerpt_en text,
  body_ru text[] not null default '{}'::text[],
  body_uz text[] not null default '{}'::text[],
  body_en text[] not null default '{}'::text[],

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. AUDIT LOG -----------------------------------------------------------
create table if not exists public.audit_log (
  id           bigint generated always as identity primary key,
  occurred_at  timestamptz not null default now(),
  user_id      uuid,
  user_email   text,
  action       text not null,
  table_name   text not null,
  row_id       text,
  diff         jsonb
);
create index if not exists audit_log_table_time_idx on public.audit_log(table_name, occurred_at desc);

-- Универсальный триггер аудита
create or replace function public.log_audit()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  uid uuid := auth.uid();
  uemail text;
  d jsonb;
begin
  begin
    select email into uemail from auth.users where id = uid;
  exception when others then
    uemail := null;
  end;

  if TG_OP = 'DELETE' then
    d := to_jsonb(OLD);
  elsif TG_OP = 'INSERT' then
    d := to_jsonb(NEW);
  else
    d := jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW));
  end if;

  insert into public.audit_log(user_id, user_email, action, table_name, row_id, diff)
  values (
    uid, uemail, TG_OP, TG_TABLE_NAME,
    coalesce((case when TG_OP='DELETE' then OLD.id else NEW.id end)::text, null),
    d
  );
  return coalesce(NEW, OLD);
end;
$$;

-- updated_at автоматический апдейт
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin NEW.updated_at := now(); return NEW; end;
$$;

-- Прикрепляем триггеры
do $$
declare t text;
begin
  for t in select unnest(array['projects','gov_cases','news']) loop
    execute format('drop trigger if exists trg_touch_%I on public.%I;', t, t);
    execute format('create trigger trg_touch_%I before update on public.%I
                    for each row execute function public.touch_updated_at();', t, t);
  end loop;

  for t in select unnest(array[
    'projects','project_floor_plans','project_construction_log',
    'gov_cases','gov_specs','news'
  ]) loop
    execute format('drop trigger if exists trg_audit_%I on public.%I;', t, t);
    execute format('create trigger trg_audit_%I after insert or update or delete
                    on public.%I for each row execute function public.log_audit();', t, t);
  end loop;
end $$;

-- 7. RLS включаем на всех таблицах --------------------------------------
alter table public.admins                    enable row level security;
alter table public.projects                  enable row level security;
alter table public.project_floor_plans       enable row level security;
alter table public.project_construction_log  enable row level security;
alter table public.gov_cases                 enable row level security;
alter table public.gov_specs                 enable row level security;
alter table public.news                      enable row level security;
alter table public.audit_log                 enable row level security;

-- Дропаем старые политики (для идемпотентности) и создаём заново
do $$
declare p record;
begin
  for p in
    select policyname, tablename from pg_policies
    where schemaname='public' and tablename in (
      'admins','projects','project_floor_plans','project_construction_log',
      'gov_cases','gov_specs','news','audit_log'
    )
  loop
    execute format('drop policy if exists %I on public.%I;', p.policyname, p.tablename);
  end loop;
end $$;

-- admins: только админы могут читать, никто (через anon/auth) не пишет
create policy admins_select on public.admins for select using (public.is_admin());

-- Контентные таблицы: SELECT всем, write только админам
create policy projects_select on public.projects                 for select using (true);
create policy projects_write  on public.projects                 for all    using (public.is_admin()) with check (public.is_admin());

create policy fp_select on public.project_floor_plans            for select using (true);
create policy fp_write  on public.project_floor_plans            for all    using (public.is_admin()) with check (public.is_admin());

create policy cl_select on public.project_construction_log       for select using (true);
create policy cl_write  on public.project_construction_log       for all    using (public.is_admin()) with check (public.is_admin());

create policy gov_select on public.gov_cases                     for select using (true);
create policy gov_write  on public.gov_cases                     for all    using (public.is_admin()) with check (public.is_admin());

create policy gs_select on public.gov_specs                      for select using (true);
create policy gs_write  on public.gov_specs                      for all    using (public.is_admin()) with check (public.is_admin());

create policy news_select on public.news                         for select using (true);
create policy news_write  on public.news                         for all    using (public.is_admin()) with check (public.is_admin());

-- Audit log: только админы могут читать; писать только через trigger (security definer)
create policy audit_select on public.audit_log for select using (public.is_admin());

-- 8. STORAGE -----------------------------------------------------------
-- Bucket для контентных изображений (фото объектов, новостей, планировок).
-- public = true → можно отдавать публично по прямому URL.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'content-images',
  'content-images',
  true,
  5 * 1024 * 1024,  -- 5 МБ
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do update
set public             = excluded.public,
    file_size_limit    = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Storage RLS политики (на storage.objects)
do $$
declare p record;
begin
  for p in
    select policyname from pg_policies
    where schemaname='storage' and tablename='objects'
      and policyname like 'mtc_%'
  loop
    execute format('drop policy if exists %I on storage.objects;', p.policyname);
  end loop;
end $$;

create policy mtc_storage_read on storage.objects
  for select using (bucket_id = 'content-images');

create policy mtc_storage_insert on storage.objects
  for insert with check (bucket_id = 'content-images' and public.is_admin());

create policy mtc_storage_update on storage.objects
  for update using (bucket_id = 'content-images' and public.is_admin());

create policy mtc_storage_delete on storage.objects
  for delete using (bucket_id = 'content-images' and public.is_admin());

-- ============================================================================
-- ГОТОВО. Дальше:
--  1. В Supabase Dashboard → Authentication → Settings выключить "Enable email signups"
--     (опционально оставить, если хотите регистрировать админов через UI)
--  2. Создать первого админа: Authentication → Users → "Add user" (с email/password)
--  3. Запустить в SQL Editor (подставьте свой email):
--       insert into public.admins(user_id, email)
--       select id, email from auth.users where email = 'admin@example.com';
--  4. Включить MFA: Authentication → Providers → enable TOTP (Multi-Factor Authentication)
--  5. Authentication → URL Configuration → Site URL: https://mtcuz.vercel.app
-- ============================================================================
