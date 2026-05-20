/* Public config. Anon key безопасно хранить в клиентском коде —
 * вся защита держится на RLS-политиках в Supabase.
 * НИКОГДА не вставлять сюда service_role ключ.
 */

const CONFIG = {
  SUPABASE_URL: "https://ddehpawakrgzuqrqjjuu.supabase.co",
  SUPABASE_ANON_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZWhwYXdha3JnenVxcnFqanV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMDU1MzUsImV4cCI6MjA5NDc4MTUzNX0.6NG4m1SyXLIR8dn8DwvDFfvikXCInknYexlUxPI4wgU",
  STORAGE_BUCKET: "content-images",
  MAX_UPLOAD_BYTES: 5 * 1024 * 1024, // 5 MB — должно совпадать с настройкой бакета
  ALLOWED_MIME: ["image/jpeg", "image/png", "image/webp"],
};

window.CONFIG = CONFIG;
