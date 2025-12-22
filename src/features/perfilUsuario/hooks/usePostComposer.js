import { useState } from 'react';
import { logger } from '../../../shared/utils/logger';
import api from '../../../api/config';

/**
 * Hook para manejar la creación de publicaciones (Adaptador Stateless)
 * Ahora delega el estado de UI al componente compartido CreatePostCard.
 * 
 * @param {Object} user - Usuario actual
 * @param {Function} onPostCreated - Callback para actualizar el contexto localmente
 */
export const usePostComposer = (user, onPostCreated) => {
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState('');

  /**
   * Crea una nueva publicación usando los datos del componente UI
   * @param {Object} postDataData - Datos del post { contenido, privacidad, images, videos }
   */
  const createPost = async (postData) => {
    setPostError('');
    setPosting(true);

    try {
      logger.log('🚀 Enviando publicación (Profile):', {
        textLength: postData.contenido.length,
        hasImages: postData.images?.length > 0,
        hasVideos: postData.videos?.length > 0
      });

      const response = await api.post('/publicaciones', postData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success && response.data.data) {
        // Notificar al contexto para que actualice la lista
        if (onPostCreated) {
          onPostCreated(response.data.data);
        }
        logger.log('✅ Publicación creada exitosamente (Profile)');
      }
    } catch (error) {
      logger.error('❌ Error al crear publicación:', error);
      const errorMessage = error.response?.data?.message || 'Error al crear la publicación.';
      setPostError(errorMessage);
      setTimeout(() => setPostError(''), 5000);
      throw error; // Rethrow so component knows it failed
    } finally {
      setPosting(false);
    }
  };

  return {
    createPost,
    posting,
    postError
  };
};
