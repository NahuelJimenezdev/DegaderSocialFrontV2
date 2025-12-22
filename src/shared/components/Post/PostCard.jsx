import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    MoreHorizontal,
    Heart,
    MessageCircle,
    Share2,
    Bookmark,
    Globe,
    Users,
    Lock
} from 'lucide-react';
import { getUserAvatar } from '../../utils/avatarUtils';
import ImageGallery from '../../../features/feed/components/ImageGallery';
import CommentSection from '../CommentSection/CommentSection';
import { API_BASE_URL } from '../../config/env';

/**
 * Unified PostCard component that supports both Feed and Profile variants
 * 
 * @param {Object} props
 * @param {Object} props.post - Post data
 * @param {'feed'|'profile'} props.variant - Display variant (default: 'feed')
 * @param {Object} props.currentUser - Current user (for feed variant)
 * @param {Function} props.onLike - Like handler (for feed variant)
 * @param {Function} props.onComment - Comment handler (for feed variant)
 * @param {Function} props.onShare - Share handler (for feed variant)
 * @param {Function} props.onAddComment - Add comment handler (for feed variant)
 * @param {Object} props.profileContext - Profile context (for profile variant)
 */
const PostCard = ({
    post,
    variant = 'feed',

    // Feed variant props
    currentUser,
    onLike,
    onComment, // Usually just toggles comment section, but we handle it locally mostly
    onShare,
    onAddComment, // Function to add a comment (api call)

    // Profile variant props (context)
    profileContext
}) => {
    // Local state for feed variant
    const [localShowComments, setLocalShowComments] = useState(false);

    // Determine if we're in feed mode
    const isFeedMode = variant === 'feed';
    const context = profileContext || {};

    // Get data from appropriate source
    const user = isFeedMode ? post.usuario : context.user;
    const avatar = isFeedMode ? getUserAvatar(user) : context.avatarUrl;

    // For profile, showComments is managed by context usually to allow one open at a time, or local?
    // Profile implementation used context.showComments map.
    const showComments = isFeedMode ? localShowComments : context.showComments?.[post._id];

    // User info
    const fullName = `${user?.nombres?.primero || ''} ${user?.apellidos?.primero || ''}`.trim() ||
        user?.email?.split('@')[0] || 'Usuario';

    // Like status
    const isLiked = isFeedMode
        ? post.likes.includes(currentUser?._id)
        : post.likes.includes(context.user?._id);

    // Handlers
    const handleCommentClick = () => {
        if (isFeedMode) {
            setLocalShowComments(!localShowComments);
        } else {
            context.toggleComments?.(post._id);
        }
    };

    const handleLikeClick = () => {
        if (isFeedMode) {
            onLike?.(post._id);
        } else {
            context.handleLike?.(post._id);
        }
    };

    const handleShareClick = () => {
        if (isFeedMode) {
            onShare?.(post._id);
        }
    };

    const handleSaveClick = () => {
        if (!isFeedMode) {
            context.handleSavePost?.(post._id);
        }
    };

    // Comment handler adapter
    const handleAddCommentWrapper = async (postId, content, parentId, image) => {
        if (isFeedMode) {
            // Feed assumes onAddComment(postId, content, parentId, image)
            await onAddComment(postId, content, parentId, image);
        } else {
            // Profile uses context.handleAddComment(postId, content, parentId, image)
            await context.handleAddComment?.(postId, content, parentId, image);
        }
    };

    return (
        <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-4 overflow-hidden ${post.grupo ? 'border-t-4 border-t-indigo-500' : ''
            }`}>
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative group cursor-pointer">
                        <img
                            src={avatar}
                            alt={fullName}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-indigo-500 transition-all"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=3b82f6&color=fff&size=128`;
                            }}
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm hover:underline cursor-pointer">
                            {fullName}
                        </h3>

                        {/* Group Indicator (feed only) */}
                        {isFeedMode && post.grupo && (
                            <div className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                                <span>Publicado en el grupo:</span>
                                <span className="hover:underline cursor-pointer font-bold">{post.grupo.nombre}</span>
                                <span className="text-gray-400 font-normal">
                                    ({post.grupo.tipo === 'privado' ? 'Privado' : 'Público'})
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: es })}</span>
                            <span>•</span>
                            <span className="flex items-center">
                                {post.privacidad === 'publico' ? <Globe size={12} /> : post.privacidad === 'amigos' ? <Users size={12} /> : <Lock size={12} />}
                            </span>
                        </div>
                    </div>
                </div>

                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* Content */}
            {post.contenido && (
                <div className="px-4 pb-3">
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-[15px] leading-relaxed">
                        {post.contenido}
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
                        <span className="text-sm font-medium">{post.likes.length}</span>
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
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${context.savedPosts?.includes(post._id)
                                ? 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                        >
                            <Bookmark size={20} className={context.savedPosts?.includes(post._id) ? "fill-current" : ""} />
                        </button>
                    )}
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="dark:border-gray-800">
                    <CommentSection
                        comments={post.comentarios}
                        postId={post._id}
                        onAddComment={handleAddCommentWrapper}
                        currentUser={isFeedMode ? currentUser : context.user}
                    />
                </div>
            )}
        </div>
    );
};

export default PostCard;


