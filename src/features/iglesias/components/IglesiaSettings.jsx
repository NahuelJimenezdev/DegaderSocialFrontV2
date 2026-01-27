import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getAvatarUrl, getBannerUrl } from '../../../shared/utils/avatarUtils';
import { AlertDialog } from '../../../shared/components/AlertDialog';
import { useIglesiaSettings } from '../hooks/useIglesiaSettings';
import iglesiaService from '../../../api/iglesiaService'; // Importar servicio
import { useState } from 'react'; // Importar useState

const IglesiaSettings = ({ iglesiaData, refetch }) => {
  const { user } = useAuth();

  // Verificar si el usuario es el pastor
  const isPastor = iglesiaData?.pastorPrincipal?._id === user?._id ||
    iglesiaData?.pastorPrincipal === user?._id;

  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveReason, setLeaveReason] = useState('');

  const handleLeaveIglesia = async () => {
    try {
      await iglesiaService.leave(iglesiaData._id, { motivo: leaveReason });
      // Redirigir al inicio para evitar estados inconsistentes y actualizar perfil
      window.location.href = '/';
    } catch (error) {
      console.error('Error leaving iglesia:', error);
      // Aquí podrías mostrar un toast de error si tuvieras acceso a useToast
      alert('Error al salir de la iglesia');
    }
  };

  // Hook de configuración
  const {
    loading,
    activeTab,
    formData,
    logoPreview,
    bannerPreview,
    galeriaPreviews,
    existingGaleria,
    newHorario,
    alertConfig,
    setActiveTab,
    setNewHorario,
    setAlertConfig,
    handleInputChange,
    handleLogoChange,
    handleBannerChange,
    handleGaleriaChange,
    handleRemoveGaleriaImage,
    handleAddHorario,
    handleRemoveHorario,
    handleSubmit
  } = useIglesiaSettings(iglesiaData, refetch);

  if (!isPastor && iglesiaData?.miembros?.some(m => m._id === user?._id || m === user?._id)) {
    // Si NO es pastor pero ES miembro, permitimos acceso limitado (para salir)
  } else if (!isPastor) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">lock</span>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Acceso Restringido
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Solo miembros y pastores pueden acceder a esta sección
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Tabs */}
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto scrollbar-none">
        {(isPastor
          ? ['general', 'ubicacion', 'contacto', 'galeria', 'pastor', 'cuenta']
          : ['cuenta']
        ).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === tab
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
            )}
          </button>
        ))
        }
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab: General */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            {/* ... (resto del contenido de general mantenido igual) ... */}
            {/* Solo reemplazo las líneas iniciales de la pestaña general */}
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

            <p className="text-xs text-gray-500 dark:text-gray-500">
              Aquí podrás seleccionar la ubicación exacta de tu iglesia en el mapa
            </p>

            {/* Google Maps Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Link de Google Maps (GPS)
              </label>
              <input
                type="url"
                name="ubicacion.googleMapsLink"
                value={formData.ubicacion.googleMapsLink || ''}
                onChange={handleInputChange}
                placeholder="https://maps.app.goo.gl/..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Copia el enlace de "Compartir" ubicación desde Google Maps para mostrar el mapa interactivo.
              </p>
            </div>
          </div>
        )}


        {/* Tab: Contacto */}
        {
          activeTab === 'contacto' && (
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
          )
        }

        {/* Tab: Galería */}
        {
          activeTab === 'galeria' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Galería de Fotos de la Iglesia
                </label>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {/* Fotos Existentes */}
                  {existingGaleria.map((url, index) => (
                    <div key={`existing-${index}`} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                      <img src={getAvatarUrl(url)} alt={`Foto ${index}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveGaleriaImage(index, true)}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                          title="Eliminar foto"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Previews de Nuevas Fotos */}
                  {galeriaPreviews.map((preview, index) => (
                    <div key={`new-${index}`} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-dashed border-indigo-400">
                      <img src={preview} alt={`Nueva ${index}`} className="w-full h-full object-cover opacity-70" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-500/10">
                        <span className="text-[10px] font-bold text-indigo-600 bg-white/90 px-2 py-1 rounded shadow-sm">NUEVA</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveGaleriaImage(index, false)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg scale-90"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Botón de Carga */}
                  <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all group">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleGaleriaChange}
                    />
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
                      <span className="material-symbols-outlined text-3xl text-gray-400 group-hover:text-indigo-500">add_a_photo</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 group-hover:text-indigo-600">Agregar Fotos</span>
                  </label>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl flex gap-3 border border-indigo-100 dark:border-indigo-800">
                  <span className="material-symbols-outlined text-indigo-500 mt-0.5">info</span>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed font-medium">
                    Las fotos de la galería se mostrarán en la sección de Información de tu iglesia.
                    Recomendamos imágenes horizontales de alta calidad para una mejor visualización.
                    Puedes subir varias imágenes a la vez.
                  </p>
                </div>
              </div>
            </div>
          )
        }

        {/* Tab: Pastor */}
        {
          activeTab === 'pastor' && (
            <div className="space-y-6">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl flex gap-3 border border-indigo-100 dark:border-indigo-800 mb-6">
                <span className="material-symbols-outlined text-indigo-500 mt-0.5">info</span>
                <div>
                  <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200">Personalización del Liderazgo</h4>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed font-medium mt-1">
                    Aquí puedes personalizar el mensaje que aparece junto a tu foto en la sección de información.
                    Si lo dejas vacío, se mostrará el mensaje por defecto: "Llamado a pastorear esta casa con amor y la Palabra."
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mensaje del Pastor
                </label>
                <textarea
                  name="infoPastor.mensaje"
                  value={formData.infoPastor?.mensaje || ''}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Ej: Bienvenidos a nuestra casa, un lugar donde el amor de Dios transforma vidas..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                  {(formData.infoPastor?.mensaje?.length || 0)}/500
                </p>
              </div>
            </div>
          )
        }

        {/* Tab: Cuenta (Para todos: Miembros y Pastores si desean ver info de su estado o salir) */}
        {
          activeTab === 'cuenta' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Estado de Membresía</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <span className="material-symbols-outlined text-2xl">verified</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Miembro Activo</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Te uniste el {new Date(user?.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-100 dark:border-red-800">
                <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-2">Zona de Peligro</h3>
                <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                  Si decides salir de la iglesia, perderás acceso a los eventos privados, chats y contenido exclusivo de la congregación. Tendrás que solicitar unirte nuevamente si cambias de opinión.
                </p>

                {isPastor ? (
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    ⚠️ Como Pastor Principal, no puedes abandonar la iglesia directamente. Debes transferir el liderazgo o eliminar la iglesia en la configuración avanzada.
                  </p>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        // Iniciar flujo de salida
                        setShowLeaveForm(true);
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                    >
                      Abandonar Iglesia
                    </button>

                    {/* Formulario de Salida Condicional */}
                    {showLeaveForm && (
                      <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 animate-fadeIn">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          ¿Por qué deseas salir? (Opcional - Se compartirá con el pastor)
                        </label>
                        <textarea
                          value={leaveReason}
                          onChange={(e) => setLeaveReason(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white mb-4"
                          rows={3}
                          placeholder="Escribe tu mensaje aquí..."
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setShowLeaveForm(false)}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={handleLeaveIglesia}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                          >
                            Confirmar Salida
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )
        }



        {/* Botones de acción (Solo Pastor) */}
        {
          isPastor && (
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
          )
        }
      </form >

      {/* AlertDialog Component */}
      < AlertDialog
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        variant={alertConfig.variant}
        message={alertConfig.message}
      />
    </div >
  );
};

export default IglesiaSettings;
