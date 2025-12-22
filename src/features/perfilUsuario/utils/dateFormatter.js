import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { API_BASE_URL } from '../../../shared/config/env';

/**
 * Formatea una fecha a formato relativo en español
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha formateada ("Ahora", "Hace X min", etc.)
 */
export const formatDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `Hace ${minutes} min`;
  if (hours < 24) return `Hace ${hours} h`;
  if (days < 30) return `Hace ${days} d`;
  return d.toLocaleDateString();
};

/**
 * Normaliza la URL del avatar del usuario
 * @param {string} avatar - URL del avatar
 * @returns {string} URL normalizada
 */
export const normalizeAvatarUrl = (avatar) => {
  if (!avatar) return '';
  if (avatar.startsWith('http')) return avatar;
  if (avatar.startsWith('/')) return `${API_BASE_URL}${avatar}`;
  return `${API_BASE_URL}/${avatar}`;
};

/**
 * Genera URL de avatar por defecto usando ui-avatars.com
 * @param {string} name - Nombre del usuario
 * @returns {string} URL del avatar por defecto
 */
export const getDefaultAvatar = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`;
};

/**
 * Obtiene la URL del avatar del usuario (normalizada o por defecto)
 * @param {Object} user - Objeto del usuario
 * @returns {string} URL del avatar
 */
export const getUserAvatarUrl = (user) => {
  if (!user) return '';

  // Usar social.fotoPerfil en lugar de avatar
  if (user.social?.fotoPerfil) {
    return normalizeAvatarUrl(user.social.fotoPerfil);
  }

  // Construir nombre completo desde la nueva estructura
  const name = user.nombreCompleto ||
    (user.nombres?.primero && user.apellidos?.primero
      ? `${user.nombres.primero} ${user.apellidos.primero}`
      : 'Usuario');
  return getDefaultAvatar(name);
};


