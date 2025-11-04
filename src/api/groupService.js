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
   * @param {Object} groupData - Group data
   * @param {string} groupData.nombre - Group name
   * @param {string} [groupData.descripcion] - Group description
   * @param {string} [groupData.tipo] - Group type (publico/privado/secreto)
   * @param {string} [groupData.categoria] - Category
   * @param {File} [groupData.imagen] - Group image
   * @returns {Promise<Object>} Created group
   */
  createGroup: async (groupData) => {
    const formData = new FormData();
    Object.keys(groupData).forEach((key) => {
      if (groupData[key] !== undefined && groupData[key] !== null) {
        formData.append(key, groupData[key]);
      }
    });

    const response = await api.post('/grupos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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
   * Accept join request (admin only)
   * @param {string} groupId - Group ID
   * @param {string} userId - User ID to accept
   * @returns {Promise<Object>} Response data
   */
  acceptJoinRequest: async (groupId, userId) => {
    const response = await api.post(`/grupos/${groupId}/accept`, { userId });
    return response.data;
  },

  /**
   * Update member role (admin only)
   * @param {string} groupId - Group ID
   * @param {string} userId - User ID
   * @param {string} rol - New role (miembro/moderador/administrador)
   * @returns {Promise<Object>} Response data
   */
  updateMemberRole: async (groupId, userId, rol) => {
    const response = await api.put(`/grupos/${groupId}/member/role`, {
      userId,
      rol,
    });
    return response.data;
  },

  /**
   * Delete a group (admin only)
   * @param {string} groupId - Group ID
   * @returns {Promise<Object>} Response data
   */
  deleteGroup: async (groupId) => {
    const response = await api.delete(`/grupos/${groupId}`);
    return response.data;
  },
};

export default groupService;
