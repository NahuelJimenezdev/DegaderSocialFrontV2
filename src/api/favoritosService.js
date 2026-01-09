import api from './axiosConfig';

const favoritosService = {
    /**
     * Agregar o quitar usuario de favoritos
     * @param {string} userId - ID del usuario
     * @returns {Promise<Object>} Resultado de la operación
     */
    toggleFavoriteUser: async (userId) => {
        const response = await api.post(`/favoritos/usuario/${userId}`);
        return response.data;
    },

    /**
     * Obtener usuarios favoritos
     * @returns {Promise<Object>} Lista de usuarios favoritos
     */
    getFavoriteUsers: async () => {
        const response = await api.get('/favoritos/usuarios');
        return response.data;
    },

    /**
     * Verificar si un usuario es favorito
     * @param {string} userId - ID del usuario
     * @returns {Promise<Object>} Estado de favorito
     */
    checkIsFavorite: async (userId) => {
        const response = await api.get(`/favoritos/usuario/${userId}/check`);
        return response.data;
    }
};

export default favoritosService;
