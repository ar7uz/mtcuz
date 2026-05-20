/* CRUD для активных строек. */

function ProjectsAdmin({ id }) {
  if (id) return <ProjectEditor id={id === "new" ? null : id} />;
  return <ProjectsList />;
}

function ProjectsList() {
  const [items, setItems] = useState(null);
  const { show } = useToast();

  const load = async () => {
    const { data, error } = await SB.from("projects")
      .select("id,slug,name_ru,location_ru,status,main_image,sort_order")
      .order("sort_order");
    if (error) { show(error.message, "error"); return; }
    setItems(data);
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (item) => {
    if (!confirm(`Удалить объект «${item.name_ru}»?`)) return;
    if (item.main_image) { try { await deleteImageByUrl(item.main_image); } catch {} }
    const { error } = await SB.from("projects").delete().eq("id", item.id);
    if (error) { show(error.message, "error"); return; }
    show("Объект удалён", "success");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl text-[#1A1612]">Объекты</h1>
        <Link to="/admin/projects/new" className="admin-btn admin-btn-primary">
          <Icon name="Plus" size={16} /> Добавить объект
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#E5DFD3] overflow-hidden">
        {items === null ? (
          <div className="p-8 text-center text-[#8A847B]">Загрузка…</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-[#8A847B]">Объектов пока нет.</div>
        ) : items.map((p) => (
          <div key={p.id} className="flex items-center gap-4 px-5 py-4 border-b border-[#F0EBE2] last:border-0">
            <img src={p.main_image || ""} alt="" className="w-16 h-16 object-cover rounded-lg bg-[#EFEAE2] shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-[#1A1612] truncate">{p.name_ru}</div>
              <div className="text-xs text-[#8A847B] mt-1 flex gap-3">
                <span>{p.location_ru || "—"}</span>
                <span>·</span>
                <span>{p.status}</span>
                <span>·</span>
                <span className="font-mono">{p.slug}</span>
              </div>
            </div>
            <Link to={`/admin/projects/${p.id}`} className="admin-btn admin-btn-ghost">
              <Icon name="Pencil" size={14} /> Редактировать
            </Link>
            <button onClick={() => handleDelete(p)} className="admin-btn admin-btn-ghost text-red-600">
              <Icon name="Trash2" size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectEditor({ id }) {
  const { show } = useToast();
  const { navigate } = useRouter();
  const isNew = !id;
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("main");
  const [form, setForm] = useState({
    slug: "",
    sort_order: 0,
    status: "building",
    status_class: "bg-accent-blue text-white",
    price_from_num: 0,
    lat: null, lng: null,
    main_image: "",
    gallery: [],
    name_ru: "", name_uz: "", name_en: "",
    full_name_ru: "", full_name_uz: "", full_name_en: "",
    tier_ru: "", tier_uz: "", tier_en: "",
    status_label_ru: "", status_label_uz: "", status_label_en: "",
    location_ru: "", location_uz: "", location_en: "",
    district_ru: "", district_uz: "", district_en: "",
    delivery_ru: "", delivery_uz: "", delivery_en: "",
    floors_ru: "", floors_uz: "", floors_en: "",
    apartments_from_ru: "", apartments_from_uz: "", apartments_from_en: "",
    price_from_ru: "", price_from_uz: "", price_from_en: "",
    price_per_meter_ru: "", price_per_meter_uz: "", price_per_meter_en: "",
    description_ru: "", description_uz: "", description_en: "",
    features_ru: [], features_uz: [], features_en: [],
    infrastructure_ru: [], infrastructure_uz: [], infrastructure_en: [],
  });
  const [floorPlans, setFloorPlans] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    if (isNew) return;
    Promise.all([
      SB.from("projects").select("*").eq("id", id).single(),
      SB.from("project_floor_plans").select("*").eq("project_id", id).order("sort_order"),
      SB.from("project_construction_log").select("*").eq("project_id", id).order("sort_order"),
    ]).then(([p, fp, cl]) => {
      if (p.error) { show(p.error.message, "error"); return; }
      setForm({ ...form, ...p.data });
      setFloorPlans(fp.data || []);
      setProgress(cl.data || []);
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
      ? SB.from("projects").insert(payload).select().single()
      : SB.from("projects").update(payload).eq("id", id).select().single();
    const { data, error } = await op;
    if (error) { setSaving(false); show(error.message, "error"); return; }

    const projectId = data.id;

    // Replace floor_plans / progress (простой подход — удалить все и вставить заново)
    if (!isNew) {
      await SB.from("project_floor_plans").delete().eq("project_id", projectId);
      await SB.from("project_construction_log").delete().eq("project_id", projectId);
    }
    if (floorPlans.length) {
      const fp = floorPlans.map((p, i) => ({
        project_id: projectId, sort_order: i, image: p.image || null,
        rooms_ru: p.rooms_ru, rooms_uz: p.rooms_uz, rooms_en: p.rooms_en,
        area_ru:  p.area_ru,  area_uz:  p.area_uz,  area_en:  p.area_en,
        price_ru: p.price_ru, price_uz: p.price_uz, price_en: p.price_en,
      }));
      const r = await SB.from("project_floor_plans").insert(fp);
      if (r.error) { setSaving(false); show("Ошибка планировок: " + r.error.message, "error"); return; }
    }
    if (progress.length) {
      const cl = progress.map((p, i) => ({
        project_id: projectId, sort_order: i, image: p.image || null,
        month_ru: p.month_ru,   month_uz: p.month_uz,   month_en: p.month_en,
        status_ru: p.status_ru, status_uz: p.status_uz, status_en: p.status_en,
      }));
      const r = await SB.from("project_construction_log").insert(cl);
      if (r.error) { setSaving(false); show("Ошибка прогресса: " + r.error.message, "error"); return; }
    }

    setSaving(false);
    show(isNew ? "Объект создан" : "Сохранено", "success");
    navigate("/admin/projects");
  };

  if (loading) return <div className="text-[#8A847B]">Загрузка…</div>;

  const tabs = [
    { key: "main",     label: "Основное" },
    { key: "details",  label: "Детали" },
    { key: "lists",    label: "Списки" },
    { key: "gallery",  label: "Галерея" },
    { key: "plans",    label: "Планировки" },
    { key: "progress", label: "Ход стройки" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/admin/projects" className="text-xs text-[#063CA1] hover:underline flex items-center gap-1 mb-2">
            <Icon name="ArrowLeft" size={12} /> К списку
          </Link>
          <h1 className="font-serif text-3xl text-[#1A1612]">
            {isNew ? "Новый объект" : (form.name_ru || "Объект")}
          </h1>
        </div>
        <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary">
          <Icon name="Check" size={16} /> {saving ? "Сохранение…" : "Сохранить"}
        </button>
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
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label>Slug (URL)</label>
                <input value={form.slug} onChange={(e) => upd({ slug: e.target.value })} placeholder="project-slug" />
                {form.name_ru && !form.slug && (
                  <button type="button" className="text-xs text-[#063CA1] mt-1 hover:underline"
                    onClick={() => upd({ slug: slugify(form.name_ru) })}>
                    сгенерировать из названия
                  </button>
                )}
              </div>
              <div>
                <label>Статус (ключ)</label>
                <select value={form.status} onChange={(e) => upd({ status: e.target.value })}>
                  <option value="building">building</option>
                  <option value="completed">completed</option>
                  <option value="planned">planned</option>
                </select>
              </div>
              <div>
                <label>Порядок</label>
                <input type="number" value={form.sort_order} onChange={(e) => upd({ sort_order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>

            <ImageUploader value={form.main_image} onChange={(url) => upd({ main_image: url })} label="Главное изображение" />

            <MultiLangField label="Название" langKey="name" value={form} onChange={upd} required />
            <MultiLangField label="Полное название" langKey="full_name" value={form} onChange={upd} />
            <MultiLangField label="Категория (tier)" langKey="tier" value={form} onChange={upd} />
            <MultiLangField label="Подпись статуса" langKey="status_label" value={form} onChange={upd} />
            <MultiLangField label="Описание" langKey="description" value={form} onChange={upd} multiline />
          </>
        )}

        {tab === "details" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Широта (lat)</label>
                <input type="number" step="0.0001" value={form.lat ?? ""} onChange={(e) => upd({ lat: e.target.value ? parseFloat(e.target.value) : null })} />
              </div>
              <div>
                <label>Долгота (lng)</label>
                <input type="number" step="0.0001" value={form.lng ?? ""} onChange={(e) => upd({ lng: e.target.value ? parseFloat(e.target.value) : null })} />
              </div>
            </div>
            <MultiLangField label="Локация" langKey="location" value={form} onChange={upd} />
            <MultiLangField label="Район" langKey="district" value={form} onChange={upd} />
            <MultiLangField label="Срок сдачи" langKey="delivery" value={form} onChange={upd} />
            <MultiLangField label="Этажность" langKey="floors" value={form} onChange={upd} />
            <MultiLangField label="Кол-во квартир / блоков" langKey="apartments_from" value={form} onChange={upd} />
            <MultiLangField label="Цена от" langKey="price_from" value={form} onChange={upd} />
            <MultiLangField label="Цена за м²" langKey="price_per_meter" value={form} onChange={upd} />
          </>
        )}

        {tab === "lists" && (
          <>
            <MultiLangListField label="Особенности (features)" langKey="features" value={form} onChange={upd} />
            <MultiLangListField label="Инфраструктура" langKey="infrastructure" value={form} onChange={upd} />
          </>
        )}

        {tab === "gallery" && (
          <GalleryUploader value={form.gallery} onChange={(g) => upd({ gallery: g })} />
        )}

        {tab === "plans" && (
          <RepeatableSection
            title="Планировки"
            items={floorPlans}
            setItems={setFloorPlans}
            fields={[
              { key: "rooms",  label: "Тип/Блок" },
              { key: "area",   label: "Площадь / этажи" },
              { key: "price",  label: "Цена" },
            ]}
            hasImage
          />
        )}

        {tab === "progress" && (
          <RepeatableSection
            title="Ход строительства"
            items={progress}
            setItems={setProgress}
            fields={[
              { key: "month",  label: "Период" },
              { key: "status", label: "Что сделано" },
            ]}
            hasImage
          />
        )}
      </div>
    </div>
  );
}

/* Универсальный редактор для списка под-объектов с мультиязычными полями */
function RepeatableSection({ title, items, setItems, fields, hasImage }) {
  const updItem = (i, patch) => setItems(items.map((it, j) => j === i ? { ...it, ...patch } : it));
  const removeItem = (i) => setItems(items.filter((_, j) => j !== i));
  const addItem = () => setItems([...items, {}]);
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="!mb-0">{title}</label>
        <button type="button" onClick={addItem} className="admin-btn admin-btn-ghost">
          <Icon name="Plus" size={14} /> Добавить
        </button>
      </div>
      <div className="space-y-4">
        {items.length === 0 && <div className="text-sm text-[#8A847B]">Пока пусто.</div>}
        {items.map((it, i) => (
          <div key={i} className="border border-[#E5DFD3] rounded-lg p-4 bg-[#FBFAF6]">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-mono text-[#8A847B]">#{i + 1}</div>
              <div className="flex gap-1">
                <button type="button" onClick={() => move(i, -1)} className="admin-btn admin-btn-ghost !p-1.5"><Icon name="ChevronUp" size={14} /></button>
                <button type="button" onClick={() => move(i, 1)} className="admin-btn admin-btn-ghost !p-1.5"><Icon name="ChevronDown" size={14} /></button>
                <button type="button" onClick={() => removeItem(i)} className="admin-btn admin-btn-ghost !p-1.5 text-red-600"><Icon name="Trash2" size={14} /></button>
              </div>
            </div>
            {hasImage && (
              <div className="mb-3">
                <ImageUploader value={it.image} onChange={(url) => updItem(i, { image: url })} label="Изображение" />
              </div>
            )}
            {fields.map((f) => (
              <div key={f.key} className="mb-3 last:mb-0">
                <MultiLangField
                  label={f.label}
                  langKey={f.key}
                  value={it}
                  onChange={(patch) => updItem(i, patch)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { ProjectsAdmin, ProjectsList, ProjectEditor, RepeatableSection });
