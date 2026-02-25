/**
 * Store de Arena - La Senda del Reino
 */
import { create } from 'zustand';
import { ArenaService } from '../services/arenaService';
import { calculateGainedXP } from '../utils/progression';

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
            selectedDifficulty: difficulty
        });
        const response = await ArenaService.getChallenges(difficulty);
        const challenges = response.data || [];
        set({
            challenges,
            currentChallenge: challenges[0],
            isLoading: false
        });
    },

    /**
     * Procesa la respuesta de un usuario
     */
    submitAnswer: (answerId, addXPCallback) => {
        const { currentChallenge, streak, bestStreak, challenges, currentIndex, accumulatedXP = 0, accumulatedScore = 0 } = get();
        const isCorrect = currentChallenge.correctAnswer === answerId;

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
            correctAnswer: currentChallenge.correctAnswer
        };

        set((state) => ({
            streak: newStreak,
            bestStreak: newBestStreak,
            lastResult: result,
            gameStatus: 'result',
            accumulatedXP: state.accumulatedXP + gainedXP,
            accumulatedScore: state.accumulatedScore + (isCorrect ? 1 : 0),
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
                lastResult: null
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
                    totalQuestions: challenges.length
                };

                await ArenaService.submitResult(sessionData);
                set({ gameStatus: 'finished', currentChallenge: null, isLoading: false });
            } catch (error) {
                console.error('Error enviando resultados:', error);
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
            accumulatedXP: 0,
            accumulatedScore: 0,
            correctQuestionIds: []
        });
    }
}));
