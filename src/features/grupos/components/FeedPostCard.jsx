// src/features/grupos/components/FeedPostCard.jsx
import React, { useState } from 'react';

const FeedPostCard = ({ post }) => {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="bg-white dark:bg-[#1C2431] rounded-xl p-4 border border-slate-200 dark:border-slate-800">
      {/* Header con foto de perfil y usuario */}
      <div className="flex items-center gap-3">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0"
          style={{ backgroundImage: `url("${post.userAvatar}")` }}
          aria-label={`Profile picture of ${post.userName}`}
        />
        <div>
          <p className="font-bold text-slate-900 dark:text-white">
            {post.userName}
          </p>
          <p className="text-xs text-slate-500 dark:text-[#A0A0A0]">
            {post.timeAgo}
          </p>
        </div>
      </div>

      {/* Contenido del post */}
      <p className="mt-4 text-slate-700 dark:text-slate-300">
        {post.content}
      </p>

      {/* Imagen del post (si existe) */}
      {post.image && (
        <div
          className="mt-4 w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-lg aspect-video"
          style={{ backgroundImage: `url("${post.image}")` }}
          aria-label={post.imageAlt || 'Post image'}
        />
      )}

      {/* Botones de interacción */}
      <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-around">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 p-2 rounded-lg w-full justify-center transition-colors ${liked
              ? 'text-primary dark:text-primary bg-primary/10'
              : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-primary/10'
            }`}
        >
          <span className="material-symbols-outlined text-xl">thumb_up</span>
          <span className="text-sm font-medium">{likeCount} Likes</span>
        </button>

        <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary p-2 rounded-lg hover:bg-primary/10 w-full justify-center">
          <span className="material-symbols-outlined text-xl">chat_bubble</span>
          <span className="text-sm font-medium">{post.comments || 0} Comments</span>
        </button>

        <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary p-2 rounded-lg hover:bg-primary/10 w-full justify-center">
          <span className="material-symbols-outlined text-xl">share</span>
          <span className="text-sm font-medium">Share</span>
        </button>
      </div>
    </div>
  );
};

export default FeedPostCard;