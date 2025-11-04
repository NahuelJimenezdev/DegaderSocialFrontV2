import api from './config';

const conversationService = {
  /**
   * Get all conversations for current user
   * @returns {Promise<Array>} Array of conversations
   */
  getAllConversations: async () => {
    const response = await api.get('/conversaciones');
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
    const response = await api.get(`/conversaciones/user/${userId}`);
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
};

export default conversationService;
