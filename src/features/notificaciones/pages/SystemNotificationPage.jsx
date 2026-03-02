import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import notificationService from '../../../api/notificationService';
import { logger } from '../../../shared/utils/logger';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';
import ProgressiveImage from '../../../shared/components/ProgressiveImage/ProgressiveImage';

/**
 * SystemNotificationPage - Página para mostrar contenido moderado
 * Muestra el contenido eliminado/suspendido en modo solo lectura con el motivo
 */
export default function SystemNotificationPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotification = async () => {
            try {
                setLoading(true);
                const response = await notificationService.getNotificationById(id);
                logger.log('📨 Notificación del sistema cargada:', response);
                setNotification(response.data || response);
            } catch (error) {
                logger.error('❌ Error al cargar notificación:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchNotification();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    if (!notification) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
                        Notificación no encontrada
                    </h2>
                    <p className="text-red-600 dark:text-red-300">
                        La notificación que buscas no existe o ya fue eliminada.
                    </p>
                    <button
                        onClick={() => navigate('/notificaciones')}
                        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                        Volver a Notificaciones
                    </button>
                </div>
            </div>
        );
    }

    const { contenido, metadata, emisor, createdAt } = notification;
    const actionType = metadata?.action || 'unknown';

    // Mapeo de acciones a títulos y estilos
    const actionConfig = {
        eliminar_contenido: {
            title: 'Contenido Eliminado',
            color: 'red',
            icon: '🗑️'
        },
        ocultar_contenido: {
            title: 'Contenido Oculto',
            color: 'yellow',
            icon: '👁️‍🗨️'
        },
        advertir_usuario: {
            title: 'Advertencia',
            color: 'orange',
            icon: '⚠️'
        },
        suspension_1_dia: {
            title: 'Suspensión: 1 Día',
            color: 'red',
            icon: '🚫'
        },
        suspension_3_dias: {
            title: 'Suspensión: 3 Días',
            color: 'red',
            icon: '🚫'
        },
        suspension_7_dias: {
            title: 'Suspensión: 7 Días',
            color: 'red',
            icon: '🚫'
        },
        suspension_30_dias: {
            title: 'Suspensión: 30 Días',
            color: 'red',
            icon: '🚫'
        },
        suspension_permanente: {
            title: 'Suspensión Permanente',
            color: 'red',
            icon: '⛔'
        }
    };

    const config = actionConfig[actionType] || { title: 'Acción de Moderación', color: 'gray', icon: 'ℹ️' };

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Header con botón de volver */}
            <button
                onClick={() => navigate('/notificaciones')}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Volver a Notificaciones</span>
            </button>

            {/* Card de notificación del sistema */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Banner de tipo de acción */}
                <div className={`bg-${config.color}-100 dark:bg-${config.color}-900/20 border-b border-${config.color}-200 dark:border-${config.color}-800 px-6 py-4`}>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{config.icon}</span>
                        <div>
                            <h1 className={`text-xl font-bold text-${config.color}-800 dark:text-${config.color}-300`}>
                                {config.title}
                            </h1>
                            <p className={`text-sm text-${config.color}-600 dark:text-${config.color}-400`}>
                                {new Date(createdAt).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contenido principal */}
                <div className="p-6">
                    {/* Motivo de la acción */}
                    <div className="mb-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                            Motivo
                        </h2>
                        <p className="text-gray-900 dark:text-white text-base leading-relaxed">
                            {contenido}
                        </p>
                    </div>

                    {/* Información del moderador (si existe) */}
                    {emisor && (
                        <div className="mb-6 flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                            <img
                                src={getUserAvatar(emisor)}
                                alt={emisor.username}
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Moderador</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {emisor.nombres?.primero} {emisor.apellidos?.primero}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Nota informativa */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            <strong>Nota:</strong> Esta acción de moderación se tomó para mantener un ambiente seguro y respetuoso en la comunidad. Si crees que esto es un error, puedes contactar al equipo de soporte.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
