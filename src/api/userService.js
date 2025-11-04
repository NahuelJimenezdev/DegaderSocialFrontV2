import api from './config';

const userService = {
  /**
   * Get all users
   * @returns {Promise<Array>} Array of users
   */
  getAllUsers: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  },

  /**
   * Search users by query
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of matching users
   */
  searchUsers: async (query) => {
    const response = await api.get('/usuarios/search', {
      params: { q: query },
    });
    return response.data;
  },

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User data
   */
  getUserById: async (userId) => {
    const response = await api.get(`/usuarios/${userId}`);
    return response.data;
  },

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated user data
   */
  updateProfile: async (profileData) => {
    const response = await api.put('/usuarios/profile', profileData);
    return response.data;
  },

  /**
   * Upload user avatar
   * @param {File} file - Avatar file
   * @returns {Promise<Object>} Response with avatar URL
   */
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.put('/usuarios/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Deactivate user account
   * @returns {Promise<Object>} Response data
   */
  deactivateAccount: async () => {
    const response = await api.delete('/usuarios/deactivate');
    return response.data;
  },
};

export default userService;
