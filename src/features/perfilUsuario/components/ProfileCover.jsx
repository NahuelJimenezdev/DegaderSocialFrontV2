import React, { memo, useCallback, useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { useProfileContext } from '../context/ProfileContext';


/**
 * Componente para el cover, avatar y botón de editar perfil
 */
const ProfileCover = ({ user, avatarUrl, coverUrl, onEditClick }) => {
  console.log('🖼️ [ProfileCover] Renderizando con avatarUrl:', avatarUrl);
  const { handleBannerUpdate } = useProfileContext();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleBannerClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await handleBannerUpdate(file);
    } finally {
      setIsUploading(false);
      // Limpiar input para permitir subir el mismo archivo si se desea
      e.target.value = '';
    }
  };

  return (
    <div className="relative group">
      {/* Banner con botón de cámara */}
      <div
        className="h-32 md:h-48 bg-cover bg-center relative transition-all duration-300"
        style={{ backgroundImage: `url(${coverUrl})` }}
      >
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />

        {/* Botón de cámara para el banner */}
        <button
          onClick={handleBannerClick}
          disabled={isUploading}
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2.5 rounded-full backdrop-blur-sm transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
          title="Cambiar banner"
        >
          {isUploading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Camera size={20} />
          )}
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900" />
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <div className="relative -mt-12 md:-mt-16">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="relative">
              <img
                src={avatarUrl}
                alt={`${user?.nombres?.primero || ''} ${user?.apellidos?.primero || ''}`.trim() || user?.email}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-50 dark:border-gray-900 object-cover shadow-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  const name = `${user?.nombres?.primero || ''} ${user?.apellidos?.primero || ''}`.trim() || user?.email?.split('@')[0] || 'Usuario';
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=128`;
                }}
              />

            </div>

            <div className="flex-1 pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    {`${user.nombres?.primero || ''} ${user.apellidos?.primero || ''}`.trim() || user.email?.split('@')[0] || 'Usuario'}
                  </h1>
                  <p className="text-gray-500 text-sm">@{user.social?.username || user.email.split('@')[0]}</p>
                </div>
                <button
                  onClick={onEditClick}
                  className="bg-blue-500 text-white ml-5 px-6 py-2 rounded-full text-sm font-semibold shadow-md shadow-blue-500/20 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95"
                >
                  Editar perfil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProfileCover.displayName = 'ProfileCover';

export default ProfileCover;


