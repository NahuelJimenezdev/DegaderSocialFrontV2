import { useState, useEffect } from 'react';
import { getSocket } from '../../../shared/lib/socket';
import notificationService from '../../../api/notificationService';
import friendshipService from '../../../api/friendshipService';
import groupService from '../../../api/groupService';
import { logger } from '../../../shared/utils/logger';

export const useNotifications = (user) => {
    const userId = user?._id || user?.id;
    const [notifications, setNotifications] = useState([]);
    const [processedNotifications, setProcessedNotifications] = useState(new Set());
    const [loading, setLoading] = useState(false);

    // Fetch inicial
    const fetchNotifications = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const data = await notificationService.getAllNotifications();
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

            setNotifications(notificacionesArray);
        } catch (e) {
            logger.error('❌ Error al cargar notificaciones:', e);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [userId]);

    // Polling como respaldo
    useEffect(() => {
        if (!userId) return;

        const pollingInterval = setInterval(async () => {
            try {
                const data = await notificationService.getAllNotifications();
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
                setNotifications(notificacionesArray);
            } catch (e) {
                logger.error('❌ Error en polling de notificaciones:', e);
            }
        }, 30000);

        return () => clearInterval(pollingInterval);
    }, [userId]);

    // Socket.io
    useEffect(() => {
        if (!userId) return;

        const socket = getSocket();
        if (!socket) return;



        const handleNotification = (noti) => {
            // 🆕 VALIDAR QUE LA NOTIFICACIÓN NO SEA NULL
            if (!noti) {
                logger.warn('⚠️ [NOTIFICATIONS] Received null notification, ignoring');
                return;
            }

            logger.log('📨 Nueva notificación recibida:', noti);

            // Manejar evento de eliminación de notificación
            if (noti.tipo === 'notificacion_eliminada') {
                logger.log('🗑️ [NOTIFICATIONS] Eliminando notificación:', noti.notificacionId);
                setNotifications(prev => prev.filter(n => n._id !== noti.notificacionId));
                return;
            }

            // Manejar notificaciones de actualización de estado de amistad
            if (noti.tipo === 'amistad:actualizada') {
                if (noti.nuevoEstado === 'aceptado' || noti.nuevoEstado === 'default') {
                    setNotifications(prev => prev.filter(n => {
                        const fromUserId = n.remitenteId?._id || n.emisor?._id || n.datos?.fromUserId;
                        const isFromThisUser = String(fromUserId) === String(noti.usuarioId);
                        const isFriendRequest = n.tipo === 'solicitud_amistad' || n.tipo === 'amistad';
                        return !(isFromThisUser && isFriendRequest);
                    }));
                }
                return;
            }

            if (noti.tipo === 'solicitud_cancelada') {
                setNotifications(prev => prev.filter(n => {
                    const fromUserId = n.emisor?._id || n.remitenteId?._id || n.datos?.fromUserId;
                    const isFromThisUser = String(fromUserId) === String(noti.usuarioId);
                    const isFriendRequest = n.tipo === 'solicitud_amistad' || n.tipo === 'amistad';
                    return !(isFromThisUser && isFriendRequest);
                }));
                return;
            }

            if (noti.tipo === 'solicitud_rechazada') {
                setNotifications(prev => prev.filter(n => {
                    const toUserId = n.receptor?._id || n.receptor;
                    const isToThisUser = String(toUserId) === String(noti.usuarioId);
                    const isFriendRequest = n.tipo === 'solicitud_amistad' || n.tipo === 'amistad';
                    return !(isToThisUser && isFriendRequest);
                }));
                return;
            }

            if (noti.tipo === 'solicitudIglesiaProcesada') {
                setNotifications(prev => prev.filter(n => {
                    const isChurchRequest = n.tipo === 'solicitud_iglesia';
                    if (!isChurchRequest) return true;
                    const iglesiaId = n.referencia?.id || n.referencia?._id;
                    if (String(iglesiaId) !== String(noti.iglesiaId)) return true;
                    const solicitanteId = n.metadata?.solicitanteId || n.emisor?._id || n.emisor;
                    if (noti.applicantId && String(solicitanteId) !== String(noti.applicantId)) return true;
                    return false;
                }));
                return;
            }


            setNotifications(prev => {
                if (prev.some(existingNoti => existingNoti._id === noti._id)) return prev;
                return [noti, ...prev];
            });
        };

        const suscribirseANotificaciones = () => {
            if (socket.connected && socket.isAuthenticated) {
                socket.emit('subscribeNotifications', { userId });
                logger.log('📬 Enviando suscripción a notificaciones para:', userId);
            }
        };

        const handleAuth = () => suscribirseANotificaciones();

        // Intentar suscribirse si ya está autenticado
        if (socket.connected && socket.isAuthenticated) {
            suscribirseANotificaciones();
        }

        // Escuchar evento de autenticación (custom event desde socket.js)
        const onAuthenticated = () => handleAuth();
        window.addEventListener('socket:authenticated', onAuthenticated);

        socket.on('newNotification', handleNotification);
        socket.on('solicitudIglesiaProcesada', (data) => {
            handleNotification({ ...data, tipo: 'solicitudIglesiaProcesada' });
        });

        // 📡 Escuchar cuando una notificación es eliminada (sincronización bell-cards)
        socket.on('notificationDeleted', (data) => {
            logger.log('🗑️ Notificación eliminada:', data);
            setNotifications(prev => prev.filter(n => {
                const emisorId = n.emisor?._id || n.emisor;
                return !(String(emisorId) === String(data.emisorId) && n.tipo === data.tipo);
            }));
        });

        return () => {
            socket.off('newNotification', handleNotification);
            socket.off('solicitudIglesiaProcesada');
            socket.off('notificationDeleted');
            window.removeEventListener('socket:authenticated', onAuthenticated);
        };
    }, [userId]);

    const markAsRead = async (notificacionId) => {
        try {
            await notificationService.markAsRead(notificacionId);
            setNotifications(prev =>
                prev.map(n => n._id === notificacionId ? { ...n, leido: true } : n)
            );
        } catch (error) {
            logger.error('❌ Error al marcar notificación como leída:', error);
        }
    };

    const handleAcceptFriend = async (notificacion) => {
        if (processedNotifications.has(notificacion._id)) return;
        try {
            setProcessedNotifications(prev => new Set([...prev, notificacion._id]));
            if (!notificacion.leido) markAsRead(notificacion._id);

            const fromUserId = notificacion.emisor?._id || notificacion.emisor || notificacion.remitenteId?._id || notificacion.remitenteId || notificacion.datos?.fromUserId;
            if (!fromUserId) throw new Error('No remitente ID');

            await friendshipService.acceptFriendRequest(fromUserId);
            await notificationService.deleteNotification(notificacion._id);
            setNotifications(prev => prev.filter(n => n._id !== notificacion._id));
        } catch (error) {
            logger.error('❌ Error al aceptar amistad:', error);
            if (error.response?.status === 400 && error.response?.data?.message?.includes('ya fue procesada')) {
                await notificationService.deleteNotification(notificacion._id);
                setNotifications(prev => prev.filter(n => n._id !== notificacion._id));
            } else {
                setProcessedNotifications(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(notificacion._id);
                    return newSet;
                });
                throw error;
            }
        }
    };

    const handleRejectFriend = async (notificacion) => {
        if (processedNotifications.has(notificacion._id)) return;
        try {
            setProcessedNotifications(prev => new Set([...prev, notificacion._id]));
            if (!notificacion.leido) markAsRead(notificacion._id);

            const fromUserId = notificacion.emisor?._id || notificacion.emisor || notificacion.remitenteId?._id || notificacion.remitenteId || notificacion.datos?.fromUserId;
            if (!fromUserId) throw new Error('No remitente ID');

            await friendshipService.rejectFriendRequest(fromUserId);
            await notificationService.deleteNotification(notificacion._id);
            setNotifications(prev => prev.filter(n => n._id !== notificacion._id));
        } catch (error) {
            logger.error('❌ Error al rechazar amistad:', error);
            setProcessedNotifications(prev => {
                const newSet = new Set(prev);
                newSet.delete(notificacion._id);
                return newSet;
            });
            throw error;
        }
    };

    const handleAcceptGroup = async (notificacion) => {
        try {
            // 🔍 DEBUG: Inspeccionar estructura exacta de la notificación
            logger.log('🔍 [handleAcceptGroup] Notificación recibida:', JSON.stringify(notificacion, null, 2));

            setProcessedNotifications(prev => new Set([...prev, notificacion._id]));
            if (!notificacion.leido) markAsRead(notificacion._id);

            // Obtener userId de forma robusta
            const requestUserId = notificacion.emisor?._id || notificacion.emisor || notificacion.remitenteId?._id || notificacion.remitenteId || notificacion.datos?.fromUserId;

            // Obtener groupId de forma robusta
            let groupId = null;
            if (notificacion.referencia?.id) {
                if (typeof notificacion.referencia.id === 'string') {
                    groupId = notificacion.referencia.id;
                } else if (typeof notificacion.referencia.id === 'object' && notificacion.referencia.id._id) {
                    groupId = notificacion.referencia.id._id;
                } else if (notificacion.referencia.id.id) {
                    // Caso extremo: objeto dentro de objeto
                    groupId = notificacion.referencia.id.id;
                }
            } else if (notificacion.metadata?.groupId) {
                groupId = notificacion.metadata.groupId;
            }

            logger.log('✅ [handleAcceptGroup] IDs extraídos:', { requestUserId, groupId });

            if (!requestUserId || !groupId) throw new Error(`IDs faltantes - UserId: ${requestUserId}, GroupId: ${groupId}`);

            await groupService.acceptJoinRequest(groupId, requestUserId);
            await notificationService.deleteNotification(notificacion._id);
            setNotifications(prev => prev.filter(n => n._id !== notificacion._id));
        } catch (error) {
            logger.error('❌ Error al aceptar grupo:', error);
            setProcessedNotifications(prev => {
                const newSet = new Set(prev);
                newSet.delete(notificacion._id);
                return newSet;
            });
            throw error;
        }
    };

    const handleRejectGroup = async (notificacion) => {
        try {
            logger.log('🔍 [handleRejectGroup] Notificación recibida:', JSON.stringify(notificacion, null, 2));

            setProcessedNotifications(prev => new Set([...prev, notificacion._id]));
            if (!notificacion.leido) markAsRead(notificacion._id);

            const requestUserId = notificacion.emisor?._id || notificacion.emisor || notificacion.remitenteId?._id || notificacion.remitenteId || notificacion.datos?.fromUserId;

            // Obtener groupId de forma robusta
            let groupId = null;
            if (notificacion.referencia?.id) {
                if (typeof notificacion.referencia.id === 'string') {
                    groupId = notificacion.referencia.id;
                } else if (typeof notificacion.referencia.id === 'object' && notificacion.referencia.id._id) {
                    groupId = notificacion.referencia.id._id;
                } else if (notificacion.referencia.id.id) {
                    groupId = notificacion.referencia.id.id;
                }
            } else if (notificacion.metadata?.groupId) {
                groupId = notificacion.metadata.groupId;
            }

            logger.log('✅ [handleRejectGroup] IDs extraídos:', { requestUserId, groupId });

            if (!requestUserId || !groupId) throw new Error(`IDs faltantes - UserId: ${requestUserId}, GroupId: ${groupId}`);

            await groupService.rejectJoinRequest(groupId, requestUserId);
            await notificationService.deleteNotification(notificacion._id);
            setNotifications(prev => prev.filter(n => n._id !== notificacion._id));
        } catch (error) {
            logger.error('❌ Error al rechazar grupo:', error);
            setProcessedNotifications(prev => {
                const newSet = new Set(prev);
                newSet.delete(notificacion._id);
                return newSet;
            });
            throw error;
        }
    };

    const deleteInformativeNotification = async (notificacionId) => {
        try {
            await notificationService.deleteNotification(notificacionId);
            setNotifications(prev => prev.filter(n => n._id !== notificacionId));
        } catch (error) {
            logger.error('Error eliminando notificación:', error);
        }
    };

    return {
        notifications,
        unreadNotifications: Array.isArray(notifications) ? notifications.filter(n => !n.leido) : [],
        processedNotifications,
        loading,
        markAsRead,
        handleAcceptFriend,
        handleRejectFriend,
        handleAcceptGroup,
        handleRejectGroup,
        deleteInformativeNotification,
        setNotifications
    };
};
