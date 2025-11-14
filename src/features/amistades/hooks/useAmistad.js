import { useState, useEffect } from 'react';
import { getSocket } from '../../../shared/lib/socket';
import { useAuth } from '../../../context/AuthContext';
import amistadService from '../services/amistadService';

export function useAmistad(usuarioId) {
  const [estado, setEstado] = useState('default');
  const socket = getSocket();
  const { user } = useAuth();

  // Consultar estado inicial
  useEffect(() => {
    if (!usuarioId) return;

    amistadService.getEstado(usuarioId)
      .then(res => setEstado(res.estado || 'default'))
      .catch(() => setEstado('default'));
  }, [usuarioId]);

  // Socket.IO - Escuchar actualizaciones en tiempo real
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (data) => {
      console.log('📨 [Amistad] Nueva notificación recibida:', data);

      // Filtrar solo notificaciones de actualización de amistad
      if (data.tipo === 'amistad:actualizada') {
        if (data.usuarioId && String(data.usuarioId) === String(usuarioId)) {
          console.log('✅ [Amistad] Actualizando estado a:', data.nuevoEstado);
          setEstado(data.nuevoEstado);
        }
      }
    };

    socket.on('newNotification', handleNewNotification);

    return () => {
      socket.off('newNotification', handleNewNotification);
    };
  }, [socket, usuarioId]);

  // Acciones
  const agregarAmigo = async () => {
    const userId = user?._id || user?.id;

    if (!userId || !usuarioId) {
      console.warn('[Amistad] Usuario no autenticado');
      return;
    }

    if (String(userId) === String(usuarioId)) {
      alert('No puedes enviarte una solicitud a ti mismo.');
      return;
    }

    const res = await amistadService.enviarSolicitud(usuarioId);
    if (res.success) {
      setEstado('enviada');
    } else {
      alert(res.message || 'Error al enviar solicitud');
    }
  };

  const aceptarAmigo = async () => {
    const res = await amistadService.aceptarSolicitud(usuarioId);
    if (res.success) setEstado('aceptado');
  };

  const cancelarAmigo = async () => {
    const res = await amistadService.cancelarSolicitud(usuarioId);
    if (res.success) setEstado('default');
  };

  const rechazarAmigo = async () => {
    const res = await amistadService.rechazarSolicitud(usuarioId);
    if (res.success) setEstado('default');
  };

  return { estado, agregarAmigo, aceptarAmigo, cancelarAmigo, rechazarAmigo };
}