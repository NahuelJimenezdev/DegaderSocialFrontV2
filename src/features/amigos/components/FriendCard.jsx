import { MessageSquare, MoreHorizontal, Cake, Star, Pin, BellOff, UserMinus, Ban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import styles from '../styles/FriendsPage.module.css';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';
import ConfirmationModal from './ConfirmationModal';
import { AlertDialog } from '../../../shared/components/AlertDialog';
import { useFriendActions } from '../hooks/useFriendActions';

export const FriendCard = ({ friend, onlineUsers, onUpdate }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Hook de acciones de amigos
  const {
    confirmAction,
    alertConfig,
    fullName,
    setConfirmAction,
    setAlertConfig,
    handleFavorite,
    handlePin,
    handleMute,
    handleUnfriendClick,
    handleBlockClick,
    handleUnblockClick,
    handleConfirmAction,
    isBirthdayToday,
    isOnlineByLastConnection
  } = useFriendActions(friend, onUpdate);

  const avatarUrl = getUserAvatar(friend);

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleCardClick = () => {
    navigate(`/perfil/${friend._id}`);
  };

  const handleMessageClick = (e) => {
    e.stopPropagation();
    navigate(`/mensajes?userId=${friend._id}`);
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();

    if (!showMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right
      });
    }

    setShowMenu(!showMenu);
  };

  // Determinar estado online
  const hasRealTimeData = onlineUsers !== null && onlineUsers !== undefined;
  const isOnlineRealTime = hasRealTimeData ? onlineUsers.has(friend._id) : null;
  const isOnlineFallback = isOnlineByLastConnection();
  const online = isOnlineRealTime !== null ? isOnlineRealTime : isOnlineFallback;

  const hasBirthday = isBirthdayToday();

  // Wrapper functions para cerrar menú
  const handleFavoriteWithClose = async (e) => {
    await handleFavorite(e);
    setShowMenu(false);
  };

  const handlePinWithClose = async (e) => {
    await handlePin(e);
    setShowMenu(false);
  };

  const handleMuteWithClose = async (e) => {
    await handleMute(e);
    setShowMenu(false);
  };

  const handleUnfriendWithClose = (e) => {
    handleUnfriendClick(e);
    setShowMenu(false);
  };

  const handleBlockWithClose = (e) => {
    handleBlockClick(e);
    setShowMenu(false);
  };

  const handleUnblockWithClose = (e) => {
    handleUnblockClick(e);
    setShowMenu(false);
  };

  return (
    <div className={`${styles.item} ${showMenu ? styles.itemMenuOpen : ''} ${friend.isBlocked ? styles.blockedItem : ''}`} onClick={handleCardClick}>
      <div className={styles.avatarWrap}>
        <img
          src={avatarUrl}
          alt={fullName}
          className={`${styles.avatar} ${friend.isBlocked ? styles.avatarBlocked : ''}`}
        />
        {friend.isBlocked ? (
          <div className={styles.blockedBadge} title="Usuario Bloqueado">
            <Ban size={12} color="white" />
          </div>
        ) : (
          <span className={online ? styles.onlineBadge : styles.offlineBadge} />
        )}
      </div>

      <div className={styles.meta}>
        <div className={styles.nameRow}>
          <div className={styles.name} style={friend.isBlocked ? { color: '#ef4444' } : {}}>{fullName}</div>
          {!friend.isBlocked && friend.isFavorite && (
            <Star size={14} fill="gold" color="gold" title="Favorito" />
          )}
          {!friend.isBlocked && friend.isPinned && (
            <Pin size={14} color="#3b82f6" title="Fijado" />
          )}
          {!friend.isBlocked && hasBirthday && (
            <div className={styles.birthday} title="¡Es su cumpleaños hoy!">
              <Cake size={16} />
            </div>
          )}
        </div>

        <div className={styles.subtitle}>
          {friend.isBlocked ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 600 }}>
              <span>Bloqueado</span>
            </div>
          ) : (
            <div className={online ? styles.onlineText : styles.offlineText}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{online ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          )}

          {!friend.isBlocked && (friend?.personal?.ubicacion?.ciudad || friend?.personal?.ubicacion?.pais) && (
            <div className={styles.cityInfo}>
              {friend.personal.ubicacion.ciudad && friend.personal.ubicacion.pais
                ? `${friend.personal.ubicacion.ciudad}, ${friend.personal.ubicacion.pais}`
                : friend.personal.ubicacion.ciudad || friend.personal.ubicacion.pais}
            </div>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        {!friend.isBlocked && (
          <button className={styles.iconBtn} onClick={handleMessageClick} title="Enviar mensaje">
            <MessageSquare size={18} />
          </button>
        )}

        <div className={styles.menuWrap}>
          <button
            ref={buttonRef}
            className={styles.iconBtn}
            onClick={handleMenuClick}
            title="Más opciones"
          >
            <MoreHorizontal size={18} />
          </button>

          {showMenu && (
            <div
              ref={menuRef}
              className={styles.dropdownMenu}
              style={{
                position: 'fixed',
                top: `${menuPosition.top}px`,
                right: `${menuPosition.right}px`
              }}
            >
              {!friend.isBlocked && (
                <>
                  <button className={styles.dropdownItem} onClick={handleFavoriteWithClose}>
                    <Star size={16} />
                    <span>{friend.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}</span>
                  </button>
                  <button className={styles.dropdownItem} onClick={handlePinWithClose}>
                    <Pin size={16} />
                    <span>{friend.isPinned ? 'Desfijar' : 'Fijar arriba'}</span>
                  </button>
                  <button className={styles.dropdownItem} onClick={handleMuteWithClose}>
                    <BellOff size={16} />
                    <span>{friend.isMuted ? 'Activar notificaciones' : 'Silenciar notificaciones'}</span>
                  </button>
                  <div className={styles.divider} />
                  <button onClick={handleUnfriendWithClose} className={styles.danger}>
                    <UserMinus size={16} />
                    Eliminar amigo
                  </button>
                </>
              )}

              {friend.isBlocked ? (
                <button onClick={handleUnblockWithClose} className={styles.dropdownItem} style={{ color: '#2563eb' }}>
                  <Ban size={16} />
                  <span>Desbloquear usuario</span>
                </button>
              ) : (
                <button onClick={handleBlockWithClose} className={styles.danger}>
                  <Ban size={16} />
                  Bloquear usuario
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        title={confirmAction?.title}
        message={confirmAction?.message}
        confirmText={
          confirmAction?.type === 'block' ? 'Bloquear' :
            confirmAction?.type === 'unblock' ? 'Desbloquear' : 'Eliminar'
        }
        isDangerous={confirmAction?.type !== 'unblock'}
      />

      <AlertDialog
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        variant={alertConfig.variant}
        message={alertConfig.message}
      />
    </div>
  );
};
