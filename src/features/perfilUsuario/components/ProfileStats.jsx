import React, { memo } from 'react';

/**
 * Componente para mostrar las estadísticas del usuario
 * Optimizado con React.memo para evitar re-renders innecesarios
 */
const ProfileStats = memo(({ stats }) => {
  const { totalPosts = 0, totalAmigos = 0 } = stats || {};

  return (
    <div className="flex gap-4 md:gap-6 pt-2 text-sm">
      <div>
        <span className="font-bold text-gray-900 dark:text-white">{totalPosts}</span>
        <span className="text-gray-500 ml-1">Publicaciones</span>
      </div>
      <div>
        <span className="font-bold text-gray-900 dark:text-white">{totalAmigos}</span>
        <span className="text-gray-500 ml-1">Amigos</span>
      </div>
    </div>
  );
});

ProfileStats.displayName = 'ProfileStats';

export default ProfileStats;


