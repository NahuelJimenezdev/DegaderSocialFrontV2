import { useNavigate } from 'react-router-dom';
import { useCarpetas } from '../hooks/useCarpetas';
import CarpetasHeader from '../components/CarpetasHeader';
import CarpetasToolbar from '../components/CarpetasToolbar';
import CarpetasGrid from '../components/CarpetasGrid';
import CarpetasList from '../components/CarpetasList';
import ModalCarpeta from '../components/ModalCarpeta';

const MisCarpetasPage = () => {
  const navigate = useNavigate();

  const {
    loading,
    tipoFiltro,
    busqueda,
    vistaActual,
    modalAbierto,
    carpetaEditar,
    menuAbierto,
    carpetasFiltradas,
    setTipoFiltro,
    setBusqueda,
    setVistaActual,
    setModalAbierto,
    setMenuAbierto,
    handleCrearCarpeta,
    handleEditarCarpeta,
    handleEliminarCarpeta,
    abrirModalEditar,
    abrirModalCrear,
  } = useCarpetas();

  // Funciones auxiliares
  const formatearTamaño = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const abrirCarpeta = (id) => {
    navigate(`/carpeta/${id}`);
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

          {/* Toolbar */}
          <CarpetasToolbar
            busqueda={busqueda}
            onBusquedaChange={setBusqueda}
            tipoFiltro={tipoFiltro}
            onTipoFiltroChange={setTipoFiltro}
            vistaActual={vistaActual}
            onVistaChange={setVistaActual}
          />
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
                No hay carpetas
              </p>
              <p className="text-gray-500 dark:text-gray-500">
                {busqueda ? 'Intenta con otro término de búsqueda' : 'Crea tu primera carpeta para comenzar'}
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
                menuAbierto={menuAbierto}
                setMenuAbierto={setMenuAbierto}
                formatearTamaño={formatearTamaño}
                formatearFecha={formatearFecha}
              />
            )}

            {/* Vista Lista */}
            {vistaActual === 'list' && (
              <CarpetasList
                carpetas={carpetasFiltradas}
                onAbrirCarpeta={abrirCarpeta}
                onEditarCarpeta={abrirModalEditar}
                onEliminarCarpeta={handleEliminarCarpeta}
                menuAbierto={menuAbierto}
                setMenuAbierto={setMenuAbierto}
                formatearTamaño={formatearTamaño}
                formatearFecha={formatearFecha}
              />
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <ModalCarpeta
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
        }}
        onSubmit={carpetaEditar ? handleEditarCarpeta : handleCrearCarpeta}
        carpeta={carpetaEditar}
      />
    </div>
  );
};

export default MisCarpetasPage;
