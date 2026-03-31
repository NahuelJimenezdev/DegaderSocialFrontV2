import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import './BirthdayPostCard.css'; // Estilos específicos de cumpleaños
import {
    MessageCircle,
    Share2,
    Globe,
    Users,
    Lock,
    ArrowLeft
} from 'lucide-react';
import { getUserAvatar } from '../../utils/avatarUtils';
import ImageGallery from '../../../features/feed/components/ImageGallery';
import CommentSection from '../CommentSection/CommentSection';
import { API_BASE_URL } from '../../config/env';
import { useToast } from '../Toast/ToastProvider';
import IOSAlert from '../IOSAlert';
import { friendshipService } from '../../../api';
import ProgressiveImage from '../ProgressiveImage/ProgressiveImage';

// Icono SVG Personalizado de Party Popper (Garantiza 100% compatibilidad cross-browser sin fallos de Emojis)
const CelebrationIcon = ({ isLiked, size = 22 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-all duration-300 ${isLiked ? 'scale-110 drop-shadow-sm' : 'opacity-70 group-hover:opacity-100'}`}
  >
    {/* Confeti y serpentinas (quedan grises si no está likeado) */}
    <g stroke={isLiked ? "none" : "currentColor"} fill={isLiked ? "none" : "currentColor"} opacity={isLiked ? 1 : 0.6}>
       {/* Serpentina Rosa */}
       <path d="M13 11C13 11 11 7 15 5C19 3 19 8 22 7" stroke={isLiked ? "#F472B6" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
       {/* Serpentina Azul */}
       <path d="M14.5 13.5C14.5 13.5 18 10 18 15C18 20 23 17 23 15" stroke={isLiked ? "#60A5FA" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
       {/* Confeti Puntos */}
       <circle cx="16" cy="2" r="1.5" fill={isLiked ? "#FCD34D" : "currentColor"} stroke="none" />
       <circle cx="21" cy="5" r="1.5" fill={isLiked ? "#34D399" : "currentColor"} stroke="none" />
       <circle cx="10" cy="5" r="1.5" fill={isLiked ? "#F87171" : "currentColor"} stroke="none" />
       <circle cx="19" cy="11" r="1.5" fill={isLiked ? "#A78BFA" : "currentColor"} stroke="none" />
       <circle cx="17" cy="19" r="1.5" fill={isLiked ? "#FCD34D" : "currentColor"} stroke="none" />
    </g>

    {/* Cono */}
    <path 
      d="M3 21L12.5 10C12.5 10 14 9 15 12.5L3 21Z" 
      fill={isLiked ? "#FBBF24" : "transparent"} 
      stroke={isLiked ? "#D97706" : "currentColor"} 
      strokeWidth="1.5" 
      strokeLinejoin="round" 
    />
    {/* Rayas del cono si está likeado */}
    {isLiked && (
      <>
        <path d="M6 16.5L10.5 11" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 19L13.5 14" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
      </>
    )}
  </svg>
);

const BirthdayPostCard = ({
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

    // 🆕 Estado para restricción iOS
    const [showRestrictionModal, setShowRestrictionModal] = useState(false);
    const [isFriend, setIsFriend] = useState(true);
    const [isCheckingFriendship, setIsCheckingFriendship] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-open comments if deep linked
    useEffect(() => {
        if (highlightCommentId && !localShowComments) {
            setLocalShowComments(true);
            if (isMobile) {
                document.body.style.overflow = 'hidden';
            }
        }
    }, [highlightCommentId, isMobile]);

    const isFeedMode = variant === 'feed';
    const context = profileContext || {};

    // 🆕 Verificar estado de amistad si es post de otro
    useEffect(() => {
        const checkFriendship = async () => {
            if (!currentUser || !post.usuario) return;
            const postOwnerId = post.usuario._id || post.usuario;

            if (postOwnerId === currentUser._id) {
                setIsFriend(true);
                return;
            }

            try {
                const response = await friendshipService.getEstado(postOwnerId);
                const isStaff = currentUser.rolSistema && ['Founder', 'admin', 'moderador'].includes(currentUser.rolSistema);
                setIsFriend(response.success && response.estado === 'aceptado' || isStaff);
            } catch (error) {
                console.error('Error checking friendship in PostCard:', error);
            }
        };

        checkFriendship();
    }, [post.usuario, currentUser]);

    const user = post.usuario;
    const avatar = getUserAvatar(user);

    const showComments = isFeedMode ? localShowComments : context.showComments?.[post._id];

    const fullName = `${user?.nombres?.primero || ''} ${user?.apellidos?.primero || ''}`.trim() ||
        user?.email?.split('@')[0] || 'Usuario';

    const getShortName = () => {
        if (!isMobile) return fullName;
        const [firstName, ...lastNames] = fullName.split(' ');
        if (lastNames.length === 0) return firstName;
        const lastNameInitial = lastNames[0]?.charAt(0)?.toUpperCase();
        return `${firstName} ${lastNameInitial}.`;
    };

    const isLiked = post.likes?.includes(currentUser?._id);

    const handleCommentClick = () => {
        if (!isFriend) {
            setShowRestrictionModal(true);
            return;
        }

        if (isFeedMode) {
            setLocalShowComments(!localShowComments);
            if (isMobile && !localShowComments) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        } else {
            context.toggleComments?.(post._id);
        }
    };

    const handleCloseModal = () => {
        setLocalShowComments(false);
        document.body.style.overflow = 'auto';
    };

    const handleProfileClick = () => {
        const userId = user?._id;
        const currentUserId = currentUser?._id;

        if (!userId) return;

        if (userId === currentUserId) {
            navigate('/Mi_perfil');
        } else {
            navigate(`/perfil/${userId}`);
        }
    };

    const handleActionRestriction = () => {
        setShowRestrictionModal(true);
    };

    const handleLikeClick = () => {
        const isFounderPublicPost = post.privacidad === 'publico' && post.usuario?.seguridad?.rolSistema === 'Founder';

        if (!isFriend && !isFounderPublicPost) {
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
        if (!isFriend) {
            handleActionRestriction();
            return;
        }

        // --- RUTA PRO: Copia directa del link optimizado para WhatsApp ---
        const shareUrl = `${API_BASE_URL}/api/share/post/${post._id}`;
        
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                toast.success('¡Enlace festivo copiado al portapapeles!');
            })
            .catch(() => {
                toast.error('No se pudo copiar el enlace.');
            });
    };

    const handleAddCommentWrapper = async (postId, content, parentId, image) => {
        try {
            if (isFeedMode) {
                if (typeof onAddComment !== 'function') return;
                await onAddComment(postId, content, parentId, image);
            } else {
                if (typeof context.handleAddComment !== 'function') return;
                await context.handleAddComment?.(postId, content, parentId, image);
            }
        } catch (error) {
            console.error('Error in wrapper:', error);
        }
    };

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

    const MobileCommentModal = () => (
        <div className="fixed inset-0 z-50 bg-white dark:bg-black flex flex-col animate-in slide-in-from-bottom-full duration-300">
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
            <div className="flex-1 overflow-y-auto bg-white dark:bg-black pb-20">
                <CommentSection
                    comments={post.comentarios}
                    postId={post._id}
                    onAddComment={handleAddCommentWrapper}
                    currentUser={currentUser}
                    isMobileFormat={true}
                    highlightCommentId={highlightCommentId}
                />
            </div>
        </div>
    );

    return (
        <>
            {/* Tarjeta de Cumpleaños Especial */}
            <div className={`birthday-card rounded-xl border border-gray-200 mb-4 transition-all shadow-md ${post.grupo ? 'border-t-4 border-t-indigo-500' : ''}`}>
                
                {/* Decoración Festiva (Globos) */}
                <div className="birthday-balloon balloon-1"></div>
                <div className="birthday-balloon balloon-2"></div>
                <div className="birthday-balloon balloon-5"></div>
                
                {/* Grupo unido de globos abajo */}
                <div className="balloon-group-bottom">
                    <div className="birthday-balloon balloon-3"></div>
                    <div className="birthday-balloon balloon-4"></div>
                </div>

                <div className="birthday-card-content">
                    {/* Header */}
                    <div className="p-4 relative">
                        <div className="flex items-start gap-3 pr-8">
                            <div onClick={handleProfileClick} className="relative group cursor-pointer flex-shrink-0">
                                <ProgressiveImage
                                    src={avatar}
                                    medium={user?.social?.fotoPerfilObj?.medium}
                                    large={user?.social?.fotoPerfilObj?.large}
                                    blurHash={user?.social?.fotoPerfilObj?.blurHash}
                                    alt={fullName}
                                    className="w-10 h-10 rounded-full object-cover aspect-square ring-2 ring-transparent group-hover:ring-indigo-500 transition-all block"
                                    style={{ clipPath: 'circle(50%)' }}
                                    aspectRatio="1/1"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=3b82f6&color=fff&size=128`;
                                    }}
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 onClick={handleProfileClick} className="font-bold text-gray-900 text-sm hover:underline cursor-pointer truncate">
                                    {getShortName()}
                                </h3>
                                <div className="space-y-0.5">
                                    {isFeedMode && post.grupo && (
                                        <div className="flex items-center gap-1 text-[11px] leading-tight">
                                            <span className="font-medium colorMarcaDegader hover:underline cursor-pointer">
                                                {post.grupo.nombre}
                                            </span>
                                            <span className="text-gray-400">
                                                · {post.grupo.tipo === 'privado' ? 'Privado' : 'Público'}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1 text-[11px] text-gray-500 leading-tight">
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
                        {/* Menú de Opciones removido intencionalmente para la tarjeta de cumpleaños */}
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-4 pt-1 space-y-4">
                        {post.metadatos?.title && (
                            <h2 
                                style={{ 
                                    fontFamily: post.metadatos.titleFont || 'inherit',
                                    fontWeight: 'bold',
                                    fontSize: isMobile ? '1.5rem' : '2rem'
                                }}
                                className="text-slate-900 leading-tight text-center"
                            >
                                {post.metadatos.title}
                            </h2>
                        )}

                        {post.contenido && (
                            <p 
                                style={{ 
                                    fontFamily: post.metadatos?.textFont || 'inherit',
                                    fontSize: post.metadatos?.textFont?.includes('Courier') ? '14px' : '16px'
                                }}
                                className="birthday-message whitespace-pre-wrap text-center"
                            >
                                {post.contenido.split(/(@[a-zA-Z0-9._-]+)/g).map((part, index) => {
                                    if (part.match(/^@[a-zA-Z0-9._-]+$/)) {
                                        return (
                                            <span key={index} className="colorMarcaDegader font-semibold cursor-pointer hover:underline">
                                                {part}
                                            </span>
                                        );
                                    }
                                    return part;
                                })}
                            </p>
                        )}
                    </div>

                    {/* Images */}
                    {post.images && post.images.length > 0 && (
                        <ImageGallery images={post.images} />
                    )}

                    {!isFeedMode && post.imagen && (
                        <>
                            {post.imagen.match(/\.(mp4|avi|mov|wmv)$/i) ? (
                                <video
                                    src={`${API_BASE_URL}${post.imagen}`}
                                    controls
                                    className="w-full rounded-lg mb-3 max-h-96"
                                />
                            ) : (
                                <ProgressiveImage
                                    src={`${API_BASE_URL}${post.imagen}`}
                                    alt="Post"
                                    className="w-full rounded-lg mb-3 object-cover"
                                    containerClass="max-h-96"
                                />
                            )}
                        </>
                    )}

                    {/* Videos */}
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
                        <div className="flex items-center justify-between pointer-events-auto">
                            <button
                                onClick={handleLikeClick}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors z-20 relative group ${isLiked
                                    ? 'text-yellow-600 hover:bg-yellow-50'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <CelebrationIcon isLiked={isLiked} size={22} />
                                <span className="text-sm font-medium">{post.likesCount ?? post.likes?.length ?? 0}</span>
                            </button>

                            <button
                                onClick={handleCommentClick}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg z-20 relative text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <MessageCircle size={20} />
                                <span className="text-sm font-medium">{post.commentsCount ?? post.comentarios?.length ?? 0}</span>
                            </button>

                            {isFeedMode && (
                                <button
                                    onClick={handleShareClick}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg z-20 relative text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    <Share2 size={20} />
                                    <span className="text-sm font-medium">{post.sharesCount ?? post.compartidos?.length ?? 0}</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {showComments && !isMobile && (
                        <div className="dark:border-gray-800 relative z-20">
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
            </div>

            {showComments && isMobile && (
                <MobileCommentModal />
            )}

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

export default BirthdayPostCard;
