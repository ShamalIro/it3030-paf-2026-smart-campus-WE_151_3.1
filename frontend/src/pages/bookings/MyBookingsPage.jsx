import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bookingService from "../../services/bookingService";

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await bookingService.getMyBookings();
      setBookings(res.data);
    } catch (err) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await bookingService.cancelBooking(id);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  const getStatusColor = (status) => {
    const map = {
      PENDING: { bg: "#FEF3C7", text: "#D97706" },
      APPROVED: { bg: "#DCFCE7", text: "#16A34A" },
      REJECTED: { bg: "#FEE2E2", text: "#DC2626" },
      CANCELLED: { bg: "#F1F5F9", text: "#64748B" },
    };
    return map[status] || map.PENDING;
  };

  const s = {
    page: { minHeight: "100vh", background: "#F0F4FF", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", padding: "40px 20px" },
    container: { maxWidth: "900px", margin: "0 auto" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
    title: { fontSize: "28px", fontWeight: "700", color: "#1E293B" },
    createBtn: { padding: "12px 24px", background: "#1D4ED8", color: "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
    card: { background: "#fff", borderRadius: "24px", border: "1px solid #E2E8F0", padding: "24px", marginBottom: "16px" },
    cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
    resName: { fontSize: "18px", fontWeight: "700", color: "#1E293B" },
    badge: (status) => { const c = getStatusColor(status); return { display: "inline-block", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: c.bg, color: c.text }; },
    info: { fontSize: "14px", color: "#64748B", marginBottom: "4px" },
    bold: { fontWeight: "600", color: "#475569" },
    purpose: { fontSize: "14px", color: "#475569", marginBottom: "12px" },
    remarks: { fontSize: "13px", color: "#DC2626", fontStyle: "italic", marginBottom: "12px" },
    cancelBtn: { padding: "8px 16px", background: "#FEE2E2", color: "#DC2626", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" },
    backBtn: { background: "none", border: "none", color: "#1D4ED8", fontSize: "14px", fontWeight: "600", cursor: "pointer", marginBottom: "16px" },
    empty: { textAlign: "center", padding: "60px 20px", color: "#64748B", fontSize: "16px" },
    errBox: { background: "#FEE2E2", color: "#DC2626", padding: "12px 16px", borderRadius: "12px", marginBottom: "16px", fontSize: "14px" },
  };

  if (loading) {
    return (
      <div style={s.page}>
        <div style={s.container}>
          <p style={{ textAlign: "center", color: "#64748B" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.container}>
        <button style={s.backBtn} onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
        <div style={s.header}>
          <h1 style={s.title}>My Bookings</h1>
          <button style={s.createBtn} onClick={() => navigate("/bookings/create")}>
            + New Booking
          </button>
        </div>
        {error && <div style={s.errBox}>{error}</div>}
        {bookings.length === 0 ? (
          <div style={s.card}>
            <div style={s.empty}>
              <p>No bookings yet.</p>
              <button style={{ ...s.createBtn, marginTop: "16px" }} onClick={() => navigate("/bookings/create")}>
                Create Your First Booking
              </button>
            </div>
          </div>
        ) : (
          bookings.map((b) => (
            <div key={b.id} style={s.card}>
              <div style={s.cardTop}>
                <span style={s.resName}>{b.resourceName}</span>
                <span style={s.badge(b.status)}>{b.status}</span>
              </div>
              <p style={s.info}><span style={s.bold}>Type:</span> {b.resourceType.replace("_", " ")}</p>
              <p style={s.info}><span style={s.bold}>Date:</span> {b.bookingDate}</p>
              <p style={s.info}><span style={s.bold}>Time:</span> {b.startTime} - {b.endTime}</p>
              {b.expectedAttendees && <p style={s.info}><span style={s.bold}>Attendees:</span> {b.expectedAttendees}</p>}
              <p style={s.purpose}><span style={s.bold}>Purpose:</span> {b.purpose}</p>
              {b.adminRemarks && <p style={s.remarks}>Admin Remarks: {b.adminRemarks}</p>}
              {(b.status === "PENDING" || b.status === "APPROVED") && (
                <button style={s.cancelBtn} onClick={() => handleCancel(b.id)}>Cancel Booking</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;