/* i18n — простая система: ru / uz / en.
 * - Текущий язык хранится в localStorage + React Context
 * - pick(obj, 'name') → возвращает obj.name_<lang> с fallback на _ru
 * - useLang() / setLang() — для смены языка
 * - t(key) — статические строки UI (Navbar, кнопки, заголовки секций)
 *
 * Динамический контент (проекты, новости, госкейсы) — поля _ru/_uz/_en из БД.
 * Статический UI — словарь STRINGS ниже.
 */

const LANGS = ["ru", "uz", "en"];
const DEFAULT_LANG = "ru";
const LANG_STORAGE_KEY = "mtc-lang";

const LangCtx = React.createContext({ lang: DEFAULT_LANG, setLang: () => {} });

function readStoredLang() {
  try {
    const v = localStorage.getItem(LANG_STORAGE_KEY);
    return LANGS.includes(v) ? v : DEFAULT_LANG;
  } catch { return DEFAULT_LANG; }
}

function LangProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLang);

  const setLang = (l) => {
    if (!LANGS.includes(l)) return;
    setLangState(l);
    try { localStorage.setItem(LANG_STORAGE_KEY, l); } catch {}
    document.documentElement.lang = l;
  };

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

function useLang() { return React.useContext(LangCtx); }

/* pick(obj, 'title') → obj.title_<currentLang> || obj.title_ru || ''
 * Работает в компонентах через useT() (см. ниже).
 */
function pickWith(lang, obj, key) {
  if (!obj) return "";
  return obj[`${key}_${lang}`] || obj[`${key}_ru`] || "";
}

function useT() {
  const { lang } = useLang();
  const pick = (obj, key) => pickWith(lang, obj, key);
  const t = (key) => (STRINGS[key] && STRINGS[key][lang]) || (STRINGS[key] && STRINGS[key].ru) || key;
  return { lang, pick, t };
}

/* ---------- Статические строки UI ---------- */
const STRINGS = {
  // Навигация
  "nav.projects":     { ru: "Объекты",            uz: "Obyektlar",       en: "Projects" },
  "nav.about":        { ru: "О компании",         uz: "Kompaniya haqida", en: "About" },
  "nav.subsidiaries": { ru: "Дочерние компании",  uz: "Sho'ba kompaniyalar", en: "Subsidiaries" },
  "nav.certificates": { ru: "Сертификаты",        uz: "Sertifikatlar",   en: "Certificates" },
  "nav.news":         { ru: "Новости",            uz: "Yangiliklar",     en: "News" },
  "nav.contacts":     { ru: "Контакты",           uz: "Kontaktlar",      en: "Contacts" },
  "nav.contact_us":   { ru: "Связаться",          uz: "Bog'lanish",      en: "Contact us" },
  "nav.open_menu":    { ru: "Открыть меню",       uz: "Menyuni ochish",  en: "Open menu" },
  "nav.close_menu":   { ru: "Закрыть меню",       uz: "Menyuni yopish",  en: "Close menu" },

  // Языки
  "lang.ru":          { ru: "Русский",            uz: "Ruscha",          en: "Russian" },
  "lang.uz":          { ru: "Узбекский",          uz: "O'zbekcha",       en: "Uzbek" },
  "lang.en":          { ru: "Английский",         uz: "Inglizcha",       en: "English" },

  // Общие
  "loading":          { ru: "Загрузка…",          uz: "Yuklanmoqda…",    en: "Loading…" },
  "more":             { ru: "Подробнее",          uz: "Batafsil",        en: "Learn more" },
  "all_news":         { ru: "Все новости",        uz: "Barcha yangiliklar", en: "All news" },
  "all_projects":     { ru: "Все объекты",        uz: "Barcha obyektlar", en: "All projects" },
};

/* ---------- Language Switcher ---------- */
function LanguageSwitcher({ variant = "navbar" }) {
  const { lang, setLang } = useLang();
  const labels = { ru: "RU", uz: "UZ", en: "EN" };

  if (variant === "navbar") {
    return (
      <div className="hidden sm:flex items-center gap-1 mr-1">
        {LANGS.map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`text-xs font-mono px-2 py-1 rounded transition-colors ${
              lang === l ? "text-white bg-white/15" : "text-white/55 hover:text-white"
            }`}
            aria-label={`Switch to ${l}`}
          >
            {labels[l]}
          </button>
        ))}
      </div>
    );
  }

  // mobile variant
  return (
    <div className="flex gap-2">
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`text-sm font-mono px-3 py-2 rounded border ${
            lang === l ? "border-accent-coral text-white" : "border-white/15 text-white/55"
          }`}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}

Object.assign(window, { LANGS, DEFAULT_LANG, LangProvider, useLang, useT, pickWith, LanguageSwitcher, STRINGS });
