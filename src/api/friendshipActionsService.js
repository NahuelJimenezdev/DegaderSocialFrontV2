import api from './config';

// Toggle favorito
export const toggleFavorite = async (friendshipId) => {
    const response = await api.post(`/friendships/${friendshipId}/favorite`);
    return response.data;
};

// Toggle fijado
export const togglePin = async (friendshipId) => {
    const response = await api.post(`/friendships/${friendshipId}/pin`);
    return response.data;
};

// Toggle silenciado
export const toggleMute = async (friendshipId) => {
    const response = await api.post(`/friendships/${friendshipId}/mute`);
    return response.data;
};

// Eliminar amistad
export const removeFriendship = async (friendshipId) => {
    console.log(`🚀 [Service] removeFriendship called with ID: ${friendshipId}`);
    try {
        const response = await api.delete(`/friendships/${friendshipId}/remove`);
        console.log(`✅ [Service] removeFriendship response:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`❌ [Service] removeFriendship failed:`, error);
        throw error;
    }
};

// Bloquear usuario
export const blockUser = async (friendshipId) => {
    const response = await api.post(`/friendships/${friendshipId}/block`);
    return response.data;
};

// Desbloquear usuario
export const unblockUser = async (friendshipId) => {
    const response = await api.post(`/friendships/${friendshipId}/unblock`);
    return response.data;
};
