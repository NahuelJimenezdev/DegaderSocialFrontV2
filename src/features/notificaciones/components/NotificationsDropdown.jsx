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
import FundacionNotificationCard from './FundacionNotificationCard';
import styles from '../styles/NotificationsDropdown.module.css';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';
import { getNombreCompleto } from '../../../shared/utils/userUtils';
import { logger } from '../../../shared/utils/logger';
import { useNotifications } from '../hooks/useNotifications';
import { AlertDialog } from '../../../shared/components/AlertDialog';

// Helper functions moved outside to avoid recreation
const getFullName = (user) => {
  if (!user) return null;
  const nombre = getNombreCompleto(user);
  return nombre !== 'Usuario' ? nombre : null;
};

const getAvatar = (user) => {
  if (!user) return null;
  return getUserAvatar(user);
};

export default function NotificationsDropdown() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?._id || user?.id;
  const [open, setOpen] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, variant: 'info', message: '' });
  const bellRef = useRef(null);

  const {
    unreadNotifications,
    processedNotifications,
    markAsRead,
    handleAcceptFriend,
    handleRejectFriend,
    handleAcceptGroup,
    handleRejectGroup,
    deleteInformativeNotification,
    setNotifications
  } = useNotifications(user);

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
  const unreadCount = unreadNotifications.length;

  // Manejar acciones de amistad con validación de tipo
  const onAcceptFriendAction = async (notificacion) => {
    if (notificacion.tipo !== 'amistad' && notificacion.tipo !== 'solicitud_amistad') {
      return;
    }
    if (!notificacion.mensaje?.includes('te envió una solicitud') && !notificacion.contenido?.includes('te envió una solicitud')) {
      setAlertConfig({ isOpen: true, variant: 'warning', message: 'Esta notificación no se puede procesar como solicitud entrante.' });
      return;
    }
    try {
      await handleAcceptFriend(notificacion);
    } catch (error) {
      setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al aceptar la solicitud' });
    }
  };

  const onRejectFriendAction = async (notificacion) => {
    try {
      await handleRejectFriend(notificacion);
    } catch (error) {
      setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al rechazar la solicitud' });
    }
  };

  // Manejar navegación
  const handleProfileClick = async (notificacion) => {
    const typesToDelete = [
      'solicitud_iglesia_aprobada',
      'solicitud_iglesia_rechazada',
      'solicitud_fundacion_aprobada',
      'solicitud_fundacion_rechazada',
      'solicitud_grupo_aprobada',
      'solicitud_grupo_rechazada',
      'solicitud_rechazada',
      'solicitud_cancelada'
    ];

    if (typesToDelete.includes(notificacion.tipo)) {
      await deleteInformativeNotification(notificacion._id);
    } else if (!notificacion.leido) {
      markAsRead(notificacion._id);
    }

    if (notificacion.tipo === 'evento' && notificacion.metadata?.meetingId) {
      navigate('/Mis_reuniones', {
        state: { scrollToMeetingId: notificacion.metadata.meetingId }
      });
      setOpen(false);
      return;
    }

    if (['solicitud_grupo', 'solicitud_grupo_aprobada', 'solicitud_grupo_rechazada', 'promocion_admin_grupo', 'nuevo_miembro_grupo'].includes(notificacion.tipo)) {
      const groupId = notificacion.referencia?.id?._id || notificacion.referencia?.id;
      if (groupId) {
        navigate(`/Mis_grupos/${groupId}`, { state: { openMembersTab: true } });
        setOpen(false);
        return;
      }
    }

    if (['solicitud_iglesia', 'solicitud_iglesia_aprobada', 'solicitud_iglesia_rechazada'].includes(notificacion.tipo)) {
      const iglesiaId = notificacion.referencia?.id?._id || notificacion.referencia?.id;
      if (iglesiaId) {
        navigate(`/Mis_Iglesias/${iglesiaId}`);
        setOpen(false);
        return;
      }
    }

    if (['solicitud_fundacion', 'solicitud_fundacion_aprobada', 'solicitud_fundacion_rechazada'].includes(notificacion.tipo)) {
      navigate('/Mi_iglesia', { state: { activeTab: 'fundacion' } });
      setOpen(false);
      return;
    }

    console.log('🔔 [CLICK] Notification:', notificacion);
    console.log('🔔 [CLICK] Tipo:', notificacion.tipo);
    console.log('🔔 [CLICK] Referencia:', notificacion.referencia);

    if (notificacion.tipo === 'nuevo_anuncio') {
      navigate('/admin/publicidad');
      setOpen(false);
      return;
    }

    // Navegación a Publicación (Post)
    // Tipos: like_post, comentario_post, respuesta_comentario, like_comentario, compartir_post
    // Navegación a Publicación (Post)
    const postTypes = ['like_post', 'comentario_post', 'respuesta_comentario', 'like_comentario', 'compartir_post'];
    if (postTypes.includes(notificacion.tipo)) {
      let postId = null;

      // Intentar extraer ID de la referencia
      if (notificacion.referencia && notificacion.referencia.id) {
        // Caso 1: referencia.id es un objeto poblado (Post) -> usar ._id
        if (typeof notificacion.referencia.id === 'object' && notificacion.referencia.id._id) {
          postId = notificacion.referencia.id._id;
        }
        // Caso 2: referencia.id es un string directo
        else if (typeof notificacion.referencia.id === 'string') {
          postId = notificacion.referencia.id;
        }
        // Caso 3: referencia.id es el objeto pero sin _id (raro, pero posible si es un POJO)
        else if (typeof notificacion.referencia.id === 'object') {
          // Fallback: asumir que el objeto mismo tiene un id si no es mongo doc standard o algo asi
          // Pero según logs user tiene _id.
          postId = notificacion.referencia.id._id || notificacion.referencia.id.id;
        }
      }

      if (postId) {
        let navPath = `/publicacion/${postId}`;

        // Extract comment ID from metadata (if available) for deep linking
        const commentId = notificacion.metadata?.commentId;
        if (commentId) {
          navPath += `?commentId=${commentId}`;
        }

        navigate(navPath);
        setOpen(false);
        return;
      }
    }

    const profileUserId = notificacion.remitenteId?._id || notificacion.remitenteId || notificacion.datos?.fromUserId;
    if (profileUserId && profileUserId !== userId) {
      navigate(`/perfil/${profileUserId}`);
      setOpen(false);
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
                  let displayName = 'Usuario';
                  let displayAvatar = null;
                  let displayMessage = n.mensaje || n.contenido;

                  const remitente = n.remitenteId || n.emisor || n.datos;
                  if (remitente) {
                    const nombre = getNombreCompleto(remitente);
                    displayName = nombre !== 'Usuario' ? nombre : displayName;
                    displayAvatar = getUserAvatar(remitente);
                  }

                  // Manejo específico para notificaciones de likes
                  if (n.tipo === 'like_post' && n.emisor) {
                    const nombre = getNombreCompleto(n.emisor);
                    displayName = nombre !== 'Usuario' ? nombre : displayName;
                    displayAvatar = getUserAvatar(n.emisor);
                  }

                  if (['solicitud_grupo', 'solicitud_grupo_aprobada', 'solicitud_grupo_rechazada', 'promocion_admin_grupo'].includes(n.tipo)) {
                    if (n.emisor) {
                      const nombre = getNombreCompleto(n.emisor);
                      displayName = nombre !== 'Usuario' ? nombre : displayName;
                      displayAvatar = getUserAvatar(n.emisor);
                    }
                    if (n.tipo === 'promocion_admin_grupo' && n.referencia?.id?.nombre) {
                      displayMessage = `${displayName} ${n.contenido} "${n.referencia.id.nombre}"`;
                    }
                  }

                  if (['solicitud_iglesia', 'solicitud_iglesia_aprobada', 'solicitud_iglesia_rechazada'].includes(n.tipo)) {
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

                  if (['solicitud_fundacion', 'solicitud_fundacion_aprobada', 'solicitud_fundacion_rechazada'].includes(n.tipo)) {
                    return (
                      <FundacionNotificationCard
                        key={n._id}
                        notification={n}
                        onAction={(notifId) => {
                          setNotifications(prev => prev.filter(notif => notif._id !== notifId));
                        }}
                      />
                    );
                  }

                  if (n.tipo === 'evento') {
                    const titles = {
                      meeting_created: 'Nueva Reunión',
                      meeting_reminder: 'Recordatorio',
                      meeting_starting: 'Reunión en Curso',
                      meeting_cancelled: 'Reunión Cancelada'
                    };
                    displayName = titles[n.metadata?.eventType] || 'Notificación de Reunión';
                    displayMessage = n.contenido;
                  }

                  if (n.tipo === 'nuevo_anuncio') {
                    displayName = 'Nuevo Anuncio';
                    displayAvatar = null;
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
                      onAccept={n.tipo === 'solicitud_grupo' ? () => handleAcceptGroup(n) : () => onAcceptFriendAction(n)}
                      onReject={n.tipo === 'solicitud_grupo' ? () => handleRejectGroup(n) : () => onRejectFriendAction(n)}
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

      {/* AlertDialog Component */}
      <AlertDialog
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        variant={alertConfig.variant}
        message={alertConfig.message}
      />
    </div>
  );
}



