import api from '../../../api/config';

const postService = {
  // Obtener feed de publicaciones
  getFeed: async (page = 1, limit = 10) => {
    const response = await api.get(`/publicaciones/feed?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Obtener publicaciones de un usuario
  getUserPosts: async (userId, page = 1, limit = 10) => {
    const response = await api.get(`/publicaciones/user/${userId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Obtener publicaciones de un grupo
  getGroupPosts: async (groupId, page = 1, limit = 10) => {
    const response = await api.get(`/publicaciones/grupo/${groupId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Obtener una publicación por ID
  getPostById: async (postId) => {
    const response = await api.get(`/publicaciones/${postId}`);
    return response.data;
  },

  // Crear nueva publicación
  createPost: async (postData) => {
    // Detectar si es FormData
    const isFormData = postData instanceof FormData;

    const config = {};

    // Si NO es FormData, agregar Content-Type JSON
    if (!isFormData) {
      config.headers = {
        'Content-Type': 'application/json',
      };
    }
    // Si ES FormData, NO agregar Content-Type (el navegador lo hace automáticamente con boundary)

    const response = await api.post('/publicaciones', postData, config);
    return response.data;
  },

  // Toggle like en publicación
  toggleLike: async (postId) => {
    const response = await api.post(`/publicaciones/${postId}/like`);
    return response.data;
  },

  // Agregar comentario o respuesta
  addComment: async (postId, contenido, parentCommentId = null, image = null) => {
    const response = await api.post(`/publicaciones/${postId}/comment`, {
      contenido,
      parentCommentId,
      image
    });
    return response.data;
  },

  // Compartir publicación
  sharePost: async (postId, contenido = '') => {
    const response = await api.post(`/publicaciones/${postId}/share`, { contenido });
    return response.data;
  },

  // Eliminar publicación
  deletePost: async (postId) => {
    const response = await api.delete(`/publicaciones/${postId}`);
    return response.data;
  }
};

export default postService;


