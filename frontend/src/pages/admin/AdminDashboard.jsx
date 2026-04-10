import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../../components/notifications/NotificationBell";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    setUpdatingId(id);
    try {
      await axiosInstance.patch(`/admin/users/${id}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
      showSuccess("Role updated successfully.");
    } catch (err) {
      setError("Failed to update role.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setDeletingId(id);
    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showSuccess("User deleted successfully.");
    } catch (err) {
      setError("Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const techCount = users.filter((u) => u.role === "TECHNICIAN").length;
  const userCount = users.filter((u) => u.role === "USER").length;

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const roleBadge = (role) => {
    const map = {
      ADMIN: { bg: "#FEE2E2", color: "#DC2626" },
      TECHNICIAN: { bg: "#D1FAE5", color: "#065F46" },
      USER: { bg: "#DBEAFE", color: "#1D4ED8" },
    };
    const style = map[role] || map["USER"];
    return {
      background: style.bg,
      color: style.color,
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
    };
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const s = {
    wrapper: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: "DM Sans, Segoe UI, sans-serif",
      background: "#F0F4FF",
    },
    sidebar: {
      width: "240px",
      minHeight: "100vh",
      background: "#fff",
      borderRight: "1px solid #E2E8F0",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 100,
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "24px 20px",
      borderBottom: "1px solid #E2E8F0",
    },
    logoIcon: {
      width: "36px",
      height: "36px",
      background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: "700",
      fontSize: "16px",
    },
    logoText: {
      fontWeight: "700",
      fontSize: "16px",
      color: "#1E293B",
    },
    nav: {
      flex: 1,
      padding: "16px 12px",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    navItem: (active) => ({
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px 12px",
      borderRadius: "10px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: active ? "600" : "500",
      color: active ? "#1D4ED8" : "#64748B",
      background: active ? "#EFF6FF" : "transparent",
      border: "none",
      width: "100%",
      textAlign: "left",
      transition: "all 0.15s",
    }),
    sidebarFooter: {
      padding: "16px",
      borderTop: "1px solid #E2E8F0",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    avatar: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: "700",
      fontSize: "13px",
      flexShrink: 0,
    },
    footerInfo: {
      flex: 1,
      overflow: "hidden",
    },
    footerName: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#1E293B",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    footerRole: {
      fontSize: "11px",
      color: "#94A3B8",
    },
    logoutBtn: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#94A3B8",
      fontSize: "18px",
      padding: "4px",
      borderRadius: "6px",
    },
    main: {
      marginLeft: "240px",
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    navbar: {
      background: "#fff",
      borderBottom: "1px solid #E2E8F0",
      padding: "0 32px",
      height: "64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 50,
    },
    navbarTitle: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#1E293B",
    },
    searchBar: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      background: "#F8FAFC",
      border: "1px solid #E2E8F0",
      borderRadius: "10px",
      padding: "8px 16px",
      width: "260px",
    },
    searchInput: {
      border: "none",
      background: "transparent",
      outline: "none",
      fontSize: "14px",
      color: "#1E293B",
      width: "100%",
    },
    content: {
      padding: "32px",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "20px",
      marginBottom: "28px",
    },
    statCard: () => ({
      background: "#fff",
      borderRadius: "16px",
      border: "1px solid #E2E8F0",
      padding: "20px 24px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
    }),
    statIcon: (bg) => ({
      width: "48px",
      height: "48px",
      borderRadius: "12px",
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "22px",
      flexShrink: 0,
    }),
    statLabel: {
      fontSize: "13px",
      color: "#64748B",
      fontWeight: "500",
    },
    statValue: {
      fontSize: "28px",
      fontWeight: "700",
      color: "#1E293B",
      lineHeight: 1.1,
    },
    tableCard: {
      background: "#fff",
      borderRadius: "20px",
      border: "1px solid #E2E8F0",
      overflow: "hidden",
    },
    tableHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px 24px",
      borderBottom: "1px solid #E2E8F0",
    },
    tableTitle: {
      fontSize: "16px",
      fontWeight: "700",
      color: "#1E293B",
    },
    tableCount: {
      fontSize: "13px",
      color: "#64748B",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      padding: "12px 24px",
      textAlign: "left",
      fontSize: "12px",
      fontWeight: "600",
      color: "#94A3B8",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      background: "#F8FAFC",
      borderBottom: "1px solid #E2E8F0",
    },
    td: {
      padding: "16px 24px",
      borderBottom: "1px solid #F1F5F9",
      fontSize: "14px",
      color: "#1E293B",
      verticalAlign: "middle",
    },
    userCell: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    tableAvatar: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: "700",
      fontSize: "12px",
      flexShrink: 0,
    },
    userName: {
      fontWeight: "600",
      color: "#1E293B",
    },
    userEmail: {
      fontSize: "12px",
      color: "#94A3B8",
    },
    roleSelect: {
      border: "1px solid #E2E8F0",
      borderRadius: "8px",
      padding: "6px 10px",
      fontSize: "13px",
      fontWeight: "600",
      color: "#1D4ED8",
      background: "#F8FAFC",
      cursor: "pointer",
      outline: "none",
    },
    deleteBtn: {
      background: "#FEF2F2",
      color: "#DC2626",
      border: "1px solid #FECACA",
      borderRadius: "8px",
      padding: "6px 14px",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
    },
    emptyState: {
      padding: "60px",
      textAlign: "center",
      color: "#94A3B8",
      fontSize: "15px",
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
    <div style={s.wrapper}>

      {/* ── Sidebar ── */}
      <aside style={s.sidebar}>
        <div style={s.logo}>
          <div style={s.logoIcon}>S</div>
          <span style={s.logoText}>SCOH</span>
        </div>

        <nav style={s.nav}>

          {/* Dashboard */}
          <button
            style={s.navItem(true)}
            onClick={() => navigate("/dashboard")}
          >
            🏠 <span>Dashboard</span>
          </button>

          {/* ✅ Facilities */}
          <button
            style={s.navItem(false)}
            onClick={() => navigate("/facilities")}
          >
            🏛️ <span>Facilities</span>
          </button>

          {/* ✅ Manage Facilities */}
          <button
            style={s.navItem(false)}
            onClick={() => navigate("/admin/facilities")}
          >
            ⚙️ <span>Manage Facilities</span>
          </button>

          {/* Notifications */}
          <button
            style={s.navItem(false)}
            onClick={() => navigate("/notifications")}
          >
            🔔 <span>Notifications</span>
          </button>

          {/* Users Admin */}
          <button
            style={s.navItem(false)}
            onClick={() => navigate("/admin/users")}
          >
            👥 <span>Users (Admin)</span>
          </button>

        </nav>

        <div style={s.sidebarFooter}>
          <div style={s.avatar}>{getInitials(user?.name)}</div>
          <div style={s.footerInfo}>
            <div style={s.footerName}>{user?.name || "Admin"}</div>
            <div style={s.footerRole}>{user?.role}</div>
          </div>
          <button style={s.logoutBtn} onClick={logout} title="Logout">
            ↪
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={s.main}>

        {/* Navbar */}
        <header style={s.navbar}>
          <span style={s.navbarTitle}>Admin Dashboard</span>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={s.searchBar}>
              <span style={{ color: "#94A3B8" }}>🔍</span>
              <input
                style={s.searchInput}
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <NotificationBell />
          </div>
        </header>

        {/* Content */}
        <div style={s.content}>

          {/* Page Header */}
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1E293B", margin: 0 }}>
              Dashboard Overview
            </h1>
            <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>
              Welcome back, {user?.name}. Manage users and roles here.
            </p>
          </div>

          {/* Alerts */}
          {successMsg && <div style={s.alert("success")}>{successMsg}</div>}
          {error && <div style={s.alert("error")}>{error}</div>}

          {/* Stat Cards */}
          <div style={s.statsGrid}>
            <div style={s.statCard()}>
              <div style={s.statIcon("#EFF6FF")}>👥</div>
              <div>
                <div style={s.statLabel}>Total Users</div>
                <div style={s.statValue}>{totalUsers}</div>
              </div>
            </div>
            <div style={s.statCard()}>
              <div style={s.statIcon("#FEE2E2")}>🛡️</div>
              <div>
                <div style={s.statLabel}>Admins</div>
                <div style={s.statValue}>{adminCount}</div>
              </div>
            </div>
            <div style={s.statCard()}>
              <div style={s.statIcon("#D1FAE5")}>🔧</div>
              <div>
                <div style={s.statLabel}>Technicians</div>
                <div style={s.statValue}>{techCount}</div>
              </div>
            </div>
            <div style={s.statCard()}>
              <div style={s.statIcon("#FEF9C3")}>🎓</div>
              <div>
                <div style={s.statLabel}>Regular Users</div>
                <div style={s.statValue}>{userCount}</div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div style={s.tableCard}>
            <div style={s.tableHeader}>
              <span style={s.tableTitle}>User Management</span>
              <span style={s.tableCount}>
                {filtered.length} of {totalUsers} users
              </span>
            </div>

            {loading ? (
              <div style={s.emptyState}>Loading users...</div>
            ) : filtered.length === 0 ? (
              <div style={s.emptyState}>No users found.</div>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>User</th>
                    <th style={s.th}>Role</th>
                    <th style={s.th}>Change Role</th>
                    <th style={s.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id}>
                      <td style={s.td}>
                        <div style={s.userCell}>
                          <div style={s.tableAvatar}>{getInitials(u.name)}</div>
                          <div>
                            <div style={s.userName}>{u.name}</div>
                            <div style={s.userEmail}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={s.td}>
                        <span style={roleBadge(u.role)}>{u.role}</span>
                      </td>
                      <td style={s.td}>
                        <select
                          style={s.roleSelect}
                          value={u.role}
                          disabled={updatingId === u.id || u.id === user?.id}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                          <option value="TECHNICIAN">TECHNICIAN</option>
                        </select>
                      </td>
                      <td style={s.td}>
                        <button
                          style={{
                            ...s.deleteBtn,
                            opacity: deletingId === u.id || u.id === user?.id ? 0.5 : 1,
                            cursor: u.id === user?.id ? "not-allowed" : "pointer",
                          }}
                          disabled={deletingId === u.id || u.id === user?.id}
                          onClick={() => handleDelete(u.id)}
                          title={u.id === user?.id ? "Cannot delete yourself" : "Delete user"}
                        >
                          {deletingId === u.id ? "Deleting..." : "🗑 Delete"}
                        </button>
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