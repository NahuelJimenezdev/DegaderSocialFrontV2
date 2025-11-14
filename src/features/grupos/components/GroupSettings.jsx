import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import groupService from '../../../api/groupService';

const GroupSettings = ({ groupData, refetch, isAdmin, isOwner }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    nombre: groupData?.nombre || '',
    descripcion: groupData?.descripcion || '',
    tipo: groupData?.tipo || 'normal'
  });

  // Solo owners y admins pueden acceder
  if (!isAdmin && !isOwner) {
    return (
      <div className="h-full overflow-auto p-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-red-500 dark:text-red-400">
            block
          </span>
          <p className="text-red-800 dark:text-red-200 mt-4 font-medium">
            No tienes permisos para acceder a la configuración del grupo
          </p>
          <p className="text-sm text-red-600 dark:text-red-300 mt-2">
            Solo los administradores y propietarios pueden modificar la configuración
          </p>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Actualizar datos del grupo
      await groupService.updateGroup(groupData._id, formData);

      // Actualizar imagen si se seleccionó una nueva
      if (imageFile) {
        await groupService.uploadGroupAvatar(groupData._id, imageFile);
      }

      await refetch();
      setEditMode(false);
      setImageFile(null);
      setImagePreview(null);
      alert('Grupo actualizado exitosamente');
    } catch (err) {
      console.error('Error updating group:', err);
      alert('Error al actualizar el grupo');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar la imagen del grupo?')) {
      try {
        setLoading(true);
        await groupService.deleteGroupAvatar(groupData._id);
        await refetch();
        alert('Imagen eliminada exitosamente');
      } catch (err) {
        console.error('Error deleting avatar:', err);
        alert('Error al eliminar la imagen');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteGroup = async () => {
    if (!isOwner) {
      alert('Solo el propietario puede eliminar el grupo');
      return;
    }

    const confirmation = window.prompt(
      `Esta acción es irreversible. Para confirmar, escribe el nombre del grupo: "${groupData.nombre}"`
    );

    if (confirmation === groupData.nombre) {
      try {
        setLoading(true);
        await groupService.deleteGroup(groupData._id);
        alert('Grupo eliminado exitosamente');
        navigate('/Mis_grupos');
      } catch (err) {
        console.error('Error deleting group:', err);
        alert('Error al eliminar el grupo');
      } finally {
        setLoading(false);
      }
    } else if (confirmation !== null) {
      alert('El nombre no coincide. Operación cancelada.');
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setFormData({
      nombre: groupData?.nombre || '',
      descripcion: groupData?.descripcion || '',
      tipo: groupData?.tipo || 'normal'
    });
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 scrollbar-thin">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Configuración del Grupo</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Administra la información y configuración del grupo
        </p>
      </div>

        {/* Editar Información */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined">edit</span>
              Información del Grupo
            </h3>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
                <span>Editar</span>
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Imagen del grupo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Imagen del Grupo
            </label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 overflow-hidden flex-shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : groupData?.imagePerfilGroup ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${groupData.imagePerfilGroup}`}
                    alt={groupData.nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-6xl">groups</span>
                  </div>
                )}
              </div>

              {editMode && (
                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-600 dark:text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100
                      dark:file:bg-indigo-900/30 dark:file:text-indigo-400"
                  />
                  {groupData?.imagePerfilGroup && (
                    <button
                      type="button"
                      onClick={handleDeleteAvatar}
                      disabled={loading}
                      className="text-sm text-red-600 dark:text-red-400 hover:underline disabled:opacity-50"
                    >
                      Eliminar imagen actual
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Nombre del Grupo
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              disabled={!editMode || loading}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-60"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              disabled={!editMode || loading}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-60"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Grupo
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              disabled={!editMode || loading}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-60"
            >
              <option value="normal">Grupo Normal</option>
              <option value="fundacion">Fundación</option>
              <option value="iglesia">Iglesia</option>
            </select>
          </div>

          {/* Botones de acción */}
          {editMode && (
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">save</span>
                <span>Guardar Cambios</span>
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">close</span>
                <span>Cancelar</span>
              </button>
            </div>
            )}
          </form>
        </div>

        {/* Zona de Peligro (Solo Owner) */}
        {isOwner && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border-2 border-red-200 dark:border-red-800">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined">warning</span>
              Zona de Peligro
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Eliminar Grupo
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Esta acción es irreversible. Se eliminarán todos los mensajes, archivos y miembros del grupo.
                </p>
                <button
                  onClick={handleDeleteGroup}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-lg">delete_forever</span>
                  <span>Eliminar Grupo Permanentemente</span>
                </button>
              </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupSettings;
