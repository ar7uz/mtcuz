/* CRUD для заявок с публичной формы. */

function LeadsAdmin({ id }) {
  if (id) return <LeadDetail id={id} />;
  return <LeadsList />;
}

const STATUS_META = {
  new:         { label: "Новая",     cls: "bg-blue-100 text-blue-800 border-blue-200" },
  in_progress: { label: "В работе",  cls: "bg-amber-100 text-amber-800 border-amber-200" },
  closed:      { label: "Закрыта",   cls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  spam:        { label: "Спам",      cls: "bg-zinc-200 text-zinc-600 border-zinc-300" },
};

function StatusBadge({ status }) {
  const m = STATUS_META[status] || { label: status, cls: "bg-gray-100" };
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-mono rounded border ${m.cls}`}>
      {m.label}
    </span>
  );
}

function LeadsList() {
  const [items, setItems] = useState(null);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState("active"); // active | all | new | in_progress | closed | spam
  const [search, setSearch] = useState("");
  const { show } = useToast();

  const load = async () => {
    let q = SB.from("leads").select("*").order("created_at", { ascending: false }).limit(200);
    if (filter === "active") q = q.in("status", ["new", "in_progress"]);
    else if (filter !== "all") q = q.eq("status", filter);
    const { data, error } = await q;
    if (error) { show(error.message, "error"); return; }
    setItems(data);
  };

  const loadStats = async () => {
    const { data, error } = await SB.rpc("leads_stats");
    if (!error && data && data[0]) setStats(data[0]);
  };

  useEffect(() => { load(); }, [filter]);
  useEffect(() => { loadStats(); }, []);

  const filtered = (items || []).filter((l) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (l.name || "").toLowerCase().includes(s) ||
           (l.phone || "").toLowerCase().includes(s) ||
           (l.email || "").toLowerCase().includes(s) ||
           (l.message || "").toLowerCase().includes(s);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl text-[#1A1612]">Заявки</h1>
      </div>

      {/* Статистика */}
      {stats && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          <StatCard label="Всего"           value={stats.total} />
          <StatCard label="Новых"           value={stats.new_count}   highlight="text-blue-700" />
          <StatCard label="Сегодня"         value={stats.today} />
          <StatCard label="За 7 дней"       value={stats.last_7_days} />
        </div>
      )}

      {/* Фильтры */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {[
          { k: "active",      label: "Активные" },
          { k: "new",         label: "Новые" },
          { k: "in_progress", label: "В работе" },
          { k: "closed",      label: "Закрытые" },
          { k: "spam",        label: "Спам" },
          { k: "all",         label: "Все" },
        ].map((f) => (
          <button key={f.k} onClick={() => setFilter(f.k)}
            className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
              filter === f.k ? "bg-[#063CA1] text-white" : "bg-white border border-[#E5DFD3] text-[#5C5550] hover:bg-[#F5F1EA]"
            }`}>
            {f.label}
          </button>
        ))}
        <input
          placeholder="Поиск имя/телефон/email/текст…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto max-w-xs"
        />
      </div>

      <div className="bg-white rounded-xl border border-[#E5DFD3] overflow-hidden">
        {items === null ? (
          <div className="p-8 text-center text-[#8A847B]">Загрузка…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-[#8A847B]">Заявок нет.</div>
        ) : filtered.map((l) => (
          <Link key={l.id} to={`/admin/leads/${l.id}`}
            className="flex items-start gap-4 px-5 py-4 border-b border-[#F0EBE2] last:border-0 hover:bg-[#FBFAF6] transition-colors">
            <div className="font-mono text-[11px] text-[#8A847B] w-28 shrink-0 mt-0.5">
              {new Date(l.created_at).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" })}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-medium text-[#1A1612]">{l.name}</span>
                <StatusBadge status={l.status} />
              </div>
              <div className="text-xs text-[#5C5550] font-mono">{l.phone}{l.email ? ` · ${l.email}` : ""}</div>
              {l.message && <div className="text-sm text-[#5C5550] mt-1 line-clamp-2">{l.message}</div>}
              {l.source_page && <div className="text-[11px] text-[#8A847B] mt-1 font-mono">→ {l.source_page}</div>}
            </div>
            <Icon name="ChevronRight" size={16} className="text-[#8A847B] shrink-0 mt-2" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight }) {
  return (
    <div className="bg-white rounded-xl border border-[#E5DFD3] p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#8A847B]">{label}</div>
      <div className={`font-serif text-3xl mt-1 ${highlight || "text-[#1A1612]"}`}>{value}</div>
    </div>
  );
}

function LeadDetail({ id }) {
  const { show } = useToast();
  const { navigate } = useRouter();
  const [lead, setLead] = useState(null);
  const [history, setHistory] = useState([]);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data, error } = await SB.from("leads").select("*").eq("id", id).single();
    if (error) { show(error.message, "error"); return; }
    setLead(data);
    setNotes(data.notes || "");

    const { data: aud } = await SB.from("audit_log").select("*")
      .eq("table_name", "leads").eq("row_id", id)
      .order("occurred_at", { ascending: false });
    setHistory(aud || []);
  };
  useEffect(() => { load(); }, [id]);

  const updateStatus = async (newStatus) => {
    setBusy(true);
    const { error } = await SB.from("leads").update({ status: newStatus }).eq("id", id);
    setBusy(false);
    if (error) { show(error.message, "error"); return; }
    show(`Статус → ${STATUS_META[newStatus].label}`, "success");
    load();
  };

  const saveNotes = async () => {
    setBusy(true);
    const { error } = await SB.from("leads").update({ notes }).eq("id", id);
    setBusy(false);
    if (error) { show(error.message, "error"); return; }
    show("Заметки сохранены", "success");
    load();
  };

  const handleDelete = async () => {
    if (!confirm("Удалить заявку безвозвратно?")) return;
    const { error } = await SB.from("leads").delete().eq("id", id);
    if (error) { show(error.message, "error"); return; }
    show("Удалено", "success");
    navigate("/admin/leads");
  };

  if (!lead) return <div className="text-[#8A847B]">Загрузка…</div>;

  return (
    <div className="max-w-4xl">
      <Link to="/admin/leads" className="text-xs text-[#063CA1] hover:underline flex items-center gap-1 mb-2">
        <Icon name="ArrowLeft" size={12} /> К списку заявок
      </Link>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-[#1A1612]">{lead.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <StatusBadge status={lead.status} />
            <span className="text-xs text-[#8A847B] font-mono">
              {new Date(lead.created_at).toLocaleString("ru-RU")}
            </span>
          </div>
        </div>
        <button onClick={handleDelete} className="admin-btn admin-btn-ghost text-red-600">
          <Icon name="Trash2" size={14} /> Удалить
        </button>
      </div>

      {/* Контактные данные */}
      <div className="bg-white rounded-xl border border-[#E5DFD3] p-6 mb-4">
        <h2 className="font-serif text-lg text-[#1A1612] mb-4">Контакт</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-xs text-[#8A847B] mb-1">Имя</div>
            <div className="text-[#1A1612] font-medium">{lead.name}</div>
          </div>
          <div>
            <div className="text-xs text-[#8A847B] mb-1">Телефон</div>
            <a href={`tel:${lead.phone}`} className="text-[#063CA1] font-mono hover:underline">{lead.phone}</a>
          </div>
          {lead.email && (
            <div>
              <div className="text-xs text-[#8A847B] mb-1">Email</div>
              <a href={`mailto:${lead.email}`} className="text-[#063CA1] hover:underline">{lead.email}</a>
            </div>
          )}
          {lead.source_page && (
            <div>
              <div className="text-xs text-[#8A847B] mb-1">Откуда</div>
              <div className="font-mono text-xs text-[#5C5550]">{lead.source_page}</div>
            </div>
          )}
        </div>
        {lead.message && (
          <div className="mt-5 pt-5 border-t border-[#F0EBE2]">
            <div className="text-xs text-[#8A847B] mb-2">Сообщение</div>
            <div className="text-[#1A1612] whitespace-pre-wrap leading-relaxed">{lead.message}</div>
          </div>
        )}
      </div>

      {/* Управление статусом */}
      <div className="bg-white rounded-xl border border-[#E5DFD3] p-6 mb-4">
        <h2 className="font-serif text-lg text-[#1A1612] mb-4">Статус</h2>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(STATUS_META).map(([k, m]) => (
            <button key={k} onClick={() => updateStatus(k)} disabled={busy || lead.status === k}
              className={`admin-btn ${lead.status === k ? "admin-btn-primary" : "admin-btn-ghost"} text-xs`}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Заметки */}
      <div className="bg-white rounded-xl border border-[#E5DFD3] p-6 mb-4">
        <h2 className="font-serif text-lg text-[#1A1612] mb-4">Внутренние заметки</h2>
        <textarea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Комментарии операторов, контекст разговора, договорённости…"
        />
        <button onClick={saveNotes} disabled={busy} className="admin-btn admin-btn-primary mt-3">
          <Icon name="Check" size={14} /> Сохранить заметки
        </button>
      </div>

      {/* Технические детали */}
      <details className="bg-white rounded-xl border border-[#E5DFD3] p-6 mb-4">
        <summary className="font-serif text-lg text-[#1A1612] cursor-pointer">Техническая информация</summary>
        <dl className="grid grid-cols-2 gap-3 text-xs mt-4 font-mono">
          <dt className="text-[#8A847B]">ID</dt><dd className="text-[#1A1612]">{lead.id}</dd>
          <dt className="text-[#8A847B]">Referrer</dt><dd className="text-[#1A1612] truncate">{lead.source_referrer || "—"}</dd>
          <dt className="text-[#8A847B]">User Agent</dt><dd className="text-[#1A1612] truncate">{lead.user_agent || "—"}</dd>
          <dt className="text-[#8A847B]">Telegram msg</dt><dd className="text-[#1A1612]">{lead.telegram_message_id || "—"}</dd>
        </dl>
      </details>

      {/* История изменений */}
      <div className="bg-white rounded-xl border border-[#E5DFD3] p-6">
        <h2 className="font-serif text-lg text-[#1A1612] mb-4">История изменений</h2>
        {history.length === 0 ? (
          <div className="text-sm text-[#8A847B]">Пока пусто.</div>
        ) : (
          <div className="space-y-2">
            {history.map((h) => (
              <div key={h.id} className="flex gap-3 text-xs py-2 border-b border-[#F0EBE2] last:border-0">
                <div className="font-mono text-[#8A847B] w-32 shrink-0">
                  {new Date(h.occurred_at).toLocaleString("ru-RU")}
                </div>
                <div className="font-mono text-[10px] px-1.5 py-0.5 rounded h-fit bg-[#EFEAE2] text-[#5C5550]">
                  {h.action}
                </div>
                <div className="text-[#5C5550] flex-1">{h.user_email || "—"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { LeadsAdmin, LeadsList, LeadDetail, StatusBadge });
