import { useState, useEffect } from 'react';
import { X, Folder, Info } from 'lucide-react';

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
  { valor: 'personal', nombre: 'Personal', descripcion: 'Solo tú puedes ver esta carpeta' },
  { valor: 'grupal', nombre: 'Grupal', descripcion: 'Visible para miembros de grupos específicos' },
  { valor: 'institucional', nombre: 'Institucional', descripcion: 'Visible según permisos organizacionales' },
];

const CARGOS_DISPONIBLES = [
  "Founder",
  "admin",
  "Desarrollador",
  "Director Nacional",
  "Director Regional",
  "Director Municipal",
  "Organizador Barrio",
  "Director",
  "Subdirector",
  "Encargado",
  "Profesional",
  "Miembro",
  "visitante"
];

const NIVELES_JERARQUICOS = [
  "nacional",
  "regional",
  "departamental",
  "municipal",
  "barrio",
  "local"
];

const ModalCarpeta = ({ isOpen, onClose, onSubmit, carpeta = null }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'personal',
    color: '#3B82F6',
    visibilidadPorCargo: {
      habilitado: false,
      cargos: []
    },
    visibilidadPorNivel: {
      habilitado: false,
      niveles: []
    },
    visibilidadGeografica: {
      habilitado: false,
      pais: '',
      region: '',
      municipio: '',
      barrio: ''
    }
  });

  const [mostrarOpciones, setMostrarOpciones] = useState({
    cargo: false,
    nivel: false,
    geografia: false
  });

  useEffect(() => {
    if (carpeta) {
      setFormData({
        nombre: carpeta.nombre || '',
        descripcion: carpeta.descripcion || '',
        tipo: carpeta.tipo || 'personal',
        color: carpeta.color || '#3B82F6',
        visibilidadPorCargo: carpeta.visibilidadPorCargo || { habilitado: false, cargos: [] },
        visibilidadPorNivel: carpeta.visibilidadPorNivel || { habilitado: false, niveles: [] },
        visibilidadGeografica: carpeta.visibilidadGeografica || { habilitado: false, pais: '', region: '', municipio: '', barrio: '' }
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        tipo: 'personal',
        color: '#3B82F6',
        visibilidadPorCargo: { habilitado: false, cargos: [] },
        visibilidadPorNivel: { habilitado: false, niveles: [] },
        visibilidadGeografica: { habilitado: false, pais: '', region: '', municipio: '', barrio: '' }
      });
    }
  }, [carpeta, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCargo = (cargo) => {
    setFormData(prev => ({
      ...prev,
      visibilidadPorCargo: {
        ...prev.visibilidadPorCargo,
        cargos: prev.visibilidadPorCargo.cargos.includes(cargo)
          ? prev.visibilidadPorCargo.cargos.filter(c => c !== cargo)
          : [...prev.visibilidadPorCargo.cargos, cargo]
      }
    }));
  };

  const toggleNivel = (nivel) => {
    setFormData(prev => ({
      ...prev,
      visibilidadPorNivel: {
        ...prev.visibilidadPorNivel,
        niveles: prev.visibilidadPorNivel.niveles.includes(nivel)
          ? prev.visibilidadPorNivel.niveles.filter(n => n !== nivel)
          : [...prev.visibilidadPorNivel.niveles, nivel]
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: formData.color + '20' }}
            >
              <Folder size={24} style={{ color: formData.color }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {carpeta ? 'Editar Carpeta' : 'Nueva Carpeta'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {TIPOS_CARPETA.find(t => t.valor === formData.tipo)?.descripcion}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Información Básica
            </h3>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre de la carpeta *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Ej: Documentos Importantes"
                required
                minLength={3}
                maxLength={100}
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción *
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
                placeholder="Describe el propósito de esta carpeta..."
                rows={3}
                required
                minLength={10}
                maxLength={500}
              />
            </div>

            {/* Tipo de carpeta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Carpeta *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {TIPOS_CARPETA.map((tipo) => (
                  <button
                    key={tipo.valor}
                    type="button"
                    onClick={() => handleChange('tipo', tipo.valor)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      formData.tipo === tipo.valor
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {tipo.nombre}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {tipo.descripcion}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {COLORES_CARPETA.map((color) => (
                  <button
                    key={color.valor}
                    type="button"
                    onClick={() => handleChange('color', color.valor)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      formData.color === color.valor
                        ? 'border-gray-900 dark:border-white scale-110'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.valor }}
                    title={color.nombre}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Opciones de visibilidad (solo para grupales e institucionales) */}
          {(formData.tipo === 'grupal' || formData.tipo === 'institucional') && (
            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Info size={20} />
                Opciones de Visibilidad
              </h3>

              {/* Visibilidad por Cargo */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Visible para cargos específicos
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      visibilidadPorCargo: {
                        ...prev.visibilidadPorCargo,
                        habilitado: !prev.visibilidadPorCargo.habilitado
                      }
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.visibilidadPorCargo.habilitado ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.visibilidadPorCargo.habilitado ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {formData.visibilidadPorCargo.habilitado && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {CARGOS_DISPONIBLES.map((cargo) => (
                      <button
                        key={cargo}
                        type="button"
                        onClick={() => toggleCargo(cargo)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          formData.visibilidadPorCargo.cargos.includes(cargo)
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {cargo}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Visibilidad por Nivel Jerárquico */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Visible por nivel jerárquico
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      visibilidadPorNivel: {
                        ...prev.visibilidadPorNivel,
                        habilitado: !prev.visibilidadPorNivel.habilitado
                      }
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.visibilidadPorNivel.habilitado ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.visibilidadPorNivel.habilitado ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {formData.visibilidadPorNivel.habilitado && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {NIVELES_JERARQUICOS.map((nivel) => (
                      <button
                        key={nivel}
                        type="button"
                        onClick={() => toggleNivel(nivel)}
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                          formData.visibilidadPorNivel.niveles.includes(nivel)
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {nivel}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Visibilidad Geográfica */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Visible por ubicación geográfica
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      visibilidadGeografica: {
                        ...prev.visibilidadGeografica,
                        habilitado: !prev.visibilidadGeografica.habilitado
                      }
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.visibilidadGeografica.habilitado ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.visibilidadGeografica.habilitado ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {formData.visibilidadGeografica.habilitado && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <input
                      type="text"
                      placeholder="País"
                      value={formData.visibilidadGeografica.pais}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        visibilidadGeografica: {
                          ...prev.visibilidadGeografica,
                          pais: e.target.value
                        }
                      }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Región/Estado"
                      value={formData.visibilidadGeografica.region}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        visibilidadGeografica: {
                          ...prev.visibilidadGeografica,
                          region: e.target.value
                        }
                      }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Municipio"
                      value={formData.visibilidadGeografica.municipio}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        visibilidadGeografica: {
                          ...prev.visibilidadGeografica,
                          municipio: e.target.value
                        }
                      }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Barrio"
                      value={formData.visibilidadGeografica.barrio}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        visibilidadGeografica: {
                          ...prev.visibilidadGeografica,
                          barrio: e.target.value
                        }
                      }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              {carpeta ? 'Guardar Cambios' : 'Crear Carpeta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCarpeta;
