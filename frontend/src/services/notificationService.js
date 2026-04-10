import axiosInstance from '../api/axiosInstance';

const notificationService = {

    // Get all notifications
    getMyNotifications: async () => {
        const response = await axiosInstance.get('/notifications');
        return response;
    },

    getAll: async () => {
        const response = await axiosInstance.get('/notifications');
        return response.data;
    },

    // Get unread notifications
    getUnreadNotifications: async () => {
        const response = await axiosInstance.get(
            '/notifications/unread');
        return response;
    },

    // Get unread count
    getUnreadCount: async () => {
        const response = await axiosInstance.get(
            '/notifications/unread/count');
        return response.data.count;
    },

    // Mark single notification as read
    markAsRead: async (id) => {
        const response = await axiosInstance.patch(
            `/notifications/${id}/read`);
        return response.data;
    },

    // Mark all as read
    markAllAsRead: async () => {
        await axiosInstance.patch('/notifications/read-all');
    },

    // Delete notification
    deleteNotification: async (id) => {
        await axiosInstance.delete(`/notifications/${id}`);
    },
};

export default notificationService;