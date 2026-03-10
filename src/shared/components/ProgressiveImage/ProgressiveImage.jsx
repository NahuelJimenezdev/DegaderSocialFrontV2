import React, { useState, useEffect, useRef } from 'react';
import './ProgressiveImage.css';
import { getAvatarUrl } from '../../utils/avatarUtils';

/**
 * Componente ProgressiveImage
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
    noBackground = false,
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
        medium && `${getAvatarUrl(medium)} 600w`,
        large && `${getAvatarUrl(large)} 1200w`
    ].filter(Boolean).join(', ');

    return (
        <div
            className={`progressive-image-wrapper ${noBackground ? 'no-bg' : ''} ${containerClass} ${className}`}
            style={{ aspectRatio, ...style }}
            ref={containerRef}
            data-aspect-auto={aspectRatio === 'auto'}
        >
            {/* 1. Imagen Borrosa (Placeholder base64) */}
            {blurHash && (
                <img
                    src={blurHash}
                    alt=""
                    className="progressive-image-blur w-full h-full"
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
                    className={`progressive-image-real w-full h-full ${isLoaded ? 'is-loaded' : ''}`}
                    onLoad={() => setIsLoaded(true)}
                    loading="lazy"
                />
            )}
        </div>
    );
};

export default ProgressiveImage;
