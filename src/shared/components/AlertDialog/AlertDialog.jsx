import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

/**
 * Componente reutilizable para diálogos de alerta (reemplazo de window.alert)
 * 
 * @param {boolean} isOpen - Controla si el modal está visible
 * @param {function} onClose - Callback cuando se cierra el modal
 * @param {string} title - Título del modal (opcional)
 * @param {string} message - Mensaje principal
 * @param {string} variant - Tipo de alerta: 'error', 'success', 'warning', 'info' (default: 'info')
 * @param {string} buttonText - Texto del botón (default: "Aceptar")
 */
export function AlertDialog({
    isOpen,
    onClose,
    title,
    message,
    variant = 'info',
    buttonText = 'Aceptar'
}) {
    if (!isOpen) return null;

    // Configuración de colores y iconos según el variant
    const variants = {
        error: {
            icon: XCircle,
            iconColor: 'text-red-600',
            bgColor: 'bg-red-50 dark:bg-red-900/20',
            borderColor: 'border-red-200 dark:border-red-800',
            buttonClass: 'bg-red-600 hover:bg-red-700',
            titleIcon: '❌',
            defaultTitle: 'Error'
        },
        success: {
            icon: CheckCircle,
            iconColor: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            borderColor: 'border-green-200 dark:border-green-800',
            buttonClass: 'bg-green-600 hover:bg-green-700',
            titleIcon: '✅',
            defaultTitle: 'Éxito'
        },
        warning: {
            icon: AlertCircle,
            iconColor: 'text-yellow-600',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
            borderColor: 'border-yellow-200 dark:border-yellow-800',
            buttonClass: 'bg-yellow-600 hover:bg-yellow-700',
            titleIcon: '⚠️',
            defaultTitle: 'Advertencia'
        },
        info: {
            icon: Info,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            borderColor: 'border-blue-200 dark:border-blue-800',
            buttonClass: 'bg-blue-600 hover:bg-blue-700',
            titleIcon: 'ℹ️',
            defaultTitle: 'Información'
        }
    };

    const config = variants[variant] || variants.info;
    const Icon = config.icon;
    const displayTitle = title || config.defaultTitle;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header con icono y botón cerrar */}
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${config.bgColor} ${config.borderColor} border`}>
                            <Icon className={`w-5 h-5 ${config.iconColor}`} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {config.titleIcon} {displayTitle}
                            </h3>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Mensaje */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 ml-11 whitespace-pre-line">
                    {message}
                </p>

                {/* Botón */}
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className={`px-6 py-2 text-white rounded-lg transition-colors ${config.buttonClass}`}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
}
