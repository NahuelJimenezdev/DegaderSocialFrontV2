import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../stores/useUserStore';
import { useArenaStore } from '../stores/useArenaStore';
import AvatarDisplay from './AvatarDisplay';
import ProgressBar from './ProgressBar';
import ChallengeCard from './ChallengeCard';
import ResultModal from './ResultModal';
import Leaderboard from './Leaderboard';
import AchievementGrid from './AchievementGrid';
import ArenaLoading from './ArenaLoading';
import { ARENA_ASSETS } from '../constants/arenaConfig';

const ArenaPage = () => {
    const [activeTab, setActiveTab] = useState('arena');
    const user = useUserStore();
    const arena = useArenaStore();

    useEffect(() => {
        user.fetchStatus();
    }, []);

    const handleLevelDifficulty = (diff) => {
        arena.startArena(diff);
    };

    const handleAnswer = (optionId) => {
        arena.submitAnswer(optionId, user.addXP);
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-28 md:p-8 md:pt-24 md:pb-8 pt-24 selection:bg-blue-500/30">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header - Perfil del Jugador Estilo Hero (iOS Clean) */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="relative overflow-hidden bg-[#1c1c1e]/40 backdrop-blur-3xl rounded-[48px] border border-white/5 p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)]"
                >
                    {/* Marca de Agua sutil (Refinada con Máscara) */}
                    <div
                        className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-screen"
                        style={{
                            maskImage: 'radial-gradient(circle, black 0%, transparent 70%)',
                            WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 70%)'
                        }}
                    >
                        <img src={ARENA_ASSETS.LOGO} alt="" className="w-full h-full object-contain scale-150 grayscale" />
                    </div>

                    <div className="flex flex-col items-center text-center relative z-10 space-y-8">
                        {/* Avatar con Nivel */}
                        <AvatarDisplay
                            level={user.level}
                            rank={user.rank}
                            avatarUrl={user.avatar}
                            username={user.username}
                        />

                        {/* Información del Guerrero */}
                        <div className="space-y-6 w-full max-w-lg mx-auto">
                            <div className="space-y-2">
                                <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-b from-white via-white to-white/20 bg-clip-text text-transparent">
                                    {user.name || 'Guerrero del Pacto'}
                                </h1>
                                <div className="flex items-center gap-4 justify-center">
                                    <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/10" />
                                    <p className="text-white/30 font-bold uppercase tracking-[0.4em] text-[10px]">La Senda del Reino</p>
                                    <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/10" />
                                </div>
                            </div>

                            {/* Píldora de XP */}
                            <div className="inline-flex items-center gap-3 bg-white/5 px-6 py-2.5 rounded-full border border-white/5 backdrop-blur-xl shadow-inner">
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Puntos de Arena</span>
                                <span className="text-xl font-mono font-bold tracking-tighter text-white">{user.totalXP.toLocaleString()}</span>
                            </div>

                            <div className="pt-4 max-w-sm mx-auto">
                                <ProgressBar currentXP={user.totalXP} level={user.level} />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Navegación Refinada (iOS Style Responsiva) */}
                <div className="flex gap-1 bg-[#1c1c1e]/80 p-1 md:p-1.5 rounded-full md:rounded-[28px] w-full max-w-sm md:w-fit mx-auto border border-white/5 backdrop-blur-2xl">
                    {[
                        { id: 'arena', label: '🏟️ Arena' },
                        { id: 'ranking', label: '🏆 Ranking' },
                        { id: 'logros', label: '✨ Logros' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 md:flex-none px-4 md:px-10 py-3 md:py-3.5 rounded-full md:rounded-[24px] text-[10px] md:text-xs font-black transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-white/10 text-white shadow-lg scale-[1.02] md:scale-105'
                                : 'text-white/20 hover:text-white/40'
                                }`}
                        >
                            <span className="truncate whitespace-nowrap">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Contenido Dinámico */}
                <AnimatePresence mode="wait">
                    {activeTab === 'arena' && (
                        <motion.div
                            key="arena"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center gap-10 py-4"
                        >
                            {arena.gameStatus === 'idle' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                                    {['facil', 'medio', 'dificil', 'experto'].map((diff) => (
                                        <motion.button
                                            key={diff}
                                            whileHover={{ y: -8, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleLevelDifficulty(diff)}
                                            className="group relative h-64 rounded-[44px] overflow-hidden bg-[#1c1c1e] border border-white/5 p-8 flex flex-col justify-between transition-all shadow-xl hover:shadow-blue-900/10"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                            <div className="relative z-10">
                                                <div className="w-14 h-14 rounded-[20px] bg-white/5 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors shadow-inner">
                                                    <span className="text-3xl">{diff === 'facil' ? '🕯️' : diff === 'medio' ? '📜' : diff === 'dificil' ? '🔥' : '⚔️'}</span>
                                                </div>
                                                <h3 className="font-black text-2xl uppercase tracking-tighter capitalize leading-none">{diff}</h3>
                                                <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] mt-3">Dificultad</p>
                                            </div>

                                            <div className="relative z-10 flex justify-between items-end">
                                                <div>
                                                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1.5 opacity-60">Multiplicador</p>
                                                    <div className="font-mono font-black text-2xl text-white tracking-tighter">
                                                        {diff === 'facil' ? '1.0x' : diff === 'medio' ? '1.5x' : diff === 'dificil' ? '2.5x' : '5.0x'}
                                                    </div>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white text-black transition-all">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                                                </div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            ) : (
                                <div className="w-full flex flex-col items-center">
                                    {/* Botón Volver Estilo iOS */}
                                    {arena.gameStatus !== 'finished' && (
                                        <button
                                            onClick={arena.resetArena}
                                            className="mb-8 flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                                            Volver a Niveles
                                        </button>
                                    )}

                                    {arena.isLoading ? (
                                        <ArenaLoading difficulty={arena.selectedDifficulty} />
                                    ) : (
                                        <>
                                            {arena.currentChallenge && (
                                                <ChallengeCard
                                                    challenge={arena.currentChallenge}
                                                    onAnswer={handleAnswer}
                                                    disabled={arena.gameStatus === 'result'}
                                                />
                                            )}
                                            {arena.gameStatus === 'finished' && (
                                                <div className="text-center py-24 bg-[#1c1c1e] rounded-[56px] w-full border border-white/5 shadow-2xl">
                                                    <div className="w-28 h-28 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                                        <span className="text-7xl">🏆</span>
                                                    </div>
                                                    <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">Misión Cumplida</h2>
                                                    <p className="text-white/30 font-bold max-w-sm mx-auto mb-12 text-sm uppercase tracking-widest leading-relaxed">Tu sabiduría ha sido probada una vez más en los caminos del Reino.</p>
                                                    <button
                                                        onClick={arena.resetArena}
                                                        className="px-14 py-5 rounded-[24px] bg-white text-black font-black text-xs uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                                                    >
                                                        Reiniciar Senda
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'ranking' && (
                        <motion.div
                            key="ranking"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                        >
                            <Leaderboard />
                        </motion.div>
                    )}

                    {activeTab === 'logros' && (
                        <motion.div
                            key="logros"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                        >
                            <AchievementGrid />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Modales Compartidos con Backdrop Refinado */}
            <AnimatePresence>
                {arena.gameStatus === 'result' && (
                    <ResultModal
                        result={arena.lastResult}
                        onNext={arena.nextChallenge}
                        onExit={arena.resetArena}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ArenaPage;
