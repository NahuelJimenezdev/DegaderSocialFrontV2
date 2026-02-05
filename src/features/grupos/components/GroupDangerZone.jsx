/**
 * Componente para la zona de peligro (eliminar/abandonar grupo)
 */
const GroupDangerZone = ({ isOwner, loading, handleLeaveGroup, handleDeleteGroup }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border-2 border-red-200 dark:border-red-900">
            <div className="bg-gradient-to-r from-red-500 to-rose-500 p-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2" style={{ color: '#ffffff' }}>
                    <span className="material-symbols-outlined" style={{ color: '#ffffff' }}>warning</span>
                    Zona de Peligro
                </h3>
            </div>
            <div className="p-6 space-y-4">
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-orange-600 dark:text-orange-400">
                            logout
                        </span>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Abandonar Grupo</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {isOwner
                                    ? "Como propietario, deberás transferir la propiedad antes de salir."
                                    : "Dejarás de ser miembro de este grupo y perderás acceso a todo el contenido."}
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
    );
};

export default GroupDangerZone;
