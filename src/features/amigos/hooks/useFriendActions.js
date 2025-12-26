import { useState } from 'react';
import { logger } from '../../../shared/utils/logger';
import * as friendshipActionsService from '../../../api/friendshipActionsService';

/**
 * Custom hook para manejar acciones de amigos
 * @param {Object} friend - Datos del amigo
 * @param {Function} onUpdate - Callback para actualizar lista
 * @returns {Object} Estado y funciones para acciones de amigos
 */
export const useFriendActions = (friend, onUpdate) => {
  const [confirmAction, setConfirmAction] = useState(null);
  const [alertConfig, setAlertConfig] = useState({ 
    isOpen: false, 
    variant: 'info', 
    message: '' 
  });

  const fullName = `${friend?.nombres?.primero || ''} ${friend?.apellidos?.primero || ''}`.trim() || 'Usuario';

  // Toggle favorite
  const handleFavorite = async (e) => {
    e?.stopPropagation();
    try {
      await friendshipActionsService.toggleFavorite(friend.friendshipId);
      if (onUpdate) onUpdate();
    } catch (error) {
      logger.error('Error al toggle favorito:', error);
      setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al actualizar favorito' });
    }
  };

  // Toggle pin
  const handlePin = async (e) => {
    e?.stopPropagation();
    try {
      await friendshipActionsService.togglePin(friend.friendshipId);
      if (onUpdate) onUpdate();
    } catch (error) {
      logger.error('Error al toggle pin:', error);
      setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al actualizar fijado' });
    }
  };

  // Toggle mute
  const handleMute = async (e) => {
    e?.stopPropagation();
    try {
      await friendshipActionsService.toggleMute(friend.friendshipId);
      if (onUpdate) onUpdate();
    } catch (error) {
      logger.error('Error al toggle mute:', error);
      setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al actualizar silenciado' });
    }
  };

  // Unfriend click (show confirmation)
  const handleUnfriendClick = (e) => {
    e?.stopPropagation();
    setConfirmAction({
      type: 'unfriend',
      title: 'Eliminar amigo',
      message: `¿Estás seguro de que quieres eliminar a ${fullName} de tus amigos? Ya no serán amigos y deberás enviar una nueva solicitud si cambias de opinión.`
    });
  };

  // Block click (show confirmation)
  const handleBlockClick = (e) => {
    e?.stopPropagation();
    setConfirmAction({
      type: 'block',
      title: 'Bloquear usuario',
      message: `¿Estás seguro de que quieres bloquear a ${fullName}? Esta persona no podrá encontrarte en la búsqueda ni ver tu perfil. Tú tampoco podrás ver el suyo.`
    });
  };

  // Unblock click (show confirmation)
  const handleUnblockClick = (e) => {
    e?.stopPropagation();
    setConfirmAction({
      type: 'unblock',
      title: 'Desbloquear usuario',
      message: `¿Quieres desbloquear a ${fullName}? Podrán volver a enviarte mensajes y ver tu perfil.`
    });
  };

  // Confirm action
  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    try {
      if (confirmAction.type === 'unfriend') {
        await friendshipActionsService.removeFriendship(friend.friendshipId);
      } else if (confirmAction.type === 'block') {
        await friendshipActionsService.blockUser(friend.friendshipId);
      } else if (confirmAction.type === 'unblock') {
        await friendshipActionsService.unblockUser(friend.friendshipId);
      }

      if (onUpdate) onUpdate();
    } catch (error) {
      logger.error(`Error executing ${confirmAction.type}:`, error);
      setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al realizar la acción' });
    } finally {
      setConfirmAction(null);
    }
  };

  // Birthday check
  const isBirthdayToday = () => {
    if (!friend?.personal?.fechaNacimiento) return false;
    const today = new Date();
    const birthDate = new Date(friend.personal.fechaNacimiento);
    return today.getMonth() === birthDate.getUTCMonth() && today.getDate() === birthDate.getUTCDate();
  };

  // Online status (fallback)
  const isOnlineByLastConnection = () => {
    if (!friend?.seguridad?.ultimaConexion) return false;
    const lastConnection = new Date(friend.seguridad.ultimaConexion);
    const now = new Date();
    const diffMinutes = (now - lastConnection) / (1000 * 60);
    return diffMinutes <= 5;
  };

  return {
    // Estado
    confirmAction,
    alertConfig,
    fullName,
    
    // Setters
    setConfirmAction,
    setAlertConfig,
    
    // Funciones
    handleFavorite,
    handlePin,
    handleMute,
    handleUnfriendClick,
    handleBlockClick,
    handleUnblockClick,
    handleConfirmAction,
    isBirthdayToday,
    isOnlineByLastConnection
  };
};
