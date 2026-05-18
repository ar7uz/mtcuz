/* Section 03 — Trust Bar */

function TrustBar() {
  const logos = [
    "ISO 9001:2015",
    "ISO 14001:2015",
    "МВД РУз",
    "British School Tashkent",
    "Хокимият Ташкента",
    "Категория C-CC",
  ];

  return (
    <section className="h-32 bg-gradient-to-b from-bg-dark to-bg-light flex items-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 w-full flex flex-wrap items-center justify-between gap-y-3">
        <span className="font-sans text-xs uppercase tracking-[0.2em] text-text-light-body/50">
          Сертификаты и заказчики
        </span>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
          {logos.map((name, i) => (
            <span
              key={name}
              className={`font-serif text-base lg:text-lg text-text-light-body/40 grayscale hover:text-text-light-primary hover:grayscale-0 transition-all cursor-pointer ${
                i >= 3 ? "hidden md:inline-block" : ""
              }`}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

window.TrustBar = TrustBar;
