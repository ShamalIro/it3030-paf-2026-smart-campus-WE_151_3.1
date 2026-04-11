import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import notificationService from "../../services/notificationService";
import NotificationBell from "../../components/notifications/NotificationBell";

export default function NotificationsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getMyNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch {}
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
    } catch {}
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatDate = (value) => {
    if (!value) return "";
    return new Date(value).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
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
          <button onClick={() => navigate("/dashboard")}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#64748B", background: "transparent", border: "none", width: "100%", textAlign: "left" }}>
            🏠 Dashboard
          </button>
          <button onClick={() => navigate("/facilities")}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#64748B", background: "transparent", border: "none", width: "100%", textAlign: "left" }}>
            🏛️ Facilities
          </button>
          <button onClick={() => navigate("/bookings")}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#64748B", background: "transparent", border: "none", width: "100%", textAlign: "left" }}>
            📅 My Bookings
          </button>
          <button onClick={() => navigate("/notifications")}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "600", color: "#1D4ED8", background: "#EFF6FF", border: "none", width: "100%", textAlign: "left" }}>
            🔔 Notifications
          </button>
          {user?.role === "ADMIN" && (
            <>
              <button onClick={() => navigate("/admin/users")}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#64748B", background: "transparent", border: "none", width: "100%", textAlign: "left" }}>
                👥 Users (Admin)
              </button>
              <button onClick={() => navigate("/admin/bookings")}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#64748B", background: "transparent", border: "none", width: "100%", textAlign: "left" }}>
                📅 Manage Bookings
              </button>
              <button onClick={() => navigate("/admin/tickets")}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#64748B", background: "transparent", border: "none", width: "100%", textAlign: "left" }}>
                🎫 Manage Tickets
              </button>
            </>
          )}
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
        <header style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B" }}>Notifications</span>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button onClick={handleMarkAllAsRead}
              style={{ background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", color: "#fff", border: "none", borderRadius: "10px", padding: "8px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
              Mark All as Read
            </button>
            <NotificationBell />
          </div>
        </header>

        <div style={{ padding: "32px" }}>
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1E293B", margin: 0 }}>My Notifications</h1>
            <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>Stay updated with your campus activity.</p>
          </div>

          <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
            {loading ? (
              <div style={{ padding: "60px", textAlign: "center", color: "#94A3B8" }}>Loading...</div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: "60px", textAlign: "center", color: "#94A3B8" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔔</div>
                <div style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B", marginBottom: "8px" }}>No notifications yet</div>
                <div style={{ fontSize: "14px" }}>You'll see notifications here when something happens</div>
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id}
                  onClick={() => !n.read && handleMarkAsRead(n.id)}
                  style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid #F1F5F9",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                    background: n.read ? "#fff" : "#F0F7FF",
                    cursor: n.read ? "default" : "pointer",
                  }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: n.read ? "#CBD5E1" : "#3B82F6", flexShrink: 0, marginTop: "5px" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: n.read ? "400" : "600", color: "#1E293B" }}>{n.message}</div>
                    <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px" }}>
                      {n.type} • {formatDate(n.createdAt)}
                    </div>
                  </div>
                  {!n.read && (
                    <span style={{ background: "#DBEAFE", color: "#1D4ED8", borderRadius: "12px", padding: "2px 10px", fontSize: "11px", fontWeight: "600", flexShrink: 0 }}>
                      New
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}