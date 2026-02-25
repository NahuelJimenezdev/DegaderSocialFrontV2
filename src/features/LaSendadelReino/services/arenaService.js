import api from '../../../api/config';

export const ArenaService = {
    /**
     * Obtiene desafíos aleatorios según dificultad
     */
    getChallenges: async (difficulty) => {
        const response = await api.get('/arena/challenges', {
            params: { level: difficulty }
        });
        return response.data;
    },

    /**
     * Envía el resultado de una partida
     */
    submitResult: async (sessionData) => {
        const response = await api.post('/arena/submit', sessionData);
        return response.data;
    },

    /**
     * Obtiene el ranking filtrado
     */
    getRanking: async (type = 'global', country = null, state = null) => {
        const response = await api.get('/arena/ranking', {
            params: { type, country, state }
        });
        return response.data;
    },

    /**
     * Obtiene el estado actual del usuario en la arena
     */
    getStatus: async () => {
        const response = await api.get('/arena/status');
        return response.data;
    }
};
