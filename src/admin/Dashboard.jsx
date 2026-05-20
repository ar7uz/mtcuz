/* Главная админки — сводка, быстрые действия, бекап. */

function AdminDashboard() {
  const [counts, setCounts] = useState({ news: null, projects: null, gov: null, leads: null });
  const [leadsStats, setLeadsStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [busy, setBusy] = useState(false);
  const { show } = useToast();

  useEffect(() => {
    Promise.all([
      SB.from("news").select("id", { count: "exact", head: true }),
      SB.from("projects").select("id", { count: "exact", head: true }),
      SB.from("gov_cases").select("id", { count: "exact", head: true }),
      SB.from("leads").select("id", { count: "exact", head: true }),
      SB.from("audit_log").select("*").order("occurred_at", { ascending: false }).limit(10),
      SB.rpc("leads_stats"),
    ]).then(([n, p, g, l, a, ls]) => {
      setCounts({ news: n.count, projects: p.count, gov: g.count, leads: l.count });
      setRecent(a.data || []);
      setLeadsStats(ls.data?.[0] || null);
    }).catch(() => {});
  }, []);

  const cards = [
    { label: "Заявки",     count: counts.leads,    to: "/admin/leads",     icon: "Inbox",      highlight: leadsStats?.new_count },
    { label: "Новости",    count: counts.news,     to: "/admin/news",      icon: "Newspaper" },
    { label: "Объекты",    count: counts.projects, to: "/admin/projects",  icon: "Building2" },
    { label: "Госзаказы",  count: counts.gov,      to: "/admin/gov",       icon: "Landmark" },
  ];

  /* Скачивает полный бекап контента в JSON-файл */
  const handleBackup = async () => {
    setBusy(true);
    try {
      const [proj, fp, cl, gov, gs, news, leads] = await Promise.all([
        SB.from("projects").select("*"),
        SB.from("project_floor_plans").select("*"),
        SB.from("project_construction_log").select("*"),
        SB.from("gov_cases").select("*"),
        SB.from("gov_specs").select("*"),
        SB.from("news").select("*"),
        SB.from("leads").select("*"),
      ]);
      for (const r of [proj, fp, cl, gov, gs, news, leads]) {
        if (r.error) throw r.error;
      }
      const backup = {
        version: 1,
        exported_at: new Date().toISOString(),
        projects: proj.data,
        project_floor_plans: fp.data,
        project_construction_log: cl.data,
        gov_cases: gov.data,
        gov_specs: gs.data,
        news: news.data,
        leads: leads.data,
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mtc-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      show("Бекап скачан", "success");
    } catch (e) {
      show("Ошибка бекапа: " + e.message, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-2">
        <h1 className="font-serif text-3xl text-[#1A1612]">Главная</h1>
        <button onClick={handleBackup} disabled={busy} className="admin-btn admin-btn-ghost">
          <Icon name="Download" size={16} /> {busy ? "Готовим…" : "Скачать backup"}
        </button>
      </div>
      <p className="text-sm text-[#5C5550] mb-8">Управление контентом сайта Millennium Time Commerce.</p>

      <div className="grid grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <Link key={c.label} to={c.to}
            className="relative bg-white rounded-xl border border-[#E5DFD3] p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <Icon name={c.icon} size={22} className="text-[#063CA1]" />
              <Icon name="ArrowUpRight" size={16} className="text-[#8A847B]" />
            </div>
            <div className="font-serif text-3xl text-[#1A1612]">
              {c.count == null ? "—" : c.count}
            </div>
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-[#8A847B] mt-1">
              {c.label}
            </div>
            {c.highlight ? (
              <div className="absolute top-3 right-12 px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-mono">
                {c.highlight} новых
              </div>
            ) : null}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#E5DFD3] p-6">
        <h2 className="font-serif text-lg text-[#1A1612] mb-4">Последние изменения</h2>
        {recent.length === 0 ? (
          <div className="text-sm text-[#8A847B]">Журнал пуст.</div>
        ) : (
          <div className="space-y-2">
            {recent.map((r) => (
              <div key={r.id} className="flex items-center gap-4 py-2 border-b border-[#F0EBE2] last:border-0 text-sm">
                <div className="font-mono text-xs text-[#8A847B] w-32 shrink-0">
                  {new Date(r.occurred_at).toLocaleString("ru-RU")}
                </div>
                <div className={`font-mono text-xs px-2 py-0.5 rounded shrink-0 ${
                  r.action === "INSERT" ? "bg-emerald-100 text-emerald-700" :
                  r.action === "DELETE" ? "bg-red-100 text-red-700" :
                  "bg-blue-100 text-blue-700"
                }`}>{r.action}</div>
                <div className="text-[#5C5550] shrink-0">{r.table_name}</div>
                <div className="text-[#8A847B] truncate flex-1">{r.user_email || "—"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

window.AdminDashboard = AdminDashboard;
