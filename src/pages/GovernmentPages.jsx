/* Government — /government (list) and /government/:slug (case detail) */

function GovernmentPage() {
  useEffect(() => { document.title = "Госзаказы — " + BRAND.full; }, []);

  const numbers = [
    { value: "12", label: "Объектов сдано" },
    { value: "5", label: "В активной работе" },
    { value: "5M $", label: "Годовой оборот" },
    { value: "C-CC", label: "Нац. рейтинг РУз" },
  ];

  const certs = [
    { name: "ISO 9001:2015", num: "СМК · до 30.05.2028" },
    { name: "ISO 14001:2015", num: "Экология · до 30.05.2028" },
    { name: "Национальная система сертификации РУз", num: "Категория C-CC" },
    { name: "Мувофиклик сертификати", num: "Строительные работы" },
    { name: "QUALITY MANAGEMENT LLC", num: "Орган сертификации" },
    { name: "Материально-тех. база", num: "Автобус 50 мест + 9 контейнеров" },
  ];

  return (
    <>
      <PageHero
        eyebrow="Госзаказы"
        title="Опыт работы с государственными и крупными заказчиками"
        sub="Академия МВД, ГУВД Ангрен, Спорткомплекс на ул. Чинобод, British School of Tashkent, холодильная база, школа на Глинка. Каждый объект сдан в срок и в полном соответствии с техническим заданием."
        image={R("images/gov-01-hospital.jpg")}
        breadcrumbs={[
          { label: "Главная", to: "/" },
          { label: "Госзаказы", to: "/government" },
        ]}
      />

      {/* Numbers */}
      <section className="bg-bg-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 py-16 lg:py-20 grid grid-cols-2 lg:grid-cols-4 gap-10">
          {numbers.map((n) => (
            <div key={n.label}>
              <div className="font-serif text-4xl lg:text-5xl text-accent-gold leading-none">{n.value}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 mt-4">
                {n.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cases */}
      <section className="bg-bg-light py-24 lg:py-28 grain-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <SectionHead
            eyebrow="Кейсы"
            title="Реализованные объекты"
            sub="Каждый проект сдан в срок и в соответствии с техническим заданием заказчика."
          />
          <motion.div
            {...staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-16"
          >
            {GOV_CASES.map((c) => (
              <motion.article key={c.slug} variants={childFade}>
                <Link
                  to={`/government/${c.slug}`}
                  className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-shadow duration-500 flex flex-col h-full"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={c.image}
                      alt={c.fullName}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Contractor seal */}
                    <BrandSeal size={44} className="absolute top-4 right-4" />
                  </div>
                  <div className="p-6 lg:p-7 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-text-light-body">
                        {c.year}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-accent-coral">
                        {c.budget}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl lg:text-2xl text-text-light-primary leading-tight">
                      {c.fullName}
                    </h3>
                    <p className="text-sm text-text-light-body mt-3 leading-relaxed flex-1">
                      Заказчик — {c.customer}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-5 text-accent-coral font-medium text-sm group-hover:gap-2 transition-all">
                      Подробнее <Icon name="ArrowRight" size={16} />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Certificates */}
      <section className="bg-bg-light py-24 lg:py-28 border-t border-black/10 grain-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <SectionHead eyebrow="Документы" title="Лицензии и сертификаты" />
          <motion.div
            {...staggerContainer}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 mt-16"
          >
            {certs.map((c) => (
              <motion.div
                key={c.name}
                variants={childFade}
                className="bg-white rounded-2xl p-6 lg:p-8 border border-black/[0.05] flex flex-col gap-3"
              >
                <Icon name="ShieldCheck" size={24} className="text-accent-gold" />
                <div className="font-serif text-base lg:text-lg text-text-light-primary leading-tight">{c.name}</div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-text-light-body mt-auto">{c.num}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bg-dark py-24 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-serif text-4xl lg:text-5xl text-white leading-tight">
            Запрос на тендер
          </h2>
          <p className="text-white/60 mt-6 leading-relaxed">
            Подрядный отдел подберёт документы под ваше техническое задание и подготовит коммерческое предложение в течение 3 рабочих дней.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href={`mailto:${BRAND.email}`}
              className="inline-flex items-center gap-2 bg-accent-coral text-white px-8 py-4 rounded-full text-sm font-medium hover:scale-[1.02] transition-transform"
            >
              Связаться с подрядным отделом
              <Icon name="ArrowRight" size={18} />
            </a>
            <button className="inline-flex items-center gap-2 border border-white/20 bg-white/5 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
              Скачать презентацию
              <Icon name="Download" size={16} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function GovernmentCasePage() {
  const { slug } = useParams("/government/:slug");
  const c = getGovCaseBySlug(slug);

  useEffect(() => {
    if (c) document.title = `${c.fullName} — ${BRAND.full}`;
  }, [c]);

  if (!c) return <NotFoundPage />;

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[480px] overflow-hidden bg-bg-dark">
        <img
          src={c.image}
          alt={c.fullName}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-bg-dark/30" aria-hidden="true" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20 h-full flex flex-col justify-end pb-16 pt-28">
          <Breadcrumbs
            items={[
              { label: "Главная", to: "/" },
              { label: "Госзаказы", to: "/government" },
              { label: c.name, to: `/government/${c.slug}` },
            ]}
          />
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.15em] font-medium w-fit mt-8 mb-5 bg-accent-gold/20 text-accent-gold border border-accent-gold/30">
            Сдан в {c.year}
          </span>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95] tracking-tight">
            {c.fullName}
          </h1>
        </div>
      </section>

      {/* Contract meta */}
      <section className="bg-bg-light border-b border-black/10 grain-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-light-body">Заказчик</div>
            <div className="font-serif text-lg text-text-light-primary mt-2 leading-snug">{c.customer}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-light-body">Бюджет</div>
            <div className="font-serif text-2xl text-accent-coral mt-2">{c.budget}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-light-body">Площадь</div>
            <div className="font-serif text-2xl text-text-light-primary mt-2">{c.area}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-light-body">Сдача</div>
            <div className="font-serif text-2xl text-text-light-primary mt-2">{c.deadline}</div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="bg-bg-light py-24 lg:py-28 grain-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <div className="lg:col-span-2">
            <motion.div {...fadeUp} className="font-mono text-xs uppercase tracking-[0.2em] text-accent-gold mb-5">
              — Описание контракта
            </motion.div>
            <motion.h2 {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="font-serif text-4xl lg:text-5xl text-text-light-primary leading-tight">
              {c.name}
            </motion.h2>
            <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }} className="text-text-light-body text-lg leading-relaxed mt-8 max-w-xl">
              {c.description}
            </motion.p>
          </div>
          <aside>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-accent-gold mb-6">
              — Технические характеристики
            </h3>
            <dl className="space-y-0">
              {c.specs.map((s) => (
                <div key={s.label} className="flex justify-between py-3 border-b border-black/5 gap-4">
                  <dt className="text-text-light-body text-sm">{s.label}</dt>
                  <dd className="font-mono text-sm text-text-light-primary text-right">{s.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {/* Gallery / image full-bleed */}
      <section className="bg-bg-light py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="aspect-[16/9] rounded-2xl overflow-hidden">
            <img src={c.image} alt="" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bg-dark py-24 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-serif text-4xl lg:text-5xl text-white leading-tight">
            Похожий объект в работе?
          </h2>
          <p className="text-white/60 mt-6 leading-relaxed">
            Подрядный отдел готов обсудить ваше техническое задание и подготовить коммерческое предложение.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href={`mailto:${BRAND.email}`}
              className="inline-flex items-center gap-2 bg-accent-coral text-white px-8 py-4 rounded-full text-sm font-medium hover:scale-[1.02] transition-transform"
            >
              Связаться с подрядным отделом
              <Icon name="ArrowRight" size={18} />
            </a>
            <button className="inline-flex items-center gap-2 border border-white/20 bg-white/5 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
              Скачать кейс PDF
              <Icon name="Download" size={16} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

Object.assign(window, { GovernmentPage, GovernmentCasePage });
