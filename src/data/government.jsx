/* Completed objects — public, government and infrastructure cases from MTC portfolio */

const GOV_CASES = [
  {
    slug: "mvd-academy",
    name: "Академия МВД",
    fullName: "Академия МВД Республики Узбекистан",
    customer: "Министерство внутренних дел РУз",
    year: "Сдан",
    budget: "4 500 000 $",
    area: "Учебные корпусы",
    capacity: "—",
    deadline: "2 года",
    description:
      "Капитальный ремонт учебных корпусов Академии МВД на улице Мингбулок в Ташкенте. Самый крупный завершённый объект MTC по объёму контракта. Работы включали полный комплекс ремонтно-восстановительных, отделочных и инженерных работ.",
    specs: [
      { label: "Тип работ", value: "Капитальный ремонт" },
      { label: "Бюджет контракта", value: "4 500 000 $" },
      { label: "Срок реализации", value: "2 года" },
      { label: "Локация", value: "Ташкент, ул. Мингбулок" },
      { label: "Объекты", value: "Учебные корпусы" },
      { label: "Заказчик", value: "МВД РУз" },
    ],
    image: "images/gov-02-school.jpg",
    gallery: ["images/gov-02-school.jpg"],
  },
  {
    slug: "guvd-angren",
    name: "ГУВД Ангрен",
    fullName: "Здание ГУВД г. Ангрен",
    customer: "Главное управление внутренних дел",
    year: "Сдан",
    budget: "350 000 $",
    area: "Административное здание",
    capacity: "—",
    deadline: "1 год",
    description:
      "Общее строительство административного здания Главного управления внутренних дел в городе Ангрен Ташкентской области. Полный цикл подрядных работ — от нулевого цикла до сдачи объекта.",
    specs: [
      { label: "Тип работ", value: "Общее строительство" },
      { label: "Бюджет контракта", value: "350 000 $" },
      { label: "Срок реализации", value: "1 год" },
      { label: "Локация", value: "г. Ангрен" },
      { label: "Назначение", value: "Административное здание" },
      { label: "Заказчик", value: "МВД РУз" },
    ],
    image: "images/gov-03-transit.jpg",
    gallery: ["images/gov-03-transit.jpg"],
  },
  {
    slug: "sports-complex",
    name: "Спорткомплекс",
    fullName: "Спортивный комплекс на ул. Чинобод",
    customer: "Хокимият г. Ташкент",
    year: "Сдан",
    budget: "550 000 $",
    area: "Спортивный объект",
    capacity: "—",
    deadline: "1 год",
    description:
      "Общее строительство спортивного комплекса в Юнусабадском районе Ташкента. Полный цикл генерального подряда. Объект сдан в срок, в рамках утверждённого бюджета.",
    specs: [
      { label: "Тип работ", value: "Общее строительство" },
      { label: "Бюджет контракта", value: "550 000 $" },
      { label: "Срок реализации", value: "1 год" },
      { label: "Локация", value: "Ташкент, ул. Чинобод" },
      { label: "Назначение", value: "Спортивный комплекс" },
      { label: "Стандарт качества", value: "ISO 9001:2015" },
    ],
    image: "images/gov-01-hospital.jpg",
    gallery: ["images/gov-01-hospital.jpg"],
  },
  {
    slug: "school-glinka",
    name: "Школа",
    fullName: "Школа на ул. Глинка, 21",
    customer: "Управление народного образования",
    year: "Сдан",
    budget: "450 000 $",
    area: "Учебное заведение",
    capacity: "—",
    deadline: "3 месяца",
    description:
      "Реконструкция здания общеобразовательной школы на улице Глинка в Ташкенте. Объект сдан в ускоренные сроки — 3 месяца. Включала полный комплекс реконструкционных и отделочных работ.",
    specs: [
      { label: "Тип работ", value: "Реконструкция" },
      { label: "Бюджет контракта", value: "450 000 $" },
      { label: "Срок реализации", value: "3 месяца" },
      { label: "Локация", value: "Ташкент, ул. Глинка, 21" },
      { label: "Назначение", value: "Общеобразовательная школа" },
      { label: "Особенности", value: "Ускоренный график" },
    ],
    image: "images/gov-02-school.jpg",
    gallery: ["images/gov-02-school.jpg"],
  },
  {
    slug: "british-school",
    name: "British School",
    fullName: "The British School of Tashkent — учебный корпус",
    customer: "The British School of Tashkent",
    year: "Сдан",
    budget: "Частный контракт",
    area: "Учебный корпус",
    capacity: "—",
    deadline: "Сдан в срок",
    description:
      "Общее строительство нового учебного корпуса The British School of Tashkent на улице Каландар. Реализация в соответствии с требованиями международного образовательного стандарта.",
    specs: [
      { label: "Тип работ", value: "Общее строительство" },
      { label: "Локация", value: "Ташкент, ул. Каландар" },
      { label: "Назначение", value: "Учебный корпус" },
      { label: "Заказчик", value: "British School of Tashkent" },
      { label: "Особенности", value: "Международный стандарт" },
      { label: "Стандарт качества", value: "ISO 9001:2015" },
    ],
    image: "images/gov-03-transit.jpg",
    gallery: ["images/gov-03-transit.jpg"],
  },
  {
    slug: "cold-storage",
    name: "Холодильная база",
    fullName: "Холодильная база для хранения продуктов питания",
    customer: "Частный заказчик",
    year: "Сдан",
    budget: "Коммерческий контракт",
    area: "Промышленный объект",
    capacity: "—",
    deadline: "Сдан в срок",
    description:
      "Общее строительство холодильной базы для хранения продуктов питания в Кибрайском районе Ташкентской области. Промышленный объект со специализированной холодильной инфраструктурой.",
    specs: [
      { label: "Тип работ", value: "Общее строительство" },
      { label: "Локация", value: "Кибрайский р-н, Таш. обл." },
      { label: "Назначение", value: "Холодильная база" },
      { label: "Категория", value: "Промышленный объект" },
      { label: "Специфика", value: "Холодильная инфраструктура" },
      { label: "Стандарт качества", value: "ISO 9001:2015" },
    ],
    image: "images/gov-01-hospital.jpg",
    gallery: ["images/gov-01-hospital.jpg"],
  },
];

const getGovCaseBySlug = (slug) => GOV_CASES.find((c) => c.slug === slug);

GOV_CASES.forEach((c) => {
  c.image = R(c.image);
  if (c.gallery) c.gallery = c.gallery.map(R);
});

Object.assign(window, { GOV_CASES, getGovCaseBySlug });
