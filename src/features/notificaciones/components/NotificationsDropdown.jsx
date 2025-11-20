import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getSocket } from '../../../shared/lib/socket';
import notificationService from '../../../api/notificationService';
import friendshipService from '../../../api/friendshipService';
import groupService from '../../../api/groupService';
import NotificationCard from './NotificationCard';
import styles from '../styles/NotificationsDropdown.module.css';

export default function NotificationsDropdown() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?._id || user?.id;
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [processedNotifications, setProcessedNotifications] = useState(new Set());
  const bellRef = useRef(null);

  // Fetch inicial por REST
  useEffect(() => {
    async function fetchNotifications() {
      if (!userId) return;
      try {
        const data = await notificationService.getAllNotifications();
        console.log('📥 Datos de notificaciones recibidos:', data);

        // Manejar diferentes estructuras de respuesta del backend
        let notificacionesArray = [];

        if (Array.isArray(data)) {
          notificacionesArray = data;
        } else if (Array.isArray(data?.data)) {
          notificacionesArray = data.data;
        } else if (Array.isArray(data?.notificaciones)) {
          notificacionesArray = data.notificaciones;
        } else if (data?.data && typeof data.data === 'object' && Array.isArray(data.data.notifications)) {
          notificacionesArray = data.data.notifications;
        }

        console.log('✅ Notificaciones procesadas:', notificacionesArray.length);
        setNotifications(notificacionesArray);
      } catch (e) {
        console.error('❌ Error al cargar notificaciones:', e);
        setNotifications([]); // Asegurar que siempre sea un array
      }
    }
    fetchNotifications();
  }, [userId]);

  // Socket.io en tiempo real
  useEffect(() => {
    if (!user || !userId) {
      console.log('⚠️ Usuario no disponible para socket de notificaciones');
      return;
    }

    const socket = getSocket();
    if (!socket) {
      // Socket.IO no está disponible en este backend, se usará polling HTTP
      return;
    }

    // Función para suscribirse cuando el socket esté listo
    const suscribirseANotificaciones = () => {
      console.log('📡 Suscribiendo a notificaciones para userId:', userId);
      if (socket.connected) {
        socket.emit('subscribeNotifications', { userId });
        console.log('✅ Suscrito a notificaciones');
      } else {
        console.warn('⚠️ Socket no conectado aún, esperando...');
      }
    };

    // Listener para notificaciones
    const handleNotification = (noti) => {
      console.log('🔔 Nueva notificación recibida:', noti);

      // Manejar notificaciones de actualización de estado de amistad
      if (noti.tipo === 'amistad:actualizada') {
        console.log('⚠️ Notificación de actualización de estado:', noti);

        // Si la amistad fue aceptada o rechazada, eliminar la notificación de solicitud
        if (noti.nuevoEstado === 'aceptado' || noti.nuevoEstado === 'default') {
          setNotifications(prev => {
            // Filtrar notificaciones de solicitud de amistad del usuario correspondiente
            return prev.filter(n => {
              const fromUserId = n.remitenteId?._id || n.datos?.fromUserId;
              const isFromThisUser = String(fromUserId) === String(noti.usuarioId);
              const isFriendRequest = n.tipo === 'amistad' && n.mensaje?.includes('te envió una solicitud');

              // Eliminar si es una solicitud de amistad de este usuario
              if (isFromThisUser && isFriendRequest) {
                console.log('🗑️ Eliminando notificación de solicitud procesada:', n._id);
                return false;
              }
              return true;
            });
          });
        }

        // No mostrar en dropdown
        return;
      }

      setNotifications(prev => {
        // Evitar notificaciones duplicadas por ID
        if (prev.some(existingNoti => existingNoti._id === noti._id)) {
          console.log('⚠️ Notificación duplicada detectada, ignorando:', noti._id);
          return prev;
        }

        const nuevasNotificaciones = [noti, ...prev];
        console.log('📊 Notificaciones después de agregar:', nuevasNotificaciones.length);
        return nuevasNotificaciones;
      });
    };

    // Listener para cuando el socket se conecte
    const handleConnect = () => {
      console.log('🔌 Socket conectado, suscribiendo a notificaciones');
      suscribirseANotificaciones();
    };

    // Si ya está conectado, suscribirse inmediatamente
    if (socket.connected) {
      suscribirseANotificaciones();
    } else {
      // Si no está conectado, esperar al evento connect
      socket.on('connect', handleConnect);
    }

    // Escuchar notificaciones (evento correcto: newNotification)
    socket.on('newNotification', handleNotification);

    return () => {
      console.log('🧹 Limpiando listeners de notificaciones');
      socket.off('newNotification', handleNotification);
      socket.off('connect', handleConnect);
    };
  }, [user, userId]);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Contador de no leídas
  const unreadCount = Array.isArray(notifications)
    ? notifications.filter(n => !n.leido).length
    : 0;

  // Marcar como leídas al abrir
  useEffect(() => {
    if (open && unreadCount > 0) {
      // Marcar todas como leídas (optimistic update)
      setNotifications(prev => prev.map(n => ({ ...n, leido: true })));

      // Llamar al backend
      notificationService.markAllAsRead().catch(err => {
        console.error('❌ Error al marcar notificaciones como leídas:', err);
      });
    }
  }, [open, unreadCount]);

  // Manejar aceptar solicitud de amistad
  const handleAccept = async (notificacion) => {
    try {
      console.log('✅ Aceptando solicitud de amistad:', notificacion);

      // Marcar como procesada inmediatamente para UI
      setProcessedNotifications(prev => new Set([...prev, notificacion._id]));

      // Validar que sea una solicitud de amistad procesable
      if (notificacion.tipo !== 'amistad') {
        console.warn('⚠️ Notificación no es de tipo amistad');
        return;
      }

      // Solo procesar notificaciones de solicitudes entrantes
      if (!notificacion.mensaje.includes('te envió una solicitud')) {
        console.warn('⚠️ Esta notificación no es una solicitud entrante:', notificacion.mensaje);
        alert('Esta notificación no se puede procesar como solicitud entrante.');
        return;
      }

      // Obtener ID del remitente
      const fromUserId = notificacion.remitenteId?._id ||
        notificacion.remitenteId ||
        notificacion.datos?.fromUserId;

      if (!fromUserId) {
        console.error('❌ No se pudo obtener el ID del remitente');
        alert('Error: No se puede identificar el remitente de la solicitud');
        setProcessedNotifications(prev => {
          const newSet = new Set(prev);
          newSet.delete(notificacion._id);
          return newSet;
        });
        return;
      }

      // Aceptar solicitud (endpoint adaptado a V2)
      // El backend emitirá automáticamente los eventos Socket.IO 'amistad:actualizada'
      await friendshipService.acceptFriendRequest(fromUserId);
      console.log('✅ Solicitud de amistad aceptada exitosamente');

      // Eliminar la notificación
      await notificationService.deleteNotification(notificacion._id);

      // Remover notificación de la lista
      setNotifications(prev => prev.filter(n => n._id !== notificacion._id));
    } catch (error) {
      console.error('❌ Error inesperado al aceptar solicitud:', error);
      alert('Error inesperado al aceptar la solicitud');
      setProcessedNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificacion._id);
        return newSet;
      });
    }
  };

  // Manejar rechazar solicitud de amistad
  const handleReject = async (notificacion) => {
    try {
      // Validar que sea una solicitud de amistad entrante procesable
      if (!notificacion.mensaje?.includes('te envió una solicitud')) {
        console.warn('⚠️ Esta notificación no es una solicitud entrante procesable');
        return;
      }

      console.log('❌ Rechazando solicitud de amistad:', notificacion);

      // Marcar como procesada inmediatamente para UI
      setProcessedNotifications(prev => new Set([...prev, notificacion._id]));

      // Obtener ID del remitente
      const fromUserId = notificacion.remitenteId?._id ||
        notificacion.remitenteId ||
        notificacion.datos?.fromUserId;

      if (!fromUserId) {
        console.error('❌ No se pudo obtener el ID del remitente');
        alert('Error: No se puede identificar el remitente de la solicitud');
        setProcessedNotifications(prev => {
          const newSet = new Set(prev);
          newSet.delete(notificacion._id);
          return newSet;
        });
        return;
      }

      // Rechazar solicitud
      // El backend emitirá automáticamente los eventos Socket.IO 'amistad:actualizada'
      await friendshipService.rejectFriendRequest(fromUserId);
      console.log('✅ Solicitud de amistad rechazada exitosamente');

      // Eliminar la notificación
      await notificationService.deleteNotification(notificacion._id);

      // Remover notificación de la lista
      setNotifications(prev => prev.filter(n => n._id !== notificacion._id));
    } catch (error) {
      console.error('❌ Error inesperado al rechazar solicitud:', error);
      alert('Error inesperado al rechazar la solicitud');
      setProcessedNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificacion._id);
        return newSet;
      });
    }
  };

  // Manejar aceptar solicitud de grupo
  const handleAcceptGroupRequest = async (notificacion) => {
    try {
      console.log('✅ Aceptando solicitud de grupo:', notificacion);

      // Marcar como procesada inmediatamente para UI
      setProcessedNotifications(prev => new Set([...prev, notificacion._id]));

      // Validar que sea una solicitud de grupo procesable
      if (notificacion.tipo !== 'solicitud_grupo') {
        console.warn('⚠️ Notificación no es de tipo solicitud_grupo');
        return;
      }

      // Obtener IDs del emisor y del grupo
      const requestUserId = notificacion.emisor?._id || notificacion.emisor;
      const groupId = notificacion.referencia?.id;

      if (!requestUserId || !groupId) {
        console.error('❌ No se pudo obtener el ID del usuario o del grupo');
        alert('Error: No se puede identificar el usuario o grupo de la solicitud');
        setProcessedNotifications(prev => {
          const newSet = new Set(prev);
          newSet.delete(notificacion._id);
          return newSet;
        });
        return;
      }

      // Aprobar solicitud de unión al grupo
      await groupService.acceptJoinRequest(groupId, requestUserId);
      console.log('✅ Solicitud de grupo aceptada exitosamente');

      // Eliminar la notificación
      await notificationService.deleteNotification(notificacion._id);

      // Remover notificación de la lista
      setNotifications(prev => prev.filter(n => n._id !== notificacion._id));
    } catch (error) {
      console.error('❌ Error inesperado al aceptar solicitud de grupo:', error);
      alert('Error inesperado al aceptar la solicitud de grupo');
      setProcessedNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificacion._id);
        return newSet;
      });
    }
  };

  // Manejar rechazar solicitud de grupo
  const handleRejectGroupRequest = async (notificacion) => {
    try {
      console.log('❌ Rechazando solicitud de grupo:', notificacion);

      // Marcar como procesada inmediatamente para UI
      setProcessedNotifications(prev => new Set([...prev, notificacion._id]));

      // Validar que sea una solicitud de grupo procesable
      if (notificacion.tipo !== 'solicitud_grupo') {
        console.warn('⚠️ Notificación no es de tipo solicitud_grupo');
        return;
      }

      // Obtener IDs del emisor y del grupo
      const requestUserId = notificacion.emisor?._id || notificacion.emisor;
      const groupId = notificacion.referencia?.id;

      if (!requestUserId || !groupId) {
        console.error('❌ No se pudo obtener el ID del usuario o del grupo');
        alert('Error: No se puede identificar el usuario o grupo de la solicitud');
        setProcessedNotifications(prev => {
          const newSet = new Set(prev);
          newSet.delete(notificacion._id);
          return newSet;
        });
        return;
      }

      // Rechazar solicitud de unión al grupo
      await groupService.rejectJoinRequest(groupId, requestUserId);
      console.log('✅ Solicitud de grupo rechazada exitosamente');

      // Eliminar la notificación
      await notificationService.deleteNotification(notificacion._id);

      // Remover notificación de la lista
      setNotifications(prev => prev.filter(n => n._id !== notificacion._id));
    } catch (error) {
      console.error('❌ Error inesperado al rechazar solicitud de grupo:', error);
      alert('Error inesperado al rechazar la solicitud de grupo');
      setProcessedNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificacion._id);
        return newSet;
      });
    }
  };

  // Manejar navegación al perfil del usuario o a reuniones
  const handleProfileClick = (notificacion) => {
    // Si es una notificación de reunión, navegar a reuniones con el meetingId
    if (notificacion.tipo === 'evento' && notificacion.metadata?.meetingId) {
      console.log('📅 Navegando a reunión específica:', notificacion.metadata.meetingId);
      navigate('/Mis_reuniones', {
        state: { scrollToMeetingId: notificacion.metadata.meetingId }
      });
      setOpen(false);
      return;
    }

    // Si no, navegar al perfil
    const profileUserId = notificacion.remitenteId?._id ||
      notificacion.remitenteId ||
      notificacion.datos?.fromUserId;

    if (profileUserId && profileUserId !== userId) {
      console.log('🔗 Navegando al perfil del usuario:', profileUserId);
      navigate(`/perfil/${profileUserId}`);
      setOpen(false); // Cerrar dropdown
    }
  };

  return (
    <div className={styles.dropdownContainer} ref={bellRef}>
      <button className={styles.bellButton} onClick={() => setOpen(!open)}>
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className={styles.badge}>
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className={`${styles.dropdownMenu} ${styles.dropdownAnim}`}>
          <h4 className={styles.title}>Notificaciones</h4>
          {notifications.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🔔</div>
              <div className={styles.emptyText}>No tienes notificaciones</div>
              <div className={styles.emptySubtext}>Cuando tengas nuevas notificaciones, aparecerán aquí</div>
            </div>
          ) : (
            <div className={styles.notificationsContainer}>
              {notifications.map(n => {
                // Determinar el nombre y avatar según el tipo de notificación
                let displayName = n.remitenteId?.nombre || n.datos?.nombre;
                let displayAvatar = n.remitenteId?.avatar || n.datos?.avatar;
                let displayMessage = n.mensaje || n.contenido;

                // Para notificaciones de grupo, usar el emisor
                if (n.tipo === 'solicitud_grupo' || n.tipo === 'solicitud_grupo_aprobada' || n.tipo === 'solicitud_grupo_rechazada') {
                  displayName = `${n.emisor?.nombre || ''} ${n.emisor?.apellido || ''}`.trim() || 'Usuario';
                  displayAvatar = n.emisor?.avatar;
                  displayMessage = n.contenido;
                }

                // Para notificaciones de reuniones (tipo === 'evento')
                if (n.tipo === 'evento') {
                  const eventType = n.metadata?.eventType;
                  const titles = {
                    meeting_created: 'Nueva Reunión',
                    meeting_reminder: 'Recordatorio',
                    meeting_starting: 'Reunión en Curso',
                    meeting_cancelled: 'Reunión Cancelada'
                  };
                  displayName = titles[eventType] || 'Notificación de Reunión';
                  displayMessage = n.contenido;
                  displayAvatar = null; // Sin avatar, se mostrará icono
                }

                return (
                  <NotificationCard
                    key={n._id}
                    tipo={n.tipo}
                    nombre={displayName}
                    avatar={displayAvatar}
                    mensaje={displayMessage}
                    leido={n.leido}
                    fechaCreacion={n.fechaCreacion || n.createdAt}
                    remitenteId={n.remitenteId || n.emisor}
                    onAccept={n.tipo === 'solicitud_grupo' ? () => handleAcceptGroupRequest(n) : () => handleAccept(n)}
                    onReject={n.tipo === 'solicitud_grupo' ? () => handleRejectGroupRequest(n) : () => handleReject(n)}
                    onProfileClick={() => handleProfileClick(n)}
                    isProcessed={processedNotifications.has(n._id)}
                    notification={n}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
