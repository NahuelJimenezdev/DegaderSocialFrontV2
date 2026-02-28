/**
 * Store de Arena - La Senda del Reino
 */
import { create } from 'zustand';
import { ArenaService } from '../services/arenaService';
import { calculateGainedXP } from '../utils/progression';
import { ARENA_ACHIEVEMENTS } from '../constants/arenaConfig';

export const useArenaStore = create((set, get) => ({
    currentChallenge: null,
    challenges: [],
    currentIndex: 0,
    streak: 0,
    bestStreak: 0,
    isLoading: false,
    gameStatus: 'idle', // 'idle' | 'playing' | 'result' | 'finished'
    lastResult: null, // { correct: boolean, gainedXP: number }
    accumulatedXP: 0,
    accumulatedScore: 0,
    correctQuestionIds: [],
    fastestAnswer: 999, // Segundos
    lastQuestionStartTime: null,
    lastSessionAchievements: [],
    isOverlayVisible: false, // New: track if a full-screen overlay is showing

    /**
     * Inicia una sesión de desafíos
     */
    startArena: async (difficulty) => {
        set({
            isLoading: true,
            gameStatus: 'playing',
            streak: 0,
            currentIndex: 0,
            lastResult: null,
            selectedDifficulty: difficulty,
            fastestAnswer: 999,
            lastQuestionStartTime: Date.now()
        });
        const response = await ArenaService.getChallenges(difficulty);
        const challenges = response.data || [];
        set({
            challenges,
            currentChallenge: challenges[0],
            isLoading: false,
            isOverlayVisible: false
        });
    },

    /**
     * Procesa la respuesta de un usuario
     */
    submitAnswer: async (answerId, addXPCallback) => {
        const { currentChallenge, streak, bestStreak, challenges, currentIndex, accumulatedXP = 0, accumulatedScore = 0, fastestAnswer } = get();
        const userStore = (await import('./useUserStore')).useUserStore;

        const isCorrect = currentChallenge.correctAnswer === answerId;
        const timeTaken = (Date.now() - get().lastQuestionStartTime) / 1000;

        let newStreak = isCorrect ? streak + 1 : 0;
        let newBestStreak = Math.max(bestStreak, newStreak);
        let gainedXP = 0;

        if (isCorrect) {
            gainedXP = calculateGainedXP(currentChallenge.level, streak);
            addXPCallback(gainedXP);
        }

        const result = {
            correct: isCorrect,
            gainedXP,
            correctAnswer: currentChallenge.correctAnswer,
            timeTaken
        };

        const currentAchievements = userStore.getState().achievements || [];
        const newUnlocked = ARENA_ACHIEVEMENTS.filter(a => {
            if (currentAchievements.includes(a.id)) return false;

            if (a.type === 'streak' && newBestStreak >= a.value) return true;
            if (a.type === 'speed' && isCorrect && timeTaken <= a.value) return true;
            if (a.type === 'xp' && (userStore.getState().totalXP + gainedXP) >= a.value) return true;

            return false;
        });

        if (newUnlocked.length > 0) {
            const { showAchievementToast } = await import('../components/AchievementNotification');
            newUnlocked.forEach(a => {
                userStore.getState().unlockAchievement(a.id);
                showAchievementToast(a);
            });
        }

        set((state) => ({
            streak: newStreak,
            bestStreak: newBestStreak,
            lastResult: result,
            gameStatus: 'result',
            accumulatedXP: state.accumulatedXP + gainedXP,
            accumulatedScore: state.accumulatedScore + (isCorrect ? 1 : 0),
            fastestAnswer: isCorrect ? Math.min(state.fastestAnswer, timeTaken) : state.fastestAnswer,
            correctQuestionIds: isCorrect
                ? [...state.correctQuestionIds, currentChallenge._id]
                : state.correctQuestionIds
        }));
    },

    /**
     * Pasa al siguiente desafío o finaliza
     */
    nextChallenge: async () => {
        const { challenges, currentIndex, streak } = get();
        const nextIndex = currentIndex + 1;

        if (nextIndex < challenges.length) {
            set({
                currentIndex: nextIndex,
                currentChallenge: challenges[nextIndex],
                gameStatus: 'playing',
                lastResult: null,
                lastQuestionStartTime: Date.now()
            });
        } else {
            // FIN DE LA ARENA - Enviar resultados al backend
            set({ isLoading: true });
            try {
                const sessionData = {
                    level: challenges[0]?.level || 'facil',
                    score: get().accumulatedScore || 0,
                    xpEarned: get().accumulatedXP || 0,
                    correctQuestionIds: get().correctQuestionIds || [],
                    duration: 60, // Mock de duración
                    totalQuestions: challenges.length,
                    bestStreak: get().bestStreak,
                    fastestAnswer: get().fastestAnswer
                };

                const response = await ArenaService.submitResult(sessionData);
                const unlocked = response.data?.unlockedAchievements || [];

                // IMPORTANTE: Refrescar el perfil global para mostrar los puntos reales persistidos
                const userStore = (await import('./useUserStore')).useUserStore;
                if (userStore) {
                    await userStore.getState().fetchStatus();
                }

                set({
                    gameStatus: 'finished',
                    currentChallenge: null,
                    isLoading: false,
                    lastSessionAchievements: unlocked,
                    isOverlayVisible: true
                });
            } catch (error) {
                console.error('Error enviando resultados:', error);
                const msg = error.response?.data?.message || 'Error de conexión con el servidor de Arena';
                alert(`⚠️ NO SE GUARDARON LOS PUNTOS: ${msg}`);
                set({ gameStatus: 'finished', currentChallenge: null, isLoading: false });
            }
        }
    },

    /**
     * Resetea la arena
     */
    resetArena: () => {
        set({
            currentChallenge: null,
            challenges: [],
            currentIndex: 0,
            streak: 0,
            gameStatus: 'idle',
            lastResult: null,
            isLoading: false,
            isOverlayVisible: false,
            accumulatedXP: 0,
            accumulatedScore: 0,
            correctQuestionIds: [],
            lastSessionAchievements: []
        });
    }
}));
