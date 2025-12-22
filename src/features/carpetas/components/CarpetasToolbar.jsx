import { Search, Grid, List, User, Users, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import '../styles/CarpetasToolbar.css';

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
    <div className="carpetas-toolbar">
      {/* Buscador */}
      <div className="carpetas-toolbar-search relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar carpetas..."
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          className="w-full pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Filtros y Vista */}
      <div className="carpetas-toolbar-controls">
        {/* Filtros */}
        <div className="carpetas-toolbar-filters">
          <div className="carpetas-filter-pills">
            {/* Todas */}
            <button
              onClick={() => onTipoFiltroChange(null)}
              className={`carpetas-filter-pill ${
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
              className={`carpetas-filter-pill ${
                tipoFiltro === 'personal'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {isMobile ? (
                <User />
              ) : (
                <span>Personales</span>
              )}
            </button>

            {/* Grupales */}
            <button
              onClick={() => onTipoFiltroChange('grupal')}
              className={`carpetas-filter-pill ${
                tipoFiltro === 'grupal'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {isMobile ? (
                <Users />
              ) : (
                <span>Grupales</span>
              )}
            </button>

            {/* Institucionales */}
            <button
              onClick={() => onTipoFiltroChange('institucional')}
              className={`carpetas-filter-pill ${
                tipoFiltro === 'institucional'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {isMobile ? (
                <Building2 />
              ) : (
                <span>Institucionales</span>
              )}
            </button>
          </div>
        </div>

        {/* Vista - Siempre a la derecha */}
        <div className="carpetas-toolbar-views">
          <button
            onClick={() => onVistaChange('grid')}
            className={`carpetas-view-btn ${
              vistaActual === 'grid'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Grid />
          </button>
          <button
            onClick={() => onVistaChange('list')}
            className={`carpetas-view-btn ${
              vistaActual === 'list'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <List />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarpetasToolbar;


