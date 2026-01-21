import api from './config';

const iglesiaService = {
  create: async (data) => {
    const response = await api.post('/iglesias', data);
    return response.data;
  },

  getAll: async (params) => {
    const response = await api.get('/iglesias', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/iglesias/${id}`);
    return response.data;
  },

  join: async (id, message) => {
    const response = await api.post(`/iglesias/${id}/join`, { message });
    return response.data;
  },

  manageRequest: async (id, userId, action) => {
    const response = await api.post(`/iglesias/${id}/solicitudes/${userId}`, { accion: action });
    return response.data;
  },

  cancelRequest: async (id) => {
    const response = await api.delete(`/iglesias/${id}/join`);
    return response.data;
  },

  // Chat Methods
  getMessages: async (id) => {
    const response = await api.get(`/iglesias/${id}/messages`);
    return response.data.data || response.data;
  },

  sendMessage: async (id, data) => {
    const response = await api.post(`/iglesias/${id}/messages`, data);
    return response.data.data || response.data;
  },

  deleteMessage: async (id, messageId) => {
    const response = await api.delete(`/iglesias/${id}/messages/${messageId}`);
    return response.data;
  },

  reactToMessage: async (id, messageId, emoji) => {
    const response = await api.post(`/iglesias/${id}/messages/${messageId}/reactions`, { emoji });
    return response.data;
  },

  // Update church data
  // Update church data
  updateIglesia: async (id, data) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const response = await api.put(`/iglesias/${id}`, data, config);
    return response.data;
  }
};

export default iglesiaService;


