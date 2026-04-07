import axiosInstance from '../api/axiosInstance';

const notificationService = {

    // Get all notifications
    getAll: async () => {
        const response = await axiosInstance.get('/api/notifications');
        return response.data;
    },

    // Get unread notifications
    getUnread: async () => {
        const response = await axiosInstance.get(
            '/api/notifications/unread');
        return response.data;
    },

    // Get unread count
    getUnreadCount: async () => {
        const response = await axiosInstance.get(
            '/api/notifications/unread/count');
        return response.data.count;
    },

    // Mark single notification as read
    markAsRead: async (id) => {
        const response = await axiosInstance.patch(
            `/api/notifications/${id}/read`);
        return response.data;
    },

    // Mark all as read
    markAllAsRead: async () => {
        await axiosInstance.patch('/api/notifications/read-all');
    },

    // Delete notification
    delete: async (id) => {
        await axiosInstance.delete(`/api/notifications/${id}`);
    },
};

export default notificationService;