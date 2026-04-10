import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const BACKEND_URL = "http://localhost:8080";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Invalid credentials."); return; }
      await login(data.token);
      navigate("/dashboard");
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = `${BACKEND_URL}/oauth2/authorization/google`;
  };

  return (
    <div style={s.root}>
      {/* Background */}
      <div style={s.bg} />
      <div style={s.grid} />

      {/* Back to Home */}
      <button style={s.backBtn} onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      {/* Card */}
      <div style={s.card}>
        {/* Logo */}
        <div style={s.logoWrap}>
          <div style={s.logoIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" width="22" height="22">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span style={s.logoText}>Smart Campus Hub</span>
        </div>

        <h1 style={s.title}>Welcome back</h1>
        <p style={s.sub}>Sign in to your account to continue</p>

        {/* Google Button */}
        <button style={s.googleBtn} onClick={handleGoogle}>
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={s.divider}>
          <div style={s.dividerLine} />
          <span style={s.dividerText}>or sign in with email</span>
          <div style={s.dividerLine} />
        </div>

        {/* Error */}
        {error && <div style={s.errorBox}>{error}</div>}

        {/* Form */}
        <form onSubmit={handleLogin} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Email address</label>
            <div style={s.inputWrap}>
              <svg style={s.inputIcon} viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" width="18" height="18">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                style={s.input}
                type="email"
                placeholder="you@campus.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>Password</label>
            <div style={s.inputWrap}>
              <svg style={s.inputIcon} viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" width="18" height="18">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                style={s.input}
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button type="button" style={s.eyeBtn} onClick={() => setShowPass(!showPass)}>
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" style={s.submitBtn} disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p style={s.switchText}>
          Don't have an account?{" "}
          <span style={s.switchLink} onClick={() => navigate("/signup")}>
            Create one here
          </span>
        </p>
      </div>
    </div>
  );
}

const s = {
  root: {
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", position: "relative",
    background: "#F0F4FF", fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    padding: "24px",
  },
  bg: {
    position: "fixed", inset: 0,
    background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  grid: {
    position: "fixed", inset: 0,
    backgroundImage: "linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px)",
    backgroundSize: "48px 48px", pointerEvents: "none",
  },
  backBtn: {
    position: "fixed", top: "24px", left: "24px",
    background: "#fff", border: "1.5px solid #E2E8F0",
    borderRadius: "10px", padding: "8px 16px",
    fontSize: "14px", fontWeight: "600", color: "#475569",
    cursor: "pointer", zIndex: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  card: {
    position: "relative", zIndex: 1,
    background: "#fff", borderRadius: "24px",
    border: "1px solid #E2E8F0",
    boxShadow: "0 8px 48px rgba(0,0,0,0.08)",
    padding: "48px 44px",
    width: "100%", maxWidth: "460px",
  },
  logoWrap: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px", justifyContent: "center" },
  logoIcon: {
    width: "40px", height: "40px", borderRadius: "12px",
    background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 2px 8px rgba(59,130,246,0.4)",
  },
  logoText: { fontSize: "17px", fontWeight: "800", color: "#0F172A", letterSpacing: "-0.3px" },
  title: { fontSize: "26px", fontWeight: "800", color: "#0F172A", margin: "0 0 8px", textAlign: "center", letterSpacing: "-0.5px" },
  sub: { fontSize: "15px", color: "#64748B", textAlign: "center", margin: "0 0 28px" },
  googleBtn: {
    width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
    gap: "10px", padding: "13px 20px", borderRadius: "12px",
    border: "1.5px solid #E2E8F0", background: "#fff",
    fontSize: "15px", fontWeight: "600", color: "#334155",
    cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    transition: "all 0.2s",
  },
  divider: { display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" },
  dividerLine: { flex: 1, height: "1px", background: "#E2E8F0" },
  dividerText: { fontSize: "13px", color: "#94A3B8", fontWeight: "500", whiteSpace: "nowrap" },
  errorBox: {
    background: "#FEF2F2", border: "1px solid #FECACA",
    borderRadius: "10px", padding: "12px 16px",
    fontSize: "14px", color: "#DC2626", marginBottom: "16px",
  },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  field: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "14px", fontWeight: "600", color: "#374151" },
  inputWrap: {
    display: "flex", alignItems: "center",
    border: "1.5px solid #E2E8F0", borderRadius: "12px",
    background: "#F8FAFC", overflow: "hidden",
    transition: "border-color 0.2s",
  },
  inputIcon: { marginLeft: "14px", flexShrink: 0 },
  input: {
    flex: 1, padding: "13px 14px", border: "none",
    background: "transparent", fontSize: "15px", color: "#0F172A",
    outline: "none",
  },
  eyeBtn: {
    background: "none", border: "none", cursor: "pointer",
    fontSize: "12px", fontWeight: "600", color: "#3B82F6",
    paddingRight: "14px",
  },
  submitBtn: {
    width: "100%", padding: "14px",
    background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
    border: "none", borderRadius: "12px",
    fontSize: "16px", fontWeight: "700", color: "#fff",
    cursor: "pointer", boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
    marginTop: "4px",
  },
  switchText: { textAlign: "center", fontSize: "14px", color: "#64748B", margin: "20px 0 0" },
  switchLink: { color: "#1D4ED8", fontWeight: "600", cursor: "pointer" },
};