import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import bookingService from "../../services/bookingService";
import NotificationBell from "../../components/notifications/NotificationBell";

export default function BookingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.getMyBookings()
      .then(res => setBookings(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await bookingService.cancel(id);
      setBookings(prev =>
        prev.map(b => b.id === id ? { ...b, status: "CANCELLED" } : b)
      );
    } catch {}
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const statusBadge = (status) => {
    const map = {
      PENDING:   { bg: "#FEF9C3", color: "#854D0E" },
      APPROVED:  { bg: "#D1FAE5", color: "#065F46" },
      REJECTED:  { bg: "#FEE2E2", color: "#DC2626" },
      CANCELLED: { bg: "#F1F5F9", color: "#64748B" },
    };
    const s = map[status] || map["PENDING"];
    return { background: s.bg, color: s.color, padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" };
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
          <button onClick={() => navigate("/dashboard")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#64748B", background: "transparent", border: "none", width: "100%", textAlign: "left" }}>🏠 Dashboard</button>
          <button onClick={() => navigate("/facilities")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#64748B", background: "transparent", border: "none", width: "100%", textAlign: "left" }}>🏛️ Facilities</button>
          <button onClick={() => navigate("/bookings")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "600", color: "#1D4ED8", background: "#EFF6FF", border: "none", width: "100%", textAlign: "left" }}>📅 My Bookings</button>
          <button onClick={() => navigate("/notifications")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#64748B", background: "transparent", border: "none", width: "100%", textAlign: "left" }}>🔔 Notifications</button>
        </nav>
        <div style={{ padding: "16px", borderTop: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "13px" }}>{getInitials(user?.name)}</div>
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
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B" }}>My Bookings</span>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => navigate("/facilities")}
              style={{ background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", color: "#fff", border: "none", borderRadius: "10px", padding: "8px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
              + New Booking
            </button>
            <NotificationBell />
          </div>
        </header>

        <div style={{ padding: "32px" }}>
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1E293B", margin: 0 }}>My Bookings</h1>
            <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>Track all your facility booking requests.</p>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#94A3B8" }}>Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "60px", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📅</div>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B", marginBottom: "8px" }}>No bookings yet</div>
              <div style={{ fontSize: "14px", color: "#64748B", marginBottom: "24px" }}>Browse facilities and make your first booking</div>
              <button onClick={() => navigate("/facilities")} style={{ background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", color: "#fff", border: "none", borderRadius: "10px", padding: "12px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>Browse Facilities</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {bookings.map(b => (
                <div key={b.id} style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: "#1E293B" }}>{b.facilityName}</div>
                    <div style={{ fontSize: "13px", color: "#64748B" }}>📅 {b.date} • {b.startTime} - {b.endTime}</div>
                    <div style={{ fontSize: "13px", color: "#64748B" }}>📝 {b.purpose} • 👥 {b.attendees} attendees</div>
                    {b.rejectionReason && (
                      <div style={{ fontSize: "13px", color: "#DC2626" }}>❌ Reason: {b.rejectionReason}</div>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={statusBadge(b.status)}>{b.status}</span>
                    {b.status === "APPROVED" && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA", borderRadius: "8px", padding: "6px 14px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}