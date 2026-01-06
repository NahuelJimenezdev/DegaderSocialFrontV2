import { Folder, MoreVertical, Edit, Trash2, Share2 } from 'lucide-react';
import '../styles/CarpetaCard.css';

const CarpetaCard = ({
  carpeta,
  onAbrir,
  onEditar,
  onEliminar,
  onCompartir,
  menuAbierto,
  onMenuToggle,
  formatearTamaño,
  formatearFecha
}) => {
  return (
    <div
      onClick={() => onAbrir(carpeta._id)}
      className="carpeta-card group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
    >
      <div className="carpeta-card-content">
        <div className="flex items-start justify-between mb-4">
          <div
            className="carpeta-card-icon rounded-lg"
            style={{ backgroundColor: carpeta.color + '20' }}
          >
            <Folder style={{ color: carpeta.color }} />
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMenuToggle(carpeta._id);
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <MoreVertical size={20} className="text-gray-500 dark:text-gray-400" />
            </button>

            {menuAbierto === carpeta._id && (
              <div className="carpeta-card-menu absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditar(carpeta);
                    onMenuToggle(null);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  <Edit size={16} />
                  <span>Editar</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCompartir(carpeta);
                    onMenuToggle(null);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                >
                  <Share2 size={16} />
                  <span>Compartir</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEliminar(carpeta._id);
                    onMenuToggle(null);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 text-left"
                >
                  <Trash2 size={16} />
                  <span>Eliminar</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <h3 className="carpeta-card-title font-semibold text-gray-900 dark:text-white mb-2 truncate">
          {carpeta.nombre}
        </h3>
        <p className="carpeta-card-desc text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {carpeta.descripcion}
        </p>

        <div className="carpeta-card-footer flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <span className={`carpeta-card-badge rounded-full font-medium ${carpeta.tipo === 'personal'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              : carpeta.tipo === 'grupal'
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                : 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400'
            }`}>
            {carpeta.tipo === 'personal' ? 'Personal' : carpeta.tipo === 'grupal' ? 'Grupal' : 'Institucional'}
          </span>

          {carpeta.visibilidadPorArea?.habilitado && (
            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full truncate max-w-[100px]">
              {carpeta.visibilidadPorArea.areas[0]}
            </span>
          )}
          <div className="carpeta-card-info flex items-center text-gray-500 dark:text-gray-400">
            <span>{carpeta.cantidadArchivos || 0} archivos</span>
            <span>{formatearTamaño(carpeta.tamaño)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarpetaCard;


