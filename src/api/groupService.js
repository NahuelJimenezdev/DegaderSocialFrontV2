import api from './config';

const groupService = {
  /**
   * Get all groups
   * @param {Object} params - Query parameters
   * @param {string} [params.tipo] - Group type filter (publico/privado/secreto)
   * @param {string} [params.categoria] - Category filter
   * @returns {Promise<Array>} Array of groups
   */
  getAllGroups: async (params = {}) => {
    const response = await api.get('/grupos', { params });
    return response.data;
  },

  /**
   * Get group by ID
   * @param {string} groupId - Group ID
   * @returns {Promise<Object>} Group data
   */
  getGroupById: async (groupId) => {
    const response = await api.get(`/grupos/${groupId}`);
    return response.data;
  },

  /**
   * Create a new group
   * @param {FormData|Object} groupData - Group data (puede ser FormData si incluye imagen)
   * @param {string} groupData.nombre - Group name
   * @param {string} [groupData.descripcion] - Group description
   * @param {string} [groupData.tipo] - Group type (publico/privado/secreto)
   * @param {string} [groupData.categoria] - Category
   * @param {File} [groupData.avatar] - Group image (en FormData)
   * @returns {Promise<Object>} Created group
   */
  createGroup: async (groupData) => {
    // Detectar si es FormData (incluye imagen) o JSON
    const isFormData = groupData instanceof FormData;

    const response = await api.post('/grupos', groupData, {
      headers: isFormData ? {
        'Content-Type': 'multipart/form-data',
      } : {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  /**
   * Join a group
   * @param {string} groupId - Group ID
   * @returns {Promise<Object>} Response data
   */
  joinGroup: async (groupId) => {
    const response = await api.post(`/grupos/${groupId}/join`);
    return response.data;
  },

  /**
   * Leave a group
   * @param {string} groupId - Group ID
   * @returns {Promise<Object>} Response data
   */
  leaveGroup: async (groupId) => {
    const response = await api.post(`/grupos/${groupId}/leave`);
    return response.data;
  },

  /**
   * Update group information (admin/owner only)
   * @param {string} groupId - Group ID
   * @param {Object} data - Data to update
   * @param {string} [data.nombre] - Group name
   * @param {string} [data.descripcion] - Group description
   * @param {string} [data.tipo] - Group type (normal/fundacion/iglesia)
   * @returns {Promise<Object>} Updated group
   */
  updateGroup: async (groupId, data) => {
    const response = await api.put(`/grupos/${groupId}`, data);
    return response.data;
  },

  /**
   * Upload group avatar (admin/owner only)
   * @param {string} groupId - Group ID
   * @param {File} file - Image file
   * @returns {Promise<Object>} Response with image URL
   */
  uploadGroupAvatar: async (groupId, file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post(`/grupos/${groupId}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Delete group avatar (admin/owner only)
   * @param {string} groupId - Group ID
   * @returns {Promise<Object>} Response data
   */
  deleteGroupAvatar: async (groupId) => {
    const response = await api.delete(`/grupos/${groupId}/avatar`);
    return response.data;
  },

  /**
   * Accept join request (admin/owner only)
   * @param {string} groupId - Group ID
   * @param {string} requestId - Request ID to accept
   * @returns {Promise<Object>} Response data
   */
  acceptJoinRequest: async (groupId, requestId) => {
    const response = await api.post(`/grupos/${groupId}/join/${requestId}/approve`);
    return response.data;
  },

  /**
   * Reject join request (admin/owner only)
   * @param {string} groupId - Group ID
   * @param {string} requestId - Request ID to reject
   * @returns {Promise<Object>} Response data
   */
  rejectJoinRequest: async (groupId, requestId) => {
    const response = await api.post(`/grupos/${groupId}/join/${requestId}/reject`);
    return response.data;
  },

  /**
   * Transfer group ownership (owner only)
   * @param {string} groupId - Group ID
   * @param {string} newOwnerId - User ID of new owner
   * @returns {Promise<Object>} Response data
   */
  transferOwnership: async (groupId, newOwnerId) => {
    const response = await api.post(`/grupos/${groupId}/transfer`, { newOwnerId });
    return response.data;
  },

  /**
   * Update member role (admin/owner only)
   * @param {string} groupId - Group ID
   * @param {string} memberId - Member user ID
   * @param {string} role - New role ('admin' or 'member')
   * @returns {Promise<Object>} Response data
   */
  updateMemberRole: async (groupId, memberId, role) => {
    const response = await api.post(`/grupos/${groupId}/members/${memberId}/role`, { role });
    return response.data;
  },

  /**
   * Remove a member from group (admin/owner only)
   * @param {string} groupId - Group ID
   * @param {string} memberId - Member user ID
   * @returns {Promise<Object>} Response data
   */
  removeMember: async (groupId, memberId) => {
    const response = await api.delete(`/grupos/${groupId}/members/${memberId}`);
    return response.data;
  },

  /**
   * Delete a group (owner only)
   * @param {string} groupId - Group ID
   * @param {boolean} [force] - Force delete even with members
   * @returns {Promise<Object>} Response data
   */
  deleteGroup: async (groupId, force = false) => {
    const response = await api.delete(`/grupos/${groupId}${force ? '?force=true' : ''}`);
    return response.data;
  },

  // ===== MESSAGES =====

  /**
   * Get all messages from a group
   * @param {string} groupId - Group ID
   * @returns {Promise<Array>} Array of messages
   */
  getMessages: async (groupId) => {
    const response = await api.get(`/grupos/${groupId}/messages`);
    return response.data.data || response.data;
  },

  /**
   * Get a specific message by ID
   * @param {string} groupId - Group ID
   * @param {string} messageId - Message ID
   * @returns {Promise<Object>} Message data
   */
  getMessage: async (groupId, messageId) => {
    const response = await api.get(`/grupos/${groupId}/messages/${messageId}`);
    return response.data;
  },

  /**
   * Send a text message to group
   * @param {string} groupId - Group ID
   * @param {Object} data - Message data
   * @param {string} data.content - Message content
   * @param {string} [data.replyTo] - Message ID to reply to
   * @param {Array} [data.attachments] - Link attachments
   * @param {string} [data.clientTempId] - Temporary ID for optimistic UI
   * @returns {Promise<Object>} Created message
   */
  sendMessage: async (groupId, data) => {
    const response = await api.post(`/grupos/${groupId}/messages`, data);
    return response.data.data || response.data;
  },

  /**
   * Send message with file attachments
   * @param {string} groupId - Group ID
   * @param {Object} data - Message data
   * @param {string} [data.content] - Message content
   * @param {string} [data.replyTo] - Message ID to reply to
   * @param {FileList|File[]} data.files - Files to attach
   * @param {string} [data.clientTempId] - Temporary ID for optimistic UI
   * @returns {Promise<Object>} Created message
   */
  sendMessageWithFiles: async (groupId, data) => {
    const formData = new FormData();
    if (data.content) formData.append('content', data.content);
    if (data.replyTo) formData.append('replyTo', data.replyTo);
    if (data.clientTempId) formData.append('clientTempId', data.clientTempId);

    // Attach files
    if (data.files) {
      const filesArray = Array.isArray(data.files) ? data.files : Array.from(data.files);
      filesArray.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await api.post(`/grupos/${groupId}/messages/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Delete a message (author or admin)
   * @param {string} groupId - Group ID
   * @param {string} messageId - Message ID
   * @returns {Promise<Object>} Response data
   */
  deleteMessage: async (groupId, messageId) => {
    const response = await api.delete(`/grupos/${groupId}/messages/${messageId}`);
    return response.data;
  },

  /**
   * React to a message
   * @param {string} groupId - Group ID
   * @param {string} messageId - Message ID
   * @param {string} emoji - Emoji to react with
   * @returns {Promise<Object>} Response data
   */
  reactToMessage: async (groupId, messageId, emoji) => {
    const response = await api.post(`/grupos/${groupId}/messages/${messageId}/reactions`, { emoji });
    return response.data;
  },

  /**
   * Toggle star on a message
   * @param {string} groupId - Group ID
   * @param {string} messageId - Message ID
   * @returns {Promise<Object>} Response data
   */
  toggleStar: async (groupId, messageId) => {
    const response = await api.put(`/grupos/${groupId}/messages/${messageId}/star`);
    return response.data;
  },

  // ===== MULTIMEDIA, FILES, LINKS =====

  /**
   * Get multimedia (images) from group
   * @param {string} groupId - Group ID
   * @returns {Promise<Array>} Array of messages with images
   */
  getMultimedia: async (groupId) => {
    const response = await api.get(`/grupos/${groupId}/multimedia`);
    return response.data?.data || response.data || [];
  },

  /**
   * Get files (videos, audio, documents) from group
   * @param {string} groupId - Group ID
   * @returns {Promise<Array>} Array of messages with files
   */
  getArchivos: async (groupId) => {
    const response = await api.get(`/grupos/${groupId}/archivos`);
    return response.data?.data || response.data || [];
  },

  /**
   * Get links shared in group
   * @param {string} groupId - Group ID
   * @returns {Promise<Array>} Array of messages with links
   */
  getEnlaces: async (groupId) => {
    const response = await api.get(`/grupos/${groupId}/enlaces`);
    return response.data;
  },

  /**
   * Get link preview metadata
   * @param {string} groupId - Group ID
   * @param {string} url - URL to preview
   * @returns {Promise<Object>} Preview data
   */
  previewLink: async (groupId, url) => {
    const response = await api.get(`/grupos/${groupId}/enlaces/preview`, {
      params: { url },
    });
    return response.data;
  },

  // ===== STARRED MESSAGES & EVENTS =====

  /**
   * Get starred messages
   * @param {string} groupId - Group ID
   * @returns {Promise<Array>} Array of starred messages
   */
  getDestacados: async (groupId) => {
    const response = await api.get(`/grupos/${groupId}/destacados`);
    return response.data;
  },

  /**
   * Get group events
   * @param {string} groupId - Group ID
   * @returns {Promise<Array>} Array of events
   */
  getEventos: async (groupId) => {
    const response = await api.get(`/grupos/${groupId}/eventos`);
    return response.data;
  },
};

export default groupService;
