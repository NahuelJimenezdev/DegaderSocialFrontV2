import React from 'react';

const OnboardingModal = ({ onStart, onSkip }) => {
    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            {/* Backdrop con blur */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onSkip}
            />

            {/* Modal estilo iOS */}
            <div className="relative w-full max-w-sm bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="text-center">
                    {/* Ícono */}
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                        <span className="material-symbols-outlined text-3xl text-blue-600 dark:text-blue-400">
                            explore
                        </span>
                    </div>

                    {/* Título */}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        ¡Bienvenido a DegaderSocial!
                    </h3>

                    {/* Mensaje */}
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        ¿Querés un tour rápido para aprender a usar la plataforma? Te mostramos las funciones principales en menos de un minuto.
                    </p>

                    {/* Botones */}
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={onStart}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors"
                        >
                            Iniciar Tour
                        </button>
                        <button
                            onClick={onSkip}
                            className="w-full py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Más Tarde
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingModal;
