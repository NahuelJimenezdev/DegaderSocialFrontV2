import logoImg from '../assets/logo.png';

/**
 * Configuración de Niveles y XP para La Senda del Reino
 */
export const ARENA_CONFIG = {
    // ... (rest of the config)
};

// ... (ranks and achievements)

/**
 * Activos Visuales
 */
export const ARENA_ASSETS = {
    LOGO: logoImg,
    CHARACTERS: {
        facil: logoImg, // Placeholder hasta tener los otros assets
        medio: logoImg,
        dificil: logoImg,
        experto: logoImg
    }
};

/**
 * Estilos de la UI (Estilo iOS Premium)
 */
export const ARENA_THEME = {
    primary: '#007AFF', // Azul iOS
    accent: '#FFD60A',  // Dorado iOS
    success: '#34C759', // Verde iOS
    error: '#FF3B30',   // Rojo iOS
    surface: 'rgba(255, 255, 255, 0.1)',
    blur: '20px',
    background: '#000000',
    card: 'rgba(28, 28, 30, 0.7)', // Gris oscuro iOS con transparencia
};
