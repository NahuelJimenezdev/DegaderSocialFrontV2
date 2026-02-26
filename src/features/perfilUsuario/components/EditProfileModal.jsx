import { useState } from 'react';
import { logger } from '../../../shared/utils/logger';
import { X, Camera, Save, Loader } from 'lucide-react';
import { API_BASE_URL } from '../../../shared/config/env';
import { userService } from '../../../api';

const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    nombre: user?.nombres?.primero || '',
    apellido: user?.apellidos?.primero || '',
    biografia: user?.social?.biografia || '',
    telefono: user?.personal?.celular || '',
    ciudad: user?.personal?.ubicacion?.ciudad || '',
    pais: user?.personal?.ubicacion?.pais || '',
    fechaNacimiento: user?.personal?.fechaNacimiento ? new Date(user.personal.fechaNacimiento).toISOString().split('T')[0] : ''
  });

  const [avatarFile, setAvatarFile] = useState(null);
  // Normalizar la URL del avatar para asegurar que se muestre correctamente
  const getUserAvatar = () => {
    if (!user) return '';
    if (user.social?.fotoPerfil) {
      // Si el avatar ya es una URL completa, usarla
      if (user.social.fotoPerfil.startsWith('http')) return user.social.fotoPerfil;
      // Si es una ruta relativa, agregar el dominio del backend
      if (user.social.fotoPerfil.startsWith('/')) return `${API_BASE_URL}${user.social.fotoPerfil} `;
      // Si no tiene protocolo ni barra inicial, agregar ambos
      return `${API_BASE_URL}/${user.social.fotoPerfil}`;
    }
    return '';
  };

  const [avatarPreview, setAvatarPreview] = useState(getUserAvatar());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen es muy grande. Máximo 5MB');
      return;
    }

    setAvatarFile(file);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Transformar formData al formato del modelo UserV2
      const updateData = {
        nombres: {
          primero: formData.nombre,
          segundo: user?.nombres?.segundo || ''
        },
        apellidos: {
          primero: formData.apellido,
          segundo: user?.apellidos?.segundo || ''
        },
        social: {
          biografia: formData.biografia
        },
        personal: {
          celular: formData.telefono,
          fechaNacimiento: formData.fechaNacimiento || undefined,
          ubicacion: {
            ciudad: formData.ciudad,
            pais: formData.pais
          }
        }
      };

      // Actualizar perfil
      const profileResponse = await userService.updateProfile(updateData);
      let updatedUser = profileResponse.data;

      // Si hay un avatar nuevo, subirlo
      if (avatarFile) {
        const avatarResponse = await userService.uploadAvatar(avatarFile);
        console.log('🖼️ Respuesta del servidor al subir avatar:', avatarResponse);
        console.log('🖼️ Avatar URL recibida:', avatarResponse.data?.avatar || avatarResponse.avatar);

        // Combinar los datos del perfil con el avatar actualizado
        updatedUser = {
          ...updatedUser,
          social: {
            ...updatedUser.social,
            fotoPerfil: avatarResponse.data?.avatar || avatarResponse.avatar
          }
        };
      }

      setSuccess('Perfil actualizado exitosamente');

      // Notificar al padre con los datos actualizados incluyendo el avatar
      console.log('👤 Usuario actualizado que se envía al padre:', updatedUser);
      console.log('👤 Avatar en usuario actualizado:', updatedUser.social?.fotoPerfil);
      if (onUpdate) {
        onUpdate(updatedUser);
      }

      // Cerrar modal después de 1 segundo
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      logger.error('Error al actualizar perfil:', err);
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-800">

        {/* Header Profesional */}
        <div className="px-6 h-16 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Editar Perfil</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-8">

            {/* Sección Avatar - Centrada */}
            <div className="flex flex-col items-center pb-4">
              <div className="relative group">
                <img
                  src={avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(`${user?.nombres?.primero} ${user?.apellidos?.primero}`)}&background=3b82f6&color=fff&size=128`}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl transition-transform group-hover:scale-105"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-2.5 rounded-full shadow-lg cursor-pointer transform translate-x-1 translate-y-1 hover:bg-blue-600 active:scale-95 transition-all border-4 border-white dark:border-gray-800"
                >
                  <Camera size={20} />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <p className="text-sm text-gray-500 font-medium mt-4">Toca el icono para cambiar tu foto</p>
            </div>

            {/* Alertas */}
            {(error || success) && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 text-green-600 dark:text-green-400 p-4 rounded-xl text-sm font-medium">
                    {success}
                  </div>
                )}
              </div>
            )}

            {/* Grid de Campos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                  placeholder="Ej: Nahuel"
                  required
                />
              </div>

              {/* Apellido */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                  placeholder="Ej: Jimenez"
                  required
                />
              </div>

              {/* Biografía - Full Width */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Biografía</label>
                <textarea
                  name="biografia"
                  value={formData.biografia}
                  onChange={handleChange}
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100 resize-none"
                  placeholder="Cuéntanos un poco sobre ti..."
                />
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                  placeholder="+54 11 1234-5678"
                />
              </div>

              {/* Ciudad */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Ciudad</label>
                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                  placeholder="Buenos Aires"
                />
              </div>

              {/* País */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">País</label>
                <input
                  type="text"
                  name="pais"
                  value={formData.pais}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                  placeholder="Argentina"
                />
              </div>

              {/* Fecha de Nacimiento */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Fecha Nac.</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer con botones */}
        <div className="px-6 py-6 border-t border-gray-100 dark:border-gray-800 flex gap-4 bg-gray-50 dark:bg-gray-900/50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all font-semibold active:scale-95"
          >
            Cancelar
          </button>
          <button
            form="edit-profile-form"
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center gap-2 active:scale-95"
          >
            {loading ? <Loader size={20} className="animate-spin" /> : <Save size={20} />}
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;



