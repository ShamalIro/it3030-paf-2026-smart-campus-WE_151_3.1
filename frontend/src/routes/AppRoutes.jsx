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
import FacilitiesPage from "../pages/facilities/FacilitiesPage";
import ManageFacilitiesPage from "../pages/facilities/ManageFacilitiesPage";
// ✅ Booking pages
import BookingsPage from "../pages/bookings/BookingsPage";
import NewBookingPage from "../pages/bookings/NewBookingPage";
import ManageBookingsPage from "../pages/admin/ManageBookingsPage";
// Ticket pages
import CreateTicket from "../pages/tickets/CreateTicket";
import MyTickets from "../pages/tickets/MyTickets";
import TicketDetails from "../pages/tickets/TicketDetails";
import AdminTickets from "../pages/tickets/AdminTickets";
import TechnicianDashboard from "../pages/tickets/TechnicianDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/auth/callback" element={<OAuthCallback />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={["USER", "ADMIN", "TECHNICIAN"]}>
          <DashboardPage />
        </ProtectedRoute>
      } />

      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* Notifications */}
      <Route path="/notifications" element={
        <ProtectedRoute allowedRoles={["USER", "ADMIN", "TECHNICIAN"]}>
          <NotificationsPage />
        </ProtectedRoute>
      } />

      {/* Users */}
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <UserRoleManagementPage />
        </ProtectedRoute>
      } />

      {/* Facilities */}
      <Route path="/facilities" element={
        <ProtectedRoute allowedRoles={["USER", "ADMIN", "TECHNICIAN"]}>
          <FacilitiesPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/facilities" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <ManageFacilitiesPage />
        </ProtectedRoute>
      } />

      {/* ✅ Bookings */}
      <Route path="/bookings" element={
        <ProtectedRoute allowedRoles={["USER", "ADMIN", "TECHNICIAN"]}>
          <BookingsPage />
        </ProtectedRoute>
      } />
      <Route path="/bookings/new" element={
        <ProtectedRoute allowedRoles={["USER", "ADMIN", "TECHNICIAN"]}>
          <NewBookingPage />
        </ProtectedRoute>
      } />
      <Route path="/admin/bookings" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <ManageBookingsPage />
        </ProtectedRoute>
      } />

      {/* Tickets */}
      <Route path="/tickets/create" element={
        <ProtectedRoute allowedRoles={["USER", "ADMIN", "TECHNICIAN"]}>
          <CreateTicket />
        </ProtectedRoute>
      } />
      <Route path="/tickets/my" element={
        <ProtectedRoute allowedRoles={["USER", "ADMIN", "TECHNICIAN"]}>
          <MyTickets />
        </ProtectedRoute>
      } />
      <Route path="/tickets/:id" element={
        <ProtectedRoute allowedRoles={["USER", "ADMIN", "TECHNICIAN"]}>
          <TicketDetails />
        </ProtectedRoute>
      } />
      <Route path="/admin/tickets" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminTickets />
        </ProtectedRoute>
      } />
      <Route path="/technician/dashboard" element={
        <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
          <TechnicianDashboard />
        </ProtectedRoute>
      } />

      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
};

export default AppRoutes;