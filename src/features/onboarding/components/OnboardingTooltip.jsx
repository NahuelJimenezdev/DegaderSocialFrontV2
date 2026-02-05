import React from 'react';

const OnboardingTooltip = ({
    continuous,
    index,
    step,
    backProps,
    closeProps,
    primaryProps,
    tooltipProps,
    isLastStep,
    size
}) => {
    return (
        <div
            {...tooltipProps}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-5 max-w-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-4 relative"
            style={{ width: '380px', maxWidth: '100%' }}
        >
            {/* Header: Título */}
            {step.title && (
                <h3 className="text-lg font-bold text-gray-900 dark:text-white m-0">
                    {step.title}
                </h3>
            )}

            {/* Body: Contenido */}
            <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {step.content}
            </div>

            {/* Footer: Controles */}
            <div className="flex items-center justify-between mt-2 pt-2">
                {/* Contador de Pasos Traducido */}
                <div className="text-xs text-gray-400 font-medium">
                    Paso {index + 1} de {size}
                </div>

                <div className="flex items-center gap-2">
                    {/* Botón Atrás */}
                    {index > 0 && (
                        <button
                            {...backProps}
                            className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-3 py-1.5 transition-colors"
                        >
                            Atrás
                        </button>
                    )}

                    {/* Botón Siguiente / Finalizar */}
                    <button
                        {...primaryProps}
                        className="text-sm font-bold bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg shadow-sm transition-colors"
                    >
                        {isLastStep ? 'Finalizar' : 'Siguiente'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingTooltip;
