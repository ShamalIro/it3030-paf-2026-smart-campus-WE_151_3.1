import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import NotificationBell from "../../components/notifications/NotificationBell";

const UserRoleManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const ROLES = ["USER", "ADMIN", "TECHNICIAN"];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    setError("");
    setSuccessMsg("");
    try {
      await axiosInstance.patch(`/admin/users/${userId}/role`, { role: newRole });
      setSuccessMsg("Role updated successfully.");
      fetchUsers();
    } catch (err) {
      setError("Failed to update role.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setDeletingId(userId);
    setError("");
    setSuccessMsg("");
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      setSuccessMsg("User deleted successfully.");
      fetchUsers();
    } catch (err) {
      setError("Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh",
                  backgroundColor: "#f5f5f5" }}>
      {/* Navbar */}
      <div style={{ backgroundColor: "#4285F4", color: "white",
                    padding: "12px 24px", display: "flex",
                    justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Smart Campus Operations Hub</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <NotificationBell />
          <span>👤 {user?.name}</span>
          <button onClick={() => navigate("/notifications")}
            style={{ backgroundColor: "white", color: "#4285F4",
                     border: "none", padding: "6px 12px",
                     borderRadius: "4px", cursor: "pointer" }}>
            Notifications
          </button>
          <button onClick={logout}
            style={{ backgroundColor: "white", color: "#4285F4",
                     border: "none", padding: "6px 12px",
                     borderRadius: "4px", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "900px", margin: "32px auto", padding: "0 16px" }}>
        <h2 style={{ marginBottom: "16px" }}>User Role Management</h2>

        {/* Messages */}
        {error && (
          <div style={{ backgroundColor: "#ffe0e0", color: "#c00",
                        padding: "10px 16px", borderRadius: "6px",
                        marginBottom: "16px" }}>
            {error}
          </div>
        )}
        {successMsg && (
          <div style={{ backgroundColor: "#e0ffe0", color: "#080",
                        padding: "10px 16px", borderRadius: "6px",
                        marginBottom: "16px" }}>
            {successMsg}
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>Loading users...</div>
        ) : (
          <div style={{ backgroundColor: "white", borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#4285F4", color: "white" }}>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Current Role</th>
                  <th style={thStyle}>Change Role</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, index) => (
                  <tr key={u.id}
                    style={{ backgroundColor: index % 2 === 0 ? "white" : "#f9f9f9" }}>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {u.profilePicture && (
                          <img src={u.profilePicture} alt="avatar"
                            style={{ width: "32px", height: "32px",
                                     borderRadius: "50%" }} />
                        )}
                        {u.name}
                      </div>
                    </td>
                    <td style={tdStyle}>{u.email}</td>
                    <td style={tdStyle}>
                      <span style={{
                        backgroundColor: roleColor(u.role),
                        color: "white", padding: "3px 10px",
                        borderRadius: "12px", fontSize: "12px"
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <select
                        defaultValue={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={updatingId === u.id}
                        style={{ padding: "6px 10px", borderRadius: "4px",
                                 border: "1px solid #ddd", cursor: "pointer" }}>
                        {ROLES.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                      {updatingId === u.id && (
                        <span style={{ marginLeft: "8px", fontSize: "12px",
                                       color: "#888" }}>Saving...</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => handleDelete(u.id)}
                        disabled={deletingId === u.id || u.email === user?.email}
                        style={{
                          backgroundColor: u.email === user?.email ? "#ccc" : "#e53935",
                          color: "white", border: "none",
                          padding: "6px 12px", borderRadius: "4px",
                          cursor: u.email === user?.email ? "not-allowed" : "pointer"
                        }}>
                        {deletingId === u.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const thStyle = {
  padding: "12px 16px",
  textAlign: "left",
  fontWeight: "600",
  fontSize: "14px"
};

const tdStyle = {
  padding: "12px 16px",
  fontSize: "14px",
  borderBottom: "1px solid #f0f0f0"
};

const roleColor = (role) => {
  switch (role) {
    case "ADMIN": return "#e53935";
    case "TECHNICIAN": return "#fb8c00";
    default: return "#43a047";
  }
};

export default UserRoleManagementPage;