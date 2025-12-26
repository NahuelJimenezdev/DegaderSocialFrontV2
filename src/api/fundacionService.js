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
  },

  getAllSolicitudes: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.estado) params.append('estado', filters.estado);
    if (filters.nivel) params.append('nivel', filters.nivel);
    if (filters.pais) params.append('pais', filters.pais);
    if (filters.area) params.append('area', filters.area);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await api.get(`/fundacion/admin/todas-solicitudes?${params.toString()}`);
    return response.data;
  }
};

export default fundacionService;


