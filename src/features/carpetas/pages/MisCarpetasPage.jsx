import { useNavigate } from 'react-router-dom';
import { useCarpetas } from '../hooks/useCarpetas';
import CarpetasHeader from '../components/CarpetasHeader';
import CarpetasGrid from '../components/CarpetasGrid';
import CarpetasList from '../components/CarpetasList';
import ModalCrearCarpeta from '../components/ModalCrearCarpeta';
import ModalCompartirCarpeta from '../components/ModalCompartirCarpeta';
import { Filter, Search, Grid, List, X } from 'lucide-react';

const MisCarpetasPage = () => {
  const navigate = useNavigate();

  const {
    loading,
    carpetasFiltradas,
    busqueda,
    setBusqueda,
    vistaActual,
    setVistaActual,
    filtros,
    actualizarFiltro,
    jerarquia,
    
    // Modales
    modalAbierto,
    setModalAbierto,
    modalCompartirAbierto,
    setModalCompartirAbierto,
    carpetaSeleccionada,
    
    // Handlers
    handleCrearCarpeta,
    handleEliminarCarpeta,
    handleCompartirMasivo, // No usado aquí directamente, pero disponible
    handleCompartirCarpeta,
    handleEditarCarpeta,
    abrirModalCrear,
    abrirModalEditar,
    abrirModalCompartir,
    menuAbierto,
    setMenuAbierto,
    carpetaEditar,
  } = useCarpetas();

  const abrirCarpeta = (id) => {
    navigate(`/Mis_carpetas/${id}`);
  };

  const formatearTamaño = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <CarpetasHeader
            onCrearCarpeta={abrirModalCrear}
            totalCarpetas={carpetasFiltradas.length}
          />

          {/* Toolbar Avanzada */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mt-6 space-y-4">
            {/* Fila 1: Búsqueda y Vistas */}
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar carpetas..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={() => setVistaActual('grid')}
                  className={`p-2 rounded-md transition-colors ${vistaActual === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setVistaActual('list')}
                  className={`p-2 rounded-md transition-colors ${vistaActual === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            {/* Fila 2: Filtros Avanzados */}
            <div className="flex flex-wrap gap-3 items-center pt-2 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mr-2">
                <Filter size={16} />
                Filtros:
              </div>
              
              <select
                value={filtros.tipo}
                onChange={(e) => actualizarFiltro('tipo', e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Todos los tipos</option>
                <option value="personal">Personal</option>
                <option value="grupal">Grupal</option>
                <option value="institucional">Institucional</option>
              </select>

              <select
                value={filtros.area}
                onChange={(e) => actualizarFiltro('area', e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Todas las Áreas</option>
                {jerarquia.areas?.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>

              <select
                value={filtros.cargo}
                onChange={(e) => actualizarFiltro('cargo', e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Todos los Cargos</option>
                {jerarquia.cargos?.map(cargo => (
                  <option key={cargo} value={cargo}>{cargo}</option>
                ))}
              </select>

              <label className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={filtros.compartidas}
                  onChange={(e) => actualizarFiltro('compartidas', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Compartidas conmigo</span>
              </label>

              {/* Botón Borrar Filtros */}
              {(filtros.tipo || filtros.area || filtros.cargo || filtros.compartidas || busqueda) && (
                <button
                  onClick={() => {
                    actualizarFiltro('tipo', '');
                    actualizarFiltro('area', '');
                    actualizarFiltro('cargo', '');
                    actualizarFiltro('compartidas', false);
                    setBusqueda('');
                  }}
                  className="flex items-center gap-2 px-4 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
                >
                  <X size={16} />
                  Borrar filtros
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Cargando carpetas...</p>
            </div>
          </div>
        ) : carpetasFiltradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center">
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                No se encontraron carpetas
              </p>
              <p className="text-gray-500 dark:text-gray-500">
                {busqueda || Object.values(filtros).some(v => v) ? 'Intenta ajustar los filtros' : 'Crea tu primera carpeta para comenzar'}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Vista Grid */}
            {vistaActual === 'grid' && (
              <CarpetasGrid
                carpetas={carpetasFiltradas}
                onAbrirCarpeta={abrirCarpeta}
                onEditarCarpeta={abrirModalEditar}
                onEliminarCarpeta={handleEliminarCarpeta}
                onCompartirCarpeta={abrirModalCompartir}
                formatearTamaño={formatearTamaño}
                formatearFecha={formatearFecha}
                menuAbierto={menuAbierto}
                setMenuAbierto={setMenuAbierto}
              />
            )}

            {/* Vista Lista */}
            {vistaActual === 'list' && (
              <CarpetasList
                carpetas={carpetasFiltradas}
                onAbrirCarpeta={abrirCarpeta}
                onEditarCarpeta={abrirModalEditar}
                onEliminarCarpeta={handleEliminarCarpeta}
                onCompartirCarpeta={abrirModalCompartir}
                formatearTamaño={formatearTamaño}
                formatearFecha={formatearFecha}
                menuAbierto={menuAbierto}
                setMenuAbierto={setMenuAbierto}
              />
            )}
          </>
        )}
      </div>

      {/* Modales */}
      <ModalCrearCarpeta
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSubmit={carpetaEditar ? handleEditarCarpeta : handleCrearCarpeta}
        jerarquia={jerarquia}
        carpeta={carpetaEditar}
        isEditing={!!carpetaEditar}
      />

      <ModalCompartirCarpeta
        isOpen={modalCompartirAbierto}
        onClose={() => setModalCompartirAbierto(false)}
        onCompartir={handleCompartirCarpeta}
        carpeta={carpetaSeleccionada}
      />
    </div>
  );
};

export default MisCarpetasPage;
