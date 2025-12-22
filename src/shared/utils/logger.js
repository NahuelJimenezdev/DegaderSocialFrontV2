/**
 * Logging utility for development
 * Automatically disabled in production to prevent information leakage
 */

const isDev = import.meta.env.DEV;
const isDebugMode = import.meta.env.VITE_DEBUG === 'true';

/**
 * Conditional logger that only works in development
 * Usage: logger.log('message'), logger.error('error'), logger.warn('warning')
 */
export const logger = {
    log: (...args) => {
        if (isDev || isDebugMode) {
            console.log(...args);
        }
    },

    error: (...args) => {
        if (isDev || isDebugMode) {
            console.error(...args);
        }
    },

    warn: (...args) => {
        if (isDev || isDebugMode) {
            console.warn(...args);
        }
    },

    info: (...args) => {
        if (isDev || isDebugMode) {
            console.info(...args);
        }
    },

    debug: (...args) => {
        if (isDebugMode) {
            console.debug(...args);
        }
    },

    table: (...args) => {
        if (isDev || isDebugMode) {
            console.table(...args);
        }
    },
};

/**
 * Production-safe logger
 * Always logs errors, but only logs other messages in development
 */
export const safeLogger = {
    log: (...args) => {
        if (isDev) console.log(...args);
    },

    error: (...args) => {
        // Always log errors, even in production
        console.error(...args);
    },

    warn: (...args) => {
        if (isDev) console.warn(...args);
    },
};

export default logger;
