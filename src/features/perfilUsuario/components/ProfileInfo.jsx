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
      <div className="pt-4 space-y-2">
        <p className="text-sm md:text-base text-gray-900 dark:text-white text-justify">
          {user.social?.biografia || '¡Hola! Soy parte de la comunidad Degader 🙏'}
        </p>

        {/* Ministerios Minimalista */}
        {user.eclesiastico?.ministerios?.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
            {user.eclesiastico.ministerios.filter(m => m.activo).map((min, index) => {
              // Mapeo simple de nombres para no depender del hook si no es necesario, o importar
              const nombreMinisterio = min.nombre.charAt(0).toUpperCase() + min.nombre.slice(1).replace('_', ' ');
              const cargo = min.cargo === 'lider' ? 'Líder' : min.cargo === 'sublider' ? 'Sublíder' : 'Miembro';

              return (
                <span key={index} className="flex items-center gap-1.5 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  <span className="font-medium">{cargo}</span>
                  <span className="opacity-75">de {nombreMinisterio}</span>
                </span>
              );
            })}
          </div>
        )}

        <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm text-gray-500">
          {user.personal?.ubicacion?.ciudad && (
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {user.personal.ubicacion.ciudad}
            </span>
          )}
          {user.fundacion?.cargo && user.fundacion?.area && (
            <span className="flex items-center gap-1">
              {user.fundacion.cargo} - {user.fundacion.area}
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


