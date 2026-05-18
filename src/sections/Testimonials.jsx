/* Section 10 — Testimonials (client / partner statements) */

const TESTIMONIALS = [
  {
    quote:
      "Капитальный ремонт учебных корпусов сдан в срок. Объём работ — крупнейший среди подрядов того периода. Качество исполнения и подход бригад соответствуют профильным требованиям ведомства.",
    initials: "МВ",
    name: "Представитель МВД РУз",
    meta: "Академия МВД, $4.5 млн",
  },
  {
    quote:
      "Реконструкция здания школы выполнена за 3 месяца — в ускоренном графике. Внутренние и наружные работы сданы в полном объёме, претензий по приёмке нет.",
    initials: "УО",
    name: "Управление народного образования",
    meta: "Школа на ул. Глинка, 21",
  },
  {
    quote:
      "Учебный корпус сдан в соответствии с международным стандартом качества. Прозрачная работа по этапам, аккуратное взаимодействие с заказчиком, грамотное закрытие документации.",
    initials: "BS",
    name: "British School of Tashkent",
    meta: "Учебный корпус, ул. Каландар",
  },
  {
    quote:
      "Холодильная база сдана с соблюдением всех технических требований к промышленному объекту. Специализированная инфраструктура запущена и работает без замечаний.",
    initials: "ХР",
    name: "Холодильная база, Кибрай",
    meta: "Промышленный объект",
  },
  {
    quote:
      "Спорткомплекс на ул. Чинобод реализован MTC в роли генерального подрядчика. Сроки и бюджет соблюдены, объект введён в эксплуатацию.",
    initials: "ХТ",
    name: "Хокимият г. Ташкент",
    meta: "Спорткомплекс, 1 год",
  },
];

function Testimonials() {
  const trackRef = useRef(null);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 420, behavior: "smooth" });
  };

  return (
    <section className="bg-bg-light py-24 lg:py-32 overflow-hidden grain-light">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 flex flex-wrap items-end justify-between gap-6 mb-12">
        <SectionHead
          eyebrow="Отзывы заказчиков"
          title="Что говорят наши государственные и частные заказчики"
          center={false}
        />
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => scrollBy(-1)}
            className="w-12 h-12 rounded-full border border-black/10 bg-white text-text-light-primary flex items-center justify-center hover:bg-text-light-primary hover:text-white transition-colors"
            aria-label="Назад"
          >
            <Icon name="ArrowLeft" size={18} />
          </button>
          <button
            onClick={() => scrollBy(1)}
            className="w-12 h-12 rounded-full border border-black/10 bg-white text-text-light-primary flex items-center justify-center hover:bg-text-light-primary hover:text-white transition-colors"
            aria-label="Вперёд"
          >
            <Icon name="ArrowRight" size={18} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pl-6 lg:pl-20 pr-6 lg:pr-20 pb-4"
      >
        {TESTIMONIALS.map((t) => (
          <article
            key={t.name}
            className="bg-white rounded-2xl p-7 lg:p-8 shadow-sm flex-shrink-0 w-[320px] sm:w-[380px] snap-start flex flex-col"
          >
            <div className="flex gap-1 mb-5">
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  name="Star"
                  size={16}
                  fill="#C9985C"
                  strokeWidth={0}
                  className="text-accent-gold"
                />
              ))}
            </div>
            <blockquote className="font-serif text-lg italic text-text-light-primary leading-relaxed flex-1">
              «{t.quote}»
            </blockquote>
            <footer className="flex items-center gap-3 mt-6 pt-6 border-t border-black/[0.07]">
              <div className="w-12 h-12 rounded-full bg-text-light-primary/[0.08] flex items-center justify-center text-text-light-primary font-medium font-serif">
                {t.initials}
              </div>
              <div>
                <div className="text-sm font-medium text-text-light-primary">
                  {t.name}
                </div>
                <div className="text-xs text-text-light-body mt-0.5">
                  {t.meta}
                </div>
              </div>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

window.Testimonials = Testimonials;
