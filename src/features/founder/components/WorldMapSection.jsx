import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker
} from 'react-simple-maps';
import { getMapName, getDbName } from '../data/countryMapping';
import { getFlagColor, getCountryIso } from '../data/countryColors';
import { useNavigate } from 'react-router-dom';
import { useFounderUsers } from '../../../shared/hooks/useFounderUsers';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const COUNTRY_CENTERS = {
  'Argentina': [-64, -34], 'Bolivia': [-65, -17], 'Brazil': [-51, -14],
  'Chile': [-71, -35], 'Colombia': [-74, 4], 'Costa Rica': [-84, 10],
  'Cuba': [-80, 22], 'Ecuador': [-78, -2], 'El Salvador': [-89, 14],
  'Spain': [-4, 40], 'United States of America': [-97, 39],
  'Honduras': [-87, 15], 'Mexico': [-102, 23], 'Nicaragua': [-85, 13],
  'Panama': [-80, 9], 'Paraguay': [-58, -23], 'Peru': [-76, -10],
  'Dominican Rep.': [-70, 19], 'Uruguay': [-56, -33], 'Venezuela': [-67, 8],
  'Canada': [-106, 56], 'Guatemala': [-90, 15],
  'Russia': [105, 61], 'India': [79, 21], 'China': [104, 35],
  'Germany': [10, 51], 'France': [2, 47], 'Italy': [12, 43],
  'United Kingdom': [-3, 54], 'Australia': [134, -25],
};

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

export default function WorldMapSection({ geoStats = [] }) {
  const navigate = useNavigate();
  const isDark = useIsDarkMode();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const { countryUsers, loadingCountryUsers, fetchUsersByCountry } = useFounderUsers();

  const statsLookup = useMemo(() => {
    const map = {};
    geoStats.forEach(stat => {
      const mapName = getMapName(stat.pais);
      map[mapName] = stat;
    });
    return map;
  }, [geoStats]);

  const countriesWithData = useMemo(() => {
    return geoStats
      .filter(s => s.total > 0)
      .map(stat => {
        const mapName = getMapName(stat.pais);
        const iso = getCountryIso(mapName);
        return iso ? { iso, mapName } : null;
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

  return (
    <div className="world-map-section">
      <div className="world-map-container" style={{ position: 'relative' }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 120, center: [0, 25] }}
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            {countriesWithData.map(({ iso }) => (
              <pattern
                key={`pattern-${iso}`}
                id={`flag-${iso}`}
                patternUnits="objectBoundingBox"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <image
                  href={`/flags/${iso}.svg`}
                  x="0"
                  y="0"
                  width="1"
                  height="1"
                  preserveAspectRatio="none"
                />
              </pattern>
            ))}
          </defs>

          <ZoomableGroup center={[-40, 10]} zoom={1.3} minZoom={1} maxZoom={6}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const mapName = geo.properties.name;
                  const stats = statsLookup[mapName];
                  const count = stats?.total || 0;
                  const isSelected = selectedCountry?.name === mapName;
                  const iso = getCountryIso(mapName);
                  const flagColor = getFlagColor(mapName, true, isDark);

                  const fillValue = (count > 0 && iso) 
                    ? `url(#flag-${iso})` 
                    : (isDark ? '#1e293b' : '#f1f5f9');

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => selectCountry(mapName, getDbName(mapName))}
                      fill={fillValue}
                      fillOpacity={count > 0 ? 1 : (isDark ? 0.3 : 0.5)}
                      stroke={count > 0 ? (isSelected ? '#fff' : flagColor) : (isDark ? '#334155' : '#e2e8f0')}
                      strokeWidth={isSelected ? 1 : 0.4}
                      style={{
                        default: { outline: 'none', transition: 'all 0.3s ease' },
                        hover: {
                          fillOpacity: 1,
                          stroke: '#fff',
                          strokeWidth: 1,
                          outline: 'none',
                          cursor: count > 0 ? 'pointer' : 'default',
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>

          </ZoomableGroup>
        </ComposableMap>

        {selectedCountry && (
          <div className="map-floating-overlay">
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
              <p className="text-[11px] text-gray-400 mb-2">Total de Usuarios: {selectedCountry.stats.total}</p>

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

            <div className="map-floating-card">
              <h3>Listado Detallado</h3>
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
