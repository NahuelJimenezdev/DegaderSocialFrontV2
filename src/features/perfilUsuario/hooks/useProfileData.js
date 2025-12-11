import { useState, useEffect } from 'react';
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
      console.error('Error al cargar publicaciones:', error);
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
      console.error('Error al cargar estadísticas:', error);
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
      console.error('Error al cargar posts guardados:', error);
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
        // Si el post ya existe, actualizarlo
        const exists = prevPosts.some(p => p._id === updatedPost._id);
        if (exists) {
          return prevPosts.map(p => p._id === updatedPost._id ? updatedPost : p);
        }
        // Si es un post nuevo del usuario actual, agregarlo al principio
        if (updatedPost.usuario._id === user?._id) {
          return [updatedPost, ...prevPosts];
        }
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

