// src/features/grupos/components/GroupFeed.jsx
import React, { useState } from 'react';
import FeedPostCard from './FeedPostCard';

const GroupFeed = ({ groupData }) => {
  // Datos de ejemplo de publicaciones
  const [posts] = useState([
    {
      id: 1,
      userName: 'Jane Doe',
      userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKi4vYLPeWlFhKz-xu2vUxec0O4srhER-tUMZTnfFuci4bvVxJ0qq0mhvMehdyaR9mlHYzCD8nOG9ghQEWvG7SF3LfPZo7Mo7VBRyVFs4nAZvRLLP1HZ8_xMibGqlZPxUg7yUhg4kumKZn5tb7FcXTPu7kMPCNKdYVvqfNi0Dnfpg5IPBdbpAjAWxCsXBmBjCNMh7YlJTrUcK1xh3SPLkTpOLDeuSRWcwa-JbRUPdMf10IBjczJQM6uOe8rauvDkPiVln6rneeY-8-',
      timeAgo: '1 day ago',
      content: 'Had an amazing time at the youth group retreat this weekend! So blessed to be part of this community.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIcIfh197SK9cUNpSd2OIRAcM-KjFZA1aAsSrvffHbDaxX9SBKMT82jjLukXojexSTZSBArm_R3V8ba4hqPa8VVmsdoHkvmysqO7pIMUV8VmDGyPOnTRP_Dy0EYH-EslnHyL9koLySln6J47ZEES7pR1hD7hbH04cSX4VKyNaGiVBF8YkhU39U9HKcGxZwrdAEt74ZOl6IHclhqBLTuWRnvlEVG2c79Ii0m3K712zAUD5LLj_xf2h_Y71SBBJFL-buEgzUA5YIGIE_',
      imageAlt: 'Youth group members sitting around a campfire',
      likes: 12,
      comments: 3,
      isLiked: false
    },
    {
      id: 2,
      userName: 'John Smith',
      userAvatar: 'https://i.pravatar.cc/150?img=12',
      timeAgo: '2 days ago',
      content: '¡Gracias a todos por sus oraciones! Dios es fiel y está obrando en mi vida de maneras increíbles.',
      likes: 24,
      comments: 8,
      isLiked: false
    },
    {
      id: 3,
      userName: 'María González',
      userAvatar: 'https://i.pravatar.cc/150?img=5',
      timeAgo: '3 days ago',
      content: 'Recordatorio: El próximo estudio bíblico será el viernes a las 7 PM. ¡Nos vemos ahí! 📖✨',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop',
      imageAlt: 'Bible study materials',
      likes: 18,
      comments: 5,
      isLiked: true
    }
  ]);

  const [newPost, setNewPost] = useState('');

  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      console.log('Nueva publicación:', newPost);
      // Aquí agregarías la lógica para publicar
      setNewPost('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="p-6 border-b border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#1F2937] flex-shrink-0">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Feed del Grupo
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Publicaciones y actualizaciones de {groupData?.nombre || 'este grupo'}
        </p>
      </header>

      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-[#0a0e27] scrollbar-thin">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Crear nueva publicación */}
          <div className="bg-white dark:bg-[#1C2431] rounded-xl p-4 border border-slate-200 dark:border-slate-800">
            <form onSubmit={handleSubmitPost}>
              <div className="flex gap-3">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0"
                  style={{ backgroundImage: 'url(https://i.pravatar.cc/150?img=20)' }}
                  aria-label="Your profile picture"
                />
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="¿Qué quieres compartir con el grupo?"
                  className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-3 resize-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                  rows="3"
                />
              </div>
              <div className="flex justify-end mt-3 gap-2">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  <span className="material-symbols-outlined text-xl">image</span>
                  <span className="text-sm">Imagen</span>
                </button>
                <button
                  type="submit"
                  disabled={!newPost.trim()}
                  className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Publicar
                </button>
              </div>
            </form>
          </div>

          {/* Lista de publicaciones */}
          {posts.map((post) => (
            <FeedPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupFeed;