/* Navbar — sticky with scroll-state, mobile drawer.
 * Route-aware: uses NavLink so the active page is highlighted.
 * On scroll, switches to opaque dark backdrop. On home above the fold, transparent.
 */

const NAV_LINKS = [
  { label: "Объекты", to: "/projects" },
  { label: "О компании", to: "/about" },
  { label: "Дочерние компании", to: "/subsidiaries" },
  { label: "Сертификаты", to: "/certificates" },
  { label: "Новости", to: "/news" },
  { label: "Контакты", to: "/contacts" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { path } = useRouter();
  const onHome = path === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Force opaque navbar on any non-home page
  const opaque = scrolled || !onHome;

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          opaque
            ? "backdrop-blur-md bg-bg-dark/85 border-b border-white/10"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 xl:px-20 h-16 lg:h-20 flex items-center justify-between gap-4">
          {/* Logo — compact mark + wordmark */}
          <Link to="/" className="shrink-0 flex items-center gap-3 whitespace-nowrap">
            <img
              src={R(BRAND.logoMark)}
              alt="MTC"
              className="h-10 w-10 lg:h-11 lg:w-11 object-contain shrink-0"
            />
            <span className="hidden md:flex flex-col gap-[3px] leading-none">
              <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-white/85 font-medium">Millennium Time</span>
              <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-white/45">Commerce</span>
            </span>
          </Link>

          {/* Center nav — only at xl+ so 'О нас' never wraps */}
          <nav className="hidden xl:flex items-center gap-9">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                className={({ isActive }) =>
                  `whitespace-nowrap text-sm transition-colors ${
                    isActive ? "text-white" : "text-white/65 hover:text-white"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <a
              href={BRAND.phoneHref}
              className="hidden 2xl:inline whitespace-nowrap text-sm text-white/70 hover:text-white transition-colors font-mono"
            >
              {BRAND.phone}
            </a>
            <Link
              to="/contacts"
              className="hidden sm:inline-flex whitespace-nowrap items-center gap-2 bg-accent-coral text-white rounded-full px-5 lg:px-6 py-2.5 text-sm font-medium hover:scale-[1.02] transition-transform"
            >
              Связаться
            </Link>
            <button
              onClick={() => setMenuOpen(true)}
              className="xl:hidden w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white"
              aria-label="Открыть меню"
            >
              <Icon name="Menu" size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease }}
            className="fixed inset-0 z-[60] bg-bg-dark xl:hidden flex flex-col"
          >
            <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <img src={R(BRAND.logoMark)} alt="MTC" className="h-9 w-9 object-contain" />
                <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-white/65 leading-none hidden sm:inline">
                  Millennium Time<br />Commerce
                </span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center"
                aria-label="Закрыть меню"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            <nav className="flex-1 flex flex-col gap-2 px-6 pt-10">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease }}
                >
                  <NavLink
                    to={l.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block font-serif text-4xl py-3 border-b border-white/5 ${
                        isActive ? "text-accent-coral" : "text-white"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="p-6 border-t border-white/10 flex flex-col gap-3">
              <a href={BRAND.phoneHref} className="font-mono text-sm text-white/70">
                {BRAND.phone}
              </a>
              <Link
                to="/contacts"
                onClick={() => setMenuOpen(false)}
                className="bg-accent-coral text-white rounded-full px-6 py-3 text-sm font-medium text-center"
              >
                Связаться
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

window.Navbar = Navbar;
