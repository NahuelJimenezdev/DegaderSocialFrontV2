import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getSocket } from '../../../shared/lib/socket';
import notificationService from '../../../api/notificationService';
import friendshipService from '../../../api/friendshipService';
import groupService from '../../../api/groupService';
import NotificationCard from './NotificationCard';
import IglesiaNotificationCard from './IglesiaNotificationCard';
import styles from '../styles/NotificationsDropdown.module.css';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';
import { getNombreCompleto } from '../../../shared/utils/userUtils';

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
              const fromUserId = n.remitenteId?._id || n.emisor?._id || n.datos?.fromUserId;
              const isFromThisUser = String(fromUserId) === String(noti.usuarioId);
              const isFriendRequest = n.tipo === 'solicitud_amistad' || n.tipo === 'amistad';

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

      // Manejar cuando se cancela una solicitud enviada
      if (noti.tipo === 'solicitud_cancelada') {
        console.log('🚫 Solicitud cancelada por el usuario:', noti.usuarioId);
        setNotifications(prev => {
          return prev.filter(n => {
            const fromUserId = n.emisor?._id || n.remitenteId?._id || n.datos?.fromUserId;
            const isFromThisUser = String(fromUserId) === String(noti.usuarioId);
            const isFriendRequest = n.tipo === 'solicitud_amistad' || n.tipo === 'amistad';

            if (isFromThisUser && isFriendRequest) {
              console.log('🗑️ Eliminando notificación de solicitud cancelada:', n._id);
              return false;
            }
            return true;
          });
        });
        // No mostrar en dropdown
        return;
      }

      // Manejar cuando se rechaza una solicitud que envié
      if (noti.tipo === 'solicitud_rechazada') {
        console.log('❌ Mi solicitud fue rechazada por el usuario:', noti.usuarioId);

        // Filtrar la notificación de solicitud que envié
        setNotifications(prev => {
          return prev.filter(n => {
            const toUserId = n.receptor?._id || n.receptor;
            const isToThisUser = String(toUserId) === String(noti.usuarioId);
            const isFriendRequest = n.tipo === 'solicitud_amistad' || n.tipo === 'amistad';

            if (isToThisUser && isFriendRequest) {
              console.log('🗑️ Eliminando notificación de solicitud rechazada:', n._id);
              return false;
            }
            return true;
          });
        });

        // No mostrar en dropdown
        return;
      }

      // Manejar cuando una solicitud de iglesia es procesada (aceptada/rechazada) desde otro lugar
      if (noti.tipo === 'solicitudIglesiaProcesada') {
        console.log('⛪ Solicitud de iglesia procesada:', noti);
        setNotifications(prev => {
          return prev.filter(n => {
            // Verificar si es una notificación de solicitud de iglesia
            const isChurchRequest = n.tipo === 'solicitud_iglesia';
            if (!isChurchRequest) return true;

            // Verificar si coincide la iglesia
            const iglesiaId = n.referencia?.id || n.referencia?._id;
            if (String(iglesiaId) !== String(noti.iglesiaId)) return true;

            // Verificar si coincide el solicitante (applicantId)
            const solicitanteId = n.metadata?.solicitanteId || n.emisor?._id || n.emisor;
            if (noti.applicantId && String(solicitanteId) !== String(noti.applicantId)) return true;

            console.log('🗑️ Eliminando notificación de solicitud de iglesia procesada:', n._id);
            return false;
          });
        });
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

  // Filtrar solo notificaciones no leídas para el dropdown
  const unreadNotifications = Array.isArray(notifications)
    ? notifications.filter(n => !n.leido)
    : [];

  // Contador de no leídas
  const unreadCount = unreadNotifications.length;

  // Marcar notificación como leída
  const markAsRead = async (notificacionId) => {
    try {
      // Marcar en el backend
      await notificationService.markAsRead(notificacionId);

      // Actualizar en el estado local - remover de la lista de no leídas
      setNotifications(prev =>
        prev.map(n => n._id === notificacionId ? { ...n, leido: true } : n)
      );
    } catch (error) {
      console.error('❌ Error al marcar notificación como leída:', error);
    }
  };

  // Manejar aceptar solicitud de amistad
  const handleAccept = async (notificacion) => {
    // Prevenir procesamiento duplicado
    if (processedNotifications.has(notificacion._id)) {
      console.warn('⚠️ Notificación ya está siendo procesada');
      return;
    }

    try {
      console.log('✅ Aceptando solicitud de amistad:', notificacion);

      // Marcar como procesada inmediatamente para UI
      setProcessedNotifications(prev => new Set([...prev, notificacion._id]));

      // Marcar como leída
      if (!notificacion.leido) {
        markAsRead(notificacion._id);
      }

      // Validar que sea una solicitud de amistad procesable
      if (notificacion.tipo !== 'amistad' && notificacion.tipo !== 'solicitud_amistad') {
        console.warn('⚠️ Notificación no es de tipo amistad o solicitud_amistad');
        setProcessedNotifications(prev => {
          const newSet = new Set(prev);
          newSet.delete(notificacion._id);
          return newSet;
        });
        return;
      }

      // Solo procesar notificaciones de solicitudes entrantes
      if (!notificacion.mensaje?.includes('te envió una solicitud') && !notificacion.contenido?.includes('te envió una solicitud')) {
        console.warn('⚠️ Esta notificación no es una solicitud entrante:', notificacion.mensaje || notificacion.contenido);
        alert('Esta notificación no se puede procesar como solicitud entrante.');
        return;
      }

      // Obtener ID del remitente
      const fromUserId = notificacion.emisor?._id ||
        notificacion.emisor ||
        notificacion.remitenteId?._id ||
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
      console.error('❌ Error al aceptar solicitud:', error);

      // Si el error es 400 "La solicitud ya fue procesada", solo eliminar la notificación sin mostrar error
      if (error.response?.status === 400 && error.response?.data?.message?.includes('ya fue procesada')) {
        console.log('⚠️ La solicitud ya fue procesada, eliminando notificación');
        await notificationService.deleteNotification(notificacion._id);
        setNotifications(prev => prev.filter(n => n._id !== notificacion._id));
      } else {
        alert('Error al aceptar la solicitud');
        setProcessedNotifications(prev => {
          const newSet = new Set(prev);
          newSet.delete(notificacion._id);
          return newSet;
        });
      }
    }
  };

  // Manejar rechazar solicitud de amistad
  const handleReject = async (notificacion) => {
    // Prevenir procesamiento duplicado
    if (processedNotifications.has(notificacion._id)) {
      console.warn('⚠️ Notificación ya está siendo procesada');
      return;
    }

    try {
      // Validar que sea una solicitud de amistad entrante procesable
      if (!notificacion.mensaje?.includes('te envió una solicitud') && !notificacion.contenido?.includes('te envió una solicitud')) {
        console.warn('⚠️ Esta notificación no es una solicitud entrante procesable');
        return;
      }

      console.log('❌ Rechazando solicitud de amistad:', notificacion);

      // Marcar como procesada inmediatamente para UI
      setProcessedNotifications(prev => new Set([...prev, notificacion._id]));

      // Marcar como leída
      if (!notificacion.leido) {
        markAsRead(notificacion._id);
      }

      // Obtener ID del remitente
      const fromUserId = notificacion.emisor?._id ||
        notificacion.emisor ||
        notificacion.remitenteId?._id ||
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

      // Marcar como leída
      if (!notificacion.leido) {
        markAsRead(notificacion._id);
      }

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

      // Marcar como leída
      if (!notificacion.leido) {
        markAsRead(notificacion._id);
      }

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
    // Marcar como leída al hacer clic
    if (!notificacion.leido) {
      markAsRead(notificacion._id);
    }

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
          {unreadNotifications.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🔔</div>
              <div className={styles.emptyText}>No tienes notificaciones nuevas</div>
              <div className={styles.emptySubtext}>Cuando tengas nuevas notificaciones, aparecerán aquí</div>
            </div>
          ) : (
            <>
              <div className={styles.notificationsContainer}>
                {unreadNotifications.map(n => {
                // Determinar el nombre y avatar según el tipo de notificación
                let displayName = 'Usuario';
                let displayAvatar = null;
                let displayMessage = n.mensaje || n.contenido;

                // Helper para obtener nombre completo - maneja UserV2 estructura
                const getFullName = (user) => {
                  if (!user) return null;
                  // Use the shared utility function that handles UserV2
                  const nombre = getNombreCompleto(user);
                  return nombre !== 'Usuario' ? nombre : null;
                };

                // Helper para obtener avatar - maneja UserV2 estructura
                const getAvatar = (user) => {
                  if (!user) return null;
                  // Use the shared utility function that handles UserV2
                  return getUserAvatar(user);
                };

                const remitente = n.remitenteId || n.emisor || n.datos;
                
                if (remitente) {
                  displayName = getFullName(remitente) || displayName;
                  displayAvatar = getAvatar(remitente);
                }

                // Para notificaciones de grupo, usar el emisor explícitamente si existe
                if (n.tipo === 'solicitud_grupo' || n.tipo === 'solicitud_grupo_aprobada' || n.tipo === 'solicitud_grupo_rechazada') {
                  if (n.emisor) {
                    displayName = getFullName(n.emisor) || displayName;
                    displayAvatar = getAvatar(n.emisor);
                  }
                  // NO sobrescribir displayMessage - el backend ya construyó el mensaje completo con nombre de usuario
                  // displayMessage ya contiene: "Nombre Apellido solicitó unirse al grupo 'NombreGrupo'"
                }

                // Para notificaciones de iglesia, usar componente especializado
                if (n.tipo === 'solicitud_iglesia' || n.tipo === 'solicitud_iglesia_aprobada' || n.tipo === 'solicitud_iglesia_rechazada') {
                  return (
                    <IglesiaNotificationCard
                      key={n._id}
                      notification={n}
                      onAction={(notifId) => {
                        setNotifications(prev => prev.filter(notif => notif._id !== notifId));
                      }}
                    />
                  );
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
                  // displayAvatar se mantiene con el valor del emisor si existe
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
            <div
              className={styles.viewAllLink}
              onClick={() => {
                navigate('/notificaciones');
                setOpen(false);
              }}
            >
              Ver todas las notificaciones
            </div>
          </>
          )}
        </div>
      )}
    </div>
  );
}
