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
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0e27] text-gray-900 dark:text-white p-4 pb-28 md:p-8 md:pt-24 md:pb-8 pt-24 selection:bg-blue-500/30">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header - Réplica Exacta Battle Pass (Opción 2) */}
                <motion.div
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative overflow-hidden bg-[#0a1128]/95 backdrop-blur-3xl rounded-[24px] border border-blue-500/30 p-8 md:p-10 shadow-[0_0_80px_rgba(0,0,0,1)] ring-1 ring-white/10"
                >
                    {/* Fondo Estrellado/Grid Estilo Gaming */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />

                    {/* Marca de Agua sutil */}
                    <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-screen" style={{ maskImage: 'radial-gradient(circle, black 0%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 70%)' }}>
                        <img src={ARENA_ASSETS.LOGO} alt="" className="w-full h-full object-contain scale-150 grayscale" />
                    </div>

                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14 relative z-10 w-full text-white">

                        {/* 1. Izquierda: Avatar con Nivel Elevado */}
                        <div className="shrink-0">
                            <AvatarDisplay
                                level={user.level}
                                rank={user.rank}
                                avatarUrl={user.avatar}
                                username={user.username}
                                layout="horizontal"
                            />
                        </div>

                        {/* 2. Centro: Identidad Detallada */}
                        <div className="flex-1 space-y-6 min-w-0 w-full lg:w-auto">
                            <div className="text-center lg:text-left">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] mb-1 uppercase italic leading-none text-white whitespace-nowrap overflow-hidden text-ellipsis">
                                    {user.name || 'VALKYRIE_07'}
                                </h1>
                                <p className="text-[#3ea6ff] font-bold uppercase tracking-[0.25em] text-[11px] md:text-[14px] drop-shadow-md">
                                    LEAGUE OF THE COVENANT
                                </p>
                            </div>

                            <div className="w-full max-w-2xl mx-auto lg:mx-0 py-2">
                                <ProgressBar currentXP={user.totalXP} level={user.level} />
                            </div>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">RANK {user.level}:</span>
                                    <span className="text-white font-black text-[12px] md:text-[14px] uppercase tracking-wider drop-shadow-sm">{user.rank.label}</span>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center text-[9px] font-black border border-blue-400/40 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">XP</div>
                                    <div className="w-6 h-6 rounded bg-gray-500/20 flex items-center justify-center text-[9px] font-black border border-gray-500/40 text-gray-400">XP</div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Derecha: Panel HUD de Estadísticas */}
                        <div className="shrink-0 w-full lg:w-[280px] bg-black/40 rounded-[24px] border border-blue-500/20 p-6 space-y-5 backdrop-blur-xl shadow-inner">
                            {[
                                { label: 'ARENA POINTS', value: user.totalXP.toLocaleString(), icon: '💠', color: 'text-[#3ea6ff]' },
                                { label: 'WINS', value: '132', icon: '🏆', color: 'text-gray-200' },
                                { label: 'GAMES PLAYED', value: '248', icon: '⚔️', color: 'text-gray-200' },
                                { label: 'K/D RATIO', value: '1.95', icon: '🎯', color: 'text-red-500' },
                                { label: 'SEASON PASS', value: `TIER ${user.level}`, icon: '🎁', color: 'text-white' }
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center gap-4 group cursor-default">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl border border-white/10 group-hover:border-blue-500/40 transition-all duration-300">
                                        {stat.icon}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.15em] leading-none mb-1.5">{stat.label}:</span>
                                        <span className={`text-[17px] font-black tracking-tighter ${stat.color} leading-none`}>{stat.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Navegación Refinada */}
                <div className="flex gap-1 bg-gray-200/50 dark:bg-[#1c1c1e]/80 p-1.5 rounded-full md:rounded-[28px] w-full md:w-fit mx-auto border border-gray-200 dark:border-white/5 backdrop-blur-2xl">
                    {[
                        { id: 'arena', label: '🏟️ Arena' },
                        { id: 'ranking', label: '🏆 Ranking' },
                        { id: 'logros', label: '✨ Logros' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 md:flex-none px-4 md:px-10 py-3.5 rounded-full text-[10px] md:text-sm font-black transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-white shadow-xl scale-105'
                                : 'text-gray-500 dark:text-white/20 hover:text-gray-700 dark:hover:text-white/40'
                                }`}
                        >
                            {tab.label}
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
                                            className="group relative h-64 rounded-[44px] overflow-hidden bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-white/5 p-8 flex flex-col justify-between transition-all shadow-xl hover:shadow-blue-500/10"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                            <div className="relative z-10 text-left">
                                                <div className="w-14 h-14 rounded-[20px] bg-white/5 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors shadow-inner">
                                                    <span className="text-3xl">{diff === 'facil' ? '🕯️' : diff === 'medio' ? '📜' : diff === 'dificil' ? '🔥' : '⚔️'}</span>
                                                </div>
                                                <h3 className="font-black text-2xl uppercase tracking-tighter capitalize leading-none text-gray-900 dark:text-white font-display">{diff}</h3>
                                                <p className="text-[10px] text-gray-400 dark:text-white/20 font-bold uppercase tracking-[0.2em] mt-3">Dificultad</p>
                                            </div>

                                            <div className="relative z-10 flex justify-between items-end">
                                                <div className="text-left">
                                                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1.5 opacity-60">Multiplicador</p>
                                                    <div className="font-mono font-black text-2xl text-gray-900 dark:text-white tracking-tighter">
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
                                    {arena.gameStatus !== 'finished' && (
                                        <button
                                            onClick={arena.resetArena}
                                            className="mb-8 flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-200/50 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
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
                                                <div className="text-center py-24 bg-white dark:bg-[#1c1c1e] rounded-[56px] w-full border border-gray-200 dark:border-white/5 shadow-2xl">
                                                    <div className="w-28 h-28 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                                        <span className="text-7xl">🏆</span>
                                                    </div>
                                                    <h2 className="text-5xl font-black uppercase tracking-tighter mb-4 text-gray-900 dark:text-white">Misión Cumplida</h2>
                                                    <p className="text-gray-500 dark:text-white/30 font-bold max-w-sm mx-auto mb-12 text-sm uppercase tracking-widest leading-relaxed">Tu sabiduría ha sido probada una vez más en los caminos del Reino.</p>
                                                    <button
                                                        onClick={arena.resetArena}
                                                        className="px-14 py-5 rounded-[24px] bg-blue-600 dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(37,99,235,0.2)] dark:shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
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

            {/* Modales Compartidos */}
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
