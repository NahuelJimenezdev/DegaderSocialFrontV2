import logoImg from '../assets/logo.png';

/**
 * Configuración de Niveles y XP para La Senda del Reino
 */
export const ARENA_CONFIG = {
    LEVELS: {
        FACIL: {
            id: 'facil',
            label: 'Fácil',
            multiplier: 1,
            baseXP: 10,
            timeLimit: 30, // segundos
        },
        MEDIO: {
            id: 'medio',
            label: 'Medio',
            multiplier: 1.5,
            baseXP: 25,
            timeLimit: 20,
        },
        DIFICIL: {
            id: 'dificil',
            label: 'Difícil',
            multiplier: 2.5,
            baseXP: 50,
            timeLimit: 15,
        },
        EXPERTO: {
            id: 'experto',
            label: 'Experto',
            multiplier: 5,
            baseXP: 100,
            timeLimit: 10,
        }
    },

    PROGRESSION: {
        BASE_XP_PER_LEVEL: 1000,
        GROWTH_FACTOR: 1.2, // El XP necesario crece un 20% por nivel
    },

    STREAK_BONUS: {
        MULTIPLIER: 0.1, // +10% de bono por cada acierto consecutivo
        MAX_STREAK: 10,
    }
};

/**
 * Rangos y Ligas
 */
export const ARENA_RANKS = [
    { id: 'aprendiz', label: 'Aprendiz del Pacto', minLevel: 1, color: '#94a3b8' },
    { id: 'guerrero', label: 'Guerrero de Luz', minLevel: 10, color: '#fbbf24' },
    { id: 'guardian', label: 'Guardián del Pacto', minLevel: 25, color: '#3b82f6' },
    { id: 'maestro', label: 'Maestro de la Verdad', minLevel: 50, color: '#8b5cf6' },
    { id: 'leyenda', label: 'Leyenda Eterna', minLevel: 100, color: '#ef4444' }
];

/**
 * Logros del Sistema
 */
export const ARENA_ACHIEVEMENTS = [
    { id: 'first_win', title: 'Primer Paso', description: 'Gana tu primer desafío en la arena', icon: '🏆' },
    { id: 'streak_5', title: 'Imparable', description: 'Logra una racha de 5 aciertos consecutivos', icon: '🔥' },
    { id: 'expert_win', title: 'Sabiduría Maestra', description: 'Completa un desafío nivel Experto', icon: '🧠' },
    { id: 'loyal_user', title: 'Fiel Guerrero', description: 'Juega 10 partidas en la arena', icon: '🛡️' },
    { id: 'top_rank', title: 'En la Cima', description: 'Entra en el Top 3 del ranking global', icon: '👑' }
];

import bgFacil from '../assets/bg-facil.png';
import bgMedio from '../assets/bg-medio.png';
import bgDificil from '../assets/bg-dificil.png';
import bgExperto from '../assets/bg-experto.png';

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
    },
    BACKGROUNDS: {
        facil: bgFacil,
        medio: bgMedio,
        dificil: bgDificil,
        experto: bgExperto
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
