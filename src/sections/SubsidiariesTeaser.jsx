/* Section 11 — Subsidiaries teaser (group companies) */

function SubsidiariesTeaser() {
  const items = (window.SUBSIDIARIES || []).map((s) => ({
    slug: s.slug,
    name: s.short,
    fullName: s.name,
    role: s.role,
    tagline: s.tagline,
    icon: s.slug === "nilstroy" ? "Package" : "Truck",
    accent: s.accentColor,
    stats: s.stats,
  }));

  return (
    <section id="subsidiaries" className="bg-bg-light py-24 lg:py-32 grain-light border-t border-black/5 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            <motion.div {...fadeUp} className="font-mono text-xs uppercase tracking-[0.2em] text-accent-gold">
              — Группа компаний
            </motion.div>
            <motion.h2
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="font-serif font-medium text-4xl md:text-5xl lg:text-6xl text-text-light-primary mt-5 leading-[1.0] tracking-tight"
            >
              MTC — это не только<br />генеральный подряд
            </motion.h2>
          </div>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="lg:col-span-5 text-text-light-body text-base lg:text-lg leading-relaxed max-w-xl"
          >
            Дочерние компании группы закрывают смежные направления — от поставки строительных материалов до аренды спецтехники. Единая инфраструктура, синхронные сроки на объектах.
          </motion.p>
        </div>

        <motion.div
          {...staggerContainer}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {items.map((s) => (
            <motion.div key={s.slug} variants={childFade}>
              <Link
                to={`/subsidiaries#${s.slug}`}
                className="group block bg-white rounded-2xl p-8 lg:p-10 border border-black/[0.05] shadow-sm hover:shadow-2xl transition-shadow duration-500 h-full"
              >
                <div className="flex items-start gap-5">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: s.accent + "1A", color: s.accent }}
                  >
                    <Icon name={s.icon} size={24} />
                  </div>
                  <div className="flex-1">
                    <div
                      className="font-mono text-[10px] uppercase tracking-[0.18em]"
                      style={{ color: s.accent }}
                    >
                      {s.role}
                    </div>
                    <div className="font-serif text-2xl lg:text-3xl text-text-light-primary mt-2 leading-tight">
                      {s.fullName}
                    </div>
                  </div>
                </div>

                <p className="text-text-light-body text-sm lg:text-base mt-7 leading-relaxed">
                  {s.tagline}
                </p>

                <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-black/[0.07]">
                  {s.stats.map((st) => (
                    <div key={st.label}>
                      <div className="font-serif text-2xl lg:text-3xl text-text-light-primary leading-none">
                        {st.value}
                      </div>
                      <div className="font-mono text-[9px] uppercase tracking-wider text-text-light-body mt-2 leading-snug">
                        {st.label}
                      </div>
                    </div>
                  ))}
                </div>

                <span className="inline-flex items-center gap-1 mt-7 text-accent-coral font-medium text-sm group-hover:gap-2 transition-all">
                  Подробнее о компании <Icon name="ArrowRight" size={16} />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

window.SubsidiariesTeaser = SubsidiariesTeaser;
