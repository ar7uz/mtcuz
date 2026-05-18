/* Section 08 — Process Timeline */

const STEPS = [
  {
    title: "ТЗ и оценка",
    description: "Анализ технического задания, выезд на участок, расчёт бюджета и сметы",
  },
  {
    title: "Проектирование",
    description: "Рабочая документация, согласование с заказчиком и госорганами",
  },
  {
    title: "Договор",
    description: "Подрядный договор, график работ, гарантийные обязательства",
  },
  {
    title: "Строительство",
    description:
      "Геодезия, нулевой цикл, монтаж, отделка, инженерные системы — всё своими бригадами",
  },
  {
    title: "Сдача",
    description: "Приёмо-сдаточная комиссия, благоустройство территории, гарантийные обязательства",
  },
];

function ProcessTimeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 30%"],
  });
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="bg-bg-light py-24 lg:py-32 grain-light">
      <SectionHead
        eyebrow="Процесс работы"
        title="От ТЗ до сдачи объекта"
      />

      {/* Desktop horizontal */}
      <div className="hidden lg:block relative max-w-7xl mx-auto px-6 lg:px-20 mt-20">
        <div className="relative">
          {/* Track */}
          <div className="absolute top-12 left-0 right-0 h-px bg-black/10" />
          {/* Filled progress */}
          <motion.div
            style={{ width: lineWidth }}
            className="absolute top-12 left-0 h-px bg-accent-gold"
          />
          {/* Steps */}
          <div className="relative grid grid-cols-5 gap-4">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                variants={childFade}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease, delay: i * 0.08 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-bg-light border-2 border-accent-gold flex items-center justify-center mb-6 relative z-10">
                  <span className="font-mono text-lg text-accent-gold">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-text-light-primary mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-text-light-body max-w-[200px] leading-relaxed">
                  {s.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile vertical */}
      <div className="lg:hidden flex flex-col gap-10 max-w-2xl mx-auto px-6 mt-16">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.title}
            variants={childFade}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease, delay: i * 0.05 }}
            className="flex gap-5"
          >
            <div className="w-16 h-16 rounded-full bg-bg-light border-2 border-accent-gold flex items-center justify-center shrink-0">
              <span className="font-mono text-base text-accent-gold">
                0{i + 1}
              </span>
            </div>
            <div className="pt-2">
              <h3 className="font-serif text-xl text-text-light-primary mb-1">
                {s.title}
              </h3>
              <p className="text-sm text-text-light-body leading-relaxed">
                {s.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

window.ProcessTimeline = ProcessTimeline;
