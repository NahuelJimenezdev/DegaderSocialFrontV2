import React, { useState, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';

const CommentItem = ({ comment, onReply, level = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const [replyImage, setReplyImage] = useState(null);
  const replyFileInputRef = useRef(null);

  const handleReplyImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReplyImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (replyContent.trim() || replyImage) {
      // Si el comentario actual ya es una respuesta (tiene parentComment),
      // usamos ese parentComment como el ID del padre para la nueva respuesta.
      // Si no, usamos el ID del comentario actual.
      const targetParentId = comment.parentComment || comment._id;
      
      onReply(targetParentId, replyContent, replyImage);
      setReplyContent('');
      setReplyImage(null);
      setIsReplying(false);
    }
  };

  const user = comment.usuario;
  const avatar = getUserAvatar(user);
  const fullName = `${user.nombres?.primero || ''} ${user.apellidos?.primero || ''}`.trim() || 'Usuario';

  // Maximum nesting level (0 = root, 1 = reply)
  const maxLevel = 1;

  return (
    <div className={`flex gap-3 ${level > 0 ? 'ml-12 mt-3' : 'mt-4'}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <img 
          src={avatar} 
          alt={fullName} 
          className={`rounded-full object-cover ${level === 0 ? 'w-8 h-8' : 'w-6 h-6'}`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2 inline-block min-w-[200px]">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {fullName}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: es })}
            </span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5 break-words whitespace-pre-wrap">
            {comment.contenido}
          </p>
          {comment.image && (
            <div className="mt-2">
              <img 
                src={comment.image} 
                alt="Imagen adjunta" 
                className="max-h-48 rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-1 ml-2">
          <button 
            onClick={() => setIsReplying(!isReplying)}
            className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            Responder
          </button>
          {/* Future: Add Like button for comments */}
        </div>

        {/* Reply Input */}
        {isReplying && (
          <form onSubmit={handleSubmitReply} className="mt-2 flex flex-col gap-2">
            {replyImage && (
              <div className="relative inline-block w-fit">
                <img src={replyImage} alt="Preview" className="h-20 rounded-lg object-cover border border-gray-200 dark:border-gray-700" />
                <button
                  type="button"
                  onClick={() => setReplyImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            )}
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Responder a ${user.nombres?.primero}...`}
                className="flex-1 bg-gray-100 dark:bg-gray-800 border-0 rounded-full px-4 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
                autoFocus
              />
              <button
                type="button"
                onClick={() => replyFileInputRef.current?.click()}
                className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="Adjuntar imagen"
              >
                <span className="material-symbols-outlined text-[20px]">image</span>
              </button>
              <input
                ref={replyFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleReplyImageSelect}
                className="hidden"
              />
              <button 
                type="submit"
                disabled={!replyContent.trim() && !replyImage}
                className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm disabled:opacity-50 px-2"
              >
                Enviar
              </button>
            </div>
          </form>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="relative">
            {/* Thread line */}
            <div className="absolute top-0 left-[-22px] bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700 rounded-full" />
            
            {comment.replies.map(reply => (
              <CommentItem 
                key={reply._id} 
                comment={reply} 
                onReply={onReply} 
                level={level + 1} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
