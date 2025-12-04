import { Folder, MoreVertical, Edit, Trash2, Share2 } from 'lucide-react';
import '../styles/CarpetasList.css';

const CarpetasList = ({
  carpetas,
  onAbrirCarpeta,
  onEditarCarpeta,
  onEliminarCarpeta,
  menuAbierto,
  setMenuAbierto,
  onCompartirCarpeta,
  formatearTamaño,
  formatearFecha
}) => {
  // Render del menú de acciones (compartido entre ambas vistas)
  const renderMenu = (carpeta) => (
    menuAbierto === carpeta._id && (
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEditarCarpeta(carpeta);
            setMenuAbierto(null);
          }}
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
        >
          <Edit size={16} />
          <span>Editar</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCompartirCarpeta(carpeta);
            setMenuAbierto(null);
          }}
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
        >
          <Share2 size={16} />
          <span>Compartir</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEliminarCarpeta(carpeta._id);
            setMenuAbierto(null);
          }}
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 text-left"
        >
          <Trash2 size={16} />
          <span>Eliminar</span>
        </button>
      </div>
    )
  );

  return (
    <div className="carpetas-list-container">
      {/* Vista Mobile - Cards compactas */}
      <div className="carpetas-list-mobile">
        {carpetas.map((carpeta) => (
          <div
            key={carpeta._id}
            onClick={() => onAbrirCarpeta(carpeta._id)}
            className="carpetas-list-mobile-item"
          >
            <div
              className="carpetas-list-mobile-icon"
              style={{ backgroundColor: carpeta.color + '20' }}
            >
              <Folder style={{ color: carpeta.color }} />
            </div>
            <div className="carpetas-list-mobile-content">
              <div className="carpetas-list-mobile-name text-gray-900 dark:text-white">
                {carpeta.nombre}
              </div>
              <div className="carpetas-list-mobile-meta">
                <span className={`carpetas-list-mobile-badge ${
                  carpeta.tipo === 'personal'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : carpeta.tipo === 'grupal'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                }`}>
                  {carpeta.tipo === 'personal' ? 'Personal' : carpeta.tipo === 'grupal' ? 'Grupal' : 'Inst.'}
                </span>
                <span className="carpetas-list-mobile-info">
                  {carpeta.cantidadArchivos || 0} archivos
                </span>
                <span className="carpetas-list-mobile-info">
                  {formatearTamaño(carpeta.tamaño)}
                </span>
              </div>
            </div>
            <div className="carpetas-list-mobile-menu relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuAbierto(menuAbierto === carpeta._id ? null : carpeta._id);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <MoreVertical size={18} className="text-gray-500 dark:text-gray-400" />
              </button>
              {renderMenu(carpeta)}
            </div>
          </div>
        ))}
      </div>

      {/* Vista Desktop - Tabla */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-thin">
        <table className="carpetas-list-table">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Archivos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tamaño
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actividad
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {carpetas.map((carpeta) => (
              <tr
                key={carpeta._id}
                onClick={() => onAbrirCarpeta(carpeta._id)}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="carpetas-list-table-icon rounded-lg flex-shrink-0"
                      style={{ backgroundColor: carpeta.color + '20' }}
                    >
                      <Folder style={{ color: carpeta.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="carpetas-list-table-name font-medium text-gray-900 dark:text-white truncate">
                        {carpeta.nombre}
                      </div>
                      <div className="carpetas-list-table-desc text-gray-500 dark:text-gray-400 truncate">
                        {carpeta.descripcion}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`carpetas-list-table-badge inline-block px-2 py-1 rounded-full font-medium whitespace-nowrap ${
                    carpeta.tipo === 'personal'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : carpeta.tipo === 'grupal'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                  }`}>
                    {carpeta.tipo === 'personal' ? 'Personal' : carpeta.tipo === 'grupal' ? 'Grupal' : 'Institucional'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {carpeta.cantidadArchivos || 0}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {formatearTamaño(carpeta.tamaño)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {formatearFecha(carpeta.ultimaActividad)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="relative inline-block">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuAbierto(menuAbierto === carpeta._id ? null : carpeta._id);
                      }}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <MoreVertical size={20} className="text-gray-500 dark:text-gray-400" />
                    </button>
                    {renderMenu(carpeta)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CarpetasList;
