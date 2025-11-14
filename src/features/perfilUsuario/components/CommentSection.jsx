import React from 'react';
import { formatDate } from '../utils/dateFormatter';

/**
 * Componente para la sección de comentarios de un post
 */
const CommentSection = ({
  post,
  user,
  avatarUrl,
  onAddComment,
  onCommentLike,
  commentText,
  onCommentTextChange
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onAddComment(post._id);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      {/* Input para nuevo comentario */}
      <div className="flex gap-2 mb-4">
        <img
          src={avatarUrl}
          alt="Tu foto"
          className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 object-cover"
        />
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Escribe un comentario..."
            className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            value={commentText || ''}
            onChange={(e) => onCommentTextChange(post._id, e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={() => onAddComment(post._id)}
            className="text-blue-500 font-semibold text-sm hover:text-blue-600 transition"
          >
            Enviar
          </button>
        </div>
      </div>

      {/* Lista de comentarios */}
      {post.comentarios?.map(comment => (
        <div key={comment._id} className="mt-3">
          <div className="flex gap-2 md:gap-3">
            <img
              src={
                comment.usuario?.avatar
                  ? `http://localhost:3001${comment.usuario.avatar}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.usuario?.nombre || 'Usuario')}&background=3b82f6&color=fff`
              }
              alt={comment.usuario?.nombre}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-2">
                <p className="font-semibold text-sm">
                  {comment.usuario?.nombreCompleto || `${comment.usuario?.nombre} ${comment.usuario?.apellido}`}
                </p>
                <p className="text-sm mt-1 break-words">{comment.contenido}</p>
              </div>
              <div className="flex items-center gap-4 mt-1 px-3 text-xs text-gray-500">
                <span>{formatDate(comment.createdAt)}</span>
                <button
                  onClick={() => onCommentLike(post._id, comment._id)}
                  className={`hover:text-blue-500 font-medium transition ${
                    comment.likes?.includes(user._id) ? 'text-blue-500' : ''
                  }`}
                >
                  Me gusta {comment.likes?.length > 0 && `(${comment.likes.length})`}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
