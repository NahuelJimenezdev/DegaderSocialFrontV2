import React, { useState } from 'react';

const IglesiaMultimedia = ({ iglesiaData }) => {
  const [activeTab, setActiveTab] = useState('photos'); // photos, videos
  const fileInputRef = React.useRef(null);

  // Mock data for now
  const photos = [
    { id: 1, url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80', caption: 'Culto Dominical' },
    { id: 2, url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80', caption: 'Grupo de Jóvenes' },
    { id: 3, url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80', caption: 'Cena Navideña' },
    { id: 4, url: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&q=80', caption: 'Bautismos' },
    { id: 5, url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80', caption: 'Concierto de Alabanza' },
    { id: 6, url: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800&q=80', caption: 'Retiro Espiritual' },
  ];

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file);
      // Here you would implement the upload logic
      // e.g., uploadService.upload(file, activeTab === 'photos' ? 'image' : 'video');
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
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={activeTab === 'photos' ? "image/*" : "video/*"}
            onChange={handleFileSelect}
          />

          <button 
            onClick={handleButtonClick}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">
              {activeTab === 'photos' ? 'add_a_photo' : 'videocam'}
            </span>
            <span>
              {activeTab === 'photos' ? 'Subir Foto' : 'Subir Video'}
            </span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('photos')}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === 'photos'
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
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
              activeTab === 'videos'
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
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {photos.map((photo) => (
              <div key={photo.id} className="break-inside-avoid relative group rounded-xl overflow-hidden cursor-pointer">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white font-medium text-sm">{photo.caption}</p>
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
              La galería de videos estará disponible pronto. ¡Mantente atento!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IglesiaMultimedia;


