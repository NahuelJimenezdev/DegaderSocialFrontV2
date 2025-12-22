import { useState, useEffect } from 'react';
import { logger } from '../../../shared/utils/logger';
import { getSocket } from '../../../shared/lib/socket';
import { useAuth } from '../../../context/AuthContext';
import amistadService from '../services/amistadService';

export function useAmistad(usuarioId) {
  const [estado, setEstado] = useState('default');
  const [friendshipId, setFriendshipId] = useState(null);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, variant: 'info', message: '' });
  const socket = getSocket();
  const { user } = useAuth();

  logger.log('🔄 [useAmistad] Hook renderizado - usuarioId:', usuarioId, 'estado:', estado);

  // Consultar estado inicial
  useEffect(() => {
    if (!usuarioId) return;

    amistadService.getEstado(usuarioId)
      .then(res => {
        if (res.success && res.data) {
          // Mapear estados del backend a estados del frontend
          let estadoFrontend = 'default';

          if (res.data.status === 'self') {
            estadoFrontend = 'self'; // Es el mismo usuario
          } else if (res.data.status === 'none') {
            estadoFrontend = 'default'; // No hay relación
          } else if (res.data.status === 'pendiente') {
            // Si está pendiente, verificar si yo envié o recibí la solicitud
            estadoFrontend = res.data.isSender ? 'enviada' : 'recibida';
          } else if (res.data.status === 'aceptada') {
            estadoFrontend = 'aceptado'; // Amistad aceptada
          } else if (res.data.status === 'rechazada') {
            estadoFrontend = 'rechazado'; // Amistad rechazada
          }

          setEstado(estadoFrontend);
          setFriendshipId(res.data.friendshipId);
        }
      })
      .catch(() => setEstado('default'));
  }, [usuarioId]);

  // Socket.IO - Escuchar actualizaciones en tiempo real
  useEffect(() => {
    if (!socket || !user) return;

    const handleNewNotification = (data) => {
      // Si soy el receptor de una solicitud de este usuario
      if (data.tipo === 'solicitud_amistad' &&
        (data.emisor?._id === usuarioId || data.emisor === usuarioId)) {
        logger.log('📨 [Amistad] Solicitud recibida de este usuario');
        logger.log('📨 [Amistad] Datos del evento:', data);
        // Lo ideal sería recargar el estado para obtener el friendshipId
        amistadService.getEstado(usuarioId).then(res => {
          logger.log('📨 [Amistad] Estado recargado:', res.data);
          if (res.success && res.data) {
            setFriendshipId(res.data.friendshipId);
            // Mapear el estado correctamente
            let estadoFrontend = 'default';
            if (res.data.status === 'pendiente') {
              estadoFrontend = res.data.isSender ? 'enviada' : 'recibida';
            } else if (res.data.status === 'aceptada') {
              estadoFrontend = 'aceptado';
            } else if (res.data.status === 'rechazada') {
              estadoFrontend = 'rechazado';
            }
            logger.log('📨 [Amistad] Nuevo estado:', estadoFrontend);
            setEstado(estadoFrontend);
          }
        }).catch(err => {
          logger.error('📨 [Amistad] Error al recargar estado:', err);
        });
      }

      // Si aceptaron mi solicitud
      if (data.tipo === 'amistad_aceptada' &&
        (data.emisor?._id === usuarioId || data.emisor === usuarioId)) {
        logger.log('✅ [Amistad] Solicitud aceptada por este usuario');
        setEstado('aceptado');
      }

      // Si se actualizó el estado de amistad (evento en tiempo real)
      if (data.tipo === 'amistad:actualizada' && data.usuarioId === usuarioId) {
        logger.log('🔄 [Amistad] Estado actualizado:', data.nuevoEstado);
        setEstado(data.nuevoEstado);
      }

      // Si eliminaron la amistad o cancelaron la solicitud
      if (data.tipo === 'amistad_eliminada' || data.tipo === 'solicitud_cancelada') {
        // Verificar si el emisor es el usuario que estamos monitoreando
        const eliminadorId = data.emisor?._id || data.emisor || data.usuarioId;
        const eliminadorIdStr = String(eliminadorId);
        const usuarioIdStr = String(usuarioId);

        logger.log('🔍 [Amistad] Verificando eliminación/cancelación - eliminadorId:', eliminadorIdStr, 'usuarioId:', usuarioIdStr);

        if (eliminadorIdStr === usuarioIdStr) {
          logger.log('❌ [Amistad] Amistad eliminada o solicitud cancelada por este usuario');
          setEstado('default');
          setFriendshipId(null);
        }
      }
    };

    socket.on('newNotification', handleNewNotification);

    return () => {
      socket.off('newNotification', handleNewNotification);
    };
  }, [socket, usuarioId, user]);

  // Acciones
  const agregarAmigo = async () => {
    const userId = user?._id || user?.id;

    if (!userId || !usuarioId) return;

    if (String(userId) === String(usuarioId)) {
      setAlertConfig({ isOpen: true, variant: 'warning', message: 'No puedes enviarte una solicitud a ti mismo.' });
      return;
    }

    try {
      const res = await amistadService.enviarSolicitud(usuarioId);
      if (res.success) {
        setEstado('enviada');
        setFriendshipId(res.data._id); // Guardar ID de la nueva amistad
      }
    } catch (error) {
      logger.error('Error al enviar solicitud:', error);
      setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al enviar solicitud' });
    }
  };

  const aceptarAmigo = async () => {
    if (!friendshipId) return;
    try {
      const res = await amistadService.aceptarSolicitud(friendshipId);
      if (res.success) setEstado('aceptado');
    } catch (error) {
      logger.error('Error al aceptar solicitud:', error);
    }
  };

  const cancelarAmigo = async () => {
    // Para cancelar/eliminar usamos el ID del usuario amigo, no el de la amistad (según endpoint delete /:friendId)
    try {
      const res = await amistadService.cancelarSolicitud(usuarioId);
      if (res.success) {
        setEstado('default');
        setFriendshipId(null);
      }
    } catch (error) {
      logger.error('Error al cancelar/eliminar:', error);
    }
  };

  const rechazarAmigo = async () => {
    if (!friendshipId) return;
    try {
      const res = await amistadService.rechazarSolicitud(friendshipId);
      if (res.success) {
        setEstado('default');
        setFriendshipId(null);
      }
    } catch (error) {
      logger.error('Error al rechazar solicitud:', error);
    }
  };

  return { estado, agregarAmigo, aceptarAmigo, cancelarAmigo, rechazarAmigo, alertConfig, setAlertConfig };
}


