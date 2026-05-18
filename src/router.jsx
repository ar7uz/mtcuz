/* Lightweight hash-based router — mimics react-router-dom shape.
 * URLs look like  index.html#/projects/skyline  — works without a backend.
 */

const RouterCtx = React.createContext({ path: "/", navigate: () => {} });

function parseHash() {
  const raw = (window.location.hash || "#/").replace(/^#/, "");
  const path = raw.startsWith("/") ? raw : "/" + raw;
  return path.split("?")[0] || "/";
}

function Router({ children }) {
  const [path, setPath] = useState(parseHash());

  useEffect(() => {
    const onHash = () => setPath(parseHash());
    window.addEventListener("hashchange", onHash);
    // Ensure hash starts with #/
    if (!window.location.hash) {
      window.location.hash = "#/";
    }
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (to) => {
    const target = to.startsWith("/") ? to : "/" + to;
    if (("#" + target) !== window.location.hash) {
      window.location.hash = "#" + target;
    }
  };

  return (
    <RouterCtx.Provider value={{ path, navigate }}>
      {children}
    </RouterCtx.Provider>
  );
}

function useRouter() {
  return React.useContext(RouterCtx);
}

function useLocation() {
  const { path } = useRouter();
  return { pathname: path };
}

function useParams(pattern) {
  const { path } = useRouter();
  return matchPath(pattern, path)?.params || {};
}

/* Match "/projects/:slug" against current path → returns {params} or null */
function matchPath(pattern, path) {
  const pParts = pattern.split("/").filter(Boolean);
  const aParts = path.split("/").filter(Boolean);
  if (pParts.length !== aParts.length) return null;
  const params = {};
  for (let i = 0; i < pParts.length; i++) {
    if (pParts[i].startsWith(":")) {
      params[pParts[i].slice(1)] = decodeURIComponent(aParts[i]);
    } else if (pParts[i] !== aParts[i]) {
      return null;
    }
  }
  return { params };
}

/* <Route path="/projects" element={...} /> rendered inside <Routes> */
function Route() { return null; }

function Routes({ children }) {
  const { path } = useRouter();
  const kids = React.Children.toArray(children).filter(Boolean);

  for (const child of kids) {
    if (!child || child.type !== Route) continue;
    const m = matchPath(child.props.path, path);
    if (m) {
      return React.cloneElement(child.props.element, { params: m.params });
    }
  }
  // No match → render the catch-all if present (path="*"), else null.
  const fallback = kids.find((c) => c?.props?.path === "*");
  return fallback ? fallback.props.element : null;
}

/* <Link to="/projects" /> — renders <a href="#/projects"> + handles click */
function Link({ to, className, children, onClick, ...rest }) {
  const { navigate } = useRouter();
  const handleClick = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    navigate(to);
    onClick && onClick(e);
  };
  return (
    <a href={"#" + to} className={className} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

/* <NavLink to="..." className={({isActive}) => ...} /> */
function NavLink({ to, className, children, onClick, end, ...rest }) {
  const { path, navigate } = useRouter();
  const isActive = end ? path === to : (path === to || path.startsWith(to + "/"));
  const cls = typeof className === "function" ? className({ isActive }) : className;
  const handleClick = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    navigate(to);
    onClick && onClick(e);
  };
  return (
    <a href={"#" + to} className={cls} onClick={handleClick} {...rest}>
      {typeof children === "function" ? children({ isActive }) : children}
    </a>
  );
}

/* Scroll-to-top on route change */
function ScrollToTop() {
  const { path } = useRouter();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [path]);
  return null;
}

Object.assign(window, { Router, Routes, Route, Link, NavLink, useRouter, useLocation, useParams, matchPath, ScrollToTop });
