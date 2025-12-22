import { useState, useEffect } from 'react';
import { logger } from '../../../shared/utils/logger';
import api from '../../../api/config';

export function usePostsVisitante(usuarioId, puedeVer = false) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!usuarioId || !puedeVer) {
      setPosts([]);
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/publicaciones/usuario/${usuarioId}`);
        const data = response.data;
        
        if (Array.isArray(data)) {
          setPosts(data);
        } else if (Array.isArray(data?.data)) {
          setPosts(data.data);
        } else if (Array.isArray(data?.posts)) {
          setPosts(data.posts);
        } else {
          setPosts([]);
        }
      } catch (err) {
        logger.error('Error al cargar publicaciones:', err);
        setError(err.message);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [usuarioId, puedeVer]);

  return { posts, loading, error };
}



