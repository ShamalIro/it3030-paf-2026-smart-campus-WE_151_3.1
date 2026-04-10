import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import NotificationBell from "../../components/notifications/NotificationBell";

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axiosInstance.get("/notifications/unread/count")
      .then(res => setUnreadCount(res.data.count))
      .catch(() => {});

    axiosInstance.get("/notifications")
      .then(res => setNotifications(res.data.slice(0, 5)))
      .catch(() => {});
  }, []);

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "DM Sans, Segoe UI, sans-serif", background: "#F0F4FF" }}>
      
      {/* Sidebar */}
      <aside style={{ width: "240px", background: "#fff", borderRight: "1px solid #E2E8F0", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "24px 20px", borderBottom: "1px solid #E2E8F0" }}>
          <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700" }}>S</div>
          <span style={{ fontWeight: "700", fontSize: "16px", color: "#1E293B" }}>SCOH</span>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <button onClick={() => navigate("/dashboard")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "600", color: "#1D4ED8", background: "#EFF6FF", border: "none", width: "100%", textAlign: "left" }}>
            🏠 Dashboard
          </button>
          <button onClick={() => navigate("/tickets/my")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#64748B", background: "transparent", border: "none", width: "100%", textAlign: "left" }}>
            🎫 My Tickets
          </button>
          <button onClick={() => navigate("/tickets/create")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#64748B", background: "transparent", border: "none", width: "100%", textAlign: "left" }}>
            ➕ Report Incident
          </button>
          <button onClick={() => navigate("/notifications")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#64748B", background: "transparent", border: "none", width: "100%", textAlign: "left" }}>
            🔔 Notifications
            {unreadCount > 0 && <span style={{ marginLeft: "auto", background: "#EF4444", color: "#fff", borderRadius: "10px", fontSize: "11px", fontWeight: "700", padding: "1px 7px" }}>{unreadCount}</span>}
          </button>
        </nav>

        <div style={{ padding: "16px", borderTop: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "13px" }}>
            {getInitials(user?.name)}
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#1E293B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
            <div style={{ fontSize: "11px", color: "#94A3B8" }}>{user?.role}</div>
          </div>
          <button onClick={logout} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "18px" }}>↪</button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: "240px", flex: 1 }}>
        {/* Navbar */}
        <header style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B" }}>My Dashboard</span>
          <NotificationBell />
        </header>

        {/* Content */}
        <div style={{ padding: "32px" }}>
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1E293B", margin: 0 }}>Welcome back, {user?.name} 👋</h1>
            <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>Here's your activity summary.</p>
          </div>

          {/* Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "28px" }}>
            <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🔔</div>
              <div>
                <div style={{ fontSize: "13px", color: "#64748B", fontWeight: "500" }}>Unread Notifications</div>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "#1E293B" }}>{unreadCount}</div>
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>✅</div>
              <div>
                <div style={{ fontSize: "13px", color: "#64748B", fontWeight: "500" }}>Total Notifications</div>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "#1E293B" }}>{notifications.length}</div>
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>👤</div>
              <div>
                <div style={{ fontSize: "13px", color: "#64748B", fontWeight: "500" }}>My Role</div>
                <div style={{ fontSize: "20px", fontWeight: "700", color: "#1D4ED8" }}>{user?.role}</div>
              </div>
            </div>
          </div>

          {/* Recent Notifications */}
          <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #E2E8F0" }}>
              <span style={{ fontSize: "16px", fontWeight: "700", color: "#1E293B" }}>Recent Notifications</span>
              <button onClick={() => navigate("/notifications")} style={{ background: "none", border: "none", color: "#1D4ED8", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>View all →</button>
            </div>
            {notifications.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#94A3B8" }}>No notifications yet.</div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} style={{ padding: "16px 24px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: n.read ? "#CBD5E1" : "#3B82F6", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: n.read ? "400" : "600", color: "#1E293B" }}>{n.message}</div>
                    <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>{n.type}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}