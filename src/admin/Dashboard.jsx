/* Главная админки — сводка и быстрые действия. */

function AdminDashboard() {
  const [counts, setCounts] = useState({ news: null, projects: null, gov: null });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    Promise.all([
      SB.from("news").select("id", { count: "exact", head: true }),
      SB.from("projects").select("id", { count: "exact", head: true }),
      SB.from("gov_cases").select("id", { count: "exact", head: true }),
      SB.from("audit_log").select("*").order("occurred_at", { ascending: false }).limit(10),
    ]).then(([n, p, g, a]) => {
      setCounts({ news: n.count, projects: p.count, gov: g.count });
      setRecent(a.data || []);
    }).catch(() => {});
  }, []);

  const cards = [
    { label: "Новости",    count: counts.news,     to: "/admin/news",     icon: "Newspaper" },
    { label: "Объекты",    count: counts.projects, to: "/admin/projects", icon: "Building2" },
    { label: "Госзаказы",  count: counts.gov,      to: "/admin/gov",      icon: "Landmark" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-[#1A1612] mb-2">Главная</h1>
      <p className="text-sm text-[#5C5550] mb-8">Управление контентом сайта Millennium Time Commerce.</p>

      <div className="grid grid-cols-3 gap-4 mb-10">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="bg-white rounded-xl border border-[#E5DFD3] p-5 hover:shadow-md transition-shadow">
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
