/* Root composer — Router + Routes + content-loading gate + i18n provider */

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-dark text-white/60 font-mono text-sm">
      Загрузка…
    </div>
  );
}

function FooterGate() {
  const { path } = useRouter();
  if (path.startsWith("/admin")) return null;
  return <Footer />;
}

function PageTracker() {
  useTrackPageViews();
  return null;
}

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Ждём пока данные подтянутся из Supabase (или fallback на seed).
    loadAllContent().then((res) => {
      if (res.projects && res.projects.length) setProjectsData(res.projects);
      if (res.govCases && res.govCases.length) setGovCases(res.govCases);
      if (res.news     && res.news.length)     setNewsData(res.news);
      setReady(true);
    });
  }, []);

  if (!ready) return <LoadingScreen />;

  return (
    <LangProvider>
      <Router>
        <ScrollToTop />
        <PageTracker />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsListPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/government" element={<ProjectsListPage />} />
            <Route path="/government/:slug" element={<GovernmentCasePage />} />
            <Route path="/subsidiaries" element={<SubsidiariesPage />} />
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="/news" element={<NewsListPage />} />
            <Route path="/news/:slug" element={<NewsDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contacts" element={<ContactsPage />} />

            {/* Admin — все подмаршруты обрабатывает AdminApp сам */}
            <Route path="/admin" element={<AdminApp />} />
            <Route path="/admin/:section" element={<AdminApp />} />
            <Route path="/admin/:section/:id" element={<AdminApp />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <FooterGate />
      </Router>
    </LangProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
