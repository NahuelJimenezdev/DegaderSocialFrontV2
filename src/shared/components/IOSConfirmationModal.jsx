import React from 'react';
import { createPortal } from 'react-dom';
import { Trash2, AlertCircle } from 'lucide-react';

/**
 * IOSConfirmationModal: Un modal de alerta con diseño premium estilo iOS
 * Utiliza Glassmorphism y la estética de botones en bloque de Apple.
 */
const IOSConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = 'Eliminar', 
    cancelText = 'Cancelar', 
    variant = 'danger' // 'danger' o 'info'
}) => {
    if (!isOpen) return null;

    // Colores según variante
    const primaryColor = variant === 'danger' ? '#ef4444' : '#007aff';
    const primaryBg = variant === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 122, 255, 0.1)';

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 animate-in fade-in duration-200">
            {/* Backdrop con Blur intenso */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-md" 
                onClick={onClose} 
            />

            {/* Contenedor Alerta iOS */}
            <div className="relative w-full max-w-[280px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-[18px] shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/30 transform animate-in zoom-in-95 duration-200">
                
                {/* Contenido Superior */}
                <div className="p-6 text-center">
                    <div className="flex justify-center mb-3">
                        <div style={{ backgroundColor: primaryBg, padding: '10px', borderRadius: '50%' }}>
                            {variant === 'danger' ? (
                                <Trash2 size={24} color={primaryColor} />
                            ) : (
                                <AlertCircle size={24} color={primaryColor} />
                            )}
                        </div>
                    </div>
                    
                    <h3 className="text-[17px] font-bold text-gray-900 dark:text-white leading-tight mb-1">
                        {title}
                    </h3>
                    <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed px-2">
                        {message}
                    </p>
                </div>

                {/* Zona de Botones Estilo Bloque iOS */}
                <div className="flex flex-col border-t border-gray-200/50 dark:border-gray-700/50">
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="w-full py-3.5 text-[17px] font-semibold active:bg-black/5 dark:active:bg-white/5 transition-colors"
                        style={{ color: primaryColor }}
                    >
                        {confirmText}
                    </button>
                    
                    <div className="h-[0.5px] w-full bg-gray-200/50 dark:border-gray-700/50" />
                    
                    <button
                        onClick={onClose}
                        className="w-full py-3.5 text-[17px] font-medium text-gray-500 dark:text-gray-400 active:bg-black/5 dark:active:bg-white/5 transition-colors"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default IOSConfirmationModal;
