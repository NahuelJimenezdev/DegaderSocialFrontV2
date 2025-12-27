import { useState } from 'react';
import { logger } from '../../../shared/utils/logger';
import { postService, userService } from '../../../api';

/**
 * Hook para manejar las acciones sobre posts (like, save, comment)
 * @param {Object} user - Usuario actual
 * @param {Array} posts - Lista de posts
 * @param {Function} setPosts - Función para actualizar posts
 * @param {Array} savedPosts - Lista de IDs de posts guardados
 * @param {Function} setSavedPosts - Función para actualizar savedPosts
 * @param {Function} loadSavedPosts - Función para recargar savedPosts
 * @returns {Object} Funciones y estados para manejar acciones
 */
export const usePostActions = (user, posts, setPosts, savedPosts, setSavedPosts, loadSavedPosts) => {
  const [showComments, setShowComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, variant: 'info', message: '' });

  /**
   * Maneja el like de un post con actualización optimista
   */
  const handleLike = async (postId) => {
    const currentPost = posts.find(p => p._id === postId);
    if (!currentPost) return;

    const hasLiked = currentPost.likes.includes(user._id);

    // Actualización optimista
    const updatedLikes = hasLiked
      ? currentPost.likes.filter(id => id !== user._id)
      : [...currentPost.likes, user._id];

    setPosts(posts.map(post =>
      post._id === postId
        ? { ...post, likes: updatedLikes }
        : post
    ));

    try {
      await postService.toggleLike(postId);
    } catch (error) {
      logger.error('Error al dar like:', error);

      // Revertir cambio
      setPosts(posts.map(post =>
        post._id === postId
          ? { ...post, likes: currentPost.likes }
          : post
      ));

      setAlertConfig({
        isOpen: true,
        variant: 'error',
        message: 'No se pudo actualizar el like. Intenta de nuevo.'
      });
    }

  };

  /**
   * Guarda o desguarda un post
   */
  const handleSavePost = async (postId) => {
    try {
      const isSaved = savedPosts.includes(postId);

      // Actualización optimista
      if (isSaved) {
        setSavedPosts(savedPosts.filter(id => id !== postId));
      } else {
        setSavedPosts([...savedPosts, postId]);
      }

      const response = await userService.toggleSavePost(postId);

      if (response.success) {
        setSavedPosts(response.data.savedPosts);
        logger.log(isSaved ? '✅ Post eliminado de guardados' : '✅ Post guardado exitosamente');
      }
    } catch (error) {
      logger.error('Error al guardar post:', error);
      loadSavedPosts();
    }
  };

  /**
   * Da like a un comentario
   */
  const handleCommentLike = async (postId, commentId) => {
    try {
      setPosts(posts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comentarios: post.comentarios.map(comment => {
              if (comment._id === commentId) {
                const hasLiked = comment.likes?.includes(user._id);
                return {
                  ...comment,
                  likes: hasLiked
                    ? comment.likes.filter(id => id !== user._id)
                    : [...(comment.likes || []), user._id]
                };
              }
              return comment;
            })
          };
        }
        return post;
      }));
    } catch (error) {
      logger.error('Error al dar like al comentario:', error);
    }
  };

  /**
   * Agrega un comentario a un post
   */
  /**
   * Agrega un comentario a un post
   */
  const handleAddComment = async (postId, content, parentId = null, image = null) => {
    // Validar: Debe haber contenido O imagen
    if ((!content || !content.trim()) && !image) return;

    try {
      // Usar postService.addComment con la firma correcta (postId, contenido, parentId, image)
      await postService.addComment(postId, content, parentId, image);

      const response = await postService.getPostById(postId);
      if (response.success && response.data) {
        setPosts(posts.map(p => p._id === postId ? response.data : p));
      }

      // Limpiar estado local si existiera (aunque ahora lo maneja CommentSection)
      setCommentText(prev => ({ ...prev, [postId]: '' }));
    } catch (error) {
      logger.error('Error al comentar:', error);
    }
  };

  /**
   * Muestra u oculta los comentarios de un post
   */
  const toggleComments = (postId) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  return {
    showComments,
    commentText,
    setCommentText,
    handleLike,
    handleSavePost,
    handleCommentLike,
    handleAddComment,
    toggleComments,
    alertConfig,
    setAlertConfig
  };
};



