import { useState, useEffect } from 'react';
import { logger } from '../shared/utils/logger';
import { getSocket } from '../shared/lib/socket';
import conversationService from '../api/conversationService';

/**
 * Hook para obtener y actualizar en tiempo real el contador de mensajes no leídos
 * @param {string} userId - ID del usuario actual
 * @returns {number} Número de mensajes no leídos
 */
export const useMessageCounter = (userId) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    // Fetch inicial del contador
    const fetchCount = async () => {
      try {
        const response = await conversationService.getUnreadCount();
        const count = response.data?.count || response.count || 0;
        setUnreadCount(count);
      } catch (error) {
        logger.error('Error fetching unread messages count:', error);
        setUnreadCount(0);
      }
    };

    fetchCount();

    // Suscripción a Socket.IO para actualizaciones en tiempo real
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (message) => {
      logger.log('💬 [useMessageCounter] Nuevo mensaje recibido:', message);

      // Solo incrementar si el mensaje NO es del usuario actual
      if (message.emisor && String(message.emisor._id || message.emisor) !== String(userId)) {
        setUnreadCount(prev => prev + 1);
      }
    };

    const handleMessageRead = (data) => {
      logger.log('👁️ [useMessageCounter] Conversación leída:', data);
      // Recargar contador desde el servidor para estar sincronizado
      fetchCount();
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('conversationRead', handleMessageRead);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('conversationRead', handleMessageRead);
    };
  }, [userId]);

  return unreadCount;
};



