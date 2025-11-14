import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Camera, MapPin, Calendar, Image as ImageIcon, X, Bookmark } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { postService, userService } from '../../../api';
import api from '../../../api/config';
import EditProfileModal from '../components/EditProfileModal';
import ProfileSkeleton from '../skeleton/ProfileSkeleton';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [showComments, setShowComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState('');
  const [userStats, setUserStats] = useState({ totalPosts: 0, totalAmigos: 0 });
  const [showEditModal, setShowEditModal] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]); // IDs de posts guardados

  // Cargar publicaciones del usuario y posts guardados
  useEffect(() => {
    loadUserPosts();
    loadUserStats();
    loadSavedPosts();
  }, [user]);

  // Cargar posts guardados desde la base de datos
  const loadSavedPosts = async () => {
    if (!user) return;

    try {
      const response = await userService.getSavedPosts();
      if (response.success && response.data) {
        // Extraer solo los IDs de los posts guardados
        const savedPostIds = response.data.posts.map(post => post._id);
        setSavedPosts(savedPostIds);
      }
    } catch (error) {
      console.error('Error al cargar posts guardados:', error);
    }
  };

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

  const loadUserStats = async () => {
    if (!user) return;

    try {
      const response = await userService.getUserStats(user._id);
      setUserStats(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  // Función para comprimir imagen
  const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setPosting(true); // Mostrar que está procesando
    const newImages = [];
    const newVideos = [];

    for (const file of files) {
      // Validar tamaño (10MB máximo)
      const maxSize = 10 * 1024 * 1024;
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
          // Comprimir y convertir imagen a base64
          const compressedBlob = await compressImage(file);
          const reader = new FileReader();
          await new Promise((resolve) => {
            reader.onload = (e) => {
              newImages.push({
                url: e.target.result, // Data URL base64
                alt: file.name
              });
              resolve();
            };
            reader.readAsDataURL(compressedBlob);
          });
        } else if (isVideo) {
          // Convertir video a base64
          const reader = new FileReader();
          await new Promise((resolve) => {
            reader.onload = (e) => {
              newVideos.push({
                url: e.target.result, // Data URL base64
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

      // Crear previews
      const previews = [
        ...newImages.map(img => img.url),
        ...newVideos.map(vid => vid.url)
      ];
      setImagePreviews(prev => [...prev, ...previews]);
    }

    setPosting(false);
    e.target.value = ''; // Limpiar input
  };

  const handleRemoveImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = async () => {
    // Limpiar errores previos
    setPostError('');

    if (!newPost.trim() && selectedImages.length === 0) return;

    // Validar que haya contenido O imágenes/videos
    const hasText = newPost.trim().length > 0;
    const hasMedia = selectedImages.length > 0;

    if (!hasText && !hasMedia) {
      setPostError('Debes escribir algo o adjuntar una imagen/video');
      setTimeout(() => setPostError(''), 5000); // Limpiar después de 5 segundos
      return;
    }

    if (!hasText && hasMedia) {
      setPostError('No puedes publicar imágenes o videos sin un comentario');
      setTimeout(() => setPostError(''), 5000);
      return;
    }

    try {
      setPosting(true);

      // Separar imágenes y videos
      const images = selectedImages.filter(item => item.url && item.url.startsWith('data:image/'));
      const videos = selectedImages.filter(item => item.url && item.url.startsWith('data:video/'));

      // Crear objeto de datos (JSON)
      const postData = {
        contenido: newPost.trim(),
        privacidad: 'publico'
      };

      // Agregar imágenes si existen
      if (images.length > 0) {
        postData.images = images.map(img => ({ url: img.url, alt: img.alt }));
      }

      // Agregar videos si existen
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

      // Backend devuelve: { success, message, data: post }
      if (response.data.success && response.data.data) {
        // Agregar la nueva publicación al inicio de la lista
        setPosts([response.data.data, ...posts]);

        // Limpiar el formulario
        setNewPost('');
        setSelectedImages([]);
        setImagePreviews([]);

        // Limpiar error si existía
        setPostError('');

        // Actualizar estadísticas
        setUserStats(prev => ({ ...prev, totalPosts: prev.totalPosts + 1 }));

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

  const handleLike = async (postId) => {
    // Encontrar el post actual
    const currentPost = posts.find(p => p._id === postId);
    if (!currentPost) return;

    // Determinar si el usuario ya dio like
    const hasLiked = currentPost.likes.includes(user._id);

    // Actualización optimista (inmediata) antes de llamar al servidor
    const updatedLikes = hasLiked
      ? currentPost.likes.filter(id => id !== user._id)
      : [...currentPost.likes, user._id];

    setPosts(posts.map(post =>
      post._id === postId
        ? { ...post, likes: updatedLikes }
        : post
    ));

    try {
      // Llamar al servidor en segundo plano
      await postService.toggleLike(postId);
    } catch (error) {
      console.error('Error al dar like:', error);

      // Revertir el cambio si falla la llamada al servidor
      setPosts(posts.map(post =>
        post._id === postId
          ? { ...post, likes: currentPost.likes }
          : post
      ));

      // Opcional: mostrar mensaje de error al usuario
      alert('No se pudo actualizar el like. Intenta de nuevo.');
    }
  };

  const handleSavePost = async (postId) => {
    try {
      const isSaved = savedPosts.includes(postId);

      // Actualizar UI inmediatamente (optimistic update)
      if (isSaved) {
        setSavedPosts(savedPosts.filter(id => id !== postId));
      } else {
        setSavedPosts([...savedPosts, postId]);
      }

      // Guardar en la base de datos
      const response = await userService.toggleSavePost(postId);

      if (response.success) {
        // Sincronizar con la respuesta del servidor
        setSavedPosts(response.data.savedPosts);
        console.log(isSaved ? '✅ Post eliminado de guardados' : '✅ Post guardado exitosamente');
      }
    } catch (error) {
      console.error('Error al guardar post:', error);
      // Revertir cambio en caso de error
      loadSavedPosts();
    }
  };

  const handleCommentLike = async (postId, commentId) => {
    try {
      // Por ahora solo actualización local (falta endpoint en backend)
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
      console.error('Error al dar like al comentario:', error);
    }
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleProfileUpdate = (updatedUser) => {
    // Actualizar el usuario en el contexto
    updateUser(updatedUser);
    // Recargar publicaciones y stats
    loadUserPosts();
    loadUserStats();
  };

  const handleAddComment = async (postId) => {
    const comment = commentText[postId];
    if (!comment || !comment.trim()) return;

    try {
      await postService.addComment(postId, comment);

      // Recargar el post actualizado
      const response = await postService.getPostById(postId);
      if (response.success && response.data) {
        setPosts(posts.map(p => p._id === postId ? response.data : p));
      }

      // Limpiar el campo de comentario
      setCommentText({ ...commentText, [postId]: '' });
    } catch (error) {
      console.error('Error al comentar:', error);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    if (days < 30) return `Hace ${days} d`;
    return d.toLocaleDateString();
  };


  // Mostrar skeleton mientras carga el usuario o las publicaciones
  if (!user || loading) {
    return <ProfileSkeleton />;
  }

  const avatarUrl = user.avatar
    ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:3001${user.avatar}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nombreCompleto || user.nombre)}&background=3b82f6&color=fff`;

  const coverUrl = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Cover y avatar */}
      <div className="relative">
        <div
          className="h-32 md:h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${coverUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900" />
        </div>

        <div className="max-w-3xl mx-auto px-4">
          <div className="relative -mt-12 md:-mt-16">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt={user.nombreCompleto || user.nombre}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-50 dark:border-gray-900 object-cover"
                />
                <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition">
                  <Camera size={16} />
                </button>
              </div>

              <div className="flex-1 pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      {user.nombreCompleto || `${user.nombre} ${user.apellido}`}
                    </h1>
                    <p className="text-gray-500 text-sm">@{user.email.split('@')[0]}</p>
                  </div>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="bg-blue-500 text-white ml-5 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-600 transition"
                  >
                    Editar perfil
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-sm md:text-base text-gray-900 dark:text-white">
                {user.biografia || '¡Hola! Soy parte de la comunidad Degader 🙏'}
              </p>
              <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm text-gray-500">
                {user.ciudad && (
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {user.ciudad}
                  </span>
                )}
                {user.cargo && user.area && (
                  <span className="flex items-center gap-1">
                    {user.cargo} - {user.area}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  Se unió en {new Date(user.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </span>
              </div>

              <div className="flex gap-4 md:gap-6 pt-2 text-sm">
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">{userStats.totalPosts}</span>
                  <span className="text-gray-500 ml-1">Publicaciones</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">{userStats.totalAmigos}</span>
                  <span className="text-gray-500 ml-1">Amigos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mt-6 sticky top-0 bg-gray-50 dark:bg-gray-900 z-10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex">
            {['posts', 'media', 'likes'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm md:text-base font-medium capitalize border-b-2 transition-colors ${activeTab === tab
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
              >
                {tab === 'posts' ? 'Publicaciones' : tab === 'media' ? 'Multimedia' : 'Guardados'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        {/* Crear publicación */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <img
              src={avatarUrl}
              alt="Tu foto"
              className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
            />
            <div className="flex-1">
              {/* Mensaje de error */}
              {postError && (
                <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{postError}</span>
                  </p>
                </div>
              )}

              <textarea
                placeholder="¿Qué estás pensando?"
                className="w-full bg-transparent resize-none focus:outline-none text-sm md:text-base text-gray-900 dark:text-white placeholder-gray-400"
                rows="3"
                value={newPost}
                onChange={(e) => {
                  setNewPost(e.target.value);
                  // Limpiar error al empezar a escribir
                  if (postError) setPostError('');
                }}
              />

              {/* Vista previa de imágenes y videos */}
              {imagePreviews.length > 0 && (
                <div className="mt-3">
                  {imagePreviews.length === 1 ? (
                    <div className="relative">
                      {imagePreviews[0].startsWith('data:video/') ? (
                        <video
                          src={imagePreviews[0]}
                          controls
                          className="w-full rounded-lg max-h-96"
                        />
                      ) : (
                        <img
                          src={imagePreviews[0]}
                          alt="Preview"
                          className="w-full rounded-lg max-h-96 object-cover"
                        />
                      )}
                      <button
                        onClick={() => handleRemoveImage(0)}
                        className="absolute top-2 right-2 bg-gray-900 bg-opacity-70 text-white p-1.5 rounded-full hover:bg-opacity-90 transition z-10"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className={`grid gap-1 ${imagePreviews.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                      {imagePreviews.slice(0, 4).map((preview, idx) => (
                        <div key={idx} className="relative">
                          {preview.startsWith('data:video/') ? (
                            <video
                              src={preview}
                              controls
                              className="w-full h-60 rounded-lg object-cover"
                            />
                          ) : (
                            <img
                              src={preview}
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-60 rounded-lg object-cover"
                            />
                          )}
                          <button
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-2 right-2 bg-gray-900 bg-opacity-70 text-white p-1.5 rounded-full hover:bg-opacity-90 transition z-10"
                          >
                            <X size={16} />
                          </button>
                          {idx === 3 && imagePreviews.length > 4 && (
                            <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center pointer-events-none">
                              <span className="text-white text-2xl font-bold">+{imagePreviews.length - 4}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <label className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full cursor-pointer transition" title="Subir imágenes o videos (múltiples archivos, máx. 10MB cada uno)">
                    <ImageIcon size={18} className="text-gray-500" />
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </label>
                </div>
                <button
                  onClick={handleCreatePost}
                  disabled={(!newPost.trim() && selectedImages.length === 0) || posting}
                  className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {posting ? 'Publicando...' : 'Publicar'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de publicaciones */}
        {(() => {
          // Filtrar posts según la pestaña activa
          const getFilteredPosts = () => {
            switch (activeTab) {
              case 'posts':
                return posts; // Mostrar todos los posts
              case 'media':
                // Mostrar solo posts con imágenes o videos
                return posts.filter(post =>
                  (post.images && post.images.length > 0) ||
                  (post.videos && post.videos.length > 0) ||
                  post.imagen // Campo legacy
                );
              case 'likes':
                // Mostrar solo posts guardados
                return posts.filter(post => savedPosts.includes(post._id));
              default:
                return posts;
            }
          };

          const filteredPosts = getFilteredPosts();

          return filteredPosts.length === 0 ? (
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
          ) : (
            filteredPosts.map(post => (
            <div key={post._id} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              {/* Header del post */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-3">
                  <img
                    src={avatarUrl}
                    alt={user.nombreCompleto}
                    className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">
                      {user.nombreCompleto || `${user.nombre} ${user.apellido}`}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                  </div>
                </div>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
                  <MoreHorizontal size={18} className="text-gray-500" />
                </button>
              </div>

              {/* Contenido */}
              <p className="text-sm md:text-base mb-3 text-gray-900 dark:text-white whitespace-pre-wrap">
                {post.contenido}
              </p>

              {/* Imágenes (sistema nuevo con base64) */}
              {post.images && post.images.length > 0 && (
                <div className="mb-3">
                  {post.images.length === 1 ? (
                    <img
                      src={post.images[0].url}
                      alt={post.images[0].alt || 'Imagen'}
                      className="w-full rounded-lg max-h-96 object-cover"
                    />
                  ) : (
                    <div className={`grid gap-1 ${post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
                      {post.images.slice(0, 4).map((img, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={img.url}
                            alt={img.alt || `Imagen ${idx + 1}`}
                            className="w-full h-60 object-cover rounded-lg"
                          />
                          {idx === 3 && post.images.length > 4 && (
                            <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center">
                              <span className="text-white text-3xl font-bold">+{post.images.length - 4}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Videos (sistema nuevo con base64) */}
              {post.videos && post.videos.length > 0 && (
                <div className="mb-3 space-y-2">
                  {post.videos.map((vid, idx) => (
                    <video
                      key={idx}
                      src={vid.url}
                      controls
                      className="w-full rounded-lg max-h-96"
                    />
                  ))}
                </div>
              )}

              {/* Imagen o Video legacy (sistema antiguo con multer) */}
              {post.imagen && (
                <>
                  {post.imagen.match(/\.(mp4|avi|mov|wmv)$/i) ? (
                    <video
                      src={`http://localhost:3001${post.imagen}`}
                      controls
                      className="w-full rounded-lg mb-3 max-h-96"
                    />
                  ) : (
                    <img
                      src={`http://localhost:3001${post.imagen}`}
                      alt="Post"
                      className="w-full rounded-lg mb-3 max-h-96 object-cover"
                    />
                  )}
                </>
              )}

              {/* Acciones */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700 text-sm">
                <button
                  onClick={() => handleLike(post._id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    post.likes?.includes(user._id) ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Heart size={18} fill={post.likes?.includes(user._id) ? 'currentColor' : 'none'} />
                  <span>{post.likes?.length || 0}</span>
                </button>

                <button
                  onClick={() => toggleComments(post._id)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                >
                  <MessageCircle size={18} />
                  <span>{post.comentarios?.length || 0}</span>
                </button>

                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
                  <Share2 size={18} />
                  <span>{post.compartidos?.length || 0}</span>
                </button>

                <button
                  onClick={() => handleSavePost(post._id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    savedPosts.includes(post._id) ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'
                  }`}
                  title={savedPosts.includes(post._id) ? 'Quitar de guardados' : 'Guardar publicación'}
                >
                  <Bookmark size={18} fill={savedPosts.includes(post._id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Sección de comentarios */}
              {showComments[post._id] && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2 mb-4">
                    <img
                      src={avatarUrl}
                      alt="Tu foto"
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 object-cover"
                    />
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        placeholder="Escribe un comentario..."
                        className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                        value={commentText[post._id] || ''}
                        onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment(post._id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleAddComment(post._id)}
                        className="text-blue-500 font-semibold text-sm hover:text-blue-600 transition"
                      >
                        Enviar
                      </button>
                    </div>
                  </div>

                  {/* Lista de comentarios */}
                  {post.comentarios?.map(comment => (
                    <div key={comment._id} className="mt-3">
                      <div className="flex gap-2 md:gap-3">
                        <img
                          src={comment.usuario?.avatar
                            ? `http://localhost:3001${comment.usuario.avatar}`
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.usuario?.nombre || 'Usuario')}&background=3b82f6&color=fff`
                          }
                          alt={comment.usuario?.nombre}
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-2">
                            <p className="font-semibold text-sm">
                              {comment.usuario?.nombreCompleto || `${comment.usuario?.nombre} ${comment.usuario?.apellido}`}
                            </p>
                            <p className="text-sm mt-1 break-words">{comment.contenido}</p>
                          </div>
                          <div className="flex items-center gap-4 mt-1 px-3 text-xs text-gray-500">
                            <span>{formatDate(comment.createdAt)}</span>
                            <button
                              onClick={() => handleCommentLike(post._id, comment._id)}
                              className={`hover:text-blue-500 font-medium transition ${
                                comment.likes?.includes(user._id) ? 'text-blue-500' : ''
                              }`}
                            >
                              Me gusta {comment.likes?.length > 0 && `(${comment.likes.length})`}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            ))
          );
        })()}
      </div>

      {/* Modal de edición de perfil */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onUpdate={handleProfileUpdate}
        className="z-1000"
      />
    </div>
  );
};

export default ProfilePage;
