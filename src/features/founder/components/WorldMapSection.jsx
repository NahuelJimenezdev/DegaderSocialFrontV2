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

  const markers = useMemo(() => {
    return geoStats
      .filter(s => s.total > 0)
      .map(stat => {
        const mapName = getMapName(stat.pais);
        const coords = COUNTRY_CENTERS[mapName];
        return coords ? { name: mapName, dbName: stat.pais, coordinates: coords, total: stat.total } : null;
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
            {geoStats.filter(s => s.total > 0).map(stat => {
              const mapName = getMapName(stat.pais);
              const iso = getCountryIso(mapName);
              if (!iso) return null;
              return (
                <pattern 
                  key={`flag-${iso}`}
                  id={`flag-${iso}`} 
                  patternUnits="objectBoundingBox" 
                  width="1" height="1"
                >
                  <image 
                    href={`/flags/${iso}.svg`} 
                    x="0" y="0" width="100%" height="100%" 
                    preserveAspectRatio="xMidYMid slice"
                  />
                </pattern>
              );
            })}
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

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => selectCountry(mapName, getDbName(mapName))}
                      style={{
                        default: {
                          // USAMOS LAS BANDERAS LOCALES DESCARGADAS
                          fill: (count > 0 && iso) ? `url(#flag-${iso})` : (isDark ? 'transparent' : 'transparent'),
                          fillOpacity: count > 0 ? (isSelected ? 1 : 0.6) : 0,
                          stroke: count > 0 ? flagColor : (isDark ? '#1e293b' : '#cbd5e1'),
                          strokeWidth: isSelected ? 0.8 : 0.4,
                          outline: 'none',
                          transition: 'all 0.3s ease',
                        },
                        hover: {
                          fill: (count > 0 && iso) ? `url(#flag-${iso})` : (isDark ? '#1e293b' : '#e2e8f0'),
                          fillOpacity: 1,
                          stroke: count > 0 ? flagColor : (isDark ? '#334155' : '#94a3b8'),
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

            {markers.map(marker => (
              <Marker
                key={marker.name}
                coordinates={marker.coordinates}
                onClick={() => selectCountry(marker.name, marker.dbName)}
              >
                <circle
                  r={selectedCountry?.name === marker.name ? 5 : 3}
                  fill={getFlagColor(marker.name, true, isDark)}
                  stroke="#fff"
                  strokeWidth={1}
                />
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>

        {selectedCountry && (
          <div className="map-floating-overlay" style={{ pointerEvents: 'none' }}>
            <div className="map-floating-card" style={{ pointerEvents: 'auto' }}>
              <h3>
                <span>País: {selectedCountry.dbName}</span>
                <button onClick={() => setSelectedCountry(null)}>✕</button>
              </h3>
              <p className="text-[11px] text-gray-400 mb-2">Usuarios: {selectedCountry.stats.total}</p>
              <div 
                onClick={() => navigate(`/founder/users/country/${selectedCountry.dbName}`)}
                className="map-floating-view-all"
                style={{ cursor: 'pointer' }}
              >
                Ver todos →
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
