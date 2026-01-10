import api from './config';

/**
 * Servicio para panel administrativo
 */
const adminService = {
    /**
     * Obtener lista de usuarios suspendidos
     */
    getSuspendedUsers: async (params = {}) => {
        const response = await api.get('/admin/suspended-users', { params });
        return response.data;
    },

    /**
     * Levantar suspensión de un usuario
     */
    liftSuspension: async (userId, motivo) => {
        const response = await api.post(`/admin/users/${userId}/lift-suspension`, { motivo });
        return response.data;
    },

    /**
     * Obtener historial de reportes de un usuario
     */
    getUserReportsHistory: async (userId) => {
        const response = await api.get(`/admin/users/${userId}/reports-history`);
        return response.data;
    },

    /**
     * Obtener todos los tickets (moderadores)
     */
    getAllTickets: async (params = {}) => {
        const response = await api.get('/admin/tickets', { params });
        return response.data;
    },

    /**
     * Resolver o rechazar un ticket
     */
    resolveTicket: async (ticketId, resolutionData) => {
        const response = await api.post(`/admin/tickets/${ticketId}/resolve`, resolutionData);
        return response.data;
    },

    /**
     * Obtener logs de auditoría
     */
    getAuditLogs: async (params = {}) => {
        const response = await api.get('/admin/audit-logs', { params });
        return response.data;
    }
};

export default adminService;
