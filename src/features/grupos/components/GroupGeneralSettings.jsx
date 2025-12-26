import { API_BASE_URL } from '../../../shared/config/env';

/**
 * Componente para mostrar/editar información general del grupo
 */
const GroupGeneralSettings = ({
    groupData,
    editMode,
    formData,
    imagePreview,
    imageError,
    loading,
    handleChange,
    handleImageChange,
    handleDeleteAvatar,
    handleSubmit,
    cancelEdit,
    setEditMode,
    setImageError
}) => {
    return (
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
                        {/* Imagen */}
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

                        {/* Info */}
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
    );
};

export default GroupGeneralSettings;
