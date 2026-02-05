import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Obtener estado de onboarding del usuario
 */
export const getOnboardingStatus = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/onboarding`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener estado de onboarding:', error);
        return {
            hasCompleted: false,
            currentStep: null,
            lastUpdated: null
        };
    }
};

/**
 * Actualizar progreso de onboarding
 */
export const updateOnboardingProgress = async (data) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`${API_URL}/onboarding`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar progreso:', error);
        throw error;
    }
};

/**
 * Marcar onboarding como completado
 */
export const completeOnboarding = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/onboarding/complete`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al completar onboarding:', error);
        throw error;
    }
};
