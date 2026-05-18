/* Section 07 — Scale Numbers */

const NUMBERS = [
  { value: 12, format: (v) => "+" + Math.round(v), label: "Сданных объектов" },
  { value: 5, format: (v) => "+" + Math.round(v), label: "Объектов в работе" },
  {
    value: 147,
    format: (v) => Math.round(v).toLocaleString("ru-RU"),
    label: "Сотрудников в штате",
  },
  { value: 5, format: (v) => `+${Math.round(v)}M $`, label: "Годовой оборот" },
];

function ScaleNumbers() {
  return (
    <section className="bg-bg-light py-24 lg:py-32 grain-light">
      <SectionHead
        eyebrow="Цифры компании"
        title="Портфель MTC в цифрах 2026 года"
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-2 max-w-7xl mx-auto px-6 lg:px-20 mt-16">
        {NUMBERS.map((n, i) => (
          <motion.div
            key={n.label}
            variants={childFade}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease, delay: i * 0.05 }}
            className={`text-center px-4 ${
              i < NUMBERS.length - 1 ? "lg:border-r lg:border-black/10" : ""
            }`}
          >
            <div className="font-mono text-5xl lg:text-7xl text-accent-gold font-medium">
              <Counter to={n.value} format={n.format} />
            </div>
            <div className="text-xs lg:text-sm text-text-light-body mt-3 uppercase tracking-wider">
              {n.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

window.ScaleNumbers = ScaleNumbers;
