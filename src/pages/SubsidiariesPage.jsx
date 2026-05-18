/* Subsidiaries — /subsidiaries
 * Two daughter companies of the MTC group: NILSTROY (materials) + Millennium Time Commerce (equipment rental).
 */

const SUBSIDIARIES = [
  {
    slug: "nilstroy",
    name: "ООО «NILSTROY»",
    short: "NILSTROY",
    role: "Строительные материалы",
    tagline: "Оптовая и розничная продажа строительных материалов в широком ассортименте",
    description:
      "Надёжная и динамично развивающаяся компания, специализирующаяся на оптовой и розничной продаже строительных материалов. Поставка качественной продукции от ведущих производителей — всё необходимое для строительства и ремонта.",
    directions: [
      {
        icon: "Hammer",
        title: "Базовые материалы",
        items: ["Металлопродукция", "Цемент", "Кирпич", "Бетон", "Строительные смеси и растворы"],
      },
      {
        icon: "Paintbrush",
        title: "Отделочные материалы",
        items: ["Краски и лаки", "Штукатурки", "Плитка", "Обои"],
      },
      {
        icon: "Wrench",
        title: "Техника и инструменты",
        items: ["Строительные инструменты", "Расходные материалы", "Консультации по подбору"],
      },
    ],
    principles: [
      "Своевременность поставки",
      "Качество от ведущих производителей",
      "Гибкие условия для строительных фирм и частных лиц",
      "Оперативная доставка на объект",
    ],
    stats: [
      { value: "1000+", label: "позиций в ассортименте" },
      { value: "500+", label: "успешных сделок" },
      { value: "15", label: "сотрудников" },
    ],
    accentColor: "#DA745C",
  },
  {
    slug: "mtc-rental",
    name: "ООО «Millennium Time Commerce»",
    short: "Millennium Time Commerce",
    role: "Аренда спецтехники",
    tagline: "Аренда строительной спецтехники по всему Узбекистану — компаниям и частным лицам",
    description:
      "Спецтехника — составная часть любого строительного бизнеса. Берёте оборудование в аренду — снижаете расходы, не задумываетесь о техосмотре и запчастях. Современный парк, постоянно обновляемый, с оптимальным соотношением цены и качества.",
    directions: [
      {
        icon: "Truck",
        title: "Парк техники",
        items: ["Тяжёлая строительная техника", "Землеройное оборудование", "Грузоподъёмная техника", "Постоянно обновляемый парк"],
      },
      {
        icon: "ShieldCheck",
        title: "Услуги",
        items: ["Аренда с оператором", "Аренда без оператора", "Соблюдение нормативов и стандартов", "Работа в срок"],
      },
      {
        icon: "Phone",
        title: "Сопровождение",
        items: ["Консультация по подбору техники", "Менеджер на связи", "Помощь в планировании работ"],
      },
    ],
    principles: [
      "Огромный выбор спецтехники",
      "Оптимальное соотношение цены и качества",
      "Профессиональная команда",
      "Соблюдение всех нормативов и стандартов",
    ],
    stats: [
      { value: "15", label: "единиц техники" },
      { value: "30+", label: "успешных сделок" },
      { value: "15", label: "сотрудников" },
    ],
    accentColor: "#C9985C",
  },
];

window.SUBSIDIARIES = SUBSIDIARIES;

function SubsidiariesPage() {
  useEffect(() => { document.title = "Дочерние компании — " + BRAND.full; }, []);

  return (
    <>
      <PageHero
        eyebrow="Группа компаний"
        title="Дочерние компании MTC"
        sub="Группа MTC — это не только генеральный подряд. Дочерние компании закрывают смежные направления: поставку строительных материалов и аренду спецтехники."
        breadcrumbs={[
          { label: "Главная", to: "/" },
          { label: "Дочерние компании", to: "/subsidiaries" },
        ]}
      />

      {/* Overview row */}
      <section className="bg-bg-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 py-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          {SUBSIDIARIES.map((s) => (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              className="group bg-white/[0.04] border border-white/10 rounded-2xl p-7 lg:p-8 flex items-center gap-5 hover:bg-white/[0.07] hover:border-white/20 transition-all"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: s.accentColor + "20", color: s.accentColor }}
              >
                <Icon name={s.slug === "nilstroy" ? "Package" : "Truck"} size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 mb-1.5">
                  {s.role}
                </div>
                <div className="font-serif text-xl lg:text-2xl text-white leading-tight">{s.name}</div>
              </div>
              <Icon name="ArrowDown" size={18} className="text-white/40 shrink-0 group-hover:translate-y-0.5 transition-transform" />
            </a>
          ))}
        </div>
      </section>

      {/* Each subsidiary in detail */}
      {SUBSIDIARIES.map((s, i) => (
        <section
          key={s.slug}
          id={s.slug}
          className={`${i % 2 === 0 ? "bg-bg-light grain-light" : "bg-white"} py-24 lg:py-32 scroll-mt-24 border-t border-black/5`}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-20">
            {/* Header */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
              <div className="lg:col-span-7">
                <div
                  className="font-mono text-xs uppercase tracking-[0.2em]"
                  style={{ color: s.accentColor }}
                >
                  — {s.role}
                </div>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-text-light-primary mt-5 leading-[1.0] tracking-tight">
                  {s.name}
                </h2>
                <p className="text-text-light-body text-lg mt-7 leading-relaxed max-w-2xl">
                  {s.tagline}
                </p>
              </div>
              <div className="lg:col-span-5 grid grid-cols-3 gap-4">
                {s.stats.map((st) => (
                  <div key={st.label} className="border-l-2 pl-4 py-2" style={{ borderColor: s.accentColor }}>
                    <div className="font-serif text-3xl lg:text-4xl text-text-light-primary leading-none">
                      {st.value}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-text-light-body mt-3 leading-snug">
                      {st.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-text-light-body text-base lg:text-lg mt-12 leading-relaxed max-w-3xl">
              {s.description}
            </p>

            {/* Directions grid */}
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-text-light-body mt-20 mb-8">
              — Направления деятельности
            </div>
            <motion.div
              {...staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6"
            >
              {s.directions.map((d) => (
                <motion.div
                  key={d.title}
                  variants={childFade}
                  className="bg-bg-dark text-white rounded-2xl p-7 lg:p-8"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-6"
                    style={{ background: s.accentColor + "20", color: s.accentColor }}
                  >
                    <Icon name={d.icon} size={20} />
                  </div>
                  <h3 className="font-serif text-xl text-white leading-tight">{d.title}</h3>
                  <ul className="mt-5 space-y-2.5">
                    {d.items.map((it) => (
                      <li key={it} className="text-sm text-white/70 leading-relaxed flex items-start gap-2.5">
                        <span
                          className="block w-1 h-1 rounded-full mt-2 shrink-0"
                          style={{ background: s.accentColor }}
                        />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>

            {/* Principles row */}
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-t border-black/10 pt-12">
              <div className="lg:col-span-4">
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-text-light-body mb-3">
                  — Принципы
                </div>
                <h3 className="font-serif text-2xl lg:text-3xl text-text-light-primary leading-tight">
                  Почему работают с {s.short}
                </h3>
              </div>
              <ul className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {s.principles.map((p) => (
                  <li key={p} className="flex items-start gap-3 py-2">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: s.accentColor + "20", color: s.accentColor }}
                    >
                      <Icon name="Check" size={13} />
                    </span>
                    <span className="text-text-light-primary text-sm lg:text-base leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-bg-dark py-24 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-serif text-4xl lg:text-5xl text-white leading-tight">
            Запрос в дочернюю компанию
          </h2>
          <p className="text-white/60 mt-6 leading-relaxed">
            По вопросам поставки строительных материалов и аренды спецтехники свяжитесь с офисом группы — мы перенаправим в нужную компанию.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/contacts"
              className="inline-flex items-center gap-2 bg-accent-coral text-white px-8 py-4 rounded-full text-sm font-medium hover:scale-[1.02] transition-transform"
            >
              Связаться с группой
              <Icon name="ArrowRight" size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

window.SubsidiariesPage = SubsidiariesPage;
