import React, { useState } from 'react';
import { logger } from '../../../shared/utils/logger';
import { useNavigate } from 'react-router-dom';
import { Check, X, Users } from 'lucide-react';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';
import fundacionService from '../../../api/fundacionService';
import notificationService from '../../../api/notificationService';
import { useToast } from '../../../shared/components/Toast/ToastProvider';

const FundacionNotificationCard = ({ notification, onAction }) => {
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    logger.log('🔔 FundacionNotificationCard - notification:', notification);

    const { emisor, metadata, createdAt, tipo } = notification;
    const { nivel, area, cargo } = metadata || {};

    // Formatear tiempo relativo
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'ahora';
        if (minutes < 60) return `hace ${minutes}m`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `hace ${hours}h`;

        const days = Math.floor(hours / 24);
        return `hace ${days}d`;
    };

    const handleAction = async (accion) => {
        const solicitanteId = emisor?._id || emisor;

        if (!solicitanteId) {
            logger.error('❌ No se pudo obtener el ID del solicitante:', emisor);
            toast.error('Error: No se puede identificar el solicitante');
            return;
        }

        setLoading(true);
        try {
            logger.log('📤 Gestionando solicitud de fundación:', { solicitanteId, accion });

            if (accion === 'aprobar') {
                await fundacionService.approveRequest(solicitanteId);
            } else {
                await fundacionService.rejectRequest(solicitanteId, 'No cumple con los requisitos');
            }

            toast.success(
                accion === 'aprobar'
                    ? 'Solicitud aprobada exitosamente'
                    : 'Solicitud rechazada'
            );

            // Eliminar la notificación del backend para que no vuelva a aparecer
            try {
                await notificationService.deleteNotification(notification._id);
            } catch (deleteError) {
                logger.warn('⚠️ Error al eliminar notificación (puede que ya no exista):', deleteError);
            }

            // Notificar al componente padre para actualizar la lista
            if (onAction) {
                onAction(notification._id);
            }
        } catch (error) {
            logger.error('❌ Error al gestionar solicitud:', error);
            toast.error('Error al procesar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    const handleClick = async () => {
        // Si es notificación final (aprobada/rechazada), borrarla al hacer click
        if (tipo === 'solicitud_fundacion_aprobada' || tipo === 'solicitud_fundacion_rechazada') {
            try {
                logger.log('🗑️ Eliminando notificación al clickear:', notification._id);
                await notificationService.deleteNotification(notification._id);
                if (onAction) onAction(notification._id);
            } catch (error) {
                logger.error('❌ Error eliminando notificación:', error);
            }
        }

        // Navegar a la página de iglesias (tab fundación)
        navigate('/Mi_iglesia', { state: { activeTab: 'fundacion' } });
    };

    // Obtener nombre del solicitante
    const getNombreSolicitante = () => {
        if (emisor?.nombres?.primero && emisor?.apellidos?.primero) {
            return `${emisor.nombres.primero} ${emisor.apellidos.primero}`;
        }
        return 'Usuario';
    };

    const isResponseNotif = tipo === 'solicitud_fundacion_aprobada' || tipo === 'solicitud_fundacion_rechazada';

    return (
        <div className="group relative bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-4 transition-all duration-200 border border-gray-100 dark:border-gray-700">
            <div className="flex items-start gap-3">
                {/* Avatar del solicitante o Icono de Fundación */}
                <div
                    className="flex-shrink-0 cursor-pointer overflow-hidden rounded-full w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-800"
                    onClick={handleClick}
                >
                    {isResponseNotif ? (
                        // Si es respuesta, mostrar icono de fundación
                        <Users className="w-6 h-6 text-purple-500" />
                    ) : (
                        // Si es solicitud, mostrar avatar del usuario
                        <img
                            src={getUserAvatar(emisor)}
                            alt={getNombreSolicitante()}
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.src = '/avatars/default-avatar.png'}
                        />
                    )}
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                    <div
                        className="cursor-pointer"
                        onClick={handleClick}
                    >
                        <p className="text-sm text-gray-900 dark:text-white">
                            {notification.contenido || notification.mensaje ? (
                                <span>{notification.contenido || notification.mensaje}</span>
                            ) : (
                                <>
                                    <span className="font-semibold">
                                        {getNombreSolicitante()}
                                    </span>
                                    {' '}
                                    <span className="text-gray-600 dark:text-gray-400">
                                        solicita unirse a la fundación como
                                    </span>
                                    {' '}
                                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                                        {cargo || 'miembro'}
                                    </span>
                                    {' '}
                                    <span className="text-gray-600 dark:text-gray-400">
                                        en {area || 'un área'}
                                    </span>
                                </>
                            )}
                        </p>

                        {/* Mostrar detalles adicionales para solicitudes */}
                        {tipo === 'solicitud_fundacion' && (nivel || area) && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Nivel: {nivel} • Área: {area}
                            </p>
                        )}

                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatTime(createdAt)}
                        </p>
                    </div>

                    {/* Botones de acción */}
                    {tipo === 'solicitud_fundacion' && (
                        <div className="flex items-center gap-2 mt-3">
                            <button
                                onClick={() => handleAction('aprobar')}
                                disabled={loading}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <Check size={16} />
                                Aceptar
                            </button>
                            <button
                                onClick={() => handleAction('rechazar')}
                                disabled={loading}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <X size={16} />
                                Rechazar
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Indicador de no leída */}
            {!notification.leida && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-purple-600 rounded-full"></div>
            )}
        </div>
    );
};

export default FundacionNotificationCard;
