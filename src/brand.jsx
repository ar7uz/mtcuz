/* Brand constants — single source of truth for company identity */

const BRAND = {
  monogram: "MTC",
  full: "MILLENNIUM TIME COMMERCE",
  fullRu: "Миллениум Тайм Коммерс",
  tagline: "Строительная компания полного цикла",
  phone: "+998 99 000 41 16",
  phoneHref: "tel:+998990004116",
  email: "info@mtc.uz",
  address: "г. Ташкент, Юнусабадский район, МФИ «Отчопар», ул. Чинобод, 45",
  hours: { weekday: "Пн–Пт 9:00–18:00", weekend: "Сб 10:00–14:00" },
  inn: "—",
  sro: "C-CC · Национальный рейтинг РУз",
  logoMark: "images/logo-mtc-mark.png",
  logoFull: "images/logo-mtc-full.png",
  social: {
    handle: "@millenniumtimecommerse",
    telegram: "https://t.me/millenniumtimecommerse",
    instagram: "https://instagram.com/millenniumtimecommerse",
  },
};

window.BRAND = BRAND;

/* BrandSeal — small circular contractor stamp.
 * Use on top of imagery: combines a soft dark backdrop, double ring,
 * and a drop shadow so the mark reads as a polished medallion, not a clipped square.
 *   <BrandSeal size={44} />
 */
function BrandSeal({ size = 44, className = "" }) {
  const s = `${size}px`;
  return (
    <div
      className={`relative rounded-full shadow-[0_6px_18px_-4px_rgba(0,0,0,0.45)] ${className}`}
      style={{ width: s, height: s }}
      title="MTC"
      aria-label="MTC"
    >
      {/* outer halo ring */}
      <div className="absolute inset-0 rounded-full ring-1 ring-white/25" />
      {/* logo plate */}
      <div className="absolute inset-[2px] rounded-full overflow-hidden bg-bg-dark">
        <img
          src={BRAND.logoMark}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-[1.04]"
          draggable="false"
          style={{ imageRendering: "auto" }}
        />
        {/* subtle inset highlight — gives an embossed/seal feel */}
        <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10 pointer-events-none" />
        {/* faint diagonal sheen */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 38%, rgba(255,255,255,0) 62%, rgba(0,0,0,0.18) 100%)",
          }}
        />
      </div>
    </div>
  );
}

window.BrandSeal = BrandSeal;
