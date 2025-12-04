import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, Bookmark, MoreVertical, MapPin, Users, Calendar, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { useToast } from '../../../shared/components/Toast/ToastProvider';
import { getAvatarUrl, getBannerUrl } from '../../../shared/utils/avatarUtils';

const IglesiaHeader = ({ iglesia, user, onJoin }) => {
  const navigate = useNavigate();
  const toast = useToast();

  console.log('🖼️ IglesiaHeader render - Data:', {
    id: iglesia?._id,
    logo: iglesia?.logo,
    portada: iglesia?.portada
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Enlace copiado al portapapeles');
  };

  const stats = [
    { icon: Users, label: 'Miembros', value: iglesia.miembros?.length || 0 },
    { icon: Calendar, label: 'Eventos', value: iglesia.reuniones?.length || 0 },
    { icon: ImageIcon, label: 'Multimedia', value: iglesia.multimedia?.length || 0 },
  ];

  return (
    <div className="relative bg-white dark:bg-gray-800 shadow-sm mb-6">
      {/* Cover Photo */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
        {iglesia.portada ? (
          <img 
            src={getBannerUrl(iglesia.portada)} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-90"
          />
        ) : (
          <div className="absolute inset-0 opacity-20">
             <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid-header" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid-header)" />
            </svg>
          </div>
        )}

        {/* Top Actions - Only Share button */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={handleShare}
            className="p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-colors"
            title="Compartir"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Info Bar */}
      <div className="px-4 md:px-8 pb-6">
        <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-4 gap-6">
          {/* Logo */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl border-4 border-white dark:border-gray-800 shadow-lg bg-white dark:bg-gray-700 overflow-hidden flex-shrink-0 z-10">
            {iglesia.logo ? (
              <img src={getAvatarUrl(iglesia.logo)} alt={iglesia.nombre} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30">
                <span className="material-symbols-outlined text-4xl text-indigo-600 dark:text-indigo-400">
                  church
                </span>
              </div>
            )}
          </div>

          {/* Text Info */}
          <div className="flex-1 pt-2 md:pt-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {iglesia.nombre}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin size={16} />
                {iglesia.ubicacion?.ciudad}, {iglesia.ubicacion?.pais}
              </span>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full text-xs font-medium">
                {iglesia.denominacion}
              </span>
            </div>
          </div>

          {/* Stats & Actions */}
          <div className="flex flex-col items-end gap-4 w-full md:w-auto">
             <div className="flex gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-900 dark:text-white font-bold text-lg">
                    <stat.icon size={18} className="text-gray-400" />
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IglesiaHeader;
