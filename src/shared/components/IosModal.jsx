import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

/**
 * Un componente de modal con estética iOS (vidrio, bordes redondeados, suavidad)
 */
const IosModal = ({ isOpen, onClose, title, children }) => {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [animationState, setAnimationState] = useState('hidden'); // hidden, entry, visible, exit

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            // Pequeño delay para disparar la animación
            setTimeout(() => setAnimationState('entry'), 10);
            setTimeout(() => setAnimationState('visible'), 50);
        } else {
            setAnimationState('exit');
            const timer = setTimeout(() => {
                setShouldRender(false);
                setAnimationState('hidden');
            }, 300); // Duración de la animación de salida
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Bloquear scroll del body cuando está abierto
    useEffect(() => {
        if (!shouldRender) return;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [shouldRender]);

    if (!shouldRender) return null;

    const backdropStyles = {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: animationState === 'visible' ? 1 : 0,
    };

    const modalStyles = {
        backgroundColor: 'rgba(255, 255, 255, 0.85)', // Estilo glassmorphism iOS
        backdropFilter: 'saturate(180%) blur(20px)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        transition: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms',
        transform: animationState === 'visible' ? 'scale(1)' : 'scale(0.9)',
        opacity: animationState === 'visible' ? 1 : 0,
        display: 'flex',
        flexDirection: 'column',
    };

    const headerStyles = {
        padding: '16px 20px',
        borderBottom: '0.5px solid rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    return (
        <div style={backdropStyles} onClick={onClose}>
            <div 
                style={modalStyles} 
                className="dark:bg-gray-800/90 dark:backdrop-blur-xl" 
                onClick={e => e.stopPropagation()}
            >
                <div style={headerStyles}>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                    <button 
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default IosModal;
