/* Active construction sites — 3 current residential complexes where MTC is general contractor */

const PROJECTS_DATA = [
  {
    slug: "bochka",
    name: "Бочка",
    fullName: "ЖК «Бочка»",
    tier: "Жилой комплекс",
    status: "building",
    statusLabel: "В работе",
    statusClass: "bg-accent-blue text-white",
    location: "Ташкентская область",
    district: "Бостанлыкский район, посёлок Бештут",
    coordinates: { lat: 41.55, lng: 70.13 },
    delivery: "В работе",
    floors: "6 этажей",
    apartmentsFrom: "3 блока",
    priceFrom: "Генподряд",
    priceFromNum: 0,
    pricePerMeter: "В стадии строительства",
    description:
      "Многоквартирный жилой комплекс из трёх шестиэтажных блоков в горной части Бостанлыкского района. MTC выполняет полный цикл генерального подряда — от земляных работ до сдачи объекта с инженерией.",
    features: [
      "Монолитно-каркасная конструкция",
      "3 жилых блока по 6 этажей",
      "Наружные и внутренние отделочные работы",
      "Установка инженерных систем",
      "Благоустройство территории",
      "Соответствие стандартам ISO 9001:2015",
    ],
    infrastructure: [
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
      { rooms: "Блок А", area: "6 этажей", price: "Генподряд" },
      { rooms: "Блок Б", area: "6 этажей", price: "Генподряд" },
      { rooms: "Блок В", area: "6 этажей", price: "Генподряд" },
    ],
    constructionProgress: [
      { month: "Текущий период", status: "Фасадные и отделочные работы", image: "images/project-01-premium.jpg" },
      { month: "Предыдущий этап", status: "Монтаж инженерных систем", image: "images/hero-dark.jpg" },
      { month: "Ранее", status: "Возведение монолитного каркаса", image: "images/project-01-premium.jpg" },
    ],
  },
  {
    slug: "houson-hills",
    name: "Houson Hills",
    fullName: "ЖК «Houson Hills»",
    tier: "Жилой комплекс",
    status: "building",
    statusLabel: "В работе",
    statusClass: "bg-accent-blue text-white",
    location: "Ташкентская область",
    district: "Бостанлыкский район, посёлок Чорбог",
    coordinates: { lat: 41.6, lng: 70.04 },
    delivery: "В работе",
    floors: "9 этажей",
    apartmentsFrom: "2 блока",
    priceFrom: "Генподряд",
    priceFromNum: 0,
    pricePerMeter: "В стадии строительства",
    description:
      "Премиальный жилой комплекс на берегу Чарвакского водохранилища. Две девятиэтажные башни с видами на горы и воду. MTC реализует проект в роли генерального подрядчика полного цикла.",
    features: [
      "2 жилых блока по 9 этажей",
      "Монолитно-кирпичная конструкция",
      "Панорамное остекление",
      "Инженерные системы под ключ",
      "Наружные отделочные работы",
      "Озеленение и благоустройство",
    ],
    infrastructure: [
      "Чарвакское водохранилище в шаговой доступности",
      "Горнолыжный курорт Амирсой",
      "Развитая туристическая зона Чорбог",
      "Подъездные дороги республиканского значения",
    ],
    mainImage: "images/project-02-business.jpg",
    gallery: ["images/project-02-business.jpg", "images/hero-light.jpg"],
    floorPlans: [
      { rooms: "Блок 1", area: "9 этажей", price: "Генподряд" },
      { rooms: "Блок 2", area: "9 этажей", price: "Генподряд" },
    ],
    constructionProgress: [
      { month: "Текущий период", status: "Внутренние отделочные работы", image: "images/project-02-business.jpg" },
      { month: "Предыдущий этап", status: "Кровельные работы", image: "images/project-02-business.jpg" },
      { month: "Ранее", status: "Возведение каркаса 9 этажа", image: "images/project-02-business.jpg" },
    ],
  },
  {
    slug: "yusufkhona",
    name: "Юсуфхона",
    fullName: "ЖК «Юсуфхона»",
    tier: "Гостинично-коттеджный комплекс",
    status: "building",
    statusLabel: "В работе",
    statusClass: "bg-accent-blue text-white",
    location: "Ташкентская область",
    district: "Бостанлыкский район, посёлок Новбод",
    coordinates: { lat: 41.62, lng: 70.07 },
    delivery: "В работе",
    floors: "Гостиница + коттеджи",
    apartmentsFrom: "Комплекс",
    priceFrom: "Генподряд",
    priceFromNum: 0,
    pricePerMeter: "В стадии строительства",
    description:
      "Гостинично-коттеджный комплекс «Юсуфхона» в курортной зоне Новбод. В составе — гостиничный корпус и группа отдельно стоящих коттеджей премиум-сегмента. MTC выступает генеральным подрядчиком всего объекта.",
    features: [
      "Гостиничный корпус",
      "Группа коттеджей",
      "Авторская архитектура",
      "Ландшафтные работы",
      "Инженерные коммуникации",
      "Полный цикл строительства",
    ],
    infrastructure: [
      "Курортная зона Новбод",
      "Чарвакское водохранилище",
      "Туристические маршруты Чимгана",
      "Газалкентский транспортный узел",
    ],
    mainImage: "images/project-03-comfort.jpg",
    gallery: ["images/project-03-comfort.jpg"],
    floorPlans: [
      { rooms: "Гостиница", area: "Корпус", price: "Генподряд" },
      { rooms: "Коттеджи", area: "Группа домов", price: "Генподряд" },
    ],
    constructionProgress: [],
  },
];

const getProjectBySlug = (slug) => PROJECTS_DATA.find((p) => p.slug === slug);

// Resolve all image paths through R() so they pick up bundled blob URLs in standalone mode
PROJECTS_DATA.forEach((p) => {
  p.mainImage = R(p.mainImage);
  p.gallery = p.gallery.map(R);
  if (p.constructionProgress) p.constructionProgress.forEach((c) => { c.image = R(c.image); });
});

Object.assign(window, { PROJECTS_DATA, getProjectBySlug });
