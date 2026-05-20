/* About — /about  &  Contacts — /contacts */

/* Organization Structure — hierarchical tree (3 levels: CEO → departments → roles → workers) */
function OrgStructure() {
  const departments = [
    {
      key: "build",
      icon: "HardHat",
      title: "Строительный отдел",
      accent: "#DA745C",
      roles: [
        { title: "Главный инженер", sub: "Бригада · 100 чел." },
        { title: "Инженер-прораб", sub: "Бригада · 100 чел." },
        { title: "Инженер-специалист", sub: "Бригада · 100 чел." },
      ],
    },
    {
      key: "geo",
      icon: "Compass",
      title: "Геодезия",
      accent: "#063CA1",
      roles: [{ title: "Геодезист", sub: "Разбивка осей, исполнительная съёмка" }],
    },
    {
      key: "pto",
      icon: "FileText",
      title: "Отдел ПТО",
      accent: "#C9985C",
      roles: [
        { title: "Инженер ПТО", sub: "Сметы и графики" },
        { title: "Инженер ПТО", sub: "Документация" },
      ],
    },
    {
      key: "fin",
      icon: "Calculator",
      title: "Финансовый отдел",
      accent: "#3B8C6E",
      roles: [
        { title: "Финансовый директор", sub: "Бухгалтерия · Кадры" },
        { title: "Бэк-офис", sub: "7 сотрудников" },
      ],
    },
  ];

  return (
    <section id="structure" className="bg-bg-light py-24 lg:py-28 border-t border-black/10 grain-light scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        <SectionHead
          eyebrow="Структура организации"
          title="Как устроена компания"
          sub="Линейно-функциональная структура: генеральный директор, четыре отдела, три полевые бригады по 100 рабочих. Все позиции — собственный штат."
          center={false}
        />

        {/* CEO node */}
        <div className="mt-16 flex flex-col items-center">
          <div className="relative bg-bg-dark text-white rounded-2xl px-8 py-7 text-center max-w-md w-full shadow-lg overflow-hidden">
            <img
              src={R(BRAND.logoMark)}
              alt=""
              aria-hidden="true"
              className="absolute -right-6 -bottom-6 w-28 h-28 opacity-[0.07] pointer-events-none select-none"
            />
            <div className="relative">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-gold mb-2">
                Генеральный директор
              </div>
              <div className="font-serif text-2xl leading-tight">Руководитель компании</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-white/55 mt-3">
                ООО «Millennium Time Commerce»
              </div>
            </div>
          </div>

          {/* Vertical down */}
          <div className="w-px h-12 bg-black/15" aria-hidden="true" />

          {/* Horizontal trunk connecting all departments */}
          <div className="w-full relative">
            <div className="hidden md:block absolute top-0 left-[12.5%] right-[12.5%] h-px bg-black/15" aria-hidden="true" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
              {departments.map((d) => (
                <div key={d.key} className="relative flex flex-col">
                  {/* Tick from trunk to dept card */}
                  <div className="hidden md:block absolute -top-0 left-1/2 w-px h-6 bg-black/15" aria-hidden="true" />

                  {/* Department card */}
                  <div className="mt-6 bg-bg-dark text-white rounded-2xl px-5 py-5 flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: d.accent + "26", color: d.accent }}
                    >
                      <Icon name={d.icon} size={18} />
                    </div>
                    <h3 className="font-serif text-lg leading-tight">{d.title}</h3>
                  </div>

                  {/* Connector down to roles */}
                  <div className="self-center w-px h-6 bg-black/15" aria-hidden="true" />

                  {/* Roles stack */}
                  <div className="flex-1 flex flex-col gap-3">
                    {d.roles.map((r, i) => (
                      <div
                        key={i}
                        className="bg-white border rounded-xl px-4 py-3 leading-snug"
                        style={{ borderColor: d.accent + "33" }}
                      >
                        <div className="font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: d.accent }}>
                          Позиция
                        </div>
                        <div className="font-serif text-base text-text-light-primary leading-tight">{r.title}</div>
                        <div className="text-xs text-text-light-body mt-1">{r.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Field resources strip */}
          <div className="w-px h-10 bg-black/15 mt-10" aria-hidden="true" />
          <div className="w-full bg-white border border-black/[0.06] rounded-2xl p-5 lg:p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-gold mb-4">
              — Материально-техническая база
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: "Users", label: "147 сотрудников в штате" },
                { icon: "Bus", label: "Автобус 50 мест · 01 278 ННА" },
                { icon: "Container", label: "9 жилых контейнеров на объектах" },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex items-center gap-3 border border-black/[0.06] rounded-xl px-4 py-3 bg-bg-light"
                >
                  <Icon name={r.icon} size={18} className="text-accent-gold shrink-0" />
                  <span className="text-sm text-text-light-primary leading-tight">{r.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutPage() {
  useEffect(() => { document.title = "О компании — " + BRAND.full; }, []);

  const timeline = [
    { year: "Основание", title: "ООО «Millennium Time Commerce»", body: "Компания зарегистрирована в Ташкенте как генеральный подрядчик полного цикла. Начало работы — общестроительные и подрядные контракты." },
    { year: "Школа", title: "Реконструкция школы на ул. Глинка", body: "Ускоренный график — 3 месяца. Полный комплекс работ. Бюджет 450 000 $. Первый крупный контракт по образовательной инфраструктуре." },
    { year: "Спорт", title: "Спортивный комплекс на Чинобод", body: "Общее строительство, 1 год, 550 000 $. Подтверждение компетенций по общественным объектам в Юнусабадском районе Ташкента." },
    { year: "Госзаказ", title: "ГУВД Ангрен и British School", body: "Строительство административного здания МВД в Ангрене и учебного корпуса международной школы. Параллельная работа на госзаказе и международном частном контракте." },
    { year: "$4.5M", title: "Академия МВД РУз", body: "Капитальный ремонт учебных корпусов на ул. Мингбулок. Самый крупный завершённый объект компании. Срок реализации — 2 года." },
    { year: "Группа", title: "Старт NILSTROY и Millennium Time Commerce", body: "Развитие группы: дочерняя компания NILSTROY — оптовая и розничная продажа стройматериалов; Millennium Time Commerce — аренда спецтехники по всему Узбекистану." },
    { year: "2025", title: "ISO 9001 и ISO 14001", body: "Международная сертификация SMK и системы экологического менеджмента. Срок действия — до 30 мая 2028 года." },
    { year: "2026", title: "Сегодня", body: "12 сданных объектов, 5 текущих, 147 сотрудников. Среднегодовой оборот — 5 000 000 $. Категория C-CC в Национальном рейтинге РУз." },
  ];

  const values = [
    {
      icon: "Building2",
      title: "Полный цикл подряда",
      body: "Строительство жилых и коммерческих зданий, металлоконструкции, капитальный ремонт, отделочные работы, инженерные системы, благоустройство — всё силами собственного штата.",
    },
    {
      icon: "ShieldCheck",
      title: "Сертификация качества",
      body: "ISO 9001:2015 и ISO 14001:2015. Категория C-CC в Национальной системе сертификации Республики Узбекистан. Документация по каждому объекту.",
    },
    {
      icon: "Truck",
      title: "Собственная материально-техническая база",
      body: "147 сотрудников, 3 бригады по 100 рабочих, 50-местный автобус для транспортировки бригад (гос. номер 01 278 ННА), 9 жилых контейнеров для размещения на удалённых объектах.",
    },
  ];

  const team = [
    { initials: "ГД", role: "Генеральный директор", since: "Руководство" },
    { initials: "ГИ", role: "Главный инженер", since: "Строительный отдел" },
    { initials: "ИП", role: "Инженер-прораб", since: "Бригада 100 чел." },
    { initials: "ИС", role: "Инженер-специалист", since: "Бригада 100 чел." },
    { initials: "ПТ", role: "Инженер ПТО", since: "Отдел ПТО" },
    { initials: "ПТ", role: "Инженер ПТО", since: "Отдел ПТО" },
    { initials: "ФД", role: "Финансовый директор", since: "Финансовый отдел" },
    { initials: "ГД", role: "Геодезист", since: "Геодезия" },
  ];

  return (
    <>
      <PageHero
        eyebrow="О компании"
        title="ООО «Millennium Time Commerce» — генеральный подрядчик полного цикла"
        sub="От проектирования до сдачи «под ключ». Жилые и коммерческие здания, металлоконструкции любой сложности, капитальный ремонт, отделочные работы, инженерные системы, благоустройство."
        image={R("images/hero-light.jpg")}
        breadcrumbs={[
          { label: "Главная", to: "/" },
          { label: "О компании", to: "/about" },
        ]}
      />

      {/* Timeline */}
      <section className="bg-bg-light py-24 lg:py-28 grain-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <SectionHead eyebrow="Путь компании" title="Ключевые объекты и этапы" center={false} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 mt-16 max-w-5xl">
            {timeline.map((t, i) => (
              <motion.div
                key={t.year + t.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                className="flex gap-8 lg:gap-10 py-8 border-b border-black/5"
              >
                <div className="font-serif text-3xl text-accent-coral shrink-0 leading-tight w-28 lg:w-32">{t.year}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-xl text-text-light-primary leading-snug mb-3">{t.title}</h3>
                  <p className="text-text-light-body text-sm leading-relaxed">{t.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-bg-dark py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <SectionHead eyebrow="Принципы" title="На чём держится работа MTC" dark center={false} />
          <motion.div
            {...staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 mt-16"
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={childFade}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 lg:p-10"
              >
                <div className="w-12 h-12 rounded-full bg-accent-gold/15 flex items-center justify-center text-accent-gold">
                  <Icon name={v.icon} size={22} />
                </div>
                <h3 className="font-serif text-2xl text-white mt-6 leading-tight">{v.title}</h3>
                <p className="text-white/65 text-sm mt-4 leading-relaxed">{v.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Organization Structure — hierarchical tree */}
      <OrgStructure />


      {/* Team */}
      <section className="bg-bg-light py-24 lg:py-28 grain-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <SectionHead eyebrow="Команда" title="Ключевые сотрудники" />
          <motion.div
            {...staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 mt-16"
          >
            {team.map((m, i) => (
              <motion.div key={i} variants={childFade} className="text-center">
                <div className="aspect-square rounded-full bg-text-light-primary/[0.06] flex items-center justify-center text-text-light-primary/40 font-serif text-3xl mb-4">
                  <Icon name="User" size={28} />
                </div>
                <div className="font-serif text-base text-text-light-primary leading-tight">{m.role}</div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-accent-gold mt-2">{m.since}</div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-16 max-w-3xl mx-auto text-center text-text-light-body text-sm leading-relaxed">
            Всего в штате — 147 сотрудников. Три бригады по 100 рабочих-строителей,
            7 геодезистов, отдел ПТО, финансовый отдел. Собственный 50-местный автобус
            для транспортировки бригад и 9 жилых контейнеров для размещения на объектах.
          </div>
        </div>
      </section>

      {/* Awards row */}
      <section className="bg-bg-light py-20 border-t border-black/10 grain-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent-gold mb-8">
            — Цифры компании
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {[
              ["12", "сданных объектов"],
              ["5", "в активной работе"],
              ["147", "сотрудников"],
              ["5M $", "годовой оборот"],
            ].map(([num, label]) => (
              <div key={label}>
                <div className="font-serif text-5xl lg:text-6xl text-text-light-primary leading-none">{num}</div>
                <div className="text-sm text-text-light-body mt-3">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subsidiaries teaser */}
      <SubsidiariesTeaser />

      {/* CTA */}
      <section className="bg-bg-dark py-24 text-center relative overflow-hidden">
        <img
          src={R(BRAND.logoMark)}
          alt=""
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] opacity-[0.04] pointer-events-none select-none"
        />
        <div className="relative max-w-2xl mx-auto px-6">
          <h2 className="font-serif text-4xl lg:text-5xl text-white leading-tight">
            Познакомиться с компанией ближе
          </h2>
          <p className="text-white/60 mt-6 leading-relaxed">
            Посмотрите портфолио объектов, изучите сертификаты и структуру группы. По любым вопросам — свяжитесь с офисом.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 bg-accent-coral text-white px-8 py-4 rounded-full text-sm font-medium hover:scale-[1.02] transition-transform"
            >
              Объекты MTC
              <Icon name="ArrowRight" size={18} />
            </Link>
            <Link
              to="/contacts"
              className="inline-flex items-center gap-2 border border-white/20 bg-white/5 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Связаться
              <Icon name="ArrowRight" size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactsForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honey, setHoney] = useState("");           // honeypot — должен остаться пустым
  const [formOpenedAt] = useState(() => Date.now()); // honeypot — мин. время на форму
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);

    // Защита от ботов:
    // 1. Скрытое поле "company" должно быть пустым (боты заполняют все поля)
    // 2. Форма не должна быть отправлена менее чем через 3 секунды после открытия
    if (honey) { setDone(true); return; } // silent drop — пусть думают что отправили
    if (Date.now() - formOpenedAt < 3000) { setErr("Слишком быстро — заполните форму внимательнее."); return; }

    if (!name.trim() || !phone.trim()) {
      setErr("Имя и телефон обязательны.");
      return;
    }

    setBusy(true);
    try {
      const payload = {
        name:            name.trim().slice(0, 200),
        phone:           phone.trim().slice(0, 50),
        email:           email.trim() ? email.trim().slice(0, 200) : null,
        message:         message.trim() ? message.trim().slice(0, 5000) : null,
        source_page:     window.location.hash || "/",
        source_referrer: document.referrer || null,
        user_agent:      navigator.userAgent.slice(0, 500),
      };
      const { error } = await SB.from("leads").insert(payload);
      if (error) throw error;

      // Трекинг события
      try { window.track && window.track("lead_submitted", { page: payload.source_page }); } catch {}

      setDone(true);
    } catch (e) {
      setErr(e.message || "Не удалось отправить заявку. Попробуйте ещё раз или позвоните.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="mt-12 bg-white/[0.04] border border-accent-gold/30 rounded-2xl p-10 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-accent-gold/15 flex items-center justify-center text-accent-gold mb-5">
          <Icon name="Check" size={26} />
        </div>
        <h3 className="font-serif text-2xl text-white mb-3">Заявка отправлена</h3>
        <p className="text-white/65 text-sm leading-relaxed max-w-md mx-auto">
          Наш менеджер свяжется с вами в течение рабочего дня. Если вопрос срочный — звоните напрямую на {BRAND.phone}.
        </p>
      </div>
    );
  }

  return (
    <form className="mt-12 grid grid-cols-1 gap-5" onSubmit={handleSubmit} noValidate>
      {/* honeypot — скрытое поле, для людей невидимо, боты обычно заполняют */}
      <div style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }} aria-hidden="true">
        <label>Компания (не заполнять)</label>
        <input type="text" tabIndex={-1} autoComplete="off"
               value={honey} onChange={(e) => setHoney(e.target.value)} />
      </div>

      <input
        type="text" required value={name} onChange={(e) => setName(e.target.value)}
        placeholder="Ваше имя или название организации"
        maxLength={200}
        className="bg-white/[0.04] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/40 focus:border-accent-gold focus:outline-none transition-colors"
      />
      <input
        type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
        placeholder="Телефон"
        maxLength={50}
        className="bg-white/[0.04] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/40 focus:border-accent-gold focus:outline-none transition-colors font-mono"
      />
      <input
        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="Email (необязательно)"
        maxLength={200}
        className="bg-white/[0.04] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/40 focus:border-accent-gold focus:outline-none transition-colors"
      />
      <textarea
        value={message} onChange={(e) => setMessage(e.target.value)}
        placeholder="Сообщение — вопрос о компании, объекте или дочерних компаниях (необязательно)"
        rows={4} maxLength={5000}
        className="bg-white/[0.04] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-white/40 focus:border-accent-gold focus:outline-none transition-colors resize-none"
      />

      {err && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-200 text-sm rounded-xl px-5 py-3">
          {err}
        </div>
      )}

      <button
        type="submit" disabled={busy}
        className="bg-accent-coral text-white py-4 rounded-full text-sm font-medium hover:scale-[1.02] transition-transform mt-2 disabled:opacity-60 disabled:hover:scale-100"
      >
        {busy ? "Отправка…" : "Отправить сообщение"}
      </button>
      <p className="text-xs text-white/40 text-center mt-2">
        Нажимая «Отправить», вы соглашаетесь с политикой обработки персональных данных.
      </p>
    </form>
  );
}

function ContactsPage() {
  useEffect(() => { document.title = "Контакты — " + BRAND.full; }, []);

  const departments = [
    {
      title: "Подрядный отдел",
      desc: "Обсуждение технического задания, согласование сметы и графика работ.",
      phone: BRAND.phone,
      phoneHref: BRAND.phoneHref,
      email: "info@mtc.uz",
      hours: "Пн–Пт 9:00–18:00",
    },
    {
      title: "Государственные контракты",
      desc: "Работа по госзаказу, подача документов, тендерное сопровождение.",
      phone: BRAND.phone,
      phoneHref: BRAND.phoneHref,
      email: "tender@mtc.uz",
      hours: "Пн–Пт 9:00–18:00",
    },
    {
      title: "Бэк-офис",
      desc: "Кадры, бухгалтерия, документооборот по действующим объектам.",
      phone: BRAND.phone,
      phoneHref: BRAND.phoneHref,
      email: "office@mtc.uz",
      hours: "Пн–Пт 9:00–17:00",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Контакты"
        title="Свяжитесь с нами"
        sub="Главный офис в Юнусабадском районе Ташкента. Обсуждение технического задания и встреча — по любому из контактов ниже."
        breadcrumbs={[
          { label: "Главная", to: "/" },
          { label: "Контакты", to: "/contacts" },
        ]}
      />

      {/* Quick contacts */}
      <section className="bg-bg-light py-20 lg:py-24 grain-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {[
            { icon: "MapPin", label: "Офис", value: BRAND.address },
            { icon: "Phone", label: "Телефон", value: BRAND.phone, href: BRAND.phoneHref },
            { icon: "Mail", label: "Email", value: BRAND.email, href: `mailto:${BRAND.email}` },
            { icon: "Send", label: "Telegram / Instagram", value: BRAND.social.handle, href: BRAND.social.telegram },
          ].map((c) => (
            <motion.div
              key={c.label}
              {...fadeUp}
              className="bg-white rounded-2xl p-7 lg:p-8 border border-black/[0.05] flex flex-col gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-accent-gold/15 flex items-center justify-center text-accent-gold">
                <Icon name={c.icon} size={18} />
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-light-body mb-2">
                  {c.label}
                </div>
                {c.href ? (
                  <a href={c.href} className="font-serif text-lg text-text-light-primary hover:text-accent-coral transition-colors leading-snug whitespace-pre-line">
                    {c.value}
                  </a>
                ) : (
                  <div className="font-serif text-lg text-text-light-primary leading-snug whitespace-pre-line">
                    {c.value}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Map placeholder */}
      <section className="bg-bg-light pb-20 grain-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="aspect-[21/9] rounded-2xl overflow-hidden relative bg-text-light-primary/[0.04] border border-black/[0.06]">
            <svg viewBox="0 0 800 340" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="contacts-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1A1612" strokeWidth="0.5" opacity="0.06" />
                </pattern>
              </defs>
              <rect width="800" height="340" fill="url(#contacts-grid)" />
              <path d="M 0 200 Q 200 180 400 190 T 800 170" stroke="#1A1612" strokeWidth="1.5" opacity="0.08" fill="none" />
              <path d="M 240 0 L 260 340" stroke="#1A1612" strokeWidth="1.5" opacity="0.08" fill="none" />
              <path d="M 540 0 L 520 340" stroke="#1A1612" strokeWidth="1.5" opacity="0.08" fill="none" />
              {/* Office marker */}
              <g transform="translate(400 170)">
                <circle r="48" fill="#DA745C" opacity="0.10" />
                <circle r="22" fill="#DA745C" opacity="0.20" />
                <circle r="7" fill="#DA745C" />
              </g>
            </svg>
            <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl px-5 py-4 max-w-sm">
              <div className="font-mono text-[10px] uppercase tracking-wider text-text-light-body mb-1">
                Главный офис
              </div>
              <div className="font-serif text-base text-text-light-primary leading-snug">
                {BRAND.address}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="bg-bg-light py-24 lg:py-28 border-t border-black/10 grain-light">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <SectionHead eyebrow="Отделы" title="Прямые контакты по вопросам" />
          <motion.div
            {...staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-16"
          >
            {departments.map((d) => (
              <motion.div
                key={d.title}
                variants={childFade}
                className="bg-white rounded-2xl p-7 lg:p-8 border border-black/[0.05]"
              >
                <h3 className="font-serif text-2xl text-text-light-primary leading-tight">{d.title}</h3>
                <p className="text-sm text-text-light-body mt-3 leading-relaxed">{d.desc}</p>
                <hr className="border-black/5 my-6" />
                <dl className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Icon name="Phone" size={14} className="text-accent-gold shrink-0" />
                    <a href={d.phoneHref} className="font-mono text-text-light-primary hover:text-accent-coral transition-colors">
                      {d.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="Mail" size={14} className="text-accent-gold shrink-0" />
                    <a href={`mailto:${d.email}`} className="text-text-light-primary hover:text-accent-coral transition-colors">
                      {d.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-text-light-body">
                    <Icon name="Clock" size={14} className="text-accent-gold shrink-0" />
                    <span>{d.hours}</span>
                  </div>
                </dl>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="bg-bg-dark py-24 lg:py-28">
        <div className="max-w-2xl mx-auto px-6">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent-gold text-center mb-5">
            — Обратная связь
          </div>
          <h2 className="font-serif text-4xl lg:text-5xl text-white text-center leading-tight">
            Напишите нам
          </h2>
          <p className="text-white/60 text-center mt-5 leading-relaxed">
            Ответим на вопросы о компании, портфолио и сертификатах.
          </p>

          <ContactsForm />
        </div>
      </section>
    </>
  );
}

Object.assign(window, { AboutPage, ContactsPage, ContactsForm });
