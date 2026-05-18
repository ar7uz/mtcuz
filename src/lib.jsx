/* Shared helpers — motion variants, Icon renderer, Counter */
const { useState, useEffect, useRef, useMemo } = React;
const FM = window.Motion || window.FramerMotion || {};
const motion = FM.motion;
const AnimatePresence = FM.AnimatePresence;
const useInView = FM.useInView;
const useScroll = FM.useScroll;
const useTransform = FM.useTransform;
const useMotionValue = FM.useMotionValue;
const animate = FM.animate;

/* ---------- Resource resolver ----------
 * Maps known paths to bundled resource URLs when running as a standalone HTML.
 * Falls back to the original path when not bundled.
 */
const __RESOURCE_PATH_MAP = {
  "images/hero-dark.jpg":           "img_hero_dark",
  "images/hero-light.jpg":          "img_hero_light",
  "images/project-01-premium.jpg":  "img_project_01",
  "images/project-02-business.jpg": "img_project_02",
  "images/project-03-comfort.jpg":  "img_project_03",
  "images/gov-01-hospital.jpg":     "img_gov_01",
  "images/gov-02-school.jpg":       "img_gov_02",
  "images/gov-03-transit.jpg":      "img_gov_03",
  "images/logo-mtc-mark.png":       "img_logo_mark",
  "images/logo-mtc-full.png":       "img_logo_full",
  "videos/hero-dark.webm":          "vid_hero_dark",
  "videos/hero-light.mp4":          "vid_hero_light",
};
function R(path) {
  if (!path) return path;
  const id = __RESOURCE_PATH_MAP[path];
  const resources = window.__resources;
  if (id && resources && resources[id]) return resources[id];
  return path;
}
window.R = R;

/* ---------- Motion variants ---------- */
const ease = [0.16, 1, 0.3, 1];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease },
};

const staggerContainer = {
  initial: {},
  whileInView: {},
  viewport: { once: true, margin: "-100px" },
  transition: { staggerChildren: 0.08 },
};

const childFade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease },
};

/* ---------- Lucide vanilla -> React renderer ----------
 * `lucide.icons[name]` returns [tagName, attrs, children]; render recursively.
 */
function renderLucideNode(node, key) {
  const [tag, attrs, children] = node;
  const props = { key };
  for (const k in attrs) {
    const rk = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    props[rk] = attrs[k];
  }
  const kids = (children || []).map((c, i) => renderLucideNode(c, i));
  return React.createElement(tag, props, ...kids);
}
function Icon({ name, size = 24, fill, strokeWidth, className, style }) {
  const data = lucide.icons[name];
  if (!data) {
    console.warn("Missing lucide icon:", name);
    return null;
  }
  const [, baseAttrs, children] = data;
  const merged = { ...baseAttrs, width: size, height: size };
  if (fill !== undefined) merged.fill = fill;
  if (strokeWidth !== undefined) merged.strokeWidth = strokeWidth;
  delete merged["stroke-width"];
  if (className) merged.className = className;
  if (style) merged.style = style;
  return renderLucideNode(["svg", merged, children], 0);
}

/* ---------- Animated number Counter ---------- */
function Counter({ to, format, duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(format(0));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease,
      onUpdate: (v) => setDisplay(format(v)),
    });
    return () => controls && controls.stop && controls.stop();
  }, [inView, to]);

  return <span ref={ref}>{display}</span>;
}

/* ---------- Section title block (eyebrow + h2 + optional sub) ---------- */
function SectionHead({ eyebrow, title, sub, dark, center = true, eyebrowColor }) {
  const titleColor = dark ? "text-white" : "text-text-light-primary";
  const subColor = dark ? "text-white/60" : "text-text-light-body";
  const eyeC = eyebrowColor || "text-accent-gold";
  return (
    <div className={`${center ? "text-center mx-auto" : ""} max-w-2xl`}>
      <motion.div
        {...fadeUp}
        className={`font-mono text-xs uppercase tracking-[0.2em] ${eyeC}`}
      >
        — {eyebrow}
      </motion.div>
      <motion.h2
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.1 }}
        className={`font-serif font-medium tracking-tight leading-[0.98] text-4xl md:text-5xl lg:text-6xl mt-5 ${titleColor}`}
      >
        {title}
      </motion.h2>
      {sub && (
        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.2 }}
          className={`mt-5 text-base lg:text-lg leading-relaxed ${subColor}`}
        >
          {sub}
        </motion.p>
      )}
    </div>
  );
}

/* ---------- Globalize ---------- */
Object.assign(window, {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  animate,
  ease,
  fadeUp,
  staggerContainer,
  childFade,
  Icon,
  Counter,
  SectionHead,
});
