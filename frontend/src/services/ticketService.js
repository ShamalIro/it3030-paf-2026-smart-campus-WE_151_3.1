import axiosInstance from '../api/axiosInstance';

const ticketService = {

    // ─── TICKET CRUD ──────────────────────────────────────────────────

    // Create a new ticket
    createTicket: async (ticketData) => {
        const response = await axiosInstance.post('/tickets', ticketData);
        return response.data;
    },

    // Get current user's tickets
    getMyTickets: async () => {
        const response = await axiosInstance.get('/tickets/my');
        return response.data;
    },

    // Get all tickets (Admin only)
    getAllTickets: async () => {
        const response = await axiosInstance.get('/tickets');
        return response.data;
    },

    // Get assigned tickets (Technician only)
    getAssignedTickets: async () => {
        const response = await axiosInstance.get('/tickets/assigned');
        return response.data;
    },

    // Get ticket by ID
    getTicketById: async (id) => {
        const response = await axiosInstance.get(`/tickets/${id}`);
        return response.data;
    },

    // ─── ADMIN ACTIONS ───────────────────────────────────────────────

    // Assign technician to ticket
    assignTechnician: async (ticketId, technicianId) => {
        const response = await axiosInstance.put(`/tickets/${ticketId}/assign`, { technicianId });
        return response.data;
    },

    // Reject ticket with reason
    rejectTicket: async (ticketId, reason) => {
        const response = await axiosInstance.put(`/tickets/${ticketId}/reject`, { reason });
        return response.data;
    },

    // Get all technicians (for assignment dropdown)
    getTechnicians: async () => {
        const response = await axiosInstance.get('/tickets/technicians');
        return response.data;
    },

    // ─── TECHNICIAN ACTIONS ──────────────────────────────────────────

    // Update ticket status
    updateStatus: async (ticketId, status) => {
        const response = await axiosInstance.put(`/tickets/${ticketId}/status`, { status });
        return response.data;
    },

    // Resolve ticket with notes
    resolveTicket: async (ticketId, resolutionNotes) => {
        const response = await axiosInstance.put(`/tickets/${ticketId}/resolve`, { resolutionNotes });
        return response.data;
    },

    // ─── ATTACHMENTS ─────────────────────────────────────────────────

    // Upload images to a ticket
    uploadImages: async (ticketId, files) => {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        const response = await axiosInstance.post(`/tickets/${ticketId}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Get attachments for a ticket
    getAttachments: async (ticketId) => {
        const response = await axiosInstance.get(`/tickets/${ticketId}/attachments`);
        return response.data;
    },

    // ─── COMMENTS ────────────────────────────────────────────────────

    // Add a comment
    addComment: async (ticketId, content) => {
        const response = await axiosInstance.post(`/tickets/${ticketId}/comments`, { content });
        return response.data;
    },

    // Get comments for a ticket
    getComments: async (ticketId) => {
        const response = await axiosInstance.get(`/tickets/${ticketId}/comments`);
        return response.data;
    },

    // Delete a comment
    deleteComment: async (commentId) => {
        await axiosInstance.delete(`/tickets/comments/${commentId}`);
    },

    // Update a comment
    updateComment: async (commentId, content) => {
        const response = await axiosInstance.put(`/tickets/comments/${commentId}`, { content });
        return response.data;
    },
};

export default ticketService;
