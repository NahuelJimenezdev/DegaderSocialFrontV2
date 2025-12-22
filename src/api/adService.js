import api from './config';

/**
 * Servicio para gestionar anuncios y créditos
 */

// ==========================================
// ENDPOINTS PARA CLIENTES
// ==========================================

/**
 * Obtener mis campañas
 */
export const getMyCampaigns = async () => {
  const response = await api.get('/ads/my-campaigns');
  return response.data;
};

/**
 * Crear nueva campaña
 */
export const createCampaign = async (campaignData) => {
  const response = await api.post('/ads/create', campaignData);
  return response.data;
};

/**
 * Actualizar campaña
 */
export const updateCampaign = async (id, campaignData) => {
  const response = await api.put(`/ads/${id}`, campaignData);
  return response.data;
};

/**
 * Pausar/Reanudar campaña
 */
export const toggleCampaign = async (id) => {
  const response = await api.patch(`/ads/${id}/toggle`);
  return response.data;
};

/**
 * Eliminar campaña
 */
export const deleteCampaign = async (id) => {
  const response = await api.delete(`/ads/${id}`);
  return response.data;
};

/**
 * Obtener estadísticas de una campaña
 */
export const getCampaignStats = async (id, params = {}) => {
  const response = await api.get(`/ads/${id}/stats`, { params });
  return response.data;
};

// ==========================================
// ENDPOINTS DE CRÉDITOS
// ==========================================

/**
 * Obtener balance de créditos
 */
export const getBalance = async () => {
  const response = await api.get('/ads/credits/balance');
  return response.data;
};

/**
 * Comprar créditos
 */
export const purchaseCredits = async (purchaseData) => {
  const response = await api.post('/ads/credits/purchase', purchaseData);
  return response.data;
};

/**
 * Obtener historial de transacciones
 */
export const getTransactions = async (limite = 50) => {
  const response = await api.get('/ads/credits/transactions', {
    params: { limite }
  });
  return response.data;
};

// ==========================================
// ENDPOINTS PARA FOUNDER (ADMIN)
// ==========================================

/**
 * Obtener todas las campañas (admin)
 */
export const getAllCampaigns = async (params = {}) => {
  const response = await api.get('/ads/admin/all-campaigns', { params });
  return response.data;
};

/**
 * Aprobar/Rechazar campaña (admin)
 */
export const approveCampaign = async (adId, accion, motivoRechazo = '') => {
  const response = await api.put(`/ads/admin/approve/${adId}`, {
    accion,
    motivoRechazo
  });
  return response.data;
};

/**
 * Obtener ingresos totales (admin)
 */
export const getRevenue = async () => {
  const response = await api.get('/ads/admin/revenue');
  return response.data;
};

export default {
  // Cliente
  getMyCampaigns,
  createCampaign,
  updateCampaign,
  toggleCampaign,
  deleteCampaign,
  getCampaignStats,
  // Créditos
  getBalance,
  purchaseCredits,
  getTransactions,
  // Admin
  getAllCampaigns,
  approveCampaign,
  getRevenue
};


