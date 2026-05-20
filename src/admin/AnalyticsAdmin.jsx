/* Аналитика — графики посещений, конверсии, топ объектов. */

function AnalyticsAdmin() {
  const [period, setPeriod] = useState(30);
  const [pageviews, setPageviews] = useState(null);
  const [leads, setLeads] = useState(null);
  const [topProjects, setTopProjects] = useState(null);
  const [topNews, setTopNews] = useState(null);
  const [leadsStats, setLeadsStats] = useState(null);
  const { show } = useToast();

  useEffect(() => {
    Promise.all([
      SB.rpc("events_daily", { p_event_name: "page_view",      p_days: period }),
      SB.rpc("events_daily", { p_event_name: "lead_submitted", p_days: period }),
      SB.rpc("top_viewed",   { p_table: "projects", p_days: period, p_limit: 5 }),
      SB.rpc("top_viewed",   { p_table: "news",     p_days: period, p_limit: 5 }),
      SB.rpc("leads_stats"),
    ]).then(([pv, ls, tp, tn, st]) => {
      if (pv.error) show(pv.error.message, "error");
      setPageviews(pv.data || []);
      setLeads(ls.data || []);
      setTopProjects(tp.data || []);
      setTopNews(tn.data || []);
      setLeadsStats(st.data?.[0] || null);
    });
  }, [period]);

  const projectsBySlug = useMemo(() => {
    const m = {};
    (window.PROJECTS_DATA || []).forEach((p) => { m[p.id] = p; });
    return m;
  }, [window.PROJECTS_DATA]);

  const newsBySlug = useMemo(() => {
    const m = {};
    (window.NEWS_DATA || []).forEach((n) => { m[n.id] = n; });
    return m;
  }, [window.NEWS_DATA]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl text-[#1A1612]">Аналитика</h1>
        <div className="flex gap-1">
          {[7, 30, 90].map((d) => (
            <button key={d} onClick={() => setPeriod(d)}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                period === d ? "bg-[#063CA1] text-white" : "bg-white border border-[#E5DFD3] text-[#5C5550] hover:bg-[#F5F1EA]"
              }`}>
              {d} дней
            </button>
          ))}
        </div>
      </div>

      {/* Сводка по заявкам */}
      {leadsStats && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          <StatCard label="Всего заявок"  value={leadsStats.total} />
          <StatCard label="Новых"         value={leadsStats.new_count}   highlight="text-blue-700" />
          <StatCard label="В работе"      value={leadsStats.in_progress} highlight="text-amber-700" />
          <StatCard label="Закрытых"      value={leadsStats.closed}      highlight="text-emerald-700" />
        </div>
      )}

      {/* Графики */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <ChartCard
          title="Просмотры страниц"
          data={pageviews}
          color="#063CA1"
          empty="Пока нет данных. Подождите пока сайт пособирает события."
        />
        <ChartCard
          title="Отправленные заявки"
          data={leads}
          color="#DA745C"
          empty="Заявок ещё не было."
        />
      </div>

      {/* Топ объектов и новостей */}
      <div className="grid grid-cols-2 gap-4">
        <TopList
          title="Топ объектов по просмотрам"
          rows={topProjects}
          resolveTitle={(rid) => {
            const found = (window.PROJECTS_DATA || []).find((p) => p.id === rid);
            return found ? found.name_ru || found.name : rid;
          }}
        />
        <TopList
          title="Топ новостей по просмотрам"
          rows={topNews}
          resolveTitle={(rid) => {
            const found = (window.NEWS_DATA || []).find((n) => n.id === rid);
            return found ? found.title_ru || found.title : rid;
          }}
        />
      </div>
    </div>
  );
}

/* Простой барчарт без сторонних библиотек */
function ChartCard({ title, data, color, empty }) {
  if (!data) return (
    <div className="bg-white rounded-xl border border-[#E5DFD3] p-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#8A847B] mb-3">{title}</div>
      <div className="text-[#8A847B] text-sm">Загрузка…</div>
    </div>
  );

  if (data.length === 0) return (
    <div className="bg-white rounded-xl border border-[#E5DFD3] p-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#8A847B] mb-3">{title}</div>
      <div className="text-[#8A847B] text-sm">{empty}</div>
    </div>
  );

  const max = Math.max(...data.map((d) => Number(d.n) || 0), 1);
  const total = data.reduce((s, d) => s + Number(d.n || 0), 0);

  return (
    <div className="bg-white rounded-xl border border-[#E5DFD3] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#8A847B]">{title}</div>
        <div className="text-2xl font-serif" style={{ color }}>{total}</div>
      </div>
      <div className="flex items-end gap-1 h-32">
        {data.map((d, i) => {
          const h = (Number(d.n) / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 group relative">
              <div
                style={{ height: `${h}%`, background: color, opacity: 0.75 }}
                className="w-full rounded-t transition-opacity group-hover:opacity-100"
              />
              <div className="hidden group-hover:block absolute -top-7 text-[10px] font-mono bg-[#1A1612] text-white px-2 py-0.5 rounded whitespace-nowrap">
                {new Date(d.day).toLocaleDateString("ru-RU")}: {d.n}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-mono text-[#8A847B]">
        <span>{new Date(data[0].day).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" })}</span>
        <span>{new Date(data[data.length - 1].day).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" })}</span>
      </div>
    </div>
  );
}

function TopList({ title, rows, resolveTitle }) {
  if (!rows) return null;
  return (
    <div className="bg-white rounded-xl border border-[#E5DFD3] p-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#8A847B] mb-4">{title}</div>
      {rows.length === 0 ? (
        <div className="text-sm text-[#8A847B]">Нет данных за период.</div>
      ) : (
        <div className="space-y-2">
          {rows.map((r, i) => (
            <div key={r.ref_id} className="flex items-center gap-3 text-sm">
              <div className="w-6 font-mono text-[#8A847B] text-xs">{i + 1}.</div>
              <div className="flex-1 text-[#1A1612] truncate">{resolveTitle(r.ref_id)}</div>
              <div className="font-mono text-[#063CA1] font-medium">{r.n}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

window.AnalyticsAdmin = AnalyticsAdmin;
