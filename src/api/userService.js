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
   * Get user by username
   * @param {string} username - Username
   * @returns {Promise<Object>} User data
   */
  getUserByUsername: async (username) => {
    const response = await api.get(`/usuarios/username/${username}`);
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

  /**
   * Get user statistics
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User statistics (posts, friends)
   */
  getUserStats: async (userId) => {
    const response = await api.get(`/usuarios/${userId}/stats`);
    return response.data;
  },

  /**
   * Upload user banner
   * @param {string} userId - User ID
   * @param {File} file - Banner file
   * @returns {Promise<Object>} Response with banner URL
   */
  uploadBanner: async (userId, file) => {
    const formData = new FormData();
    formData.append('banner', file);

    const response = await api.post(`/usuarios/${userId}/banner`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete user banner
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Response data
   */
  deleteBanner: async (userId) => {
    const response = await api.delete(`/usuarios/${userId}/banner`);
    return response.data;
  },

  /**
   * Toggle save/unsave a post
   * @param {string} postId - Post ID to save/unsave
   * @returns {Promise<Object>} Response with saved status and savedPosts array
   */
  toggleSavePost: async (postId) => {
    const response = await api.post(`/usuarios/save-post/${postId}`);
    return response.data;
  },

  /**
   * Get user's saved posts
   * @returns {Promise<Object>} Response with saved posts array
   */
  getSavedPosts: async () => {
    const response = await api.get('/usuarios/saved-posts');
    return response.data;
  },
};

export default userService;


