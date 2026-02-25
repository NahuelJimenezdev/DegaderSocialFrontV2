import React from 'react';

const FounderWelcomeModal = ({ onNext }) => {
    const founderName = "Degader Social (Founder)";
    // Usamos el color base del usuario para el fondo del ícono o detalles
    const userBaseColor = "#1e3a5f";
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(founderName)}&background=1e3a5f&color=fff&size=128`;

    const message = `Como fundador, quiero darte la bienvenida a este espacio que soñamos y hoy empieza a ser realidad 🙌✨

Creamos esta red para conectar personas, ideas y valores que suman 🤝💡

Acá cada aporte cuenta y cada voz tiene lugar 💬❤️

Gracias por ser parte desde el inicio, lo mejor se construye juntos 🚀🔥`;

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
            {/* Backdrop con blur profundo */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-md transition-opacity"
                onClick={onNext}
            />

            {/* Alerta Minimalista estilo iOS */}
            <div className="relative w-full max-w-[400px] bg-white/90 dark:bg-gray-800/95 backdrop-blur-2xl rounded-[22px] shadow-2xl border border-white/40 dark:border-gray-700/50 overflow-hidden animate-in fade-in zoom-in-95 duration-300">

                {/* Contenido Central */}
                <div className="p-6 text-center">
                    {/* Avatar sutil con borde */}
                    <div className="relative mx-auto w-16 h-16 mb-4">
                        <img
                            src={avatarUrl}
                            alt={founderName}
                            className="w-full h-full rounded-full object-cover shadow-sm ring-2 ring-white dark:ring-gray-700"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 bg-[#1e3a5f] rounded-full p-0.5 border-2 border-white dark:border-gray-800">
                            <span className="material-symbols-outlined text-[10px] text-white">
                                check_circle
                            </span>
                        </div>
                    </div>

                    <h3 className="text-[17px] font-semibold text-gray-900 dark:text-white mb-1.5 leading-tight">
                        {founderName}
                    </h3>

                    <div className="text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed font-normal whitespace-pre-wrap">
                        {message}
                    </div>
                </div>

                {/* Botón de Acción Único (iOS Style) */}
                <div className="flex flex-col border-t border-gray-200/60 dark:border-gray-700/60">
                    <button
                        onClick={onNext}
                        className="w-full py-3.5 text-[17px] font-semibold text-[#1e3a5f] dark:text-blue-400 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 active:bg-gray-100 dark:active:bg-gray-700/50 transition-colors"
                    >
                        Empezar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FounderWelcomeModal;
