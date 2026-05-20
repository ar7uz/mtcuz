/* Завершённые / госзаказы. Сид-данные = fallback. */

const GOV_SEED = [
  {
    slug: "mvd-academy",
    name_ru: "Академия МВД",
    fullName_ru: "Академия МВД Республики Узбекистан",
    customer_ru: "Министерство внутренних дел РУз",
    year_ru: "Сдан",
    budget_ru: "4 500 000 $",
    area_ru: "Учебные корпусы",
    capacity_ru: "—",
    deadline_ru: "2 года",
    description_ru:
      "Капитальный ремонт учебных корпусов Академии МВД на улице Мингбулок в Ташкенте. Самый крупный завершённый объект MTC по объёму контракта. Работы включали полный комплекс ремонтно-восстановительных, отделочных и инженерных работ.",
    specs: [
      { label_ru: "Тип работ",         value_ru: "Капитальный ремонт" },
      { label_ru: "Бюджет контракта",  value_ru: "4 500 000 $" },
      { label_ru: "Срок реализации",   value_ru: "2 года" },
      { label_ru: "Локация",           value_ru: "Ташкент, ул. Мингбулок" },
      { label_ru: "Объекты",           value_ru: "Учебные корпусы" },
      { label_ru: "Заказчик",          value_ru: "МВД РУз" },
    ],
    image: "images/gov-02-school.jpg",
    gallery: ["images/gov-02-school.jpg"],
  },
  {
    slug: "guvd-angren",
    name_ru: "ГУВД Ангрен",
    fullName_ru: "Здание ГУВД г. Ангрен",
    customer_ru: "Главное управление внутренних дел",
    year_ru: "Сдан",
    budget_ru: "350 000 $",
    area_ru: "Административное здание",
    capacity_ru: "—",
    deadline_ru: "1 год",
    description_ru:
      "Общее строительство административного здания Главного управления внутренних дел в городе Ангрен Ташкентской области. Полный цикл подрядных работ — от нулевого цикла до сдачи объекта.",
    specs: [
      { label_ru: "Тип работ",         value_ru: "Общее строительство" },
      { label_ru: "Бюджет контракта",  value_ru: "350 000 $" },
      { label_ru: "Срок реализации",   value_ru: "1 год" },
      { label_ru: "Локация",           value_ru: "г. Ангрен" },
      { label_ru: "Назначение",        value_ru: "Административное здание" },
      { label_ru: "Заказчик",          value_ru: "МВД РУз" },
    ],
    image: "images/gov-03-transit.jpg",
    gallery: ["images/gov-03-transit.jpg"],
  },
  {
    slug: "sports-complex",
    name_ru: "Спорткомплекс",
    fullName_ru: "Спортивный комплекс на ул. Чинобод",
    customer_ru: "Хокимият г. Ташкент",
    year_ru: "Сдан",
    budget_ru: "550 000 $",
    area_ru: "Спортивный объект",
    capacity_ru: "—",
    deadline_ru: "1 год",
    description_ru:
      "Общее строительство спортивного комплекса в Юнусабадском районе Ташкента. Полный цикл генерального подряда. Объект сдан в срок, в рамках утверждённого бюджета.",
    specs: [
      { label_ru: "Тип работ",         value_ru: "Общее строительство" },
      { label_ru: "Бюджет контракта",  value_ru: "550 000 $" },
      { label_ru: "Срок реализации",   value_ru: "1 год" },
      { label_ru: "Локация",           value_ru: "Ташкент, ул. Чинобод" },
      { label_ru: "Назначение",        value_ru: "Спортивный комплекс" },
      { label_ru: "Стандарт качества", value_ru: "ISO 9001:2015" },
    ],
    image: "images/gov-01-hospital.jpg",
    gallery: ["images/gov-01-hospital.jpg"],
  },
  {
    slug: "school-glinka",
    name_ru: "Школа",
    fullName_ru: "Школа на ул. Глинка, 21",
    customer_ru: "Управление народного образования",
    year_ru: "Сдан",
    budget_ru: "450 000 $",
    area_ru: "Учебное заведение",
    capacity_ru: "—",
    deadline_ru: "3 месяца",
    description_ru:
      "Реконструкция здания общеобразовательной школы на улице Глинка в Ташкенте. Объект сдан в ускоренные сроки — 3 месяца. Включала полный комплекс реконструкционных и отделочных работ.",
    specs: [
      { label_ru: "Тип работ",         value_ru: "Реконструкция" },
      { label_ru: "Бюджет контракта",  value_ru: "450 000 $" },
      { label_ru: "Срок реализации",   value_ru: "3 месяца" },
      { label_ru: "Локация",           value_ru: "Ташкент, ул. Глинка, 21" },
      { label_ru: "Назначение",        value_ru: "Общеобразовательная школа" },
      { label_ru: "Особенности",       value_ru: "Ускоренный график" },
    ],
    image: "images/gov-02-school.jpg",
    gallery: ["images/gov-02-school.jpg"],
  },
  {
    slug: "british-school",
    name_ru: "British School",
    fullName_ru: "The British School of Tashkent — учебный корпус",
    customer_ru: "The British School of Tashkent",
    year_ru: "Сдан",
    budget_ru: "Частный контракт",
    area_ru: "Учебный корпус",
    capacity_ru: "—",
    deadline_ru: "Сдан в срок",
    description_ru:
      "Общее строительство нового учебного корпуса The British School of Tashkent на улице Каландар. Реализация в соответствии с требованиями международного образовательного стандарта.",
    specs: [
      { label_ru: "Тип работ",         value_ru: "Общее строительство" },
      { label_ru: "Локация",           value_ru: "Ташкент, ул. Каландар" },
      { label_ru: "Назначение",        value_ru: "Учебный корпус" },
      { label_ru: "Заказчик",          value_ru: "British School of Tashkent" },
      { label_ru: "Особенности",       value_ru: "Международный стандарт" },
      { label_ru: "Стандарт качества", value_ru: "ISO 9001:2015" },
    ],
    image: "images/gov-03-transit.jpg",
    gallery: ["images/gov-03-transit.jpg"],
  },
  {
    slug: "cold-storage",
    name_ru: "Холодильная база",
    fullName_ru: "Холодильная база для хранения продуктов питания",
    customer_ru: "Частный заказчик",
    year_ru: "Сдан",
    budget_ru: "Коммерческий контракт",
    area_ru: "Промышленный объект",
    capacity_ru: "—",
    deadline_ru: "Сдан в срок",
    description_ru:
      "Общее строительство холодильной базы для хранения продуктов питания в Кибрайском районе Ташкентской области. Промышленный объект со специализированной холодильной инфраструктурой.",
    specs: [
      { label_ru: "Тип работ",         value_ru: "Общее строительство" },
      { label_ru: "Локация",           value_ru: "Кибрайский р-н, Таш. обл." },
      { label_ru: "Назначение",        value_ru: "Холодильная база" },
      { label_ru: "Категория",         value_ru: "Промышленный объект" },
      { label_ru: "Специфика",         value_ru: "Холодильная инфраструктура" },
      { label_ru: "Стандарт качества", value_ru: "ISO 9001:2015" },
    ],
    image: "images/gov-01-hospital.jpg",
    gallery: ["images/gov-01-hospital.jpg"],
  },
];

function applyGovAliases(c) {
  const fields = ["name","fullName","customer","year","budget","area","capacity","deadline","description"];
  fields.forEach((f) => { if (c[`${f}_ru`] != null) c[f] = c[`${f}_ru`]; });
  (c.specs || []).forEach((s) => {
    if (s.label_ru != null) s.label = s.label_ru;
    if (s.value_ru != null) s.value = s.value_ru;
  });
  if (c.image) c.image = R(c.image);
  if (Array.isArray(c.gallery)) c.gallery = c.gallery.map(R);
}

GOV_SEED.forEach(applyGovAliases);

let GOV_CASES = GOV_SEED;

const getGovCaseBySlug = (slug) => window.GOV_CASES.find((c) => c.slug === slug);

function setGovCases(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return;
  arr.forEach(applyGovAliases);
  GOV_CASES = arr;
  window.GOV_CASES = arr;
}

Object.assign(window, { GOV_CASES, getGovCaseBySlug, setGovCases, applyGovAliases });
