// src/features/reuniones/services/meetingService.js
import api from '../../../api/config';
import { logger } from '../../../shared/utils/logger';

const meetingService = {

  createMeeting: async (meetingData) => {
    try {
      const response = await api.post('/reuniones', meetingData);
      return response.data.data;
    } catch (error) {
      logger.error('Error al crear la reunión:', error);
      throw error;
    }
  },

  getMyMeetings: async () => {
    try {
      const response = await api.get('/reuniones/me');
      return response.data.data;
    } catch (error) {
      logger.error('Error al obtener las reuniones:', error);
      throw error;
    }
  },

  cancelMeeting: async (meetingId) => {
    try {
      const response = await api.put(`/reuniones/${meetingId}/cancel`);
      return response.data.data;
    } catch (error) {
      logger.error('Error al cancelar la reunión:', error);
      throw error;
    }
  },

  getChurchMeetings: async (iglesiaId) => {
    try {
      const response = await api.get(`/reuniones/iglesia/${iglesiaId}`);
      return response.data.data;
    } catch (error) {
      logger.error('Error al obtener reuniones de iglesia:', error);
      return [];
    }
  },

  /** Usuario pide asistir ("Asistiré") */
  requestAttendance: async (meetingId) => {
    try {
      const response = await api.put(`/reuniones/${meetingId}/request`);
      return response.data;
    } catch (error) {
      logger.error('Error al solicitar asistencia:', error);
      throw error;
    }
  },

  /** Creador aprueba o deniega a un usuario */
  respondAttendance: async (meetingId, userId, action) => {
    try {
      const response = await api.put(`/reuniones/${meetingId}/respond/${userId}`, { action });
      return response.data;
    } catch (error) {
      logger.error('Error al responder solicitud:', error);
      throw error;
    }
  },

  /** Detalle completo de la reunión para el creador */
  getMeetingDetail: async (meetingId) => {
    try {
      const response = await api.get(`/reuniones/${meetingId}/detail`);
      return response.data.data;
    } catch (error) {
      logger.error('Error al obtener detalle de reunión:', error);
      throw error;
    }
  },

  /** Editar datos de la reunión */
  updateMeeting: async (meetingId, data) => {
    try {
      const response = await api.put(`/reuniones/${meetingId}`, data);
      return response.data.data;
    } catch (error) {
      logger.error('Error al actualizar la reunión:', error);
      throw error;
    }
  },
};

export default meetingService;

// ─── Utilidades de visualización ───

export const getTypeColor = (type) => {
  switch (type) {
    case 'publica': return 'bg-sky-100 text-sky-800 border-sky-200';
    case 'capacitacion': return 'bg-teal-100 text-teal-800 border-teal-200';
    case 'grupal': return 'bg-pink-100 text-pink-800 border-pink-200';
    // Iglesia
    case 'oracion': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'estudio_biblico': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'culto': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'escuela_dominical': return 'bg-orange-100 text-orange-800 border-orange-200';
    // Legacy
    case 'administrative': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'training': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'community': return 'bg-green-100 text-green-800 border-green-200';
    case 'personal': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'upcoming': return 'bg-yellow-100 text-yellow-800';
    case 'in-progress': return 'bg-green-100 text-green-800';
    case 'completed': return 'bg-gray-100 text-gray-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const formatDate = (dateString, startsAt) => {
  if (!startsAt && !dateString) return 'N/A';
  const date = startsAt ? new Date(startsAt) : new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
};

export const formatTime = (timeString, startsAt) => {
  if (!startsAt && !timeString) return 'N/A';
  if (startsAt) {
    return new Date(startsAt).toLocaleTimeString('es-ES', {
      hour: '2-digit', minute: '2-digit', hour12: false
    });
  }
  return timeString;
};
