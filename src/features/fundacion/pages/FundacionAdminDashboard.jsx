import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  Download, 
  ChevronRight,
  UserCheck,
  LayoutGrid,
  List,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import fundacionService from '../../../api/fundacionService';
import { useToast } from '../../../shared/components/Toast/ToastProvider';
import { getUserAvatar, handleImageError } from '../../../shared/utils/avatarUtils';
import { getTerritorioString } from '../../../shared/utils/userUtils';
import { esCargoDirectivo } from '../../../shared/constants/fundacionConstants';

export default function FundacionAdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    nivel: '',
    cargo: '',
    pais: user?.fundacion?.nivel === 'nacional' ? user?.fundacion?.territorio?.pais : '',
    region: '',
    municipio: '',
    search: '',
    estado: ''
  });
  const [pagination, setPagination] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [availableCountries, setAvailableCountries] = useState([]);
  
  // Rango de permisos del usuario logueado
  const isPrivileged = user?.seguridad?.rolSistema === 'Founder' || user?.fundacion?.nivel === 'directivo_general';
  const isNational = user?.fundacion?.nivel === 'nacional';

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const data = await fundacionService.getUsersUnderJurisdiction(filters);
      setUsuarios(data.data.usuarios);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, [filters]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fundacionService.getPaisesJurisdiccion();
        if (res.success) {
          setAvailableCountries(res.data.paises);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  // Descargar base Excel
  const handleDescargarBase = async () => {
    setDownloading(true);
    try {
      const response = await fundacionService.descargarBase(filters);
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Base_Miembros_FHSYL_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(`Base descargada exitosamente (${pagination.total || 0} registros)`);
    } catch (error) {
      console.error(error);
      toast.error('Error al descargar la base de datos');
    } finally {
      setDownloading(false);
    }
  };

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const formatRoleLocation = (u) => {
    const parts = [];
    if (u.fundacion?.cargo) parts.push(u.fundacion.cargo);
    if (u.fundacion?.nivel) {
      const nivelStr = u.fundacion.nivel.charAt(0).toUpperCase() + u.fundacion.nivel.slice(1);
      parts.push(nivelStr);
    }
    
    // Determine the specific location 
    const isArgentine = u.fundacion?.territorio?.pais === 'Argentina';
    
    if (u.fundacion?.nivel === 'nacional') {
      if (u.fundacion?.territorio?.pais) parts.push(u.fundacion.territorio.pais);
    } else if (u.fundacion?.nivel === 'regional') {
      if (u.fundacion?.territorio?.pais) parts.push(u.fundacion.territorio.pais);
      if (u.fundacion?.territorio?.region) parts.push(u.fundacion.territorio.region);
    } else if (u.fundacion?.nivel === 'departamental') {
      if (u.fundacion?.territorio?.pais) parts.push(u.fundacion.territorio.pais);
      if (isArgentine && (u.fundacion?.territorio?.provincia || u.fundacion?.territorio?.departamento)) {
          parts.push(u.fundacion.territorio.provincia || u.fundacion.territorio.departamento);
      } else if (!isArgentine && u.fundacion?.territorio?.departamento) {
          parts.push(u.fundacion.territorio.departamento);
      }
    } else if (u.fundacion?.nivel === 'municipal' || u.fundacion?.nivel === 'local' || u.fundacion?.nivel === 'barrial') {
      if (u.fundacion?.territorio?.pais) parts.push(u.fundacion.territorio.pais);
      if (u.fundacion?.territorio?.municipio) {
        parts.push(u.fundacion.territorio.municipio);
      }
    }
    
    return parts.join(' - ');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-6 pb-24 sm:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <Users className="text-blue-600" size={32} />
            Panel de Control Fundación
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gestiona el personal bajo tu jurisdicción ({user?.fundacion?.nivel || 'N/A'}{user?.fundacion?.area ? ` - ${user.fundacion.area}` : ''})
          </p>
        </div>
        
        <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-6 w-full md:w-auto">
          <div className="text-left md:text-right">
            <div className="flex items-center md:justify-end gap-2 text-blue-600 dark:text-blue-500">
              <Users size={22} className="opacity-80" />
              <span className="text-2xl sm:text-3xl font-black leading-none tracking-tight">
                {loading ? '...' : (pagination.total || 0)}
              </span>
            </div>
            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">
              Miembros Registrados
            </p>
          </div>
          <button 
            onClick={handleDescargarBase}
            disabled={downloading}
            className={`flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-sm text-sm sm:text-base ${downloading ? 'opacity-60 cursor-wait' : ''}`}
          >
            {downloading ? (
              <Loader2 size={18} className="text-blue-600 animate-spin" />
            ) : (
              <Download size={18} className="text-blue-600" />
            )}
            <span className="inline-block">{downloading ? 'Descargando...' : 'Descargar Base'}</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-transparent border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm text-gray-800 dark:text-gray-200 font-bold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 group"
          >
            <Filter size={20} className={`${showFilters ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'} transition-colors`} />
            {showFilters ? 'Ocultar Filtros' : 'Filtros de Búsqueda'}
          </button>
          
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              title="Vista de Cuadrícula"
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              title="Vista de Lista"
            >
              <List size={18} />
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-2 duration-300">
            {(isPrivileged) && (
              <select 
                name="pais" 
                value={filters.pais} 
                onChange={handleFilterChange}
                className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white"
              >
                <option value="">País (Todos)</option>
                {availableCountries.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            )}
            
            <select 
              name="nivel" 
              value={filters.nivel} 
              onChange={handleFilterChange}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              <option value="">Nivel (Todos)</option>
              <option value="nacional">Nacional</option>
              <option value="regional">Regional</option>
              <option value="departamental">Departamental</option>
              <option value="municipal">Municipal</option>
              <option value="local">Local</option>
              <option value="barrial">Barrial</option>
            </select>
  
            <select 
              name="cargo" 
              value={filters.cargo} 
              onChange={handleFilterChange}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              <option value="">Cargo (Todos)</option>
              <optgroup label="Directivo General">
                <option value="Director Ejecutivo">Director Ejecutivo</option>
                <option value="Secretario Ejecutivo">Secretario Ejecutivo</option>
                <option value="Miembro de Junta Directiva">Miembro de Junta Directiva</option>
                <option value="Equipo de Licitación y Adquisiciones">Equipo de Licitación y Adquisiciones</option>
              </optgroup>
              <optgroup label="Órganos de Control">
                <option value="Dirección de Control Interno y Seguimiento">Dir. Control Interno y Seguimiento</option>
                <option value="Dirección Asuntos Ético">Dir. Asuntos Ético</option>
                <option value="Auditor">Auditor</option>
                <option value="Miembro Comité Ético">Miembro Comité Ético</option>
              </optgroup>
              <optgroup label="Organismos Internacionales">
                <option value="Delegado">Delegado</option>
                <option value="Director">Director</option>
                <option value="Secretario/a">Secretario/a</option>
              </optgroup>
              <optgroup label="Direcciones Territoriales">
                <option value="Director General">Director General</option>
                <option value="Subdirector General">Subdirector General</option>
                <option value="Secretario Director General">Secretario Director General</option>
                <option value="Secretario Subdirector General">Secretario Subdirector General</option>
                <option value="Director de Áreas">Director de Áreas</option>
                <option value="Secretario/a Director de Áreas">Secretario/a Director de Áreas</option>
                <option value="Subdirector de Áreas">Subdirector de Áreas</option>
                <option value="Secretario/a Subdirector de Áreas">Secretario/a Subdirector de Áreas</option>
              </optgroup>
              <optgroup label="Niveles Operativos">
                <option value="Director Nacional">Director Nacional</option>
                <option value="Director Regional">Director Regional</option>
                <option value="Director Departamental">Director Departamental</option>
                <option value="Coordinador Municipal">Coordinador Municipal</option>
                <option value="Coordinador">Coordinador</option>
                <option value="Director">Director</option>
                <option value="Subdirector">Subdirector</option>
                <option value="Secretario/a">Secretario/a</option>
              </optgroup>
              <optgroup label="Afiliados">
                <option value="Afiliado">Afiliado</option>
              </optgroup>
            </select>

            <select 
              name="estado" 
              value={filters.estado} 
              onChange={handleFilterChange}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              <option value="">Estado (Todos)</option>
              <option value="completado">Completados</option>
              <option value="pendiente">Pendientes</option>
            </select>
  
            <div className="md:col-span-1 lg:col-span-1 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Nombre o Apellido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Listado de Usuarios */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : usuarios.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6" 
            : "flex flex-col gap-4"
        }>
          {usuarios.map((u) => (
            <div 
              key={u._id}
              className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group ${
                viewMode === 'grid' 
                  ? "p-6 flex flex-col h-full" 
                  : "p-4 flex flex-row items-center gap-4"
              }`}
            >
              {viewMode === 'grid' ? (
                // --- GRID VIEW ---
                <>
                  <div className="flex items-center gap-4 mb-4">
                     <div className="relative flex-shrink-0">
                       <img 
                         src={getUserAvatar(u)} 
                         alt={`${u.nombres?.primero || ''} ${u.apellidos?.primero || ''}`}
                         className="w-16 h-16 rounded-full object-cover shadow-sm bg-gray-100 dark:bg-gray-700"
                         onError={handleImageError}
                       />
                       <div className="absolute -bottom-1 -right-1 p-1 bg-green-500 rounded-full text-white border-2 border-white dark:border-gray-800">
                         <UserCheck size={12} fill="currentColor" />
                       </div>
                     </div>
                     <div className="flex-1 min-w-0">
                       <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors leading-tight break-words uppercase">
                         {u.nombres?.primero} {u.apellidos?.primero}
                       </h4>
                       <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">{u.fundacion?.cargo || 'Sin Cargo'}</p>
                     </div>
                  </div>
                  
                  <div className="flex-1 bg-gray-50/50 dark:bg-gray-900/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 mb-4 text-xs space-y-2">
                    <div className="flex flex-col">
                      <span className="text-gray-400 dark:text-gray-500 uppercase text-[10px] font-bold tracking-wider mb-0.5">Área / Dirección</span>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">{u.fundacion?.area || (esCargoDirectivo(u.fundacion?.cargo) ? 'Dirección General' : 'N/A')}</span>
                    </div>
                    {u.fundacion?.subArea && (
                      <div className="flex flex-col border-t border-gray-100 dark:border-gray-800 pt-2">
                        <span className="text-gray-400 dark:text-gray-500 uppercase text-[10px] font-bold tracking-wider mb-0.5">Sub-Área</span>
                        <span className="text-gray-800 dark:text-gray-200 font-medium">{u.fundacion.subArea}</span>
                      </div>
                    )}
                    {u.fundacion?.programa && (
                      <div className="flex flex-col border-t border-gray-100 dark:border-gray-800 pt-2">
                        <span className="text-gray-400 dark:text-gray-500 uppercase text-[10px] font-bold tracking-wider mb-0.5">Programa / Proyecto</span>
                        <span className="text-gray-800 dark:text-gray-200 font-medium">{u.fundacion.programa}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2 border-t border-gray-100 dark:border-gray-800 pt-2">
                      <div className="flex flex-col">
                        <span className="text-gray-400 dark:text-gray-500 uppercase text-[10px] font-bold tracking-wider mb-0.5">Nivel Jerárquico</span>
                        <span className="text-gray-800 dark:text-gray-200 font-medium capitalize">{u.fundacion?.nivel || 'N/A'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-400 dark:text-gray-500 uppercase text-[10px] font-bold tracking-wider mb-0.5">País de Trabajo</span>
                        <span className="text-gray-800 dark:text-gray-200 font-medium">{u.fundacion?.territorio?.pais || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 border-t border-gray-100 dark:border-gray-800 pt-2">
                        {u.fundacion?.territorio?.departamento && <div className="flex flex-col">
                        <span className="text-gray-400 dark:text-gray-500 uppercase text-[10px] font-bold tracking-wider mb-0.5">Departamento</span>
                        <span className="text-gray-800 dark:text-gray-200 font-medium capitalize">{u.fundacion?.territorio?.departamento}</span>
                      </div>}
                      {getTerritorioString(u) && <div className="flex flex-col">
                        <span className="text-gray-400 dark:text-gray-500 uppercase text-[10px] font-bold tracking-wider mb-0.5">Dirección</span>
                        <span className="text-gray-800 dark:text-gray-200 font-medium">{getTerritorioString(u)}</span>
                      </div>}
                    </div>
                  </div>
                  
                  {(() => {
                    const isCompleted = u.fundacion?.hojaDeVida?.completado && 
                                      u.fundacion?.entrevista?.completado && 
                                      (u.fundacion?.documentacionFHSYL?.completado || !!u.fundacion?.documentacionFHSYL?.testimonioConversion);
                    
                    return (
                      <button 
                        onClick={() => navigate(`/fundacion/admin/usuario/${u._id}/documentacion`)}
                        className={`w-full mt-auto py-2.5 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                          isCompleted 
                            ? 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white' 
                            : 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1'
                        }`}
                      >
                        {isCompleted ? 'Ver Documentación' : 'Documentación Pendiente'}
                        <ChevronRight size={18} />
                      </button>
                    );
                  })()}
                </>
              ) : (
                // --- LIST VIEW ---
                <>
                  <div className="relative flex-shrink-0">
                    <img 
                      src={getUserAvatar(u)} 
                      alt={`${u.nombres?.primero || ''} ${u.apellidos?.primero || ''}`}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-sm bg-gray-100 dark:bg-gray-700"
                      onError={handleImageError}
                    />
                    <div className="absolute -bottom-1 -right-1 p-1 sm:p-1.5 bg-green-500 rounded-full text-white border-2 border-white dark:border-gray-800">
                      <UserCheck size={12} className="sm:w-[14px] sm:h-[14px]" fill="currentColor" />
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 min-w-0">
                    <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors uppercase truncate">
                          {u.nombres?.primero} {u.apellidos?.primero}
                        </h4>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium truncate mb-1">
                          {u.fundacion?.cargo || 'Sin Cargo'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Área:</span> {u.fundacion?.area || (esCargoDirectivo(u.fundacion?.cargo) ? 'Dirección General' : 'N/A')}
                        </p>
                        {u.fundacion?.subArea && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Sub-Área:</span> {u.fundacion.subArea}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        {u.fundacion?.programa && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">Proyecto:</span> {u.fundacion.programa}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">País:</span> {u.fundacion?.territorio?.pais || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Departamento:</span> {u.fundacion?.territorio?.departamento || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Jerarquía:</span> <span className="capitalize">{u.fundacion?.nivel || 'N/A'}</span>
                        </p>
                        {
                          getTerritorioString(u) && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              <span className="font-semibold text-gray-700 dark:text-gray-300">Dirección:</span> {getTerritorioString(u)}
                            </p>
                          )
                        }
                      </div>
                    </div>
                    
                    {(() => {
                      const isCompleted = u.fundacion?.hojaDeVida?.completado && 
                                        u.fundacion?.entrevista?.completado && 
                                        u.fundacion?.documentacionFHSYL?.testimonioConversion;
                      
                      return (
                        <button 
                          onClick={() => navigate(`/fundacion/admin/usuario/${u._id}/documentacion`)}
                          className={`w-full sm:w-auto flex-shrink-0 px-4 py-2 sm:py-2.5 text-sm sm:text-base font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                            isCompleted 
                              ? 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white' 
                              : 'bg-yellow-500 text-white hover:bg-yellow-600 border-b-2 border-yellow-700'
                          }`}
                        >
                          <span className="hidden xs:inline">{isCompleted ? 'Ver Documentación' : 'Doc. Pendiente'}</span>
                          <span className="xs:hidden">{isCompleted ? 'Ver Docs' : 'Pendiente'}</span>
                          <ChevronRight size={18} />
                        </button>
                      );
                    })()}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <Users size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">No se encontraron usuarios bajo tu jurisdicción.</p>
        </div>
      )}

      {/* Paginación (Simplificada) */}
      {pagination.pages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setFilters(prev => ({ ...prev, page: p }))}
              className={`w-10 h-10 rounded-xl font-bold transition-all ${
                filters.page === p 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
