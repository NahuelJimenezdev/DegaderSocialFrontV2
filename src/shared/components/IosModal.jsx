import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

/**
 * Un componente de modal con estética iOS (vidrio, bordes redondeados, suavidad)
 */
const IosModal = ({ isOpen, onClose, title, children }) => {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [animationState, setAnimationState] = useState('hidden'); // hidden, entry, visible, exit

    // Efecto 1: Manejar estados de renderizado y animación
    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            const t1 = setTimeout(() => setAnimationState('entry'), 10);
            const t2 = setTimeout(() => setAnimationState('visible'), 50);
            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
            };
        } else {
            setAnimationState('exit');
            const timer = setTimeout(() => {
                setShouldRender(false);
                setAnimationState('hidden');
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Efecto 2: Bloquear scroll del body (Siempre declarado, ejecución condicional interna)
    useEffect(() => {
        if (shouldRender) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'unset';
            };
        }
        // No hay cleanup necesario si no se aplicó el estilo
        return undefined;
    }, [shouldRender]);

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
        visibility: shouldRender ? 'visible' : 'hidden',
        pointerEvents: isOpen ? 'all' : 'none',
    };

    const modalStyles = {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
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

    // Retorno condicional desplazado al final para no violar las reglas de hooks
    if (!shouldRender && animationState === 'hidden') return null;

    return (
        <div style={backdropStyles} onClick={onClose}>
            <div 
                style={modalStyles} 
                onClick={e => e.stopPropagation()}
            >
                <div style={headerStyles}>
                    <h3 style={{ color: '#111827', fontSize: '1.125rem', fontWeight: 700 }}>{title}</h3>
                    <button 
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>
                <div className="p-6" style={{ color: '#1f2937' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default IosModal;
