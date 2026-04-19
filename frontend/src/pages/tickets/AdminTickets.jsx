import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ticketService from "../../services/ticketService";

export default function AdminTickets() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedTechId, setSelectedTechId] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ticketsData, techsData] = await Promise.all([
        ticketService.getAllTickets(),
        ticketService.getTechnicians(),
      ]);
      setTickets(ticketsData);
      setTechnicians(techsData);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedTechId) { setError("Please select a technician"); return; }
    try {
      const updated = await ticketService.assignTechnician(selectedTicket.id, parseInt(selectedTechId));
      setTickets(tickets.map(t => t.id === updated.id ? updated : t));
      setShowAssignModal(false);
      setSelectedTechId("");
      showMsg("Technician assigned successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign technician");
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) { setError("Please provide a reason"); return; }
    try {
      const updated = await ticketService.rejectTicket(selectedTicket.id, rejectReason);
      setTickets(tickets.map(t => t.id === updated.id ? updated : t));
      setShowRejectModal(false);
      setRejectReason("");
      showMsg("Ticket rejected");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject ticket");
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

  const statuses = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"];

  // Stats
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "OPEN").length,
    inProgress: tickets.filter(t => t.status === "IN_PROGRESS").length,
    resolved: tickets.filter(t => t.status === "RESOLVED").length,
  };

  // ─── Styles ────────────────────────────────────────────────────
  const s = {
    wrapper: { display: "flex", minHeight: "100vh", fontFamily: "DM Sans, Segoe UI, sans-serif", background: "#F0F4FF" },
    sidebar: { width: "240px", background: "#fff", borderRight: "1px solid #E2E8F0", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100 },
    logo: { display: "flex", alignItems: "center", gap: "10px", padding: "24px 20px", borderBottom: "1px solid #E2E8F0" },
    logoIcon: { width: "36px", height: "36px", background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700" },
    nav: { flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" },
    navItem: (active) => ({
      display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px",
      borderRadius: "10px", cursor: "pointer", fontSize: "14px",
      fontWeight: active ? "600" : "500", color: active ? "#1D4ED8" : "#64748B",
      background: active ? "#EFF6FF" : "transparent", border: "none",
      width: "100%", textAlign: "left",
    }),
    sidebarFooter: { padding: "16px", borderTop: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "10px" },
    avatar: { width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "13px" },
    main: { marginLeft: "240px", flex: 1 },
    navbar: { background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 },
    content: { padding: "32px" },
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "28px" },
    statCard: { background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px" },
    statIcon: (bg) => ({ width: "48px", height: "48px", borderRadius: "12px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }),
    filterBar: { display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" },
    filterBtn: (active) => ({
      padding: "6px 14px", borderRadius: "20px", border: active ? "none" : "1px solid #E2E8F0",
      background: active ? "#1D4ED8" : "#fff", color: active ? "#fff" : "#64748B",
      fontSize: "12px", fontWeight: "600", cursor: "pointer",
    }),
    tableCard: { background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", overflow: "hidden" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { padding: "12px 20px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" },
    td: { padding: "14px 20px", borderBottom: "1px solid #F1F5F9", fontSize: "13px", color: "#1E293B", verticalAlign: "middle" },
    actionBtn: (bg, color) => ({
      background: bg, color, border: "none", borderRadius: "8px",
      padding: "6px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer", marginRight: "6px",
    }),
    viewBtn: { background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", fontWeight: "600", cursor: "pointer", marginRight: "6px" },
    empty: { padding: "60px", textAlign: "center", color: "#94A3B8", fontSize: "15px" },
    alert: (type) => ({
      padding: "12px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: "500", marginBottom: "20px",
      background: type === "success" ? "#D1FAE5" : "#FEE2E2",
      color: type === "success" ? "#065F46" : "#DC2626",
      border: `1px solid ${type === "success" ? "#6EE7B7" : "#FECACA"}`,
    }),
    // Modal
    overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 },
    modal: { background: "#fff", borderRadius: "20px", padding: "28px", width: "440px", maxWidth: "90vw" },
    modalTitle: { fontSize: "18px", fontWeight: "700", color: "#1E293B", marginBottom: "20px" },
    modalInput: { width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #E2E8F0", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
    modalBtnRow: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" },
    modalCancel: { background: "#F1F5F9", color: "#64748B", border: "none", borderRadius: "10px", padding: "10px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
    modalConfirm: (bg) => ({ background: bg, color: "#fff", border: "none", borderRadius: "10px", padding: "10px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }),
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
          <button style={s.navItem(true)}>🎫 Manage Tickets</button>
          <button style={s.navItem(false)} onClick={() => navigate("/admin/users")}>👥 Users</button>
          <button style={s.navItem(false)} onClick={() => navigate("/notifications")}>🔔 Notifications</button>
        </nav>
        <div style={s.sidebarFooter}>
          <div style={s.avatar}>{getInitials(user?.name)}</div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#1E293B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
            <div style={{ fontSize: "11px", color: "#94A3B8" }}>{user?.role}</div>
          </div>
          <button onClick={logout} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "18px" }}>↪</button>
        </div>
      </aside>

      {/* Main */}
      <div style={s.main}>
        <header style={s.navbar}>
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B" }}>Ticket Management</span>
        </header>

        <div style={s.content}>
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1E293B", margin: 0 }}>All Incident Tickets</h1>
            <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>Manage, assign, and review all campus incidents</p>
          </div>

          {success && <div style={s.alert("success")}>{success}</div>}
          {error && <div style={s.alert("error")}>{error}</div>}

          {/* Stats */}
          <div style={s.statsGrid}>
            <div style={s.statCard}>
              <div style={s.statIcon("#EFF6FF")}>🎫</div>
              <div>
                <div style={{ fontSize: "13px", color: "#64748B", fontWeight: "500" }}>Total Tickets</div>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "#1E293B" }}>{stats.total}</div>
              </div>
            </div>
            <div style={s.statCard}>
              <div style={s.statIcon("#DBEAFE")}>📬</div>
              <div>
                <div style={{ fontSize: "13px", color: "#64748B", fontWeight: "500" }}>Open</div>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "#1D4ED8" }}>{stats.open}</div>
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
          </div>

          {/* Filters */}
          <div style={s.filterBar}>
            {statuses.map(st => (
              <button key={st} style={s.filterBtn(filter === st)} onClick={() => setFilter(st)}>
                {st.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Table */}
          <div style={s.tableCard}>
            {loading ? (
              <div style={s.empty}>Loading tickets...</div>
            ) : filtered.length === 0 ? (
              <div style={s.empty}>No tickets found</div>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>ID</th>
                    <th style={s.th}>Reporter</th>
                    <th style={s.th}>Category</th>
                    <th style={s.th}>Location</th>
                    <th style={s.th}>Priority</th>
                    <th style={s.th}>Status</th>
                    <th style={s.th}>Technician</th>
                    <th style={s.th}>Date</th>
                    <th style={s.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t.id}>
                      <td style={s.td}><span style={{ fontWeight: "600", color: "#1D4ED8" }}>#{t.id}</span></td>
                      <td style={s.td}>
                        <div style={{ fontSize: "13px", fontWeight: "600" }}>{t.creator?.name}</div>
                        <div style={{ fontSize: "11px", color: "#94A3B8" }}>{t.creator?.email}</div>
                      </td>
                      <td style={s.td}>{t.category?.replace("_", " ")}</td>
                      <td style={s.td}>{t.location}</td>
                      <td style={s.td}><span style={priorityBadge(t.priority)}>{t.priority}</span></td>
                      <td style={s.td}><span style={statusBadge(t.status)}>{t.status?.replace("_", " ")}</span></td>
                      <td style={s.td}>
                        {t.assignedTechnician ? (
                          <span style={{ fontSize: "12px", fontWeight: "600", color: "#065F46" }}>
                            {t.assignedTechnician.name}
                          </span>
                        ) : (
                          <span style={{ fontSize: "12px", color: "#CBD5E1" }}>Unassigned</span>
                        )}
                      </td>
                      <td style={{ ...s.td, fontSize: "12px", color: "#94A3B8" }}>{formatDate(t.createdAt)}</td>
                      <td style={s.td}>
                        <button style={s.viewBtn} onClick={() => navigate(`/tickets/${t.id}`)}>View</button>
                        {t.status === "OPEN" && (
                          <>
                            <button
                              style={s.actionBtn("#D1FAE5", "#065F46")}
                              onClick={() => { setSelectedTicket(t); setShowAssignModal(true); }}
                            >
                              Assign
                            </button>
                            <button
                              style={s.actionBtn("#FEE2E2", "#DC2626")}
                              onClick={() => { setSelectedTicket(t); setShowRejectModal(true); }}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div style={s.overlay} onClick={() => setShowAssignModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={s.modalTitle}>🔧 Assign Technician</h2>
            <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "16px" }}>
              Assign a technician to ticket <strong>#{selectedTicket?.id}</strong>
            </p>
            <select
              style={s.modalInput}
              value={selectedTechId}
              onChange={e => setSelectedTechId(e.target.value)}
            >
              <option value="">-- Select Technician --</option>
              {technicians.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
              ))}
            </select>
            <div style={s.modalBtnRow}>
              <button style={s.modalCancel} onClick={() => setShowAssignModal(false)}>Cancel</button>
              <button style={s.modalConfirm("#1D4ED8")} onClick={handleAssign}>Assign</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div style={s.overlay} onClick={() => setShowRejectModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={s.modalTitle}>❌ Reject Ticket</h2>
            <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "16px" }}>
              Provide a reason for rejecting ticket <strong>#{selectedTicket?.id}</strong>
            </p>
            <textarea
              style={{ ...s.modalInput, minHeight: "100px", resize: "vertical" }}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
            />
            <div style={s.modalBtnRow}>
              <button style={s.modalCancel} onClick={() => setShowRejectModal(false)}>Cancel</button>
              <button style={s.modalConfirm("#DC2626")} onClick={handleReject}>Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
