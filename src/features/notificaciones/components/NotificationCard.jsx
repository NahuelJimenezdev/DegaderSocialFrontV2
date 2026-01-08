import { useRef, useEffect, useState } from 'react';
import { logger } from '../../../shared/utils/logger';
import { getUserAvatar, handleImageError } from '../../../shared/utils/avatarUtils';

import styles from '../styles/NotificationCard.module.css';

// Función utilitaria para tiempo relativo
const getTimeAgo = (date) => {
  if (!date) return '';
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

export default function NotificationCard({
  tipo,
  nombre,
  avatar,
  mensaje,
  onAccept,
  onReject,
  leido,
  fechaCreacion,
  remitenteId,
  onProfileClick,
  isProcessed = false,
  notification = null
}) {
  const cardRef = useRef(null);
  const [removing, setRemoving] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Animación de entrada
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.animationDelay = `${Math.random() * 0.1}s`;
    }
  }, []);

  // Manejar acciones con feedback visual
  const handleAction = async (action, actionType) => {
    if (processing || isProcessed) return;

    setProcessing(true);
    setRemoving(true);

    try {
      await action();
    } catch (error) {
      logger.error(`Error en acción ${actionType}:`, error);
      setRemoving(false);
    } finally {
      setProcessing(false);
    }
  };

  // Manejar click en la card (fuera de botones)
  const handleCardClick = (e) => {
    // Solo si no es un botón y no está procesada
    if (!e.target.closest('button') && !isProcessed) {
      // Si es notificación de mensaje pendiente, redirigir a mensajes pendientes
      if (tipo === 'mensaje_pendiente' || notification?.tipo === 'mensaje_pendiente') {
        logger.log('📬 Navegando a mensajes pendientes');
        // Usar window.location para navegar a mensajes con tab=pending
        window.location.href = '/mensajes?tab=pending';
        return;
      }

      // Para otros tipos, navegar al perfil
      if (onProfileClick) {
        const userId = remitenteId?._id || remitenteId;
        if (userId) {
          logger.log('🔗 Navegando al perfil del usuario:', userId);
          onProfileClick(userId);
        }
      }
    }
  };


  // Determinar si es una solicitud (procesada o no)
  const messageText = mensaje || notification?.contenido || '';
  const isFriendRequest = (tipo === 'amistad' || tipo === 'solicitud_amistad') && messageText.includes('te envió una solicitud');
  const isGroupRequest = tipo === 'solicitud_grupo';

  // Determinar si se puede procesar (no procesada aún)
  const canProcessFriendRequest = isFriendRequest && !isProcessed;
  const canProcessGroupRequest = isGroupRequest && !isProcessed;

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${!leido ? styles.unread : ''} ${removing ? styles.cardRemove : styles.cardAnim} ${isProcessed ? styles.processed : ''}`}
      onClick={handleCardClick}
      style={{ cursor: isProcessed ? 'default' : 'pointer' }}
    >
      {/* Indicador de no leído */}
      {!leido && <div className={styles.unreadIndicator} />}

      {/* Avatar del usuario */}
      <div className={styles.avatarContainer}>
        <img
          src={typeof avatar === 'string' ? avatar : getUserAvatar(avatar)}
          alt={`Foto de perfil de ${nombre}`}
          className={styles.avatar}
          onError={handleImageError}
        />
      </div>

      {/* Contenido principal */}
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{nombre}</span>
            <span className={styles.timeAgo}>{getTimeAgo(fechaCreacion)}</span>
          </div>
        </div>

        <div className={styles.message}>{mensaje}</div>

        {/* Botones de acción para solicitudes de amistad */}
        {isFriendRequest && (
          <div className={styles.actions} role="group" aria-label="Acciones de solicitud de amistad">
            <button
              className={`${styles.actionButton} ${styles.acceptButton} ${isProcessed ? styles.disabled : ''}`}
              onClick={() => canProcessFriendRequest && handleAction(onAccept, 'accept')}
              disabled={processing || isProcessed}
              aria-label={`Confirmar solicitud de amistad de ${nombre}`}
              title={isProcessed ? 'Solicitud ya procesada' : 'Confirmar solicitud de amistad'}
            >
              {processing ? (
                <span className={styles.spinner} aria-hidden="true" />
              ) : (
                'Confirmar'
              )}
            </button>
            <button
              className={`${styles.actionButton} ${styles.rejectButton} ${isProcessed ? styles.disabled : ''}`}
              onClick={() => canProcessFriendRequest && handleAction(onReject, 'reject')}
              disabled={processing || isProcessed}
              aria-label={`Rechazar solicitud de amistad de ${nombre}`}
              title={isProcessed ? 'Solicitud ya procesada' : 'Rechazar solicitud de amistad'}
            >
              {processing ? (
                <span className={styles.spinner} aria-hidden="true" />
              ) : (
                'Eliminar'
              )}
            </button>
          </div>
        )}

        {/* Botones de acción para solicitudes de grupo */}
        {isGroupRequest && (
          <div className={styles.actions} role="group" aria-label="Acciones de solicitud de grupo">
            <button
              className={`${styles.actionButton} ${styles.acceptButton} ${isProcessed ? styles.disabled : ''}`}
              onClick={() => canProcessGroupRequest && handleAction(onAccept, 'accept')}
              disabled={processing || isProcessed}
              aria-label={`Aprobar solicitud de ${nombre} para unirse al grupo`}
              title={isProcessed ? 'Solicitud ya procesada' : 'Aprobar solicitud de grupo'}
            >
              {processing ? (
                <span className={styles.spinner} aria-hidden="true" />
              ) : (
                'Aprobar'
              )}
            </button>
            <button
              className={`${styles.actionButton} ${styles.rejectButton} ${isProcessed ? styles.disabled : ''}`}
              onClick={() => canProcessGroupRequest && handleAction(onReject, 'reject')}
              disabled={processing || isProcessed}
              aria-label={`Rechazar solicitud de ${nombre} para unirse al grupo`}
              title={isProcessed ? 'Solicitud ya procesada' : 'Rechazar solicitud de grupo'}
            >
              {processing ? (
                <span className={styles.spinner} aria-hidden="true" />
              ) : (
                'Rechazar'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Menú de opciones */}
      <div className={styles.menuButton}>
        <svg viewBox="0 0 20 20" width="16" height="16">
          <circle cx="10" cy="4" r="2" fill="currentColor" />
          <circle cx="10" cy="10" r="2" fill="currentColor" />
          <circle cx="10" cy="16" r="2" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}



