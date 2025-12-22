import React, { useState, useEffect } from 'react';
import { logger } from '../utils/logger';
import AdCard from './AdCard';
import api from '../../api/config';
import { Loader2, AlertCircle } from 'lucide-react';

/**
 * Componente AdsSidebar
 * Sidebar derecho que muestra anuncios personalizados para el usuario
 */
const AdsSidebar = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener ubicación del usuario (opcional)
  const getUserLocation = () => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          () => {
            // Si el usuario no da permiso, resolver sin ubicación
            resolve(null);
          }
        );
      } else {
        resolve(null);
      }
    });
  };

  // Cargar anuncios recomendados
  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        setError(null);

        // Intentar obtener ubicación (opcional)
        const location = await getUserLocation();

        // Llamar al endpoint de recomendaciones
        const response = await api.post('/ads/recommendations', {
          location: location || undefined
        });

        setAds(response.data);
      } catch (err) {
        logger.error('❌ Error cargando anuncios:', err);

        // Si el error es 401 (no autenticado), no mostrar error
        if (err.response?.status === 401) {
          setAds([]);
        } else {
          setError('No se pudieron cargar los anuncios');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  // Si está cargando
  if (loading) {
    return (
      <aside className="quick-search">
        <div className="quick-search-content">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
            <Loader2 style={{ width: '32px', height: '32px', color: '#6366f1', animation: 'spin 1s linear infinite' }} />
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}>Cargando anuncios...</p>
          </div>
        </div>
      </aside>
    );
  }

  // Si hay error
  if (error) {
    return (
      <aside className="quick-search">
        <div className="quick-search-content">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
            <AlertCircle style={{ width: '32px', height: '32px', color: '#ef4444', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', textAlign: 'center' }}>{error}</p>
          </div>
        </div>
      </aside>
    );
  }

  // Si no hay anuncios
  if (ads.length === 0) {
    return (
      <aside className="quick-search">
        <div className="quick-search-content">
          <div style={{ padding: '2rem 0', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
              No hay anuncios disponibles en este momento
            </p>
          </div>
        </div>
      </aside>
    );
  }

  // Renderizar anuncios
  return (
    <aside className="quick-search">
      {/* Header */}
      <div className="quick-search-content">
        <div style={{ marginBottom: '1rem' }}>
          <h3 className="section-title">
            SUGERIDO PARA TI
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
            Anuncios personalizados
          </p>
        </div>

        {/* Lista de anuncios */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {ads.map((ad) => (
            <AdCard key={ad._id} ad={ad} />
          ))}
        </div>

        {/* Footer informativo */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #1a1f3a' }}>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' }}>
            Los anuncios ayudan a mantener DegaderSocial gratuito
          </p>
        </div>
      </div>
    </aside>
  );
};

export default AdsSidebar;


