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
    if (filters.search) params.append('search', filters.search);
    if (filters.cargo) params.append('cargo', filters.cargo);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await api.get(`/fundacion/admin/todas-solicitudes?${params.toString()}`);
    return response.data;
  },

  getUsersUnderJurisdiction: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.nivel) params.append('nivel', filters.nivel);
    if (filters.area) params.append('area', filters.area);
    if (filters.cargo) params.append('cargo', filters.cargo);
    if (filters.pais) params.append('pais', filters.pais);
    if (filters.region) params.append('region', filters.region);
    if (filters.departamento) params.append('departamento', filters.departamento);
    if (filters.municipio) params.append('municipio', filters.municipio);
    if (filters.search) params.append('search', filters.search);
    if (filters.estado) params.append('estado', filters.estado);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await api.get(`/fundacion/admin/usuarios-jurisdiccion?${params.toString()}`);
    return response.data;
  },

  /**
   * Obtener directores aprobados por país
   * Usado por afiliados para seleccionar su "Responsable asignado"
   */
  getDirectoresPorPais: async (pais) => {
    const response = await api.get(`/fundacion/directores-pais?pais=${encodeURIComponent(pais)}`);
    return response.data;
  },

  /**
   * Descargar base de miembros en formato Excel (.xlsx)
   * Respeta la jurisdicción del usuario logueado
   */
  descargarBase: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.nivel) params.append('nivel', filters.nivel);
    if (filters.area) params.append('area', filters.area);
    if (filters.cargo) params.append('cargo', filters.cargo);
    if (filters.pais) params.append('pais', filters.pais);
    if (filters.region) params.append('region', filters.region);
    if (filters.departamento) params.append('departamento', filters.departamento);
    if (filters.municipio) params.append('municipio', filters.municipio);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/fundacion/admin/descargar-base?${params.toString()}`, {
      responseType: 'blob'
    });
    return response;
  },

  /**
   * Obtener lista de países únicos disponibles bajo jurisdicción
   */
  getPaisesJurisdiccion: async () => {
    const response = await api.get('/fundacion/admin/paises-jurisdiccion');
    return response.data;
  },

  /**
   * Actualizar valoración manual de un usuario
   */
  updateValoracionManual: async (userId, data) => {
    const response = await api.put(`/fundacion/admin/usuario/${userId}/valoracion`, data);
    return response.data;
  },

  /**
   * Obtener detalle de usuario bajo jurisdicción
   */
  getUsuarioJurisdiccionDetalle: async (userId) => {
    const response = await api.get(`/fundacion/admin/usuario/${userId}`);
    return response.data;
  }
};

export default fundacionService;


