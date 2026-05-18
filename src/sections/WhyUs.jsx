/* Section 06 — Why Us (Dark) */

const WHY_US = [
  {
    icon: "Building2",
    title: "Полный цикл",
    description:
      "От проектирования до сдачи «под ключ». Жилые и коммерческие здания, металлоконструкции любой сложности, отделочные работы — всё внутри компании.",
  },
  {
    icon: "ShieldCheck",
    title: "ISO 9001 и ISO 14001",
    description:
      "Сертификаты системы менеджмента качества и экологического менеджмента, выданные QUALITY MANAGEMENT LLC. Действуют до мая 2028 года.",
  },
  {
    icon: "BadgeCheck",
    title: "Категория C-CC",
    description:
      "Подтверждённая категория в Национальной системе сертификации Республики Узбекистан. Допуск к объектам жилого, общественного и государственного назначения.",
  },
  {
    icon: "Users",
    title: "147 сотрудников",
    description:
      "Собственный штат: 4 отдела (строительный, геодезия, ПТО, финансы), три бригады по 100 рабочих, 50-местный автобус и 9 жилых контейнеров для размещения бригад.",
  },
];

function WhyUs() {
  return (
    <section
      id="whyus"
      className="bg-bg-dark py-24 lg:py-32 scroll-mt-24"
    >
      <SectionHead
        eyebrow="Почему MTC"
        title="Четыре причины, по которым нас выбирают"
        sub="Не маркетинговые обещания, а пункты, подтверждённые сертификатами и портфелем."
        dark
      />
      <motion.div
        {...staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-6 lg:px-20 mt-16"
      >
        {WHY_US.map((item) => (
          <motion.div
            key={item.title}
            variants={childFade}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-accent-coral/10 text-accent-coral flex items-center justify-center mb-6">
              <Icon name={item.icon} size={22} />
            </div>
            <h3 className="font-serif text-xl text-white mb-3 leading-snug">
              {item.title}
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

window.WhyUs = WhyUs;
