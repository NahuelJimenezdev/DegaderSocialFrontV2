import axios from 'axios';
import { logger } from '../shared/utils/logger';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    logger.log(`🚀 [AXIOS] Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      logger.log('🔑 [AXIOS] Token agregado al header');
    } else {
      logger.log('⚠️ [AXIOS] No hay token en localStorage');
    }
    return config;
  },
  (error) => {
    logger.error('💥 [AXIOS] Error en request interceptor:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          logger.error('Forbidden: You do not have permission to perform this action');
          break;
        case 404:
          logger.error('Resource not found');
          break;
        case 500:
          logger.error('Server error. Please try again later.');
          break;
        default:
          logger.error('An error occurred:', error.response.data.message || error.message);
      }
    } else if (error.request) {
      logger.error('Network error. Please check your connection.');
    } else {
      logger.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_URL };



