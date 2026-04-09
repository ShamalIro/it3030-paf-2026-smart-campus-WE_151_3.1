import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ticketService from "../../services/ticketService";

export default function TechnicianDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Resolve modal
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getAssignedTickets();
      setTickets(data);
    } catch (err) {
      setError("Failed to load assigned tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      const updated = await ticketService.updateStatus(ticketId, newStatus);
      setTickets(tickets.map(t => t.id === updated.id ? updated : t));
      showMsg(`Status updated to ${newStatus.replace("_", " ")}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleResolve = async () => {
    if (!resolutionNotes.trim()) { setError("Resolution notes are required"); return; }
    try {
      const updated = await ticketService.resolveTicket(selectedTicket.id, resolutionNotes);
      setTickets(tickets.map(t => t.id === updated.id ? updated : t));
      setShowResolveModal(false);
      setResolutionNotes("");
      showMsg("Ticket resolved successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resolve ticket");
    }
  };

  const showMsg = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(""), 3000); };

  const filtered = filter === "ALL" ? tickets : tickets.filter(t => t.status === filter);

  const statusBadge = (status) => {
    const map = {
      OPEN: { bg: "#DBEAFE", color: "#1D4ED8" },
      IN_PROGRESS: { bg: "#FEF3C7", color: "#D97706" },
      RESOLVED: { bg: "#D1FAE5", color: "#065F46" },
      CLOSED: { bg: "#F1F5F9", color: "#64748B" },
      REJECTED: { bg: "#FEE2E2", color: "#DC2626" },
    };
    const st = map[status] || map["OPEN"];
    return { background: st.bg, color: st.color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" };
  };

  const priorityBadge = (priority) => {
    const map = {
      HIGH: { bg: "#FEE2E2", color: "#DC2626" },
      MEDIUM: { bg: "#FEF3C7", color: "#D97706" },
      LOW: { bg: "#D1FAE5", color: "#065F46" },
    };
    const st = map[priority] || map["LOW"];
    return { background: st.bg, color: st.color, padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600" };
  };

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // Stats
  const stats = {
    total: tickets.length,
    inProgress: tickets.filter(t => t.status === "IN_PROGRESS").length,
    resolved: tickets.filter(t => t.status === "RESOLVED").length,
    closed: tickets.filter(t => t.status === "CLOSED").length,
  };

  const statuses = ["ALL", "IN_PROGRESS", "RESOLVED", "CLOSED"];

  // ─── Styles ────────────────────────────────────────────────────
  const s = {
    wrapper: { display: "flex", minHeight: "100vh", fontFamily: "DM Sans, Segoe UI, sans-serif", background: "#F0F4FF" },
    sidebar: { width: "240px", background: "#fff", borderRight: "1px solid #E2E8F0", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100 },
    logo: { display: "flex", alignItems: "center", gap: "10px", padding: "24px 20px", borderBottom: "1px solid #E2E8F0" },
    logoIcon: { width: "36px", height: "36px", background: "linear-gradient(135deg, #059669, #10B981)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700" },
    nav: { flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" },
    navItem: (active) => ({
      display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px",
      borderRadius: "10px", cursor: "pointer", fontSize: "14px",
      fontWeight: active ? "600" : "500", color: active ? "#059669" : "#64748B",
      background: active ? "#ECFDF5" : "transparent", border: "none",
      width: "100%", textAlign: "left",
    }),
    sidebarFooter: { padding: "16px", borderTop: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "10px" },
    avatar: { width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #059669, #10B981)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "13px" },
    main: { marginLeft: "240px", flex: 1 },
    navbar: { background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 },
    content: { padding: "32px" },
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "28px" },
    statCard: { background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px" },
    statIcon: (bg) => ({ width: "48px", height: "48px", borderRadius: "12px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }),
    filterBar: { display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" },
    filterBtn: (active) => ({
      padding: "6px 14px", borderRadius: "20px", border: active ? "none" : "1px solid #E2E8F0",
      background: active ? "#059669" : "#fff", color: active ? "#fff" : "#64748B",
      fontSize: "12px", fontWeight: "600", cursor: "pointer",
    }),
    // Ticket cards - using card layout for technician view
    ticketGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "20px" },
    ticketCard: { background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", overflow: "hidden", transition: "box-shadow 0.2s" },
    cardHeader: { padding: "16px 20px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" },
    cardBody: { padding: "16px 20px" },
    cardFooter: { padding: "12px 20px", borderTop: "1px solid #F1F5F9", display: "flex", gap: "8px", flexWrap: "wrap" },
    actionBtn: (bg, color) => ({
      background: bg, color, border: "none", borderRadius: "8px",
      padding: "8px 14px", fontSize: "12px", fontWeight: "600", cursor: "pointer",
      flex: 1, textAlign: "center",
    }),
    viewBtn: { background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE", borderRadius: "8px", padding: "8px 14px", fontSize: "12px", fontWeight: "600", cursor: "pointer", flex: 1, textAlign: "center" },
    empty: { padding: "60px", textAlign: "center", color: "#94A3B8", fontSize: "15px", background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0" },
    alert: (type) => ({
      padding: "12px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: "500", marginBottom: "20px",
      background: type === "success" ? "#D1FAE5" : "#FEE2E2",
      color: type === "success" ? "#065F46" : "#DC2626",
      border: `1px solid ${type === "success" ? "#6EE7B7" : "#FECACA"}`,
    }),
    overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 },
    modal: { background: "#fff", borderRadius: "20px", padding: "28px", width: "480px", maxWidth: "90vw" },
    modalTitle: { fontSize: "18px", fontWeight: "700", color: "#1E293B", marginBottom: "20px" },
    modalInput: { width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit", minHeight: "120px", resize: "vertical" },
    modalBtnRow: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" },
    modalCancel: { background: "#F1F5F9", color: "#64748B", border: "none", borderRadius: "10px", padding: "10px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
    modalConfirm: { background: "#059669", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
  };

  return (
    <div style={s.wrapper}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.logo}>
          <div style={s.logoIcon}>S</div>
          <span style={{ fontWeight: "700", fontSize: "16px", color: "#1E293B" }}>SCOH</span>
        </div>
        <nav style={s.nav}>
          <button style={s.navItem(false)} onClick={() => navigate("/dashboard")}>🏠 Dashboard</button>
          <button style={s.navItem(true)}>🔧 My Assignments</button>
          <button style={s.navItem(false)} onClick={() => navigate("/notifications")}>🔔 Notifications</button>
        </nav>
        <div style={s.sidebarFooter}>
          <div style={s.avatar}>{getInitials(user?.name)}</div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#1E293B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
            <div style={{ fontSize: "11px", color: "#94A3B8" }}>Technician</div>
          </div>
          <button onClick={logout} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "18px" }}>↪</button>
        </div>
      </aside>

      {/* Main */}
      <div style={s.main}>
        <header style={s.navbar}>
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B" }}>Technician Dashboard</span>
        </header>

        <div style={s.content}>
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1E293B", margin: 0 }}>
              My Assigned Tickets 🔧
            </h1>
            <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>
              View and manage your assigned incident tickets
            </p>
          </div>

          {success && <div style={s.alert("success")}>{success}</div>}
          {error && <div style={s.alert("error")}>{error}</div>}

          {/* Stats */}
          <div style={s.statsGrid}>
            <div style={s.statCard}>
              <div style={s.statIcon("#EFF6FF")}>🎫</div>
              <div>
                <div style={{ fontSize: "13px", color: "#64748B", fontWeight: "500" }}>Total Assigned</div>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "#1E293B" }}>{stats.total}</div>
              </div>
            </div>
            <div style={s.statCard}>
              <div style={s.statIcon("#FEF3C7")}>⏳</div>
              <div>
                <div style={{ fontSize: "13px", color: "#64748B", fontWeight: "500" }}>In Progress</div>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "#D97706" }}>{stats.inProgress}</div>
              </div>
            </div>
            <div style={s.statCard}>
              <div style={s.statIcon("#D1FAE5")}>✅</div>
              <div>
                <div style={{ fontSize: "13px", color: "#64748B", fontWeight: "500" }}>Resolved</div>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "#065F46" }}>{stats.resolved}</div>
              </div>
            </div>
            <div style={s.statCard}>
              <div style={s.statIcon("#F1F5F9")}>📦</div>
              <div>
                <div style={{ fontSize: "13px", color: "#64748B", fontWeight: "500" }}>Closed</div>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "#64748B" }}>{stats.closed}</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div style={s.filterBar}>
            {statuses.map(st => (
              <button key={st} style={s.filterBtn(filter === st)} onClick={() => setFilter(st)}>
                {st.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Ticket Cards */}
          {loading ? (
            <div style={s.empty}>Loading assignments...</div>
          ) : filtered.length === 0 ? (
            <div style={s.empty}>No tickets found</div>
          ) : (
            <div style={s.ticketGrid}>
              {filtered.map(t => (
                <div key={t.id} style={s.ticketCard}>
                  <div style={s.cardHeader}>
                    <div>
                      <span style={{ fontSize: "15px", fontWeight: "700", color: "#1D4ED8" }}>#{t.id}</span>
                      <span style={{ fontSize: "13px", color: "#64748B", marginLeft: "8px" }}>{t.category?.replace("_", " ")}</span>
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <span style={priorityBadge(t.priority)}>{t.priority}</span>
                      <span style={statusBadge(t.status)}>{t.status?.replace("_", " ")}</span>
                    </div>
                  </div>

                  <div style={s.cardBody}>
                    <div style={{ fontSize: "14px", color: "#1E293B", fontWeight: "600", marginBottom: "8px" }}>
                      📍 {t.location}
                    </div>
                    <div style={{ fontSize: "13px", color: "#475569", lineHeight: "1.5", marginBottom: "12px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {t.description}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#94A3B8" }}>
                      <span>By: {t.creator?.name}</span>
                      <span>{formatDate(t.createdAt)}</span>
                    </div>
                  </div>

                  <div style={s.cardFooter}>
                    <button style={s.viewBtn} onClick={() => navigate(`/tickets/${t.id}`)}>
                      View Details
                    </button>
                    {t.status === "IN_PROGRESS" && (
                      <button
                        style={s.actionBtn("#D1FAE5", "#065F46")}
                        onClick={() => { setSelectedTicket(t); setShowResolveModal(true); }}
                      >
                        ✅ Resolve
                      </button>
                    )}
                    {t.status === "RESOLVED" && (
                      <button
                        style={s.actionBtn("#F1F5F9", "#64748B")}
                        onClick={() => handleStatusUpdate(t.id, "CLOSED")}
                      >
                        📦 Close
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Resolve Modal */}
      {showResolveModal && (
        <div style={s.overlay} onClick={() => setShowResolveModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={s.modalTitle}>✅ Resolve Ticket #{selectedTicket?.id}</h2>
            <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "16px" }}>
              Describe what was done to resolve this incident
            </p>
            <textarea
              style={s.modalInput}
              value={resolutionNotes}
              onChange={e => setResolutionNotes(e.target.value)}
              placeholder="e.g., Replaced faulty circuit breaker in Room 201. Tested all outlets and confirmed working..."
            />
            <div style={s.modalBtnRow}>
              <button style={s.modalCancel} onClick={() => setShowResolveModal(false)}>Cancel</button>
              <button style={s.modalConfirm} onClick={handleResolve}>Mark as Resolved</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
