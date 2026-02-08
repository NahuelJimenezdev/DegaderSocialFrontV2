import { useState, useEffect } from 'react';
import { X, Folder, Users, Globe, Building, Shield } from 'lucide-react';

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
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'personal',
    color: '#3B82F6',
    icono: 'folder',
    // Jerarquía
    areaSeleccionada: '',
    nivelInstitucional: '',
    pais: '',
    provincia: '',
    ciudad: '',
    compartirAutomaticamente: false
  });

  const [previewUsuarios, setPreviewUsuarios] = useState(null); // null = loading/unknown, 0 = none, >0 = count

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
          areaSeleccionada: carpeta.visibilidadPorArea?.areas?.[0] || '',
          nivelInstitucional: carpeta.visibilidadPorArea?.nivel || '',
          pais: carpeta.visibilidadPorArea?.ubicacion?.pais || '',
          provincia: carpeta.visibilidadPorArea?.ubicacion?.subdivision || '',
          ciudad: carpeta.visibilidadPorArea?.ubicacion?.ciudad || '',
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
          areaSeleccionada: '',
          nivelInstitucional: '',
          pais: '',
          provincia: '',
          ciudad: '',
          compartirAutomaticamente: false
        });
      }
      setPreviewUsuarios(null);
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
    onSubmit(formData);
  };

  if (!isOpen) return null;

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
              {TIPOS_CARPETA.map((tipo) => (
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

          {/* Configuración Institucional (Condicional) */}
          {formData.tipo === 'institucional' && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700 space-y-4 animate-fadeIn">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Building size={18} className="text-indigo-500" />
                Configuración Institucional
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Área</label>
                  <select
                    value={formData.areaSeleccionada}
                    onChange={(e) => handleChange('areaSeleccionada', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Seleccionar Área</option>
                    {jerarquia.areas?.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Nivel</label>
                  <select
                    value={formData.nivelInstitucional}
                    onChange={(e) => handleChange('nivelInstitucional', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Seleccionar Nivel</option>
                    {jerarquia.niveles?.map(nivel => (
                      <option key={nivel} value={nivel}>{nivel}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ubicación (Condicional según nivel) */}
              {(formData.nivelInstitucional && formData.nivelInstitucional !== 'Nacional') && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <input
                    type="text"
                    placeholder="País"
                    value={formData.pais}
                    onChange={(e) => handleChange('pais', e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
                  />
                  {['Provincial', 'Municipal', 'Local'].includes(formData.nivelInstitucional) && (
                    <input
                      type="text"
                      placeholder="Provincia/Estado"
                      value={formData.provincia}
                      onChange={(e) => handleChange('provincia', e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
                    />
                  )}
                  {['Municipal', 'Local'].includes(formData.nivelInstitucional) && (
                    <input
                      type="text"
                      placeholder="Ciudad"
                      value={formData.ciudad}
                      onChange={(e) => handleChange('ciudad', e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
                    />
                  )}
                </div>
              )}

              {/* Preview y Checkbox Automático */}
              {previewUsuarios && (
                <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3 mt-2">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Globe size={16} className="colorMarcaDegader dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm text-indigo-900 dark:text-indigo-200 font-medium">
                        Alcance estimado: {previewUsuarios}
                      </p>
                      <label className="flex items-center gap-2 mt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.compartirAutomaticamente}
                          onChange={(e) => handleChange('compartirAutomaticamente', e.target.checked)}
                          className="rounded colorMarcaDegader focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Compartir automáticamente con estos usuarios
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
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
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-500/30"
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


