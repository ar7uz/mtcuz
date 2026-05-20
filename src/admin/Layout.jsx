/* Layout админки: sidebar + основной контент. */

function AdminLayout({ section, user, onLogout, children }) {
  const items = [
    { key: "dashboard", label: "Главная",    icon: "LayoutDashboard", to: "/admin" },
    { key: "news",      label: "Новости",    icon: "Newspaper",        to: "/admin/news" },
    { key: "projects",  label: "Объекты",    icon: "Building2",        to: "/admin/projects" },
    { key: "gov",       label: "Госзаказы",  icon: "Landmark",         to: "/admin/gov" },
  ];

  return (
    <div className="admin-root flex">
      {/* Sidebar */}
      <aside className="w-60 min-h-screen bg-white border-r border-[#E5DFD3] flex flex-col sticky top-0">
        <div className="px-5 py-6 border-b border-[#E5DFD3]">
          <div className="font-serif text-lg text-[#1A1612]">MTC Admin</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A847B] mt-0.5">
            Управление контентом
          </div>
        </div>

        <nav className="flex-1 py-4">
          {items.map((it) => (
            <Link
              key={it.key}
              to={it.to}
              className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                section === it.key
                  ? "bg-[#063CA1]/8 text-[#063CA1] border-r-2 border-[#063CA1]"
                  : "text-[#5C5550] hover:bg-[#F5F1EA] hover:text-[#1A1612]"
              }`}
            >
              <Icon name={it.icon} size={18} />
              {it.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-[#E5DFD3] p-4 space-y-2">
          <div className="text-xs text-[#5C5550] truncate" title={user?.email}>
            {user?.email}
          </div>
          <div className="flex gap-2">
            <Link to="/" className="admin-btn admin-btn-ghost !py-1.5 !px-3 text-xs flex-1 justify-center">
              <Icon name="ExternalLink" size={12} /> Сайт
            </Link>
            <button onClick={onLogout} className="admin-btn admin-btn-ghost !py-1.5 !px-3 text-xs flex-1 justify-center">
              <Icon name="LogOut" size={12} /> Выйти
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 max-w-[1400px]">
        {children}
      </main>
    </div>
  );
}

window.AdminLayout = AdminLayout;
