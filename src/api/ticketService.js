import api from './config';

/**
 * Servicio para gestión de tickets de soporte
 */
const ticketService = {
    /**
     * Crear un nuevo ticket
     */
    createTicket: async (ticketData) => {
        const response = await api.post('/tickets', ticketData);
        return response.data;
    },

    /**
     * Obtener tickets del usuario
     */
    getUserTickets: async (params = {}) => {
        const response = await api.get('/tickets', { params });
        return response.data;
    },

    /**
     * Obtener ticket por ID
     */
    getTicketById: async (ticketId) => {
        const response = await api.get(`/tickets/${ticketId}`);
        return response.data;
    },

    /**
     * Agregar respuesta a un ticket
     */
    addResponse: async (ticketId, responseData) => {
        const response = await api.post(`/tickets/${ticketId}/responses`, responseData);
        return response.data;
    }
};

export default ticketService;
