import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bookingService from "../../services/bookingService";

const AdminBookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [remarksMap, setRemarksMap] = useState({});

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const status = filter === "ALL" ? null : filter;
      const res = await bookingService.getAllBookings(status);
      setBookings(res.data);
    } catch (err) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await bookingService.approveBooking(id, remarksMap[id] || "");
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve");
    }
  };

  const handleReject = async (id) => {
    try {
      await bookingService.rejectBooking(id, remarksMap[id] || "");
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await bookingService.deleteBooking(id);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  const handleRemarksChange = (id, value) => {
    setRemarksMap({ ...remarksMap, [id]: value });
  };

  const getStatusBadge = (status) => {
    const colors = {
      PENDING: { bg: "#FEF3C7", text: "#D97706" },
      APPROVED: { bg: "#DCFCE7", text: "#16A34A" },
      REJECTED: { bg: "#FEE2E2", text: "#DC2626" },
      CANCELLED: { bg: "#F1F5F9", text: "#64748B" },
    };
    const color = colors[status] || colors.PENDING;
    return {
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      background: color.bg,
      color: color.text,
    };
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#F0F4FF",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: "40px 20px",
    },
    container: {
      maxWidth: "1000px",
      margin: "0 auto",
    },
    title: {
      fontSize: "28px",
      fontWeight: "700",
      color: "#1E293B",
      marginBottom: "24px",
    },
    filterBar: {
      display: "flex",
      gap: "8px",
      marginBottom: "24px",
      flexWrap: "wrap",
    },
    filterBtn: (active) => ({
      padding: "8px 16px",
      borderRadius: "20px",
      border: active ? "2px solid #1D4ED8" : "1px solid #E2E8F0",
      background: active ? "#EFF6FF" : "#fff",
      color: active ? "#1D4ED8" : "#64748B",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif",
    }),
    card: {
      background: "#fff",
      borderRadius: "24px",
      border: "1px solid #E2E8F0",
      padding: "24px",
      marginBottom: "16px",
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
    },
    resourceName: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#1E293B",
    },
    userInfo: {
      fontSize: "13px",
      color: "#3B82F6",
      marginBottom: "8px",
    },
    details: {
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      marginBottom: "12px",
    },
    detail: {
      fontSize: "14px",
      color: "#64748B",
    },
    detailLabel: {
      fontWeight: "600",
      color: "#475569",
    },
    purpose: {
      fontSize: "14px",
      color: "#475569",
      marginBottom: "12px",
    },
    remarksInput: {
      width: "100%",
      padding: "10px 14px",
      borderRadius: "10px",
      border: "1px solid #E2E8F0",
      fontSize: "13px",
      fontFamily: "'DM Sans', sans-serif",
      marginBottom: "12px",
      boxSizing: "border-box",
      outline: "none",
    },
    actions: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
    },
    approveBtn: {
      padding: "8px 16px",
      background: "#DCFCE7",
      color: "#16A34A",
      border: "none",
      borderRadius: "8px",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif",
    },
    rejectBtn: {
      padding: "8px 16px",
      background: "#FEF3C7",
      color: "#D97706",
      border: "none",
      borderRadius: "8px",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif",
    },
    deleteBtn: {
      padding: "8px 16px",
      background: "#FEE2E2",
      color: "#DC2626",
      border: "none",
      borderRadius: "8px",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif",
    },
    backBtn: {
      background: "none",
      border: "none",
      color: "#1D4ED8",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      marginBottom: "16px",
      fontFamily: "'DM Sans', sans-serif",
    },
    empty: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#64748B",
      fontSize: "16px",
    },
    error: {
      background: "#FEE2E2",
      color: "#DC2626",
      padding: "12px 16px",
      borderRadius: "12px",
      marginBottom: "16px",
      fontSize: "14px",
    },
    existingRemarks: {
      fontSize: "13px",
      color: "#DC2626",
      fontStyle: "italic",
      marginBottom: "12px",
    },
  };

  const filters = ["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED"];

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <p style={{ textAlign: "center", color: "#64748B" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button style={styles.backBtn} onClick={() => navigate("/admin/dashboard")}>
          ← Back to Admin Dashboard
        </button>

        <h1 style={styles.title}>Manage Bookings</h1>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.filterBar}>
          {filters.map((f) => (
            <button
              key={f}
              style={styles.filterBtn(filter === f)}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {bookings.length === 0 ? (
          <div style={styles.card}>
            <div style={styles.empty}>No bookings found.</div>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.resourceName}>{booking.resourceName}</span>
                <span style={getStatusBadge(booking.status)}>{booking.status}</span>
              </div>

              <p style={styles.userInfo}>
                Booked by: {booking.userName} ({booking.userEmail})
              </p>

              <div style={styles.details}>
                <span style={styles.detail}>
                  <span style={styles.detailLabel}>Type: </span>
                  {booking.resourceType.replace("_", " ")}
                </span>
                <span style={styles.detail}>
                  <span style={styles.detailLabel}>Date: </span>
                  {booking.bookingDate}
                </span>
                <span style={styles.detail}>
                  <span style={styles.detailLabel}>Time: </span>
                  {booking.startTime} - {booking.endTime}
                </span>
                {booking.expectedAttendees && (
                  <span style={styles.detail}>
                    <span style={styles.detailLabel}>Attendees: </span>
                    {booking.expectedAttendees}
                  </span>
                )}
              </div>

              <p style={styles.purpose}>
                <span style={styles.detailLabel}>Purpose: </span>
                {booking.purpose}
              </p>

              {booking.adminRemarks && (
                <p style={styles.existingRemarks}>
                  Previous Remarks: {booking.adminRemarks}
                </p>
              )}

              {booking.status === "PENDING" && (
                <>
                  <input
                    style={styles.remarksInput}
                    type="text"
                    placeholder="Add remarks (optional)"
                    value={remarksMap[booking.id] || ""}
                    onChange={(e) => handleRemarksChange(booking.id, e.target.value)}
                  />
                  <div style={styles.actions}>
                    <button style={styles.approveBtn} onClick={() => handleApprove(booking.id)}>
                      ✓ Approve
                    </button>
                    <button style={styles.rejectBtn} onClick={() => handleReject(booking.id)}>
                      ✕ Reject
                    </button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(booking.id)}>
                      🗑 Delete
                    </button>
                  </div>
                </>
              )}

              {booking.status !== "PENDING" && (
                <div style={styles.actions}>
                  <button style={styles.deleteBtn} onClick={() => handleDelete(booking.id)}>
                    🗑 Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminBookingsPage;