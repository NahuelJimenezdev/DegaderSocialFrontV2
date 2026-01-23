import api from './config';

const ministerioService = {
    /**
     * Obtener ministerios de un usuario
     * @param {string} userId - ID del usuario
     */
    obtenerMinisteriosUsuario: async (userId) => {
        try {
            const response = await api.get(`/ministerios/usuario/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener ministerios del usuario:', error);
            throw error;
        }
    },

    /**
     * Asignar ministerio a un usuario
     * @param {Object} data - { usuarioId, ministerio, cargo, iglesiaId }
     */
    asignarMinisterio: async (data) => {
        try {
            const response = await api.post('/ministerios/asignar', data);
            return response.data;
        } catch (error) {
            console.error('Error al asignar ministerio:', error);
            throw error;
        }
    },

    /**
     * Actualizar cargo de un ministerio
     * @param {string} ministerioId - ID del ministerio (subdocumento)
     * @param {Object} data - { usuarioId, cargo }
     */
    actualizarMinisterio: async (ministerioId, data) => {
        try {
            const response = await api.patch(`/ministerios/${ministerioId}`, data);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar ministerio:', error);
            throw error;
        }
    },

    /**
     * Remover ministerio de un usuario
     * @param {string} ministerioId - ID del ministerio (subdocumento)
     * @param {string} usuarioId - ID del usuario
     */
    removerMinisterio: async (ministerioId, usuarioId) => {
        try {
            const response = await api.delete(`/ministerios/${ministerioId}`, {
                params: { usuarioId }
            });
            return response.data;
        } catch (error) {
            console.error('Error al remover ministerio:', error);
            throw error;
        }
    },

    /**
     * Gestionar miembro en ministerio (para líderes)
     * @param {string} ministerioNombre - Nombre del ministerio
     * @param {Object} data - { usuarioId, accion: 'agregar' | 'remover' }
     */
    gestionarMiembroMinisterio: async (ministerioNombre, data) => {
        try {
            const response = await api.post(`/ministerios/${ministerioNombre}/miembros`, data);
            return response.data;
        } catch (error) {
            console.error('Error al gestionar miembro en ministerio:', error);
            throw error;
        }
    },

    /**
     * Obtener miembros de un ministerio
     * @param {string} ministerioNombre - Nombre del ministerio
     * @param {string} iglesiaId - ID de la iglesia
     */
    obtenerMiembrosPorMinisterio: async (ministerioNombre, iglesiaId) => {
        try {
            const response = await api.get(`/ministerios/${ministerioNombre}/miembros`, {
                params: { iglesiaId }
            });
            return response.data;
        } catch (error) {
            console.error('Error al obtener miembros del ministerio:', error);
            throw error;
        }
    },

    /**
     * Enviar notificación a todos los miembros de un ministerio
     * @param {string} ministerioNombre - Nombre del ministerio
     * @param {Object} data - { iglesiaId, contenido, metadata }
     */
    enviarNotificacionMinisterio: async (ministerioNombre, data) => {
        try {
            const response = await api.post(`/ministerios/${ministerioNombre}/notificaciones`, data);
            return response.data;
        } catch (error) {
            console.error('Error al enviar notificación de ministerio:', error);
            throw error;
        }
    },

    /**
     * Enviar anuncio a todos los miembros de un ministerio
     * @param {string} ministerioNombre - Nombre del ministerio
     * @param {Object} data - { iglesiaId, titulo, mensaje, tipo }
     */
    enviarAnuncioMinisterio: async (ministerioNombre, data) => {
        try {
            const response = await api.post(`/ministerios/${ministerioNombre}/anuncios`, data);
            return response.data;
        } catch (error) {
            console.error('Error al enviar anuncio de ministerio:', error);
            throw error;
        }
    }
};

export default ministerioService;
