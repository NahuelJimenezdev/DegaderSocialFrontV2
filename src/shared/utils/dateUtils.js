/**
 * Formatea una fecha a tiempo relativo
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} - Texto relativo (ej: "hace 2 horas")
 */
export const formatRelativeTime = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now - then;

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSeconds < 60) {
        return 'hace menos de 1 min';
    } else if (diffMinutes < 60) {
        return `hace ${diffMinutes} min`;
    } else if (diffHours < 24) {
        return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
        return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    } else if (diffWeeks < 4) {
        return `hace ${diffWeeks} semana${diffWeeks > 1 ? 's' : ''}`;
    } else if (diffMonths < 12) {
        return `hace ${diffMonths} mes${diffMonths > 1 ? 'es' : ''}`;
    } else {
        return `hace ${diffYears} año${diffYears > 1 ? 's' : ''}`;
    }
};

export default {
    formatRelativeTime
};
