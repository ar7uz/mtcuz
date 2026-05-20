-- ============================================================================
-- MTC — Сид существующего контента из кода в БД
-- Запустить ОДИН РАЗ в SQL Editor после первоначальной миграции.
-- Идемпотентно: повторный запуск не сломает уже отредактированные записи.
--   - Родительская строка вставится только если её ещё нет (ON CONFLICT slug)
--   - Дочерние строки (планировки, прогресс, специф.) добавятся только
--     если у объекта их пока нет (чтобы не затирать вашу ручную правку)
-- ============================================================================

-- ============ PROJECTS ===================================================

-- 1. ЖК «Бочка»
do $$
declare v_id uuid;
begin
  insert into public.projects (
    slug, sort_order, status, status_class, price_from_num,
    lat, lng, main_image, gallery,
    name_ru, full_name_ru, tier_ru, status_label_ru,
    location_ru, district_ru, delivery_ru, floors_ru,
    apartments_from_ru, price_from_ru, price_per_meter_ru, description_ru,
    features_ru, infrastructure_ru
  ) values (
    'bochka', 0, 'building', 'bg-accent-blue text-white', 0,
    41.55, 70.13, 'images/project-01-premium.jpg',
    array['images/project-01-premium.jpg','images/hero-light.jpg','images/hero-dark.jpg'],
    'Бочка', 'ЖК «Бочка»', 'Жилой комплекс', 'В работе',
    'Ташкентская область', 'Бостанлыкский район, посёлок Бештут', 'В работе', '6 этажей',
    '3 блока', 'Генподряд', 'В стадии строительства',
    'Многоквартирный жилой комплекс из трёх шестиэтажных блоков в горной части Бостанлыкского района. MTC выполняет полный цикл генерального подряда — от земляных работ до сдачи объекта с инженерией.',
    array[
      'Монолитно-каркасная конструкция',
      '3 жилых блока по 6 этажей',
      'Наружные и внутренние отделочные работы',
      'Установка инженерных систем',
      'Благоустройство территории',
      'Соответствие стандартам ISO 9001:2015'
    ],
    array[
      'Горный массив Чимган в 15 минутах',
      'Курортная зона Бештут',
      'Транспортный узел Газалкент',
      'Развитая туристическая инфраструктура'
    ]
  ) on conflict (slug) do nothing;

  select id into v_id from public.projects where slug = 'bochka';

  if not exists(select 1 from public.project_floor_plans where project_id = v_id) then
    insert into public.project_floor_plans (project_id, sort_order, rooms_ru, area_ru, price_ru) values
      (v_id, 0, 'Блок А', '6 этажей', 'Генподряд'),
      (v_id, 1, 'Блок Б', '6 этажей', 'Генподряд'),
      (v_id, 2, 'Блок В', '6 этажей', 'Генподряд');
  end if;

  if not exists(select 1 from public.project_construction_log where project_id = v_id) then
    insert into public.project_construction_log (project_id, sort_order, month_ru, status_ru, image) values
      (v_id, 0, 'Текущий период',  'Фасадные и отделочные работы',  'images/project-01-premium.jpg'),
      (v_id, 1, 'Предыдущий этап', 'Монтаж инженерных систем',       'images/hero-dark.jpg'),
      (v_id, 2, 'Ранее',           'Возведение монолитного каркаса', 'images/project-01-premium.jpg');
  end if;
end $$;

-- 2. ЖК «Houson Hills»
do $$
declare v_id uuid;
begin
  insert into public.projects (
    slug, sort_order, status, status_class, price_from_num,
    lat, lng, main_image, gallery,
    name_ru, full_name_ru, tier_ru, status_label_ru,
    location_ru, district_ru, delivery_ru, floors_ru,
    apartments_from_ru, price_from_ru, price_per_meter_ru, description_ru,
    features_ru, infrastructure_ru
  ) values (
    'houson-hills', 1, 'building', 'bg-accent-blue text-white', 0,
    41.60, 70.04, 'images/project-02-business.jpg',
    array['images/project-02-business.jpg','images/hero-light.jpg'],
    'Houson Hills', 'ЖК «Houson Hills»', 'Жилой комплекс', 'В работе',
    'Ташкентская область', 'Бостанлыкский район, посёлок Чорбог', 'В работе', '9 этажей',
    '2 блока', 'Генподряд', 'В стадии строительства',
    'Премиальный жилой комплекс на берегу Чарвакского водохранилища. Две девятиэтажные башни с видами на горы и воду. MTC реализует проект в роли генерального подрядчика полного цикла.',
    array[
      '2 жилых блока по 9 этажей',
      'Монолитно-кирпичная конструкция',
      'Панорамное остекление',
      'Инженерные системы под ключ',
      'Наружные отделочные работы',
      'Озеленение и благоустройство'
    ],
    array[
      'Чарвакское водохранилище в шаговой доступности',
      'Горнолыжный курорт Амирсой',
      'Развитая туристическая зона Чорбог',
      'Подъездные дороги республиканского значения'
    ]
  ) on conflict (slug) do nothing;

  select id into v_id from public.projects where slug = 'houson-hills';

  if not exists(select 1 from public.project_floor_plans where project_id = v_id) then
    insert into public.project_floor_plans (project_id, sort_order, rooms_ru, area_ru, price_ru) values
      (v_id, 0, 'Блок 1', '9 этажей', 'Генподряд'),
      (v_id, 1, 'Блок 2', '9 этажей', 'Генподряд');
  end if;

  if not exists(select 1 from public.project_construction_log where project_id = v_id) then
    insert into public.project_construction_log (project_id, sort_order, month_ru, status_ru, image) values
      (v_id, 0, 'Текущий период',  'Внутренние отделочные работы', 'images/project-02-business.jpg'),
      (v_id, 1, 'Предыдущий этап', 'Кровельные работы',             'images/project-02-business.jpg'),
      (v_id, 2, 'Ранее',           'Возведение каркаса 9 этажа',   'images/project-02-business.jpg');
  end if;
end $$;

-- 3. ЖК «Юсуфхона»
do $$
declare v_id uuid;
begin
  insert into public.projects (
    slug, sort_order, status, status_class, price_from_num,
    lat, lng, main_image, gallery,
    name_ru, full_name_ru, tier_ru, status_label_ru,
    location_ru, district_ru, delivery_ru, floors_ru,
    apartments_from_ru, price_from_ru, price_per_meter_ru, description_ru,
    features_ru, infrastructure_ru
  ) values (
    'yusufkhona', 2, 'building', 'bg-accent-blue text-white', 0,
    41.62, 70.07, 'images/project-03-comfort.jpg',
    array['images/project-03-comfort.jpg'],
    'Юсуфхона', 'ЖК «Юсуфхона»', 'Гостинично-коттеджный комплекс', 'В работе',
    'Ташкентская область', 'Бостанлыкский район, посёлок Новбод', 'В работе', 'Гостиница + коттеджи',
    'Комплекс', 'Генподряд', 'В стадии строительства',
    'Гостинично-коттеджный комплекс «Юсуфхона» в курортной зоне Новбод. В составе — гостиничный корпус и группа отдельно стоящих коттеджей премиум-сегмента. MTC выступает генеральным подрядчиком всего объекта.',
    array[
      'Гостиничный корпус',
      'Группа коттеджей',
      'Авторская архитектура',
      'Ландшафтные работы',
      'Инженерные коммуникации',
      'Полный цикл строительства'
    ],
    array[
      'Курортная зона Новбод',
      'Чарвакское водохранилище',
      'Туристические маршруты Чимгана',
      'Газалкентский транспортный узел'
    ]
  ) on conflict (slug) do nothing;

  select id into v_id from public.projects where slug = 'yusufkhona';

  if not exists(select 1 from public.project_floor_plans where project_id = v_id) then
    insert into public.project_floor_plans (project_id, sort_order, rooms_ru, area_ru, price_ru) values
      (v_id, 0, 'Гостиница', 'Корпус',       'Генподряд'),
      (v_id, 1, 'Коттеджи',  'Группа домов', 'Генподряд');
  end if;
end $$;

-- ============ GOV CASES ==================================================

-- 1. Академия МВД
do $$
declare v_id uuid;
begin
  insert into public.gov_cases (
    slug, sort_order, image, gallery,
    name_ru, full_name_ru, customer_ru, year_ru, budget_ru,
    area_ru, capacity_ru, deadline_ru, description_ru
  ) values (
    'mvd-academy', 0,
    'images/gov-02-school.jpg',
    array['images/gov-02-school.jpg'],
    'Академия МВД', 'Академия МВД Республики Узбекистан',
    'Министерство внутренних дел РУз', 'Сдан', '4 500 000 $',
    'Учебные корпусы', '—', '2 года',
    'Капитальный ремонт учебных корпусов Академии МВД на улице Мингбулок в Ташкенте. Самый крупный завершённый объект MTC по объёму контракта. Работы включали полный комплекс ремонтно-восстановительных, отделочных и инженерных работ.'
  ) on conflict (slug) do nothing;

  select id into v_id from public.gov_cases where slug = 'mvd-academy';

  if not exists(select 1 from public.gov_specs where gov_case_id = v_id) then
    insert into public.gov_specs (gov_case_id, sort_order, label_ru, value_ru) values
      (v_id, 0, 'Тип работ',        'Капитальный ремонт'),
      (v_id, 1, 'Бюджет контракта', '4 500 000 $'),
      (v_id, 2, 'Срок реализации',  '2 года'),
      (v_id, 3, 'Локация',          'Ташкент, ул. Мингбулок'),
      (v_id, 4, 'Объекты',          'Учебные корпусы'),
      (v_id, 5, 'Заказчик',         'МВД РУз');
  end if;
end $$;

-- 2. ГУВД Ангрен
do $$
declare v_id uuid;
begin
  insert into public.gov_cases (
    slug, sort_order, image, gallery,
    name_ru, full_name_ru, customer_ru, year_ru, budget_ru,
    area_ru, capacity_ru, deadline_ru, description_ru
  ) values (
    'guvd-angren', 1,
    'images/gov-03-transit.jpg',
    array['images/gov-03-transit.jpg'],
    'ГУВД Ангрен', 'Здание ГУВД г. Ангрен',
    'Главное управление внутренних дел', 'Сдан', '350 000 $',
    'Административное здание', '—', '1 год',
    'Общее строительство административного здания Главного управления внутренних дел в городе Ангрен Ташкентской области. Полный цикл подрядных работ — от нулевого цикла до сдачи объекта.'
  ) on conflict (slug) do nothing;

  select id into v_id from public.gov_cases where slug = 'guvd-angren';

  if not exists(select 1 from public.gov_specs where gov_case_id = v_id) then
    insert into public.gov_specs (gov_case_id, sort_order, label_ru, value_ru) values
      (v_id, 0, 'Тип работ',        'Общее строительство'),
      (v_id, 1, 'Бюджет контракта', '350 000 $'),
      (v_id, 2, 'Срок реализации',  '1 год'),
      (v_id, 3, 'Локация',          'г. Ангрен'),
      (v_id, 4, 'Назначение',       'Административное здание'),
      (v_id, 5, 'Заказчик',         'МВД РУз');
  end if;
end $$;

-- 3. Спорткомплекс
do $$
declare v_id uuid;
begin
  insert into public.gov_cases (
    slug, sort_order, image, gallery,
    name_ru, full_name_ru, customer_ru, year_ru, budget_ru,
    area_ru, capacity_ru, deadline_ru, description_ru
  ) values (
    'sports-complex', 2,
    'images/gov-01-hospital.jpg',
    array['images/gov-01-hospital.jpg'],
    'Спорткомплекс', 'Спортивный комплекс на ул. Чинобод',
    'Хокимият г. Ташкент', 'Сдан', '550 000 $',
    'Спортивный объект', '—', '1 год',
    'Общее строительство спортивного комплекса в Юнусабадском районе Ташкента. Полный цикл генерального подряда. Объект сдан в срок, в рамках утверждённого бюджета.'
  ) on conflict (slug) do nothing;

  select id into v_id from public.gov_cases where slug = 'sports-complex';

  if not exists(select 1 from public.gov_specs where gov_case_id = v_id) then
    insert into public.gov_specs (gov_case_id, sort_order, label_ru, value_ru) values
      (v_id, 0, 'Тип работ',        'Общее строительство'),
      (v_id, 1, 'Бюджет контракта', '550 000 $'),
      (v_id, 2, 'Срок реализации',  '1 год'),
      (v_id, 3, 'Локация',          'Ташкент, ул. Чинобод'),
      (v_id, 4, 'Назначение',       'Спортивный комплекс'),
      (v_id, 5, 'Стандарт качества','ISO 9001:2015');
  end if;
end $$;

-- 4. Школа на Глинка
do $$
declare v_id uuid;
begin
  insert into public.gov_cases (
    slug, sort_order, image, gallery,
    name_ru, full_name_ru, customer_ru, year_ru, budget_ru,
    area_ru, capacity_ru, deadline_ru, description_ru
  ) values (
    'school-glinka', 3,
    'images/gov-02-school.jpg',
    array['images/gov-02-school.jpg'],
    'Школа', 'Школа на ул. Глинка, 21',
    'Управление народного образования', 'Сдан', '450 000 $',
    'Учебное заведение', '—', '3 месяца',
    'Реконструкция здания общеобразовательной школы на улице Глинка в Ташкенте. Объект сдан в ускоренные сроки — 3 месяца. Включала полный комплекс реконструкционных и отделочных работ.'
  ) on conflict (slug) do nothing;

  select id into v_id from public.gov_cases where slug = 'school-glinka';

  if not exists(select 1 from public.gov_specs where gov_case_id = v_id) then
    insert into public.gov_specs (gov_case_id, sort_order, label_ru, value_ru) values
      (v_id, 0, 'Тип работ',        'Реконструкция'),
      (v_id, 1, 'Бюджет контракта', '450 000 $'),
      (v_id, 2, 'Срок реализации',  '3 месяца'),
      (v_id, 3, 'Локация',          'Ташкент, ул. Глинка, 21'),
      (v_id, 4, 'Назначение',       'Общеобразовательная школа'),
      (v_id, 5, 'Особенности',      'Ускоренный график');
  end if;
end $$;

-- 5. British School
do $$
declare v_id uuid;
begin
  insert into public.gov_cases (
    slug, sort_order, image, gallery,
    name_ru, full_name_ru, customer_ru, year_ru, budget_ru,
    area_ru, capacity_ru, deadline_ru, description_ru
  ) values (
    'british-school', 4,
    'images/gov-03-transit.jpg',
    array['images/gov-03-transit.jpg'],
    'British School', 'The British School of Tashkent — учебный корпус',
    'The British School of Tashkent', 'Сдан', 'Частный контракт',
    'Учебный корпус', '—', 'Сдан в срок',
    'Общее строительство нового учебного корпуса The British School of Tashkent на улице Каландар. Реализация в соответствии с требованиями международного образовательного стандарта.'
  ) on conflict (slug) do nothing;

  select id into v_id from public.gov_cases where slug = 'british-school';

  if not exists(select 1 from public.gov_specs where gov_case_id = v_id) then
    insert into public.gov_specs (gov_case_id, sort_order, label_ru, value_ru) values
      (v_id, 0, 'Тип работ',        'Общее строительство'),
      (v_id, 1, 'Локация',          'Ташкент, ул. Каландар'),
      (v_id, 2, 'Назначение',       'Учебный корпус'),
      (v_id, 3, 'Заказчик',         'British School of Tashkent'),
      (v_id, 4, 'Особенности',      'Международный стандарт'),
      (v_id, 5, 'Стандарт качества','ISO 9001:2015');
  end if;
end $$;

-- 6. Холодильная база
do $$
declare v_id uuid;
begin
  insert into public.gov_cases (
    slug, sort_order, image, gallery,
    name_ru, full_name_ru, customer_ru, year_ru, budget_ru,
    area_ru, capacity_ru, deadline_ru, description_ru
  ) values (
    'cold-storage', 5,
    'images/gov-01-hospital.jpg',
    array['images/gov-01-hospital.jpg'],
    'Холодильная база', 'Холодильная база для хранения продуктов питания',
    'Частный заказчик', 'Сдан', 'Коммерческий контракт',
    'Промышленный объект', '—', 'Сдан в срок',
    'Общее строительство холодильной базы для хранения продуктов питания в Кибрайском районе Ташкентской области. Промышленный объект со специализированной холодильной инфраструктурой.'
  ) on conflict (slug) do nothing;

  select id into v_id from public.gov_cases where slug = 'cold-storage';

  if not exists(select 1 from public.gov_specs where gov_case_id = v_id) then
    insert into public.gov_specs (gov_case_id, sort_order, label_ru, value_ru) values
      (v_id, 0, 'Тип работ',        'Общее строительство'),
      (v_id, 1, 'Локация',          'Кибрайский р-н, Таш. обл.'),
      (v_id, 2, 'Назначение',       'Холодильная база'),
      (v_id, 3, 'Категория',        'Промышленный объект'),
      (v_id, 4, 'Специфика',        'Холодильная инфраструктура'),
      (v_id, 5, 'Стандарт качества','ISO 9001:2015');
  end if;
end $$;

-- ============ NEWS =======================================================

insert into public.news (slug, iso_date, sort_order, image, date_label_ru, category_ru, title_ru, excerpt_ru, body_ru)
values
  ('houson-hills-progress', '2026-05-01', 0,
   'images/project-02-business.jpg', 'ТЕКУЩИЙ ПЕРИОД', 'Стройка',
   'ЖК «Houson Hills» — внутренние отделочные работы на двух блоках',
   'На обеих 9-этажных башнях ведутся внутренние отделочные работы. Параллельно завершается монтаж инженерных систем.',
   array[
     'На объекте «Houson Hills» в посёлке Чорбог Бостанлыкского района ведутся внутренние отделочные работы одновременно на двух 9-этажных блоках. MTC выступает генеральным подрядчиком проекта.',
     'Параллельно завершается монтаж инженерных систем: водоснабжение, отопление, электрика, слаботочные коммуникации. По обоим блокам выполнены кровельные работы и наружное остекление.',
     'Контроль качества ведётся в соответствии со стандартом ISO 9001:2015. Объект сдаётся в роли генерального подрядчика — от земляных работ до благоустройства территории.'
   ]),

  ('mvd-academy-completed', '2025-12-01', 1,
   'images/gov-02-school.jpg', 'ЗАВЕРШЁН', 'Госзаказ',
   'Завершён капитальный ремонт учебных корпусов Академии МВД',
   'Самый крупный объект MTC по объёму контракта — 4,5 млн $. Срок реализации — 2 года. Сдан заказчику в полном объёме.',
   array[
     'MTC завершила капитальный ремонт учебных корпусов Академии МВД Республики Узбекистан на улице Мингбулок в Ташкенте. Объём контракта — 4 500 000 $, срок реализации — 2 года.',
     'Работы включали полный комплекс ремонтно-восстановительных мероприятий: усиление конструкций, инженерные системы, внутренняя и наружная отделка, благоустройство прилегающей территории.',
     'Объект сдан заказчику в полном объёме. На сегодня — самый крупный завершённый проект MTC по бюджету.'
   ]),

  ('iso-certification-2025', '2025-05-31', 2,
   'images/hero-light.jpg', '31 МАЯ 2025', 'Сертификация',
   'MTC получила сертификаты ISO 9001 и ISO 14001',
   'Подтверждено соответствие международным стандартам системы менеджмента качества и системы экологического менеджмента.',
   array[
     'Компания ООО «Millennium Time Commerce» прошла международную сертификацию и получила два сертификата: ISO 9001:2015 (Quality Management System) и ISO 14001:2015 (Environmental Management System).',
     'Сертификаты выданы органом сертификации QUALITY MANAGEMENT LLC. Дата выдачи — 31 мая 2025 года, срок действия — до 30 мая 2028 года.',
     'Сертификация распространяется на полный спектр услуг: строительство жилых и коммерческих зданий, металлоконструкции, капитальный ремонт, реконструкция, отделочные работы, инженерные системы, благоустройство.'
   ]),

  ('current-projects-2026', '2026-01-15', 3,
   'images/project-01-premium.jpg', 'ПОРТФЕЛЬ 2026', 'Портфель',
   '5 активных строительных объектов в работе',
   'В роли генерального подрядчика MTC ведёт работы на пяти объектах. Среди них — три жилых комплекса в Бостанлыкском районе.',
   array[
     'По состоянию на 2026 год в работе компании MTC находится 5 текущих объектов общестроительного и подрядного характера. Ключевые из них — три жилых комплекса в Бостанлыкском районе Ташкентской области.',
     'ЖК «Бочка» (Бештут, 3 блока по 6 этажей), ЖК «Houson Hills» (Чорбог, 2 блока по 9 этажей) и ЖК «Юсуфхона» (Новбод, гостинично-коттеджный комплекс) реализуются в полном цикле генерального подряда.',
     'Среднегодовой оборот организации — 5 000 000 $. В штате — 147 сотрудников, организованных по 4 отделам: строительный, геодезический, ПТО и финансовый.'
   ]),

  ('category-c-cc', '2025-06-01', 4,
   'images/gov-03-transit.jpg', 'ИЮНЬ 2025', 'Рейтинг',
   'Подтверждена категория C-CC в Национальной системе сертификации',
   'Категория C-CC в национальном рейтинге сертификации Республики Узбекистан подтверждена на новый период.',
   array[
     'Национальная система сертификации Республики Узбекистан подтвердила компании MTC категорию C-CC на новый сертификационный период.',
     'Данная категория допускает выполнение полного спектра подрядных работ по объектам жилого, общественного, административного и промышленного назначения, включая работы для государственного заказчика.',
     'Подтверждение категории основано на анализе портфеля выполненных контрактов, материально-технической базы (включая собственный 50-местный автобус и 9 жилых контейнеров для бригад) и квалификации специалистов.'
   ]),

  ('british-school-completed', '2024-09-01', 5,
   'images/gov-03-transit.jpg', 'ЗАВЕРШЁН', 'Завершено',
   'Сдан учебный корпус The British School of Tashkent',
   'Общее строительство нового учебного корпуса международной школы на улице Каландар завершено и сдано заказчику.',
   array[
     'MTC завершила и сдала заказчику общее строительство учебного корпуса The British School of Tashkent на улице Каландар в Ташкенте.',
     'Работы выполнены в соответствии с требованиями международного образовательного стандарта и техническим заданием заказчика. Объект — один из ключевых частных контрактов в портфолио компании.',
     'Сдача объекта — подтверждение опыта работы MTC не только с государственным, но и с международным частным заказчиком высокого уровня требований.'
   ])
on conflict (slug) do nothing;

-- ============================================================================
-- ГОТОВО. Что дальше:
-- 1. Откройте /admin → разделы Новости / Объекты / Госзаказы должны заполниться
-- 2. Публичный сайт продолжит работать (теперь читает из БД, а не из seed-кода)
-- ============================================================================
