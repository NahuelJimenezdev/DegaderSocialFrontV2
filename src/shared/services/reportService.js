import api from '../../api/config';

/**
 * Servicio de API para el sistema de reportes
 */

// ==========================================
// 🔹 FUNCIONES PARA USUARIOS
// ==========================================

/**
 * Crear un nuevo reporte
 * @param {Object} reportData - Datos del reporte
 * @param {string} reportData.contentType - Tipo de contenido (post, comment, profile, message)
 * @param {string} reportData.contentId - ID del contenido a reportar
 * @param {string} reportData.reason - Motivo principal
 * @param {string} [reportData.subreason] - Submotivo (opcional)
 * @param {string} [reportData.comment] - Comentario adicional (opcional)
 * @param {string} [reportData.platform] - Plataforma (web, mobile, etc.)
 */
export const createReport = async (reportData) => {
    try {
        const response = await api.post('/reports', reportData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al crear el reporte' };
    }
};

/**
 * Obtener reportes creados por el usuario actual
 * @param {number} page - Número de página
 * @param {number} limit - Límite por página
 */
export const getUserReports = async (page = 1, limit = 20) => {
    try {
        const response = await api.get('/reports/my-reports', {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener reportes' };
    }
};

// ==========================================
// 🔹 FUNCIONES PARA MODERADORES
// ==========================================

/**
 * Obtener lista de reportes con filtros
 * @param {Object} filters - Filtros de búsqueda
 */
export const getAllReports = async (filters = {}) => {
    try {
        const response = await api.get('/reports/moderator/list', {
            params: filters
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener reportes' };
    }
};

/**
 * Obtener detalle de un reporte
 * @param {string} reportId - ID del reporte
 */
export const getReportById = async (reportId) => {
    try {
        const response = await api.get(`/reports/moderator/${reportId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener el reporte' };
    }
};

/**
 * Asignar reporte al moderador actual
 * @param {string} reportId - ID del reporte
 */
export const assignReport = async (reportId) => {
    try {
        const response = await api.put(`/reports/moderator/${reportId}/assign`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al asignar el reporte' };
    }
};

// Alias para compatibilidad
export const assignReportToSelf = assignReport;

/**
 * Actualizar estado del reporte
 * @param {string} reportId - ID del reporte
 * @param {string} status - Nuevo estado
 * @param {string} justification - Justificación del cambio
 */
export const updateReportStatus = async (reportId, status, justification) => {
    try {
        const response = await api.put(`/reports/moderator/${reportId}/status`, {
            status,
            justification
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al actualizar el estado' };
    }
};

/**
 * Aplicar acción de moderación
 * @param {string} reportId - ID del reporte
 * @param {Object} actionData - Datos de la acción
 * @param {string} actionData.action - Acción a aplicar
 * @param {boolean} actionData.isValid - Si el reporte es válido
 * @param {string} actionData.justification - Justificación de la acción
 */
export const takeModeratorAction = async (reportId, actionData) => {
    try {
        const response = await api.post(`/reports/moderator/${reportId}/action`, actionData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al aplicar la acción' };
    }
};

/**
 * Obtener estadísticas para moderadores
 */
export const getModeratorStats = async () => {
    try {
        const response = await api.get('/reports/moderator/stats');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener estadísticas' };
    }
};

// ==========================================
// 🔹 FUNCIONES PARA FOUNDER
// ==========================================

/**
 * Obtener estadísticas de auditoría
 */
export const getFounderAuditStats = async () => {
    try {
        const response = await api.get('/reports/founder/audit');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al obtener auditoría' };
    }
};

/**
 * Escalar o revertir un caso
 * @param {string} reportId - ID del reporte
 * @param {string} action - 'escalate' o 'revert'
 * @param {string} justification - Justificación
 * @param {Object} [newDecision] - Nueva decisión (para revert)
 */
export const escalateOrRevertCase = async (reportId, action, justification, newDecision = null) => {
    try {
        const response = await api.put(`/reports/founder/${reportId}/escalate`, {
            action,
            justification,
            newDecision
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Error al procesar la acción' };
    }
};

export default {
    createReport,
    getUserReports,
    getAllReports,
    getReportById,
    assignReport,
    assignReportToSelf,
    updateReportStatus,
    takeModeratorAction,
    getModeratorStats,
    getFounderAuditStats,
    escalateOrRevertCase
};
