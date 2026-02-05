import { MessageSquare, Flag } from 'lucide-react';
import { useState } from 'react';
import AmistadButton from '../../amistades/components/AmistadButton';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';
import ReportModal from '../../../shared/components/Report/ReportModal';

const ProfileHeader = ({ usuario, estadoAmistad, onAccionAmistad }) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const fotoPerfil = getUserAvatar(usuario);
  const bannerUrl = usuario?.social?.fotoBanner || '/avatars/default-banner.svg';

  return (
    <div className="relative">
      {/* Banner */}
      <div
        className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600"
        style={{ backgroundImage: `url(${bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      {/* Avatar y Info */}
      <div className="px-6 pb-6">
        <div className="flex items-end justify-between -mt-16">
          <div className="flex items-end gap-4">
            <img
              src={fotoPerfil}
              alt={`${usuario?.nombres?.primero} ${usuario?.apellidos?.primero}`}
              className="w-32 h-32 rounded-full border-4 border-white object-cover"
            />
            <div className="pb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {usuario?.nombres?.primero} {usuario?.apellidos?.primero}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {usuario?.seguridad?.rolSistema || 'usuario'} · {usuario?.personal?.ubicacion?.ciudad || 'Sin ubicación'}
              </p>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2 pb-2">
            <AmistadButton estado={estadoAmistad} onAccion={onAccionAmistad} />
            <button
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              onClick={() => onAccionAmistad('mensaje')}
              title="Enviar mensaje"
            >
              <MessageSquare size={20} />
            </button>
            {usuario?.seguridad?.rolSistema !== 'Founder' && (
              <button
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
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

