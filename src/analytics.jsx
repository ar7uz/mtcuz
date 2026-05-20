/* Простая аналитика — пишет события в public.events.
 * Не использует никаких внешних сервисов, никаких cookies.
 * Vercel Web Analytics крутится параллельно (тег в index.html) — даёт глобальную статистику.
 * Эта же таблица — для бизнес-метрик (просмотры объектов, конверсии в заявки).
 */

const SESSION_KEY = "mtc-session-id";

function getSessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID().slice(0, 36);
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch { return null; }
}

/* track(event, props) — fire-and-forget, ошибки не пробрасываем */
async function track(event_name, opts = {}) {
  try {
    if (!event_name) return;
    // Не трекаем админку
    const hash = (window.location.hash || "").replace(/^#/, "");
    if (hash.startsWith("/admin")) return;

    const payload = {
      event_name: String(event_name).slice(0, 60),
      page_path:  opts.page_path || hash || "/",
      ref_table:  opts.ref_table || null,
      ref_id:     opts.ref_id || null,
      session_id: getSessionId(),
      meta:       opts.meta || null,
    };
    // Используем navigator.sendBeacon для не-блокирующей отправки (если доступен)
    // Иначе обычный supabase insert
    if (window.SB) {
      window.SB.from("events").insert(payload).then(() => {}, () => {});
    }
  } catch { /* swallow */ }
}

/* Хук для трекинга смены маршрута */
function useTrackPageViews() {
  const { path } = useRouter();
  useEffect(() => {
    track("page_view", { page_path: path });
  }, [path]);
}

/* Хук — трекает просмотр конкретного объекта/новости (вызывается на детальной странице) */
function useTrackDetail(table, id) {
  useEffect(() => {
    if (!table || !id) return;
    track("detail_view", { ref_table: table, ref_id: String(id) });
  }, [table, id]);
}

Object.assign(window, { track, useTrackPageViews, useTrackDetail });
