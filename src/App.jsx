/* Root composer — Router + Routes */

function App() {
  return (
    <Router>
      <ScrollToTop />
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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
