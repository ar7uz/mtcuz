/* Section 04 — Hero Light (interior image stand-in for video) */

function HeroLight() {
  return (
    <section className="bg-bg-light min-h-[700px] grain-light">
      <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[700px]">
        {/* Image (was video) */}
        <div className="relative h-[420px] lg:h-auto lg:col-span-3 overflow-hidden">
          <video
            src={R("videos/hero-light.mp4")}
            poster={R("images/hero-light.jpg")}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* Text */}
        <div className="lg:col-span-2 flex flex-col justify-center px-6 lg:px-16 py-14 lg:py-12">
          <motion.div
            {...fadeUp}
            className="font-mono text-xs uppercase tracking-[0.2em] text-accent-gold"
          >
            — Наш подход
          </motion.div>
          <motion.h2
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="font-serif font-medium tracking-tight text-5xl lg:text-7xl text-text-light-primary mt-6 leading-[1.05]"
          >
            <span className="block">От проекта</span>
            <em className="block italic font-light">до сдачи</em>
            <span className="block">«под ключ»</span>
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="text-text-light-body text-lg max-w-sm mt-8 leading-relaxed"
          >
            Полный цикл строительных и ремонтных работ — от проектирования и металлоконструкций до благоустройства территории.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.3 }}
            className="w-fit mt-9"
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 bg-text-light-primary text-white px-7 py-3.5 rounded-full text-sm font-medium hover:bg-accent-coral transition-colors"
            >
              Посмотреть объекты
              <Icon name="ArrowRight" size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

window.HeroLight = HeroLight;
