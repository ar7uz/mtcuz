/* Shared building blocks for inner pages: PageHero, Breadcrumbs, NotFoundPage */

function Breadcrumbs({ items, dark = true }) {
  const sep = dark ? "text-white/30" : "text-text-light-body/40";
  const link = dark ? "text-white/55 hover:text-white" : "text-text-light-body hover:text-text-light-primary";
  const current = dark ? "text-white" : "text-text-light-primary";
  return (
    <nav className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-[0.12em]">
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            {last ? (
              <span className={current}>{it.label}</span>
            ) : (
              <Link to={it.to} className={`${link} transition-colors`}>
                {it.label}
              </Link>
            )}
            {!last && <span className={sep} aria-hidden="true">/</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

/* PageHero — used by inner pages (projects list, about, contacts, etc.) */
function PageHero({ eyebrow, title, sub, breadcrumbs, image, height = "min-h-[480px]", children }) {
  return (
    <section className={`relative ${height} overflow-hidden bg-bg-dark pt-24 pb-16 lg:pt-32 lg:pb-20`}>
      {image && (
        <>
          <img
            src={image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/70 to-bg-dark/40" aria-hidden="true" />
        </>
      )}
      {!image && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0820] to-bg-dark" aria-hidden="true" />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20 h-full flex flex-col justify-end">
        {breadcrumbs && (
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="font-mono text-xs uppercase tracking-[0.2em] text-accent-gold mb-5"
          >
            — {eyebrow}
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.05 }}
          className="font-serif font-medium tracking-tight leading-[1.0] text-white text-5xl md:text-6xl lg:text-7xl max-w-4xl"
        >
          {title}
        </motion.h1>
        {sub && (
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.15 }}
            className="text-white/65 text-base lg:text-lg max-w-2xl mt-6 leading-relaxed"
          >
            {sub}
          </motion.p>
        )}
        {children}
      </div>
    </section>
  );
}

function NotFoundPage() {
  useEffect(() => { document.title = "Страница не найдена — " + BRAND.full; }, []);
  return (
    <section className="bg-bg-dark min-h-screen flex items-center justify-center px-6 pt-24">
      <div className="text-center max-w-md">
        <div className="font-serif text-9xl text-white/15 leading-none mb-8">404</div>
        <h1 className="font-serif text-4xl text-white mb-4">Страница не найдена</h1>
        <p className="text-white/60 mb-10 leading-relaxed">
          Возможно, страница была перемещена или вы перешли по устаревшей ссылке.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-accent-coral text-white px-7 py-3.5 rounded-full text-sm font-medium hover:scale-[1.02] transition-transform"
        >
          <Icon name="ArrowLeft" size={16} />
          Вернуться на главную
        </Link>
      </div>
    </section>
  );
}

Object.assign(window, { Breadcrumbs, PageHero, NotFoundPage });
