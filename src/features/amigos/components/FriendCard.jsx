import { MessageSquare, MoreHorizontal, Cake, Star, Pin, BellOff, UserMinus, Ban, MoreVertical, MessageCircle, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import styles from '../styles/FriendsPage.module.css'
import { getUserAvatar } from '../../../shared/utils/avatarUtils'
import * as friendshipActionsService from '../../../api/friendshipActionsService'
import ConfirmationModal from './ConfirmationModal'

export const FriendCard = ({ friend, onlineUsers, onUpdate }) => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 })
  const menuRef = useRef(null)
  const buttonRef = useRef(null)
  const fullName = `${friend?.nombres?.primero || ''} ${friend?.apellidos?.primero || ''}`.trim() || 'Usuario';
  const avatarUrl = getUserAvatar(friend);

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handleCardClick = () => {
    navigate(`/perfil/${friend._id}`)
  }

  const handleMessageClick = (e) => {
    e.stopPropagation()
    navigate(`/mensajes?userId=${friend._id}`)
  }

  const handleMenuClick = (e) => {
    e.stopPropagation()

    if (!showMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right
      })
    }

    setShowMenu(!showMenu)
  }

  const [confirmAction, setConfirmAction] = useState(null) // { type: 'unfriend' | 'block', title: string, message: string } | null

  const handleFavorite = async (e) => {
    e.stopPropagation()
    try {
      await friendshipActionsService.toggleFavorite(friend.friendshipId)
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Error al toggle favorito:', error)
      alert('Error al actualizar favorito')
    }
    setShowMenu(false)
  }

  const handlePin = async (e) => {
    e.stopPropagation()
    try {
      await friendshipActionsService.togglePin(friend.friendshipId)
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Error al toggle pin:', error)
      alert('Error al actualizar fijado')
    }
    setShowMenu(false)
  }

  const handleMute = async (e) => {
    e.stopPropagation()
    try {
      await friendshipActionsService.toggleMute(friend.friendshipId)
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Error al toggle mute:', error)
      alert('Error al actualizar silenciado')
    }
    setShowMenu(false)
  }

  const handleUnfriendClick = (e) => {
    e.stopPropagation()
    setConfirmAction({
      type: 'unfriend',
      title: 'Eliminar amigo',
      message: `¿Estás seguro de que quieres eliminar a ${fullName} de tus amigos? Ya no serán amigos y deberás enviar una nueva solicitud si cambias de opinión.`
    })
    setShowMenu(false)
  }

  const handleBlockClick = (e) => {
    e.stopPropagation()
    setConfirmAction({
      type: 'block',
      title: 'Bloquear usuario',
      message: `¿Estás seguro de que quieres bloquear a ${fullName}? Esta persona no podrá encontrarte en la búsqueda ni ver tu perfil. Tú tampoco podrás ver el suyo.`
    })
    setShowMenu(false)
  }



  // Calcular si es el cumpleaños hoy
  const isBirthdayToday = () => {
    if (!friend?.personal?.fechaNacimiento) return false;
    const today = new Date();
    const birthDate = new Date(friend.personal.fechaNacimiento);
    return today.getMonth() === birthDate.getUTCMonth() && today.getDate() === birthDate.getUTCDate();
  };

  // Determinar si está online (basado en última conexión como fallback)
  const isOnlineByLastConnection = () => {
    if (!friend?.seguridad?.ultimaConexion) return false;
    const lastConnection = new Date(friend.seguridad.ultimaConexion);
    const now = new Date();
    const diffMinutes = (now - lastConnection) / (1000 * 60);
    return diffMinutes <= 5;
  };

  const hasRealTimeData = onlineUsers !== null && onlineUsers !== undefined;
  const isOnlineRealTime = hasRealTimeData ? onlineUsers.has(friend._id) : null;
  const isOnlineFallback = isOnlineByLastConnection();
  const online = isOnlineRealTime !== null ? isOnlineRealTime : isOnlineFallback;

  const hasBirthday = isBirthdayToday();

  // Handle Unblock Action
  const handleUnblockClick = (e) => {
    e.stopPropagation()
    setConfirmAction({
      type: 'unblock',
      title: 'Desbloquear usuario',
      message: `¿Quieres desbloquear a ${fullName}? Podrán volver a enviarte mensajes y ver tu perfil.`
    })
    setShowMenu(false)
  }

  const handleConfirmAction = async () => {
    if (!confirmAction) return

    try {
      if (confirmAction.type === 'unfriend') {
        await friendshipActionsService.removeFriendship(friend.friendshipId)
      } else if (confirmAction.type === 'block') {
        await friendshipActionsService.blockUser(friend.friendshipId)
      } else if (confirmAction.type === 'unblock') {
        await friendshipActionsService.unblockUser(friend.friendshipId)
      }

      if (onUpdate) onUpdate()
    } catch (error) {
      console.error(`Error executing ${confirmAction.type}:`, error)
      alert(`Error al realizar la acción`)
    } finally {
      setConfirmAction(null)
    }
  }

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
          /* Solo mostrar indicador online si NO está bloqueado */
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
                  <button className={styles.dropdownItem} onClick={handleFavorite}>
                    <Star size={16} />
                    <span>{friend.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}</span>
                  </button>
                  <button className={styles.dropdownItem} onClick={handlePin}>
                    <Pin size={16} />
                    <span>{friend.isPinned ? 'Desfijar' : 'Fijar arriba'}</span>
                  </button>
                  <button className={styles.dropdownItem} onClick={handleMute}>
                    <BellOff size={16} />
                    <span>{friend.isMuted ? 'Activar notificaciones' : 'Silenciar notificaciones'}</span>
                  </button>
                  <div className={styles.divider} />
                  <button onClick={handleUnfriendClick} className={styles.danger}>
                    <UserMinus size={16} />
                    Eliminar amigo
                  </button>
                </>
              )}

              {friend.isBlocked ? (
                <button onClick={handleUnblockClick} className={styles.dropdownItem} style={{ color: '#2563eb' }}>
                  <Ban size={16} />
                  <span>Desbloquear usuario</span>
                </button>
              ) : (
                <button onClick={handleBlockClick} className={styles.danger}>
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
    </div>
  )
}
