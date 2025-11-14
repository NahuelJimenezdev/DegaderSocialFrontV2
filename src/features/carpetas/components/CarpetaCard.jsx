import { Folder, MoreVertical, Edit, Trash2, Share2 } from 'lucide-react';

const CarpetaCard = ({
  carpeta,
  onAbrir,
  onEditar,
  onEliminar,
  menuAbierto,
  onMenuToggle,
  formatearTamaño,
  formatearFecha
}) => {
  return (
    <div
      onClick={() => onAbrir(carpeta._id)}
      className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: carpeta.color + '20' }}
          >
            <Folder size={32} style={{ color: carpeta.color }} />
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
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
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
                    // TODO: Implementar compartir
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

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
          {carpeta.nombre}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {carpeta.descripcion}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            carpeta.tipo === 'personal'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              : carpeta.tipo === 'grupal'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
          }`}>
            {carpeta.tipo === 'personal' ? 'Personal' : carpeta.tipo === 'grupal' ? 'Grupal' : 'Institucional'}
          </span>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{carpeta.cantidadArchivos || 0} archivos</span>
            <span>{formatearTamaño(carpeta.tamaño)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarpetaCard;
