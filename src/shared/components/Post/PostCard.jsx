import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import './PostCard.css'; // Importar estilos de animación
import {
    MoreHorizontal,
    Heart,
    MessageCircle,
    Share2,
    Bookmark,
    Globe,
    Users,
    Lock,
    X,
    ArrowLeft
} from 'lucide-react';
import { getUserAvatar } from '../../utils/avatarUtils';
import ImageGallery from '../../../features/feed/components/ImageGallery';
import CommentSection from '../CommentSection/CommentSection';
import { API_BASE_URL } from '../../config/env';
import PostOptionsMenu from './PostOptionsMenu';
import { AlertDialog } from '../AlertDialog/AlertDialog';
import { userService, friendshipService } from '../../../api';
import { logger } from '../../utils/logger';
import { useToast } from '../Toast/ToastProvider';
import ReportModal from '../Report/ReportModal';
import EditPostModal from './EditPostModal';
import IOSAlert from '../IOSAlert'; // 🆕 Importar modal estilo iOS
import { friendshipService as friendApi } from '../../../api'; // Alias para evitar colisión si fuera necesario

const PostCard = ({
    post,
    variant = 'feed',
    currentUser,
    onLike,
    onComment,
    onShare,
    onAddComment,
    profileContext,
    highlightCommentId
}) => {
    const [localShowComments, setLocalShowComments] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, variant: 'info', message: '' });
    const [isUnfollowed, setIsUnfollowed] = useState(false); // Estado para animación de fade-out
    const [showReportModal, setShowReportModal] = useState(false); // Nuevo estado para ReportModal

    // Estado para edición
    const [showEditModal, setShowEditModal] = useState(false);
    const [displayContent, setDisplayContent] = useState(post.contenido);

    // 🆕 Estado para restricción iOS
    const [showRestrictionModal, setShowRestrictionModal] = useState(false);
    const [isFriend, setIsFriend] = useState(true); // Por defecto true para no bloquear feed propio, se valida en efecto
    const [isCheckingFriendship, setIsCheckingFriendship] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Sincronizar contenido si cambia el prop (ej. recarga padre)
    useEffect(() => {
        setDisplayContent(post.contenido);
    }, [post.contenido]);

    // Auto-open comments if deep linked
    useEffect(() => {
        if (highlightCommentId && !localShowComments) {
            setLocalShowComments(true);
            if (isMobile) {
                document.body.style.overflow = 'hidden';
            }
        }
    }, [highlightCommentId, isMobile]); // Added dependency to behave correctly on load

    const isFeedMode = variant === 'feed';
    const context = profileContext || {};

    // Inicializar isSaved comprobando si currentUser (autenticado) ha guardado el post
    useEffect(() => {
        // Priorizar siempre currentUser (usuario autenticado) para verificar si está guardado
        if (currentUser?.savedPosts) {
            // savedPosts puede ser array de strings (IDs) o poblados
            const savedIds = currentUser.savedPosts.map(p => typeof p === 'string' ? p : p._id);
            setIsSaved(savedIds.includes(post._id));
        } else if (isFeedMode && !currentUser) {
            setIsSaved(false);
        } else if (!isFeedMode && profileContext?.savedPosts && currentUser?._id === context.user?._id) {
            // Fallback para modo perfil PROPIO si currentUser no estuviera actualizado (raro)
            const savedPostIds = Array.isArray(profileContext.savedPosts)
                ? profileContext.savedPosts.map(p => typeof p === 'string' ? p : p._id)
                : [];
            setIsSaved(savedPostIds.includes(post._id));
        }
    }, [post._id, currentUser, profileContext?.savedPosts, isFeedMode, context.user]);

    // 🆕 Verificar estado de amistad si es post de otro
    useEffect(() => {
        const checkFriendship = async () => {
            if (!currentUser || !post.usuario) return;
            const postOwnerId = post.usuario._id || post.usuario;

            // Si es mi propio post, soy mi amigo :) 
            if (postOwnerId === currentUser._id) {
                setIsFriend(true);
                return;
            }

            // Si estamos en perfil visitante, el estado ya suele estar disponible, 
            // pero si es en Feed, necesitamos validarlo.
            try {
                const response = await friendshipService.getEstado(postOwnerId);
                // Si el autor es Staff/Founder, por ahora seguimos la regla "debes ser amigo" del usuario
                // a menos que el usuario sea Admin (bypass)
                const isStaff = currentUser.rolSistema && ['Founder', 'admin', 'moderador'].includes(currentUser.rolSistema);
                setIsFriend(response.success && response.estado === 'aceptado' || isStaff);
            } catch (error) {
                console.error('Error checking friendship in PostCard:', error);
            }
        };

        checkFriendship();
    }, [post.usuario, currentUser]);

    // ✅ SIEMPRE usar el autor del post (post.usuario) para el header
    // No importa si estamos en feed o perfil, el autor del post debe mostrarse
    const user = post.usuario;
    const avatar = getUserAvatar(user);

    const showComments = isFeedMode ? localShowComments : context.showComments?.[post._id];

    const fullName = `${user?.nombres?.primero || ''} ${user?.apellidos?.primero || ''}`.trim() ||
        user?.email?.split('@')[0] || 'Usuario';

    // Smart name truncation for mobile
    const getShortName = () => {
        if (!isMobile) return fullName;
        const [firstName, ...lastNames] = fullName.split(' ');
        if (lastNames.length === 0) return firstName;
        const lastNameInitial = lastNames[0]?.charAt(0)?.toUpperCase();
        return `${firstName} ${lastNameInitial}.`;
    };

    // Verificar like usando siempre currentUser (usuario autenticado)
    const isLiked = post.likes?.includes(currentUser?._id);

    const handleCommentClick = () => {
        // 🆕 Restricción
        if (!isFriend) {
            setShowRestrictionModal(true);
            return;
        }

        if (isFeedMode) {
            setLocalShowComments(!localShowComments);
            // If mobile, overflow hidden on body to prevent scrolling background
            if (isMobile && !localShowComments) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        } else {
            context.toggleComments?.(post._id);
        }
    };

    // Close modal handler specifically for mobile
    const handleCloseModal = () => {
        setLocalShowComments(false);
        document.body.style.overflow = 'auto';
    };

    // Handler: Navegar al perfil del usuario
    const handleProfileClick = () => {
        const userId = user?._id;
        const currentUserId = currentUser?._id; // Usar currentUser para comparar

        if (!userId) return;

        // Si es tu propio post, ir a /Mi_perfil
        if (userId === currentUserId) {
            navigate('/Mi_perfil');
        } else {
            // Si es de un amigo, ir a /perfil/:userId
            navigate(`/perfil/${userId}`);
        }
    };

    const handleActionRestriction = () => {
        setShowRestrictionModal(true);
    };

    const handleLikeClick = () => {
        // 🆕 Restricción
        if (!isFriend) {
            handleActionRestriction();
            return;
        }

        if (isFeedMode) {
            onLike?.(post._id);
        } else {
            context.handleLike?.(post._id);
        }
    };

    const handleShareClick = () => {
        // 🆕 Restricción
        if (!isFriend) {
            handleActionRestriction();
            return;
        }

        if (isFeedMode) {
            onShare?.(post._id);
        }
    };

    const handleSaveClick = async () => {
        try {
            const response = await userService.toggleSavePost(post._id);

            if (response.success) {
                setIsSaved(!isSaved);
                const message = isSaved ? 'Publicación eliminada de guardados' : 'Publicación guardada exitosamente';
                toast.success(message);

                // Si estamos en modo perfil y es MI perfil, actualizar contexto
                // Si visito a otro, NO debo tocar el contexto del otro
                if (!isFeedMode && context.user?._id === currentUser?._id && context.handleSavePost) {
                    context.handleSavePost(post._id);
                }
            }
        } catch (error) {
            logger.error('Error al guardar post:', error);
            toast.error('No se pudo guardar la publicación');
        }
    };

    // Alias para PostOptionsMenu
    const handleSavePost = handleSaveClick;

    // Handler: Guardar edición
    const handleSaveEdit = async (newContent) => {
        try {
            // Importar dinámicamente el servicio
            const { default: postService } = await import('../../../features/feed/services/postService');

            const response = await postService.updatePost(post._id, newContent);

            if (response && response.success) {
                // Actualizar UI inmediatamente
                setDisplayContent(newContent);
                toast.success('Publicación actualizada');

                // Sincronizar con contexto si es necesario (opcional)
                if (!isFeedMode && context.handleProfileUpdate) {
                    // Futura implementación si se requiere refetch completo
                }
            } else {
                throw new Error(response?.message || 'Error al actualizar');
            }
        } catch (error) {
            console.error('Error updating post:', error);
            toast.error('No se pudo actualizar la publicación');
            throw error;
        }
    };

    const handleAddCommentWrapper = async (postId, content, parentId, image) => {
        console.log('🚀 [PostCard] handleAddCommentWrapper triggered', { postId, parentId, hasImage: !!image });
        try {
            if (isFeedMode) {
                console.log('📦 [PostCard] Calling onAddComment (Feed Mode)');
                if (typeof onAddComment !== 'function') {
                    console.error('❌ [PostCard] CRITICAL: onAddComment is NOT a function in Feed Mode!');
                    return;
                }
                await onAddComment(postId, content, parentId, image);
            } else {
                console.log('📦 [PostCard] Calling context.handleAddComment (Profile Mode)');
                if (typeof context.handleAddComment !== 'function') {
                    console.error('❌ [PostCard] CRITICAL: context.handleAddComment is NOT a function!');
                    return;
                }
                await context.handleAddComment?.(postId, content, parentId, image);
            }
        } catch (error) {
            console.error('❌ [PostCard] Error in wrapper:', error);
        }
    };

    // 🆕 Handler para enviar solicitud desde el modal iOS
    const handleSendRequestFromModal = async () => {
        try {
            setIsCheckingFriendship(true);
            const postOwnerId = post.usuario._id || post.usuario;
            const response = await friendshipService.sendFriendRequest(postOwnerId);
            if (response.success) {
                toast.success('Solicitud de amistad enviada');
                setShowRestrictionModal(false);
            }
        } catch (error) {
            toast.error('No se pudo enviar la solicitud');
        } finally {
            setIsCheckingFriendship(false);
        }
    };



    // Handler: Dejar de seguir
    const handleUnfollow = async () => {
        try {
            const friendUserId = post.usuario?._id || post.usuario;

            logger.log('👥 [UNFOLLOW] Inicio handleUnfollow:', {
                friendUserId,
                fullName,
                postId: post._id
            });

            // Mostrar modal de confirmación
            logger.log('👥 [UNFOLLOW] Mostrando modal de confirmación...');

            setAlertConfig({
                isOpen: true,
                variant: 'warning',
                title: '¿Dejar de seguir?',
                message: `¿Estás seguro de que quieres dejar de seguir a ${fullName}?\n\nYa no verás sus nuevas publicaciones, pero conservarás tus posts guardados.`,
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                buttonText: 'Dejar de seguir',
                onConfirm: async () => {
                    logger.log('👥 [UNFOLLOW] ¡Botón CONFIRMAR presionado!');

                    try {
                        setAlertConfig({ isOpen: false }); // Cerrar modal de confirmación

                        logger.log('👥 [UNFOLLOW] Obteniendo friendshipId...');

                        // 1. Obtener friendshipId
                        const friendshipResponse = await friendshipService.getFriendshipWithUser(friendUserId);

                        if (!friendshipResponse.success) {
                            throw new Error('No se encontró la amistad');
                        }

                        logger.log('👥 [UNFOLLOW] Eliminando amistad:', friendshipResponse.data.friendshipId);

                        // 2. Eliminar amistad
                        const removeResponse = await friendshipService.removeFriendship(
                            friendshipResponse.data.friendshipId
                        );

                        if (removeResponse.success) {
                            logger.log('✅ [UNFOLLOW] Amistad eliminada exitosamente');

                            setAlertConfig({
                                isOpen: true,
                                variant: 'success',
                                message: `✅ Has dejado de seguir a ${fullName}\n\nYa no verás sus nuevas publicaciones en tu feed.`
                            });

                            // Activar animación de fade-out después de 1.5 segundos
                            setTimeout(() => {
                                setIsUnfollowed(true);
                            }, 1500);
                        }
                    } catch (error) {
                        logger.error('❌ [UNFOLLOW] Error:', error);

                        const errorMessage = error.response?.data?.message || error.message;

                        setAlertConfig({
                            isOpen: true,
                            variant: 'error',
                            message: errorMessage === 'No hay amistad con este usuario'
                                ? 'No eres amigo de esta persona'
                                : 'No se pudo eliminar la amistad. Intenta de nuevo.'
                        });
                    }
                }
            });
        } catch (error) {
            logger.error('❌ [UNFOLLOW] Error al preparar confirmación:', error);
            setAlertConfig({
                isOpen: true,
                variant: 'error',
                message: 'Ocurrió un error inesperado'
            });
        }
    };

    // Handler: Reportar
    const handleReport = () => {
        setShowReportModal(true);
        setShowOptionsMenu(false); // Cerrar menú de opciones
    };


    // Mobile Modal Component
    const MobileCommentModal = () => (
        <div className="fixed inset-0 z-50 bg-white dark:bg-black flex flex-col animate-in slide-in-from-bottom-full duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4">
                    <button onClick={handleCloseModal} className="text-gray-900 dark:text-white">
                        <ArrowLeft size={24} />
                    </button>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Comentarios</h2>
                </div>
                <button className="text-gray-500">
                    <Share2 size={24} />
                </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto bg-white dark:bg-black pb-20"> {/* Add padding bottom for fixed input */}
                <CommentSection
                    comments={post.comentarios}
                    postId={post._id}
                    onAddComment={handleAddCommentWrapper}
                    currentUser={currentUser} // SIEMPRE usar currentUser (autenticado)
                    isMobileFormat={true} // Prop flag for CommentSection
                    highlightCommentId={highlightCommentId}
                />
            </div>
        </div>
    );

    return (
        <>
            {/* Post Card Container con animación de fade-out */}
            <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mb-4 transition-all ${isUnfollowed ? 'post-fade-out' : ''} ${post.grupo ? 'border-t-4 border-t-indigo-500' : ''}`}
                onAnimationEnd={() => {
                    if (isUnfollowed) {
                        // Ocultar completamente después de la animación
                        document.querySelector('.post-fade-out')?.classList.add('post-hidden');
                    }
                }}
            >
                {/* Header */}
                <div className="p-4 relative">
                    <div className="flex items-start gap-3 pr-8">
                        {/* Avatar - Perfect Circle */}
                        <div onClick={handleProfileClick} className="relative group cursor-pointer flex-shrink-0">
                            <img
                                src={avatar}
                                alt={fullName}
                                className="w-10 h-10 rounded-full object-cover aspect-square ring-2 ring-transparent group-hover:ring-indigo-500 transition-all"
                                style={{ clipPath: 'circle(50%)' }}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=3b82f6&color=fff&size=128`;
                                }}
                            />
                        </div>

                        {/* Name & Metadata */}
                        <div className="flex-1 min-w-0">
                            {/* Name - Smart Truncation */}
                            <h3 onClick={handleProfileClick} className="font-bold text-gray-900 dark:text-white text-sm hover:underline cursor-pointer truncate">
                                {getShortName()}
                            </h3>

                            {/* Metadata - Two Lines */}
                            <div className="space-y-0.5">
                                {/* Line 1: Group Name (if exists) */}
                                {isFeedMode && post.grupo && (
                                    <div className="flex items-center gap-1 text-[11px] leading-tight">
                                        <span className="font-medium colorMarcaDegader dark:text-indigo-400 hover:underline cursor-pointer">
                                            {post.grupo.nombre}
                                        </span>
                                        <span className="text-gray-400">
                                            · {post.grupo.tipo === 'privado' ? 'Privado' : 'Público'}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                                    <span>
                                        {post.createdAt && !isNaN(new Date(post.createdAt).getTime())
                                            ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: es })
                                            : 'Fecha desconocida'
                                        }
                                    </span>
                                    <span className="flex-shrink-0">
                                        {post.privacidad === 'publico' ? <Globe size={12} /> : post.privacidad === 'amigos' ? <Users size={12} /> : <Lock size={12} />}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Three Dots - Absolute Positioned */}
                    <button
                        onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <MoreHorizontal size={18} />
                    </button>

                    {/* Options Menu */}
                    {/* Options Menu */}
                    <PostOptionsMenu
                        post={post}
                        currentUser={currentUser}
                        isOpen={showOptionsMenu}
                        onClose={() => setShowOptionsMenu(false)}
                        onSave={handleSaveClick}
                        onUnfollow={handleUnfollow}
                        onReport={handleReport}
                        isSaved={isSaved}
                        showSaveAction={isFeedMode} // Ocultar opción de guardar en modo 'Guardados'
                        // Handlers para post propio
                        onDelete={() => {
                            setAlertConfig({
                                isOpen: true,
                                variant: 'danger', // O 'warning', pero 'danger' suele sugerir acción destructiva
                                title: '¿Eliminar publicación?',
                                message: '¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.',
                                showCancelButton: true,
                                cancelButtonText: 'Cancelar',
                                buttonText: 'Eliminar',
                                onConfirm: async () => {
                                    setAlertConfig({ isOpen: false }); // Cerrar el modal

                                    try {
                                        // 1. Activar animación de fade-out
                                        setIsUnfollowed(true);

                                        // 2. Esperar a que termine la animación
                                        setTimeout(async () => {
                                            try {
                                                if (context.handleDeletePost) {
                                                    await context.handleDeletePost(post._id);
                                                } else {
                                                    const { default: postService } = await import('../../../features/feed/services/postService');
                                                    const response = await postService.deletePost(post._id);
                                                    if (response.success) {
                                                        toast.success('Publicación eliminada');
                                                    }
                                                }
                                            } catch (error) {
                                                console.error('Error deleting post:', error);
                                                toast.error('No se pudo eliminar la publicación');
                                                setIsUnfollowed(false);
                                            }
                                        }, 500);

                                    } catch (error) {
                                        console.error('Error in delete flow:', error);
                                        toast.error('Error al iniciar eliminación');
                                    }
                                }
                            });
                        }}
                        onEdit={() => {
                            logger.log('✏️ Edit post requested:', post._id);
                            setShowEditModal(true);
                        }}
                    />
                </div>

                {/* Content - Improved Spacing */}
                {displayContent && (
                    <div className="px-4 pb-3 pt-1">
                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-[15px] leading-[1.6]">
                            {displayContent.split(/(@[a-zA-Z0-9._-]+)/g).map((part, index) => {
                                if (part.match(/^@[a-zA-Z0-9._-]+$/)) {
                                    return (
                                        <span key={index} className="colorMarcaDegader dark:text-indigo-400 font-semibold cursor-pointer hover:underline">
                                            {part}
                                        </span>
                                    );
                                }
                                return part;
                            })}
                        </p>
                    </div>
                )}

                {/* Images (modern system) */}
                {post.images && post.images.length > 0 && (
                    <ImageGallery images={post.images} />
                )}

                {/* Images (legacy system - profile only) */}
                {!isFeedMode && post.imagen && (
                    <>
                        {post.imagen.match(/\.(mp4|avi|mov|wmv)$/i) ? (
                            <video
                                src={`${API_BASE_URL}${post.imagen}`}
                                controls
                                className="w-full rounded-lg mb-3 max-h-96"
                            />
                        ) : (
                            <img
                                src={`${API_BASE_URL}${post.imagen}`}
                                alt="Post"
                                className="w-full rounded-lg mb-3 max-h-96 object-cover"
                            />
                        )}
                    </>
                )}

                {/* Videos (modern system) */}
                {post.videos && post.videos.length > 0 && (
                    <div className="px-4 pb-3 space-y-2">
                        {post.videos.map((video, idx) => (
                            <div key={idx} className="rounded-xl overflow-hidden bg-black">
                                <video
                                    src={video.url}
                                    controls
                                    className="w-full max-h-[500px]"
                                    poster={video.thumbnail}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        {/* Like */}
                        <button
                            onClick={handleLikeClick}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isLiked
                                ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                        >
                            <Heart size={20} className={isLiked ? "fill-current" : ""} />
                            <span className="text-sm font-medium">{post.likes?.length || 0}</span>
                        </button>

                        {/* Comment */}
                        <button
                            onClick={handleCommentClick}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <MessageCircle size={20} />
                            <span className="text-sm font-medium">{post.comentarios?.length || 0}</span>
                        </button>

                        {/* Share (feed only) */}
                        {isFeedMode && (
                            <button
                                onClick={handleShareClick}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <Share2 size={20} />
                                <span className="text-sm font-medium">{post.compartidos?.length || 0}</span>
                            </button>
                        )}

                        {/* Save (profile only) */}
                        {!isFeedMode && (
                            <button
                                onClick={handleSaveClick}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isSaved
                                    ? 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <Bookmark size={20} className={isSaved ? "fill-current" : ""} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Comments Section (Desktop Inline) */}
                {showComments && !isMobile && (
                    <div className="dark:border-gray-800">
                        <CommentSection
                            comments={post.comentarios}
                            postId={post._id}
                            onAddComment={handleAddCommentWrapper}
                            currentUser={isFeedMode ? currentUser : context.user}
                            isMobileFormat={false}
                        />
                    </div>
                )}
            </div>

            {/* Mobile Comment Modal Portal/Overlay */}
            {showComments && isMobile && (
                <MobileCommentModal />
            )}

            {/* Alert Dialog */}
            <AlertDialog
                {...alertConfig}
                onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
            />

            {/* Report Modal */}
            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                contentType="post"
                contentId={post._id}
                onReportSuccess={() => {
                    toast.success('Reporte enviado correctamente');
                }}
            />

            {/* Edit Post Modal */}
            <EditPostModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                post={{ ...post, contenido: displayContent }} // Pass current display content to avoid revert
                onSave={handleSaveEdit}
            />

            {/* 🆕 Modal Restricción estilo iOS */}
            <IOSAlert
                isOpen={showRestrictionModal}
                title="Acción Restringida"
                message={`Debes ser amigo de ${fullName} para poder reaccionar, comentar o compartir esta publicación.`}
                mainActionText="Agregar como Amigo"
                onJoin={handleSendRequestFromModal}
                onCancel={() => setShowRestrictionModal(false)}
                isJoining={isCheckingFriendship}
                icon="person_add"
            />
        </>
    );
};

export default PostCard;


