import { format, isValid, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { API_BASE_URL } from '../../../shared/config/env';

/**
 * Valida si una fecha es válida
 * @param {any} date 
 * @returns {boolean}
 */
export const isDateValid = (date) => {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

/**
 * Formatea una fecha de forma segura para evitar crashes
 * @param {Date|string|number} date - Fecha a formatear
 * @param {string} formatStr - Formato deseado (opcional)
 * @returns {string} Fecha formateada o texto alternativo
 */
export const safeFormatDate = (date, formatStr = "d 'de' MMMM 'de' yyyy") => {
  if (!date) return 'No disponible';
  
  try {
    const d = new Date(date);
    if (!isValid(d)) return 'Fecha inválida';
    
    return format(d, formatStr, { locale: es });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Fecha inválida';
  }
};

/**
 * Formatea una fecha a formato relativo en español
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha formateada ("Ahora", "Hace X min", etc.)
 */
export const formatDateRelative = (date) => {
  if (!isDateValid(date)) return 'No disponible';
  
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
 * Convierte una fecha a string YYYY-MM-DD para inputs de tipo date
 * @param {any} date 
 * @returns {string}
 */
export const dateToInputString = (date) => {
  if (!isDateValid(date)) return '';
  try {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

/**
 * Normaliza la URL del avatar del usuario
 */
export const normalizeAvatarUrl = (avatar) => {
  if (!avatar) return '';
  if (avatar.startsWith('http')) return avatar;
  if (avatar.startsWith('/')) return `${API_BASE_URL}${avatar}`;
  return `${API_BASE_URL}/${avatar}`;
};

/**
 * Genera URL de avatar por defecto usando ui-avatars.com
 */
export const getDefaultAvatar = (name) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`;
};

/**
 * Obtiene la URL del avatar del usuario
 */
export const getUserAvatarUrl = (user) => {
  if (!user) return '';
  if (user.social?.fotoPerfil) {
    return normalizeAvatarUrl(user.social.fotoPerfil);
  }
  const name = user.nombreCompleto ||
    (user.nombres?.primero && user.apellidos?.primero
      ? `${user.nombres.primero} ${user.apellidos.primero}`
      : 'Usuario');
  return getDefaultAvatar(name);
};


