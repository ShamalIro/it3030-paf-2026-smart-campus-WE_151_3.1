import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import facilityService from "../../services/facilityService";
import NotificationBell from "../../components/notifications/NotificationBell";

export default function FacilitiesPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    facilityService.getAll()
      .then(res => setFacilities(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const statusBadge = (status) => ({
    background: status === "ACTIVE" ? "#D1FAE5" : "#FEE2E2",
    color: status === "ACTIVE" ? "#065F46" : "#DC2626",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  });

  const typeBadge = () => ({
    background: "#DBEAFE",
    color: "#1D4ED8",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  });

  const filtered = facilities.filter(f => {
    const matchSearch =
      f.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.location?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType ? f.type === filterType : true;
    return matchSearch && matchType;
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "DM Sans, Segoe UI, sans-serif", background: "#F0F4FF" }}>

      {/* Sidebar */}
      <aside style={{ width: "240px", background: "#fff", borderRight: "1px solid #E2E8F0", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "24px 20px", borderBottom: "1px solid #E2E8F0" }}>
          <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700" }}>S</div>
          <span style={{ fontWeight: "700", fontSize: "16px", color: "#1E293B" }}>SCOH</span>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#64748B", background: "transparent", border: "none", width: "100%", textAlign: "left" }}>
            🏠 Dashboard
          </button>
          <button
            onClick={() => navigate("/facilities")}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "600", color: "#1D4ED8", background: "#EFF6FF", border: "none", width: "100%", textAlign: "left" }}>
            🏛️ Facilities
          </button>
          <button
            onClick={() => navigate("/notifications")}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#64748B", background: "transparent", border: "none", width: "100%", textAlign: "left" }}>
            🔔 Notifications
          </button>
          {user?.role === "ADMIN" && (
            <button
              onClick={() => navigate("/admin/facilities")}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "#64748B", background: "transparent", border: "none", width: "100%", textAlign: "left" }}>
              ⚙️ Manage Facilities
            </button>
          )}
        </nav>

        <div style={{ padding: "16px", borderTop: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "700", fontSize: "13px" }}>
            {getInitials(user?.name)}
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#1E293B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
            <div style={{ fontSize: "11px", color: "#94A3B8" }}>{user?.role}</div>
          </div>
          <button onClick={logout} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "18px" }}>↪</button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: "240px", flex: 1 }}>

        {/* Navbar */}
        <header style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
          <span style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B" }}>Facilities & Assets</span>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "8px 16px", width: "220px" }}>
              <span style={{ color: "#94A3B8" }}>🔍</span>
              <input
                style={{ border: "none", background: "transparent", outline: "none", fontSize: "14px", color: "#1E293B", width: "100%" }}
                placeholder="Search facilities..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <NotificationBell />
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: "32px" }}>
          <div style={{ marginBottom: "28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1E293B", margin: 0 }}>Facilities & Assets</h1>
              <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>Browse all available campus resources.</p>
            </div>

            {/* Filter */}
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              style={{ border: "1px solid #E2E8F0", borderRadius: "10px", padding: "8px 16px", fontSize: "14px", color: "#1E293B", background: "#fff", cursor: "pointer", outline: "none" }}>
              <option value="">All Types</option>
              <option value="LECTURE_HALL">Lecture Hall</option>
              <option value="LAB">Lab</option>
              <option value="MEETING_ROOM">Meeting Room</option>
              <option value="EQUIPMENT">Equipment</option>
            </select>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "28px" }}>
            {[
              { label: "Total", value: facilities.length, icon: "🏛️", bg: "#EFF6FF" },
              { label: "Active", value: facilities.filter(f => f.status === "ACTIVE").length, icon: "✅", bg: "#D1FAE5" },
              { label: "Out of Service", value: facilities.filter(f => f.status === "OUT_OF_SERVICE").length, icon: "🔧", bg: "#FEE2E2" },
              { label: "Equipment", value: facilities.filter(f => f.type === "EQUIPMENT").length, icon: "📦", bg: "#FEF9C3" },
            ].map((stat, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>{stat.icon}</div>
                <div>
                  <div style={{ fontSize: "13px", color: "#64748B", fontWeight: "500" }}>{stat.label}</div>
                  <div style={{ fontSize: "28px", fontWeight: "700", color: "#1E293B" }}>{stat.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Facilities Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#94A3B8" }}>Loading facilities...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#94A3B8" }}>No facilities found.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
              {filtered.map(f => (
                <div key={f.id} style={{ background: "#fff", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>

                  {/* Type + Status badges */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={typeBadge()}>{f.type?.replace(/_/g, " ")}</span>
                    <span style={statusBadge(f.status)}>{f.status}</span>
                  </div>

                  {/* Name */}
                  <div style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B" }}>{f.name}</div>

                  {/* Details */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ fontSize: "13px", color: "#64748B" }}>📍 {f.location}</div>
                    <div style={{ fontSize: "13px", color: "#64748B" }}>👥 Capacity: {f.capacity}</div>
                    <div style={{ fontSize: "13px", color: "#64748B" }}>🕐 {f.availabilityWindows}</div>
                  </div>

                  {/* ✅ Book Now Button */}
                  <div style={{ marginTop: "8px", paddingTop: "12px", borderTop: "1px solid #E2E8F0" }}>
                    <button
                      onClick={() => {
                        if (f.status === "ACTIVE") {
                          navigate(`/bookings/new?facilityId=${f.id}&facilityName=${encodeURIComponent(f.name)}`);
                        }
                      }}
                      disabled={f.status !== "ACTIVE"}
                      style={{
                        width: "100%",
                        padding: "10px",
                        background: f.status === "ACTIVE"
                          ? "linear-gradient(135deg, #1D4ED8, #3B82F6)"
                          : "#E2E8F0",
                        color: f.status === "ACTIVE" ? "#fff" : "#94A3B8",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: f.status === "ACTIVE" ? "pointer" : "not-allowed",
                      }}>
                      {f.status === "ACTIVE" ? "📅 Book Now" : "🔧 Out of Service"}
                    </button>
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