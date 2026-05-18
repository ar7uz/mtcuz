/* Section 09 — Government & Tenders (Dark) — uses GOV_CASES data file */

const CHECKLIST = [
  "Категория C-CC в Национальной системе сертификации РУз",
  "Опыт работы с МВД РУз, хокимиятом и частными заказчиками",
  "Сдача объектов в срок и в рамках бюджета",
  "ISO 9001:2015 и ISO 14001:2015 до 30.05.2028",
];;

function Government() {
  return (
    <section
      id="government"
      className="bg-bg-dark py-24 lg:py-32 scroll-mt-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-7xl mx-auto px-6 lg:px-20 items-start">
        {/* Left */}
        <div>
          <motion.div
            {...fadeUp}
            className="font-mono text-xs uppercase tracking-[0.2em]"
            style={{ color: "#3D6BC4" }}
          >
            — Государственные, общественные и частные объекты
          </motion.div>
          <Link to="/projects" className="block group">
            <motion.h2
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="font-serif font-medium text-4xl lg:text-5xl text-white leading-tight mt-6 tracking-tight group-hover:text-accent-gold transition-colors"
            >
              Завершённые объекты
            </motion.h2>
          </Link>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="text-white/70 text-base lg:text-lg mt-6 leading-relaxed max-w-xl"
          >
            Академия МВД, ГУВД Ангрен, Спорткомплекс, British School of Tashkent, холодильная база. 12 сданных объектов — от реконструкции школ до промышленных и общественных объектов.
          </motion.p>

          <motion.ul
            {...staggerContainer}
            className="space-y-3 mt-8 max-w-xl"
          >
            {CHECKLIST.map((item) => (
              <motion.li
                key={item}
                variants={childFade}
                className="flex items-center gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-accent-gold/20 text-accent-gold flex items-center justify-center shrink-0">
                  <Icon name="Check" size={14} />
                </span>
                <span className="text-white/80 text-sm leading-snug">{item}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.4 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-white px-7 py-3.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
              style={{ background: "#063CA1" }}
            >
              Смотреть все объекты
              <Icon name="ArrowRight" size={16} />
            </Link>
            <a
              href="#"
              className="inline-flex items-center gap-2 border border-white/20 bg-white/5 text-white px-7 py-3.5 rounded-full text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Скачать презентацию
              <Icon name="Download" size={16} />
            </a>
          </motion.div>
        </div>

        {/* Right — case cards */}
        <motion.div {...staggerContainer} className="space-y-4">
          {GOV_CASES.slice(0, 4).map((c) => (
            <motion.div key={c.slug} variants={childFade}>
              <Link
                to={`/projects/${c.slug}`}
                className="flex gap-4 items-center bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/[0.08] hover:border-white/20 transition-all"
              >
                <img
                  src={c.image}
                  alt={c.fullName}
                  loading="lazy"
                  className="w-28 h-20 lg:w-32 lg:h-24 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-base lg:text-lg text-white leading-tight">
                    {c.fullName}
                  </h4>
                  <p className="text-[10px] lg:text-xs text-white/50 uppercase tracking-wider mt-1.5">
                    {c.customer}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs">
                    <span className="text-accent-gold font-mono">{c.budget}</span>
                    <span className="text-white/40">Сдан {c.year}</span>
                  </div>
                </div>
                <Icon name="ArrowRight" size={16} className="text-white/40 shrink-0" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

window.Government = Government;
