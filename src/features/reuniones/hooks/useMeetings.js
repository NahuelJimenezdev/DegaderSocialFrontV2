import { useState, useEffect, useCallback } from 'react';
import { logger } from '../../../shared/utils/logger';
import { useAuth } from '../../../context/AuthContext';
import meetingService from '../services/meetingService';
import { getSocket } from '../../../shared/lib/socket';

export function useMeetings() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMeetings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await meetingService.getMyMeetings();
      setMeetings(data);
    } catch (err) {
      setError(err.message || 'Error al cargar las reuniones.');
      setMeetings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createNewMeeting = useCallback(async (meetingData) => {
    try {
      const newMeeting = await meetingService.createMeeting(meetingData);
      await fetchMeetings();
      return { success: true, meeting: newMeeting };
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Fallo al crear la reunión.';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  }, [fetchMeetings]);

  const cancelMeeting = useCallback(async (meetingId) => {
    try {
      const result = await meetingService.cancelMeeting(meetingId);
      await fetchMeetings();
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Fallo al cancelar la reunión.';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  }, [fetchMeetings]);

  /** Usuario presiona "Asistiré" */
  const requestAttendance = useCallback(async (meetingId) => {
    try {
      const result = await meetingService.requestAttendance(meetingId);
      await fetchMeetings();
      return { success: true, ...result };
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Error al enviar solicitud.';
      return { success: false, error: errMsg };
    }
  }, [fetchMeetings]);

  /** Creador aprueba o deniega a un usuario */
  const respondAttendance = useCallback(async (meetingId, userId, action) => {
    try {
      const result = await meetingService.respondAttendance(meetingId, userId, action);
      await fetchMeetings();
      return { success: true, ...result };
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Error al responder solicitud.';
      return { success: false, error: errMsg };
    }
  }, [fetchMeetings]);

  /** Obtener detalle completo (solo creador) */
  const getMeetingDetail = useCallback(async (meetingId) => {
    try {
      const data = await meetingService.getMeetingDetail(meetingId);
      return { success: true, data };
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Error al obtener detalle.';
      return { success: false, error: errMsg };
    }
  }, []);

  /** Editar reunión */
  const updateMeeting = useCallback(async (meetingId, data) => {
    try {
      const updated = await meetingService.updateMeeting(meetingId, data);
      await fetchMeetings();
      return { success: true, data: updated };
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Error al actualizar.';
      return { success: false, error: errMsg };
    }
  }, [fetchMeetings]);

  // Carga inicial
  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  // Socket.IO
  useEffect(() => {
    const userId = user?._id || user?.id;
    if (!userId) return;

    const socket = getSocket();
    if (!socket) {
      const timer = setTimeout(() => {
        const retrySocket = getSocket();
        if (!retrySocket) return;
        window.location.reload();
      }, 1000);
      return () => clearTimeout(timer);
    }

    const handleMeetingUpdate = (data) => {
      const { type, meeting } = data;
      switch (type) {
        case 'create':
          setMeetings(prev =>
            prev.find(m => m._id === meeting._id) ? prev : [meeting, ...prev]
          );
          break;
        case 'update':
        case 'statusChange':
          setMeetings(prev => prev.map(m => m._id === meeting._id ? meeting : m));
          break;
        case 'cancel':
          setMeetings(prev =>
            prev.map(m => m._id === meeting._id ? { ...m, status: 'cancelled' } : m)
          );
          break;
        default:
          logger.warn('Tipo de evento desconocido:', type);
      }
    };

    const suscribirse = () => {
      if (socket.connected) socket.emit('subscribeMeetings', { userId });
    };

    const handleConnect = () => suscribirse();

    if (socket.connected) {
      suscribirse();
    } else {
      socket.on('connect', handleConnect);
    }

    socket.on('meetingUpdate', handleMeetingUpdate);

    return () => {
      socket.off('meetingUpdate', handleMeetingUpdate);
      socket.off('connect', handleConnect);
      if (socket.connected) socket.emit('unsubscribeMeetings', { userId });
    };
  }, [user?._id, user?.id]);

  return {
    meetings,
    isLoading,
    error,
    createNewMeeting,
    cancelMeeting,
    requestAttendance,
    respondAttendance,
    getMeetingDetail,
    updateMeeting,
    refetch: fetchMeetings,
  };
}
