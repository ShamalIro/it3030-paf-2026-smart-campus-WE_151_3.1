import { useState, useEffect } from "react";
import notificationService from "../../services/notificationService";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../../components/notifications/NotificationBell";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

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
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh",
                  backgroundColor: "#f5f5f5" }}>
      {/* Navbar */}
      <div style={{ backgroundColor: "#4285F4", color: "white",
                    padding: "12px 24px", display: "flex",
                    justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Smart Campus Operations Hub</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <NotificationBell />
          <span>👤 {user?.name}</span>
          {user?.role === "ADMIN" && (
            <a href="/admin/users"
              style={{ color: "white", textDecoration: "none",
                       backgroundColor: "#1a56c4", padding: "6px 12px",
                       borderRadius: "4px" }}>
              Manage Users
            </a>
          )}
          <button onClick={logout}
            style={{ backgroundColor: "white", color: "#4285F4",
                     border: "none", padding: "6px 12px",
                     borderRadius: "4px", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "800px", margin: "32px auto", padding: "0 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between",
                      alignItems: "center", marginBottom: "16px" }}>
          <h2>My Notifications</h2>
          <button onClick={handleMarkAllAsRead}
            style={{ backgroundColor: "#4285F4", color: "white",
                     border: "none", padding: "8px 16px",
                     borderRadius: "4px", cursor: "pointer" }}>
            Mark All as Read
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px",
                        backgroundColor: "white", borderRadius: "8px",
                        color: "#888" }}>
            No notifications yet
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} style={{
              backgroundColor: n.read ? "white" : "#f0f7ff",
              border: `1px solid ${n.read ? "#eee" : "#4285F4"}`,
              borderRadius: "8px", padding: "16px",
              marginBottom: "12px", cursor: n.read ? "default" : "pointer"
            }}
              onClick={() => !n.read && handleMarkAsRead(n.id)}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: n.read ? "normal" : "bold",
                               fontSize: "14px" }}>
                  {n.message}
                </span>
                {!n.read && (
                  <span style={{ backgroundColor: "#4285F4", color: "white",
                                 borderRadius: "12px", padding: "2px 8px",
                                 fontSize: "11px" }}>
                    New
                  </span>
                )}
              </div>
              <div style={{ fontSize: "12px", color: "#888", marginTop: "6px" }}>
                {n.type} • {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;