import React from 'react';

const PostActions = ({ 
  likes = 0, 
  comments = 0, 
  shares = 0, 
  isLiked = false, 
  onLike, 
  onComment, 
  onShare,
  loading = false
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
      {/* Like Button */}
      <button 
        onClick={onLike}
        disabled={loading}
        className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-colors group ${
          isLiked 
            ? 'text-pink-500' 
            : 'text-gray-500 dark:text-gray-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 hover:text-pink-500'
        }`}
      >
        <span className={`material-symbols-outlined text-[22px] ${isLiked ? 'fill-current' : ''} group-active:scale-90 transition-transform`}>
          favorite
        </span>
        <span className="text-sm font-medium">
          {likes > 0 ? likes : 'Me gusta'}
        </span>
      </button>

      {/* Comment Button */}
      <button 
        onClick={onComment}
        className="flex items-center gap-2 px-2 py-1 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 transition-colors group"
      >
        <span className="material-symbols-outlined text-[22px] group-active:scale-90 transition-transform">
          chat_bubble
        </span>
        <span className="text-sm font-medium">
          {comments > 0 ? comments : 'Comentar'}
        </span>
      </button>

      {/* Share Button */}
      <button 
        onClick={onShare}
        className="flex items-center gap-2 px-2 py-1 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-500 transition-colors group"
      >
        <span className="material-symbols-outlined text-[22px] group-active:scale-90 transition-transform">
          share
        </span>
        <span className="text-sm font-medium">
          {shares > 0 ? shares : 'Compartir'}
        </span>
      </button>
    </div>
  );
};

export default PostActions;


