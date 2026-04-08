import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NAV_LINKS = ["Home", "Features", "How It Works", "Contact"];

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: "Facility Booking",
    desc: "Reserve lecture halls, labs, meeting rooms and equipment with real-time availability checks and conflict prevention.",
    accent: "#3B82F6",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: "Maintenance Ticketing",
    desc: "Log fault reports with image evidence, track technician assignments and get real-time resolution updates.",
    accent: "#10B981",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    title: "Smart Notifications",
    desc: "Instant alerts for booking approvals, ticket status changes and comments — never miss an update.",
    accent: "#F59E0B",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Role-Based Access",
    desc: "Granular permissions for Users, Admins and Technicians. OAuth2 Google sign-in with JWT security.",
    accent: "#8B5CF6",
  },
];

const MODULES = [
  { title: "Facilities & Assets Catalogue", desc: "Manage bookable resources with metadata, availability windows and status tracking." },
  { title: "Booking Management", desc: "Full PENDING → APPROVED/REJECTED workflow with conflict detection." },
  { title: "Maintenance & Incident Ticketing", desc: "Ticket lifecycle from OPEN to CLOSED with technician assignments and image attachments." },
  { title: "Notifications System", desc: "In-app notification panel for all booking and ticket events in real time." },
  { title: "Authentication & Authorization", desc: "Google OAuth2 login, JWT tokens, and role-based endpoint protection." },
];

const STEPS = [
  { n: "01", title: "Sign Up", desc: "Sign up in seconds and access your personalized dashboard." },
  { n: "02", title: "Book a Resource", desc: "Find and reserve rooms, labs or equipment instantly." },
  { n: "03", title: "Report an Issue", desc: "Log maintenance tickets with photos and priority levels." },
  { n: "04", title: "Track Everything", desc: "Monitor bookings and ticket progress in real time." },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeModule, setActiveModule] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div style={styles.root}>
      {/* ── Navbar ── */}
      <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
        <div style={styles.navInner}>
          <div style={styles.logo} onClick={() => scrollTo("home")}>
            <div style={styles.logoIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" width="20" height="20">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span style={styles.logoText}>CampusOps</span>
          </div>

          <div style={styles.navLinks}>
            {["home", "features", "how-it-works", "contact"].map((id, i) => (
              <button key={id} style={styles.navLink} onClick={() => scrollTo(id)}>
                {NAV_LINKS[i]}
              </button>
            ))}
          </div>

          <div style={styles.navActions}>
            <button style={styles.btnOutline} onClick={() => navigate("/login")}>Log In</button>
            <button style={styles.btnPrimary} onClick={() => navigate("/signup")}>Sign Up</button>
          </div>

          <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
            <span style={{ ...styles.bar, ...(menuOpen ? styles.bar1Open : {}) }} />
            <span style={{ ...styles.bar, ...(menuOpen ? styles.barHide : {}) }} />
            <span style={{ ...styles.bar, ...(menuOpen ? styles.bar3Open : {}) }} />
          </button>
        </div>

        {menuOpen && (
          <div style={styles.mobileMenu}>
            {["home", "features", "how-it-works", "contact"].map((id, i) => (
              <button key={id} style={styles.mobileLink} onClick={() => scrollTo(id)}>{NAV_LINKS[i]}</button>
            ))}
            <div style={styles.mobileActions}>
              <button style={styles.btnOutline} onClick={() => navigate("/login")}>Log In</button>
              <button style={styles.btnPrimary} onClick={() => navigate("/signup")}>Sign Up</button>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section id="home" style={styles.hero}>
        <div style={styles.heroBg} />
        <div style={styles.heroGrid} />
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Smart Campus<br />
            <span style={styles.heroAccent}>Operations Hub</span>
          </h1>
          <p style={styles.heroSub}>
            A unified platform to manage facility bookings, maintenance incidents,
            and campus operations — built for the modern university.
          </p>
          <div style={styles.heroCtas}>
            <button style={styles.btnHeroPrimary} onClick={() => navigate("/signup")}>
              Get Started →
            </button>
            <button style={styles.btnHeroOutline} onClick={() => navigate("/login")}>
              Log In
            </button>
          </div>
          <div style={styles.heroStats}>
            {[["99.9%", "Uptime"], ["500+", "Bookings Managed"], ["Real-time", "Updates"]].map(([n, l]) => (
              <div key={l} style={styles.stat}>
                <span style={styles.statNum}>{n}</span>
                <span style={styles.statLabel}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={styles.section}>
        <div style={styles.container}>
          <div style={styles.sectionHead}>
            <span style={styles.sectionTag}>Features</span>
            <h2 style={styles.sectionTitle}>Everything in One Platform</h2>
            <p style={styles.sectionSub}>Manage your entire campus infrastructure from a single, intuitive dashboard.</p>
          </div>
          <div style={styles.featGrid}>
            {FEATURES.map((f) => (
              <div key={f.title} style={styles.featCard}>
                <div style={{ ...styles.featIcon, background: f.accent + "20", color: f.accent }}>
                  {f.icon}
                </div>
                <h3 style={styles.featTitle}>{f.title}</h3>
                <p style={styles.featDesc}>{f.desc}</p>
                <div style={{ ...styles.featLine, background: f.accent }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modules ── */}
      <section id="modules" style={styles.moduleSection}>
        <div style={styles.moduleBg} />
        <div style={styles.container}>
          <div style={{ ...styles.sectionHead, color: "#fff" }}>
            <span style={{ ...styles.sectionTag, background: "rgba(255,255,255,0.15)", color: "#fff" }}>Modules</span>
            <h2 style={{ ...styles.sectionTitle, color: "#fff" }}>Platform Capabilities</h2>
            <p style={{ ...styles.sectionSub, color: "rgba(255,255,255,0.65)" }}>
              Comprehensive tools that work seamlessly to streamline your campus operations.
            </p>
          </div>
          <div style={styles.moduleLayout}>
            <div style={styles.moduleList}>
              {MODULES.map((m, i) => (
                <button
                  key={m.title}
                  style={{ ...styles.moduleItem, ...(activeModule === i ? styles.moduleItemActive : {}) }}
                  onClick={() => setActiveModule(i)}
                >
                  <span style={styles.moduleTitle}>{m.title}</span>
                  <span style={styles.moduleChevron}>{activeModule === i ? "▾" : "›"}</span>
                </button>
              ))}
            </div>
            <div style={styles.moduleDetail}>
              <div style={styles.moduleDetailInner}>
                <h3 style={styles.moduleDetailTitle}>{MODULES[activeModule].title}</h3>
                <p style={styles.moduleDetailDesc}>{MODULES[activeModule].desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" style={styles.section}>
        <div style={styles.container}>
          <div style={styles.sectionHead}>
            <span style={styles.sectionTag}>Workflow</span>
            <h2 style={styles.sectionTitle}>How It Works</h2>
            <p style={styles.sectionSub}>A simple, intuitive workflow for all users.</p>
          </div>
          <div style={styles.stepsGrid}>
            {STEPS.map((s, i) => (
              <div key={s.n} style={styles.stepCard}>
                <div style={styles.stepNum}>{s.n}</div>
                {i < STEPS.length - 1 && <div style={styles.stepLine} />}
                <h3 style={styles.stepTitle}>{s.title}</h3>
                <p style={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" style={styles.section}>
        <div style={styles.container}>
          <div style={styles.sectionHead}>
            <span style={styles.sectionTag}>Contact</span>
            <h2 style={styles.sectionTitle}>Get in Touch</h2>
            <p style={styles.sectionSub}>Have questions? We're here to help.</p>
          </div>
          <div style={styles.contactBox}>
            <div style={styles.contactItem}>
              <span style={styles.contactLabel}>Email</span>
              <a href="mailto:support@campusops.com" style={styles.contactLink}>support@campusops.com</a>
            </div>
            <div style={styles.contactItem}>
              <span style={styles.contactLabel}>Phone</span>
              <a href="tel:+1234567890" style={styles.contactLink}>+1 (234) 567-890</a>
            </div>
            <div style={styles.contactItem}>
              <span style={styles.contactLabel}>Hours</span>
              <p style={styles.contactText}>Monday - Friday: 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to get started?</h2>
          <p style={styles.ctaSub}>Sign up with your Google account and access your campus dashboard instantly.</p>
          <div style={styles.ctaBtns}>
            <button style={styles.btnCtaPrimary} onClick={() => navigate("/signup")}>Create an Account</button>
            <button style={styles.btnCtaOutline} onClick={() => navigate("/login")}>Log In</button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerBrand}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" width="20" height="20">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span style={styles.logoText}>CampusOps</span>
            </div>
            <p style={styles.footerDesc}>Smart Campus Operations Hub — Trusted by universities worldwide for efficient facility and maintenance management.</p>
          </div>
          <div style={styles.footerLinks}>
            <div style={styles.footerCol}>
              <span style={styles.footerColTitle}>Platform</span>
              {["Features", "Modules", "How It Works"].map(l => (
                <span key={l} style={styles.footerLink}>{l}</span>
              ))}
            </div>
            <div style={styles.footerCol}>
              <span style={styles.footerColTitle}>Access</span>
              <span style={styles.footerLink} onClick={() => navigate("/login")}>Log In</span>
              <span style={styles.footerLink} onClick={() => navigate("/signup")}>Sign Up</span>
            </div>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <span style={styles.footerCopy}>© 2026 Smart Campus Operations Hub · All Rights Reserved</span>
        </div>
      </footer>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  root: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: "#F8FAFC",
    color: "#0F172A",
    overflowX: "hidden",
  },

  // Navbar
  nav: {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    transition: "all 0.3s ease",
    padding: "0 24px",
  },
  navScrolled: {
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 1px 0 rgba(0,0,0,0.08)",
  },
  navInner: {
    maxWidth: "1200px", margin: "0 auto",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    height: "68px",
  },
  logo: { display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" },
  logoIcon: {
    width: "36px", height: "36px", borderRadius: "10px",
    background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 2px 8px rgba(59,130,246,0.4)",
  },
  logoText: { fontWeight: "800", fontSize: "18px", letterSpacing: "-0.5px", color: "#0F172A" },
  navLinks: { display: "flex", gap: "4px" },
  navLink: {
    background: "none", border: "none", cursor: "pointer",
    padding: "8px 16px", borderRadius: "8px",
    fontSize: "14px", fontWeight: "500", color: "#475569",
    transition: "all 0.2s",
  },
  navActions: { display: "flex", gap: "10px", alignItems: "center" },
  btnOutline: {
    padding: "9px 20px", borderRadius: "10px",
    border: "1.5px solid #CBD5E1", background: "transparent",
    fontSize: "14px", fontWeight: "600", color: "#334155",
    cursor: "pointer", transition: "all 0.2s",
  },
  btnPrimary: {
    padding: "9px 20px", borderRadius: "10px",
    border: "none", background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
    fontSize: "14px", fontWeight: "600", color: "#fff",
    cursor: "pointer", boxShadow: "0 2px 8px rgba(59,130,246,0.35)",
    transition: "all 0.2s",
  },
  hamburger: {
    display: "none", flexDirection: "column", gap: "5px",
    background: "none", border: "none", cursor: "pointer", padding: "4px",
  },
  bar: {
    display: "block", width: "22px", height: "2px",
    background: "#334155", borderRadius: "2px",
    transition: "all 0.3s",
  },
  bar1Open: { transform: "rotate(45deg) translate(5px, 5px)" },
  barHide: { opacity: 0 },
  bar3Open: { transform: "rotate(-45deg) translate(5px, -5px)" },
  mobileMenu: {
    background: "rgba(255,255,255,0.98)", padding: "16px 24px 24px",
    borderTop: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "4px",
  },
  mobileLink: {
    background: "none", border: "none", cursor: "pointer",
    padding: "12px 8px", fontSize: "16px", fontWeight: "500",
    color: "#334155", textAlign: "left",
  },
  mobileActions: { display: "flex", gap: "10px", marginTop: "12px" },

  // Hero
  hero: {
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", position: "relative", overflow: "hidden",
    background: "#F0F4FF",
    paddingTop: "68px",
  },
  heroBg: {
    position: "absolute", inset: 0,
    background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  heroGrid: {
    position: "absolute", inset: 0,
    backgroundImage: "linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px)",
    backgroundSize: "48px 48px",
    pointerEvents: "none",
  },
  heroContent: {
    position: "relative", zIndex: 1,
    maxWidth: "800px", margin: "0 auto", padding: "80px 24px",
    textAlign: "center",
  },
  badge: {
    display: "inline-block",
    background: "rgba(59,130,246,0.1)", color: "#1D4ED8",
    border: "1px solid rgba(59,130,246,0.2)",
    borderRadius: "100px", padding: "6px 16px",
    fontSize: "13px", fontWeight: "600", letterSpacing: "0.02em",
    marginBottom: "28px",
  },
  heroTitle: {
    fontSize: "clamp(44px, 7vw, 80px)",
    fontWeight: "900", lineHeight: "1.05",
    letterSpacing: "-2px", color: "#0F172A",
    margin: "0 0 24px",
  },
  heroAccent: {
    background: "linear-gradient(135deg, #1D4ED8, #60A5FA)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  heroSub: {
    fontSize: "18px", color: "#475569", lineHeight: "1.7",
    maxWidth: "560px", margin: "0 auto 40px",
  },
  heroCtas: { display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginBottom: "56px" },
  btnHeroPrimary: {
    padding: "16px 36px", borderRadius: "14px",
    border: "none", background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
    fontSize: "16px", fontWeight: "700", color: "#fff",
    cursor: "pointer", boxShadow: "0 4px 20px rgba(59,130,246,0.4)",
    transition: "all 0.2s",
  },
  btnHeroOutline: {
    padding: "16px 36px", borderRadius: "14px",
    border: "2px solid #CBD5E1", background: "#fff",
    fontSize: "16px", fontWeight: "700", color: "#334155",
    cursor: "pointer", transition: "all 0.2s",
  },
  heroStats: { display: "flex", gap: "40px", justifyContent: "center", flexWrap: "wrap" },
  stat: { display: "flex", flexDirection: "column", alignItems: "center" },
  statNum: { fontSize: "32px", fontWeight: "900", color: "#1D4ED8", letterSpacing: "-1px" },
  statLabel: { fontSize: "13px", color: "#64748B", fontWeight: "500", marginTop: "2px" },

  // Sections
  section: { padding: "100px 24px" },
  container: { maxWidth: "1200px", margin: "0 auto" },
  sectionHead: { textAlign: "center", marginBottom: "64px" },
  sectionTag: {
    display: "inline-block",
    background: "rgba(59,130,246,0.1)", color: "#1D4ED8",
    border: "1px solid rgba(59,130,246,0.2)",
    borderRadius: "100px", padding: "5px 14px",
    fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em",
    textTransform: "uppercase", marginBottom: "16px",
  },
  sectionTitle: {
    fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "800",
    letterSpacing: "-1px", margin: "0 0 16px", color: "#0F172A",
  },
  sectionSub: { fontSize: "17px", color: "#64748B", lineHeight: "1.7", maxWidth: "560px", margin: "0 auto" },

  // Features
  featGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
  },
  featCard: {
    background: "#fff", borderRadius: "20px",
    padding: "32px 28px",
    border: "1px solid #E2E8F0",
    boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
    position: "relative", overflow: "hidden",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  featIcon: {
    width: "56px", height: "56px", borderRadius: "14px",
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: "20px",
  },
  featTitle: { fontSize: "18px", fontWeight: "700", margin: "0 0 10px", color: "#0F172A" },
  featDesc: { fontSize: "14px", color: "#64748B", lineHeight: "1.7", margin: 0 },
  featLine: { position: "absolute", bottom: 0, left: 0, right: 0, height: "3px" },

  // Modules
  moduleSection: {
    padding: "100px 24px", position: "relative", overflow: "hidden",
    background: "#0F172A",
  },
  moduleBg: {
    position: "absolute", inset: 0,
    background: "radial-gradient(ellipse 60% 50% at 80% 50%, rgba(59,130,246,0.15) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  moduleLayout: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "start" },
  moduleList: { display: "flex", flexDirection: "column", gap: "8px" },
  moduleItem: {
    display: "flex", alignItems: "center", gap: "16px",
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px", padding: "16px 20px",
    cursor: "pointer", transition: "all 0.2s", textAlign: "left",
    color: "rgba(255,255,255,0.7)", width: "100%",
  },
  moduleItemActive: {
    background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.4)",
    color: "#fff",
  },
  moduleTitle: { flex: 1, fontSize: "15px", fontWeight: "600" },
  moduleChevron: { fontSize: "18px", color: "rgba(255,255,255,0.4)" },
  moduleDetail: {
    position: "sticky", top: "100px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px", padding: "48px 40px",
    minHeight: "280px", display: "flex", alignItems: "center",
  },
  moduleDetailInner: {},
  moduleDetailTitle: { fontSize: "24px", fontWeight: "800", color: "#fff", margin: "0 0 16px" },
  moduleDetailDesc: { fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: "1.7", margin: 0 },

  // Steps
  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "32px", position: "relative",
  },
  stepCard: {
    background: "#fff", borderRadius: "20px",
    padding: "36px 28px", border: "1px solid #E2E8F0",
    boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
    position: "relative",
  },
  stepNum: {
    fontSize: "48px", fontWeight: "900", color: "#EFF6FF",
    letterSpacing: "-2px", lineHeight: 1, marginBottom: "20px",
  },
  stepLine: {
    display: "none",
  },
  stepTitle: { fontSize: "18px", fontWeight: "700", margin: "0 0 10px", color: "#0F172A" },
  stepDesc: { fontSize: "14px", color: "#64748B", lineHeight: "1.7", margin: 0 },

  // About
  aboutSection: {
    padding: "100px 24px",
    background: "linear-gradient(180deg, #F0F4FF 0%, #F8FAFC 100%)",
  },
  aboutGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: "64px", alignItems: "center",
  },
  aboutLeft: {},
  aboutRight: {},
  stackBadges: { display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "28px" },
  stackBadge: {
    padding: "6px 14px", borderRadius: "8px",
    background: "#fff", border: "1px solid #E2E8F0",
    fontSize: "13px", fontWeight: "600", color: "#334155",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  infoCard: {
    background: "#fff", borderRadius: "20px",
    border: "1px solid #E2E8F0",
    boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
    overflow: "hidden",
  },
  infoRow: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "20px 28px",
  },
  infoLabel: { fontSize: "14px", color: "#64748B", fontWeight: "500" },
  infoVal: { fontSize: "15px", fontWeight: "700", color: "#0F172A" },
  infoDivider: { height: "1px", background: "#F1F5F9", margin: "0 28px" },

  // Contact
  contactBox: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
    gap: "32px", 
    maxWidth: "800px", 
    margin: "60px auto 0" 
  },
  contactItem: { textAlign: "center" },
  contactLabel: { fontSize: "14px", fontWeight: "600", color: "#475569", display: "block", marginBottom: "8px" },
  contactLink: { fontSize: "16px", fontWeight: "600", color: "#1D4ED8", textDecoration: "none", transition: "color 0.2s" },
  contactText: { fontSize: "16px", color: "#475569", margin: "0" },

  // CTA
  ctaSection: {
    padding: "100px 24px",
    background: "linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 50%, #2563EB 100%)",
    textAlign: "center",
  },
  ctaContent: { maxWidth: "600px", margin: "0 auto" },
  ctaTitle: { fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "900", color: "#fff", margin: "0 0 16px", letterSpacing: "-1px" },
  ctaSub: { fontSize: "17px", color: "rgba(255,255,255,0.75)", lineHeight: "1.7", margin: "0 0 40px" },
  ctaBtns: { display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" },
  btnCtaPrimary: {
    padding: "16px 36px", borderRadius: "14px",
    border: "none", background: "#fff",
    fontSize: "16px", fontWeight: "700", color: "#1D4ED8",
    cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  },
  btnCtaOutline: {
    padding: "16px 36px", borderRadius: "14px",
    border: "2px solid rgba(255,255,255,0.4)", background: "transparent",
    fontSize: "16px", fontWeight: "700", color: "#fff",
    cursor: "pointer",
  },

  // Footer
  footer: { background: "#0B1221", padding: "64px 24px 0" },
  footerInner: {
    maxWidth: "1200px", margin: "0 auto",
    display: "flex", gap: "64px", flexWrap: "wrap",
    paddingBottom: "48px", borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  footerBrand: { flex: 2, minWidth: "240px" },
  footerDesc: { fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: "1.7", marginTop: "16px", maxWidth: "320px" },
  footerLinks: { display: "flex", gap: "64px", flex: 1 },
  footerCol: { display: "flex", flexDirection: "column", gap: "12px" },
  footerColTitle: { fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" },
  footerLink: { fontSize: "14px", color: "rgba(255,255,255,0.55)", cursor: "pointer", transition: "color 0.2s" },
  footerBottom: {
    maxWidth: "1200px", margin: "0 auto",
    padding: "20px 0", textAlign: "center",
  },
  footerCopy: { fontSize: "13px", color: "rgba(255,255,255,0.25)" },
};