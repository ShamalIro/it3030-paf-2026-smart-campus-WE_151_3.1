import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import OAuthCallback from "../pages/auth/OAuthCallback";
import ProtectedRoute from "./ProtectedRoute";
import NotificationsPage from "../pages/notifications/NotificationsPage";
import UserRoleManagementPage from "../pages/admin/UserRoleManagementPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/auth/callback" element={<OAuthCallback />} />

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

      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
};

export default AppRoutes;