/* News — /news (list) and /news/:slug (detail) */

function NewsListPage() {
  const [category, setCategory] = useState("Все");
  useEffect(() => { document.title = "Новости — " + BRAND.full; }, []);

  const categories = ["Все", "Стройка", "Награды", "Госзаказ", "Финансы"];
  const filtered = category === "Все"
    ? NEWS_DATA
    : NEWS_DATA.filter((n) => n.category === category);

  return (
    <>
      <PageHero
        eyebrow="Новости"
        title="Что происходит в компании"
        sub="Стройка, награды, тендеры, финансовые программы. Свежие новости из жизни Millennium Time Commerce."
        breadcrumbs={[
          { label: "Главная", to: "/" },
          { label: "Новости", to: "/news" },
        ]}
      />

      {/* Category filters */}
      <section className="bg-bg-light grain-light border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 py-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                category === c
                  ? "bg-text-light-primary text-white"
                  : "bg-white text-text-light-primary hover:bg-text-light-primary/5 border border-black/5"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-bg-light py-16 lg:py-24 grain-light">
        <motion.div
          {...staggerContainer}
          key={category}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto px-6 lg:px-20"
        >
          {filtered.map((n) => (
            <motion.article key={n.slug} variants={childFade}>
              <Link to={`/news/${n.slug}`} className="group block">
                <div className="aspect-[16/10] rounded-xl overflow-hidden mb-5">
                  <img
                    src={n.image}
                    alt={n.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <time className="font-mono text-text-light-body">{n.date}</time>
                  <span className="px-2 py-0.5 rounded-full bg-text-light-primary/[0.06] text-text-light-primary">
                    {n.category}
                  </span>
                </div>
                <h3 className="font-serif text-xl lg:text-2xl text-text-light-primary mt-4 leading-snug group-hover:text-accent-coral transition-colors">
                  {n.title}
                </h3>
                <p
                  className="text-sm text-text-light-body mt-3 leading-relaxed overflow-hidden"
                  style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}
                >
                  {n.excerpt}
                </p>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </>
  );
}

function NewsDetailPage() {
  const { slug } = useParams("/news/:slug");
  const n = getNewsBySlug(slug);
  useEffect(() => { if (n) document.title = `${n.title} — ${BRAND.full}`; }, [n]);

  if (!n) return <NotFoundPage />;

  const related = NEWS_DATA.filter((x) => x.slug !== n.slug).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[440px] overflow-hidden bg-bg-dark">
        <img src={n.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/70 to-bg-dark/50" aria-hidden="true" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-20 h-full flex flex-col justify-end pb-16 pt-28">
          <Breadcrumbs
            items={[
              { label: "Главная", to: "/" },
              { label: "Новости", to: "/news" },
              { label: n.category, to: "/news" },
            ]}
          />
          <div className="flex items-center gap-3 text-xs mt-8 mb-6">
            <time className="font-mono text-white/65 uppercase tracking-wider">{n.date}</time>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] uppercase tracking-wider">
              {n.category}
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight tracking-tight">
            {n.title}
          </h1>
        </div>
      </section>

      {/* Body */}
      <article className="bg-bg-light py-20 lg:py-24 grain-light">
        <div className="max-w-2xl mx-auto px-6">
          <p className="font-serif italic text-xl lg:text-2xl text-text-light-primary leading-relaxed mb-12">
            {n.excerpt}
          </p>
          {n.body.map((para, i) => (
            <p key={i} className="text-text-light-body text-base lg:text-lg leading-relaxed mb-6">
              {para}
            </p>
          ))}

          <div className="mt-16 pt-10 border-t border-black/10 flex items-center justify-between gap-4 flex-wrap">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-text-light-primary hover:text-accent-coral transition-colors text-sm"
            >
              <Icon name="ArrowLeft" size={16} />
              Все новости
            </Link>
            <div className="flex gap-2">
              {[
                { name: "Send", label: "Telegram" },
                { name: "MessageCircle", label: "VK" },
                { name: "Link", label: "Скопировать ссылку" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-text-light-body hover:text-text-light-primary hover:border-text-light-primary/30 transition-colors"
                >
                  <Icon name={s.name} size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </article>

      {/* Related */}
      <section className="bg-bg-light pb-24 grain-light border-t border-black/10 pt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <h2 className="font-serif text-3xl text-text-light-primary mb-12">Читайте также</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {related.map((r) => (
              <Link key={r.slug} to={`/news/${r.slug}`} className="group">
                <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4">
                  <img src={r.image} alt={r.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <time className="font-mono text-xs text-text-light-body uppercase tracking-wider">{r.date}</time>
                <h3 className="font-serif text-lg text-text-light-primary mt-2 leading-snug group-hover:text-accent-coral transition-colors">
                  {r.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

Object.assign(window, { NewsListPage, NewsDetailPage });
