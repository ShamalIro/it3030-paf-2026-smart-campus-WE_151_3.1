import axiosInstance from "../api/axiosInstance";

const bookingService = {

  // Create booking
  create: (data) =>
    axiosInstance.post("/bookings", data),

  // Get my bookings
  getMyBookings: () =>
    axiosInstance.get("/bookings/my"),

  // Get all bookings - ADMIN
  getAll: () =>
    axiosInstance.get("/bookings"),

  // Approve - ADMIN
  approve: (id) =>
    axiosInstance.patch(`/bookings/${id}/approve`),

  // Reject - ADMIN
  reject: (id, reason) =>
    axiosInstance.patch(`/bookings/${id}/reject`, { reason }),

  // Cancel - USER
  cancel: (id) =>
    axiosInstance.patch(`/bookings/${id}/cancel`),
};

export default bookingService;