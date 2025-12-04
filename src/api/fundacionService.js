import api from './config';

const fundacionService = {
  getMyStatus: async () => {
    const response = await api.get('/fundacion/mi-estado');
    return response.data;
  },

  getPendingRequests: async () => {
    const response = await api.get('/fundacion/solicitudes');
    return response.data;
  },

  approveRequest: async (userId) => {
    const response = await api.put(`/fundacion/aprobar/${userId}`);
    return response.data;
  },

  rejectRequest: async (userId, reason) => {
    const response = await api.put(`/fundacion/rechazar/${userId}`, { motivo: reason });
    return response.data;
  }
};

export default fundacionService;
