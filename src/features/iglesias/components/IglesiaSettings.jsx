import React, { useState } from 'react';
import { logger } from '../../../shared/utils/logger';
import { useAuth } from '../../../context/AuthContext';
import iglesiaService from '../../../api/iglesiaService';
import { getAvatarUrl, getBannerUrl } from '../../../shared/utils/avatarUtils';
import { AlertDialog } from '../../../shared/components/AlertDialog';

const IglesiaSettings = ({ iglesiaData, refetch }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Verificar si el usuario es el pastor
  const isPastor = iglesiaData?.pastorPrincipal?._id === user?._id ||
    iglesiaData?.pastorPrincipal === user?._id;

  const [formData, setFormData] = useState({
    nombre: iglesiaData?.nombre || '',
    descripcion: iglesiaData?.descripcion || '',
    mision: iglesiaData?.mision || '',
    vision: iglesiaData?.vision || '',
    valores: iglesiaData?.valores || '',
    ubicacion: {
      direccion: iglesiaData?.ubicacion?.direccion || '',
      ciudad: iglesiaData?.ubicacion?.ciudad || '',
      pais: iglesiaData?.ubicacion?.pais || '',
      coordenadas: iglesiaData?.ubicacion?.coordenadas || { lat: 0, lng: 0 }
    },
    contacto: {
      telefono: iglesiaData?.contacto?.telefono || '',
      email: iglesiaData?.contacto?.email || '',
      sitioWeb: iglesiaData?.contacto?.sitioWeb || ''
    },
    horarios: iglesiaData?.horarios || []
  });

  const [newHorario, setNewHorario] = useState({ dia: '', hora: '', tipo: '' });
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, variant: 'info', message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddHorario = () => {
    if (newHorario.dia && newHorario.hora && newHorario.tipo) {
      setFormData(prev => ({
        ...prev,
        horarios: [...prev.horarios, newHorario]
      }));
      setNewHorario({ dia: '', hora: '', tipo: '' });
    }
  };

  const handleRemoveHorario = (index) => {
    setFormData(prev => ({
      ...prev,
      horarios: prev.horarios.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      logger.log('🚀 Starting handleSubmit');
      // Si hay imágenes nuevas, primero subirlas
      const uploadData = new FormData();

      if (logoFile) {
        logger.log('📎 Appending logo file:', logoFile.name);
        uploadData.append('logo', logoFile);
      }
      if (bannerFile) {
        logger.log('📎 Appending banner file:', bannerFile.name);
        uploadData.append('portada', bannerFile);
      }

      // Agregar los demás datos del formulario
      Object.keys(formData).forEach(key => {
        if (typeof formData[key] === 'object' && !Array.isArray(formData[key])) {
          const jsonValue = JSON.stringify(formData[key]);
          logger.log(`📝 Appending object field ${key}:`, jsonValue);
          uploadData.append(key, jsonValue);
        } else if (Array.isArray(formData[key])) {
          const jsonValue = JSON.stringify(formData[key]);
          logger.log(`📝 Appending array field ${key}:`, jsonValue);
          uploadData.append(key, jsonValue);
        } else {
          logger.log(`📝 Appending field ${key}:`, formData[key]);
          uploadData.append(key, formData[key]);
        }
      });

      logger.log('📤 Sending updateIglesia request...');
      const response = await iglesiaService.updateIglesia(iglesiaData._id, uploadData);
      logger.log('✅ Update response:', response);

      await refetch();

      // Limpiar previews
      setLogoPreview(null);
      setBannerPreview(null);
      setLogoFile(null);
      setBannerFile(null);

      setAlertConfig({ isOpen: true, variant: 'success', message: 'Cambios guardados exitosamente' });
    } catch (error) {
      logger.error('❌ Error al guardar:', error);
      setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al guardar los cambios' });
    } finally {
      setLoading(false);
    }
  };

  if (!isPastor) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">lock</span>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Acceso Restringido
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Solo el pastor principal puede acceder a la configuración
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'general'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
        >
          General
          {activeTab === 'general' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('ubicacion')}
          className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'ubicacion'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
        >
          Ubicación
          {activeTab === 'ubicacion' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('contacto')}
          className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'contacto'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
        >
          Contacto
          {activeTab === 'contacto' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab: General */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            {/* Logo de la Iglesia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Logo de la Iglesia
              </label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center overflow-hidden">
                  {logoPreview || iglesiaData?.logo ? (
                    <img src={logoPreview || getAvatarUrl(iglesiaData.logo)} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-indigo-600 dark:text-indigo-400">church</span>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="logo-upload"
                    onChange={handleLogoChange}
                  />
                  <label
                    htmlFor="logo-upload"
                    className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer transition-colors"
                  >
                    Cambiar Logo
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Recomendado: 500x500px, formato JPG o PNG
                  </p>
                </div>
              </div>
            </div>

            {/* Banner de la Iglesia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Banner de la Iglesia
              </label>
              <div className="space-y-3">
                <div className="w-full h-48 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
                  {bannerPreview || iglesiaData?.portada ? (
                    <img src={bannerPreview || getBannerUrl(iglesiaData.portada)} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-lg font-medium">Banner de la Iglesia</span>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="banner-upload"
                    onChange={handleBannerChange}
                  />
                  <label
                    htmlFor="banner-upload"
                    className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer transition-colors"
                  >
                    Cambiar Banner
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Recomendado: 1200x400px, formato JPG o PNG
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre de la Iglesia
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Misión
              </label>
              <textarea
                name="mision"
                value={formData.mision}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Visión
              </label>
              <textarea
                name="vision"
                value={formData.vision}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Valores
              </label>
              <textarea
                name="valores"
                value={formData.valores}
                onChange={handleInputChange}
                rows={3}
                placeholder="Separa cada valor con una coma"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Horarios */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Horarios de Reuniones
              </label>
              <div className="space-y-2 mb-3">
                {formData.horarios.map((horario, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <span className="flex-1 text-gray-900 dark:text-white">
                      <span className="font-semibold">{horario.dia}</span> - {horario.hora}
                      {horario.tipo && <span className="ml-2 text-sm text-indigo-600 dark:text-indigo-400">({horario.tipo})</span>}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHorario(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-2">
                <select
                  value={newHorario.dia}
                  onChange={(e) => setNewHorario({ ...newHorario, dia: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Día</option>
                  <option value="Lunes">Lunes</option>
                  <option value="Martes">Martes</option>
                  <option value="Miércoles">Miércoles</option>
                  <option value="Jueves">Jueves</option>
                  <option value="Viernes">Viernes</option>
                  <option value="Sábado">Sábado</option>
                  <option value="Domingo">Domingo</option>
                </select>
                <input
                  type="time"
                  value={newHorario.hora}
                  onChange={(e) => setNewHorario({ ...newHorario, hora: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <select
                  value={newHorario.tipo}
                  onChange={(e) => setNewHorario({ ...newHorario, tipo: e.target.value })}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="">Tipo de Servicio</option>
                  <option value="Culto General">Culto General</option>
                  <option value="Oración">Oración</option>
                  <option value="Estudio de la Palabra">Estudio de la Palabra</option>
                  <option value="Escuela Dominical">Escuela Dominical</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddHorario}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Ubicación */}
        {activeTab === 'ubicacion' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dirección
              </label>
              <input
                type="text"
                name="ubicacion.direccion"
                value={formData.ubicacion.direccion}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ciudad
                </label>
                <input
                  type="text"
                  name="ubicacion.ciudad"
                  value={formData.ubicacion.ciudad}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  País
                </label>
                <input
                  type="text"
                  name="ubicacion.pais"
                  value={formData.ubicacion.pais}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                📍 Mapa de Google (Próximamente)
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Aquí podrás seleccionar la ubicación exacta de tu iglesia en el mapa
              </p>
            </div>
          </div>
        )}

        {/* Tab: Contacto */}
        {activeTab === 'contacto' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                name="contacto.telefono"
                value={formData.contacto.telefono}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="contacto.email"
                value={formData.contacto.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sitio Web
              </label>
              <input
                type="url"
                name="contacto.sitioWeb"
                value={formData.contacto.sitioWeb}
                onChange={handleInputChange}
                placeholder="https://ejemplo.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {loading && <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>}
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>

      {/* AlertDialog Component */}
      <AlertDialog
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        variant={alertConfig.variant}
        message={alertConfig.message}
      />
    </div>
  );
};

export default IglesiaSettings;



