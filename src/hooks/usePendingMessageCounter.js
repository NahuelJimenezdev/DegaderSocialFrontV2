import { useState, useEffect } from 'react';
import { logger } from '../shared/utils/logger';
import { getSocket } from '../shared/lib/socket';
import conversationService from '../api/conversationService';

/**
 * Hook para obtener y actualizar en tiempo real el contador de mensajes pendientes
 * @param {string} userId - ID del usuario actual
 * @returns {number} Número de conversaciones pendientes
 */
export const usePendingMessageCounter = (userId) => {
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        if (!userId) return;

        // Fetch inicial del contador
        const fetchCount = async () => {
            try {
                const response = await conversationService.getPendingCount();
                const count = response.data?.count || response.count || 0;
                setPendingCount(count);
            } catch (error) {
                logger.error('Error fetching pending messages count:', error);
                setPendingCount(0);
            }
        };

        fetchCount();

        // Polling cada 30 segundos para mantener sincronizado
        const interval = setInterval(fetchCount, 30000);

        // Suscripción a Socket.IO para actualizaciones en tiempo real
        const socket = getSocket();
        if (socket) {
            const handleNewMessage = (message) => {
                logger.log('📬 [usePendingMessageCounter] Nuevo mensaje recibido:', message);
                // Recargar contador cuando llegue un mensaje nuevo
                fetchCount();
            };

            socket.on('newMessage', handleNewMessage);

            return () => {
                clearInterval(interval);
                socket.off('newMessage', handleNewMessage);
            };
        }

        return () => clearInterval(interval);
    }, [userId]);

    return pendingCount;
};
