import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { formatDate } from '../utils/dateFormatter';
import PostActions from './PostActions';
import CommentSection from './CommentSection';
import { useProfileContext } from '../context/ProfileContext';

/**
 * Componente para renderizar una tarjeta de publicación
 */
const PostCard = ({ post }) => {
  const {
    user,
    avatarUrl,
    savedPosts,
    showComments,
    commentText,
    setCommentText,
    handleLike,
    handleSavePost,
    handleCommentLike,
    handleAddComment,
    toggleComments
  } = useProfileContext();

  const handleCommentTextChange = (postId, value) => {
    setCommentText({ ...commentText, [postId]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      {/* Header del post */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-3">
          <img
            src={avatarUrl}
            alt={`${user?.nombres?.primero} ${user?.apellidos?.primero}`}
            className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
          />
          <div>
            <p className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">
              {`${user?.nombres?.primero} ${user?.apellidos?.primero}`}
            </p>
            <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
          <MoreHorizontal size={18} className="text-gray-500" />
        </button>
      </div>

      {/* Contenido */}
      <p className="text-sm md:text-base mb-3 text-gray-900 dark:text-white whitespace-pre-wrap">
        {post.contenido}
      </p>

      {/* Imágenes (sistema nuevo con base64) */}
      {post.images && post.images.length > 0 && (
        <div className="mb-3">
          {post.images.length === 1 ? (
            <img
              src={post.images[0].url}
              alt={post.images[0].alt || 'Imagen'}
              className="w-full rounded-lg max-h-96 object-cover"
            />
          ) : (
            <div className={`grid gap-1 ${post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
              {post.images.slice(0, 4).map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={img.url}
                    alt={img.alt || `Imagen ${idx + 1}`}
                    className="w-full h-60 object-cover rounded-lg"
                  />
                  {idx === 3 && post.images.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center">
                      <span className="text-white text-3xl font-bold">+{post.images.length - 4}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Videos (sistema nuevo con base64) */}
      {post.videos && post.videos.length > 0 && (
        <div className="mb-3 space-y-2">
          {post.videos.map((vid, idx) => (
            <video
              key={idx}
              src={vid.url}
              controls
              className="w-full rounded-lg max-h-96"
            />
          ))}
        </div>
      )}

      {/* Imagen o Video legacy (sistema antiguo con multer) */}
      {post.imagen && (
        <>
          {post.imagen.match(/\.(mp4|avi|mov|wmv)$/i) ? (
            <video
              src={`http://localhost:3001${post.imagen}`}
              controls
              className="w-full rounded-lg mb-3 max-h-96"
            />
          ) : (
            <img
              src={`http://localhost:3001${post.imagen}`}
              alt="Post"
              className="w-full rounded-lg mb-3 max-h-96 object-cover"
            />
          )}
        </>
      )}

      {/* Acciones */}
      <PostActions
        post={post}
        user={user}
        onLike={handleLike}
        onSave={handleSavePost}
        onToggleComments={toggleComments}
        savedPosts={savedPosts}
      />

      {/* Sección de comentarios */}
      {showComments[post._id] && (
        <CommentSection
          post={post}
          user={user}
          avatarUrl={avatarUrl}
          onAddComment={handleAddComment}
          onCommentLike={handleCommentLike}
          commentText={commentText[post._id]}
          onCommentTextChange={handleCommentTextChange}
        />
      )}
    </div>
  );
};

export default PostCard;
