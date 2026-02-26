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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#F2F2F7] dark:bg-[#1C1C1E] w-full sm:max-w-lg sm:rounded-[20px] shadow-2xl flex flex-col h-full sm:h-auto max-h-[100vh] sm:max-h-[85vh] overflow-hidden">

        {/* Header Estilo iOS */}
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md px-4 h-14 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
          <button
            onClick={onClose}
            className="text-[#007AFF] text-lg font-normal hover:opacity-70 transition"
          >
            Cancelar
          </button>
          <h2 className="text-lg font-semibold text-black dark:text-white">Editar Perfil</h2>
          <button
            form="edit-profile-form"
            type="submit"
            disabled={loading}
            className="text-[#007AFF] text-lg font-semibold hover:opacity-70 disabled:opacity-30 transition flex items-center gap-1"
          >
            {loading ? <Loader size={18} className="animate-spin" /> : 'Listo'}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-8">
          <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-8 py-6">

            {/* Sección Avatar */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <img
                  src={avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(`${user?.nombres?.primero} ${user?.apellidos?.primero}`)}&background=3b82f6&color=fff&size=128`}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-md transition-transform group-hover:scale-105"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-[#007AFF] text-white p-2 rounded-full shadow-lg cursor-pointer transform translate-x-1 translate-y-1 hover:scale-110 active:scale-95 transition-all"
                >
                  <Camera size={16} />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-[#007AFF] font-medium mt-3 uppercase tracking-wider">Cambiar foto de perfil</p>
            </div>

            {/* Alertas */}
            {(error || success) && (
              <div className="px-4">
                {error && (
                  <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-medium text-center animate-in slide-in-from-top-2">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-xl text-sm font-medium text-center animate-in slide-in-from-top-2">
                    {success}
                  </div>
                )}
              </div>
            )}

            {/* Grupo: Información Personal */}
            <div className="space-y-1">
              <p className="px-8 text-[13px] text-gray-500 dark:text-gray-400 uppercase font-normal tracking-wide pb-1">INFORMACIÓN PERSONAL</p>
              <div className="bg-white dark:bg-[#2C2C2E] border-y border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="flex items-center px-4 h-12 border-b border-gray-200 dark:border-gray-800">
                  <span className="w-24 text-[17px] text-gray-900 dark:text-gray-100">Nombre</span>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="flex-1 h-full bg-transparent text-[17px] outline-none text-gray-600 dark:text-gray-400 text-right"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div className="flex items-center px-4 h-12 border-b border-gray-200 dark:border-gray-800">
                  <span className="w-24 text-[17px] text-gray-900 dark:text-gray-100">Apellido</span>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="flex-1 h-full bg-transparent text-[17px] outline-none text-gray-600 dark:text-gray-400 text-right"
                    placeholder="Tu apellido"
                    required
                  />
                </div>
                <div className="flex items-start px-4 py-3 min-h-[48px]">
                  <span className="w-24 text-[17px] text-gray-900 dark:text-gray-100 mt-1">Biografía</span>
                  <textarea
                    name="biografia"
                    value={formData.biografia}
                    onChange={handleChange}
                    rows={3}
                    maxLength={500}
                    className="flex-1 bg-transparent text-[17px] outline-none text-gray-600 dark:text-gray-400 text-right resize-none"
                    placeholder="Cuéntanos sobre ti..."
                  />
                </div>
              </div>
            </div>

            {/* Grupo: Contacto y Ubicación */}
            <div className="space-y-1">
              <p className="px-8 text-[13px] text-gray-500 dark:text-gray-400 uppercase font-normal tracking-wide pb-1">CONTACTO Y UBICACIÓN</p>
              <div className="bg-white dark:bg-[#2C2C2E] border-y border-gray-200 dark:border-gray-800">
                <div className="flex items-center px-4 h-12 border-b border-gray-200 dark:border-gray-800">
                  <span className="w-24 text-[17px] text-gray-900 dark:text-gray-100">Teléfono</span>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="flex-1 h-full bg-transparent text-[17px] outline-none text-gray-600 dark:text-gray-400 text-right"
                    placeholder="+54 11 1234-5678"
                  />
                </div>
                <div className="flex items-center px-4 h-12 border-b border-gray-200 dark:border-gray-800">
                  <span className="w-24 text-[17px] text-gray-900 dark:text-gray-100">Ciudad</span>
                  <input
                    type="text"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    className="flex-1 h-full bg-transparent text-[17px] outline-none text-gray-600 dark:text-gray-400 text-right"
                    placeholder="Ciudad"
                  />
                </div>
                <div className="flex items-center px-4 h-12 border-b border-gray-200 dark:border-gray-800">
                  <span className="w-24 text-[17px] text-gray-900 dark:text-gray-100">País</span>
                  <input
                    type="text"
                    name="pais"
                    value={formData.pais}
                    onChange={handleChange}
                    className="flex-1 h-full bg-transparent text-[17px] outline-none text-gray-600 dark:text-gray-400 text-right"
                    placeholder="País"
                  />
                </div>
                <div className="flex items-center px-4 h-12">
                  <span className="flex-1 text-[17px] text-gray-900 dark:text-gray-100">Fecha Nac.</span>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                    className="bg-transparent text-[17px] outline-none text-[#007AFF] text-right appearance-none"
                  />
                </div>
              </div>
            </div>

            {/* Nota de pie estilo iOS */}
            <p className="px-8 text-[13px] text-gray-500 dark:text-gray-400 leading-tight">
              Toda la información proporcionada podrá ser visible por otros usuarios según tu configuración de privacidad.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;



