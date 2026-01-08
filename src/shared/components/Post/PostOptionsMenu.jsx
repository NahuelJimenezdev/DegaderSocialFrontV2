import React, { useRef, useEffect } from 'react';
import { Bookmark, UserMinus, Flag } from 'lucide-react';
import { logger } from '../../utils/logger';

/**
 * Menú de opciones para publicaciones
 * @param {Object} post - Publicación
 * @param {Object} currentUser - Usuario actual
 * @param {boolean} isOpen - Estado del menú
 * @param {Function} onClose - Cerrar menú
 * @param {Function} onSave - Guardar publicación
 * @param {Function} onUnfollow - Dejar de seguir
 * @param {Function} onReport - Reportar (temporal)
 * @param {boolean} isSaved - Si el post ya está guardado
 */
export default function PostOptionsMenu({
    post,
    currentUser,
    isOpen,
    onClose,
    onSave,
    onUnfollow,
    onReport,
    isSaved = false
}) {
    const menuRef = useRef(null);

    // Cerrar al hacer click fuera
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    // Cerrar con Escape
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Verificar si el post es del usuario actual
    const postUserId = post.usuario?._id || post.usuario;
    const isOwnPost = postUserId === currentUser?._id;

    const handleSaveClick = () => {
        logger.log('💾 [MENU] Guardar publicación:', post._id);
        onSave();
        onClose();
    };

    const handleUnfollowClick = () => {
        logger.log('👥 [MENU] Dejar de seguir:', postUserId);
        onUnfollow();
        onClose();
    };

    const handleReportClick = () => {
        logger.log('🚨 [MENU] Reportar publicación:', post._id);
        onReport();
        onClose();
    };

    return (
        <div
            ref={menuRef}
            className="absolute top-8 right-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[220px] z-50 animate-in fade-in zoom-in-95 duration-200"
        >
            {/* Guardar publicación */}
            <button
                onClick={handleSaveClick}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            >
                <Bookmark
                    size={20}
                    className={`${isSaved ? 'fill-blue-500 text-blue-500' : 'text-gray-600 dark:text-gray-400'}`}
                />
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {isSaved ? 'Quitar de guardados' : 'Guardar publicación'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {isSaved ? 'Eliminar de tu colección' : 'Guardar para ver más tarde'}
                    </p>
                </div>
            </button>

            {/* Dejar de seguir - Solo si NO es el propio post */}
            {!isOwnPost && (
                <button
                    onClick={handleUnfollowClick}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                >
                    <UserMinus size={20} className="text-red-500" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Dejar de seguir
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Eliminar amistad
                        </p>
                    </div>
                </button>
            )}

            {/* Divisor */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

            {/* Reportar - Temporal */}
            <button
                onClick={handleReportClick}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            >
                <Flag size={20} className="text-gray-600 dark:text-gray-400" />
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Reportar
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Reportar contenido inapropiado
                    </p>
                </div>
            </button>
        </div>
    );
}
