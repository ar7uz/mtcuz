/* Section 05 — Featured Projects (reads from PROJECTS_DATA, cards link to /projects/:slug) */

function ProjectCard({ p, index }) {
  return (
    <motion.article variants={childFade}>
      <Link
        to={`/projects/${p.slug}`}
        className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-shadow duration-500 cursor-pointer flex flex-col h-full"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={p.mainImage}
            alt={p.fullName}
            loading={index === 0 ? "eager" : "lazy"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <span
            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium ${p.statusClass}`}
          >
            {p.statusLabel}
          </span>
          {/* Contractor seal — small circular monogram mirrors the status badge on the right */}
          <BrandSeal size={44} className="absolute top-4 right-4" />
        </div>
        <div className="p-6 lg:p-8 flex-1 flex flex-col">
          <h3 className="font-serif text-2xl text-text-light-primary leading-tight">
            {p.fullName}
          </h3>
          <p className="flex items-center gap-1.5 text-sm text-text-light-body mt-1.5">
            <Icon name="MapPin" size={14} /> {p.location}
          </p>
          <hr className="border-black/[0.07] my-5" />
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
            {[
              ["Статус", p.delivery],
              ["Этажность", p.floors],
              ["Объём", p.apartmentsFrom],
              ["Роль", p.priceFrom],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-text-light-body text-[10px] uppercase tracking-wider">
                  {k}
                </dt>
                <dd className="text-text-light-primary font-medium mt-1 font-mono">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
          <span className="inline-flex items-center gap-1 mt-6 text-accent-coral font-medium text-sm group-hover:gap-2 transition-all">
            Подробнее <Icon name="ArrowRight" size={16} />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

function FeaturedProjects() {
  return (
    <section
      id="projects"
      className="bg-bg-light py-24 lg:py-32 scroll-mt-24 grain-light"
    >
      <SectionHead
        eyebrow="Текущие объекты"
        title="Жилые комплексы в работе"
        sub="+15 сданных объектов и +5 в активной работе. Ниже — жилые комплексы, где MTC выступает генеральным подрядчиком."
      />
      <motion.div
        {...staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto px-6 lg:px-20 mt-16"
      >
        {PROJECTS_DATA.map((p, i) => (
          <ProjectCard key={p.slug} p={p} index={i} />
        ))}
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 lg:px-20 mt-12 flex justify-center">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 bg-text-light-primary text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-accent-coral transition-colors"
        >
          Все объекты
          <Icon name="ArrowRight" size={18} />
        </Link>
      </div>
    </section>
  );
}

window.FeaturedProjects = FeaturedProjects;
window.ProjectCard = ProjectCard;
