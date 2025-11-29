// Updated friendshipService with compatibility routes
import api from './config';

const friendshipService = {
  /**
   * Send friend request
   * @param {string} userId - Target user ID
   * @returns {Promise<Object>} Response data
   */
  sendFriendRequest: async (userId) => {
    const response = await api.post('/amistades/solicitar', { usuarioId: userId });
    return response.data;
  },

  /**
   * Accept friend request
   * @param {string} userId - ID of user who sent the request
   * @returns {Promise<Object>} Response data
   */
  acceptFriendRequest: async (userId) => {
    const response = await api.post('/amistades/aceptar', { usuarioId: userId });
    return response.data;
  },

  /**
   * Reject friend request
   * @param {string} userId - ID of user who sent the request
   * @returns {Promise<Object>} Response data
   */
  rejectFriendRequest: async (userId) => {
    const response = await api.post('/amistades/rechazar', { usuarioId: userId });
    return response.data;
  },

  /**
   * Cancel friend request or remove friend
   * @param {string} userId - Target user ID
   * @returns {Promise<Object>} Response data
   */
  cancelFriendRequest: async (userId) => {
    const response = await api.post('/amistades/cancelar', { usuarioId: userId });
    return response.data;
  },

  /**
   * Get friendship status with a user
   * @param {string} userId - Target user ID
   * @returns {Promise<Object>} Response with estado
   */
  getEstado: async (userId) => {
    const response = await api.get(`/amistades/estado/${userId}`);
    return response.data;
  },

  /**
   * Get friends list
   * @returns {Promise<Array>} Array of friends
   */
  getFriends: async () => {
    const response = await api.get('/amistades/friends');
    return response.data;
  },

  /**
   * Get pending friend requests
   * @returns {Promise<Array>} Array of pending requests
   */
  getPendingRequests: async () => {
    const response = await api.get('/amistades/pending');
    return response.data;
  },

  /**
   * Remove friend (alias for cancel)
   * @param {string} friendId - Friend user ID
   * @returns {Promise<Object>} Response data
   */
  removeFriend: async (friendId) => {
    const response = await api.delete(`/amistades/${friendId}`);
    return response.data;
  }
};

export default friendshipService;
