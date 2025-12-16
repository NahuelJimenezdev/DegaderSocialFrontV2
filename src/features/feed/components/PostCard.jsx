import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';
import ImageGallery from './ImageGallery';
import PostActions from './PostActions';
import CommentSection from './CommentSection';

const PostCard = ({ post, currentUser, onLike, onComment, onShare }) => {
  const [showComments, setShowComments] = useState(false);

  const user = post.usuario;
  const avatar = getUserAvatar(user);
  const fullName = `${user.nombres?.primero || ''} ${user.apellidos?.primero || ''}`.trim() || 'Usuario';

  const isLiked = post.likes.includes(currentUser?._id);

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-4 overflow-hidden ${post.grupo ? 'border-t-4 border-t-indigo-500' : ''}`}>
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
                const name = fullName || user?.email?.split('@')[0] || 'Usuario';
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=128`;
              }}
            />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm hover:underline cursor-pointer">
              {fullName}
            </h3>

            {/* Group Indicator */}
            {post.grupo && (
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
              <span className="material-symbols-outlined text-[14px]">
                {post.privacidad === 'publico' ? 'public' : post.privacidad === 'amigos' ? 'group' : 'lock'}
              </span>
            </div>
          </div>
        </div>

        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="material-symbols-outlined">more_horiz</span>
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

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <ImageGallery images={post.images} />
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

      {/* Stats (if needed separately, but PostActions handles it) */}

      {/* Actions */}
      <PostActions
        likes={post.likes.length}
        comments={post.comentarios.length}
        shares={post.compartidos?.length || 0}
        isLiked={isLiked}
        onLike={() => onLike(post._id)}
        onComment={handleCommentClick}
        onShare={() => onShare(post._id)}
      />

      {/* Comments */}
      {showComments && (
        <CommentSection
          comments={post.comentarios}
          postId={post._id}
          onAddComment={onComment}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default PostCard;
