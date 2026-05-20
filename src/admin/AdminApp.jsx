/* Корневой компонент админки.
 * - Гейт: проверяет сессию Supabase, показывает Login если не залогинен
 * - Проверка whitelist'а: пользователь должен быть в public.admins (проверяем через rpc is_admin)
 * - Маршрутизация под /admin/* через параметры из useParams
 */

function AdminApp({ params }) {
  const { path, navigate } = useRouter();
  const [user, setUser] = useState(undefined); // undefined = loading, null = anonymous
  const [isAdmin, setIsAdmin] = useState(undefined);

  // Парсим путь: /admin, /admin/news, /admin/news/:id
  const parts = path.split("/").filter(Boolean); // ["admin", "section?", "id?"]
  const section = parts[1] || "dashboard";
  const itemId = parts[2] || null;

  useEffect(() => {
    let unsub;
    SB.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });
    const sub = SB.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    unsub = sub.data.subscription.unsubscribe;
    return () => { if (unsub) unsub(); };
  }, []);

  // Проверка прав админа после логина
  useEffect(() => {
    if (!user) { setIsAdmin(undefined); return; }
    SB.rpc("is_admin").then(({ data, error }) => {
      if (error) { console.warn(error); setIsAdmin(false); return; }
      setIsAdmin(!!data);
    });
  }, [user]);

  const handleLogout = async () => {
    await SB.auth.signOut();
    navigate("/admin");
  };

  if (user === undefined) {
    return <div className="admin-root min-h-screen flex items-center justify-center text-[#8A847B]">Загрузка…</div>;
  }

  if (!user) {
    return (
      <ToastProvider>
        <AdminLogin onLogin={() => { /* onAuthStateChange сам обновит user */ }} />
      </ToastProvider>
    );
  }

  if (isAdmin === undefined) {
    return <div className="admin-root min-h-screen flex items-center justify-center text-[#8A847B]">Проверка прав…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="admin-root min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-white rounded-2xl p-8 border border-[#E5DFD3] shadow-xl">
          <div className="text-red-600 mb-3"><Icon name="ShieldAlert" size={32} className="inline" /></div>
          <h1 className="font-serif text-xl text-[#1A1612] mb-2">Нет доступа</h1>
          <p className="text-sm text-[#5C5550] mb-5">
            Пользователь <span className="font-mono">{user.email}</span> не находится в whitelist'е администраторов.
            Обратитесь к владельцу аккаунта Supabase, чтобы добавить вас.
          </p>
          <button onClick={handleLogout} className="admin-btn admin-btn-ghost">
            Выйти и войти под другим аккаунтом
          </button>
        </div>
      </div>
    );
  }

  // Авторизован и админ — показываем layout + содержимое
  let content;
  switch (section) {
    case "news":      content = <NewsAdmin      id={itemId} />; break;
    case "projects":  content = <ProjectsAdmin  id={itemId} />; break;
    case "gov":       content = <GovCasesAdmin  id={itemId} />; break;
    case "leads":     content = <LeadsAdmin     id={itemId} />; break;
    case "analytics": content = <AnalyticsAdmin />; break;
    default:          content = <AdminDashboard />;
  }

  return (
    <ToastProvider>
      <AdminLayout section={section} user={user} onLogout={handleLogout}>
        {content}
      </AdminLayout>
    </ToastProvider>
  );
}

window.AdminApp = AdminApp;
