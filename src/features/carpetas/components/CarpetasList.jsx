import { Folder, MoreVertical, Edit, Trash2, Share2 } from 'lucide-react';

const CarpetasList = ({
  carpetas,
  onAbrirCarpeta,
  onEditarCarpeta,
  onEliminarCarpeta,
  menuAbierto,
  setMenuAbierto,
  formatearTamaño,
  formatearFecha
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-thin">
      <table className="w-full min-w-max">
        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[280px]">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[130px]">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[100px]">
              Archivos
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[100px]">
              Tamaño
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[150px]">
              ultima actividad
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[100px]">
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
              <td className="px-6 py-4 w-[280px]">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: carpeta.color + '20' }}
                  >
                    <Folder size={24} style={{ color: carpeta.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 dark:text-white truncate">
                      {carpeta.nombre}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {carpeta.descripcion}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 w-[130px]">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  carpeta.tipo === 'personal'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : carpeta.tipo === 'grupal'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                }`}>
                  {carpeta.tipo === 'personal' ? 'Personal' : carpeta.tipo === 'grupal' ? 'Grupal' : 'Institucional'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 w-[100px]">
                {carpeta.cantidadArchivos || 0}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 w-[100px] whitespace-nowrap">
                {formatearTamaño(carpeta.tamaño)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 w-[150px] whitespace-nowrap">
                {formatearFecha(carpeta.ultimaActividad)}
              </td>
              <td className="px-6 py-4 text-right w-[100px]">
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

                  {menuAbierto === carpeta._id && (
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
                          // TODO: Implementar compartir
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
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CarpetasList;
