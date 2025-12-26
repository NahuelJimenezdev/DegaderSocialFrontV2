import React, { memo, useCallback } from 'react';
import { Camera } from 'lucide-react';

/**
 * Componente para el cover, avatar y botón de editar perfil
 */
const ProfileCover = ({ user, avatarUrl, coverUrl, onEditClick }) => {
  console.log('🖼️ [ProfileCover] Renderizando con avatarUrl:', avatarUrl);

  return (
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
                alt={`${user?.nombres?.primero || ''} ${user?.apellidos?.primero || ''}`.trim() || user?.email}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-50 dark:border-gray-900 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  const name = `${user?.nombres?.primero || ''} ${user?.apellidos?.primero || ''}`.trim() || user?.email?.split('@')[0] || 'Usuario';
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=128`;
                }}
              />
              <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition">
                <Camera size={16} />
              </button>
            </div>

            <div className="flex-1 pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                    {`${user.nombres?.primero || ''} ${user.apellidos?.primero || ''}`.trim() || user.email?.split('@')[0] || 'Usuario'}
                  </h1>
                  <p className="text-gray-500 text-sm">@{user.email.split('@')[0]}</p>
                </div>
                <button
                  onClick={onEditClick}
                  className="bg-blue-500 text-white ml-5 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-600 transition"
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


