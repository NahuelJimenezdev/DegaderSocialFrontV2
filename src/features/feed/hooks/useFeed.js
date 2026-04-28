import { useState, useEffect, useCallback } from 'react';
import { logger } from '../../../shared/utils/logger';
import postService from '../services/postService';

const useFeed = (userId = null, currentUser) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [pendingPosts, setPendingPosts] = useState([]);
  const [newPostsCount, setNewPostsCount] = useState(0);

  const fetchFeed = useCallback(async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      const data = userId
        ? await postService.getUserPosts(userId, pageNum)
        : await postService.getFeed(pageNum);

      const newPosts = data.data.posts;

      setPosts(prev => reset ? newPosts : [...prev, ...newPosts]);
      setHasMore(data.data.pagination.hasMore !== undefined ? data.data.pagination.hasMore : data.data.pagination.page < data.data.pagination.pages);
      setPage(pageNum);
      
      // Si estamos reseteando (ej: al aplicar pendientes), limpiar contadores
      if (reset) {
        setPendingPosts([]);
        setNewPostsCount(0);
      }
    } catch (err) {
      logger.error('Error fetching feed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchFeed(page + 1);
    }
  }, [loading, hasMore, page, fetchFeed]);

  const applyPendingPosts = useCallback(() => {
    if (pendingPosts.length > 0) {
      setPosts(prev => [...pendingPosts, ...prev]);
      setPendingPosts([]);
      setNewPostsCount(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pendingPosts]);

  useEffect(() => {
    fetchFeed(1, true);
  }, [fetchFeed]);

  // Escuchar actualizaciones en tiempo real
  useEffect(() => {
    const handlePostUpdate = (event) => {
      const updatedPost = event.detail;
      
      // Verificar si el post ya existe en la lista actual
      const existsInPosts = posts.some(p => p._id === updatedPost._id);
      
      if (existsInPosts) {
        // Si ya existe, es una actualización (like, comentario, etc), actualizamos en caliente
        setPosts(prevPosts => prevPosts.map(p => p._id === updatedPost._id ? updatedPost : p));
        return;
      }

      // Si NO existe, es un post NUEVO
      // Estrategia: Si estamos en la página 1, lo ponemos en pendientes para avisar al usuario
      // excepto si es el propio usuario el autor (en ese caso lo mostramos directo)
      if (page === 1) {
        const isMyPost = currentUser && (updatedPost.usuario?._id === currentUser._id || updatedPost.usuario === currentUser._id);
        
        if (isMyPost) {
          setPosts(prev => [updatedPost, ...prev]);
        } else {
          setPendingPosts(prev => {
            // Evitar duplicados en pendientes
            if (prev.some(p => p._id === updatedPost._id)) return prev;
            return [updatedPost, ...prev];
          });
          setNewPostsCount(prev => prev + 1);
        }
      }
    };

    const handlePostDelete = (event) => {
      const deletedPostId = event.detail;
      setPosts(prevPosts => prevPosts.filter(p => p._id !== deletedPostId));
      setPendingPosts(prev => prev.filter(p => p._id !== deletedPostId));
    };

    window.addEventListener('socket:post:updated', handlePostUpdate);
    window.addEventListener('socket:post:created', handlePostUpdate); // También escuchamos created
    window.addEventListener('socket:post:deleted', handlePostDelete);

    return () => {
      window.removeEventListener('socket:post:updated', handlePostUpdate);
      window.removeEventListener('socket:post:created', handlePostUpdate);
      window.removeEventListener('socket:post:deleted', handlePostDelete);
    };
  }, [page, currentUser, posts]);

  const handleLike = async (postId) => {
    try {
      if (!currentUser) return;

      // Optimistic update
      setPosts(prevPosts => prevPosts.map(post => {
        if (post._id === postId) {
          const likesArray = post.likes || [];
          const isLiked = likesArray.includes(currentUser._id);
          const currentCount = post.likesCount ?? likesArray.length ?? 0;
          
          return {
            ...post,
            likes: isLiked
              ? likesArray.filter(id => id !== currentUser._id)
              : [...likesArray, currentUser._id],
            likesCount: isLiked ? Math.max(0, currentCount - 1) : currentCount + 1
          };
        }
        return post;
      }));

      const response = await postService.toggleLike(postId);

      if (response.success) {
        const updatedPostData = await postService.getPostById(postId);
        if (updatedPostData.success) {
          setPosts(prevPosts => prevPosts.map(p => p._id === postId ? updatedPostData.data : p));
        }
      }
    } catch (err) {
      logger.error('Error liking post:', err);
    }
  };

  const handleAddComment = async (postId, content, parentCommentId, image) => {
    try {
      const response = await postService.addComment(postId, content, parentCommentId, image);
      if (response.success) {
        // Increment comments count optimistically
        setPosts(prevPosts => prevPosts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              commentsCount: (post.commentsCount || 0) + 1
            };
          }
          return post;
        }));

        const updatedPostData = await postService.getPostById(postId);
        if (updatedPostData.success) {
          setPosts(prevPosts => prevPosts.map(p => p._id === postId ? updatedPostData.data : p));
        }
      }
    } catch (err) {
      logger.error('Error adding comment:', err);
    }
  };

  const handleShare = async (postId) => {
    // Share logic placeholder
  };

  const handleCreatePost = async (postData) => {
    try {
      const response = await postService.createPost(postData);
      if (response.success) {
        // Refresh feed to show new post
        await fetchFeed(1, true);
      }
      return response;
    } catch (err) {
      logger.error('Error creating post:', err);
      throw err;
    }
  };

  return { posts, loading, error, hasMore, loadMore, fetchFeed, handleLike, handleAddComment, handleShare, handleCreatePost, newPostsCount, applyPendingPosts };
};

export default useFeed;



