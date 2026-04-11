import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import bookingService from "../../services/bookingService";
import NotificationBell from "../../components/notifications/NotificationBell";

export default function NewBookingPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const facilityId = searchParams.get("facilityId");
  const facilityName = searchParams.get("facilityName");

  const [form, setForm] = useState({
    facilityId: facilityId || "",
    facilityName: facilityName || "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
    attendees: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.date || !form.startTime || !form.endTime || !form.purpose) {
      setError("Please fill in all fields."); return;
    }
    if (form.startTime >= form.endTime) {
      setError("End time must be after start time."); return;
    }
    setLoading(true);
    try {
      await bookingService.create({
        facilityId: parseInt(form.facilityId),
        facilityName: form.facilityName,
        date: form.date,
        startTime: form.startTime + ":00",
        endTime: form.endTime + ":00",
        purpose: form.purpose,
        attendees: parseInt(form.attendees) || 1,
      });
      setSuccess(true);
      setTimeout(() => navigate("/bookings"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking.");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (success) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "DM Sans, Segoe UI, sans-serif", background: "#F0F4FF" }}>
        <div style={{ background: "#fff", borderRadius: "24px", border: "1px solid #E2E8F0", padding: "48px", textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>✅</div>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#1E293B" }}>Booking Submitted!</h2>
          <p style={{ color: "#64748B" }}>Your booking request is pending approval.</p>
        </div>
      </div>
    );
  }

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
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#1E293B" }}>{user?.name}</div>
            <div style={{ fontSize: "11px", color: "#94A3B8" }}>{user?.role}</div>
          </div>
          <button onClick={logout} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "18px" }}>↪</button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: "240px", flex: 1 }}>
        <header style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B" }}>New Booking</span>
          <NotificationBell />
        </header>

        <div style={{ padding: "32px", maxWidth: "600px" }}>
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1E293B", margin: 0 }}>Book a Facility</h1>
            <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>Fill in the details below to request a booking.</p>
          </div>

          <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "32px" }}>

            {error && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "10px", padding: "12px 16px", fontSize: "14px", color: "#DC2626", marginBottom: "20px" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Facility */}
              <div>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "8px" }}>Facility</label>
                <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "12px 16px", fontSize: "14px", color: "#1E293B", fontWeight: "600" }}>
                  {form.facilityName || "No facility selected"}
                </div>
              </div>

              {/* Date */}
              <div>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "8px" }}>Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={form.date}
                  onChange={e => update("date", e.target.value)}
                  style={{ width: "100%", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "12px 16px", fontSize: "14px", color: "#1E293B", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {/* Time */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "8px" }}>Start Time</label>
                  <input type="time" value={form.startTime} onChange={e => update("startTime", e.target.value)}
                    style={{ width: "100%", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "12px 16px", fontSize: "14px", color: "#1E293B", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "8px" }}>End Time</label>
                  <input type="time" value={form.endTime} onChange={e => update("endTime", e.target.value)}
                    style={{ width: "100%", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "12px 16px", fontSize: "14px", color: "#1E293B", outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "8px" }}>Purpose</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Final Year Project Demo"
                  value={form.purpose}
                  onChange={e => update("purpose", e.target.value)}
                  style={{ width: "100%", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "12px 16px", fontSize: "14px", color: "#1E293B", outline: "none", resize: "none", boxSizing: "border-box" }} />
              </div>

              {/* Attendees */}
              <div>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "8px" }}>Expected Attendees</label>
                <input
                  type="number" min="1"
                  placeholder="e.g. 20"
                  value={form.attendees}
                  onChange={e => update("attendees", e.target.value)}
                  style={{ width: "100%", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "12px 16px", fontSize: "14px", color: "#1E293B", outline: "none", boxSizing: "border-box" }} />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="button" onClick={() => navigate("/facilities")}
                  style={{ flex: 1, padding: "12px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: "14px", fontWeight: "600", color: "#64748B", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  style={{ flex: 2, padding: "12px", background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", color: "#fff", cursor: "pointer" }}>
                  {loading ? "Submitting..." : "Submit Booking Request"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}