/* Section 02 — Hero Dark
 * Spec called for /videos/hero-dark.mp4 — user will swap later.
 * Drop-in slot is marked below. For now we use a static rendering.
 */

function HeroDark() {
  const stats = [
    ["12", "сданных объектов"],
    ["5", "в работе"],
    ["147", "сотрудников"],
    ["5M $", "годовой оборот"],
  ];

  return (
    <section
      id="top"
      className="relative h-screen min-h-[800px] overflow-hidden bg-bg-dark"
    >
      {/* Video background (with jpg poster fallback) */}
      <video
        src={R("videos/hero-dark.webm")}
        poster={R("images/hero-dark.jpg")}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-70 pointer-events-none"
        aria-hidden="true"
      />

      {/* Readability gradient (left) */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-bg-dark/95 via-bg-dark/55 to-bg-dark/10 pointer-events-none"
        aria-hidden="true"
      />
      {/* Bottom blend gradient */}
      <div
        className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-b from-transparent to-bg-dark pointer-events-none"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20 h-full flex flex-col justify-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease }}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white/80 w-fit"
        >
          <Icon name="Sparkles" size={14} className="text-accent-gold" />
          <span>Генеральный подряд полного цикла · Ташкент</span>
        </motion.div>

        {/* H1 — three lines */}
        <h1 className="font-serif font-medium tracking-tight leading-[0.92] text-white text-6xl md:text-8xl lg:text-9xl mt-8 max-w-5xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9, ease }}
            className="block"
          >
            Объекты,
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.9, ease }}
            className="block"
          >
            которые
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.9, ease }}
            className="block"
          >
            остаются
          </motion.span>
        </h1>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease }}
          className="font-sans text-base md:text-lg text-white/70 max-w-md mt-8 leading-relaxed"
        >
          ООО «Millennium Time Commerce» — генеральный подрядчик полного цикла.
          Жильё, инфраструктура, госзаказ. ISO 9001 и ISO 14001.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8, ease }}
          className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4"
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 bg-accent-coral text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm font-medium hover:scale-[1.02] transition-transform"
          >
            Наши объекты
            <Icon name="ArrowRight" size={18} />
          </Link>
          <Link
            to="/contacts"
            className="inline-flex items-center gap-2 border border-white/20 bg-white/5 backdrop-blur-sm text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Связаться
            <Icon name="ArrowRight" size={16} />
          </Link>
        </motion.div>
      </div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8, ease }}
        className="absolute bottom-10 lg:bottom-14 inset-x-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-20 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs sm:text-sm text-white/50 uppercase tracking-wider">
          {stats.flatMap(([n, l], i) => {
            const items = [
              <span key={l}>
                <span className="text-white/80">{n}</span> {l}
              </span>,
            ];
            if (i < stats.length - 1) {
              items.push(
                <span key={l + "-sep"} className="text-white/20" aria-hidden="true">
                  ·
                </span>
              );
            }
            return items;
          })}
        </div>
      </motion.div>
    </section>
  );
}

window.HeroDark = HeroDark;
