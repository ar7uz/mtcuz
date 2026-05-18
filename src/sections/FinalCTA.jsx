/* Section 12 — Final CTA — soft, introductory tone */

function FinalCTA() {
  return (
    <section
      id="cta"
      className="relative bg-bg-dark py-28 lg:py-32 overflow-hidden scroll-mt-24"
    >
      <video
        src={R("videos/hero-dark.webm")}
        poster={R("images/hero-dark.jpg")}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-bg-dark/80 via-bg-dark/60 to-bg-dark/80 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.div
          {...fadeUp}
          className="font-mono text-xs uppercase tracking-[0.2em] text-accent-gold"
        >
          — Знакомство с компанией
        </motion.div>
        <motion.h2
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="font-serif font-medium text-4xl md:text-5xl lg:text-6xl text-white leading-[1.05] tracking-tight mt-5"
        >
          Строительная компания
          <br />
          полного цикла
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.2 }}
          className="text-white/70 text-base lg:text-lg mt-6 max-w-xl mx-auto leading-relaxed"
        >
          ООО «Millennium Time Commerce» — Ташкент. Полный цикл строительных работ, собственный штат, группа компаний. Познакомьтесь с нашими объектами и структурой.
        </motion.p>
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center items-center gap-3 sm:gap-4"
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 bg-accent-coral text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm font-medium hover:scale-[1.02] transition-transform"
          >
            Посмотреть объекты
            <Icon name="ArrowRight" size={18} />
          </Link>
          <Link
            to="/contacts"
            className="inline-flex items-center gap-2 border border-white/25 bg-white/5 backdrop-blur-sm text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Связаться с офисом
            <Icon name="ArrowRight" size={16} />
          </Link>
        </motion.div>
        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.4 }}
          className="text-xs text-white/40 mt-6"
        >
          Офис в Юнусабадском районе Ташкента · Пн–Пт 9:00–18:00
        </motion.p>
      </div>
    </section>
  );
}

window.FinalCTA = FinalCTA;
