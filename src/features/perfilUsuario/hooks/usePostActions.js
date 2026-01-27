import { useState } from 'react';
import { logger } from '../../../shared/utils/logger';
import { postService, userService } from '../../../api';
import { useToast } from '../../../shared/components/Toast/ToastProvider';

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
  const toast = useToast();

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
      // Detectar si savedPosts contiene objetos o IDs
      const isSaved = savedPosts.some(p => (p._id || p) === postId);

      // Actualización optimista
      if (isSaved) {
        // Si quitamos, filtramos manteniendo el formato original (objetos o IDs)
        setSavedPosts(prev => prev.filter(p => (p._id || p) !== postId));
      } else {
        // Si agregamos, intentamos buscar el post completo en la lista actual 'posts'
        // Si no está, agregamos solo el ID (el componente deberá manejar esto o recargar)
        const postToAdd = posts.find(p => p._id === postId) || postId;
        setSavedPosts(prev => [...prev, postToAdd]);
      }

      const response = await userService.toggleSavePost(postId);

      if (response.success) {
        // NO sobrescribir savedPosts con response.data.savedPosts porque son solo IDs
        // y rompería la vista de guardados si esperaba objetos.
        // Mantenemos la actualización optimista que ya hicimos.
        const message = isSaved ? 'Publicación eliminada de guardados' : 'Publicación guardada exitosamente';
        toast.success(message);
        logger.log(isSaved ? '✅ Post eliminado de guardados' : '✅ Post guardado exitosamente');
      }
    } catch (error) {
      logger.error('Error al guardar post:', error);
      // En caso de error, recargar todo para asegurar consistencia
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

  /**
   * Elimina un post
   */
  const handleDeletePost = async (postId) => {
    try {
      // 1. Llamar al servicio
      const response = await postService.deletePost(postId);

      // 2. Si es exitoso, actualizar estado local
      if (response && response.success) {
        setPosts(prev => prev.filter(p => p._id !== postId));
        toast.success(response.message || 'Publicación eliminada correctamente');
        logger.log('✅ Post eliminado:', postId);
      } else {
        throw new Error(response.message || 'Error al eliminar');
      }
    } catch (error) {
      logger.error('Error al eliminar post:', error);
      toast.error(error.message || 'No se pudo eliminar la publicación');
      throw error; // Re-lanzar para que el componente sepa
    }
  };

  return {
    showComments,
    commentText,
    setCommentText,
    handleLike,
    handleSavePost,
    handleCommentLike,
    handleAddComment,
    handleDeletePost, // Exportar nueva función
    toggleComments,
    alertConfig,
    setAlertConfig
  };
};



