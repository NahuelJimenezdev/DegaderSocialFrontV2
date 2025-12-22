import api from '../../../api/config';

const amistadService = {
  // Obtener estado de amistad con un usuario
  getEstado: async (usuarioId) => {
    const response = await api.get(`/amistades/status/${usuarioId}`);
    return response.data;
  },

  // Enviar solicitud de amistad
  enviarSolicitud: async (usuarioId) => {
    const response = await api.post('/amistades/request', { receptorId: usuarioId });
    return response.data;
  },

  // Aceptar solicitud (requiere ID de la amistad/solicitud)
  aceptarSolicitud: async (friendshipId) => {
    const response = await api.post(`/amistades/${friendshipId}/accept`);
    return response.data;
  },

  // Cancelar solicitud enviada (eliminar amistad/solicitud)
  cancelarSolicitud: async (friendId) => {
    const response = await api.delete(`/amistades/${friendId}`);
    return response.data;
  },

  // Rechazar solicitud recibida
  rechazarSolicitud: async (friendshipId) => {
    const response = await api.post(`/amistades/${friendshipId}/reject`);
    return response.data;
  }
};

export default amistadService;

