/* Projects list — /projects
 * Unified portfolio: current construction sites + completed objects.
 */

function CompletedCard({ c, index }) {
  return (
    <motion.article variants={childFade}>
      <Link
        to={`/government/${c.slug}`}
        className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-shadow duration-500 flex flex-col h-full"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={c.image}
            alt={c.fullName}
            loading={index === 0 ? "eager" : "lazy"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium bg-accent-gold/20 text-accent-gold border border-accent-gold/40 backdrop-blur-sm">
            Сдан
          </span>
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
          <h3 className="font-serif text-xl text-text-light-primary leading-tight">
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
  );
}

function ProjectsListPage() {
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    document.title = "Объекты — " + BRAND.full;
  }, []);

  // Sync tab to hash on mount/change
  useEffect(() => {
    const h = window.location.hash;
    if (h.includes("#completed")) setFilter("completed");
    else if (h.includes("#current")) setFilter("current");
  }, []);

  const counts = {
    all: PROJECTS_DATA.length + GOV_CASES.length,
    current: PROJECTS_DATA.length,
    completed: GOV_CASES.length,
  };
  const filters = [
    { id: "all", label: "Все" },
    { id: "current", label: "В работе" },
    { id: "completed", label: "Сданы" },
  ];

  const showCurrent = filter === "all" || filter === "current";
  const showCompleted = filter === "all" || filter === "completed";

  return (
    <>
      <PageHero
        eyebrow="Портфолио"
        title="Объекты MTC"
        sub="Все объекты компании — действующие стройплощадки и завершённые подряды. Жилые комплексы, образовательные и общественные здания, промышленные объекты."
        breadcrumbs={[
          { label: "Главная", to: "/" },
          { label: "Объекты", to: "/projects" },
        ]}
      />

      {/* Filters */}
      <section className="bg-bg-light grain-light border-b border-black/5 sticky top-16 lg:top-20 z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 py-5 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === f.id
                  ? "bg-text-light-primary text-white"
                  : "bg-white text-text-light-primary hover:bg-text-light-primary/5 border border-black/5"
              }`}
            >
              {f.label}
              <span className="ml-2 font-mono text-xs opacity-50">
                {counts[f.id]}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Current — жилые комплексы в работе */}
      {showCurrent && (
        <section id="current" className="bg-bg-light pt-16 lg:pt-24 pb-12 grain-light">
          <div className="max-w-7xl mx-auto px-6 lg:px-20">
            <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent-gold mb-3">
                  — Текущие объекты
                </div>
                <h2 className="font-serif text-4xl lg:text-5xl text-text-light-primary leading-tight tracking-tight max-w-2xl">
                  Жилые комплексы в активной работе
                </h2>
              </div>
              <div className="font-mono text-sm text-text-light-body">
                {PROJECTS_DATA.length} объектов · Бостанлыкский район
              </div>
            </div>

            <motion.div
              {...staggerContainer}
              key={"current-" + filter}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {PROJECTS_DATA.map((p, i) => (
                <ProjectCard key={p.slug} p={p} index={i} />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Completed — реализованные подряды */}
      {showCompleted && (
        <section id="completed" className="bg-bg-light pt-16 lg:pt-24 pb-24 lg:pb-32 grain-light border-t border-black/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-20">
            <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent-gold mb-3">
                  — Завершённые объекты
                </div>
                <h2 className="font-serif text-4xl lg:text-5xl text-text-light-primary leading-tight tracking-tight max-w-2xl">
                  Сданные подряды
                </h2>
                <p className="text-text-light-body mt-4 max-w-xl leading-relaxed">
                  Государственные и частные заказы — школы, спорткомплексы, административные и промышленные здания.
                </p>
              </div>
              <div className="font-mono text-sm text-text-light-body">
                {GOV_CASES.length} объектов сдано
              </div>
            </div>

            <motion.div
              {...staggerContainer}
              key={"completed-" + filter}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {GOV_CASES.map((c, i) => (
                <CompletedCard key={c.slug} c={c} index={i} />
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </>
  );
}

window.ProjectsListPage = ProjectsListPage;
