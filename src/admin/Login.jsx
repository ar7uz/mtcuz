/* Login страница админки. */

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaChallenge, setMfaChallenge] = useState(null); // {factorId, challengeId}

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null); setBusy(true);
    try {
      const { data, error } = await SB.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Если для пользователя включён MFA — нужен второй шаг
      const { data: factorsData } = await SB.auth.mfa.listFactors();
      const totp = factorsData?.totp?.find((f) => f.status === "verified");
      if (totp) {
        const { data: chal, error: chalErr } = await SB.auth.mfa.challenge({ factorId: totp.id });
        if (chalErr) throw chalErr;
        setMfaChallenge({ factorId: totp.id, challengeId: chal.id });
        setBusy(false);
        return;
      }

      onLogin();
    } catch (e) {
      setErr(e.message || "Ошибка входа");
      setBusy(false);
    }
  };

  const handleMfa = async (e) => {
    e.preventDefault();
    setErr(null); setBusy(true);
    try {
      const { error } = await SB.auth.mfa.verify({
        factorId: mfaChallenge.factorId,
        challengeId: mfaChallenge.challengeId,
        code: mfaCode,
      });
      if (error) throw error;
      onLogin();
    } catch (e) {
      setErr(e.message || "Неверный код");
      setBusy(false);
    }
  };

  return (
    <div className="admin-root min-h-screen flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl p-8 border border-[#E5DFD3]">
        <div className="text-center mb-6">
          <div className="font-serif text-2xl text-[#1A1612]">MTC</div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#8A847B] mt-1">
            Admin panel
          </div>
        </div>

        {!mfaChallenge ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                autoComplete="username"
              />
            </div>
            <div>
              <label>Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            {err && <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{err}</div>}
            <button type="submit" disabled={busy} className="admin-btn admin-btn-primary w-full justify-center">
              {busy ? "Вход…" : "Войти"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleMfa} className="space-y-4">
            <div className="text-sm text-[#5C5550]">
              Введите 6-значный код из приложения-аутентификатора:
            </div>
            <div>
              <label>Код подтверждения</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
                required
                autoFocus
                className="font-mono text-center !text-lg tracking-[0.4em]"
              />
            </div>
            {err && <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{err}</div>}
            <button type="submit" disabled={busy} className="admin-btn admin-btn-primary w-full justify-center">
              {busy ? "Проверка…" : "Подтвердить"}
            </button>
          </form>
        )}

        <div className="mt-6 text-[11px] text-[#8A847B] text-center">
          Защищено Supabase Auth · MFA · Rate Limiting
        </div>
      </div>
    </div>
  );
}

window.AdminLogin = AdminLogin;
