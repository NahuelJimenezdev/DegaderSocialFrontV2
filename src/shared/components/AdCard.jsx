import React, { useEffect, useRef, useState } from 'react';
import { logger } from '../utils/logger';
import { ExternalLink } from 'lucide-react';
import api from '../../api/config';

/**
 * Componente AdCard
 * Muestra un anuncio individual con tracking automático de impresiones y clicks
 */
const AdCard = ({ ad }) => {
  const [impresionRegistrada, setImpresionRegistrada] = useState(false);
  const cardRef = useRef(null);

  // Detectar información del dispositivo
  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let dispositivo = 'desktop';

    if (/mobile/i.test(ua)) {
      dispositivo = 'mobile';
    } else if (/tablet|ipad/i.test(ua)) {
      dispositivo = 'tablet';
    }

    return {
      dispositivo,
      navegador: navigator.userAgent,
      sistemaOperativo: navigator.platform,
      paginaOrigen: window.location.href
    };
  };

  // PIXEL DE IMPRESIÓN: Usar Intersection Observer para detectar cuando el anuncio es visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !impresionRegistrada) {
          registrarImpresion();
          setImpresionRegistrada(true);
        }
      },
      { threshold: 0.5 } // Se dispara cuando el 50% del anuncio es visible
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [ad._id, impresionRegistrada]);

  // Registrar impresión en el backend
  const registrarImpresion = async () => {
    try {
      const deviceInfo = getDeviceInfo();
      await api.post(`/ads/impression/${ad._id}`, deviceInfo);
      logger.log(`✅ Impresión registrada para anuncio: ${ad._id}`);
    } catch (error) {
      logger.error('❌ Error registrando impresión:', error);
    }
  };

  // Registrar click y abrir enlace
  const handleClick = async () => {
    try {
      // 1. Registrar click en el backend
      const deviceInfo = getDeviceInfo();
      await api.post(`/ads/click/${ad._id}`, deviceInfo);
      logger.log(`✅ Click registrado para anuncio: ${ad._id}`);
    } catch (error) {
      logger.error('❌ Error registrando click:', error);
    }

    // 2. Abrir enlace en nueva pestaña
    window.open(ad.linkDestino, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      ref={cardRef}
      className="ad-card group relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700"
      onClick={handleClick}
    >
      {/* Badge de "Publicidad" */}
      <div className="absolute top-2 left-2 z-10">
        <span className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide bg-gray-900/80 dark:bg-gray-100/90 text-white dark:text-gray-900 rounded-md backdrop-blur-sm">
          Publicidad
        </span>
      </div>

      {/* Imagen del anuncio */}
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={ad.imagenUrl}
          alt={ad.textoAlternativo || ad.nombreCliente}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Anuncio';
          }}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Contenido del anuncio */}
      <div className="p-4">
        {/* Nombre del cliente */}
        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {ad.nombreCliente}
        </h4>

        {/* Call to Action */}
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          <span>{ad.callToAction || 'Ver más'}</span>
          <ExternalLink size={14} />
        </button>
      </div>

      {/* Indicador de hover */}
      <div className="absolute inset-0 border-2 border-indigo-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default AdCard;



