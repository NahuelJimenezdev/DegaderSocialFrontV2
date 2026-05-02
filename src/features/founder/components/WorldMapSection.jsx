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
  'Argentina': [-64, -34],
  'Bolivia': [-65, -17],
  'Brazil': [-55, -10],
  'Chile': [-71, -30],
  'Colombia': [-72, 4],
  'Costa Rica': [-84, 10],
  'Cuba': [-80, 21.5],
  'Ecuador': [-77.5, -2],
  'El Salvador': [-88.9167, 13.8333],
  'Spain': [-4, 40],
  'United States of America': [-97, 38],
  'Honduras': [-86.5, 15],
  'Mexico': [-102, 23],
  'Nicaragua': [-85, 13],
  'Panama': [-80, 9],
  'Paraguay': [-58, -23],
  'Peru': [-76, -10],
  'Dominican Rep.': [-70.6667, 19],
  'Uruguay': [-56, -33],
  'Venezuela': [-66, 8],
  'Canada': [-95, 60],
  'Belize': [-88.75, 17.25],
  'Guatemala': [-90.25, 15.5],
  'Jamaica': [-77.5, 18.25],
  'Haiti': [-72.4167, 19],
  'Puerto Rico': [-66.5, 18.25],
  'Bahamas': [-76, 24.25],
  'Trinidad and Tobago': [-61, 11],
  'Guyana': [-59, 5],
  'Suriname': [-56, 4],
  'Greenland': [-40, 72],
  'Germany': [9, 51],
  'France': [2, 46],
  'Italy': [12.8333, 42.8333],
  'United Kingdom': [-2, 54],
  'Portugal': [-8, 39.5],
  'Netherlands': [5.75, 52.5],
  'Belgium': [4, 50.8333],
  'Switzerland': [8, 47],
  'Austria': [13.3333, 47.3333],
  'Sweden': [15, 62],
  'Norway': [10, 62],
  'Denmark': [10, 56],
  'Finland': [26, 64],
  'Iceland': [-18, 65],
  'Ireland': [-8, 53],
  'Poland': [20, 52],
  'Romania': [25, 46],
  'Bulgaria': [25, 43],
  'Greece': [22, 39],
  'Hungary': [20, 47],
  'Czechia': [15.5, 49.75],
  'Slovakia': [19.5, 48.6667],
  'Croatia': [15.5, 45.1667],
  'Serbia': [21, 44],
  'Bosnia and Herz.': [18, 44],
  'Montenegro': [19, 42],
  'Albania': [20, 41],
  'Macedonia': [22, 41.8333],
  'Slovenia': [15, 46],
  'Luxembourg': [6.1667, 49.75],
  'Estonia': [26, 59],
  'Latvia': [25, 57],
  'Lithuania': [24, 56],
  'Ukraine': [32, 49],
  'Belarus': [28, 53],
  'Moldova': [29, 47],
  'Russia': [100, 60],
  'Turkey': [35, 39],
  'Cyprus': [33, 35],
  'China': [105, 35],
  'Japan': [138, 36],
  'South Korea': [127.5, 37],
  'North Korea': [127, 40],
  'India': [77, 20],
  'Pakistan': [70, 30],
  'Bangladesh': [90, 24],
  'Sri Lanka': [81, 7],
  'Nepal': [84, 28],
  'Bhutan': [90.5, 27.5],
  'Myanmar': [98, 22],
  'Thailand': [100, 15],
  'Vietnam': [106, 16],
  'Cambodia': [105, 13],
  'Laos': [105, 18],
  'Malaysia': [112.5, 2.5],
  'Indonesia': [120, -5],
  'Philippines': [122, 13],
  'Taiwan': [121, 23.5],
  'Mongolia': [105, 46],
  'Kazakhstan': [68, 48],
  'Uzbekistan': [64, 41],
  'Turkmenistan': [60, 40],
  'Tajikistan': [71, 39],
  'Kyrgyzstan': [75, 41],
  'Afghanistan': [65, 33],
  'Iran': [53, 32],
  'Iraq': [44, 33],
  'Syria': [38, 35],
  'Lebanon': [35.8333, 33.8333],
  'Israel': [34.75, 31.5],
  'Jordan': [36, 31],
  'Saudi Arabia': [45, 25],
  'United Arab Emirates': [54, 24],
  'Qatar': [51.25, 25.5],
  'Kuwait': [47.6581, 29.3375],
  'Oman': [57, 21],
  'Yemen': [48, 15],
  'Georgia': [43.5, 42],
  'Armenia': [45, 40],
  'Azerbaijan': [47.5, 40.5],
  'Brunei': [114.6667, 4.5],
  'Timor-Leste': [125.5167, -8.55],
  'Palestine': [35.25, 32],
  'Egypt': [30, 27],
  'Libya': [17, 25],
  'Tunisia': [9, 34],
  'Algeria': [3, 28],
  'Morocco': [-5, 32],
  'South Africa': [24, -29],
  'Nigeria': [8, 10],
  'Kenya': [38, 1],
  'Ethiopia': [38, 8],
  'Tanzania': [35, -6],
  'Uganda': [32, 1],
  'Rwanda': [30, -2],
  'Sudan': [30, 15],
  'Somalia': [49, 10],
  'Dem. Rep. Congo': [25, 0],
  'Congo': [15, -1],
  'Cameroon': [12, 6],
  'Ghana': [-2, 8],
  "Côte d'Ivoire": [-5, 8],
  'Senegal': [-14, 14],
  'Mali': [-4, 17],
  'Niger': [8, 16],
  'Chad': [19, 15],
  'Mozambique': [35, -18.25],
  'Madagascar': [47, -20],
  'Zambia': [30, -15],
  'Zimbabwe': [30, -20],
  'Botswana': [24, -22],
  'Namibia': [17, -22],
  'Angola': [18.5, -12.5],
  'Gabon': [11.75, -1],
  'Central African Rep.': [21, 7],
  'Benin': [2.25, 9.5],
  'Togo': [1.1667, 8],
  'Burkina Faso': [-2, 13],
  'Liberia': [-9.5, 6.5],
  'Sierra Leone': [-11.5, 8.5],
  'Guinea': [-10, 11],
  'Guinea-Bissau': [-15, 12],
  'Gambia': [-16.5667, 13.4667],
  'Mauritania': [-12, 20],
  'Eritrea': [39, 15],
  'Djibouti': [43, 11.5],
  'Malawi': [34, -13.5],
  'eSwatini': [31.5, -26.5],
  'Lesotho': [28.5, -29.5],
  'Burundi': [30, -3.5],
  'W. Sahara': [-13, 24.5],
  'Australia': [133, -27],
  'New Zealand': [174, -41],
  'Papua New Guinea': [147, -6],
  'Fiji': [175, -18],
  'Solomon Is.': [159, -8],
  'Vanuatu': [167, -16],
  'New Caledonia': [165.5, -21.5],
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

            {geoStats.filter(s => s.total > 0).map(stat => {
              const mapName = getMapName(stat.pais);
              const coords = COUNTRY_CENTERS[mapName];
              if (!coords) return null;
              
              return (
                <Marker key={mapName} coordinates={coords} onClick={() => selectCountry(mapName, stat.pais)}>
                   <g transform="translate(0, -5)" style={{ cursor: 'pointer' }}>
                      {/* Efecto de pulso (Foco de vida) */}
                      <circle r="5" fill="#6366f1">
                          <animate attributeName="r" from="5" to="15" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle r="4" fill="#818df830" stroke="white" strokeWidth="1" />
                  </g>
                </Marker>
              );
            })}
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
