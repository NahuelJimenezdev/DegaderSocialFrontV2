import React from 'react';
import { logger } from '../../../shared/utils/logger';
import { useNavigate } from 'react-router-dom';
import { churchColors } from '../utils/colors';
import { getAvatarUrl } from '../../../shared/utils/avatarUtils';

const IglesiaSidebar = ({ iglesiaData, activeSection, setActiveSection, menuItems, isMobile }) => {
  const navigate = useNavigate();

  logger.log('🖼️ IglesiaSidebar render - Data:', {
    id: iglesiaData?._id,
    logo: iglesiaData?.logo,
    nombre: iglesiaData?.nombre
  });

  // Contar solicitudes pendientes
  const pendingRequestsCount = iglesiaData?.solicitudes?.length || 0;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header del Sidebar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        {isMobile && (
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setActiveSection(activeSection)} // Trigger close via parent setActiveSection which sets sidebarOpen(false)
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Botón para volver al inicio - Restaurado por petición del usuario */}
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:colorMarcaDegader dark:text-gray-400 dark:hover:text-indigo-400 transition-colors p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Volver al Inicio"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center colorMarcaDegader dark:text-indigo-400 flex-shrink-0">
              {iglesiaData?.logo ? (
                <img src={getAvatarUrl(iglesiaData.logo)} alt="Logo" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="material-symbols-outlined text-xl">church</span>
              )}
            </div>


            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-gray-900 dark:text-white truncate text-sm">
                {iglesiaData?.nombre || 'Iglesia'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {iglesiaData?.ubicacion?.ciudad}, {iglesiaData?.ubicacion?.pais}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Menú de Navegación */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left relative
              ${activeSection === item.id
                ? `${churchColors.primaryBg} text-white shadow-lg`
                : 'text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-gray-700/50'
              }
            `}
          >
            <span className="material-symbols-outlined text-[20px]">
              {item.icon}
            </span>
            <span className="text-sm font-medium flex-1">{item.label}</span>

            {/* Badge para solicitudes pendientes en Miembros */}
            {item.id === 'members' && pendingRequestsCount > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full">
                {pendingRequestsCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Pie de Sidebar */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <p className={`text-sm italic ${churchColors.accent} leading-relaxed`}>
          "Porque donde están dos o tres congregados en mi nombre, allí estoy yo en medio de ellos."
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          - Mateo 18:20
        </p>
      </div>
    </div>
  );
};

export default IglesiaSidebar;



