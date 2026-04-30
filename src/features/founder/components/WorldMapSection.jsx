import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker
} from 'react-simple-maps';
import { getMapName, getDbName } from '../data/countryMapping';
import CountryTooltip from './CountryTooltip';
import CountryUsersPanel from './CountryUsersPanel';
import { useNavigate } from 'react-router-dom';
import { useFounderUsers } from '../../../shared/hooks/useFounderUsers';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Coordenadas centrales de países con usuarios (para los dots/labels)
const COUNTRY_CENTERS = {
  'Argentina': [-64, -34], 'Bolivia': [-65, -17], 'Brazil': [-51, -14],
  'Chile': [-71, -35], 'Colombia': [-74, 4], 'Costa Rica': [-84, 10],
  'Cuba': [-80, 22], 'Ecuador': [-78, -2], 'El Salvador': [-89, 14],
  'Spain': [-4, 40], 'United States of America': [-97, 39],
  'Honduras': [-87, 15], 'Mexico': [-102, 23], 'Nicaragua': [-85, 13],
  'Panama': [-80, 9], 'Paraguay': [-58, -23], 'Peru': [-76, -10],
  'Dominican Rep.': [-70, 19], 'Uruguay': [-56, -33], 'Venezuela': [-67, 8],
  // Otros comunes
  'Canada': [-106, 56], 'Guatemala': [-90, 15],
  'Russia': [105, 61], 'India': [79, 21], 'China': [104, 35],
  'Germany': [10, 51], 'France': [2, 47], 'Italy': [12, 43],
  'United Kingdom': [-3, 54], 'Australia': [134, -25],
  'Japan': [138, 36], 'South Korea': [128, 36],
  'South Africa': [25, -29], 'Nigeria': [8, 10], 'Kenya': [38, 0],
  'Egypt': [30, 26], 'Turkey': [35, 39], 'Saudi Arabia': [45, 24],
  'Indonesia': [120, -5], 'Philippines': [122, 12],
  'Thailand': [101, 15], 'Vietnam': [108, 16],
  'Poland': [20, 52], 'Ukraine': [32, 49],
  'Portugal': [-8, 39], 'Netherlands': [5, 52],
  'Belgium': [4, 51], 'Switzerland': [8, 47],
  'Sweden': [18, 62], 'Norway': [8, 61],
};

// Detectar modo oscuro
const useIsDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark'
      || document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(
        document.documentElement.getAttribute('data-theme') === 'dark'
        || document.documentElement.classList.contains('dark')
      );
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    return () => observer.disconnect();
  }, []);

  return isDark;
};

// Color único para países CON usuarios, gris para los que no
const getCountryColor = (count, isSelected, isDark) => {
  if (isSelected) return '#6366f1'; // Indigo para seleccionado
  if (count > 0) return isDark ? '#1e3a5f' : '#bfdbfe'; // Un solo color claro
  return 'transparent'; // Sin usuarios = transparente (se ve el fondo)
};

const getStroke = (count, isSelected, isDark) => {
  if (isSelected) return '#818cf8';
  if (count > 0) return isDark ? '#3b82f6' : '#60a5fa';
  return isDark ? '#1e293b' : '#cbd5e1';
};

/**
 * Mapa mundial interactivo con distribución de usuarios por país
 */
export default function WorldMapSection({ geoStats = [] }) {
  const navigate = useNavigate();
  const isDark = useIsDarkMode();
  const [selectedCountry, setSelectedCountry] = useState(null);

  const {
    countryUsers,
    loadingCountryUsers,
    fetchUsersByCountry
  } = useFounderUsers();

  // Lookup: nombre SVG → stats
  const statsLookup = useMemo(() => {
    const map = {};
    geoStats.forEach(stat => {
      const mapName = getMapName(stat.pais);
      map[mapName] = stat;
    });
    return map;
  }, [geoStats]);

  // Lista de marcadores (dots) para países con usuarios
  const markers = useMemo(() => {
    return geoStats
      .filter(s => s.total > 0)
      .map(stat => {
        const mapName = getMapName(stat.pais);
        const coords = COUNTRY_CENTERS[mapName];
        if (!coords) return null;
        return {
          name: mapName,
          dbName: stat.pais,
          coordinates: coords,
          total: stat.total
        };
      })
      .filter(Boolean);
  }, [geoStats]);

  const selectCountry = (name, dbName) => {
    const stats = statsLookup[name];
    if (stats?.total > 0) {
      setSelectedCountry({ name, dbName, stats });
      fetchUsersByCountry(dbName);
    } else {
      setSelectedCountry(null);
    }
  };

  const handleCountryClick = useCallback((geo, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const mapName = geo.properties.name;
    const dbName = getDbName(mapName);
    selectCountry(mapName, dbName);
  }, [statsLookup, fetchUsersByCountry]);

  const handleMarkerClick = useCallback((marker, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    selectCountry(marker.name, marker.dbName);
  }, [statsLookup, fetchUsersByCountry]);

  return (
    <div className="world-map-section">
      <div className="world-map-container" style={{ position: 'relative' }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 120, center: [0, 25] }}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Zoom: 1.3, Center: [-40, 10] enfoca perfectamente LatAm y Europa/España */}
          <ZoomableGroup center={[-40, 10]} zoom={1.3} minZoom={1} maxZoom={6}>
            {/* Países */}
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const mapName = geo.properties.name;
                  const stats = statsLookup[mapName];
                  const count = stats?.total || 0;
                  const isSelected = selectedCountry?.name === mapName;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={(e) => handleCountryClick(geo, e)}
                      style={{
                        default: {
                          fill: getCountryColor(count, isSelected, isDark),
                          stroke: getStroke(count, isSelected, isDark),
                          strokeWidth: 0.4,
                          outline: 'none',
                          transition: 'all 0.2s ease',
                        },
                        hover: {
                          fill: count > 0 ? '#2563eb' : (isDark ? '#1e293b' : '#e2e8f0'),
                          stroke: count > 0 ? '#6366f1' : (isDark ? '#334155' : '#94a3b8'),
                          strokeWidth: 0.8,
                          outline: 'none',
                          cursor: count > 0 ? 'pointer' : 'default',
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Dots + Labels para países con usuarios */}
            {markers.map(marker => (
              <Marker
                key={marker.name}
                coordinates={marker.coordinates}
                onClick={(e) => handleMarkerClick(marker, e)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  className={`map-marker-dot ${selectedCountry?.name === marker.name ? 'selected' : ''}`}
                  r={selectedCountry?.name === marker.name ? 5 : 3}
                  fill={selectedCountry?.name === marker.name ? '#6366f1' : '#60a5fa'}
                  stroke="#fff"
                  strokeWidth={1}
                />
                <text
                  textAnchor="middle"
                  y={-8}
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '7px',
                    fontWeight: 600,
                    fill: isDark ? '#94a3b8' : '#475569',
                    pointerEvents: 'none'
                  }}
                >
                  {marker.dbName}
                </text>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>

        {/* Tarjetas Flotantes (Overlays) */}
        {selectedCountry && (
          <div className="map-floating-overlay">
            {/* Card 1: Vista de País */}
            <div className="map-floating-card">
              <h3>
                <span>Vista de País: {selectedCountry.dbName}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedCountry(null); }}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </h3>
              <p className="text-[11px] text-gray-400 mb-2">Total de Usuarios en {selectedCountry.dbName}: {selectedCountry.stats.total}</p>

              <div className="map-floating-stats-grid">
                <div className="map-floating-stat-item">
                  <p className="map-floating-stat-label">Directores</p>
                  <p className="map-floating-stat-value stat-director">{selectedCountry.stats.directores || 0}</p>
                </div>
                <div className="map-floating-stat-item">
                  <p className="map-floating-stat-label">Secretarios</p>
                  <p className="map-floating-stat-value stat-secretario">{selectedCountry.stats.secretarios || 0}</p>
                </div>
                <div className="map-floating-stat-item">
                  <p className="map-floating-stat-label">Afiliados</p>
                  <p className="map-floating-stat-value stat-afiliado">{selectedCountry.stats.afiliados || 0}</p>
                </div>
              </div>
            </div>

            {/* Card 2: Listado Detallado */}
            <div className="map-floating-card">
              <h3>Listado Detallado de Usuarios</h3>
              <div className="map-floating-users-list">
                {loadingCountryUsers ? (
                  <p className="text-[11px] text-center py-4 animate-pulse">Cargando...</p>
                ) : countryUsers.length > 0 ? (
                  countryUsers.slice(0, 6).map((user) => (
                    <div key={user._id} className="map-floating-user-item">
                      {user.social?.fotoPerfil ? (
                        <img src={user.social.fotoPerfil} className="map-floating-user-avatar" alt={user.username} />
                      ) : (
                        <div className="map-floating-user-avatar">
                          {user.username?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <span className="map-floating-user-name">@{user.username}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-center py-4 text-gray-500">Sin usuarios</p>
                )}
              </div>

              <div 
                onClick={(e) => { e.stopPropagation(); navigate(`/founder/users/country/${selectedCountry.dbName}`); }}
                className="map-floating-view-all"
              >
                Ver todos los usuarios →
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
