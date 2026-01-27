import React from 'react';
import PostCard from '../../../shared/components/Post/PostCard';
import { useProfileContext } from '../context/ProfileContext';
import { useAuth } from '../../../context/AuthContext';

/**
 * Componente para listar las publicaciones del usuario
 */
const PostList = ({ activeTab }) => {
  const context = useProfileContext();
  const { user: authUser } = useAuth(); // Obtener usuario autenticado
  const { posts, savedPosts } = context;

  // Filtrar posts según la pestaña activa
  const getFilteredPosts = () => {
    switch (activeTab) {
      case 'posts':
        return posts;
      case 'media':
        return posts.filter(post =>
          (post.images && post.images.length > 0) ||
          (post.videos && post.videos.length > 0) ||
          post.imagen
        );
      case 'likes':
        // Retornar directamente los posts guardados (CORREGIDO)
        // savedPosts ya contiene los posts completos de la API, no solo IDs
        return Array.isArray(savedPosts) ? savedPosts : [];
      default:
        return posts;
    }
  };

  const filteredPosts = getFilteredPosts();

  if (filteredPosts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
        <p className="text-gray-500">
          {activeTab === 'posts' && 'No tienes publicaciones aún'}
          {activeTab === 'media' && 'No tienes publicaciones con multimedia'}
          {activeTab === 'likes' && 'No tienes publicaciones guardadas'}
        </p>
        {activeTab === 'posts' && (
          <p className="text-sm text-gray-400 mt-2">¡Comparte tu primera publicación!</p>
        )}
      </div>
    );
  }

  return (
    <>
      {filteredPosts.map(post => (
        <PostCard
          key={post._id}
          variant="profile"
          post={post}
          currentUser={authUser} // Usar el usuario autenticado real
          profileContext={context}
        />
      ))}
    </>
  );
};

export default PostList;


