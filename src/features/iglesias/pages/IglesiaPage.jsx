import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Search, Heart, MapPin, Users, Award, Briefcase, Plus, Check, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../shared/components/Toast/ToastProvider';
import userService from '../../../api/userService';
import folderService from '../../../api/folderService';
import iglesiaService from '../../../api/iglesiaService';
import fundacionService from '../../../api/fundacionService';
import ChurchCard from '../components/ChurchCard';
import HeroSection from '../components/HeroSection';
import FilterBar from '../components/FilterBar';
import Skeleton from '../../../shared/components/Skeleton/Skeleton';
import EmptyState from '../../../shared/components/EmptyState/EmptyState';
import styles from '../styles/IglesiaPage.module.css';

export default function IglesiaPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('iglesias');
  const [loading, setLoading] = useState(false);
  const [jerarquia, setJerarquia] = useState({ areas: [], cargos: [], niveles: [] });
  
  // Estado Iglesias
  const [iglesias, setIglesias] = useState([]);
  const [busquedaIglesia, setBusquedaIglesia] = useState('');
  const [loadingIglesias, setLoadingIglesias] = useState(false);
  
  // Estado Filtros y Visualización
  const [filters, setFilters] = useState({ denominacion: '', ubicacion: '' });
  const [sort, setSort] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  
  const [mostrarFormIglesia, setMostrarFormIglesia] = useState(false);
  const [formIglesia, setFormIglesia] = useState({
    nombre: '',
    denominacion: '',
    pais: 'Colombia',
    ciudad: '',
    direccion: ''
  });

  // Estado Fundación
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
  const [formData, setFormData] = useState({
    area: '',
    nivel: '',
    cargo: '',
    pais: 'Colombia',
    departamento: '',
    municipio: ''
  });

  useEffect(() => {
    cargarJerarquia();
    cargarIglesias();
    if (user?.fundacion) {
      setFormData(prev => ({
        ...prev,
        area: user.fundacion.area || '',
        nivel: user.fundacion.nivel || '',
        cargo: user.fundacion.cargo || '',
        pais: user.fundacion.territorio?.pais || 'Colombia',
        departamento: user.fundacion.territorio?.departamento || '',
        municipio: user.fundacion.territorio?.municipio || ''
      }));

      if (user.fundacion.estadoAprobacion === 'aprobado') {
        cargarSolicitudesPendientes();
      }
    }
  }, [user]);

  const cargarJerarquia = async () => {
    try {
      const response = await folderService.getHierarchy();
      setJerarquia(response.data || { areas: [], cargos: [], niveles: [] });
    } catch (error) {
      console.error('Error cargando jerarquía:', error);
    }
  };

  const cargarIglesias = async () => {
    try {
      setLoadingIglesias(true);
      const response = await iglesiaService.getAll({ q: busquedaIglesia });
      const todasIglesias = response.data || [];
      
      // Filtrar iglesias: si el usuario ya es miembro de una iglesia, solo mostrar esa
      const iglesiaDelUsuario = todasIglesias.find(iglesia => {
        const pastorId = iglesia.pastorPrincipal?._id || iglesia.pastorPrincipal;
        const isPastor = pastorId && user?._id && pastorId.toString() === user._id.toString();
        
        const isMember = iglesia.miembros?.some(m => {
          const memberId = m._id || m;
          return memberId.toString() === user?._id?.toString();
        });
        
        return isPastor || isMember;
      });
      
      // Si el usuario ya pertenece a una iglesia, solo mostrar esa
      // Si no pertenece a ninguna, mostrar todas para que pueda unirse
      setIglesias(iglesiaDelUsuario ? [iglesiaDelUsuario] : todasIglesias);
    } catch (error) {
      console.error('Error cargando iglesias:', error);
      toast.error('Error al cargar las iglesias');
    } finally {
      setLoadingIglesias(false);
    }
  };

  // Lógica de Filtrado y Ordenamiento
  const getFilteredIglesias = () => {
    let result = [...iglesias];

    // Filtrar por denominación
    if (filters.denominacion) {
      result = result.filter(i => i.denominacion === filters.denominacion);
    }

    // Filtrar por ubicación (ciudad)
    if (filters.ubicacion) {
      result = result.filter(i => i.ubicacion?.ciudad === filters.ubicacion);
    }

    // Ordenar
    switch (sort) {
      case 'name_asc':
        result.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'name_desc':
        result.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case 'members_desc':
        result.sort((a, b) => (b.miembros?.length || 0) - (a.miembros?.length || 0));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
    }

    return result;
  };

  const filteredIglesias = getFilteredIglesias();

  // Calcular estadísticas para el Hero
  const stats = {
    churches: iglesias.length,
    members: iglesias.reduce((acc, curr) => acc + (curr.miembros?.length || 0), 0),
    events: iglesias.reduce((acc, curr) => acc + (curr.reuniones?.length || 0), 0)
  };

  const cargarSolicitudesPendientes = async () => {
    try {
      console.log('🔍 Cargando solicitudes pendientes...');
      const response = await fundacionService.getPendingRequests();
      console.log('📋 Respuesta de solicitudes:', response);
      setSolicitudesPendientes(response.data?.solicitudes || []);
      console.log('✅ Solicitudes cargadas:', response.data?.solicitudes?.length || 0);
    } catch (error) {
      console.error('❌ Error cargando solicitudes:', error);
      console.error('Detalles:', error.response?.data);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedData = {
        esMiembroFundacion: true,
        fundacion: {
          activo: true,
          area: formData.area,
          nivel: formData.nivel,
          cargo: formData.cargo,
          territorio: {
            pais: formData.pais,
            departamento: formData.departamento,
            municipio: formData.municipio
          }
        }
      };

      const response = await userService.updateProfile(updatedData);
      updateUser({ ...user, ...response.data });
      toast.success('Solicitud enviada. Tu estado ahora es PENDIENTE de aprobación.');
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      toast.error('Error al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearIglesia = async (e) => {
    e.preventDefault();
    try {
      await iglesiaService.create({
        nombre: formIglesia.nombre,
        denominacion: formIglesia.denominacion,
        ubicacion: {
          pais: formIglesia.pais,
          ciudad: formIglesia.ciudad,
          direccion: formIglesia.direccion
        }
      });
      toast.success('¡Iglesia creada exitosamente!');
      setMostrarFormIglesia(false);
      cargarIglesias();
      // Refrescar usuario para ver rol de pastor
      const userRes = await userService.getUserById(user._id);
      updateUser(userRes.data);
    } catch (error) {
      console.error('Error creando iglesia:', error);
      toast.error('Error al crear la iglesia');
    }
  };

  const handleUnirseIglesia = async (id) => {
    try {
      await iglesiaService.join(id, 'Deseo unirme a esta iglesia');
      alert('Solicitud enviada al pastor');
    } catch (error) {
      alert(error.response?.data?.message || 'Error al unirse');
    }
  };

  const handleGestionarSolicitud = async (userId, accion) => {
    try {
      if (accion === 'aprobar') {
        await fundacionService.approveRequest(userId);
        toast.success('Solicitud aprobada correctamente');
      } else {
        await fundacionService.rejectRequest(userId, 'No cumple requisitos');
        toast.info('Solicitud rechazada');
      }
      cargarSolicitudesPendientes();
    } catch (error) {
      console.error('Error gestionando solicitud:', error);
      toast.error('Error al gestionar solicitud');
    }
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

      {mostrarFormIglesia && (
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
          <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Nueva Iglesia</h4>
          <form onSubmit={handleCrearIglesia} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre de la Iglesia"
              className="px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={formIglesia.nombre}
              onChange={e => setFormIglesia({...formIglesia, nombre: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Denominación"
              className="px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={formIglesia.denominacion}
              onChange={e => setFormIglesia({...formIglesia, denominacion: e.target.value})}
            />
            <input
              type="text"
              placeholder="País"
              className="px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={formIglesia.pais}
              onChange={e => setFormIglesia({...formIglesia, pais: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Ciudad"
              className="px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={formIglesia.ciudad}
              onChange={e => setFormIglesia({...formIglesia, ciudad: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Dirección"
              className="px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white col-span-2"
              value={formIglesia.direccion}
              onChange={e => setFormIglesia({...formIglesia, direccion: e.target.value})}
              required
            />
            <div className="col-span-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setMostrarFormIglesia(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Crear Iglesia
              </button>
            </div>
          </form>
        </div>
      )}

      <HeroSection 
        searchQuery={busquedaIglesia}
        onSearchChange={(val) => {
          setBusquedaIglesia(val);
          // Debounce idealmente, por ahora mantenemos el comportamiento original
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
          <div className={`p-4 rounded-lg mb-6 ${
            user.fundacion.estadoAprobacion === 'aprobado' ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
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

        {/* Formulario (Solo si no está aprobado o quiere actualizar) */}
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Área Institucional
              </label>
              <select
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Seleccionar Área</option>
                {jerarquia.areas?.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nivel Jerárquico
              </label>
              <select
                value={formData.nivel}
                onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Seleccionar Nivel</option>
                {jerarquia.niveles?.map(nivel => (
                  <option key={nivel} value={nivel}>{nivel}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cargo
              </label>
              <select
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Seleccionar Cargo</option>
                {jerarquia.cargos?.map(cargo => (
                  <option key={cargo} value={cargo}>{cargo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                País
              </label>
              <input
                type="text"
                value={formData.pais}
                onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
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

      {/* Panel de Aprobaciones (Solo para líderes aprobados) */}
      {user?.fundacion?.estadoAprobacion === 'aprobado' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Users className="text-indigo-600" />
            Solicitudes Pendientes ({solicitudesPendientes.length})
          </h3>
          {solicitudesPendientes.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No hay solicitudes pendientes en este momento.
            </p>
          ) : (
            <div className="space-y-4">
              {solicitudesPendientes.map((solicitud) => (
                <div key={solicitud._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {solicitud.nombres.primero} {solicitud.apellidos.primero}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Solicita: <strong>{solicitud.fundacion.cargo}</strong> ({solicitud.fundacion.nivel})
                    </p>
                    <p className="text-xs text-gray-500">
                      Área: {solicitud.fundacion.area}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGestionarSolicitud(solicitud._id, 'rechazar')}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                      title="Rechazar"
                    >
                      <X size={20} />
                    </button>
                    <button
                      onClick={() => handleGestionarSolicitud(solicitud._id, 'aprobar')}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-full"
                      title="Aprobar"
                    >
                      <Check size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Institución</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gestiona tu vida eclesiástica e institucional</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-8">
        <button
          onClick={() => setActiveTab('iglesias')}
          className={`pb-4 px-2 text-sm font-medium transition-colors relative ${
            activeTab === 'iglesias'
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
          className={`pb-4 px-2 text-sm font-medium transition-colors relative ${
            activeTab === 'fundacion'
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
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'iglesias' ? renderIglesiasTab() : renderFundacionTab()}
      </div>
    </div>
  );
}
