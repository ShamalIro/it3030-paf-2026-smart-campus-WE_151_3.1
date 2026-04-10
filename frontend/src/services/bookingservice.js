import axiosInstance from '../api/axiosInstance';

const bookingService = {
    createBooking: (data) => axiosInstance.post('/bookings', data),
    getMyBookings: () => axiosInstance.get('/bookings/my'),
    getAllBookings: (status) => {
        const params = status ? { status } : {};
        return axiosInstance.get('/admin/bookings', { params });
    },
    approveBooking: (id, remarks) => axiosInstance.patch(`/admin/bookings/${id}/approve`, { remarks }),
    rejectBooking: (id, remarks) => axiosInstance.patch(`/admin/bookings/${id}/reject`, { remarks }),
    cancelBooking: (id) => axiosInstance.patch(`/bookings/${id}/cancel`),
    deleteBooking: (id) => axiosInstance.delete(`/admin/bookings/${id}`),
};

export default bookingService;