/* Общие утилиты админки: формы, языковые табы, загрузка изображений, тосты. */

const ADMIN_LANGS = ["ru", "uz", "en"];

/* Tabs для переключения языка ввода (RU/UZ/EN) внутри формы */
function AdminLangTabs({ value, onChange }) {
  return (
    <div className="inline-flex gap-1 p-1 bg-[#EFEAE2] rounded-lg">
      {ADMIN_LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${
            value === l ? "bg-white text-[#063CA1] shadow-sm" : "text-[#5C5550] hover:text-[#1A1612]"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

/* Поле с тремя языковыми вариантами. Показывает активный, остальные — внизу summary. */
function MultiLangField({ label, langKey, value = {}, onChange, multiline = false, required = false }) {
  const [lang, setLang] = useState("ru");
  const Input = multiline ? "textarea" : "input";
  const fieldName = (l) => `${langKey}_${l}`;
  const handleChange = (e) => onChange({ ...value, [fieldName(lang)]: e.target.value });

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="!mb-0">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
        <AdminLangTabs value={lang} onChange={setLang} />
      </div>
      <Input
        value={value[fieldName(lang)] || ""}
        onChange={handleChange}
        rows={multiline ? 4 : undefined}
        placeholder={lang === "ru" ? "" : `(${lang}) перевод…`}
      />
      <div className="mt-1.5 text-[11px] text-[#8A847B] font-mono flex gap-3">
        {ADMIN_LANGS.filter((l) => l !== lang).map((l) => {
          const v = value[fieldName(l)] || "";
          return (
            <span key={l} className={v ? "text-[#5C5550]" : "text-red-500"}>
              {l.toUpperCase()}: {v ? `${v.slice(0, 40)}${v.length > 40 ? "…" : ""}` : "не заполнено"}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* Текстовое поле для массива абзацев — одна textarea, абзацы разделяются пустой строкой */
function MultiLangArrayField({ label, langKey, value = {}, onChange, required = false }) {
  const [lang, setLang] = useState("ru");
  const fieldName = (l) => `${langKey}_${l}`;
  const arrToStr = (arr) => Array.isArray(arr) ? arr.join("\n\n") : "";
  const strToArr = (str) => str.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="!mb-0">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
          <span className="text-[10px] font-normal lowercase ml-2 text-[#8A847B]">абзацы через пустую строку</span>
        </label>
        <AdminLangTabs value={lang} onChange={setLang} />
      </div>
      <textarea
        rows={8}
        value={arrToStr(value[fieldName(lang)])}
        onChange={(e) => onChange({ ...value, [fieldName(lang)]: strToArr(e.target.value) })}
      />
    </div>
  );
}

/* Простой список строк с возможностью add/remove (для features, infrastructure — мультиязычный) */
function MultiLangListField({ label, langKey, value = {}, onChange }) {
  const [lang, setLang] = useState("ru");
  const fieldName = (l) => `${langKey}_${l}`;
  const list = value[fieldName(lang)] || [];

  const setList = (newList) => onChange({ ...value, [fieldName(lang)]: newList });

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="!mb-0">{label}</label>
        <AdminLangTabs value={lang} onChange={setLang} />
      </div>
      <div className="space-y-2">
        {list.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => {
                const next = [...list]; next[i] = e.target.value; setList(next);
              }}
            />
            <button type="button" className="admin-btn admin-btn-ghost shrink-0"
              onClick={() => setList(list.filter((_, j) => j !== i))}>
              <Icon name="X" size={14} />
            </button>
          </div>
        ))}
        <button type="button" className="admin-btn admin-btn-ghost"
          onClick={() => setList([...list, ""])}>
          <Icon name="Plus" size={14} /> Добавить
        </button>
      </div>
    </div>
  );
}

/* Загрузка одного изображения */
function ImageUploader({ value, onChange, label = "Изображение" }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setBusy(true); setErr(null);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (e) {
      setErr(e.message || "Ошибка загрузки");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    if (!value) return;
    if (!confirm("Удалить изображение?")) return;
    try { await deleteImageByUrl(value); } catch {}
    onChange("");
  };

  return (
    <div>
      <label>{label}</label>
      <div className="flex items-start gap-3">
        {value ? (
          <div className="relative">
            <img src={value} alt="" className="w-28 h-28 object-cover rounded-lg border border-[#D7D2C9]" />
            <button type="button" onClick={handleRemove}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
              ×
            </button>
          </div>
        ) : (
          <div className="w-28 h-28 rounded-lg border-2 border-dashed border-[#D7D2C9] flex items-center justify-center text-[#8A847B] text-xs">
            нет фото
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => handleFile(e.target.files[0])}
            disabled={busy}
            className="!p-2 !text-xs"
          />
          {busy && <div className="text-xs text-[#063CA1]">Загрузка…</div>}
          {err && <div className="text-xs text-red-600">{err}</div>}
          <div className="text-[11px] text-[#8A847B]">JPEG / PNG / WebP, до 5 МБ</div>
        </div>
      </div>
    </div>
  );
}

/* Галерея — несколько изображений */
function GalleryUploader({ value = [], onChange, label = "Галерея" }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const addFiles = async (files) => {
    setBusy(true); setErr(null);
    const newUrls = [];
    try {
      for (const f of files) {
        const url = await uploadImage(f);
        newUrls.push(url);
      }
      onChange([...value, ...newUrls]);
    } catch (e) {
      setErr(e.message || "Ошибка загрузки");
    } finally { setBusy(false); }
  };

  const removeAt = async (i) => {
    if (!confirm("Удалить из галереи?")) return;
    const url = value[i];
    try { await deleteImageByUrl(url); } catch {}
    onChange(value.filter((_, j) => j !== i));
  };

  return (
    <div>
      <label>{label}</label>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {value.map((url, i) => (
          <div key={i} className="relative aspect-square">
            <img src={url} alt="" className="w-full h-full object-cover rounded-lg border border-[#D7D2C9]" />
            <button type="button" onClick={() => removeAt(i)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
              ×
            </button>
          </div>
        ))}
        <label className="aspect-square rounded-lg border-2 border-dashed border-[#D7D2C9] flex flex-col items-center justify-center text-[#8A847B] text-xs cursor-pointer hover:bg-[#EFEAE2]">
          <Icon name="Plus" size={20} />
          <span className="mt-1">Добавить</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => addFiles(Array.from(e.target.files))}
            disabled={busy}
          />
        </label>
      </div>
      {busy && <div className="mt-2 text-xs text-[#063CA1]">Загрузка…</div>}
      {err && <div className="mt-2 text-xs text-red-600">{err}</div>}
    </div>
  );
}

/* Тост-уведомления */
const ToastCtx = React.createContext({ show: () => {} });

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const show = (msg, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  };
  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 space-y-2">
        {toasts.map((t) => (
          <div key={t.id} className={`px-4 py-3 rounded-lg shadow-lg text-sm max-w-sm ${
            t.type === "error" ? "bg-red-600 text-white" :
            t.type === "success" ? "bg-emerald-600 text-white" :
            "bg-[#1A1612] text-white"
          }`}>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

function useToast() { return React.useContext(ToastCtx); }

/* Хук подтверждения удаления */
function useConfirmDelete() {
  return (msg = "Удалить запись?") => confirm(msg);
}

/* Генерация slug */
function slugify(s) {
  const map = { а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya' };
  return (s || "")
    .toLowerCase()
    .split("")
    .map((c) => map[c] !== undefined ? map[c] : c)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/* Переключатель опубликовано/черновик */
function PublishToggle({ value, onChange }) {
  return (
    <label className="!m-0 inline-flex items-center gap-2 cursor-pointer select-none">
      <span className={`text-xs font-mono uppercase tracking-wider ${value ? "text-emerald-700" : "text-amber-700"}`}>
        {value ? "Опубликовано" : "Черновик"}
      </span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-colors ${value ? "bg-emerald-500" : "bg-amber-500"}`}
        aria-label="toggle publish"
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? "left-5" : "left-0.5"}`} />
      </button>
    </label>
  );
}

/* SEO-блок: заголовок, описание, OG-картинка (для шеринга в соцсетях/Telegram/WhatsApp) */
function SeoFields({ form, onChange }) {
  return (
    <>
      <div className="bg-[#FBFAF6] border border-[#E5DFD3] rounded-lg p-4 text-xs text-[#5C5550] leading-relaxed">
        <strong>Эти поля влияют на:</strong> заголовок в результатах Google, превью при отправке ссылки в Telegram / WhatsApp / соцсети.
        Если поля пустые — берутся обычный заголовок и краткое описание + главное изображение.
      </div>
      <MultiLangField label="SEO заголовок (≤ 60 символов)" langKey="seo_title" value={form} onChange={onChange} />
      <MultiLangField label="SEO описание (≤ 160 символов)" langKey="seo_description" value={form} onChange={onChange} multiline />
      <ImageUploader value={form.seo_og_image} onChange={(url) => onChange({ seo_og_image: url })} label="OG-картинка для шеринга (опционально, 1200×630 рекомендуется)" />
    </>
  );
}

Object.assign(window, {
  AdminLangTabs, MultiLangField, MultiLangArrayField, MultiLangListField,
  ImageUploader, GalleryUploader, ToastProvider, useToast, useConfirmDelete, slugify,
  PublishToggle, SeoFields,
  ADMIN_LANGS,
});
