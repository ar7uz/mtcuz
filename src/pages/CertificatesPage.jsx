/* Certificates — /certificates
 * Dedicated, well-spaced layout for licenses and certifications.
 */

const CERTIFICATES = [
  {
    code: "ISO 9001:2015",
    category: "Международный стандарт",
    title: "Система менеджмента качества",
    body:
      "Управление качеством на всех этапах подряда — от тендерного предложения до сдачи объекта. Документирование процессов, контроль на стройплощадке, аудит подрядных работ.",
    issuer: "QUALITY MANAGEMENT LLC",
    valid: "до 30 мая 2028",
    icon: "ShieldCheck",
    accent: "#C9985C",
  },
  {
    code: "ISO 14001:2015",
    category: "Международный стандарт",
    title: "Система экологического менеджмента",
    body:
      "Контроль воздействия строительства на окружающую среду: утилизация отходов, водопользование, выбросы. Применяется на всех текущих и завершённых объектах MTC.",
    issuer: "QUALITY MANAGEMENT LLC",
    valid: "до 30 мая 2028",
    icon: "Leaf",
    accent: "#3B8C6E",
  },
  {
    code: "Категория C-CC",
    category: "Национальная сертификация РУз",
    title: "Допуск к строительным работам",
    body:
      "Подтверждённая категория в Национальной системе сертификации Республики Узбекистан. Допуск к жилым, общественным и государственным объектам.",
    issuer: "Национальная система сертификации РУз",
    valid: "Действующая",
    icon: "BadgeCheck",
    accent: "#063CA1",
  },
  {
    code: "Мувофиклик сертификати",
    category: "Сертификат соответствия",
    title: "Соответствие строительных работ",
    body:
      "Государственный сертификат соответствия выполняемых строительно-монтажных работ требованиям технических регламентов Республики Узбекистан.",
    issuer: "Уполномоченный орган РУз",
    valid: "Действующий",
    icon: "Stamp",
    accent: "#DA745C",
  },
  {
    code: "QUALITY MANAGEMENT",
    category: "Орган сертификации",
    title: "Аккредитованный сертификационный орган",
    body:
      "Партнёрский орган сертификации, проводивший аудит и выдавший сертификаты ISO 9001 и ISO 14001. Регулярный надзорный аудит — раз в год.",
    issuer: "QUALITY MANAGEMENT LLC",
    valid: "Партнёр по аудиту",
    icon: "FileCheck",
    accent: "#7A6FF0",
  },
  {
    code: "Реестр подрядчиков",
    category: "Государственный реестр",
    title: "Включение в реестр строительных подрядчиков",
    body:
      "Компания включена в государственный реестр подрядных организаций Республики Узбекистан с правом участия в тендерах на государственные объекты.",
    issuer: "Министерство строительства РУз",
    valid: "Действующее",
    icon: "FileSignature",
    accent: "#5C5550",
  },
];

window.CERTIFICATES = CERTIFICATES;

function CertificatesPage() {
  useEffect(() => { document.title = "Сертификаты — " + BRAND.full; }, []);

  return (
    <>
      <PageHero
        eyebrow="Документы"
        title="Сертификаты и лицензии"
        sub="Международные стандарты, национальная сертификация и государственные допуски. Полный пакет документов, по которым работает MTC."
        breadcrumbs={[
          { label: "Главная", to: "/" },
          { label: "Сертификаты", to: "/certificates" },
        ]}
      />

      {/* Quick summary row */}
      <section className="bg-bg-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {[
            ["2", "Международных ISO"],
            ["C-CC", "Категория в РУз"],
            ["2028", "Сертификаты до"],
            ["6", "Действующих документов"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="font-serif text-4xl lg:text-5xl text-accent-gold leading-none">{n}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 mt-4 leading-snug">
                {l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cards grid */}
      <section className="bg-bg-light py-24 lg:py-28 grain-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent-gold mb-3">
            — Полный пакет
          </div>
          <h2 className="font-serif text-4xl lg:text-5xl text-text-light-primary leading-tight tracking-tight max-w-3xl">
            Шесть документов, по которым принимаются объекты
          </h2>

          <motion.div
            {...staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-16"
          >
            {CERTIFICATES.map((c, i) => (
              <motion.article
                key={c.code}
                variants={childFade}
                className="bg-white rounded-2xl p-8 lg:p-9 border border-black/[0.05] shadow-sm flex flex-col"
              >
                {/* Header w/ ID strip */}
                <div className="flex items-start justify-between gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ background: c.accent + "1A", color: c.accent }}
                  >
                    <Icon name={c.icon} size={26} />
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-text-light-body/70 text-right leading-tight pt-1">
                    №&nbsp;{String(i + 1).padStart(2, "0")}<br />
                    <span className="text-accent-gold">{c.valid}</span>
                  </div>
                </div>

                <div
                  className="font-mono text-[10px] uppercase tracking-[0.18em] mt-7"
                  style={{ color: c.accent }}
                >
                  {c.category}
                </div>
                <div className="font-serif text-xl lg:text-[1.4rem] text-text-light-primary leading-tight mt-3">
                  {c.code}
                </div>
                <h3 className="text-base text-text-light-primary mt-4 leading-snug font-medium">
                  {c.title}
                </h3>
                <p className="text-text-light-body text-sm mt-4 leading-relaxed flex-1">
                  {c.body}
                </p>

                <div className="mt-7 pt-5 border-t border-black/[0.07] flex items-center justify-between gap-3">
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-wider text-text-light-body/70 mb-1">
                      Выдан
                    </div>
                    <div className="text-xs text-text-light-primary font-medium leading-tight">
                      {c.issuer}
                    </div>
                  </div>
                  <button className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-text-light-primary/70 hover:text-accent-coral hover:border-accent-coral transition-colors shrink-0">
                    <Icon name="Download" size={14} />
                  </button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What this means */}
      <section className="bg-bg-dark py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent-gold mb-5">
              — Что это значит на практике
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl text-white leading-tight tracking-tight">
              Документы — это не папка для тендера
            </h2>
            <p className="text-white/65 text-base mt-7 leading-relaxed">
              Каждый сертификат — это процесс на стройплощадке. ISO 9001 — это документация по подряду. ISO 14001 — это утилизация. C-CC — допуск к ответственным объектам. По каждому контракту мы предоставляем выписки и копии.
            </p>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              ["Аудит раз в год", "Регулярный надзорный аудит подтверждает действие сертификатов ISO."],
              ["Документация по каждому объекту", "Журналы работ, исполнительная документация, акты приёмки."],
              ["Допуск к госзаказам", "Категория C-CC даёт право подавать заявки на государственные объекты."],
              ["Экологический контроль", "Утилизация строительных отходов и контроль выбросов — по ISO 14001."],
            ].map(([t, d]) => (
              <div
                key={t}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 lg:p-7"
              >
                <h4 className="font-serif text-lg text-white leading-tight">{t}</h4>
                <p className="text-white/60 text-sm mt-3 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bg-dark border-t border-white/10 py-20 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-serif text-3xl lg:text-4xl text-white leading-tight">
            Нужны выписки и копии?
          </h2>
          <p className="text-white/60 mt-5 leading-relaxed">
            По запросу предоставим заверенные копии сертификатов и сопроводительные документы для тендерной комиссии.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={`mailto:${BRAND.email}`}
              className="inline-flex items-center gap-2 bg-accent-coral text-white px-7 py-3.5 rounded-full text-sm font-medium hover:scale-[1.02] transition-transform"
            >
              Запросить копии
              <Icon name="ArrowRight" size={16} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

window.CertificatesPage = CertificatesPage;
