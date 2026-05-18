/* Section 11 — News (reads from NEWS_DATA, cards link to /news/:slug) */

function News() {
  const items = NEWS_DATA.slice(0, 3);
  return (
    <section
      id="news"
      className="bg-bg-light py-24 lg:py-32 scroll-mt-24 grain-light"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-20 flex flex-wrap items-end justify-between gap-6 mb-12">
        <motion.h2
          {...fadeUp}
          className="font-serif font-medium tracking-tight text-4xl lg:text-6xl text-text-light-primary leading-[0.98]"
        >
          Новости компании
        </motion.h2>
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
        >
          <Link
            to="/news"
            className="inline-flex items-center gap-1 text-accent-coral font-medium text-sm hover:gap-2 transition-all"
          >
            Все новости <Icon name="ArrowRight" size={16} />
          </Link>
        </motion.div>
      </div>

      <motion.div
        {...staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto px-6 lg:px-20"
      >
        {items.map((n) => (
          <motion.article
            key={n.slug}
            variants={childFade}
          >
            <Link to={`/news/${n.slug}`} className="group cursor-pointer block">
              <div className="aspect-[16/9] rounded-xl overflow-hidden mb-4">
                <img
                  src={n.image}
                  alt={n.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex items-center gap-3 text-xs">
                <time className="font-mono text-text-light-body">{n.date}</time>
                <span className="px-2 py-0.5 rounded-full bg-text-light-primary/[0.05] text-text-light-primary">
                  {n.category}
                </span>
              </div>
              <h3 className="font-serif text-xl text-text-light-primary mt-3 leading-snug group-hover:text-accent-coral transition-colors">
                {n.title}
              </h3>
              <p
                className="text-sm text-text-light-body mt-2 leading-relaxed overflow-hidden"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {n.excerpt}
              </p>
            </Link>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

window.News = News;
