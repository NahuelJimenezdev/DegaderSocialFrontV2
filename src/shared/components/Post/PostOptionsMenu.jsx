import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, UserMinus, Flag, Link, User, Share2, Star } from 'lucide-react';
import { logger } from '../../utils/logger';
import { useToast } from '../Toast/ToastProvider';

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
 * @param {boolean} showSaveAction - Si se debe mostrar la opción de guardar
 */
export default function PostOptionsMenu({
    post,
    currentUser,
    isOpen,
    onClose,
    onSave,
    onUnfollow,
    onReport,
    isSaved = false,
    showSaveAction = true
}) {
    const menuRef = useRef(null);
    const toast = useToast();
    const navigate = useNavigate();

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

    const handleViewProfileClick = () => {
        const username = post.usuario?.username;
        const userId = post.usuario?._id || post.usuario;

        logger.log('👤 [MENU] Ver información del usuario:', username || userId);
        onClose();

        // Usar username si está disponible, sino usar ID
        navigate(`/informacionUsuario/${username || userId}`);
    };

    const handleCopyLinkClick = async () => {
        try {
            const postUrl = `${window.location.origin}/publicacion/${post._id}`;
            await navigator.clipboard.writeText(postUrl);
            logger.log('🔗 [MENU] Enlace copiado:', postUrl);

            toast.success('Enlace copiado al portapapeles');
        } catch (error) {
            logger.error('❌ [MENU] Error al copiar enlace:', error);
            // Fallback para navegadores que no soportan clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = `${window.location.origin}/publicacion/${post._id}`;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                toast.success('Enlace copiado al portapapeles');
            } catch (err) {
                toast.error('No se pudo copiar el enlace');
            }
            document.body.removeChild(textArea);
        }
        onClose();
    };

    const handleShareClick = () => {
        logger.log('📤 [MENU] Compartir:', post._id);
        // TODO: Implementar compartir
        onClose();
    };

    return (
        <div
            ref={menuRef}
            className="absolute top-8 right-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[220px] z-50 animate-in fade-in zoom-in-95 duration-200"
        >
            {/* Guardar publicación */}
            {showSaveAction && (
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
            )}

            {/* Agregar a Favoritos (Solo si no es mi propio post) */}
            {!isOwnPost && (
                <button
                    onClick={async () => {
                        try {
                            const userId = post.usuario?._id || post.usuario;
                            await import('../../../api/favoritosService').then(module => module.default.toggleFavoriteUser(userId));
                            toast.success('Favoritos actualizados');
                            onClose();
                        } catch (error) {
                            console.error('Error al agregar a favoritos:', error);
                            toast.error('Error al actualizar favoritos');
                        }
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                >
                    <Star size={20} className="text-yellow-500" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Favorito
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Agregar/Quitar de favoritos
                        </p>
                    </div>
                </button>
            )}

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

            {/* Ver Perfil */}
            <button
                onClick={handleViewProfileClick}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            >
                <User size={20} className="text-gray-600 dark:text-gray-400" />
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Sobre esta cuenta
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Conocé más sobre este usuario <br />y su recorrido en la plataforma
                    </p>
                </div>
            </button>

            {/* Copiar Enlace */}
            <button
                onClick={handleCopyLinkClick}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            >
                <Link size={20} className="text-gray-600 dark:text-gray-400" />
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Copiar enlace
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Copiar enlace de publicación
                    </p>
                </div>
            </button>



            {/* Compartir */}
            <button
                onClick={handleShareClick}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            >
                <Share2 size={20} className="text-gray-600 dark:text-gray-400" />
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Compartir
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Compartir esta publicación
                    </p>
                </div>
            </button>

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
