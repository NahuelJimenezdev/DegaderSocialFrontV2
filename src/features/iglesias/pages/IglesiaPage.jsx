import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import userService from '../../../api/userService';
import iglesiaService from '../../../api/iglesiaService';
import ChurchCard from '../components/ChurchCard';
import HeroSection from '../components/HeroSection';
import FilterBar from '../components/FilterBar';
import Skeleton from '../../../shared/components/Skeleton/Skeleton';
import EmptyState from '../../../shared/components/EmptyState/EmptyState';
import { AlertDialog } from '../../../shared/components/AlertDialog';
import CreateIglesiaForm from '../components/CreateIglesiaForm';
import FounderMonitoringPanel from '../components/FounderMonitoringPanel';
import { useIglesias } from '../hooks/useIglesias';
import IglesiaDetail from './IglesiaDetail';
import '../../../shared/styles/headers.style.css';

export default function IglesiaPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  // Hook de Iglesias
  const {
    busquedaIglesia,
    loadingIglesias,
    filters,
    sort,
    viewMode,
    mostrarFormIglesia,
    formIglesia,
    alertConfig,
    filteredIglesias,
    stats,
    setBusquedaIglesia,
    setFilters,
    setSort,
    setViewMode,
    setMostrarFormIglesia,
    setFormIglesia,
    setAlertConfig,
    cargarIglesias,
    handleCrearIglesia,
    handleUnirseIglesia
  } = useIglesias(user);

  const [globalStats, setGlobalStats] = useState({ churches: 0, members: 0, events: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // OPTIMIZACIÓN CRÍTICA: Si es miembro, NO cargar la lista de iglesias
  // Solo cargar stats si no es miembro (para el buscador)
  useEffect(() => {
    if (!user?.esMiembroIglesia) {
      // Solo carga si NO es miembro
      cargarIglesias();
      const loadGlobalStats = async () => {
        try {
          const response = await iglesiaService.getGlobalStats();
          if (response.data) {
            setGlobalStats(response.data);
          }
        } catch (error) {
          console.error('Error loading global stats:', error);
        }
      };
      loadGlobalStats();
    }
  }, [user?.esMiembroIglesia]);

  // Detectar si es mobile o desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Wrapper para crear iglesia con actualización de usuario
  const handleCrearIglesiaWrapper = async (e) => {
    const refreshUser = async () => {
      const userRes = await userService.getUserById(user._id);
      updateUser(userRes.data);
    };
    await handleCrearIglesia(e, refreshUser);
  };

  // Si es miembro, redirigir INMEDIATAMENTE a su iglesia con navigate()
  useEffect(() => {
    if (user?.esMiembroIglesia && user?.eclesiastico?.iglesia) {
      navigate(`/Mi_iglesia/${user.eclesiastico.iglesia}`, { replace: true });
    }
  }, [user?.esMiembroIglesia, user?.eclesiastico?.iglesia, navigate]);

  // Si es Founder, mostrar página con panel de monitoreo
  const isFounder = user?.seguridad?.rolSistema === 'Founder';

  return (
    <div className="page-container">
      <div className="mb-mobile-30">
        {/* Header */}
        <div className="section-header">
          <div className="section-header__icon-box">
            <Building2 className="section-header__icon" strokeWidth={2} />
          </div>
          <div className="section-header__content">
            <h1 className="section-header__title section-header__title--heavy">
              Iglesias
            </h1>
            <p className="section-header__subtitle">
              Conecta con comunidades de fe en tu región
            </p>
          </div>
        </div>

        {/* Tabs para Founder (Solo Monitoreo) */}
        {isFounder && (
          <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-8">
            <button
              className="pb-4 px-2 text-sm font-medium transition-colors relative text-indigo-600 dark:text-indigo-400"
            >
              <div className="flex items-center gap-2">
                <Building2 size={18} />
                Iglesias
              </div>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400" />
            </button>

            <button
              onClick={() => navigate('/fundacion')}
              className="pb-4 px-2 text-sm font-medium transition-colors relative text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              <div className="flex items-center gap-2">
                📊 Monitoreo Global
              </div>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="space-y-6">
          {/* Toolbar */}
          {isMobile ? (
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                ¡Busca tu Iglesia, <br /> o crea una!
              </h3>
              <button
                onClick={() => setMostrarFormIglesia(!mostrarFormIglesia)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700"
              >
                <Plus size={18} />
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Building2 className="text-indigo-600" />
                Encuentra tu Iglesia
              </h3>
              <button
                onClick={() => setMostrarFormIglesia(!mostrarFormIglesia)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700"
              >
                <Plus size={18} />
                Registrar mi Iglesia
              </button>
            </div>
          )}

          <CreateIglesiaForm
            mostrarForm={mostrarFormIglesia}
            setMostrarForm={setMostrarFormIglesia}
            formIglesia={formIglesia}
            setFormIglesia={setFormIglesia}
            onSubmit={handleCrearIglesiaWrapper}
          />

          <HeroSection
            searchQuery={busquedaIglesia}
            onSearchChange={(val) => {
              setBusquedaIglesia(val);
              cargarIglesias();
            }}
            stats={globalStats}
          />

          <FilterBar
            filters={filters}
            onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
            sort={sort}
            onSortChange={setSort}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {loadingIglesias ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
              <Skeleton variant="card" count={4} />
            </div>
          ) : filteredIglesias.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No se encontraron iglesias"
              description={busquedaIglesia || filters.denominacion || filters.ubicacion ? "Intenta ajustar tus filtros de búsqueda" : "Sé el primero en crear una iglesia en tu comunidad"}
              action={!busquedaIglesia && !filters.denominacion && !filters.ubicacion ? () => setMostrarFormIglesia(true) : null}
              actionLabel="Crear Iglesia"
            />
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredIglesias.map((iglesia) => (
                <ChurchCard
                  key={iglesia._id}
                  iglesia={iglesia}
                  user={user}
                  onJoin={handleUnirseIglesia}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}

          {/* Panel de Monitoreo - Solo Founder */}
          {isFounder && (
            <FounderMonitoringPanel />
          )}
        </div>

        {/* AlertDialog */}
        <AlertDialog
          isOpen={alertConfig.isOpen}
          onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
          variant={alertConfig.variant}
          message={alertConfig.message}
        />
      </div>
    </div>
  );
}
