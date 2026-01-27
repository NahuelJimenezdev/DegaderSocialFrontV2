// src/features/reuniones/services/meetingService.js

// 1. IMPORTACIÓN DE CONFIGURACIÓN DE AXIOS
// Asegúrate de que esta ruta sea correcta para acceder a tu instancia de Axios
import api from '../../../api/config';
import { logger } from '../../../shared/utils/logger';


// ===================================================================
// LÓGICA DE API (API SERVICE) - Exportación por Defecto
// ===================================================================

const meetingService = {

  /**
   * Llama al POST /api/reuniones para crear una nueva reunión
   */
  createMeeting: async (meetingData) => {
    try {
      const response = await api.post('/reuniones', meetingData);
      return response.data.data;
    } catch (error) {
      logger.error('Error al crear la reunión:', error);
      throw error;
    }
  },

  /**
   * Llama al GET /api/reuniones/me para obtener todas las reuniones del usuario
   */
  getMyMeetings: async () => {
    try {
      const response = await api.get('/reuniones/me');
      return response.data.data;
    } catch (error) {
      logger.error('Error al obtener las reuniones:', error);
      throw error;
    }
  },

  /**
   * Llama al PUT /api/reuniones/:id/cancel para cancelar una reunión
   */
  cancelMeeting: async (meetingId) => {
    try {
      const response = await api.put(`/reuniones/${meetingId}/cancel`);
      return response.data.data;
    } catch (error) {
      logger.error('Error al cancelar la reunión:', error);
      throw error;
    }
  },

  /**
   * Llama al GET /api/reuniones/iglesia/:id para obtener reuniones de una iglesia
   */
  getChurchMeetings: async (iglesiaId) => {
    try {
      const response = await api.get(`/reuniones/iglesia/${iglesiaId}`);
      return response.data.data;
    } catch (error) {
      logger.error('Error al obtener reuniones de iglesia:', error);
      return [];
    }
  },

  // Aquí se añadirían otras funciones de API (ej: joinMeeting, deleteMeeting)
};

// 🚨 EXPORTACIÓN POR DEFECTO para que 'useMeetings.js' pueda importar el servicio API.
export default meetingService;


// ===================================================================
// UTILIDADES Y DATOS MOCK - Exportaciones Nombradas (para MeetingCard.jsx)
// ===================================================================

export const mockMeetings = [
  // Dejamos el mock data, aunque ya estamos usando el hook para datos reales.
  {
    id: '1',
    title: 'Reunión Mensual de Directores',
    description: 'Revisión de objetivos y planificación del próximo trimestre',
    date: '2025-01-20',
    time: '14:00',
    duration: '2 horas',
    attendees: ['u1', 'u2', 'u3'],
    type: 'administrative',
    meetLink: 'https://meet.google.com/abc-defg-hij',
    status: 'upcoming'
  },
  // ... más mocks ...
];

// Función utilitaria para obtener el color del tipo de reunión
export const getTypeColor = (type) => {
  switch (type) {
    case 'oracion': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'estudio_biblico': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'culto': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'escuela_dominical': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'capacitacion': return 'bg-teal-100 text-teal-800 border-teal-200';
    case 'grupal': return 'bg-pink-100 text-pink-800 border-pink-200';
    case 'comercial': return 'bg-emerald-100 text-emerald-800 border-emerald-200';

    // Legacy support
    case 'administrative': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'training': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'community': return 'bg-green-100 text-green-800 border-green-200';
    case 'personal': return 'bg-gray-100 text-gray-800 border-gray-200';

    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Función utilitaria para obtener el color del estado de la reunión
export const getStatusColor = (status) => {
  switch (status) {
    case 'upcoming': return 'bg-yellow-100 text-yellow-800';
    case 'in-progress': return 'bg-green-100 text-green-800';
    case 'completed': return 'bg-gray-100 text-gray-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Función utilitaria para formatear la fecha
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};


