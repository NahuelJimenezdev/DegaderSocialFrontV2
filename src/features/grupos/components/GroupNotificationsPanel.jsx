import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import groupService from '../../../api/groupService';

/**
 * Componente para la configuración de notificaciones del grupo
 */
const GroupNotificationsPanel = ({ groupId, currentSettings }) => {
    const [notificationsMuted, setNotificationsMuted] = useState(false);
    const [muteDuration, setMuteDuration] = useState('siempre');
    const [muteType, setMuteType] = useState('total');
    const [loading, setLoading] = useState(false);

    // Cargar configuración actual
    useEffect(() => {
        if (currentSettings) {
            setNotificationsMuted(currentSettings.silenciadas || false);
            setMuteDuration(currentSettings.duracionSilencio || 'siempre');
            setMuteType(currentSettings.tipoSilencio || 'total');
        }
    }, [currentSettings]);

    const handleSaveSettings = async () => {
        try {
            setLoading(true);

            await groupService.updateNotificationSettings(groupId, {
                muted: notificationsMuted,
                duration: muteDuration,
                muteType: muteType
            });

            toast.success('Configuración guardada');
        } catch (error) {
            console.error('Error al guardar configuración:', error);
            toast.error('Error al guardar configuración');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined">notifications</span>
                    Notificaciones
                </h3>
            </div>

            <div className="p-6 space-y-6">
                {/* Toggle principal */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                            Silenciar notificaciones
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Controla cómo recibes notificaciones de este grupo
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={notificationsMuted}
                            onChange={(e) => setNotificationsMuted(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                </div>

                {/* Opciones avanzadas - solo si está silenciado */}
                {notificationsMuted && (
                    <div className="space-y-4 pl-4 border-l-4 border-primary/30">
                        {/* Duración del silencio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Duración del silencio
                            </label>
                            <select
                                value={muteDuration}
                                onChange={(e) => setMuteDuration(e.target.value)}
                                className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="1h">1 hora</option>
                                <option value="8h">8 horas</option>
                                <option value="24h">24 horas</option>
                                <option value="siempre">Siempre</option>
                            </select>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {muteDuration === 'siempre'
                                    ? 'Las notificaciones permanecerán silenciadas hasta que las reactives'
                                    : `Las notificaciones se reactivarán automáticamente después de ${muteDuration === '1h' ? '1 hora' : muteDuration === '8h' ? '8 horas' : '24 horas'}`
                                }
                            </p>
                        </div>

                        {/* Tipo de silencio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Tipo de silencio
                            </label>
                            <div className="space-y-3">
                                <label className="flex items-start gap-3 p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                    <input
                                        type="radio"
                                        name="muteType"
                                        value="total"
                                        checked={muteType === 'total'}
                                        onChange={(e) => setMuteType(e.target.value)}
                                        className="mt-1 w-4 h-4 text-primary focus:ring-primary"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            Silenciar todo
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            No recibirás ninguna notificación de este grupo
                                        </p>
                                    </div>
                                </label>

                                <label className="flex items-start gap-3 p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                    <input
                                        type="radio"
                                        name="muteType"
                                        value="solo_menciones"
                                        checked={muteType === 'solo_menciones'}
                                        onChange={(e) => setMuteType(e.target.value)}
                                        className="mt-1 w-4 h-4 text-primary focus:ring-primary"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            Solo menciones
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Solo recibirás notificaciones cuando te mencionen con @usuario
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Botón guardar */}
                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={handleSaveSettings}
                        disabled={loading}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="material-symbols-outlined animate-spin">refresh</span>
                                Guardando...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">save</span>
                                Guardar configuración
                            </>
                        )}
                    </button>
                </div>

                {/* Mensaje informativo */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex gap-3">
                        <span className="material-symbols-outlined text-blue-500 dark:text-blue-400 flex-shrink-0">
                            info
                        </span>
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                            <p className="font-medium mb-1">Sobre las notificaciones</p>
                            <p>
                                {notificationsMuted
                                    ? muteType === 'total'
                                        ? 'No recibirás notificaciones de este grupo en el dropdown general, pero los mensajes seguirán apareciendo en el chat.'
                                        : 'Solo recibirás notificaciones cuando alguien te mencione con @usuario en el grupo.'
                                    : 'Recibirás todas las notificaciones de mensajes nuevos en este grupo.'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupNotificationsPanel;
