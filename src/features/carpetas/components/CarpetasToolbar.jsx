import { Search, Grid, List, User, Users, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const CarpetasToolbar = ({
  busqueda,
  onBusquedaChange,
  tipoFiltro,
  onTipoFiltroChange,
  vistaActual,
  onVistaChange
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="space-y-4">
      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar carpetas..."
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Filtros y Vista */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          {/* Filtros */}
          <div className="flex-1 overflow-x-auto scrollbar-thin pb-2">
            <div className="flex gap-2 min-w-max">
              {/* Todas */}
              <button
                onClick={() => onTipoFiltroChange(null)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  tipoFiltro === null
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span>Todas</span>
              </button>

              {/* Personales */}
              <button
                onClick={() => onTipoFiltroChange('personal')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  tipoFiltro === 'personal'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {isMobile ? (
                  <User size={16} />
                ) : (
                  <span>Personales</span>
                )}
              </button>

              {/* Grupales */}
              <button
                onClick={() => onTipoFiltroChange('grupal')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  tipoFiltro === 'grupal'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {isMobile ? (
                  <Users size={16} />
                ) : (
                  <span>Grupales</span>
                )}
              </button>

              {/* Institucionales */}
              <button
                onClick={() => onTipoFiltroChange('institucional')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  tipoFiltro === 'institucional'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {isMobile ? (
                  <Building2 size={16} />
                ) : (
                  <span>Institucionales</span>
                )}
              </button>
            </div>
          </div>

          {/* Vista - Siempre a la derecha */}
          <div className="flex gap-2 flex-shrink-0 ml-auto">
            <button
              onClick={() => onVistaChange('grid')}
              className={`p-2 rounded-lg transition-colors ${
                vistaActual === 'grid'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => onVistaChange('list')}
              className={`p-2 rounded-lg transition-colors ${
                vistaActual === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarpetasToolbar;
