import React, { useState } from 'react';
import iglesiaService from '../../../api/iglesiaService';
import { logger } from '../../../shared/utils/logger';
import { useAuth } from '../../../context/AuthContext';

const IglesiaMultimedia = ({ iglesiaData, refetch }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('photos'); // photos, videos
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  // Modal State
  const [selectedMedia, setSelectedMedia] = useState(null);

  const openMedia = (media) => {
    setSelectedMedia(media);
    document.body.style.overflow = 'hidden';
  };

  const closeMedia = () => {
    setSelectedMedia(null);
    document.body.style.overflow = 'unset';
  };

  const navigateMedia = (direction) => {
    const currentList = activeTab === 'photos' ? photos : videos;
    const currentIndex = currentList.findIndex(m => m.id === selectedMedia.id);

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % currentList.length;
    } else {
      newIndex = (currentIndex - 1 + currentList.length) % currentList.length;
    }

    setSelectedMedia(currentList[newIndex]);
  };

  // Verificar Permisos
  const isPastor = iglesiaData?.pastorPrincipal?._id === user?._id || iglesiaData?.pastorPrincipal === user?._id;
  const allowedRoles = ['lider', 'pastor_asociado', 'adminIglesia', 'coordinador', 'director', 'anciano', 'diacono'];
  const userRole = user?.eclesiastico?.rolPrincipal;
  const canUpload = isPastor || (user?.eclesiastico?.activo && allowedRoles.includes(userRole));

  const multimedia = iglesiaData?.multimedia || [];

  const photos = multimedia.filter(m => m.tipo === 'image').map((m, index) => ({
    id: m._id || index,
    url: m.url,
    caption: m.caption || 'Foto',
    date: m.fecha
  })).reverse();

  const videos = multimedia.filter(m => m.tipo === 'video').map((m, index) => ({
    id: m._id || index,
    url: m.url,
    caption: m.caption || 'Video',
    date: m.fecha
  })).reverse();

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (activeTab === 'photos' && !file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    if (activeTab === 'videos' && !file.type.startsWith('video/')) {
      alert('Por favor selecciona un archivo de video válido (mp4, webm)');
      return;
    }

    try {
      setIsUploading(true);
      logger.log('📤 Subiendo archivo Multimedia:', file.name);

      const formData = new FormData();
      formData.append('multimedia', file);
      formData.append('multimediaCaption', `Publicado por ${user.nombres.primero}`);

      await iglesiaService.updateIglesia(iglesiaData._id, formData);

      logger.log('✅ Archivo subido exitosamente');
      if (refetch) await refetch();

    } catch (error) {
      logger.error('❌ Error uploading file:', error);
      alert('Error al subir el archivo. Intenta nuevamente.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-600">collections</span>
              Galería Multimedia
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Momentos capturados de nuestra comunidad
            </p>
          </div>

          {canUpload && (
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={activeTab === 'photos' ? "image/*" : "video/*"}
                onChange={handleFileSelect}
              />

              <button
                onClick={handleButtonClick}
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">
                    {activeTab === 'photos' ? 'add_a_photo' : 'videocam'}
                  </span>
                )}
                <span>
                  {isUploading ? 'Subiendo...' : (activeTab === 'photos' ? 'Subir Foto' : 'Subir Video')}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('photos')}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'photos'
              ? 'text-purple-600 dark:text-purple-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            Fotos
            {activeTab === 'photos' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'videos'
              ? 'text-purple-600 dark:text-purple-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            Videos
            {activeTab === 'videos' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-full" />
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'photos' ? (
          photos.length > 0 ? (
            <div className="multimedia-gallery-grid">
              {photos.map((photo, index) => (
                <div
                  key={photo.id || index}
                  onClick={() => openMedia(photo)}
                  className="relative group rounded-xl overflow-hidden cursor-pointer aspect-square bg-gray-100 dark:bg-gray-800"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Foto de galería'}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white font-medium text-sm truncate w-full">{photo.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-gray-400 text-3xl">image</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sin fotos aún</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Sube la primera foto para comenzar la galería.</p>
            </div>
          )
        ) : (
          videos.length > 0 ? (
            <div className="multimedia-gallery-grid">
              {videos.map((video, index) => (
                <div
                  key={video.id || index}
                  onClick={() => openMedia(video)}
                  className="relative group rounded-xl overflow-hidden shadow-lg cursor-pointer bg-black aspect-square"
                >
                  <video
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                    src={video.url}
                    preload="metadata"
                  >
                    Tu navegador no soporta el tag de video.
                  </video>
                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-white text-3xl">play_arrow</span>
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-gray-200 text-sm truncate">{video.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-purple-600 dark:text-purple-400">
                  videocam_off
                </span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                No hay videos aún
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                La galería de videos está vacía. {canUpload ? '¡Sube el primer video!' : ''}
              </p>
            </div>
          )
        )}
      </div>

      {/* Media Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeMedia}
        >
          <button
            onClick={closeMedia}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[101]"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>

          {/* Navigation Buttons */}
          {(activeTab === 'photos' ? photos.length : videos.length) > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); navigateMedia('prev'); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[101]"
              >
                <span className="material-symbols-outlined text-3xl">chevron_left</span>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); navigateMedia('next'); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[101]"
              >
                <span className="material-symbols-outlined text-3xl">chevron_right</span>
              </button>
            </>
          )}

          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {activeTab === 'photos' ? (
              <img
                src={selectedMedia.url}
                alt={selectedMedia.caption || 'Imagen ampliada'}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
            ) : (
              <video
                controls
                autoPlay
                className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
                src={selectedMedia.url}
              >
                Tu navegador no soporta el tag de video.
              </video>
            )}

            {selectedMedia.caption && (
              <div className="mt-4 text-center">
                <p className="text-white/90 text-lg font-medium">{selectedMedia.caption}</p>
                {selectedMedia.date && (
                  <p className="text-white/60 text-sm mt-1">
                    {new Date(selectedMedia.date).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IglesiaMultimedia;
