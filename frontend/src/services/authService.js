import axiosInstance from '../api/axiosInstance';

const authService = {

    // Get current logged in user
    getCurrentUser: async () => {
        const response = await axiosInstance.get('/api/auth/me');
        return response.data;
    },

    // Save token to localStorage
    saveToken: (token) => {
        localStorage.setItem('token', token);
    },

    // Get token from localStorage
    getToken: () => {
        return localStorage.getItem('token');
    },

    // Remove token - logout
    logout: () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    },

    // Check if user is logged in
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Login with Google
    loginWithGoogle: () => {
        window.location.href = 
            'http://localhost:8080/oauth2/authorization/google';
    },

    // Get all users - Admin only
    getAllUsers: async () => {
        const response = await axiosInstance.get('/api/admin/users');
        return response.data;
    },

    // Update user role - Admin only
    updateUserRole: async (userId, role) => {
        const response = await axiosInstance.patch(
            `/api/admin/users/${userId}/role`,
            { role }
        );
        return response.data;
    },

    // Delete user - Admin only
    deleteUser: async (userId) => {
        await axiosInstance.delete(`/api/admin/users/${userId}`);
    },
};

export default authService;