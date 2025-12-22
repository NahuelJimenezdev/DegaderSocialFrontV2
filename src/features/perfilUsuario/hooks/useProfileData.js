import { useState, useEffect } from 'react';
import { logger } from '../../../shared/utils/logger';
import { postService, userService } from '../../../api';

/**
 * Hook para manejar la carga de datos del perfil
 * @param {Object} user - Usuario actual
 * @returns {Object} Datos del perfil y funciones para refetch
 */
export const useProfileData = (user) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({ totalPosts: 0, totalAmigos: 0 });
  const [savedPosts, setSavedPosts] = useState([]);

  // Cargar publicaciones del usuario
  const loadUserPosts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await postService.getUserPosts(user._id);
      setPosts(response.data.posts || []);
    } catch (error) {
      logger.error('Error al cargar publicaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas del usuario
  const loadUserStats = async () => {
    if (!user) return;

    try {
      const response = await userService.getUserStats(user._id);
      setUserStats(response.data);
    } catch (error) {
      logger.error('Error al cargar estadísticas:', error);
    }
  };

  // Cargar posts guardados desde la base de datos
  const loadSavedPosts = async () => {
    if (!user) return;

    try {
      const response = await userService.getSavedPosts();
      if (response.success && response.data) {
        const savedPostIds = response.data.posts.map(post => post._id);
        setSavedPosts(savedPostIds);
      }
    } catch (error) {
      logger.error('Error al cargar posts guardados:', error);
    }
  };

  // Cargar todos los datos al montar el componente
  useEffect(() => {
    if (user) {
      loadUserPosts();
      loadUserStats();
      loadSavedPosts();
    }
  }, [user]);

  // Escuchar actualizaciones en tiempo real
  useEffect(() => {
    const handlePostUpdate = (event) => {
      const updatedPost = event.detail;
      setPosts(prevPosts => {
        // Verificar si el post ya existe
        const existingIndex = prevPosts.findIndex(p => p._id === updatedPost._id);

        if (existingIndex !== -1) {
          // Si existe, actualizarlo
          const newPosts = [...prevPosts];
          newPosts[existingIndex] = updatedPost;
          return newPosts;
        }

        // SOLO agregar si es un post nuevo Y NO es del usuario actual
        // (los posts del usuario actual ya se agregan via onPostCreated)
        if (updatedPost.usuario._id !== user?._id) {
          return [updatedPost, ...prevPosts];
        }

        // Si es del usuario actual y no existe, no hacer nada
        // (ya fue agregado por onPostCreated)
        return prevPosts;
      });
    };

    window.addEventListener('socket:post:updated', handlePostUpdate);
    return () => {
      window.removeEventListener('socket:post:updated', handlePostUpdate);
    };
  }, [user]);

  // Función para refrescar todos los datos
  const refetchAll = () => {
    loadUserPosts();
    loadUserStats();
    loadSavedPosts();
  };

  return {
    posts,
    setPosts,
    loading,
    userStats,
    setUserStats,
    savedPosts,
    setSavedPosts,
    refetchAll,
    loadSavedPosts
  };
};




