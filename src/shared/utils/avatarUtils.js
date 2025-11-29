/**
 * Utilitario para manejo consistente de URLs de avatares
 * Basado en DegaderFront/src/shared/utils/avatarUtils.js
 */

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:3001';

export const getAvatarUrl = (avatar, defaultPath = '/avatars/default-avatar.png') => {
  // Si no hay avatar, usar default
  if (!avatar || avatar.trim() === '') {
    return defaultPath;
  }

  // Si parece ser base64, convertir a data URL
  if (avatar.match(/^[A-Za-z0-9+/=]+$/) && avatar.length > 100) {
    return `data:image/jpeg;base64,${avatar}`;
  }

  // Si ya es una data URL, usar directamente
  if (avatar.startsWith('data:image/')) {
    return avatar;
  }

  // Si es una URL absoluta, usar directamente
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
    return avatar;
  }

  // Si empieza con /uploads, es del servidor backend
  if (avatar.startsWith('/uploads/')) {
    return `${API_BASE}${avatar}`;
  }

  // Si empieza con /assets o /avatars, es del frontend
  if (avatar.startsWith('/assets/') || avatar.startsWith('/avatars/')) {
    return avatar;
  }

  // Si parece ser solo el nombre del archivo, asumir que está en assets
  if (avatar && !avatar.includes('/')) {
    return `/assets/${avatar}`;
  }

  // Fallback al default
  return defaultPath;
};

export const getBannerUrl = (banner, defaultPath = '/avatars/default-banner.svg') => {
  // Si no hay banner, usar default
  if (!banner || banner.trim() === '') {
    return defaultPath;
  }

  // Si parece ser base64, convertir a data URL
  if (banner.match(/^[A-Za-z0-9+/=]+$/) && banner.length > 100) {
    return `data:image/jpeg;base64,${banner}`;
  }

  // Si ya es una data URL, usar directamente
  if (banner.startsWith('data:image/')) {
    return banner;
  }

  // Si es una URL absoluta, usar directamente
  if (banner.startsWith('http://') || banner.startsWith('https://')) {
    return banner;
  }

  // Si empieza con /uploads, es del servidor backend
  if (banner.startsWith('/uploads/')) {
    return `${API_BASE}${banner}`;
  }

  // Si empieza con /assets, es del frontend
  if (banner.startsWith('/assets/')) {
    return banner;
  }

  // Si parece ser solo el nombre del archivo, asumir que está en assets
  if (banner && !banner.includes('/')) {
    return `/assets/${banner}`;
  }

  // Fallback al default
  return defaultPath;
};

export const handleImageError = (e, fallbackUrl = '/avatars/default-avatar.png') => {
  if (e.currentTarget.onerror) {
    e.currentTarget.onerror = null; // Evitar bucle infinito
  }
  e.currentTarget.src = fallbackUrl;
};

/**
 * Genera un avatar con las iniciales del nombre
 * @param {string} name - Nombre completo del usuario
 * @returns {string} URL del avatar generado
 */
export const getInitialsAvatar = (name) => {
  if (!name) return '/avatars/default-avatar.png';

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Crear un SVG con las iniciales
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <rect width="100" height="100" fill="#6366f1"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="system-ui" font-size="40" fill="white" font-weight="bold">
        ${initials}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Obtiene la URL del avatar del usuario, generando uno con iniciales si no tiene foto
 * @param {Object} user - Objeto del usuario con la nueva estructura
 * @returns {string} URL del avatar
 */
export const getUserAvatar = (user) => {
  // Si tiene fotoPerfil, usarla
  if (user?.social?.fotoPerfil) {
    return getAvatarUrl(user.social.fotoPerfil);
  }

  // Si no tiene foto, intentar obtener nombre para iniciales
  let fullName = '';

  // 1. Intentar con nombreCompleto (prioridad alta)
  if (user?.nombreCompleto) {
    fullName = user.nombreCompleto;
  }
  // 2. Intentar con nombres y apellidos estructurados
  else if (user?.nombres?.primero || user?.apellidos?.primero) {
    const firstName = user?.nombres?.primero || '';
    const lastName = user?.apellidos?.primero || '';
    fullName = `${firstName} ${lastName}`.trim();
  }

  // Si tenemos un nombre, generar avatar con iniciales
  if (fullName) {
    // Usar ui-avatars.com para generar avatar con iniciales
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=3b82f6&color=fff&size=128`;
  }

  // Fallback a avatar por defecto
  return '/avatars/default-avatar.png';
};
