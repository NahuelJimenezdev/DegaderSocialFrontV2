import logoImg from '../assets/logo.svg';

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
 * Logros del Sistema - Nivel Fácil
 * Estructura optimizada para evitar duplicados y facilitar el check de lógica.
 */
export const ARENA_ACHIEVEMENTS = [
    // --- PROGRESIÓN POR PUNTOS (Puntos acumulados) ---
    { id: 'points_50', type: 'xp', value: 50, title: 'Semilla Plantada', description: 'Acumula 50 puntos', icon: '🌱' },
    { id: 'points_100', type: 'xp', value: 100, title: 'Primer Centenar', description: 'Acumula 100 puntos', icon: '💯' },
    { id: 'points_150', type: 'xp', value: 150, title: 'Buscador de Tesoros', description: 'Acumula 150 puntos', icon: '💎' },
    { id: 'points_200', type: 'xp', value: 200, title: 'Cimientos Fuertes', description: 'Acumula 200 puntos', icon: '🧱' },
    { id: 'points_250', type: 'xp', value: 250, title: 'Copa Rebosante', description: 'Acumula 250 puntos', icon: '🍷' },
    { id: 'points_300', type: 'xp', value: 300, title: 'Luz en Ascenso', description: 'Acumula 300 puntos', icon: '🕯️' },
    { id: 'points_350', type: 'xp', value: 350, title: 'Camino de Fe', description: 'Acumula 350 puntos', icon: '🛤️' },
    { id: 'points_400', type: 'xp', value: 400, title: 'Cuarto Creciente', description: 'Acumula 400 puntos', icon: '🌙' },
    { id: 'points_450', type: 'xp', value: 450, title: 'Tesoro Escondido', description: 'Acumula 450 puntos', icon: '🗝️' },
    { id: 'points_500', type: 'xp', value: 500, title: 'Hito del Camino', description: 'Punto medio del nivel fácil', icon: '🚩' },
    { id: 'points_550', type: 'xp', value: 550, title: 'Grano de Mostaza', description: 'Sigue acumulando sabiduría', icon: '🔘' },
    { id: 'points_600', type: 'xp', value: 600, title: 'Mitad de la Senda', description: '600 puntos alcanzados', icon: '🌗' },
    { id: 'points_650', type: 'xp', value: 650, title: 'Roca Firme', description: 'Tu conocimiento es sólido', icon: '🪨' },
    { id: 'points_700', type: 'xp', value: 700, title: 'Septuagésimo', description: '700 puntos acumulados', icon: '�️' },
    { id: 'points_750', type: 'xp', value: 750, title: 'Antorcha de Oro', description: 'Brillando en la arena', icon: '🔦' },
    { id: 'points_850', type: 'xp', value: 850, title: 'Escalador', description: 'Superando la montaña', icon: '🧗' },
    { id: 'points_950', type: 'xp', value: 950, title: 'Cerca de la Meta', description: 'Casi desbloqueas el nivel Medio', icon: '🏁' },
    { id: 'points_1000', type: 'xp', value: 1000, title: 'Milenario', description: '¡1000 puntos de pura verdad!', icon: '🎇' },
    { id: 'points_1100', type: 'xp', value: 1100, title: 'Umbral del Reino', description: 'A un paso del siguiente nivel', icon: '⛩️' },
    { id: 'points_1150', type: 'xp', value: 1150, title: 'Último Aliento', description: 'La meta está a la vista', icon: '🌬️' },
    { id: 'easy_master', type: 'xp', value: 1200, title: 'Consumado Es', description: 'Nivel Medio Desbloqueado', icon: '👑' },

    // --- RACHAS (Aciertos seguidos) ---
    { id: 'first_step', type: 'streak', value: 1, title: 'Primer Paso', description: 'Acierta tu primera pregunta', icon: '👣' },
    { id: 'streak_3', type: 'streak', value: 3, title: 'Triple Alianza', description: '3 aciertos consecutivos', icon: '☘️' },
    { id: 'streak_5', type: 'streak', value: 5, title: 'Imparable', description: '5 aciertos consecutivos', icon: '🔥' },
    { id: 'streak_7', type: 'streak', value: 7, title: 'Número Perfecto', description: '7 aciertos consecutivos', icon: '🌈' },
    { id: 'streak_10', type: 'streak', value: 10, title: 'Decálogo', description: '10 aciertos consecutivos', icon: '📜' },
    { id: 'streak_12', type: 'streak', value: 12, title: 'Doce Columnas', description: '12 aciertos consecutivos', icon: '🏛️' },
    { id: 'streak_15', type: 'streak', value: 15, title: 'Fuego Vivo', description: '15 aciertos consecutivos', icon: '💥' },
    { id: 'streak_18', type: 'streak', value: 18, title: 'Voz de Mando', description: '18 aciertos consecutivos', icon: '📢' },
    { id: 'streak_20', type: 'streak', value: 20, title: 'Visión Clara', description: '20 aciertos consecutivos', icon: '👁️' },
    { id: 'streak_25', type: 'streak', value: 25, title: 'Inquebrantable', description: 'Racha de 25 (Leyenda en Fácil)', icon: '⛓️' },

    // --- CANTIDAD TOTAL (Esfuerzo acumulado) ---
    { id: 'total_10', type: 'total_questions', value: 10, title: 'Pequeño Rebaño', description: 'Responde 10 preguntas', icon: '🐑' },
    { id: 'total_25', type: 'total_questions', value: 25, title: 'Estudiante Fiel', description: 'Responde 25 preguntas', icon: '📚' },
    { id: 'total_50', type: 'total_questions', value: 50, title: 'Medio Centenar', description: 'Responde 50 preguntas', icon: '📝' },
    { id: 'total_75', type: 'total_questions', value: 75, title: 'Vigilante', description: 'Responde 75 preguntas', icon: '🕵️' },
    { id: 'total_100', type: 'total_questions', value: 100, title: 'Centurión', description: 'Responde 100 preguntas', icon: '🛡️' },
    { id: 'total_150', type: 'total_questions', value: 150, title: 'Escriba', description: 'Responde 150 preguntas', icon: '✒️' },
    { id: 'total_200', type: 'total_questions', value: 200, title: 'Erudito Iniciante', description: 'Responde 200 preguntas', icon: '🎓' },

    // --- VELOCIDAD Y PRECISIÓN ---
    { id: 'fast_5', type: 'speed', value: 5, title: 'Reflejo de Luz', description: 'Responde en menos de 5 segundos', icon: '⚡' },
    { id: 'fast_3', type: 'speed', value: 3, title: 'Relámpago Sagrado', description: 'Responde en menos de 3 segundos', icon: '🌩️' },
    { id: 'fast_2', type: 'speed', value: 2, title: 'Relámpago de Fe', description: 'Responde en menos de 2 segundos', icon: '⚡' },
    { id: 'perfect_5', type: 'perfect_game', value: 5, title: 'Mano Limpia', description: 'Partida de 5 preguntas sin fallar', icon: '✨' },
    { id: 'perfect_10', type: 'perfect_game', value: 10, title: 'Sabiduría Plena', description: 'Partida de 10 preguntas sin fallar', icon: '🌟' },

    // --- PERSISTENCIA (Días seguidos) ---
    { id: 'daily_2', type: 'days_streak', value: 2, title: 'Caminante', description: 'Juega 2 días seguidos', icon: '👟' },
    { id: 'daily_3', type: 'days_streak', value: 3, title: 'Tres Dobleces', description: 'Juega 3 días seguidos', icon: '🧶' },
    { id: 'daily_5', type: 'days_streak', value: 5, title: 'Fidelidad Semanal', description: 'Juega 5 días seguidos', icon: '🗓️' },

    // --- OTROS ---
    { id: 'first_victory', type: 'misc', value: 1, title: 'Victoria Inicial', description: 'Completa tu primera partida', icon: '🏆' },
    { id: 'time_30', type: 'time_played', value: 1800, title: 'Constancia', description: 'Juega 30 minutos totales', icon: '⏳' }
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
