import React from 'react';

/**
 * Panel "Listado Detallado de Usuarios" que muestra los usuarios de un país
 * con avatar (iniciales), username y botón para ver todos
 */
export default function CountryUsersPanel({ country, users = [], loading = false, onViewAll }) {
  if (!country) return null;

  const hasUsers = country.stats?.total > 0;
  const visibleUsers = users.slice(0, 5);

  return (
    <div className="country-users-panel">
      <h4 className="country-users-title">Listado Detallado de Usuarios</h4>

      {loading ? (
        <div className="country-users-loading">
          <div className="country-users-spinner"></div>
          <span>Cargando...</span>
        </div>
      ) : !hasUsers ? (
        <div className="country-users-empty-state">
          <span className="country-users-empty-icon">📭</span>
          <p className="country-users-empty">Sin usuarios en este país</p>
        </div>
      ) : visibleUsers.length === 0 ? (
        <div className="country-users-loading">
          <div className="country-users-spinner"></div>
          <span>Cargando usuarios...</span>
        </div>
      ) : (
        <>
          <div className="country-users-list">
            {visibleUsers.map(user => (
              <div key={user._id} className="country-user-item">
                <div className="country-user-avatar" style={{
                  background: `linear-gradient(135deg, ${getAvatarColor(user.username)})`,
                }}>
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="country-user-name">@{user.username}</span>
              </div>
            ))}
          </div>

          {country.stats?.total > 5 && (
            <div className="country-users-more" onClick={onViewAll}>
              Ver todos los usuarios →
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Generar color de avatar basado en username
function getAvatarColor(username) {
  if (!username) return '#6366f1, #8b5cf6';
  const hash = username.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const colors = [
    '#6366f1, #8b5cf6',
    '#3b82f6, #6366f1',
    '#ec4899, #f43f5e',
    '#f59e0b, #ef4444',
    '#10b981, #14b8a6',
    '#8b5cf6, #a855f7',
    '#06b6d4, #3b82f6',
  ];
  return colors[hash % colors.length];
}
