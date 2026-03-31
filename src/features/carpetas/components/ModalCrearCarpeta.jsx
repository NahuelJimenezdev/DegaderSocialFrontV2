import { useState, useEffect } from 'react';
import { X, Folder, Users, Globe, Building, Shield, UsersRound, MapPin } from 'lucide-react';
import api from '../../../api/config';
import { useAuth } from '../../../context/AuthContext';
import { useFundacion, ESTRUCTURA_FUNDACION, CARGOS_POR_NIVEL } from '../../fundacion/hooks/useFundacion';

const COLORES_CARPETA = [
  { nombre: 'Azul', valor: '#3B82F6' },
  { nombre: 'Indigo', valor: '#6366F1' },
  { nombre: 'Púrpura', valor: '#8B5CF6' },
  { nombre: 'Rosa', valor: '#EC4899' },
  { nombre: 'Rojo', valor: '#EF4444' },
  { nombre: 'Naranja', valor: '#F97316' },
  { nombre: 'Amarillo', valor: '#EAB308' },
  { nombre: 'Verde', valor: '#10B981' },
  { nombre: 'Teal', valor: '#14B8A6' },
  { nombre: 'Gris', valor: '#6B7280' },
];

const TIPOS_CARPETA = [
  { valor: 'personal', nombre: 'Personal', descripcion: 'Solo tú puedes ver esta carpeta', icon: <Shield size={18} /> },
  { valor: 'grupal', nombre: 'Grupal', descripcion: 'Compartida con grupos específicos', icon: <Users size={18} /> },
  { valor: 'institucional', nombre: 'Institucional', descripcion: 'Visible por jerarquía organizacional', icon: <Building size={18} /> },
];

const ModalCrearCarpeta = ({ isOpen, onClose, onSubmit, jerarquia, carpeta, isEditing }) => {
  const { user } = useAuth();
  
  // Debug para verificar por qué el usuario pruebas@gmail.com puede ver la opción
  useEffect(() => {
    if (isOpen) {
      console.log('DEBUG: ModalCrearCarpeta Check', {
        email: user?.email,
        rolSistema: user?.seguridad?.rolSistema,
        esMiembro: user?.esMiembroFundacion,
        estado: user?.fundacion?.estadoAprobacion,
        cargo: user?.fundacion?.cargo
      });
    }
  }, [isOpen, user]);

  // Restricción de creación de carpetas institucionales
  // Solo Founder o Miembros Aprobados con Cargo
  const puedeCrearInstitucionales = user?.seguridad?.rolSistema === 'Founder' || 
    (user?.esMiembroFundacion && user?.fundacion?.estadoAprobacion === 'aprobado' && user?.fundacion?.cargo && user?.fundacion?.cargo !== 'Afiliado');

  const tiposDisponibles = TIPOS_CARPETA.filter(tipo => 
    tipo.valor !== 'institucional' || puedeCrearInstitucionales
  );

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'personal',
    color: '#3B82F6',
    icono: 'folder',
    // Jerarquía completa
    nivelInstitucional: '',
    cargoInstitucional: '',
    areaSeleccionada: '',
    subAreaSeleccionada: '',
    programaSeleccionado: '',
    pais: '',
    provincia: '',
    ciudad: '',
    compartirAutomaticamente: false,
    grupoId: ''
  });

  const {
    getNivelesDisponibles,
    getCargosDisponibles,
    getAreasDisponibles
  } = useFundacion(user, null);

  const [previewUsuarios, setPreviewUsuarios] = useState(null); // null = loading/unknown, 0 = none, >0 = count
  const [myGroups, setMyGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);

  // Reset/Load form on open
  useEffect(() => {
    if (isOpen) {
      if (isEditing && carpeta) {
        // Cargar datos de la carpeta para editar
        setFormData({
          nombre: carpeta.nombre || '',
          descripcion: carpeta.descripcion || '',
          tipo: carpeta.tipo || 'personal',
          color: carpeta.color || '#3B82F6',
          icono: carpeta.icono || 'folder',
          nivelInstitucional: carpeta.visibilidadPorNivel?.niveles?.[0] || (carpeta.visibilidadPorNivel?.habilitado === false ? 'Todas' : ''),
          cargoInstitucional: carpeta.visibilidadPorCargo?.cargos?.[0] || '',
          areaSeleccionada: carpeta.visibilidadPorArea?.areas?.[0] || '',
          subAreaSeleccionada: carpeta.visibilidadPorArea?.subAreas?.[0] || '',
          programaSeleccionado: carpeta.visibilidadPorArea?.programas?.[0] || '',
          pais: carpeta.visibilidadGeografica?.pais || '',
          provincia: carpeta.visibilidadGeografica?.subdivision || '',
          ciudad: carpeta.visibilidadGeografica?.ciudad || '',
          compartirAutomaticamente: false // No persistimos esto en edición por seguridad
        });
      } else {
        // Resetear para crear nueva
        setFormData({
          nombre: '',
          descripcion: '',
          tipo: 'personal',
          color: '#3B82F6',
          icono: 'folder',
          nivelInstitucional: '',
          cargoInstitucional: '',
          areaSeleccionada: '',
          subAreaSeleccionada: '',
          programaSeleccionado: '',
          pais: '',
          provincia: '',
          ciudad: '',
          compartirAutomaticamente: false,
          grupoId: ''
        });
      }
      setPreviewUsuarios(null);

      // Cargar grupos si abren el modal (o diferirlo a cuando seleccionen 'grupal')
      setLoadingGroups(true);
      api.get('/grupos/mis-grupos')
        .then(r => setMyGroups(r.data?.data || []))
        .catch(() => setMyGroups([]))
        .finally(() => setLoadingGroups(false));
    }
  }, [isOpen, isEditing, carpeta]);

  // Simular preview de usuarios (en una app real, esto podría llamar a un endpoint de "dry-run")
  useEffect(() => {
    if (formData.tipo === 'institucional' && formData.areaSeleccionada && formData.nivelInstitucional) {
      // Aquí podríamos hacer una llamada al backend para contar usuarios reales
      // Por ahora simulamos un cálculo basado en la selección para UX
      setPreviewUsuarios('Calculando...');
      const timer = setTimeout(() => {
        // Simulación: si hay datos completos, mostramos un número "potencial"
        // En producción esto debería ser real
        setPreviewUsuarios('Usuarios de ' + formData.areaSeleccionada + ' (' + formData.nivelInstitucional + ')');
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setPreviewUsuarios(null);
    }
  }, [formData.areaSeleccionada, formData.nivelInstitucional, formData.tipo]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar grupo si es tipo grupal
    if (formData.tipo === 'grupal' && !formData.grupoId) {
       return; // No debe poder enviar
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const isGrupalWithoutGroups = formData.tipo === 'grupal' && myGroups.length === 0 && !loadingGroups;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: formData.color + '20' }}>
              <Folder style={{ color: formData.color }} size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isEditing ? 'Editar Carpeta' : 'Nueva Carpeta'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isEditing ? 'Modifica los detalles de tu carpeta' : 'Crea un nuevo espacio para tus archivos'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X className="text-gray-500" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Ej: Proyectos 2024"
                required
                minLength={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
                placeholder="¿Qué contiene esta carpeta?"
                rows={3}
                required
                minLength={10}
              />
            </div>
          </div>

          {/* Tipo de Carpeta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Tipo de Carpeta</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {tiposDisponibles.map((tipo) => (
                <button
                  key={tipo.valor}
                  type="button"
                  onClick={() => handleChange('tipo', tipo.valor)}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${formData.tipo === tipo.valor
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                >
                  <div className={`mb-2 ${formData.tipo === tipo.valor ? 'colorMarcaDegader' : 'text-gray-500'}`}>
                    {tipo.icon}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{tipo.nombre}</span>
                  <span className="text-xs text-center text-gray-500 mt-1">{tipo.descripcion}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Configuración Grupal (Condicional) */}
          {formData.tipo === 'grupal' && (
            <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-5 border border-pink-200 dark:border-pink-800 space-y-4 animate-fadeIn">
              <h3 className="font-semibold text-pink-800 dark:text-pink-300 flex items-center gap-2">
                <UsersRound size={18} className="text-pink-500" />
                Configuración de Grupo
              </h3>
              
              {loadingGroups ? (
                <p className="text-sm text-pink-600 dark:text-pink-400">Cargando grupos...</p>
              ) : myGroups.length === 0 ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">No perteneces a ningún grupo todavía.</p>
                  <p className="text-xs text-red-500 mt-1">Debes unirte o crear un grupo antes de poder crear carpetas grupales.</p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Selecciona un grupo
                  </label>
                  <select
                    value={formData.grupoId}
                    onChange={(e) => handleChange('grupoId', e.target.value)}
                    className="w-full px-4 py-2 border border-pink-300 dark:border-pink-700 rounded-lg focus:ring-2 focus:ring-pink-500 bg-white dark:bg-[#0a0e27] dark:text-white"
                    required={formData.tipo === 'grupal'}
                  >
                    <option value="">Selecciona tu grupo...</option>
                    {myGroups.map(g => (
                      <option key={g._id} value={g._id} className="dark:bg-[#1a1f3a]">
                        {g.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Configuración Institucional (Condicional) */}
          {formData.tipo === 'institucional' && (
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-5 border border-blue-200 dark:border-blue-800/50 space-y-5 animate-fadeIn">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <Building size={18} className="text-blue-500" />
                Configuración Institucional (FHS&L)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. NIVEL */}
                <div>
                  <label className="block text-xs font-bold text-blue-700 dark:text-blue-300 uppercase mb-1.5 tracking-wider">
                    1. Nivel Jerárquico
                  </label>
                    <select
                      value={formData.nivelInstitucional || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          nivelInstitucional: val,
                          cargoInstitucional: '', areaSeleccionada: '', subAreaSeleccionada: '', programaSeleccionado: '',
                          provincia: '', ciudad: ''
                        }));
                      }}
                      className="w-full px-3 py-2.5 border border-blue-200 dark:border-blue-800 rounded-lg text-sm dark:bg-[#0a0e27] dark:text-white focus:ring-2 focus:ring-blue-500"
                      required={formData.tipo === 'institucional'}
                    >
                      <option value="">Seleccionar Nivel...</option>
                      <option value="Todas">Toda la Fundación (Global)</option>
                      {Object.keys(ESTRUCTURA_FUNDACION || {}).map(nivel => (
                        <option key={nivel} value={nivel}>
                          {nivel.charAt(0).toUpperCase() + nivel.slice(1).replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                </div>

                {/* 2. CARGO */}
                {formData.nivelInstitucional && formData.nivelInstitucional !== 'Todas' && (
                  <div>
                    <label className="block text-xs font-bold text-blue-700 dark:text-blue-300 uppercase mb-1.5 tracking-wider">
                      2. Cargo Institucional
                    </label>
                    <select
                      value={formData.cargoInstitucional}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          cargoInstitucional: val,
                          areaSeleccionada: '', subAreaSeleccionada: '', programaSeleccionado: ''
                        }));
                      }}
                      className="w-full px-3 py-2.5 border border-blue-200 dark:border-blue-800 rounded-lg text-sm dark:bg-[#0a0e27] dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Cualquier Cargo (Todos)</option>
                      {CARGOS_POR_NIVEL[formData.nivelInstitucional]?.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 3. ÁREA */}
                {formData.nivelInstitucional && formData.nivelInstitucional !== 'Todas' && (
                  <div>
                    <label className="block text-xs font-bold text-blue-700 dark:text-blue-300 uppercase mb-1.5 tracking-wider">
                      3. Área / Dirección
                    </label>
                    <select
                      value={formData.areaSeleccionada}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          areaSeleccionada: val,
                          subAreaSeleccionada: '', programaSeleccionado: ''
                        }));
                      }}
                      className="w-full px-3 py-2.5 border border-blue-200 dark:border-blue-800 rounded-lg text-sm dark:bg-[#0a0e27] dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Cualquier Área (Todas)</option>
                      {Object.keys(ESTRUCTURA_FUNDACION[formData.nivelInstitucional]?.areas || {}).map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 4. SUB-ÁREA (Si aplica) */}
                {formData.areaSeleccionada && ESTRUCTURA_FUNDACION[formData.nivelInstitucional]?.areas[formData.areaSeleccionada]?.subAreas && 
                 Object.keys(ESTRUCTURA_FUNDACION[formData.nivelInstitucional].areas[formData.areaSeleccionada].subAreas).length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-blue-700 dark:text-blue-300 uppercase mb-1.5 tracking-wider">
                      4. Sub-Área
                    </label>
                    <select
                      value={formData.subAreaSeleccionada}
                      onChange={(e) => handleChange('subAreaSeleccionada', e.target.value)}
                      className="w-full px-3 py-2.5 border border-blue-200 dark:border-blue-800 rounded-lg text-sm dark:bg-[#0a0e27] dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Todas las Sub-Áreas</option>
                      {Object.keys(ESTRUCTURA_FUNDACION[formData.nivelInstitucional].areas[formData.areaSeleccionada].subAreas).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 5. PROGRAMA (Si aplica) */}
                {formData.areaSeleccionada && (
                  (() => {
                    const areaObj = ESTRUCTURA_FUNDACION[formData.nivelInstitucional]?.areas[formData.areaSeleccionada];
                    const programas = areaObj?.programas || {};
                    // Si hay sub-área seleccionada, buscar programas en la sub-área
                    let programasKeys = [];
                    if (formData.subAreaSeleccionada && areaObj?.subAreas[formData.subAreaSeleccionada]?.programas) {
                        programasKeys = Object.keys(areaObj.subAreas[formData.subAreaSeleccionada].programas);
                    } else if (!formData.subAreaSeleccionada) {
                        programasKeys = Object.keys(programas);
                    }

                    if (programasKeys.length === 0) return null;

                    return (
                      <div>
                        <label className="block text-xs font-bold text-blue-700 dark:text-blue-300 uppercase mb-1.5 tracking-wider">
                          5. Programa
                        </label>
                        <select
                          value={formData.programaSeleccionado}
                          onChange={(e) => handleChange('programaSeleccionado', e.target.value)}
                          className="w-full px-3 py-2.5 border border-blue-200 dark:border-blue-800 rounded-lg text-sm dark:bg-[#0a0e27] dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Todos los Programas</option>
                          {programasKeys.map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                    );
                  })()
                )}
              </div>

              {/* Ubicación Geográfica (Dinámica) */}
              {formData.nivelInstitucional && formData.nivelInstitucional !== 'Todas' && formData.nivelInstitucional !== 'directivo_general' && (
                <div className="pt-4 border-t border-blue-100 dark:border-blue-900/50">
                  <h4 className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase flex items-center gap-2 mb-3">
                    <MapPin size={14} />
                    Alcance Territorial
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-gray-500 uppercase mb-1">País</label>
                      <input
                        type="text"
                        placeholder="País"
                        value={formData.pais}
                        onChange={(e) => handleChange('pais', e.target.value)}
                        className="w-full px-3 py-2 border border-blue-200 dark:border-blue-800 rounded-lg text-sm dark:bg-[#0a0e27] dark:text-white"
                        required={formData.nivelInstitucional !== 'Todas'}
                      />
                    </div>
                    {['regional', 'departamental', 'municipal', 'local', 'barrial'].includes(formData.nivelInstitucional) && (
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase mb-1">Provincia/Estado</label>
                        <input
                          type="text"
                          placeholder="Ej: Buenos Aires"
                          value={formData.provincia}
                          onChange={(e) => handleChange('provincia', e.target.value)}
                          className="w-full px-3 py-2 border border-blue-200 dark:border-blue-800 rounded-lg text-sm dark:bg-[#0a0e27] dark:text-white"
                        />
                      </div>
                    )}
                    {['municipal', 'local', 'barrial'].includes(formData.nivelInstitucional) && (
                      <div>
                        <label className="block text-[10px] text-gray-500 uppercase mb-1">Ciudad/Municipio</label>
                        <input
                          type="text"
                          placeholder="Ej: Rosario"
                          value={formData.ciudad}
                          onChange={(e) => handleChange('ciudad', e.target.value)}
                          className="w-full px-3 py-2 border border-blue-200 dark:border-blue-800 rounded-lg text-sm dark:bg-[#0a0e27] dark:text-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Opción de Compartir Automáticamente */}
              <div className="bg-blue-100/50 dark:bg-blue-900/30 rounded-lg p-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.compartirAutomaticamente}
                    onChange={(e) => handleChange('compartirAutomaticamente', e.target.checked)}
                    className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-200 block">
                      Vincular a todos los usuarios actuales
                    </span>
                    <span className="text-xs text-blue-700 dark:text-blue-400">
                      Los miembros que coincidan con esta jerarquía encontrarán la carpeta en su sección "Institucional".
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Selector de Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLORES_CARPETA.map((color) => (
                <button
                  key={color.valor}
                  type="button"
                  onClick={() => handleChange('color', color.valor)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${formData.color === color.valor ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent hover:scale-105'
                    }`}
                  style={{ backgroundColor: color.valor }}
                  title={color.nombre}
                />
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isGrupalWithoutGroups}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? 'Guardar Cambios' : 'Crear Carpeta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearCarpeta;


