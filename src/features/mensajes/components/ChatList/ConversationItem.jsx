import React from 'react';
import { Star, MoreVertical, Trash2, Archive, Eraser } from 'lucide-react';
import { getUserAvatar, handleImageError } from '../../../../shared/utils/avatarUtils';
import { useChatContext } from '../../context/ChatContext';
import { ConfirmDialog } from '../../../../shared/components/ConfirmDialog/ConfirmDialog';

/**
 * ConversationItem - Item individual de conversación en la lista
 * Ahora usa ChatContext para reducir props drilling
 * @param {Object} conversacion - Objeto de conversación
 */
const ConversationItem = ({ conversacion }) => {
    // Obtener todo del context en lugar de props
    const {
        conversacionActual,
        userId,
        tabActiva,
        menuAbierto,
        setMenuAbierto,
        handleSeleccionarConversacion,
        handleAceptarSolicitud,
        handleRechazarSolicitud,
        handleDestacarChat,
        handleEliminarChat,
        handleArchivarChat,
        handleVaciarConversacion,
        getOtroParticipante,
        getUnreadCount,
        formatearTiempo
    } = useChatContext();
    const otro = getOtroParticipante(conversacion);
    const unreadCount = getUnreadCount(conversacion);

    // Estado local para manejar qué diálogo de confirmación mostrar
    // null | { type: 'eliminar'|'vaciar'|'rechazar', title: string, message: string, ... }
    const [actionDialog, setActionDialog] = React.useState(null);

    if (!otro) return null;

    const isActive = conversacionActual?._id === conversacion._id;
    const isStarred = conversacion.starredBy?.some(id => id === userId);

    return (
        <div
            className={`relative flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 ${isActive ? 'bg-gray-100 dark:bg-gray-800' : ''
                }`}
        >
            <div
                className="flex items-center gap-3 flex-1 min-w-0"
                onClick={() => handleSeleccionarConversacion(conversacion)}
            >
                <img
                    src={getUserAvatar(otro)}
                    alt={`${otro.nombres?.primero} ${otro.apellidos?.primero}`}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={handleImageError}
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                {otro.nombres?.primero} {otro.apellidos?.primero}
                            </h4>
                            {isStarred && (
                                <Star size={14} className="text-yellow-500 fill-yellow-500 flex-shrink-0" />
                            )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatearTiempo(conversacion.ultimoMensaje?.fecha)}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {conversacion.ultimoMensaje?.contenido || 'Nueva conversación'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <span className="bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </div>

            {/* Botones de aceptar/rechazar o menú de acciones */}
            {tabActiva === 'pending' ? (
                <div className="flex flex-col gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAceptarSolicitud(conversacion._id);
                        }}
                        className="px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white text-xs rounded-md transition-colors"
                    >
                        Aceptar
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setActionDialog({
                                type: 'rechazar',
                                title: 'Rechazar solicitud',
                                message: '¿Estás seguro de que quieres rechazar esta solicitud? La conversación se eliminará.',
                                confirmText: 'Rechazar',
                                variant: 'danger'
                            });
                        }}
                        className="px-3 py-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-md transition-colors"
                    >
                        Rechazar
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuAbierto(menuAbierto === conversacion._id ? null : conversacion._id);
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                        aria-label="Abrir menú de acciones"
                    >
                        <MoreVertical size={18} className="text-gray-600 dark:text-gray-400" />
                    </button>

                    {/* Menú desplegable */}
                    {menuAbierto === conversacion._id && (
                        <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 w-48 z-10">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDestacarChat(conversacion._id);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-yellow-600 dark:text-yellow-400"
                            >
                                <Star size={16} className={isStarred ? 'fill-yellow-500' : ''} />
                                {isStarred ? 'Quitar destacado' : 'Destacar'}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActionDialog({
                                        type: 'eliminar',
                                        title: 'Eliminar chat',
                                        message: '¿Estás seguro de que quieres eliminar esta conversación? Esta acción solo la borrará para ti.',
                                        confirmText: 'Eliminar',
                                        variant: 'danger'
                                    });
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600 dark:text-red-400"
                            >
                                <Trash2 size={16} />
                                Eliminar chat
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleArchivarChat(conversacion._id);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                            >
                                <Archive size={16} />
                                {tabActiva === 'archived' ? 'Desarchivar' : 'Archivar'}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActionDialog({
                                        type: 'vaciar',
                                        title: 'Vaciar conversación',
                                        message: '¿Estás seguro de que quieres eliminar todos los mensajes? Esta acción no se puede deshacer.',
                                        confirmText: 'Vaciar',
                                        variant: 'danger'
                                    });
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                            >
                                <Eraser size={16} />
                                Vaciar conversación
                            </button>
                        </div>
                    )}
                </div>
            )}
            {/* Diálogos de Confirmación */}
            <ConfirmDialog
                isOpen={!!actionDialog}
                onClose={() => setActionDialog(null)}
                onConfirm={() => {
                    if (actionDialog.type === 'eliminar') handleEliminarChat(conversacion._id);
                    if (actionDialog.type === 'vaciar') handleVaciarConversacion(conversacion._id);
                    if (actionDialog.type === 'rechazar') handleRechazarSolicitud(conversacion._id);
                    setActionDialog(null);
                }}
                title={actionDialog?.title || 'Confirmar acción'}
                message={actionDialog?.message || '¿Estás seguro?'}
                confirmText={actionDialog?.confirmText || 'Confirmar'}
                cancelText="Cancelar"
                variant={actionDialog?.variant || 'warning'}
            />
        </div>
    );
};

export default ConversationItem;
