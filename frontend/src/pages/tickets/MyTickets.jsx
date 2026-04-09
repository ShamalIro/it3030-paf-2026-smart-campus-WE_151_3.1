import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ticketService from "../../services/ticketService";

export default function MyTickets() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await ticketService.getMyTickets();
      setTickets(data);
    } catch (err) {
      console.error("Failed to load tickets", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === "ALL"
    ? tickets
    : tickets.filter(t => t.status === filter);

  const statusBadge = (status) => {
    const map = {
      OPEN: { bg: "#DBEAFE", color: "#1D4ED8" },
      IN_PROGRESS: { bg: "#FEF3C7", color: "#D97706" },
      RESOLVED: { bg: "#D1FAE5", color: "#065F46" },
      CLOSED: { bg: "#F1F5F9", color: "#64748B" },
      REJECTED: { bg: "#FEE2E2", color: "#DC2626" },
    };
    const style = map[status] || map["OPEN"];
    return {
      background: style.bg,
      color: style.color,
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      display: "inline-block",
    };
  };

  const priorityBadge = (priority) => {
    const map = {
      HIGH: { bg: "#FEE2E2", color: "#DC2626" },
      MEDIUM: { bg: "#FEF3C7", color: "#D97706" },
      LOW: { bg: "#D1FAE5", color: "#065F46" },
    };
    const style = map[priority] || map["LOW"];
    return {
      background: style.bg,
      color: style.color,
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: "600",
    };
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  const statuses = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"];

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
    topBar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" },
    createBtn: {
      background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", color: "#fff", border: "none",
      borderRadius: "10px", padding: "10px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer",
    },
    filterBar: { display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" },
    filterBtn: (active) => ({
      padding: "6px 14px", borderRadius: "20px", border: active ? "none" : "1px solid #E2E8F0",
      background: active ? "#1D4ED8" : "#fff", color: active ? "#fff" : "#64748B",
      fontSize: "12px", fontWeight: "600", cursor: "pointer",
    }),
    tableCard: { background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", overflow: "hidden" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" },
    td: { padding: "16px 24px", borderBottom: "1px solid #F1F5F9", fontSize: "14px", color: "#1E293B", verticalAlign: "middle" },
    viewBtn: {
      background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE",
      borderRadius: "8px", padding: "6px 14px", fontSize: "13px", fontWeight: "600", cursor: "pointer",
    },
    empty: { padding: "60px", textAlign: "center", color: "#94A3B8", fontSize: "15px" },
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
          <button style={s.navItem(true)}>🎫 My Tickets</button>
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
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B" }}>My Tickets</span>
        </header>

        <div style={s.content}>
          {/* Top bar */}
          <div style={s.topBar}>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1E293B", margin: 0 }}>
                Incident Tickets
              </h1>
              <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>
                Track and manage your reported incidents
              </p>
            </div>
            <button style={s.createBtn} onClick={() => navigate("/tickets/create")}>
              + Report Incident
            </button>
          </div>

          {/* Filter bar */}
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
              <div style={s.empty}>
                No tickets found.
                <br />
                <button
                  style={{ ...s.createBtn, marginTop: "16px" }}
                  onClick={() => navigate("/tickets/create")}
                >
                  Report your first incident
                </button>
              </div>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>ID</th>
                    <th style={s.th}>Category</th>
                    <th style={s.th}>Location</th>
                    <th style={s.th}>Priority</th>
                    <th style={s.th}>Status</th>
                    <th style={s.th}>Created</th>
                    <th style={s.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t.id}>
                      <td style={s.td}>
                        <span style={{ fontWeight: "600", color: "#1D4ED8" }}>#{t.id}</span>
                      </td>
                      <td style={s.td}>{t.category?.replace("_", " ")}</td>
                      <td style={s.td}>{t.location}</td>
                      <td style={s.td}>
                        <span style={priorityBadge(t.priority)}>{t.priority}</span>
                      </td>
                      <td style={s.td}>
                        <span style={statusBadge(t.status)}>{t.status?.replace("_", " ")}</span>
                      </td>
                      <td style={{ ...s.td, fontSize: "13px", color: "#64748B" }}>{formatDate(t.createdAt)}</td>
                      <td style={s.td}>
                        <button style={s.viewBtn} onClick={() => navigate(`/tickets/${t.id}`)}>
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
