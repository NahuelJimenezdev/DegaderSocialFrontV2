import api from './config';

const conversationService = {
  /**
   * Get all conversations for current user
   * @param {string} type - Type of conversations: 'principal', 'pending', 'archived'
   * @returns {Promise<Array>} Array of conversations
   */
  getAllConversations: async (type = 'principal') => {
    const response = await api.get(`/conversaciones?type=${type}`);
    return response.data;
  },

  /**
   * Get unread messages count
   * @returns {Promise<Object>} Object with count
   */
  getUnreadCount: async () => {
    const response = await api.get('/conversaciones/unread-count');
    return response.data;
  },

  /**
   * Get pending requests count
   * @returns {Promise<Object>} Object with count
   */
  getPendingCount: async () => {
    const response = await api.get('/conversaciones/pending-count');
    return response.data;
  },

  /**
   * Get conversation by ID
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Object>} Conversation data with messages
   */
  getConversationById: async (conversationId) => {
    const response = await api.get(`/conversaciones/${conversationId}`);
    return response.data;
  },

  /**
   * Get or create conversation with a user
   * @param {string} userId - Target user ID
   * @returns {Promise<Object>} Conversation data
   */
  getOrCreateConversation: async (userId) => {
    const response = await api.post(`/conversaciones/with/${userId}`);
    return response.data;
  },

  /**
   * Send a message in a conversation
   * @param {string} conversationId - Conversation ID
   * @param {string} contenido - Message content
   * @returns {Promise<Object>} Sent message data
   */
  sendMessage: async (conversationId, contenido) => {
    const response = await api.post(`/conversaciones/${conversationId}/message`, {
      contenido,
    });
    return response.data;
  },

  /**
   * Mark conversation as read
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Object>} Response data
   */
  markAsRead: async (conversationId) => {
    const response = await api.put(`/conversaciones/${conversationId}/read`);
    return response.data;
  },

  /**
   * Delete conversation
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Object>} Response data
   */
  deleteConversation: async (conversationId) => {
    const response = await api.delete(`/conversaciones/${conversationId}`);
    return response.data;
  },

  /**
   * Archive/Unarchive conversation
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Object>} Response data
   */
  archiveConversation: async (conversationId) => {
    const response = await api.put(`/conversaciones/${conversationId}/archive`);
    return response.data;
  },

  /**
   * Clear conversation (delete messages for current user only)
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Object>} Response data
   */
  clearConversation: async (conversationId) => {
    const response = await api.put(`/conversaciones/${conversationId}/clear`);
    return response.data;
  },

  /**
   * Accept message request
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Object>} Response data
   */
  acceptMessageRequest: async (conversationId) => {
    const response = await api.put(`/conversaciones/${conversationId}/accept-request`);
    return response.data;
  },

  /**
   * Decline message request
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Object>} Response data
   */
  declineMessageRequest: async (conversationId) => {
    const response = await api.put(`/conversaciones/${conversationId}/decline-request`);
    return response.data;
  },

  /**
   * Star/Unstar conversation
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Object>} Response data
   */
  starConversation: async (conversationId) => {
    const response = await api.put(`/conversaciones/${conversationId}/star`);
    return response.data;
  },
};

export default conversationService;
