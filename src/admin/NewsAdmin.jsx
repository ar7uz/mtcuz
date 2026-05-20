/* CRUD для новостей. */

function NewsAdmin({ id }) {
  if (id) return <NewsEditor id={id === "new" ? null : id} />;
  return <NewsList />;
}

function NewsList() {
  const [items, setItems] = useState(null);
  const [search, setSearch] = useState("");
  const { show } = useToast();

  const load = async () => {
    const { data, error } = await SB.from("news")
      .select("id,slug,title_ru,iso_date,category_ru,image")
      .order("iso_date", { ascending: false });
    if (error) { show(error.message, "error"); return; }
    setItems(data);
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (item) => {
    if (!confirm(`Удалить новость «${item.title_ru}»?`)) return;
    if (item.image) { try { await deleteImageByUrl(item.image); } catch {} }
    const { error } = await SB.from("news").delete().eq("id", item.id);
    if (error) { show(error.message, "error"); return; }
    show("Новость удалена", "success");
    load();
  };

  const filtered = (items || []).filter((n) =>
    !search || n.title_ru.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl text-[#1A1612]">Новости</h1>
        <Link to="/admin/news/new" className="admin-btn admin-btn-primary">
          <Icon name="Plus" size={16} /> Добавить новость
        </Link>
      </div>

      <input
        placeholder="Поиск по заголовку…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 max-w-md"
      />

      <div className="bg-white rounded-xl border border-[#E5DFD3] overflow-hidden">
        {items === null ? (
          <div className="p-8 text-center text-[#8A847B]">Загрузка…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-[#8A847B]">Ничего не найдено.</div>
        ) : filtered.map((n) => (
          <div key={n.id} className="flex items-center gap-4 px-5 py-4 border-b border-[#F0EBE2] last:border-0">
            <img src={n.image || ""} alt="" className="w-16 h-16 object-cover rounded-lg bg-[#EFEAE2] shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-[#1A1612] truncate">{n.title_ru}</div>
              <div className="text-xs text-[#8A847B] mt-1 flex gap-3">
                <span>{n.iso_date}</span>
                <span>·</span>
                <span>{n.category_ru || "—"}</span>
                <span>·</span>
                <span className="font-mono">{n.slug}</span>
              </div>
            </div>
            <Link to={`/admin/news/${n.id}`} className="admin-btn admin-btn-ghost">
              <Icon name="Pencil" size={14} /> Редактировать
            </Link>
            <button onClick={() => handleDelete(n)} className="admin-btn admin-btn-ghost text-red-600">
              <Icon name="Trash2" size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsEditor({ id }) {
  const { show } = useToast();
  const { navigate } = useRouter();
  const isNew = !id;
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    iso_date: new Date().toISOString().slice(0, 10),
    image: "",
    sort_order: 0,
    title_ru: "", title_uz: "", title_en: "",
    excerpt_ru: "", excerpt_uz: "", excerpt_en: "",
    date_label_ru: "", date_label_uz: "", date_label_en: "",
    category_ru: "", category_uz: "", category_en: "",
    body_ru: [], body_uz: [], body_en: [],
  });

  useEffect(() => {
    if (isNew) return;
    SB.from("news").select("*").eq("id", id).single().then(({ data, error }) => {
      if (error) { show(error.message, "error"); return; }
      setForm({ ...form, ...data });
      setLoading(false);
    });
  }, [id]);

  const upd = (patch) => setForm((f) => ({ ...f, ...patch }));

  const handleSave = async () => {
    if (!form.title_ru.trim()) { show("Заголовок (RU) обязателен", "error"); return; }
    if (!form.slug.trim()) { show("Slug обязателен", "error"); return; }
    setSaving(true);
    const payload = { ...form };
    delete payload.id; delete payload.created_at; delete payload.updated_at;

    const op = isNew
      ? SB.from("news").insert(payload).select().single()
      : SB.from("news").update(payload).eq("id", id).select().single();
    const { error } = await op;
    setSaving(false);
    if (error) { show(error.message, "error"); return; }
    show(isNew ? "Новость создана" : "Сохранено", "success");
    navigate("/admin/news");
  };

  if (loading) return <div className="text-[#8A847B]">Загрузка…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/admin/news" className="text-xs text-[#063CA1] hover:underline flex items-center gap-1 mb-2">
            <Icon name="ArrowLeft" size={12} /> К списку
          </Link>
          <h1 className="font-serif text-3xl text-[#1A1612]">
            {isNew ? "Новая новость" : "Редактирование"}
          </h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary">
          <Icon name="Check" size={16} /> {saving ? "Сохранение…" : "Сохранить"}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#E5DFD3] p-6 space-y-5 max-w-4xl">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label>Slug (URL)</label>
            <input value={form.slug} onChange={(e) => upd({ slug: e.target.value })} placeholder="news-slug" />
            {form.title_ru && !form.slug && (
              <button type="button" className="text-xs text-[#063CA1] mt-1 hover:underline"
                onClick={() => upd({ slug: slugify(form.title_ru) })}>
                сгенерировать из заголовка
              </button>
            )}
          </div>
          <div>
            <label>Дата (ISO)</label>
            <input type="date" value={form.iso_date} onChange={(e) => upd({ iso_date: e.target.value })} />
          </div>
          <div>
            <label>Порядок (меньше = выше)</label>
            <input type="number" value={form.sort_order} onChange={(e) => upd({ sort_order: parseInt(e.target.value) || 0 })} />
          </div>
        </div>

        <ImageUploader value={form.image} onChange={(url) => upd({ image: url })} label="Главное изображение" />

        <MultiLangField label="Заголовок" langKey="title" value={form} onChange={upd} required />
        <MultiLangField label="Категория"  langKey="category" value={form} onChange={upd} />
        <MultiLangField label="Подпись даты (напр. «ИЮНЬ 2025»)" langKey="date_label" value={form} onChange={upd} />
        <MultiLangField label="Краткое описание" langKey="excerpt" value={form} onChange={upd} multiline />
        <MultiLangArrayField label="Текст новости" langKey="body" value={form} onChange={upd} />
      </div>
    </div>
  );
}

Object.assign(window, { NewsAdmin, NewsList, NewsEditor });
