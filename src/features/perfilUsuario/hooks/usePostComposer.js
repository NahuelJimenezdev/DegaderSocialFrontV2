import { useState } from 'react';
import api from '../../../api/config';
import { useImageCompression } from './useImageCompression';

/**
 * Hook para manejar la creación de nuevas publicaciones
 * @param {Object} user - Usuario actual
 * @param {Function} onPostCreated - Callback cuando se crea un post
 * @returns {Object} Estados y funciones para el composer
 */
export const usePostComposer = (user, onPostCreated) => {
  const [newPost, setNewPost] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState('');

  const { compressImage } = useImageCompression();

  /**
   * Maneja la selección de imágenes/videos
   */
  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setPosting(true);
    const newImages = [];
    const newVideos = [];

    for (const file of files) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert(`El archivo ${file.name} es muy grande. Máximo 10MB`);
        continue;
      }

      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) {
        alert(`El archivo ${file.name} no es una imagen o video válido`);
        continue;
      }

      try {
        if (isImage) {
          const compressedBlob = await compressImage(file);
          const reader = new FileReader();
          await new Promise((resolve) => {
            reader.onload = (e) => {
              newImages.push({
                url: e.target.result,
                alt: file.name
              });
              resolve();
            };
            reader.readAsDataURL(compressedBlob);
          });
        } else if (isVideo) {
          const reader = new FileReader();
          await new Promise((resolve) => {
            reader.onload = (e) => {
              newVideos.push({
                url: e.target.result,
                title: file.name
              });
              resolve();
            };
            reader.readAsDataURL(file);
          });
        }
      } catch (error) {
        console.error('Error procesando archivo:', error);
        alert(`Error procesando ${file.name}`);
      }
    }

    if (newImages.length > 0 || newVideos.length > 0) {
      setSelectedImages(prev => [...prev, ...newImages, ...newVideos]);
      const previews = [
        ...newImages.map(img => img.url),
        ...newVideos.map(vid => vid.url)
      ];
      setImagePreviews(prev => [...prev, ...previews]);
    }

    setPosting(false);
    e.target.value = '';
  };

  /**
   * Elimina una imagen de la selección
   */
  const handleRemoveImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  /**
   * Crea una nueva publicación
   */
  const handleCreatePost = async () => {
    setPostError('');

    if (!newPost.trim() && selectedImages.length === 0) return;

    const hasText = newPost.trim().length > 0;
    const hasMedia = selectedImages.length > 0;

    if (!hasText && !hasMedia) {
      setPostError('Debes escribir algo o adjuntar una imagen/video');
      setTimeout(() => setPostError(''), 5000);
      return;
    }

    if (!hasText && hasMedia) {
      setPostError('No puedes publicar imágenes o videos sin un comentario');
      setTimeout(() => setPostError(''), 5000);
      return;
    }

    try {
      setPosting(true);

      const images = selectedImages.filter(item => item.url && item.url.startsWith('data:image/'));
      const videos = selectedImages.filter(item => item.url && item.url.startsWith('data:video/'));

      const postData = {
        contenido: newPost.trim(),
        privacidad: 'publico'
      };

      if (images.length > 0) {
        postData.images = images.map(img => ({ url: img.url, alt: img.alt }));
      }

      if (videos.length > 0) {
        postData.videos = videos.map(vid => ({ url: vid.url, title: vid.title }));
      }

      console.log('🚀 Enviando publicación con base64:', {
        textLength: postData.contenido.length,
        images: images.length,
        videos: videos.length
      });

      const response = await api.post('/publicaciones', postData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success && response.data.data) {
        // Limpiar formulario
        setNewPost('');
        setSelectedImages([]);
        setImagePreviews([]);
        setPostError('');

        // Notificar al padre
        if (onPostCreated) {
          onPostCreated(response.data.data);
        }

        console.log('✅ Publicación creada exitosamente');
      }
    } catch (error) {
      console.error('❌ Error al crear publicación:', error);
      const errorMessage = error.response?.data?.message || 'Error al crear la publicación. Intenta de nuevo.';
      setPostError(errorMessage);
      setTimeout(() => setPostError(''), 5000);
    } finally {
      setPosting(false);
    }
  };

  return {
    newPost,
    setNewPost,
    selectedImages,
    imagePreviews,
    posting,
    postError,
    setPostError,
    handleImageSelect,
    handleRemoveImage,
    handleCreatePost
  };
};
