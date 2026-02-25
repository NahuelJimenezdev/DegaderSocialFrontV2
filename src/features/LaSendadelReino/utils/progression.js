/**
 * Utilidades para cálculos de progresión en La Senda del Reino
 */
import { ARENA_CONFIG } from '../constants/arenaConfig';

const { BASE_XP_PER_LEVEL, GROWTH_FACTOR } = ARENA_CONFIG.PROGRESSION;

/**
 * Calcula el XP total necesario para alcanzar un nivel específico
 * @param {number} level 
 * @returns {number}
 */
export const getXPForLevel = (level) => {
    if (level <= 1) return 0;
    return Math.floor(BASE_XP_PER_LEVEL * Math.pow(GROWTH_FACTOR, level - 1));
};

/**
 * Calcula el progreso actual (0 a 100) dentro de un nivel
 * @param {number} currentXP 
 * @param {number} level 
 * @returns {number}
 */
export const calculateLevelProgress = (currentXP, level) => {
    const xpStart = getXPForLevel(level);
    const xpEnd = getXPForLevel(level + 1);
    const xpRequired = xpEnd - xpStart;
    const xpEarnedInLevel = currentXP - xpStart;

    return Math.min(100, Math.max(0, (xpEarnedInLevel / xpRequired) * 100));
};

/**
 * Determina el nivel basado en el XP total acumulado
 * @param {number} totalXP 
 * @returns {number}
 */
export const getLevelFromXP = (totalXP) => {
    let level = 1;
    while (getXPForLevel(level + 1) <= totalXP) {
        level++;
    }
    return level;
};

/**
 * Calcula el XP ganado en un desafío
 * @param {string} difficulty - 'facil' | 'medio' | 'dificil' | 'experto'
 * @param {number} streak - Racha actual de aciertos
 * @returns {number}
 */
export const calculateGainedXP = (difficulty, streak) => {
    const config = ARENA_CONFIG.LEVELS[difficulty.toUpperCase()];
    if (!config) return 0;

    const baseXP = config.baseXP;
    const streakBonus = Math.min(streak * ARENA_CONFIG.STREAK_BONUS.MULTIPLIER, ARENA_CONFIG.STREAK_BONUS.MAX_STREAK * ARENA_CONFIG.STREAK_BONUS.MULTIPLIER);

    return Math.floor(baseXP * (1 + streakBonus));
};
