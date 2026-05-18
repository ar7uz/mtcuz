/* Project detail — /projects/:slug
 * Sections:  Hero · Quick stats · About · Plans · Location · Construction · Mortgage · Similar · CTA
 */

function priceFmt(n) {
  if (!isFinite(n)) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + " млн ₽";
  if (n >= 1_000) return Math.round(n / 1000) + " тыс ₽";
  return Math.round(n) + " ₽";
}

function Stat({ label, value, accent }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-light-body">
        {label}
      </div>
      <div
        className={`font-serif text-2xl lg:text-3xl mt-2 leading-tight ${
          accent ? "text-accent-coral" : "text-text-light-primary"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function PlanPlaceholder({ rooms }) {
  // Simple schematic — boxes laid out roughly. Premium without being fake-detailed.
  const layouts = {
    "Студия": [{ x: 5, y: 5, w: 90, h: 90 }],
    "1-комнатная": [
      { x: 5, y: 5, w: 55, h: 55 },
      { x: 62, y: 5, w: 33, h: 55 },
      { x: 5, y: 62, w: 90, h: 33 },
    ],
    "2-комнатная": [
      { x: 5, y: 5, w: 40, h: 45 },
      { x: 47, y: 5, w: 48, h: 45 },
      { x: 5, y: 52, w: 50, h: 43 },
      { x: 57, y: 52, w: 38, h: 43 },
    ],
    "3-комнатная": [
      { x: 5, y: 5, w: 35, h: 40 },
      { x: 42, y: 5, w: 30, h: 40 },
      { x: 74, y: 5, w: 21, h: 40 },
      { x: 5, y: 47, w: 50, h: 48 },
      { x: 57, y: 47, w: 38, h: 48 },
    ],
  };
  const rects = layouts[rooms] || layouts["Студия"];
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <rect x="2" y="2" width="96" height="96" fill="none" stroke="#1A1612" strokeWidth="0.6" opacity="0.3" />
      {rects.map((r, i) => (
        <rect
          key={i}
          x={r.x}
          y={r.y}
          width={r.w}
          height={r.h}
          fill="#1A1612"
          opacity="0.04"
          stroke="#1A1612"
          strokeWidth="0.4"
          strokeOpacity="0.35"
        />
      ))}
    </svg>
  );
}

function MortgageSlider({ label, min, max, step = 1, value, onChange, format }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <label className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/55">
          {label}
        </label>
        <span className="font-mono text-base text-white">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#DA745C] h-1"
      />
      <div className="flex justify-between font-mono text-[10px] text-white/30 mt-1.5">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

function MortgageCalculator({ priceFrom }) {
  const minPrice = priceFrom;
  const [price, setPrice] = useState(minPrice);
  const [down, setDown] = useState(Math.round(minPrice * 0.2));
  const [years, setYears] = useState(20);
  const rate = 0.001; // 0.1% — promo

  // Keep down ≤ 50% of price
  useEffect(() => {
    if (down > price * 0.5) setDown(Math.round(price * 0.5));
    if (down < price * 0.15) setDown(Math.round(price * 0.15));
  }, [price]);

  const monthly = useMemo(() => {
    const principal = price - down;
    const months = years * 12;
    const r = rate / 12;
    if (r === 0) return principal / months;
    return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  }, [price, down, years]);

  return (
    <section className="bg-bg-dark py-24 lg:py-28">
      <div className="max-w-5xl mx-auto px-6 lg:px-20">
        <motion.div {...fadeUp} className="font-mono text-xs uppercase tracking-[0.2em] text-accent-gold">
          — Калькулятор
        </motion.div>
        <motion.h2
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="font-serif text-4xl lg:text-5xl text-white mt-5 leading-tight"
        >
          Ипотечный калькулятор
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.2 }}
          className="text-white/55 mt-4 max-w-xl"
        >
          Партнёрская ставка от 0,1% годовых на первый год для покупателей наших ЖК.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 mt-12">
          <div className="space-y-8">
            <MortgageSlider
              label="Стоимость квартиры"
              min={minPrice}
              max={minPrice * 3}
              step={100_000}
              value={price}
              onChange={setPrice}
              format={priceFmt}
            />
            <MortgageSlider
              label="Первоначальный взнос"
              min={Math.round(price * 0.15)}
              max={Math.round(price * 0.5)}
              step={50_000}
              value={down}
              onChange={setDown}
              format={priceFmt}
            />
            <MortgageSlider
              label="Срок"
              min={5}
              max={30}
              step={1}
              value={years}
              onChange={setYears}
              format={(v) => `${v} лет`}
            />
          </div>

          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 mb-3">
                Ежемесячный платёж
              </div>
              <div className="font-serif text-5xl lg:text-6xl text-accent-gold leading-none">
                {priceFmt(monthly)}
              </div>
              <div className="mt-6 pt-6 border-t border-white/10 space-y-2 text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Сумма кредита</span>
                  <span className="font-mono text-white">{priceFmt(price - down)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Ставка</span>
                  <span className="font-mono text-white">0,1% годовых</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Срок</span>
                  <span className="font-mono text-white">{years} лет · {years * 12} мес</span>
                </div>
              </div>
            </div>
            <button className="w-full mt-8 bg-accent-coral text-white py-4 rounded-full hover:scale-[1.02] transition-transform font-medium">
              Подать заявку
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectDetailPage() {
  const { slug } = useParams("/projects/:slug");
  const project = getProjectBySlug(slug);

  useEffect(() => {
    if (project) document.title = `${project.fullName} — ${BRAND.full}`;
  }, [project]);

  if (!project) return <NotFoundPage />;

  const similar = PROJECTS_DATA.filter((p) => p.slug !== project.slug).slice(0, 2);

  return (
    <>
      {/* 01 — Hero */}
      <section className="relative h-[70vh] min-h-[560px] overflow-hidden bg-bg-dark">
        <img
          src={project.mainImage}
          alt={project.fullName}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/30 to-bg-dark/60" aria-hidden="true" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20 h-full flex flex-col justify-end pb-16 pt-28">
          <Breadcrumbs
            items={[
              { label: "Главная", to: "/" },
              { label: "Проекты", to: "/projects" },
              { label: project.fullName, to: `/projects/${project.slug}` },
            ]}
          />
          <span
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.15em] font-medium w-fit mt-8 mb-5 ${project.statusClass}`}
          >
            {project.statusLabel}
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="font-serif text-5xl md:text-6xl lg:text-8xl text-white leading-[0.95] tracking-tight"
          >
            {project.fullName}
          </motion.h1>
          <p className="flex items-center gap-2 text-white/70 mt-5 text-base lg:text-lg">
            <Icon name="MapPin" size={16} className="text-accent-gold" />
            {project.location} · {project.district}
          </p>
        </div>
      </section>

      {/* 02 — Quick stats */}
      <section className="bg-bg-light border-b border-black/10 grain-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <Stat label="Статус" value={project.delivery} />
          <Stat label="Этажность" value={project.floors} />
          <Stat label="Объём" value={project.apartmentsFrom} />
          <Stat label="Роль MTC" value={project.priceFrom} accent />
        </div>
      </section>

      {/* 03 — About */}
      <section className="bg-bg-light py-24 lg:py-28 grain-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <div className="lg:col-span-2">
            <motion.div {...fadeUp} className="font-mono text-xs uppercase tracking-[0.2em] text-accent-gold mb-5">
              — О проекте
            </motion.div>
            <motion.h2
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="font-serif text-4xl lg:text-5xl text-text-light-primary leading-tight"
            >
              {project.tier}. {project.fullName.replace("ЖК ", "")}
            </motion.h2>
            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.2 }}
              className="text-text-light-body text-lg leading-relaxed mt-8 max-w-xl"
            >
              {project.description}
            </motion.p>
            <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 max-w-xl">
              <Stat label="Стадия" value={project.pricePerMeter} />
              <Stat label="Тип" value={project.tier} />
            </div>
          </div>

          <aside>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-accent-gold mb-6">
              — Особенности
            </h3>
            <ul className="space-y-3.5">
              {project.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-text-light-body">
                  <Icon name="Check" size={18} className="text-accent-coral flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* 04 — Floor plans */}
      <section className="bg-bg-light py-24 lg:py-28 border-t border-black/10 grain-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <SectionHead
            eyebrow="Структура"
            title="Корпуса и блоки объекта"
          />
          <motion.div
            {...staggerContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mt-16"
          >
            {project.floorPlans.map((plan, i) => (
              <motion.article
                key={plan.rooms + i}
                variants={childFade}
                className="bg-white rounded-2xl p-5 lg:p-6 hover:shadow-xl transition-shadow cursor-pointer flex flex-col"
              >
                <div className="aspect-square bg-bg-light rounded-xl mb-5 p-3">
                  <PlanPlaceholder rooms={plan.rooms} />
                </div>
                <h3 className="font-serif text-lg lg:text-xl text-text-light-primary">{plan.rooms}</h3>
                <div className="flex justify-between items-baseline mt-3 pt-3 border-t border-black/5">
                  <span className="font-mono text-text-light-body text-sm">{plan.area}</span>
                  <span className="font-medium text-accent-coral text-sm">{plan.price}</span>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 05 — Location & infrastructure */}
      <section className="bg-bg-light py-24 lg:py-28 border-t border-black/10 grain-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <motion.div {...fadeUp} className="font-mono text-xs uppercase tracking-[0.2em] text-accent-gold mb-5">
              — Локация
            </motion.div>
            <motion.h2 {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="font-serif text-4xl lg:text-5xl text-text-light-primary leading-tight">
              {project.location}
            </motion.h2>
            <p className="text-text-light-body mt-5">{project.district}</p>

            {/* Stylised map */}
            <div className="aspect-[4/3] bg-text-light-primary/[0.04] rounded-2xl mt-8 relative overflow-hidden border border-black/[0.06]">
              <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <pattern id={`grid-${project.slug}`} width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#1A1612" strokeWidth="0.5" opacity="0.06" />
                  </pattern>
                </defs>
                <rect width="400" height="300" fill={`url(#grid-${project.slug})`} />
                {/* Stylized roads */}
                <path d="M 0 180 L 400 160" stroke="#1A1612" strokeWidth="1.5" opacity="0.08" fill="none" />
                <path d="M 120 0 L 140 300" stroke="#1A1612" strokeWidth="1.5" opacity="0.08" fill="none" />
                <path d="M 60 80 Q 200 100 380 60" stroke="#1A1612" strokeWidth="1" opacity="0.06" fill="none" />
                {/* Marker */}
                <circle cx="200" cy="150" r="42" fill="#DA745C" opacity="0.12" />
                <circle cx="200" cy="150" r="20" fill="#DA745C" opacity="0.2" />
                <circle cx="200" cy="150" r="6" fill="#DA745C" />
              </svg>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-text-light-body">Координаты</div>
                  <div className="font-mono text-sm text-text-light-primary mt-0.5">
                    {project.coordinates.lat}° N, {project.coordinates.lng}° E
                  </div>
                </div>
                <Icon name="Navigation" size={20} className="text-accent-coral" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-accent-gold mb-6">
              — Инфраструктура рядом
            </h3>
            <ul className="space-y-0">
              {project.infrastructure.map((item, i) => (
                <li key={item} className="flex items-start gap-4 py-5 border-b border-black/5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-text-light-body shrink-0 mt-1 w-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon name="MapPin" size={18} className="text-accent-coral flex-shrink-0 mt-0.5" />
                  <span className="text-text-light-body flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 06 — Construction progress (only for building) */}
      {project.status === "building" && project.constructionProgress.length > 0 && (
        <section className="bg-bg-light py-24 lg:py-28 border-t border-black/10 grain-light">
          <div className="max-w-7xl mx-auto px-6 lg:px-20">
            <SectionHead
              eyebrow="Ход стройки"
              title="Фото-отчёты с площадки"
              sub="Оперативная съёмка объекта. Прозрачно, без приукрашиваний."
            />
            <motion.div
              {...staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
            >
              {project.constructionProgress.map((report) => (
                <motion.article
                  key={report.month}
                  variants={childFade}
                  className="rounded-2xl overflow-hidden bg-white"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={report.image} alt={report.month} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-6">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-accent-gold">{report.month}</div>
                    <div className="font-serif text-lg text-text-light-primary mt-1.5">{report.status}</div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* 07 — Mortgage calculator (removed — MTC is general contractor, not seller) */}
      {/* <MortgageCalculator priceFrom={project.priceFromNum} /> */}

      {/* 08 — Similar projects */}
      <section className="bg-bg-light py-24 lg:py-28 grain-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <SectionHead eyebrow="Другие объекты" title="Ещё в работе у MTC" />
          <motion.div
            {...staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-16 max-w-5xl mx-auto"
          >
            {similar.map((p, i) => (
              <ProjectCard key={p.slug} p={p} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* 09 — CTA */}
      <section className="bg-bg-dark py-24 lg:py-28 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <motion.h2 {...fadeUp} className="font-serif text-4xl lg:text-5xl text-white leading-tight">
            Обсудить {project.fullName}?
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="text-white/60 mt-6 leading-relaxed"
          >
            Свяжитесь с подрядным отделом MTC — расскажем о ходе строительства, регламенте и сроках сдачи.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="mt-10 flex flex-wrap justify-center items-center gap-4"
          >
            <a
              href={BRAND.phoneHref}
              className="inline-flex items-center gap-2 bg-accent-coral text-white px-8 py-4 rounded-full text-sm font-medium hover:scale-[1.02] transition-transform"
            >
              Позвонить в компанию
              <Icon name="ArrowRight" size={18} />
            </a>
            <Link
              to="/contacts"
              className="inline-flex items-center gap-2 border border-white/20 bg-white/5 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Связаться с менеджером
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}

window.ProjectDetailPage = ProjectDetailPage;
