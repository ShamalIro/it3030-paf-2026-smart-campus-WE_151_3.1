import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import facilityService from "../../services/facilityService";
import NotificationBell from "../../components/notifications/NotificationBell";

export default function ManageFacilitiesPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", type: "LECTURE_HALL", capacity: "",
    location: "", availabilityWindows: "", status: "ACTIVE"
  });

  useEffect(() => { fetchFacilities(); }, []);

  const fetchFacilities = async () => {
    try {
      const res = await facilityService.getAll();
      setFacilities(res.data);
    } catch { setError("Failed to load facilities."); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await facilityService.update(editingId, form);
        showSuccess("Facility updated!");
      } else {
        await facilityService.create(form);
        showSuccess("Facility created!");
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchFacilities();
    } catch { setError("Failed to save facility."); }
  };

  const handleEdit = (f) => {
    setForm({ name: f.name, type: f.type, capacity: f.capacity, location: f.location, availabilityWindows: f.availabilityWindows, status: f.status });
    setEditingId(f.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this facility?")) return;
    try {
      await facilityService.delete(id);
      setFacilities(prev => prev.filter(f => f.id !== id));
      showSuccess("Facility deleted!");
    } catch { setError("Failed to delete."); }
  };

  const resetForm = () => setForm({ name: "", type: "LECTURE_HALL", capacity: "", location: "", availabilityWindows: "", status: "ACTIVE" });
  const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(""), 3000); };
  const getInitials = (name) => name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  const inputStyle = { width: "100%", padding: "10px 14px", border: "1px solid #E2E8F0", borderRadius: "10px", fontSize: "14px", outline: "none", boxSizing: "border-box" };
  const labelStyle = { fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px", display: "block" };

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
          <button onClick={() => navigate("/admin/facilities")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "600", color: "#1D4ED8", background: "#EFF6FF", border: "none", width: "100%", textAlign: "left" }}>⚙️ Manage Facilities</button>
          <button onClick={() => navigate("/notifications")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#64748B", background: "transparent", border: "none", width: "100%", textAlign: "left" }}>🔔 Notifications</button>
        </nav>
        <div style={{ padding: "16px", borderTop: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "13px" }}>{getInitials(user?.name)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#1E293B" }}>{user?.name}</div>
            <div style={{ fontSize: "11px", color: "#94A3B8" }}>{user?.role}</div>
          </div>
          <button onClick={logout} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "18px" }}>↪</button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: "240px", flex: 1 }}>
        <header style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B" }}>Manage Facilities</span>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button onClick={() => { resetForm(); setEditingId(null); setShowForm(true); }} style={{ background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>+ Add Facility</button>
            <NotificationBell />
          </div>
        </header>

        <div style={{ padding: "32px" }}>
          {successMsg && <div style={{ padding: "12px 20px", borderRadius: "10px", background: "#D1FAE5", color: "#065F46", border: "1px solid #6EE7B7", marginBottom: "20px", fontSize: "14px" }}>{successMsg}</div>}
          {error && <div style={{ padding: "12px 20px", borderRadius: "10px", background: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA", marginBottom: "20px", fontSize: "14px" }}>{error}</div>}

          {/* Add/Edit Form */}
          {showForm && (
            <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "28px", marginBottom: "28px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B", marginBottom: "20px" }}>{editingId ? "Edit Facility" : "Add New Facility"}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Alan Turing Lecture Hall" />
                </div>
                <div>
                  <label style={labelStyle}>Type</label>
                  <select style={inputStyle} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="LECTURE_HALL">Lecture Hall</option>
                    <option value="LAB">Lab</option>
                    <option value="MEETING_ROOM">Meeting Room</option>
                    <option value="EQUIPMENT">Equipment</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Capacity</label>
                  <input style={inputStyle} type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} placeholder="e.g. 100" />
                </div>
                <div>
                  <label style={labelStyle}>Location</label>
                  <input style={inputStyle} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Block A, Floor 1" />
                </div>
                <div>
                  <label style={labelStyle}>Availability</label>
                  <input style={inputStyle} value={form.availabilityWindows} onChange={e => setForm({ ...form, availabilityWindows: e.target.value })} placeholder="e.g. Mon-Fri 8AM-6PM" />
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select style={inputStyle} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="ACTIVE">Active</option>
                    <option value="OUT_OF_SERVICE">Out of Service</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button onClick={handleSubmit} style={{ background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                  {editingId ? "Update" : "Create"}
                </button>
                <button onClick={() => { setShowForm(false); setEditingId(null); resetForm(); }} style={{ background: "#F1F5F9", color: "#64748B", border: "none", borderRadius: "10px", padding: "10px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "16px", fontWeight: "700", color: "#1E293B" }}>All Facilities</span>
              <span style={{ fontSize: "13px", color: "#64748B" }}>{facilities.length} total</span>
            </div>
            {loading ? (
              <div style={{ padding: "60px", textAlign: "center", color: "#94A3B8" }}>Loading...</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Name", "Type", "Capacity", "Location", "Status", "Actions"].map(h => (
                      <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#94A3B8", textTransform: "uppercase", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {facilities.map(f => (
                    <tr key={f.id}>
                      <td style={{ padding: "16px 24px", borderBottom: "1px solid #F1F5F9", fontWeight: "600", color: "#1E293B" }}>{f.name}</td>
                      <td style={{ padding: "16px 24px", borderBottom: "1px solid #F1F5F9" }}>
                        <span style={{ background: "#DBEAFE", color: "#1D4ED8", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>{f.type?.replace("_", " ")}</span>
                      </td>
                      <td style={{ padding: "16px 24px", borderBottom: "1px solid #F1F5F9", color: "#64748B" }}>{f.capacity}</td>
                      <td style={{ padding: "16px 24px", borderBottom: "1px solid #F1F5F9", color: "#64748B" }}>{f.location}</td>
                      <td style={{ padding: "16px 24px", borderBottom: "1px solid #F1F5F9" }}>
                        <span style={{ background: f.status === "ACTIVE" ? "#D1FAE5" : "#FEE2E2", color: f.status === "ACTIVE" ? "#065F46" : "#DC2626", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>{f.status}</span>
                      </td>
                      <td style={{ padding: "16px 24px", borderBottom: "1px solid #F1F5F9" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => handleEdit(f)} style={{ background: "#EFF6FF", color: "#1D4ED8", border: "none", borderRadius: "8px", padding: "6px 14px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>✏️ Edit</button>
                          <button onClick={() => handleDelete(f.id)} style={{ background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: "8px", padding: "6px 14px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>🗑️ Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}