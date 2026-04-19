import { useAuth } from "../../context/AuthContext";
import AdminDashboard from "../admin/AdminDashboard";
import UserDashboard from "./UserDashboard";
import TechnicianDashboard from "../tickets/TechnicianDashboard";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", fontFamily: "DM Sans, Segoe UI, sans-serif",
        fontSize: "16px", color: "#64748B"
      }}>
        Loading...
      </div>
    );
  }

  if (user?.role === "ADMIN") {
    return <AdminDashboard />;
  }

  if (user?.role === "TECHNICIAN") {
    return <TechnicianDashboard />;
  }

  return <UserDashboard />;
}