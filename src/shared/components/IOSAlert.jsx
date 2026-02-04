import React from 'react';

const IOSAlert = ({
    isOpen,
    title = "Acceso Restringido",
    message = "No puedes ver el contenido de este grupo sin ser miembro.",
    onJoin,
    onCancel,
    isJoining = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop con blur */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onCancel}
            />

            {/* Alerta estilo iOS */}
            <div className="relative w-full max-w-xs bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in-95 duration-200">

                {/* Contenido */}
                <div className="p-6 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">
                            lock
                        </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 leading-tight">
                        {title}
                    </h3>

                    <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Botones de acción (Vertical stack like iOS) */}
                <div className="flex flex-col border-t border-gray-200 dark:border-gray-700/50">
                    <button
                        onClick={onJoin}
                        disabled={isJoining}
                        className="w-full py-3.5 text-[17px] text-blue-600 dark:text-blue-400 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700/30 active:bg-gray-100 dark:active:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isJoining ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                                Uniendo...
                            </>
                        ) : (
                            'Unirse al Grupo'
                        )}
                    </button>

                    <div className="border-t border-gray-200 dark:border-gray-700/50">
                        <button
                            onClick={onCancel}
                            className="w-full py-3.5 text-[17px] text-gray-500 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-700/30 active:bg-gray-100 dark:active:bg-gray-700/50 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IOSAlert;
