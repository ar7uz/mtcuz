/* CRUD для госзаказов / завершённых объектов. */

function GovCasesAdmin({ id }) {
  if (id) return <GovCaseEditor id={id === "new" ? null : id} />;
  return <GovCasesList />;
}

function GovCasesList() {
  const [items, setItems] = useState(null);
  const { show } = useToast();

  const load = async () => {
    const { data, error } = await SB.from("gov_cases")
      .select("id,slug,name_ru,customer_ru,year_ru,image,sort_order")
      .order("sort_order");
    if (error) { show(error.message, "error"); return; }
    setItems(data);
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (item) => {
    if (!confirm(`Удалить объект «${item.name_ru}»?`)) return;
    if (item.image) { try { await deleteImageByUrl(item.image); } catch {} }
    const { error } = await SB.from("gov_cases").delete().eq("id", item.id);
    if (error) { show(error.message, "error"); return; }
    show("Удалено", "success");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl text-[#1A1612]">Госзаказы</h1>
        <Link to="/admin/gov/new" className="admin-btn admin-btn-primary">
          <Icon name="Plus" size={16} /> Добавить объект
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#E5DFD3] overflow-hidden">
        {items === null ? (
          <div className="p-8 text-center text-[#8A847B]">Загрузка…</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-[#8A847B]">Объектов пока нет.</div>
        ) : items.map((c) => (
          <div key={c.id} className="flex items-center gap-4 px-5 py-4 border-b border-[#F0EBE2] last:border-0">
            <img src={c.image || ""} alt="" className="w-16 h-16 object-cover rounded-lg bg-[#EFEAE2] shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-[#1A1612] truncate">{c.name_ru}</div>
              <div className="text-xs text-[#8A847B] mt-1 flex gap-3">
                <span>{c.customer_ru || "—"}</span>
                <span>·</span>
                <span>{c.year_ru || "—"}</span>
                <span>·</span>
                <span className="font-mono">{c.slug}</span>
              </div>
            </div>
            <Link to={`/admin/gov/${c.id}`} className="admin-btn admin-btn-ghost">
              <Icon name="Pencil" size={14} /> Редактировать
            </Link>
            <button onClick={() => handleDelete(c)} className="admin-btn admin-btn-ghost text-red-600">
              <Icon name="Trash2" size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function GovCaseEditor({ id }) {
  const { show } = useToast();
  const { navigate } = useRouter();
  const isNew = !id;
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("main");
  const [form, setForm] = useState({
    slug: "", sort_order: 0, image: "", gallery: [], is_published: true,
    seo_title_ru: "", seo_title_uz: "", seo_title_en: "",
    seo_description_ru: "", seo_description_uz: "", seo_description_en: "",
    seo_og_image: "",
    name_ru: "", name_uz: "", name_en: "",
    full_name_ru: "", full_name_uz: "", full_name_en: "",
    customer_ru: "", customer_uz: "", customer_en: "",
    year_ru: "", year_uz: "", year_en: "",
    budget_ru: "", budget_uz: "", budget_en: "",
    area_ru: "", area_uz: "", area_en: "",
    capacity_ru: "", capacity_uz: "", capacity_en: "",
    deadline_ru: "", deadline_uz: "", deadline_en: "",
    description_ru: "", description_uz: "", description_en: "",
  });
  const [specs, setSpecs] = useState([]);

  useEffect(() => {
    if (isNew) return;
    Promise.all([
      SB.from("gov_cases").select("*").eq("id", id).single(),
      SB.from("gov_specs").select("*").eq("gov_case_id", id).order("sort_order"),
    ]).then(([c, s]) => {
      if (c.error) { show(c.error.message, "error"); return; }
      setForm({ ...form, ...c.data });
      setSpecs(s.data || []);
      setLoading(false);
    });
  }, [id]);

  const upd = (patch) => setForm((f) => ({ ...f, ...patch }));

  const handleSave = async () => {
    if (!form.name_ru.trim()) { show("Название (RU) обязательно", "error"); return; }
    if (!form.slug.trim()) { show("Slug обязателен", "error"); return; }
    setSaving(true);

    const payload = { ...form };
    delete payload.id; delete payload.created_at; delete payload.updated_at;

    const op = isNew
      ? SB.from("gov_cases").insert(payload).select().single()
      : SB.from("gov_cases").update(payload).eq("id", id).select().single();
    const { data, error } = await op;
    if (error) { setSaving(false); show(error.message, "error"); return; }

    const caseId = data.id;
    if (!isNew) await SB.from("gov_specs").delete().eq("gov_case_id", caseId);
    if (specs.length) {
      const rows = specs.map((s, i) => ({
        gov_case_id: caseId, sort_order: i,
        label_ru: s.label_ru, label_uz: s.label_uz, label_en: s.label_en,
        value_ru: s.value_ru, value_uz: s.value_uz, value_en: s.value_en,
      }));
      const r = await SB.from("gov_specs").insert(rows);
      if (r.error) { setSaving(false); show("Ошибка спецификаций: " + r.error.message, "error"); return; }
    }

    setSaving(false);
    show(isNew ? "Объект создан" : "Сохранено", "success");
    navigate("/admin/gov");
  };

  if (loading) return <div className="text-[#8A847B]">Загрузка…</div>;

  const tabs = [
    { key: "main",    label: "Основное" },
    { key: "details", label: "Детали" },
    { key: "specs",   label: "Спецификации" },
    { key: "gallery", label: "Галерея" },
    { key: "seo",     label: "SEO" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/admin/gov" className="text-xs text-[#063CA1] hover:underline flex items-center gap-1 mb-2">
            <Icon name="ArrowLeft" size={12} /> К списку
          </Link>
          <h1 className="font-serif text-3xl text-[#1A1612]">
            {isNew ? "Новый объект" : (form.name_ru || "Объект")}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <PublishToggle value={form.is_published} onChange={(v) => upd({ is_published: v })} />
          <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary">
            <Icon name="Check" size={16} /> {saving ? "Сохранение…" : "Сохранить"}
          </button>
        </div>
      </div>

      <div className="flex gap-1 mb-4 border-b border-[#E5DFD3]">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.key ? "border-[#063CA1] text-[#063CA1]" : "border-transparent text-[#5C5550] hover:text-[#1A1612]"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#E5DFD3] p-6 space-y-5 max-w-4xl">
        {tab === "main" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Slug (URL)</label>
                <input value={form.slug} onChange={(e) => upd({ slug: e.target.value })} placeholder="gov-slug" />
                {form.name_ru && !form.slug && (
                  <button type="button" className="text-xs text-[#063CA1] mt-1 hover:underline"
                    onClick={() => upd({ slug: slugify(form.name_ru) })}>
                    сгенерировать из названия
                  </button>
                )}
              </div>
              <div>
                <label>Порядок</label>
                <input type="number" value={form.sort_order} onChange={(e) => upd({ sort_order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>

            <ImageUploader value={form.image} onChange={(url) => upd({ image: url })} label="Главное изображение" />

            <MultiLangField label="Название"         langKey="name"      value={form} onChange={upd} required />
            <MultiLangField label="Полное название"  langKey="full_name" value={form} onChange={upd} />
            <MultiLangField label="Описание"          langKey="description" value={form} onChange={upd} multiline />
          </>
        )}

        {tab === "details" && (
          <>
            <MultiLangField label="Заказчик"        langKey="customer" value={form} onChange={upd} />
            <MultiLangField label="Год / Статус"    langKey="year"     value={form} onChange={upd} />
            <MultiLangField label="Бюджет"          langKey="budget"   value={form} onChange={upd} />
            <MultiLangField label="Площадь / Тип"   langKey="area"     value={form} onChange={upd} />
            <MultiLangField label="Вместимость"     langKey="capacity" value={form} onChange={upd} />
            <MultiLangField label="Срок реализации" langKey="deadline" value={form} onChange={upd} />
          </>
        )}

        {tab === "specs" && (
          <RepeatableSection
            title="Спецификации (характеристики)"
            items={specs}
            setItems={setSpecs}
            fields={[
              { key: "label", label: "Параметр" },
              { key: "value", label: "Значение" },
            ]}
          />
        )}

        {tab === "gallery" && (
          <GalleryUploader value={form.gallery} onChange={(g) => upd({ gallery: g })} />
        )}

        {tab === "seo" && <SeoFields form={form} onChange={upd} />}
      </div>
    </div>
  );
}

Object.assign(window, { GovCasesAdmin, GovCasesList, GovCaseEditor });
