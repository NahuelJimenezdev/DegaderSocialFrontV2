import React, { useState, useEffect, useRef } from 'react';
import './ProgressiveImage.css';

/**
 * Componente ProgressiveImage
 * 
 * Implementa una carga estilo Facebook para evitar Cumulative Layout Shift (CLS)
 * y proveer una experiencia fluida al usuario.
 * 
 * @param {string} src - URL final de la imagen optimizada (medium/large).
 * @param {string} blurHash - Base64 ultra pequeño proveído por el backend.
 * @param {string} alt - Texto alternativo para accesibilidad.
 * @param {string} className - Clases CSS adicionales para la imagen.
 * @param {string} containerClass - Clases CSS para el contenedor de la imagen.
 * @param {string} aspectRatio - CSS aspect-ratio para reservar el espacio antes de cargar. (ej. "16/9", "1/1", "auto")
 */
const ProgressiveImage = ({
    src,
    blurHash,
    alt = "",
    className = "",
    containerClass = "",
    aspectRatio = "auto"
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef(null);
    const containerRef = useRef(null);

    // Usamos IntersectionObserver para una carga diferida (lazy loading) más controlada
    // Solo renderiza el <img> "real" cuando el contenedor se acerca a la pantalla.
    useEffect(() => {
        const currentRef = containerRef.current;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '200px', // Comienza a cargar 200px antes de que entre al viewport
                threshold: 0.01
            }
        );

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) observer.unobserve(currentRef);
            observer.disconnect();
        };
    }, []);

    return (
        <div
            className={`progressive-image-wrapper ${containerClass}`}
            style={{ aspectRatio }}
            ref={containerRef}
        >
            {/* 1. Imagen Borrosa (Placeholder base64) que carga inmediatamente sin petición HTTP */}
            {blurHash && (
                <img
                    src={blurHash}
                    alt="Cargando..."
                    className="progressive-image-blur"
                    aria-hidden="true"
                />
            )}

            {/* 2. Imagen Real - Solo se monta en el DOM cuando se acerca al Viewport */}
            {isInView && src && (
                <img
                    ref={imgRef}
                    src={src}
                    alt={alt}
                    className={`progressive-image-real ${isLoaded ? 'is-loaded' : ''} ${className}`}
                    onLoad={() => setIsLoaded(true)}
                />
            )}
        </div>
    );
};

export default ProgressiveImage;
