import React from 'react';
import { AlertTriangle, Info, XCircle, CheckCircle } from 'lucide-react';

/**
 * Componente reutilizable para diálogos de confirmación
 * 
 * @param {boolean} isOpen - Controla si el modal está visible
 * @param {function} onClose - Callback cuando se cierra el modal (botón cancelar o click fuera)
 * @param {function} onConfirm - Callback cuando se confirma la acción
 * @param {string} title - Título del modal
 * @param {string} message - Mensaje principal
 * @param {string} confirmText - Texto del botón de confirmación (default: "Confirmar")
 * @param {string} cancelText - Texto del botón de cancelar (default: "Cancelar")
 * @param {string} variant - Tipo de diálogo: 'danger', 'warning', 'info', 'success' (default: 'warning')
 * @param {boolean} isLoading - Muestra estado de carga en el botón de confirmar
 */
export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'warning',
    isLoading = false
}) {
    if (!isOpen) return null;

    // Configuración de colores y iconos según el variant
    const variants = {
        danger: {
            icon: XCircle,
            iconColor: 'text-red-600',
            buttonClass: 'bg-red-600 hover:bg-red-700',
            titleIcon: '⚠️'
        },
        warning: {
            icon: AlertTriangle,
            iconColor: 'text-yellow-600',
            buttonClass: 'bg-yellow-600 hover:bg-yellow-700',
            titleIcon: '⚠️'
        },
        info: {
            icon: Info,
            iconColor: 'text-blue-600',
            buttonClass: 'bg-blue-600 hover:bg-blue-700',
            titleIcon: 'ℹ️'
        },
        success: {
            icon: CheckCircle,
            iconColor: 'text-green-600',
            buttonClass: 'bg-green-600 hover:bg-green-700',
            titleIcon: '✓'
        }
    };

    const config = variants[variant] || variants.warning;
    const Icon = config.icon;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header con icono */}
                <div className="flex items-start gap-3 mb-4">
                    <Icon className={`w-6 h-6 ${config.iconColor} flex-shrink-0 mt-1`} />
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {config.titleIcon} {title}
                        </h3>
                    </div>
                </div>

                {/* Mensaje */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 ml-9">
                    {message}
                </p>

                {/* Botones */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${config.buttonClass}`}
                    >
                        {isLoading ? 'Procesando...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
