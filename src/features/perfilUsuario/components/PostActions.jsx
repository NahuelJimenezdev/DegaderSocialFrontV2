import React, { memo, useMemo, useCallback } from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';

/**
 * Componente para las acciones de un post (like, comentar, compartir, guardar)
 * Optimizado con React.memo y useCallback para evitar re-renders innecesarios
 */
const PostActions = memo(({ post, user, onLike, onSave, onToggleComments, savedPosts }) => {
  // Memoizar estados derivados
  const isLiked = useMemo(() => post.likes?.includes(user._id), [post.likes, user._id]);
  const isSaved = useMemo(() => savedPosts.includes(post._id), [savedPosts, post._id]);

  // Memoizar handlers
  const handleLike = useCallback(() => onLike(post._id), [onLike, post._id]);
  const handleSave = useCallback(() => onSave(post._id), [onSave, post._id]);
  const handleToggleComments = useCallback(() => onToggleComments(post._id), [onToggleComments, post._id]);

  return (
    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700 text-sm">
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
          isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'
        }`}
      >
        <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
        <span>{post.likes?.length || 0}</span>
      </button>

      <button
        onClick={handleToggleComments}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
      >
        <MessageCircle size={18} />
        <span>{post.comentarios?.length || 0}</span>
      </button>

      <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
        <Share2 size={18} />
        <span>{post.compartidos?.length || 0}</span>
      </button>

      <button
        onClick={handleSave}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
          isSaved ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'
        }`}
        title={isSaved ? 'Quitar de guardados' : 'Guardar publicación'}
      >
        <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
});

PostActions.displayName = 'PostActions';

export default PostActions;


