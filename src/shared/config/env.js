/**
 * Centralized environment configuration
 * All environment variables and URLs should be accessed through this file
 */

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
export const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:3001';

// Socket Configuration
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_API_URL?.replace('/api', '') ||
    'http://localhost:3001';

// Environment Flags
export const IS_DEV = import.meta.env.DEV;
export const IS_PROD = import.meta.env.PROD;
export const IS_DEBUG = import.meta.env.VITE_DEBUG === 'true';

// App Configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Degader Social';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '2.0.0';

// Feature Flags (optional)
export const FEATURES = {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false', // enabled by default
    enableChat: import.meta.env.VITE_ENABLE_CHAT !== 'false',
};

// Helper function to build full URLs
export const buildUrl = (path) => {
    const base = API_BASE_URL;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${cleanPath}`;
};

// Export all as a single object for convenience
export const ENV = {
    API_URL,
    API_BASE_URL,
    SOCKET_URL,
    IS_DEV,
    IS_PROD,
    IS_DEBUG,
    APP_NAME,
    APP_VERSION,
    FEATURES,
    buildUrl,
};

export default ENV;


