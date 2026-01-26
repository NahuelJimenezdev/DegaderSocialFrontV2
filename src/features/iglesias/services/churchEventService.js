import api from '../../../api/config';

const CHURCH_EVENTS_URL = '/iglesias'; // Base URL prefix usually handled by api interceptor or just appended

// Crear evento
export const createChurchEvent = async (iglesiaId, eventData) => {
    try {
        const response = await api.post(`/iglesias/${iglesiaId}/events`, eventData);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error creating church event:', error);
        return {
            success: false,
            error: error.response?.data?.message || error.response?.data?.error || 'Error al crear el evento'
        };
    }
};

// Obtener eventos
export const getChurchEvents = async (iglesiaId) => {
    try {
        const response = await api.get(`/iglesias/${iglesiaId}/events`);
        return response.data;
    } catch (error) {
        console.error('Error fetching church events:', error);
        return [];
    }
};

// Interactuar (Recordar, Asistiré, No me interesa)
export const interactWithEvent = async (eventId, action) => {
    try {
        const response = await api.post(`/iglesias/${eventId}/interact`, { action });
        return { success: true, stats: response.data.stats };
    } catch (error) {
        console.error('Error interacting with event:', error);
        return { success: false, error: 'Error al procesar la solicitud' };
    }
};

// Obtener estadísticas
export const getEventStats = async (eventId) => {
    try {
        const response = await api.get(`/iglesias/${eventId}/stats`);
        return response.data;
    } catch (error) {
        console.error('Error fetching event stats:', error);
        return null; // Return null on error
    }
};

// Actualizar evento
export const updateChurchEvent = async (eventId, eventData) => {
    try {
        const response = await api.put(`/iglesias/events/${eventId}`, eventData);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error updating church event:', error);
        return {
            success: false,
            error: error.response?.data?.message || error.response?.data?.error || 'Error al actualizar el evento'
        };
    }
};

// Eliminar evento
export const deleteChurchEvent = async (eventId) => {
    try {
        await api.delete(`/iglesias/events/${eventId}`);
        return { success: true };
    } catch (error) {
        console.error('Error deleting church event:', error);
        return {
            success: false,
            error: error.response?.data?.message || error.response?.data?.error || 'Error al eliminar el evento'
        };
    }
};
