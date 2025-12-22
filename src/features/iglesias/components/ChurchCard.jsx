import React, { useState, useEffect } from 'react';
import { logger } from '../../../shared/utils/logger';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Award, Check, Briefcase, Calendar } from 'lucide-react';
import { getUserAvatar, getAvatarUrl, getBannerUrl } from '../../../shared/utils/avatarUtils';
import { getSocket } from '../../../shared/lib/socket';

const ChurchCard = ({ iglesia, user, onJoin }) => {
  const navigate = useNavigate();
  const [localIglesia, setLocalIglesia] = useState(iglesia);
  const [isJoining, setIsJoining] = useState(false);

  // Actualizar estado local cuando cambia la prop
  useEffect(() => {
    setLocalIglesia(iglesia);
  }, [iglesia]);

  // Escuchar eventos socket para actualizaciones en tiempo real
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !user?._id) return;

    const handleSolicitudAprobada = (data) => {
      if (data.iglesiaId === localIglesia._id) {
        // Actualizar estado local para reflejar que ahora es miembro
        setLocalIglesia(prev => ({
          ...prev,
          miembros: [...(prev.miembros || []), user._id],
          solicitudes: (prev.solicitudes || []).filter(s => {
            const userId = s.usuario?._id || s.usuario || s;
            return userId.toString() !== user._id.toString();
          })
        }));
      }
    };

    const handleSolicitudRechazada = (data) => {
      if (data.iglesiaId === localIglesia._id) {
        // Remover solicitud pendiente
        setLocalIglesia(prev => ({
          ...prev,
          solicitudes: (prev.solicitudes || []).filter(s => {
            const userId = s.usuario?._id || s.usuario || s;
            return userId.toString() !== user._id.toString();
          })
        }));
      }
    };

    socket.on('solicitudIglesiaAprobada', handleSolicitudAprobada);
    socket.on('solicitudIglesiaRechazada', handleSolicitudRechazada);

    return () => {
      socket.off('solicitudIglesiaAprobada', handleSolicitudAprobada);
      socket.off('solicitudIglesiaRechazada', handleSolicitudRechazada);
    };
  }, [localIglesia._id, user?._id]);

  const pastorId = localIglesia.pastorPrincipal?._id || localIglesia.pastorPrincipal;
  const isPastor = pastorId && user?._id && pastorId.toString() === user._id.toString();
  
  const isMember = !isPastor && localIglesia.miembros?.some(m => {
    const memberId = m._id || m;
    return memberId.toString() === user?._id?.toString();
  });

  const hasPending = localIglesia.solicitudes?.some(s => {
    const userId = s.usuario?._id || s.usuario || s;
    return userId.toString() === user?._id?.toString();
  });

  // Get first 4 members for avatar preview
  const memberPreviews = localIglesia.miembros?.slice(0, 4) || [];
  const memberCount = localIglesia.miembros?.length || 0;

  const handleJoinClick = async () => {
    setIsJoining(true);
    try {
      await onJoin(localIglesia._id);
      // Actualización optimista: agregar solicitud inmediatamente
      setLocalIglesia(prev => ({
        ...prev,
        solicitudes: [
          ...(prev.solicitudes || []),
          { usuario: user._id, fecha: new Date() }
        ]
      }));
    } catch (error) {
      logger.error('Error al unirse:', error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Cover Image/Gradient */}
      <div className="h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative">
        {iglesia.portada ? (
          <img 
            src={getBannerUrl(iglesia.portada)} 
            alt={iglesia.nombre}
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
        )}
        
        {/* Activity Indicator */}
        <div className="absolute top-2 right-2">
          <div className="flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-gray-700 dark:text-gray-300">Activo</span>
          </div>
        </div>
      </div>

      {/* Church Logo - Overlapping */}
      <div className="absolute top-20 left-4">
        <div className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 shadow-lg bg-white dark:bg-gray-700 overflow-hidden">
          {iglesia.logo ? (
            <img 
              src={getAvatarUrl(iglesia.logo)} 
              alt={iglesia.nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30">
              <span className="material-symbols-outlined text-3xl text-indigo-600 dark:text-indigo-400">
                church
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="pt-12 p-6">
        {/* Church Name */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate">
          {iglesia.nombre}
        </h3>

        {/* Denomination */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {iglesia.denominacion}
        </p>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">
            {iglesia.ubicacion?.ciudad}, {iglesia.ubicacion?.pais}
          </span>
        </div>

        {/* Member Avatars */}
        {memberCount > 0 && (
          <div className="flex items-center gap-3 mb-4">
            <div className="flex -space-x-2">
              {memberPreviews.map((member, index) => (
                <div 
                  key={member._id || index}
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700"
                >
                  <img 
                    src={getUserAvatar(member)} 
                    alt="Member"
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = '/avatars/default-avatar.png'}
                  />
                </div>
              ))}
              {memberCount > 4 && (
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    +{memberCount - 4}
                  </span>
                </div>
              )}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {memberCount} {memberCount === 1 ? 'miembro' : 'miembros'}
            </span>
          </div>
        )}

        {/* Next Event Preview */}
        {iglesia.reuniones && iglesia.reuniones.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              Próximo: {iglesia.reuniones[0].nombre} - {iglesia.reuniones[0].dia}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          {isPastor && (
            <>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 flex-1 justify-center">
                <Award size={14} className="mr-1" />
                Tu Iglesia (Pastor)
              </span>
              <button
                onClick={() => navigate(`/Mi_iglesia/${iglesia._id}`)}
                className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Ingresar
              </button>
            </>
          )}

          {isMember && (
            <>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 flex-1 justify-center">
                <Check size={14} className="mr-1" />
                Miembro
              </span>
              <button
                onClick={() => navigate(`/Mi_iglesia/${iglesia._id}`)}
                className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Ingresar
              </button>
            </>
          )}

          {hasPending && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 w-full justify-center">
              <Briefcase size={14} className="mr-1" />
              Solicitud Pendiente
            </span>
          )}

          {!isPastor && !isMember && !hasPending && (
            <>
              <button
                onClick={handleJoinClick}
                disabled={isJoining}
                className="flex-1 px-4 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isJoining ? 'Enviando...' : 'Unirme'}
              </button>
              <button
                onClick={() => navigate(`/Mi_iglesia/${iglesia._id}`)}
                className="flex-1 px-4 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-700 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                Ver Detalle
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChurchCard;



