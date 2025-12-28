import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Heart, Plus, Info } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import userService from '../../../api/userService';
import ChurchCard from '../components/ChurchCard';
import HeroSection from '../components/HeroSection';
import FilterBar from '../components/FilterBar';
import Skeleton from '../../../shared/components/Skeleton/Skeleton';
import EmptyState from '../../../shared/components/EmptyState/EmptyState';
import { AlertDialog } from '../../../shared/components/AlertDialog';
import CreateIglesiaForm from '../components/CreateIglesiaForm';
import SolicitudesList from '../components/SolicitudesList';
import FounderMonitoringPanel from '../components/FounderMonitoringPanel';
import { useIglesias } from '../hooks/useIglesias';
import { useFundacion } from '../hooks/useFundacion';
import '../../../shared/styles/headers.style.css';

export default function IglesiaPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('iglesias');

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

  // Hook de Fundación
  const {
    loading,
    solicitudesPendientes,
    formData,
    setFormData,
    getAreasDisponibles,
    getSubAreasDisponibles,
    getProgramasDisponibles,
    getCargosDisponibles,
    getRolesDisponibles,
    getNivelesDisponibles,
    esDirectorGeneral,
    getPaisesDisponibles,
    getDivisionesTerritoriales,
    getNombreDivisionTerritorial,
    handleNivelChange,
    handleAreaChange,
    handleSubAreaChange,
    handleUpdateProfile,
    handleGestionarSolicitud
  } = useFundacion(user, updateUser);

  // Cargar iglesias al montar
  useEffect(() => {
    cargarIglesias();
  }, []);

  // Wrapper para crear iglesia con actualización de usuario
  const handleCrearIglesiaWrapper = async (e) => {
    const refreshUser = async () => {
      const userRes = await userService.getUserById(user._id);
      updateUser(userRes.data);
    };
    await handleCrearIglesia(e, refreshUser);
  };

  const renderIglesiasTab = () => (
    <div className="space-y-6">
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
        stats={stats}
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
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
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
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
          {filteredIglesias.map((iglesia) => (
            <ChurchCard
              key={iglesia._id}
              iglesia={iglesia}
              user={user}
              onJoin={handleUnirseIglesia}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderMonitoreoTab = () => (
    <div className="space-y-6">
      <FounderMonitoringPanel />
    </div>
  );

  const renderFundacionTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
            <Heart className="text-yellow-600 dark:text-yellow-400" size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Fundación Sol y Luna</h3>
            <p className="text-gray-600 dark:text-gray-400">Gestiona tu participación y perfil institucional</p>
          </div>
        </div>

        {/* Estado Actual */}
        {user?.esMiembroFundacion && (
          <div className={`p-4 rounded-lg mb-6 ${user.fundacion.estadoAprobacion === 'aprobado' ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
            user.fundacion.estadoAprobacion === 'rechazado' ? 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200' :
              'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
            }`}>
            <p className="font-semibold">
              Estado: {user.fundacion.estadoAprobacion.toUpperCase()}
            </p>
            {user.fundacion.estadoAprobacion === 'pendiente' && (
              <p className="text-sm mt-1">Tu solicitud está siendo revisada por un superior jerárquico.</p>
            )}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleUpdateProfile} className="space-y-8">

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">Definición de Perfil Institucional</h4>
            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li>• ¿En qué nivel actúa? → <strong>Nivel</strong></li>
              <li>• ¿En qué área trabaja? → <strong>Área</strong></li>
              <li>• ¿Qué responsabilidad tiene? → <strong>Cargo</strong></li>
              <li>• ¿Qué función operativa cumple? → <strong>Rol</strong></li>
              <li>• ¿En qué unidad específica trabaja? → <strong>Unidad / Programa</strong></li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* 1. NIVEL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ¿En qué nivel actúa? <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.nivel}
                onChange={(e) => handleNivelChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Seleccionar Nivel Jerárquico</option>
                {getNivelesDisponibles().map(nivel => (
                  <option key={nivel} value={nivel}>{nivel.replace(/_/g, ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* 2. CARGO (AHORA ANTES DE ÁREA) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ¿Qué responsabilidad tiene? (Cargo) <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
                disabled={!formData.nivel}
              >
                <option value="">{!formData.nivel ? 'Primero selecciona un nivel' : 'Seleccionar Cargo'}</option>
                {getCargosDisponibles().map(cargo => (
                  <option key={cargo} value={cargo}>{cargo}</option>
                ))}
              </select>
            </div>

            {/* 3. LÓGICA CONDICIONAL: DIRECTOR GENERAL vs DIRECTOR DE ÁREA */}

            {!esDirectorGeneral() ? (
              // ========== DIRECTORES DE ÁREA (Profesionales) ==========
              <>
                {/* ÁREA */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ¿En qué área trabaja? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.area}
                    onChange={(e) => handleAreaChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                    disabled={!formData.cargo}
                  >
                    <option value="">{!formData.cargo ? 'Primero selecciona un cargo' : 'Seleccionar Área Principal'}</option>
                    {getAreasDisponibles().map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                {/* SUBÁREA (solo si existen) */}
                {getSubAreasDisponibles().length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sub-Área / Dirección Específica
                    </label>
                    <select
                      value={formData.subArea}
                      onChange={(e) => handleSubAreaChange(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Seleccionar Sub-Área (Opcional)</option>
                      {getSubAreasDisponibles().map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* PROGRAMA (solo si existen) */}
                {getProgramasDisponibles().length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ¿En qué unidad trabaja? (Programa)
                    </label>
                    <select
                      value={formData.programa}
                      onChange={(e) => setFormData({ ...formData, programa: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Seleccionar Programa (Opcional)</option>
                      {getProgramasDisponibles().map(prog => (
                        <option key={prog} value={prog}>{prog}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            ) : (
              // ========== DIRECTORES GENERALES (Pastores con Territorio) ==========
              <div className="md:col-span-2 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Director General:</strong> Gobierna un territorio geográfico completo (no un área funcional específica). Solo pastores pueden ocupar este cargo.
                </p>
              </div>
            )}

            {/* TERRITORIO (Para Directores Generales Nacional O para TODOS en niveles Regional/Departamental/Municipal) */}
            {((esDirectorGeneral() && formData.nivel === 'nacional') || formData.nivel === 'regional' || formData.nivel === 'departamental' || formData.nivel === 'municipal') && (
              <>
                {/* PAÍS (SELECT) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    País <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.pais}
                    onChange={(e) => setFormData({ ...formData, pais: e.target.value, region: '', departamento: '', municipio: '' })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Seleccionar País</option>
                    {getPaisesDisponibles().map(pais => (
                      <option key={pais} value={pais}>{pais}</option>
                    ))}
                  </select>
                </div>

                {/* PROVINCIA/DEPARTAMENTO (SELECT DINÁMICO - Solo para Regional/Departamental/Municipal) */}
                {formData.pais && formData.nivel !== 'nacional' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {getNombreDivisionTerritorial()} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.region || formData.departamento || formData.municipio}
                      onChange={(e) => {
                        if (formData.nivel === 'regional') {
                          setFormData({ ...formData, region: e.target.value, departamento: '', municipio: '' });
                        } else if (formData.nivel === 'departamental') {
                          setFormData({ ...formData, departamento: e.target.value, municipio: '', region: '' });
                        } else {
                          setFormData({ ...formData, municipio: e.target.value, departamento: '', region: '' });
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                      required
                    >
                      <option value="">Seleccionar {getNombreDivisionTerritorial()}</option>
                      {getDivisionesTerritoriales().map(div => (
                        <option key={div} value={div}>{div}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}



            {/* 4. ROL FUNCIONAL (Solo para NO Directores Generales) */}
            {!esDirectorGeneral() && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ¿Qué función operativa cumple? (Rol) <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.rolFuncional}
                  onChange={(e) => setFormData({ ...formData, rolFuncional: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Seleccionar Rol Funcional</option>
                  {getRolesDisponibles().map(rol => (
                    <option key={rol} value={rol}>{rol.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            )}

            {/* ESPACIO VACÍO PARA MANTENER GRID */}
            {esDirectorGeneral() && <div></div>}


            {/* SECCIÓN TERRITORIAL (Solo para Directores de Área) */}
            {!esDirectorGeneral() && (
              <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <h5 className="font-medium text-gray-900 dark:text-white">Jurisdicción Territorial (Opcional)</h5>
                  <div className="group relative">
                    <Info size={18} className="text-gray-400 hover:text-indigo-600 cursor-help" />
                    <div className="absolute left-0 top-6 w-80 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <p className="font-semibold mb-1">¿Para qué sirve esta sección?</p>
                      <p className="text-gray-300">
                        {formData.cargo && formData.area && formData.nivel ? (
                          <>
                            Como <strong>{formData.cargo}</strong> de <strong>{formData.area}</strong> a nivel <strong>{formData.nivel}</strong>
                            {formData.region && ` de ${formData.region}`}
                            {formData.departamento && ` de ${formData.departamento}`}
                            {formData.municipio && ` de ${formData.municipio}`}
                            {formData.pais && ` (${formData.pais})`},
                            tu jurisdicción cubre todo ese territorio. Esta sección es solo para indicar dónde está ubicada tu oficina física dentro de tu jurisdicción.
                            <br /><br />
                            <em>Ejemplo: "Soy {formData.cargo} de {formData.area} de TODO {formData.region || formData.departamento || formData.municipio || 'el territorio'}, pero mi oficina está en la ciudad de {formData.departamento || 'X'}"</em>
                          </>
                        ) : (
                          <>
                            Indica la ubicación física de tu oficina, NO tu jurisdicción de autoridad.
                            <br /><br />
                            <em>Ejemplo: "Soy Director Regional de Salud de TODA la provincia de Buenos Aires, pero mi oficina física está en la ciudad de La Plata"</em>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">País</label>
                    <input
                      type="text"
                      value={formData.pais}
                      onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      placeholder="Colombia"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Región</label>
                    <input
                      type="text"
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      placeholder="Ej: Andina"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Departamento/Provincia</label>
                    <input
                      type="text"
                      value={formData.departamento}
                      onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      placeholder="Departamento"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Municipio/Ciudad</label>
                    <input
                      type="text"
                      value={formData.municipio}
                      onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      placeholder="Municipio"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Barrio/Localidad</label>
                    <input
                      type="text"
                      value={formData.barrio}
                      onChange={(e) => setFormData({ ...formData, barrio: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      placeholder="Barrio"
                    />
                  </div>

                </div>
              </div>
            )}

          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : user?.esMiembroFundacion ? 'Actualizar Datos' : 'Unirme a la Fundación'}
            </button>
          </div>
        </form>
      </div>

      {/* Panel de Aprobaciones */}
      {user?.fundacion?.estadoAprobacion === 'aprobado' && (
        <SolicitudesList
          solicitudes={solicitudesPendientes}
          onGestionarSolicitud={handleGestionarSolicitud}
        />
      )}
    </div>
  );

  return (
    <div className="page-container">
      {/* Header unificado con clases BEM globales */}
      <div className="section-header">
        <div className="section-header__icon-box">
          <Building2 className="section-header__icon" strokeWidth={2} />
        </div>
        <div className="section-header__content">
          <h1 className="section-header__title section-header__title--heavy">
            Instituciones
          </h1>
          <p className="section-header__subtitle">
            Conecta con comunidades de fe en tu región
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-8">
        <button
          onClick={() => setActiveTab('iglesias')}
          className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === 'iglesias'
            ? 'text-indigo-600 dark:text-indigo-400'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
        >
          <div className="flex items-center gap-2">
            <Building2 size={18} />
            Iglesias
          </div>
          {activeTab === 'iglesias' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('fundacion')}
          className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === 'fundacion'
            ? 'text-indigo-600 dark:text-indigo-400'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
        >
          <div className="flex items-center gap-2">
            <Heart size={18} />
            Fundación
          </div>
          {activeTab === 'fundacion' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400" />
          )}
        </button>

        {/* Pestaña de Monitoreo Global - Solo Founder */}
        {user?.seguridad?.rolSistema === 'Founder' && (
          <button
            onClick={() => setActiveTab('monitoreo')}
            className={`pb-4 px-2 text-sm font-medium transition-colors relative ${activeTab === 'monitoreo'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
          >
            <div className="flex items-center gap-2">
              📊 Monitoreo Global
            </div>
            {activeTab === 'monitoreo' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400" />
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'iglesias' ? renderIglesiasTab() :
          activeTab === 'fundacion' ? renderFundacionTab() :
            renderMonitoreoTab()}
      </div>

      {/* AlertDialog Component */}
      <AlertDialog
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        variant={alertConfig.variant}
        message={alertConfig.message}
      />
    </div>
  );
}
