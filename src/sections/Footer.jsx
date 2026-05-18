/* Footer — multi-page links, two-level MTC logo, brand constants */

function Footer() {
  const social = [
    { name: "Send", label: "Telegram", href: BRAND.social.telegram },
    { name: "Instagram", label: "Instagram", href: BRAND.social.instagram },
  ];

  const columns = [
    {
      title: "Объекты",
      links: [
        { label: "Текущие объекты", to: "/projects" },
        { label: "Завершённые объекты", to: "/projects#completed" },
        { label: "ЖК «Бочка»", to: "/projects/bochka" },
        { label: "ЖК «Houson Hills»", to: "/projects/houson-hills" },
        { label: "ЖК «Юсуфхона»", to: "/projects/yusufkhona" },
      ],
    },
    {
      title: "Компания",
      links: [
        { label: "О компании", to: "/about" },
        { label: "Структура", to: "/about#structure" },
        { label: "Дочерние компании", to: "/subsidiaries" },
        { label: "Сертификаты", to: "/certificates" },
        { label: "Новости", to: "/news" },
        { label: "Контакты", to: "/contacts" },
      ],
    },
  ];

  return (
    <footer id="footer" className="bg-bg-dark border-t border-white/10 py-16 lg:py-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 max-w-7xl mx-auto px-6 lg:px-20">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-1">
          <Link to="/" className="inline-flex items-center gap-3">
            <img
              src={R(BRAND.logoMark)}
              alt="MTC"
              className="h-12 w-12 object-contain shrink-0"
            />
            <div className="font-sans text-[10px] text-white/70 uppercase tracking-[0.28em] leading-[1.55]">
              Millennium<br />Time<br />Commerce
            </div>
          </Link>
          <p className="text-white/55 text-sm mt-6 max-w-xs leading-relaxed">
            {BRAND.tagline}. ООО «Millennium Time Commerce» — генеральный подрядчик в Ташкенте.
          </p>
          <div className="flex gap-3 mt-6">
            {social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-colors"
              >
                <Icon name={s.name} size={16} />
              </a>
            ))}
          </div>
          <div className="font-mono text-[11px] text-white/45 mt-4 tracking-wide">
            {BRAND.social.handle}
          </div>
        </div>

        {/* Link columns */}
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-white text-xs uppercase tracking-[0.18em] mb-5">
              {col.title}
            </h4>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="text-white/60 text-sm hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contacts */}
        <div>
          <h4 className="text-white text-xs uppercase tracking-[0.18em] mb-5">
            Контакты
          </h4>
          <ul className="space-y-2.5">
            <li className="text-white/60 text-sm leading-relaxed">
              {BRAND.address}
            </li>
            <li>
              <a href={BRAND.phoneHref} className="text-white text-sm font-mono">
                {BRAND.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${BRAND.email}`} className="text-white/80 text-sm">
                {BRAND.email}
              </a>
            </li>
            <li className="text-white/40 text-xs mt-2 leading-relaxed">
              {BRAND.hours.weekday}<br />
              {BRAND.hours.weekend}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 mt-14 lg:mt-16 pt-8 max-w-7xl mx-auto px-6 lg:px-20 flex flex-wrap justify-between gap-4">
        <div className="text-white/40 text-xs">
          © 2026 {BRAND.full} · Категория {BRAND.sro}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-white/40 text-xs">
          <a href="#" className="hover:text-white/70 transition-colors">
            Политика конфиденциальности
          </a>
          <a href="#" className="hover:text-white/70 transition-colors">
            Пользовательское соглашение
          </a>
        </div>
      </div>
    </footer>
  );
}

window.Footer = Footer;
