import api from './config';

const friendshipService = {
  /**
   * Send friend request
   * @param {string} userId - Target user ID
   * @returns {Promise<Object>} Response data
   */
  sendFriendRequest: async (userId) => {
    const response = await api.post('/amistades/request', {
      destinatario: userId,
    });
    return response.data;
  },

  /**
   * Accept friend request
   * @param {string} requestId - Friendship request ID
   * @returns {Promise<Object>} Response data
   */
  acceptFriendRequest: async (requestId) => {
    const response = await api.post(`/amistades/${requestId}/accept`);
    return response.data;
  },

  /**
   * Reject friend request
   * @param {string} requestId - Friendship request ID
   * @returns {Promise<Object>} Response data
   */
  rejectFriendRequest: async (requestId) => {
    const response = await api.post(`/amistades/${requestId}/reject`);
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
   * Remove friend
   * @param {string} friendId - Friend user ID
   * @returns {Promise<Object>} Response data
   */
  removeFriend: async (friendId) => {
    const response = await api.delete(`/amistades/${friendId}`);
    return response.data;
  },
};

export default friendshipService;
