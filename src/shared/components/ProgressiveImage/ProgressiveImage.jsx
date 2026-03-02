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
    medium,
    large,
    blurHash,
    alt = "",
    className = "",
    containerClass = "",
    aspectRatio = "auto",
    style = {}
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const containerRef = useRef(null);

    // IntersectionObserver logic remains the same...
    useEffect(() => {
        const currentRef = containerRef.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px', threshold: 0.01 }
        );
        if (currentRef) observer.observe(currentRef);
        return () => {
            if (currentRef) observer.unobserve(currentRef);
            observer.disconnect();
        };
    }, []);

    // Construir srcset si existen versiones optimizadas
    const srcSet = [
        medium && `${medium} 600w`,
        large && `${large} 1200w`
    ].filter(Boolean).join(', ');

    return (
        <div
            className={`progressive-image-wrapper ${containerClass}`}
            style={{ aspectRatio, ...style }}
            ref={containerRef}
        >
            {/* 1. Imagen Borrosa (Placeholder base64) */}
            {blurHash && (
                <img
                    src={blurHash}
                    alt=""
                    className="progressive-image-blur"
                    aria-hidden="true"
                />
            )}

            {/* 2. Imagen Real con Responsive Support */}
            {isInView && src && (
                <img
                    src={src}
                    srcSet={srcSet || undefined}
                    sizes={srcSet ? "(max-width: 600px) 600px, (max-width: 1200px) 1200px, 1200px" : undefined}
                    alt={alt}
                    className={`progressive-image-real ${isLoaded ? 'is-loaded' : ''} ${className}`}
                    onLoad={() => setIsLoaded(true)}
                    loading="lazy"
                />
            )}
        </div>
    );
};

export default ProgressiveImage;
