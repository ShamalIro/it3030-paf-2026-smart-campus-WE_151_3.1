import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bookingService from "../../services/bookingService";

const CreateBookingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    resourceName: "",
    resourceType: "LECTURE_HALL",
    bookingDate: "",
    startTime: "",
    endTime: "",
    purpose: "",
    expectedAttendees: "",
  });

  const resourceTypes = [
    "LECTURE_HALL",
    "LAB",
    "MEETING_ROOM",
    "PROJECTOR",
    "CAMERA",
    "EQUIPMENT",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...form,
        expectedAttendees: form.expectedAttendees ? parseInt(form.expectedAttendees) : null,
      };
      await bookingService.createBooking(payload);
      setSuccess("Booking created successfully!");
      setTimeout(() => navigate("/bookings/my"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#F0F4FF",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: "40px 20px",
    },
    container: {
      maxWidth: "600px",
      margin: "0 auto",
    },
    title: {
      fontSize: "28px",
      fontWeight: "700",
      color: "#1E293B",
      marginBottom: "24px",
    },
    card: {
      background: "#fff",
      borderRadius: "24px",
      border: "1px solid #E2E8F0",
      padding: "32px",
    },
    formGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      color: "#475569",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "12px",
      border: "1px solid #E2E8F0",
      fontSize: "14px",
      fontFamily: "'DM Sans', sans-serif",
      outline: "none",
      boxSizing: "border-box",
    },
    select: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "12px",
      border: "1px solid #E2E8F0",
      fontSize: "14px",
      fontFamily: "'DM Sans', sans-serif",
      outline: "none",
      boxSizing: "border-box",
      background: "#fff",
    },
    textarea: {
      width: "100%",
      padding: "12px 16px",
      borderRadius: "12px",
      border: "1px solid #E2E8F0",
      fontSize: "14px",
      fontFamily: "'DM Sans', sans-serif",
      outline: "none",
      boxSizing: "border-box",
      minHeight: "80px",
      resize: "vertical",
    },
    row: {
      display: "flex",
      gap: "16px",
    },
    half: {
      flex: 1,
    },
    button: {
      width: "100%",
      padding: "14px",
      background: "#1D4ED8",
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif",
      marginTop: "8px",
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
    error: {
      background: "#FEE2E2",
      color: "#DC2626",
      padding: "12px 16px",
      borderRadius: "12px",
      marginBottom: "16px",
      fontSize: "14px",
    },
    success: {
      background: "#DCFCE7",
      color: "#16A34A",
      padding: "12px 16px",
      borderRadius: "12px",
      marginBottom: "16px",
      fontSize: "14px",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 style={styles.title}>Create Booking</h1>
        <div style={styles.card}>
          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Resource Name</label>
              <input
                style={styles.input}
                type="text"
                name="resourceName"
                value={form.resourceName}
                onChange={handleChange}
                placeholder="e.g. Room A101, Projector P1"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Resource Type</label>
              <select
                style={styles.select}
                name="resourceType"
                value={form.resourceType}
                onChange={handleChange}
                required
              >
                {resourceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Booking Date</label>
              <input
                style={styles.input}
                type="date"
                name="bookingDate"
                value={form.bookingDate}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.row}>
              <div style={{ ...styles.formGroup, ...styles.half }}>
                <label style={styles.label}>Start Time</label>
                <input
                  style={styles.input}
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={{ ...styles.formGroup, ...styles.half }}>
                <label style={styles.label}>End Time</label>
                <input
                  style={styles.input}
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Purpose</label>
              <textarea
                style={styles.textarea}
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                placeholder="Describe the purpose of your booking"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Expected Attendees (optional)</label>
              <input
                style={styles.input}
                type="number"
                name="expectedAttendees"
                value={form.expectedAttendees}
                onChange={handleChange}
                placeholder="e.g. 30"
              />
            </div>

            <button
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
              }}
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Booking"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBookingPage;