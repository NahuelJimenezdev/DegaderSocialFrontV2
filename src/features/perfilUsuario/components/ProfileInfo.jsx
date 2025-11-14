import React, { memo, useMemo } from 'react';
import { MapPin, Calendar } from 'lucide-react';
import ProfileStats from './ProfileStats';

/**
 * Componente para la información del usuario (bio, ubicación, stats)
 * Optimizado con React.memo y useMemo para evitar re-renders innecesarios
 */
const ProfileInfo = memo(({ user, stats }) => {
  // Memoizar la fecha formateada
  const joinDate = useMemo(() => {
    return new Date(user.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  }, [user.createdAt]);

  return (
    <div className="max-w-3xl mx-auto px-4">
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
            Se unió en {joinDate}
          </span>
        </div>

        <ProfileStats stats={stats} />
      </div>
    </div>
  );
});

ProfileInfo.displayName = 'ProfileInfo';

export default ProfileInfo;
