import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ticketService from "../../services/ticketService";

const CATEGORIES = [
  "ELECTRICAL", "PLUMBING", "HVAC", "IT_NETWORK",
  "CLEANING", "SECURITY", "FURNITURE", "OTHER"
];

const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

export default function CreateTicket() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    location: "",
    resourceId: "",
    category: "OTHER",
    description: "",
    priority: "MEDIUM",
    contactPhone: "",
    contactEmail: user?.email || "",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "contactPhone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setForm({ ...form, contactPhone: digitsOnly });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length > 3) {
      setError("Maximum 3 images allowed");
      return;
    }
    setFiles(selected);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!form.location || !form.description) {
        setError("Location and description are required");
        setLoading(false);
        return;
      }

      if (!/^\d{10}$/.test(form.contactPhone)) {
        setError("Contact phone must be exactly 10 digits");
        setLoading(false);
        return;
      }

      // Create ticket
      const ticket = await ticketService.createTicket(form);

      // Upload files if any
      if (files.length > 0) {
        await ticketService.uploadImages(ticket.id, files);
      }

      setSuccess("Ticket created successfully!");
      setTimeout(() => navigate("/tickets/my"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  const isPhoneValid = /^\d{10}$/.test(form.contactPhone);

  const priorityColor = (p) => {
    if (p === "HIGH") return { bg: "#FEE2E2", color: "#DC2626" };
    if (p === "MEDIUM") return { bg: "#FEF3C7", color: "#D97706" };
    return { bg: "#D1FAE5", color: "#065F46" };
  };

  // ─── Styles ────────────────────────────────────────────────────
  const s = {
    page: {
      minHeight: "100vh",
      background: "#F0F4FF",
      fontFamily: "DM Sans, Segoe UI, sans-serif",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "40px 20px",
    },
    card: {
      background: "#fff",
      borderRadius: "20px",
      border: "1px solid #E2E8F0",
      width: "100%",
      maxWidth: "720px",
      overflow: "hidden",
    },
    header: {
      padding: "28px 32px",
      borderBottom: "1px solid #E2E8F0",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontSize: "22px",
      fontWeight: "700",
      color: "#1E293B",
      margin: 0,
    },
    backBtn: {
      background: "#F1F5F9",
      border: "none",
      borderRadius: "10px",
      padding: "8px 16px",
      fontSize: "13px",
      fontWeight: "600",
      color: "#64748B",
      cursor: "pointer",
    },
    body: {
      padding: "28px 32px",
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
    },
    field: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    fieldFull: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      gridColumn: "1 / -1",
    },
    label: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#475569",
    },
    input: {
      padding: "10px 14px",
      borderRadius: "10px",
      border: "1px solid #E2E8F0",
      fontSize: "14px",
      color: "#1E293B",
      outline: "none",
      background: "#F8FAFC",
      transition: "border 0.2s",
    },
    select: {
      padding: "10px 14px",
      borderRadius: "10px",
      border: "1px solid #E2E8F0",
      fontSize: "14px",
      color: "#1E293B",
      outline: "none",
      background: "#F8FAFC",
      cursor: "pointer",
    },
    textarea: {
      padding: "10px 14px",
      borderRadius: "10px",
      border: "1px solid #E2E8F0",
      fontSize: "14px",
      color: "#1E293B",
      outline: "none",
      background: "#F8FAFC",
      minHeight: "100px",
      resize: "vertical",
      fontFamily: "inherit",
    },
    fileInput: {
      padding: "10px 14px",
      borderRadius: "10px",
      border: "1px dashed #CBD5E1",
      fontSize: "13px",
      color: "#64748B",
      background: "#F8FAFC",
      cursor: "pointer",
    },
    priorityGroup: {
      display: "flex",
      gap: "8px",
    },
    priorityBtn: (p, selected) => ({
      flex: 1,
      padding: "10px",
      borderRadius: "10px",
      border: selected ? `2px solid ${priorityColor(p).color}` : "1px solid #E2E8F0",
      background: selected ? priorityColor(p).bg : "#F8FAFC",
      color: selected ? priorityColor(p).color : "#64748B",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
      textAlign: "center",
      transition: "all 0.2s",
    }),
    footer: {
      padding: "20px 32px",
      borderTop: "1px solid #E2E8F0",
      display: "flex",
      justifyContent: "flex-end",
      gap: "12px",
    },
    submitBtn: {
      background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      padding: "10px 28px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      opacity: loading ? 0.6 : 1,
    },
    cancelBtn: {
      background: "#F1F5F9",
      color: "#64748B",
      border: "none",
      borderRadius: "10px",
      padding: "10px 28px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
    },
    alert: (type) => ({
      padding: "12px 20px",
      borderRadius: "10px",
      fontSize: "14px",
      fontWeight: "500",
      marginBottom: "20px",
      background: type === "success" ? "#D1FAE5" : "#FEE2E2",
      color: type === "success" ? "#065F46" : "#DC2626",
      border: `1px solid ${type === "success" ? "#6EE7B7" : "#FECACA"}`,
    }),
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.header}>
          <h1 style={s.title}>🎫 Report an Incident</h1>
          <button style={s.backBtn} onClick={() => navigate("/tickets/my")}>
            ← Back to My Tickets
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={s.body}>
            {error && <div style={s.alert("error")}>{error}</div>}
            {success && <div style={s.alert("success")}>{success}</div>}

            <div style={s.formGrid}>
              {/* Location */}
              <div style={s.field}>
                <label style={s.label}>Location *</label>
                <input
                  style={s.input}
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g., Building A, Room 201"
                  required
                />
              </div>

              {/* Resource ID */}
              <div style={s.field}>
                <label style={s.label}>Resource / Asset ID</label>
                <input
                  style={s.input}
                  name="resourceId"
                  value={form.resourceId}
                  onChange={handleChange}
                  placeholder="e.g., AC-101, PRJ-005"
                />
              </div>

              {/* Category */}
              <div style={s.field}>
                <label style={s.label}>Category *</label>
                <select
                  style={s.select}
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c.replace("_", " ")}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div style={s.field}>
                <label style={s.label}>Priority *</label>
                <div style={s.priorityGroup}>
                  {PRIORITIES.map(p => (
                    <button
                      key={p}
                      type="button"
                      style={s.priorityBtn(p, form.priority === p)}
                      onClick={() => setForm({ ...form, priority: p })}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div style={s.fieldFull}>
                <label style={s.label}>Description *</label>
                <textarea
                  style={s.textarea}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the issue in detail..."
                  required
                />
              </div>

              {/* Contact Phone */}
              <div style={s.field}>
                <label style={s.label}>Contact Phone *</label>
                <input
                  style={s.input}
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                  placeholder="e.g., 0771234567"
                  inputMode="numeric"
                  maxLength={10}
                  required
                />
                {form.contactPhone.length > 0 && !isPhoneValid && (
                  <span style={{ fontSize: "12px", color: "#DC2626" }}>
                    Phone number must be exactly 10 digits.
                  </span>
                )}
              </div>

              {/* Contact Email */}
              <div style={s.field}>
                <label style={s.label}>Contact Email</label>
                <input
                  style={s.input}
                  name="contactEmail"
                  value={form.contactEmail}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  type="email"
                />
              </div>

              {/* File Upload */}
              <div style={s.fieldFull}>
                <label style={s.label}>Attachments (max 3 images)</label>
                <input
                  style={s.fileInput}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                />
                {files.length > 0 && (
                  <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>
                    {files.length} file(s) selected: {files.map(f => f.name).join(", ")}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={s.footer}>
            <button type="button" style={s.cancelBtn} onClick={() => navigate("/tickets/my")}>
              Cancel
            </button>
            <button type="submit" style={s.submitBtn} disabled={loading || !isPhoneValid}>
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
