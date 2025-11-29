import { useState } from 'react';
import { X, Camera, Save } from 'lucide-react';
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
      if (user.social.fotoPerfil.startsWith('/')) return `http://localhost:3001${user.social.fotoPerfil}`;
      // Si no tiene protocolo ni barra inicial, agregar ambos
      return `http://localhost:3001/${user.social.fotoPerfil}`;
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
      if (onUpdate) {
        onUpdate(updatedUser);
      }

      // Cerrar modal después de 1 segundo
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Editar Perfil</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Alerts */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(`${user?.nombres?.primero} ${user?.apellidos?.primero}`)}&background=3b82f6&color=fff&size=128`}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition cursor-pointer"
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
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Haz clic en el ícono para cambiar tu foto de perfil
            </p>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              required
            />
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Apellido
            </label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              required
            />
          </div>

          {/* Biografía */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Biografía
            </label>
            <textarea
              name="biografia"
              value={formData.biografia}
              onChange={handleChange}
              rows={4}
              maxLength={500}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition resize-none"
              placeholder="Cuéntanos sobre ti..."
            />
            <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formData.biografia.length}/500
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              placeholder="+54 11 1234-5678"
            />
          </div>

          {/* Ubicación */}
          <div className="grid grid-cols-2 gap-4">
            {/* Ciudad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ciudad
              </label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                placeholder="Buenos Aires"
              />
            </div>

            {/* País */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                País
              </label>
              <input
                type="text"
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
                placeholder="Argentina"
              />
            </div>
          </div>

          {/* Fecha de Nacimiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
