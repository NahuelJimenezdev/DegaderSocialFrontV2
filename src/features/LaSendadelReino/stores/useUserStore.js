import { create } from 'zustand';
import { getLevelFromXP, calculateLevelProgress } from '../utils/progression';
import { ARENA_RANKS } from '../constants/arenaConfig';
import { ArenaService } from '../services/arenaService';

export const useUserStore = create((set, get) => ({
    totalXP: 0,
    level: 1,
    rank: ARENA_RANKS[0],
    achievements: [],
    lastLevelUp: null,
    // Datos reales del usuario de DegaderSocial
    name: '',
    avatar: '',
    username: '',
    location: { country: '', state: '' },
    isLoading: false,

    /**
     * Sincroniza el estado con el backend
     */
    fetchStatus: async () => {
        set({ isLoading: true });
        try {
            const response = await ArenaService.getStatus();
            // Desestructurar del wrapper { success, message, data }
            const data = response.data;
            const { arena, economy } = data;

            const currentXP = arena.xp || 0;
            const currentLevel = getLevelFromXP(currentXP);
            const currentRank = ARENA_RANKS.slice().reverse().find(r => currentLevel >= r.minLevel) || ARENA_RANKS[0];

            set({
                totalXP: currentXP,
                level: currentLevel,
                rank: currentRank,
                name: data.name || '',
                avatar: data.avatar || '',
                username: data.username || '',
                location: data.location || { country: '', state: '' },
                achievements: arena.achievements || [],
                isLoading: false
            });
        } catch (error) {
            console.error('Error fetching arena status:', error);
            set({ isLoading: false });
        }
    },

    /**
     * Añade XP al usuario y maneja la evolución de nivel (Sincronización manual opcional)
     */
    addXP: (amount) => {
        const newXP = get().totalXP + amount;
        const newLevel = getLevelFromXP(newXP);
        const oldLevel = get().level;

        let levelUpEvent = null;
        if (newLevel > oldLevel) {
            levelUpEvent = new Date().toISOString();
        }

        const newRank = ARENA_RANKS.slice().reverse().find(r => newLevel >= r.minLevel) || ARENA_RANKS[0];

        set({
            totalXP: newXP,
            level: newLevel,
            rank: newRank,
            lastLevelUp: levelUpEvent
        });

        return { leveledUp: newLevel > oldLevel, currentLevel: newLevel };
    },

    /**
     * Desbloquea un logro si no ha sido desbloqueado
     */
    unlockAchievement: (achievementId) => {
        if (!get().achievements.includes(achievementId)) {
            set((state) => ({
                achievements: [...state.achievements, achievementId]
            }));
            return true;
        }
        return false;
    },

    /**
     * Obtiene porcentaje de progreso del nivel actual
     */
    getProgress: () => {
        return calculateLevelProgress(get().totalXP, get().level);
    }
}));
