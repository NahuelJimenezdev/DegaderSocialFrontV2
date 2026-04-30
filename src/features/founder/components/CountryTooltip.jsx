import React from 'react';

/**
 * Panel "Vista de País" que muestra estadísticas de fundación por país
 * - Total de usuarios
 * - Directores
 * - Secretarios
 * - Afiliados
 */
export default function CountryTooltip({ country, onClose }) {
  if (!country) return null;

  const { dbName, stats } = country;

  return (
    <div className="country-tooltip-card">
      <div className="country-tooltip-header">
        <h3 className="country-tooltip-title">
          Vista de País: {dbName}
        </h3>
        <button onClick={onClose} className="country-tooltip-close" aria-label="Cerrar">
          ✕
        </button>
      </div>

      <div className="country-tooltip-total">
        <span>👥 Total de Usuarios en {dbName}: <strong>{stats.total}</strong></span>
      </div>

      <div className="country-tooltip-stats">
        <div className="country-stat-item country-stat-directores">
          <span className="country-stat-icon">📋</span>
          <span className="country-stat-label">Directores</span>
          <span className="country-stat-value">{stats.directores}</span>
        </div>
        <div className="country-stat-item country-stat-secretarios">
          <span className="country-stat-icon">📝</span>
          <span className="country-stat-label">Secretarios</span>
          <span className="country-stat-value">{stats.secretarios}</span>
        </div>
        <div className="country-stat-item country-stat-afiliados">
          <span className="country-stat-icon">👤</span>
          <span className="country-stat-label">Afiliados</span>
          <span className="country-stat-value">{stats.afiliados}</span>
        </div>
      </div>
    </div>
  );
}
