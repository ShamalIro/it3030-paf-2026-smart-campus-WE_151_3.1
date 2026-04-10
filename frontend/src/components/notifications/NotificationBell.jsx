import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import notificationService from "../../services/notificationService";
import NotificationDropdown from "./NotificationDropdown";

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{ background: "none", border: "none",
                 cursor: "pointer", fontSize: "24px", position: "relative" }}>
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: "-5px", right: "-5px",
            backgroundColor: "red", color: "white",
            borderRadius: "50%", padding: "2px 6px",
            fontSize: "11px", fontWeight: "bold"
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <NotificationDropdown
          onClose={() => setShowDropdown(false)}
          onRefresh={fetchUnreadCount}
          onViewAll={() => { setShowDropdown(false); navigate("/notifications"); }}
        />
      )}
    </div>
  );
};

export default NotificationBell;
