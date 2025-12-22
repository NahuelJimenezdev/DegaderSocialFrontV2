import { Save, AlertCircle, Loader, Camera } from 'lucide-react';
import { API_BASE_URL } from '../../../shared/config/env';
import { useState } from 'react';
import { logger } from '../../../shared/utils/logger';
import { useNavigate } from 'react-router-dom';
import groupService from '../../../api/groupService';
import { AlertDialog } from '../../../shared/components/AlertDialog';

const GroupSettings = ({ groupData, refetch, user, userRole, isAdmin, isOwner }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, variant: 'info', message: '' });

  const [formData, setFormData] = useState({
    nombre: groupData?.nombre || '',
    descripcion: groupData?.descripcion || '',
    tipo: groupData?.tipo || 'normal'
  });

  // Solo admins y owners pueden acceder
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
      setAlertConfig({ isOpen: true, variant: 'success', message: 'Grupo actualizado exitosamente' });
    } catch (err) {
      logger.error('Error updating group:', err);
      setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al actualizar el grupo' });
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
        setAlertConfig({ isOpen: true, variant: 'success', message: 'Imagen eliminada exitosamente' });
      } catch (err) {
        logger.error('Error deleting avatar:', err);
        setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al eliminar la imagen' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteGroup = async () => {
    if (!isOwner) {
      setAlertConfig({ isOpen: true, variant: 'warning', message: 'Solo el propietario puede eliminar el grupo' });
      return;
    }

    const confirmation = window.prompt(
      `Esta acción es irreversible. Para confirmar, escribe el nombre del grupo: "${groupData.nombre}"`
    );

    if (confirmation === groupData.nombre) {
      try {
        setLoading(true);
        await groupService.deleteGroup(groupData._id);
        setAlertConfig({ isOpen: true, variant: 'success', message: 'Grupo eliminado exitosamente' });
        navigate('/Mis_grupos');
      } catch (err) {
        logger.error('Error deleting group:', err);
        setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al eliminar el grupo' });
      } finally {
        setLoading(false);
      }
    } else if (confirmation !== null) {
      setAlertConfig({ isOpen: true, variant: 'warning', message: 'El nombre no coincide. Operación cancelada.' });
    }
  };

  const handleLeaveGroup = async () => {
    if (isOwner) {
      setAlertConfig({ isOpen: true, variant: 'warning', message: 'El propietario no puede abandonar el grupo. Debes transferir la propiedad primero.' });
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres abandonar este grupo?')) {
      try {
        setLoading(true);
        await groupService.leaveGroup(groupData._id);
        navigate('/Mis_grupos');
      } catch (err) {
        logger.error('Error leaving group:', err);
        setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al abandonar el grupo' });
      } finally {
        setLoading(false);
      }
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

        {/* Información del Grupo */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined">info</span>
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

          <div className="p-6">
            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Imagen del grupo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Imagen del Grupo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : groupData?.imagePerfilGroup && !imageError ? (
                        <img
                          src={`${API_BASE_URL}${groupData.imagePerfilGroup}`}
                          alt={groupData.nombre}
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-6xl">groups</span>
                        </div>
                      )}
                    </div>

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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-60"
                  >
                    <option value="normal">Grupo Normal</option>
                    <option value="fundacion">Fundación</option>
                    <option value="iglesia">Iglesia</option>
                  </select>
                </div>

                {/* Botones de acción */}
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
              </form>
            ) : (
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                {/* Imagen - Centrada en móvil, izquierda en desktop */}
                <div className="w-full md:w-auto flex justify-center md:block flex-shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 overflow-hidden shadow-md ring-4 ring-white dark:ring-gray-700 flex items-center justify-center">
                    {groupData?.imagePerfilGroup && !imageError ? (
                      <img
                        src={`${API_BASE_URL}${groupData.imagePerfilGroup}`}
                        alt={groupData.nombre}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <span className="material-symbols-outlined text-white text-6xl">groups</span>
                    )}
                  </div>
                </div>

                {/* Info - Grid en desktop */}
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Nombre del Grupo</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white break-words">{groupData?.nombre}</p>
                  </div>

                  <div className="md:col-span-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Descripción</p>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {groupData?.descripcion || <span className="italic text-gray-400">Sin descripción</span>}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Tipo de Grupo</p>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">
                        {groupData?.tipo === 'privado' ? 'lock' : groupData?.tipo === 'secreto' ? 'visibility_off' : 'public'}
                      </span>
                      <p className="text-gray-900 dark:text-white font-medium capitalize">{groupData?.tipo}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Categoría</p>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">category</span>
                      <p className="text-gray-900 dark:text-white font-medium capitalize">{groupData?.categoria || 'General'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Permisos y Roles */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined">admin_panel_settings</span>
              Permisos y Roles
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Permitir que miembros inviten a otros</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Los miembros regulares pueden enviar invitaciones</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Aprobar nuevos miembros</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Requiere aprobación de admin para unirse</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={groupData?.tipo !== 'publico'} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined">notifications</span>
              Notificaciones
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Notificar nuevos mensajes</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Recibe notificaciones de mensajes nuevos</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Notificar nuevos miembros</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Recibe notificaciones cuando alguien se une</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Zona de Peligro */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border-2 border-red-200 dark:border-red-900">
          <div className="bg-gradient-to-r from-red-500 to-rose-500 p-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined">warning</span>
              Zona de Peligro
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {!isOwner && (
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-orange-600 dark:text-orange-400">
                    logout
                  </span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Abandonar Grupo</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Dejarás de ser miembro de este grupo y perderás acceso a todo el contenido.
                    </p>
                    <button
                      onClick={handleLeaveGroup}
                      disabled={loading}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                    >
                      Abandonar Grupo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isOwner && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400">
                    delete_forever
                  </span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Eliminar Grupo</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Esta acción es permanente y no se puede deshacer. Todos los mensajes, archivos y miembros se perderán.
                    </p>
                    <button
                      onClick={handleDeleteGroup}
                      disabled={loading}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      Eliminar Grupo Permanentemente
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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

export default GroupSettings;



