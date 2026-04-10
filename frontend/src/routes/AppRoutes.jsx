import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import OAuthCallback from "../pages/auth/OAuthCallback";
import ProtectedRoute from "./ProtectedRoute";
import NotificationsPage from "../pages/notifications/NotificationsPage";
import UserRoleManagementPage from "../pages/admin/UserRoleManagementPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import DashboardPage from "../pages/dashboard/DashboardPage";
import CreateBookingPage from "../pages/bookings/CreateBookingPage";
import MyBookingsPage from "../pages/bookings/MyBookingsPage";
import AdminBookingsPage from "../pages/bookings/AdminBookingsPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/auth/callback" element={<OAuthCallback />} />

      {/* Dashboard — role-based router */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={["USER", "ADMIN", "TECHNICIAN"]}>
          <DashboardPage />
        </ProtectedRoute>
      } />

      {/* Admin only */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/notifications" element={
        <ProtectedRoute allowedRoles={["USER", "ADMIN", "TECHNICIAN"]}>
          <NotificationsPage />
        </ProtectedRoute>
      } />

      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <UserRoleManagementPage />
        </ProtectedRoute>
      } />

      {/* Booking Routes */}
      <Route path="/bookings/create" element={
        <ProtectedRoute allowedRoles={["USER", "ADMIN", "TECHNICIAN"]}>
          <CreateBookingPage />
        </ProtectedRoute>
      } />

      <Route path="/bookings/my" element={
        <ProtectedRoute allowedRoles={["USER", "ADMIN", "TECHNICIAN"]}>
          <MyBookingsPage />
        </ProtectedRoute>
      } />

      <Route path="/admin/bookings" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminBookingsPage />
        </ProtectedRoute>
      } />

      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
};

export default AppRoutes;