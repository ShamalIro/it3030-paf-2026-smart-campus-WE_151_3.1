import { useState, useEffect } from "react";
import notificationService from "../../services/notificationService";

const NotificationDropdown = ({ onClose, onRefresh, onViewAll }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getMyNotifications();
      setNotifications(res.data.slice(0, 5));
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
      onRefresh();
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  return (
    <div style={{
      position: "absolute", right: 0, top: "35px",
      width: "320px", backgroundColor: "white",
      border: "1px solid #ddd", borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 1000
    }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #eee",
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center" }}>
        <strong>Notifications</strong>
        <button onClick={onClose}
          style={{ background: "none", border: "none",
                   cursor: "pointer", fontSize: "16px" }}>✕</button>
      </div>

      {loading ? (
        <div style={{ padding: "16px", textAlign: "center" }}>Loading...</div>
      ) : notifications.length === 0 ? (
        <div style={{ padding: "16px", textAlign: "center",
                      color: "#888" }}>No notifications</div>
      ) : (
        notifications.map(n => (
          <div key={n.id}
            style={{
              padding: "12px 16px", borderBottom: "1px solid #f0f0f0",
              backgroundColor: n.read ? "white" : "#f0f7ff",
              cursor: "pointer"
            }}
            onClick={() => !n.read && handleMarkAsRead(n.id)}>
            <div style={{ fontSize: "13px", fontWeight: n.read ? "normal" : "bold" }}>
              {n.message}
            </div>
            <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
              {new Date(n.createdAt).toLocaleString()}
            </div>
          </div>
        ))
      )}

      <div style={{ padding: "10px", textAlign: "center",
                    borderTop: "1px solid #eee" }}>
        <button onClick={onViewAll}
          style={{ background: "none", border: "none",
                   color: "#4285F4", cursor: "pointer", fontSize: "13px" }}>
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
