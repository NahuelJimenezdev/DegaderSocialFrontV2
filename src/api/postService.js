import api from './config';

const postService = {
  /**
   * Create a new post
   * @param {Object} postData - Post data
   * @param {string} postData.contenido - Post content
   * @param {File} [postData.imagen] - Image file (optional)
   * @param {File} [postData.documento] - Document file (optional)
   * @param {string} [postData.privacidad] - Privacy setting (publico/amigos/privado)
   * @returns {Promise<Object>} Created post
   */
  createPost: async (postData) => {
    let formData;

    if (postData instanceof FormData) {
      formData = postData;
    } else {
      formData = new FormData();
      formData.append('contenido', postData.contenido);
      if (postData.privacidad) {
        formData.append('privacidad', postData.privacidad);
      }
      if (postData.imagen) {
        formData.append('imagen', postData.imagen);
      }
      if (postData.documento) {
        formData.append('documento', postData.documento);
      }
    }

    const response = await api.post('/publicaciones', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get user feed
   * @param {number} [page=1] - Page number
   * @param {number} [limit=10] - Posts per page
   * @returns {Promise<Object>} Feed data with posts and pagination
   */
  getFeed: async (page = 1, limit = 10) => {
    const response = await api.get('/publicaciones/feed', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get posts by user ID
   * @param {string} userId - User ID
   * @param {number} [page=1] - Page number
   * @param {number} [limit=10] - Posts per page
   * @returns {Promise<Object>} Posts data with pagination
   */
  getUserPosts: async (userId, page = 1, limit = 10) => {
    const response = await api.get(`/publicaciones/user/${userId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get single post by ID
   * @param {string} postId - Post ID
   * @returns {Promise<Object>} Post data
   */
  getPostById: async (postId) => {
    const response = await api.get(`/publicaciones/${postId}`);
    return response.data;
  },

  /**
   * Like or unlike a post
   * @param {string} postId - Post ID
   * @returns {Promise<Object>} Response data
   */
  toggleLike: async (postId) => {
    const response = await api.post(`/publicaciones/${postId}/like`);
    return response.data;
  },

  /**
   * Like or unlike a comment
   * @param {string} postId - Post ID
   * @param {string} commentId - Comment ID
   * @returns {Promise<Object>} Response data
   */
  toggleCommentLike: async (postId, commentId) => {
    const response = await api.post(`/publicaciones/${postId}/comment/${commentId}/like`);
    return response.data;
  },

  /**
   * Add comment to a post
   * @param {string} postId - Post ID
   * @param {string} contenido - Comment content
   * @returns {Promise<Object>} Response data
   */
  addComment: async (postId, contenido) => {
    const response = await api.post(`/publicaciones/${postId}/comment`, {
      contenido,
    });
    return response.data;
  },

  /**
   * Share a post
   * @param {string} postId - Post ID
   * @param {string} [contenido] - Optional comment when sharing
   * @returns {Promise<Object>} Response data
   */
  sharePost: async (postId, contenido = '') => {
    const response = await api.post(`/publicaciones/${postId}/share`, {
      contenido,
    });
    return response.data;
  },

  /**
   * Delete a post
   * @param {string} postId - Post ID
   * @returns {Promise<Object>} Response data
   */
  deletePost: async (postId) => {
    const response = await api.delete(`/publicaciones/${postId}`);
    return response.data;
  },
};

export default postService;


