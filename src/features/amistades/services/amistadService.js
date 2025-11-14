import api from '../../../api/config';

const amistadService = {
  // Obtener estado de amistad con un usuario
  getEstado: async (usuarioId) => {
    const response = await api.get(`/amistades/estado/${usuarioId}`);
    return response.data;
  },

  // Enviar solicitud de amistad
  enviarSolicitud: async (usuarioId) => {
    const response = await api.post('/amistades/solicitar', { usuarioId });
    return response.data;
  },

  // Aceptar solicitud
  aceptarSolicitud: async (usuarioId) => {
    const response = await api.post('/amistades/aceptar', { usuarioId });
    return response.data;
  },

  // Cancelar solicitud enviada
  cancelarSolicitud: async (usuarioId) => {
    const response = await api.post('/amistades/cancelar', { usuarioId });
    return response.data;
  },

  // Rechazar solicitud recibida
  rechazarSolicitud: async (usuarioId) => {
    const response = await api.post('/amistades/rechazar', { usuarioId });
    return response.data;
  }
};

export default amistadService;