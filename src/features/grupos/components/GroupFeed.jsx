import { useState } from 'react'
import FeedPostCard from './FeedPostCard'
import mockPosts from '../../../shared/data/groups/mockGroupPosts.json'

const GroupFeed = ({ groupData }) => {
  // Usar datos mock centralizados
  const [posts] = useState(mockPosts)

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
    <div className="flex flex-col ">
      {/* Header */}
      <header className=" p-6 border-b border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#1F2937] ">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Feed del Grupo
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Publicaciones y actualizaciones de {groupData.title}
        </p>
      </header>

      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-[#0a0e27]">
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