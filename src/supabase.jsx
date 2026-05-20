/* Supabase client + data layer.
 * - Создаёт singleton supabase клиент
 * - loadAllContent() тянет все 3 контентные таблицы и кладёт в window.*_DATA
 * - При ошибке сети — сайт продолжает работать на seed-данных (см. src/data/*.jsx)
 */

const SB = window.supabase.createClient(
  CONFIG.SUPABASE_URL,
  CONFIG.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "mtc-auth",
    },
    global: {
      headers: { "X-Client-Info": "mtc-web" },
    },
  }
);

window.SB = SB;

/* ---------- Database → frontend shape mapping ---------- */

// Преобразует строку из БД в формат, ожидаемый существующими компонентами.
// Сохраняет все _ru/_uz/_en поля для i18n.pick() при рендере.
function mapProject(row, floorPlans, constructionLog) {
  return {
    id: row.id,
    slug: row.slug,
    sortOrder: row.sort_order,
    status: row.status,
    statusClass: row.status_class,
    priceFromNum: row.price_from_num,
    coordinates: row.lat && row.lng ? { lat: Number(row.lat), lng: Number(row.lng) } : null,
    mainImage: row.main_image,
    gallery: row.gallery || [],

    // Имена с суффиксом (для прямого pick'а через i18n.pick)
    name_ru: row.name_ru,           name_uz: row.name_uz,           name_en: row.name_en,
    fullName_ru: row.full_name_ru,  fullName_uz: row.full_name_uz,  fullName_en: row.full_name_en,
    tier_ru: row.tier_ru,           tier_uz: row.tier_uz,           tier_en: row.tier_en,
    statusLabel_ru: row.status_label_ru, statusLabel_uz: row.status_label_uz, statusLabel_en: row.status_label_en,
    location_ru: row.location_ru,   location_uz: row.location_uz,   location_en: row.location_en,
    district_ru: row.district_ru,   district_uz: row.district_uz,   district_en: row.district_en,
    delivery_ru: row.delivery_ru,   delivery_uz: row.delivery_uz,   delivery_en: row.delivery_en,
    floors_ru: row.floors_ru,       floors_uz: row.floors_uz,       floors_en: row.floors_en,
    apartmentsFrom_ru: row.apartments_from_ru, apartmentsFrom_uz: row.apartments_from_uz, apartmentsFrom_en: row.apartments_from_en,
    priceFrom_ru: row.price_from_ru, priceFrom_uz: row.price_from_uz, priceFrom_en: row.price_from_en,
    pricePerMeter_ru: row.price_per_meter_ru, pricePerMeter_uz: row.price_per_meter_uz, pricePerMeter_en: row.price_per_meter_en,
    description_ru: row.description_ru, description_uz: row.description_uz, description_en: row.description_en,

    features_ru: row.features_ru || [],         features_uz: row.features_uz || [],         features_en: row.features_en || [],
    infrastructure_ru: row.infrastructure_ru || [], infrastructure_uz: row.infrastructure_uz || [], infrastructure_en: row.infrastructure_en || [],

    floorPlans: (floorPlans || [])
      .filter((p) => p.project_id === row.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((p) => ({
        id: p.id, image: p.image,
        rooms_ru: p.rooms_ru, rooms_uz: p.rooms_uz, rooms_en: p.rooms_en,
        area_ru:  p.area_ru,  area_uz:  p.area_uz,  area_en:  p.area_en,
        price_ru: p.price_ru, price_uz: p.price_uz, price_en: p.price_en,
      })),

    constructionProgress: (constructionLog || [])
      .filter((c) => c.project_id === row.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((c) => ({
        id: c.id, image: c.image,
        month_ru: c.month_ru,   month_uz: c.month_uz,   month_en: c.month_en,
        status_ru: c.status_ru, status_uz: c.status_uz, status_en: c.status_en,
      })),
  };
}

function mapGovCase(row, specs) {
  return {
    id: row.id, slug: row.slug, sortOrder: row.sort_order,
    image: row.image, gallery: row.gallery || [],

    name_ru: row.name_ru, name_uz: row.name_uz, name_en: row.name_en,
    fullName_ru: row.full_name_ru, fullName_uz: row.full_name_uz, fullName_en: row.full_name_en,
    customer_ru: row.customer_ru, customer_uz: row.customer_uz, customer_en: row.customer_en,
    year_ru: row.year_ru, year_uz: row.year_uz, year_en: row.year_en,
    budget_ru: row.budget_ru, budget_uz: row.budget_uz, budget_en: row.budget_en,
    area_ru: row.area_ru, area_uz: row.area_uz, area_en: row.area_en,
    capacity_ru: row.capacity_ru, capacity_uz: row.capacity_uz, capacity_en: row.capacity_en,
    deadline_ru: row.deadline_ru, deadline_uz: row.deadline_uz, deadline_en: row.deadline_en,
    description_ru: row.description_ru, description_uz: row.description_uz, description_en: row.description_en,

    specs: (specs || [])
      .filter((s) => s.gov_case_id === row.id)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((s) => ({
        id: s.id,
        label_ru: s.label_ru, label_uz: s.label_uz, label_en: s.label_en,
        value_ru: s.value_ru, value_uz: s.value_uz, value_en: s.value_en,
      })),
  };
}

function mapNews(row) {
  return {
    id: row.id, slug: row.slug,
    isoDate: row.iso_date, image: row.image,

    dateLabel_ru: row.date_label_ru, dateLabel_uz: row.date_label_uz, dateLabel_en: row.date_label_en,
    category_ru: row.category_ru,    category_uz: row.category_uz,    category_en: row.category_en,
    title_ru: row.title_ru,          title_uz: row.title_uz,          title_en: row.title_en,
    excerpt_ru: row.excerpt_ru,      excerpt_uz: row.excerpt_uz,      excerpt_en: row.excerpt_en,
    body_ru: row.body_ru || [],      body_uz: row.body_uz || [],      body_en: row.body_en || [],
  };
}

/* ---------- Loader ---------- */

async function loadAllContent() {
  const result = { projects: null, govCases: null, news: null, error: null };

  try {
    const [proj, fp, cl, gov, gs, news] = await Promise.all([
      SB.from("projects").select("*").order("sort_order"),
      SB.from("project_floor_plans").select("*"),
      SB.from("project_construction_log").select("*"),
      SB.from("gov_cases").select("*").order("sort_order"),
      SB.from("gov_specs").select("*"),
      SB.from("news").select("*").order("iso_date", { ascending: false }),
    ]);

    for (const r of [proj, fp, cl, gov, gs, news]) {
      if (r.error) throw r.error;
    }

    result.projects = proj.data.map((row) => mapProject(row, fp.data, cl.data));
    result.govCases = gov.data.map((row) => mapGovCase(row, gs.data));
    result.news     = news.data.map(mapNews);
  } catch (e) {
    console.warn("[supabase] Falling back to seed data:", e.message || e);
    result.error = e;
  }

  return result;
}

/* ---------- Image upload helper (используется в админке) ---------- */

async function detectMime(file) {
  // Чтение первых 12 байт и проверка magic bytes — нельзя доверять file.type
  const buf = await file.slice(0, 12).arrayBuffer();
  const b = new Uint8Array(buf);
  // JPEG: FF D8 FF
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  // WEBP: RIFF....WEBP
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
      b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return "image/webp";
  return null;
}

async function uploadImage(file) {
  if (!file) throw new Error("Файл не выбран");
  if (file.size > CONFIG.MAX_UPLOAD_BYTES) {
    throw new Error(`Файл слишком большой (макс. ${CONFIG.MAX_UPLOAD_BYTES / 1024 / 1024} МБ)`);
  }
  const realMime = await detectMime(file);
  if (!realMime || !CONFIG.ALLOWED_MIME.includes(realMime)) {
    throw new Error("Неподдерживаемый формат. Разрешены: JPEG, PNG, WebP");
  }

  // UUID имя — никакого пользовательского ввода в пути
  const ext = realMime === "image/jpeg" ? "jpg" : realMime === "image/png" ? "png" : "webp";
  const uuid = crypto.randomUUID();
  const path = `${new Date().getFullYear()}/${uuid}.${ext}`;

  const { error } = await SB.storage.from(CONFIG.STORAGE_BUCKET).upload(path, file, {
    contentType: realMime,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;

  const { data } = SB.storage.from(CONFIG.STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function deleteImageByUrl(url) {
  if (!url) return;
  // Из публичного URL вытаскиваем путь после bucket name
  const marker = `/${CONFIG.STORAGE_BUCKET}/`;
  const i = url.indexOf(marker);
  if (i === -1) return; // не наш файл — игнорируем
  const path = url.slice(i + marker.length);
  await SB.storage.from(CONFIG.STORAGE_BUCKET).remove([path]);
}

Object.assign(window, { loadAllContent, uploadImage, deleteImageByUrl, mapProject, mapGovCase, mapNews });
