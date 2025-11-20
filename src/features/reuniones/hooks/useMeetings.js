import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import meetingService from '../services/meetingService';
import { getSocket } from '../../../shared/lib/socket';

export function useMeetings() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener las reuniones del usuario
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

  // Función para crear una nueva reunión
  const createNewMeeting = useCallback(async (meetingData) => {
    try {
      // 1. Crear la reunión en el backend
      const newMeeting = await meetingService.createMeeting(meetingData);

      // 2. Refrescar la lista completa desde el backend (evita duplicados)
      await fetchMeetings();

      return { success: true, meeting: newMeeting };
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Fallo al crear la reunión.';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  }, [fetchMeetings]);

  // Función para cancelar una reunión
  const cancelMeeting = useCallback(async (meetingId) => {
    try {
      await meetingService.cancelMeeting(meetingId);

      // Refrescar la lista después de cancelar
      await fetchMeetings();

      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Fallo al cancelar la reunión.';
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  }, [fetchMeetings]);

  // Efecto inicial: Cargar reuniones
  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  // Efecto Socket.IO: Suscribirse a actualizaciones de reuniones
  useEffect(() => {
    // Obtener userId del contexto de auth (solo el ID, no el objeto completo)
    const userId = user?._id || user?.id;

    if (!userId) {
      // Solo mostrar warning una vez
      if (user !== undefined) {
        console.warn('⚠️ userId no disponible para reuniones, esperando autenticación...');
      }
      return;
    }

    // Esperar a que el socket esté disponible
    const socket = getSocket();
    if (!socket) {
      console.warn('⚠️ Socket no inicializado aún, esperando conexión...');
      // Reintentar después de un breve delay
      const timer = setTimeout(() => {
        const retrySocket = getSocket();
        if (!retrySocket) {
          console.error('❌ Socket no pudo inicializarse para reuniones');
          return;
        }
        console.log('♻️ Socket inicializado, recargando componente...');
        window.location.reload();
      }, 1000);
      return () => clearTimeout(timer);
    }

    // Listener para actualizaciones de reuniones en tiempo real
    const handleMeetingUpdate = (data) => {
      console.log('📅 Actualización de reunión recibida:', data);

      const { type, meeting } = data;

      switch (type) {
        case 'create':
          // Nueva reunión creada
          setMeetings((prev) => {
            // Evitar duplicados
            if (prev.find((m) => m._id === meeting._id)) {
              return prev;
            }
            return [meeting, ...prev];
          });
          break;

        case 'update':
        case 'statusChange':
          // Reunión actualizada o cambio de estado
          setMeetings((prev) =>
            prev.map((m) => (m._id === meeting._id ? meeting : m))
          );
          break;

        case 'cancel':
          // Reunión cancelada
          setMeetings((prev) =>
            prev.map((m) =>
              m._id === meeting._id ? { ...m, status: 'cancelled' } : m
            )
          );
          break;

        default:
          console.warn('Tipo de evento desconocido:', type);
      }
    };

    // Función para suscribirse cuando el socket esté conectado
    const suscribirseAReuniones = () => {
      if (socket.connected) {
        socket.emit('subscribeMeetings', { userId });
        console.log('📅 Suscrito a reuniones para userId:', userId);
      } else {
        console.warn('⚠️ Socket no conectado aún, esperando...');
      }
    };

    // Listener para cuando el socket se conecte
    const handleConnect = () => {
      console.log('🔌 Socket conectado, suscribiendo a reuniones');
      suscribirseAReuniones();
    };

    // Si ya está conectado, suscribirse inmediatamente
    if (socket.connected) {
      suscribirseAReuniones();
    } else {
      // Si no está conectado, esperar al evento connect
      socket.on('connect', handleConnect);
    }

    // Registrar listener para actualizaciones
    socket.on('meetingUpdate', handleMeetingUpdate);

    // Cleanup: Desuscribirse al desmontar (pero NO desconectar el socket)
    return () => {
      console.log('🧹 Limpiando listeners de reuniones');
      socket.off('meetingUpdate', handleMeetingUpdate);
      socket.off('connect', handleConnect);

      // Desuscribirse de la sala (opcional, pero recomendado)
      if (socket.connected) {
        socket.emit('unsubscribeMeetings', { userId });
      }
    };
  }, [user?._id, user?.id]); // Solo depende del ID del usuario, no del objeto completo

  return {
    meetings,
    isLoading,
    error,
    createNewMeeting,
    cancelMeeting,
    refetch: fetchMeetings, // Permite recargar la lista manualmente
  };
}