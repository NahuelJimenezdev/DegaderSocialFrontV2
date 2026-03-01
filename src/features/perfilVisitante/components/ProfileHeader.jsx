import { MessageSquare, Flag } from 'lucide-react';
import { useState } from 'react';
import AmistadButton from '../../amistades/components/AmistadButton';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';
import ReportModal from '../../../shared/components/Report/ReportModal';
import ProgressiveImage from '../../../shared/components/ProgressiveImage';

const ProfileHeader = ({ usuario, estadoAmistad, onAccionAmistad }) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const fotoPerfil = getUserAvatar(usuario);
  const bannerUrl = usuario?.social?.fotoBanner || '/avatars/default-banner.svg';

  return (
    <div className="relative">
      {/* Banner */}
      <div className="h-48 relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600">
        <ProgressiveImage
          src={bannerUrl}
          medium={usuario?.social?.portadaObj?.medium}
          large={usuario?.social?.portadaObj?.large}
          blurHash={usuario?.social?.portadaObj?.blurHash}
          alt="Banner de perfil"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Avatar y Info */}
      <div className="px-4 pb-6 sm:px-6">
        <div className="flex flex-wrap items-end justify-between -mt-12 sm:-mt-16 gap-y-4">
          {/* Bloque Izquierdo: Avatar y Nombre */}
          <div className="flex items-end gap-3 sm:gap-4 flex-1 min-w-[200px]">
            <ProgressiveImage
              src={fotoPerfil}
              medium={usuario?.social?.fotoPerfilObj?.medium}
              large={usuario?.social?.fotoPerfilObj?.large}
              blurHash={usuario?.social?.fotoPerfilObj?.blurHash}
              alt={`${usuario?.nombres?.primero} ${usuario?.apellidos?.primero}`}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-slate-800 object-cover shadow-lg block relative z-10"
            />
            <div className="pb-1 sm:pb-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {usuario?.nombres?.primero} {usuario?.apellidos?.primero}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 capitalize">
                {usuario?.seguridad?.rolSistema || 'usuario'} · {usuario?.personal?.ubicacion?.ciudad || 'Sin ubicación'}
              </p>
            </div>
          </div>

          {/* Bloque Derecho (o Inferior en Mobile): Acciones */}
          <div className="flex items-center gap-2 pb-1 sm:pb-2 ml-auto">
            <AmistadButton estado={estadoAmistad} onAccion={onAccionAmistad} />
            <button
              className="p-2 sm:p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all active:scale-95 border border-gray-200 dark:border-gray-700 shadow-sm"
              onClick={() => onAccionAmistad('mensaje')}
              title="Enviar mensaje"
            >
              <MessageSquare size={20} className="text-gray-700 dark:text-gray-300" />
            </button>
            {usuario?.seguridad?.rolSistema !== 'Founder' && (
              <button
                className="p-2 sm:p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all active:scale-95 border border-gray-200 dark:border-gray-700 shadow-sm"
                onClick={() => setIsReportModalOpen(true)}
                title="Reportar perfil"
              >
                <Flag size={20} className="text-red-500" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal de reporte */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        contentType="profile"
        contentId={usuario?._id}
        onReportSuccess={() => {
          setIsReportModalOpen(false);
          // Opcional: mostrar toast de éxito
        }}
      />
    </div>
  );
};

export default ProfileHeader;

