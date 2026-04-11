import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import bookingService from "../../services/bookingService";
import NotificationBell from "../../components/notifications/NotificationBell";

export default function ManageBookingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    bookingService.getAll()
      .then(res => setBookings(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    try {
      await bookingService.approve(id);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "APPROVED" } : b));
      showSuccess("Booking approved! User notified.");
    } catch {}
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) { alert("Please enter a reason."); return; }
    try {
      await bookingService.reject(id, rejectReason);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "REJECTED", rejectionReason: rejectReason } : b));
      setRejectingId(null);
      setRejectReason("");
      showSuccess("Booking rejected. User notified.");
    } catch {}
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
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

  const filtered = filter === "ALL" ? bookings : bookings.filter(b => b.status === filter);

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
          <button onClick={() => navigate("/admin/bookings")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "600", color: "#1D4ED8", background: "#EFF6FF", border: "none", width: "100%", textAlign: "left" }}>📅 Manage Bookings</button>
          <button onClick={() => navigate("/notifications")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#64748B", background: "transparent", border: "none", width: "100%", textAlign: "left" }}>🔔 Notifications</button>
          <button onClick={() => navigate("/admin/users")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#64748B", background: "transparent", border: "none", width: "100%", textAlign: "left" }}>👥 Users (Admin)</button>
        </nav>
        <div style={{ padding: "16px", borderTop: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "13px" }}>{getInitials(user?.name)}</div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#1E293B" }}>{user?.name}</div>
            <div style={{ fontSize: "11px", color: "#94A3B8" }}>{user?.role}</div>
          </div>
          <button onClick={logout} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "18px" }}>↪</button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: "240px", flex: 1 }}>
        <header style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B" }}>Manage Bookings</span>
          <NotificationBell />
        </header>

        <div style={{ padding: "32px" }}>
          <div style={{ marginBottom: "28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1E293B", margin: 0 }}>Booking Requests</h1>
              <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>Approve or reject facility booking requests.</p>
            </div>
            <select value={filter} onChange={e => setFilter(e.target.value)}
              style={{ border: "1px solid #E2E8F0", borderRadius: "10px", padding: "8px 16px", fontSize: "14px", color: "#1E293B", background: "#fff", cursor: "pointer", outline: "none" }}>
              <option value="ALL">All Bookings</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {successMsg && (
            <div style={{ background: "#D1FAE5", border: "1px solid #6EE7B7", borderRadius: "10px", padding: "12px 20px", fontSize: "14px", color: "#065F46", marginBottom: "20px" }}>
              {successMsg}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#94A3B8" }}>Loading bookings...</div>
          ) : filtered.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "60px", textAlign: "center", color: "#94A3B8" }}>No bookings found.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {filtered.map(b => (
                <div key={b.id} style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: "700", color: "#1E293B" }}>{b.facilityName}</div>
                      <div style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>👤 {b.userName} • {b.userEmail}</div>
                      <div style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>📅 {b.date} • {b.startTime} - {b.endTime}</div>
                      <div style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>📝 {b.purpose} • 👥 {b.attendees} attendees</div>
                      {b.rejectionReason && (
                        <div style={{ fontSize: "13px", color: "#DC2626", marginTop: "4px" }}>❌ Reason: {b.rejectionReason}</div>
                      )}
                    </div>
                    <span style={statusBadge(b.status)}>{b.status}</span>
                  </div>

                  {b.status === "PENDING" && (
                    <div style={{ display: "flex", gap: "12px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #F1F5F9" }}>
                      <button onClick={() => handleApprove(b.id)}
                        style={{ flex: 1, padding: "10px", background: "#D1FAE5", color: "#065F46", border: "1px solid #6EE7B7", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                        ✅ Approve
                      </button>
                      <button onClick={() => setRejectingId(b.id)}
                        style={{ flex: 1, padding: "10px", background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                        ❌ Reject
                      </button>
                    </div>
                  )}

                  {rejectingId === b.id && (
                    <div style={{ marginTop: "12px", display: "flex", gap: "12px" }}>
                      <input
                        placeholder="Enter rejection reason..."
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        style={{ flex: 1, border: "1px solid #E2E8F0", borderRadius: "10px", padding: "10px 16px", fontSize: "14px", outline: "none" }} />
                      <button onClick={() => handleReject(b.id)}
                        style={{ padding: "10px 20px", background: "#DC2626", color: "#fff", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                        Confirm
                      </button>
                      <button onClick={() => { setRejectingId(null); setRejectReason(""); }}
                        style={{ padding: "10px 20px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: "14px", cursor: "pointer" }}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}