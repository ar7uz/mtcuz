/* Активные стройки. Сид-данные используются как fallback,
 * если Supabase недоступен или таблица пуста.
 * App.jsx вызывает loadAllContent() при старте — если приходят данные из БД,
 * window.PROJECTS_DATA заменяется на них.
 */

const PROJECTS_SEED = [
  {
    slug: "bochka",
    name_ru: "Бочка",
    fullName_ru: "ЖК «Бочка»",
    tier_ru: "Жилой комплекс",
    status: "building",
    statusLabel_ru: "В работе",
    statusClass: "bg-accent-blue text-white",
    location_ru: "Ташкентская область",
    district_ru: "Бостанлыкский район, посёлок Бештут",
    coordinates: { lat: 41.55, lng: 70.13 },
    delivery_ru: "В работе",
    floors_ru: "6 этажей",
    apartmentsFrom_ru: "3 блока",
    priceFrom_ru: "Генподряд",
    priceFromNum: 0,
    pricePerMeter_ru: "В стадии строительства",
    description_ru:
      "Многоквартирный жилой комплекс из трёх шестиэтажных блоков в горной части Бостанлыкского района. MTC выполняет полный цикл генерального подряда — от земляных работ до сдачи объекта с инженерией.",
    features_ru: [
      "Монолитно-каркасная конструкция",
      "3 жилых блока по 6 этажей",
      "Наружные и внутренние отделочные работы",
      "Установка инженерных систем",
      "Благоустройство территории",
      "Соответствие стандартам ISO 9001:2015",
    ],
    infrastructure_ru: [
      "Горный массив Чимган в 15 минутах",
      "Курортная зона Бештут",
      "Транспортный узел Газалкент",
      "Развитая туристическая инфраструктура",
    ],
    mainImage: "images/project-01-premium.jpg",
    gallery: [
      "images/project-01-premium.jpg",
      "images/hero-light.jpg",
      "images/hero-dark.jpg",
    ],
    floorPlans: [
      { rooms_ru: "Блок А", area_ru: "6 этажей", price_ru: "Генподряд" },
      { rooms_ru: "Блок Б", area_ru: "6 этажей", price_ru: "Генподряд" },
      { rooms_ru: "Блок В", area_ru: "6 этажей", price_ru: "Генподряд" },
    ],
    constructionProgress: [
      { month_ru: "Текущий период",   status_ru: "Фасадные и отделочные работы",       image: "images/project-01-premium.jpg" },
      { month_ru: "Предыдущий этап",  status_ru: "Монтаж инженерных систем",            image: "images/hero-dark.jpg" },
      { month_ru: "Ранее",            status_ru: "Возведение монолитного каркаса",     image: "images/project-01-premium.jpg" },
    ],
  },
  {
    slug: "houson-hills",
    name_ru: "Houson Hills",
    fullName_ru: "ЖК «Houson Hills»",
    tier_ru: "Жилой комплекс",
    status: "building",
    statusLabel_ru: "В работе",
    statusClass: "bg-accent-blue text-white",
    location_ru: "Ташкентская область",
    district_ru: "Бостанлыкский район, посёлок Чорбог",
    coordinates: { lat: 41.6, lng: 70.04 },
    delivery_ru: "В работе",
    floors_ru: "9 этажей",
    apartmentsFrom_ru: "2 блока",
    priceFrom_ru: "Генподряд",
    priceFromNum: 0,
    pricePerMeter_ru: "В стадии строительства",
    description_ru:
      "Премиальный жилой комплекс на берегу Чарвакского водохранилища. Две девятиэтажные башни с видами на горы и воду. MTC реализует проект в роли генерального подрядчика полного цикла.",
    features_ru: [
      "2 жилых блока по 9 этажей",
      "Монолитно-кирпичная конструкция",
      "Панорамное остекление",
      "Инженерные системы под ключ",
      "Наружные отделочные работы",
      "Озеленение и благоустройство",
    ],
    infrastructure_ru: [
      "Чарвакское водохранилище в шаговой доступности",
      "Горнолыжный курорт Амирсой",
      "Развитая туристическая зона Чорбог",
      "Подъездные дороги республиканского значения",
    ],
    mainImage: "images/project-02-business.jpg",
    gallery: ["images/project-02-business.jpg", "images/hero-light.jpg"],
    floorPlans: [
      { rooms_ru: "Блок 1", area_ru: "9 этажей", price_ru: "Генподряд" },
      { rooms_ru: "Блок 2", area_ru: "9 этажей", price_ru: "Генподряд" },
    ],
    constructionProgress: [
      { month_ru: "Текущий период",   status_ru: "Внутренние отделочные работы",      image: "images/project-02-business.jpg" },
      { month_ru: "Предыдущий этап",  status_ru: "Кровельные работы",                  image: "images/project-02-business.jpg" },
      { month_ru: "Ранее",            status_ru: "Возведение каркаса 9 этажа",         image: "images/project-02-business.jpg" },
    ],
  },
  {
    slug: "yusufkhona",
    name_ru: "Юсуфхона",
    fullName_ru: "ЖК «Юсуфхона»",
    tier_ru: "Гостинично-коттеджный комплекс",
    status: "building",
    statusLabel_ru: "В работе",
    statusClass: "bg-accent-blue text-white",
    location_ru: "Ташкентская область",
    district_ru: "Бостанлыкский район, посёлок Новбод",
    coordinates: { lat: 41.62, lng: 70.07 },
    delivery_ru: "В работе",
    floors_ru: "Гостиница + коттеджи",
    apartmentsFrom_ru: "Комплекс",
    priceFrom_ru: "Генподряд",
    priceFromNum: 0,
    pricePerMeter_ru: "В стадии строительства",
    description_ru:
      "Гостинично-коттеджный комплекс «Юсуфхона» в курортной зоне Новбод. В составе — гостиничный корпус и группа отдельно стоящих коттеджей премиум-сегмента. MTC выступает генеральным подрядчиком всего объекта.",
    features_ru: [
      "Гостиничный корпус",
      "Группа коттеджей",
      "Авторская архитектура",
      "Ландшафтные работы",
      "Инженерные коммуникации",
      "Полный цикл строительства",
    ],
    infrastructure_ru: [
      "Курортная зона Новбод",
      "Чарвакское водохранилище",
      "Туристические маршруты Чимгана",
      "Газалкентский транспортный узел",
    ],
    mainImage: "images/project-03-comfort.jpg",
    gallery: ["images/project-03-comfort.jpg"],
    floorPlans: [
      { rooms_ru: "Гостиница", area_ru: "Корпус",      price_ru: "Генподряд" },
      { rooms_ru: "Коттеджи",  area_ru: "Группа домов", price_ru: "Генподряд" },
    ],
    constructionProgress: [],
  },
];

/* Заполняет legacy-плоские поля (`.name`, `.tier`, ...) копиями из `_ru` —
 * чтобы существующие страницы продолжали работать без переписывания.
 * Новый код использует pick(item, 'name') для языкозависимого значения.
 */
function applyLegacyAliases(p) {
  const fields = [
    "name","fullName","tier","statusLabel","location","district","delivery",
    "floors","apartmentsFrom","priceFrom","pricePerMeter","description",
  ];
  fields.forEach((f) => { if (p[`${f}_ru`] != null) p[f] = p[`${f}_ru`]; });

  const arrFields = ["features","infrastructure"];
  arrFields.forEach((f) => { if (Array.isArray(p[`${f}_ru`])) p[f] = p[`${f}_ru`]; });

  (p.floorPlans || []).forEach((x) => {
    ["rooms","area","price"].forEach((f) => { if (x[`${f}_ru`] != null) x[f] = x[`${f}_ru`]; });
  });
  (p.constructionProgress || []).forEach((x) => {
    ["month","status"].forEach((f) => { if (x[`${f}_ru`] != null) x[f] = x[`${f}_ru`]; });
  });
}

/* Прогон через R() — резолвит image paths (см. lib.jsx) для standalone-сборок */
function resolveImagePaths(p) {
  if (p.mainImage) p.mainImage = R(p.mainImage);
  if (Array.isArray(p.gallery)) p.gallery = p.gallery.map(R);
  (p.constructionProgress || []).forEach((c) => { if (c.image) c.image = R(c.image); });
  (p.floorPlans || []).forEach((c) => { if (c.image) c.image = R(c.image); });
}

PROJECTS_SEED.forEach((p) => { applyLegacyAliases(p); resolveImagePaths(p); });

let PROJECTS_DATA = PROJECTS_SEED;

const getProjectBySlug = (slug) => window.PROJECTS_DATA.find((p) => p.slug === slug);

/* Замена данных из Supabase (вызывается из App.jsx после loadAllContent) */
function setProjectsData(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return;
  arr.forEach((p) => { applyLegacyAliases(p); resolveImagePaths(p); });
  PROJECTS_DATA = arr;
  window.PROJECTS_DATA = arr;
}

Object.assign(window, { PROJECTS_DATA, getProjectBySlug, setProjectsData, applyProjectAliases: applyLegacyAliases });
