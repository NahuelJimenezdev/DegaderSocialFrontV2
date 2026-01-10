import api from './config';
import { logger } from '../shared/utils/logger';

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.nombre - User's first name
   * @param {string} userData.apellido - User's last name
   * @param {string} userData.email - User's email
   * @param {string} userData.password - User's password
   * @param {string} [userData.legajo] - Employee ID (optional)
   * @param {string} [userData.area] - Department/Area (optional)
   * @param {string} [userData.cargo] - Position/Role (optional)
   * @returns {Promise<Object>} Response with token and user data
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    // Backend devuelve: { success, message, data: { token, user } }
    if (response.data.data && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  /**
   * Login user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} Response with token and user data
   */
  login: async (email, password) => {
    logger.log('🔐 [FRONTEND] ===== INICIO LOGIN =====');
    logger.log('📧 Email:', email);
    logger.log('🌐 API URL:', api.defaults.baseURL);

    try {
      logger.log('📤 Enviando petición POST a /auth/login...');
      const response = await api.post('/auth/login', { email, password });

      logger.log('✅ Respuesta recibida:', {
        status: response.status,
        success: response.data.success,
        message: response.data.message
      });

      // Backend devuelve: { success, message, data: { token, user } }
      if (response.data.data && response.data.data.token) {
        logger.log('💾 Guardando token y usuario en localStorage...');
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        logger.log('✅ Token y usuario guardados');
      }

      logger.log('🔐 [FRONTEND] ===== FIN LOGIN EXITOSO =====\n');
      return response.data;
    } catch (error) {
      logger.error('💥 [FRONTEND] ERROR EN LOGIN:', error);
      logger.error('Error completo:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      });
      logger.log('🔐 [FRONTEND] ===== FIN LOGIN CON ERROR =====\n');
      throw error;
    }
  },

  /**
   * Logout user (clear local storage)
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} Current user data
   */
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    // Backend devuelve: { success, message, data: user }
    if (response.data.data) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Response data
   */
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * Get current user from local storage
   * @returns {Object|null} User object or null
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Get current token from local storage
   * @returns {string|null} Token or null
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Get suspension info for current user
   * @returns {Promise<Object>} Suspension information
   */
  getSuspensionInfo: async () => {
    const response = await api.get('/auth/suspension-info');
    return response.data;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;



