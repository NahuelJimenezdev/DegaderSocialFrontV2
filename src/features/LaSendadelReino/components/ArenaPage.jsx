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
import LevelUnlockedModal from './LevelUnlockedModal';
import ArenaSplashScreen from './ArenaSplashScreen';
import { ARENA_ASSETS, ARENA_ACHIEVEMENTS } from '../constants/arenaConfig';
import { Toaster } from 'react-hot-toast';
import AchievementDetailModal from './AchievementDetailModal';
import StickyArenaHeader from './StickyArenaHeader';
import confetti from 'canvas-confetti';
import '../styles/ArenaMobile.css';

const ArenaPage = () => {
    const [activeTab, setActiveTab] = useState('arena');
    const user = useUserStore();
    const arena = useArenaStore();
    const [showLevelModal, setShowLevelModal] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [showChallenge, setShowChallenge] = useState(false);
    const [viewedAchievements, setViewedAchievements] = useState([]);
    const [selectedAchievement, setSelectedAchievement] = useState(null);
    const [showStickyHeader, setShowStickyHeader] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 250) {
                setShowStickyHeader(true);
            } else {
                setShowStickyHeader(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setIsInitialLoading(false), 4500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Al resetear la arena, ocultar el desafío para el próximo loader
        if (arena.gameStatus === 'idle') {
            setShowChallenge(false);
        }
    }, [arena.gameStatus]);

    useEffect(() => {
        // Mostrar modal si se acaba de desbloquear easy_master
        if (user.achievements.includes('easy_master') && !localStorage.getItem('saw_medio_unlock')) {
            setShowLevelModal(true);
            localStorage.setItem('saw_medio_unlock', 'true');
        }
    }, [user.achievements]);

    useEffect(() => {
        user.fetchStatus();
    }, []);

    const handleLevelDifficulty = (diff) => {
        setShowChallenge(false);
        arena.startArena(diff);
        // Asegurarse de que el overlay esté marcado como visible para ocultar navbars
        useArenaStore.setState({ isOverlayVisible: true });
    };

    const handleAnswer = (optionId) => {
        arena.submitAnswer(optionId, user.addXP);
    };

    const handleAchievementClick = (ach) => {
        // Confetti explosion
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f9c61f', '#ffffff', '#3b82f6']
        });

        // Show detail modal
        setSelectedAchievement(ach);
        
        // Mark as viewed to pass the pulse to the next one
        if (!viewedAchievements.includes(ach.id)) {
            setViewedAchievements(prev => [...prev, ach.id]);
        }
    };

    return (
        <>
            {/* Cabecera Sticky Móvil (Solo Mobile) */}
            <StickyArenaHeader 
                user={user} 
                progress={user.getProgress()} 
                isVisible={showStickyHeader && !isInitialLoading && arena.gameStatus === 'idle'} 
            />

            <AnimatePresence mode="wait">
                {isInitialLoading ? (
                    <ArenaSplashScreen key="splash" onFinish={() => setIsInitialLoading(false)} />
                ) : (
                    <motion.div
                        key="main-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="min-h-screen bg-gray-50 dark:bg-[#0a0e27] text-gray-900 dark:text-white p-4 pb-28 md:p-8 md:pt-24 md:pb-8 pt-24 selection:bg-blue-500/30"
                    >
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

                        {/* 1. Izquierda: Avatar (Sin info para evitar duplicado) */}
                        <div className="shrink-0">
                            <AvatarDisplay
                                level={user.level}
                                rank={user.rank}
                                avatarUrl={user.avatar}
                                username={user.username}
                                showInfo={false}
                            />
                        </div>

                        {/* 2. Centro: Identidad y Progreso (Centrado en Mobile, Izquierda en PC) */}
                        <div className="flex-1 space-y-4 min-w-0 w-full lg:max-w-xl text-center lg:text-left">
                            <div>
                                <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter drop-shadow-[0_4px_15px_rgba(0,0,0,0.6)] mb-1 uppercase italic leading-none text-white whitespace-nowrap overflow-hidden text-ellipsis">
                                    {user.username || 'VALKYRIE_07'}
                                </h1>
                                <p className="text-[#3ea6ff] font-black uppercase tracking-[0.35em] text-[10px] md:text-[13px] drop-shadow-md">
                                    LA SENDA DEL REINO
                                </p>
                            </div>

                            <div className="w-full py-2">
                                <ProgressBar currentXP={user.totalXP || 0} level={user.level || 1} />
                            </div>

                            {/* Línea Divisoria de Rango (Visible en todos, sutil en PC) */}
                            <div className="flex items-center justify-center lg:justify-start gap-4 py-2 opacity-80 max-w-sm lg:max-w-none mx-auto lg:mx-0">
                                <div className="h-[1px] flex-1 lg:hidden bg-gradient-to-r from-transparent to-white/30" />
                                <span className="text-white/60 text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] whitespace-nowrap">
                                    RANK {user.level}: <span className="text-white font-black">{user.rank.label}</span>
                                </span>
                                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/30" />
                            </div>
                        </div>

                        {/* 3. Derecha: Panel HUD de Estadísticas (Fijo en PC, Lista en Mobile) */}
                        <div className="shrink-0 w-full lg:w-[280px] bg-black/40 rounded-[24px] border border-blue-500/20 p-5 md:p-6 backdrop-blur-3xl shadow-2xl space-y-1 lg:space-y-4">
                            {[
                                { label: 'Arena Points:', value: (user.totalXP || 0).toLocaleString(), icon: '💠', color: 'text-[#3ea6ff]' },
                                { label: 'Wins:', value: (user.wins || 0).toLocaleString(), icon: '🏆', color: 'text-gray-200' },
                                { label: 'Games Played:', value: (user.gamesPlayed || 0).toLocaleString(), icon: '⚔️', color: 'text-gray-200' },
                                { label: 'K/D Ratio:', value: user.kdRatio || '1.95', icon: '🎯', color: 'text-red-500' }
                            ].map((stat, i) => (
                                <div key={i} className={`flex items-center justify-between lg:justify-start lg:gap-4 py-2.5 lg:py-0 px-2 lg:px-0 ${i !== 3 ? 'border-b border-white/5 lg:border-none' : ''}`}>
                                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-white/5 flex items-center justify-center text-lg lg:text-xl border border-white/10 shadow-inner">
                                        {stat.icon}
                                    </div>
                                    <div className="flex flex-col text-right lg:text-left">
                                        <span className="text-[8px] lg:text-[9px] font-black text-white/30 uppercase tracking-[0.2em] leading-none mb-1">{stat.label}</span>
                                        <span className={`text-[15px] lg:text-[17px] font-black tracking-tighter ${stat.color} leading-none`}>{stat.value}</span>
                                    </div>
                                </div>
                            ))}
                            {/* Season Pass resumido para PC */}
                            <div className="hidden lg:flex items-center gap-4 pt-2 border-t border-white/10 transition-all">
                                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-xl border border-yellow-400/20">🎁</div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] leading-none mb-1">SEASON PASS:</span>
                                    <span className="text-[17px] font-black tracking-tighter text-white leading-none italic uppercase">Tier {user.level}</span>
                                </div>
                            </div>
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
                                : 'text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/60'
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
                                    {['facil', 'medio', 'dificil', 'experto'].map((diff) => {
                                        const isLocked = diff !== 'facil' && !user.achievements.includes('easy_master');
                                        
                                        return (
                                            <motion.button
                                                key={diff}
                                                whileHover={!isLocked ? { y: -8, scale: 1.02 } : {}}
                                                whileTap={!isLocked ? { scale: 0.98 } : {}}
                                                onClick={() => !isLocked && handleLevelDifficulty(diff)}
                                                disabled={isLocked}
                                                className={`group relative h-64 rounded-[44px] overflow-hidden bg-white dark:bg-[#1c1c1e] border p-8 flex flex-col justify-between transition-all shadow-xl ${isLocked 
                                                    ? 'opacity-80 grayscale cursor-not-allowed border-gray-200 dark:border-white/5' 
                                                    : 'border-gray-200 dark:border-white/5 hover:shadow-blue-500/10'}`}
                                            >
                                                {/* Imagen de Fondo Temática */}
                                                <div
                                                    className={`absolute inset-0 z-0 transition-opacity duration-500 ${isLocked ? 'opacity-20' : 'opacity-80 dark:opacity-40 group-hover:opacity-90 dark:group-hover:opacity-60'}`}
                                                    style={{
                                                        backgroundImage: `url(${ARENA_ASSETS.BACKGROUNDS[diff]})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center'
                                                    }}
                                                />

                                                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/20 to-black/40 dark:from-black/40 dark:via-transparent dark:to-black/20 z-0" />

                                                <div className="relative z-10 text-left">
                                                    <div className="w-14 h-14 rounded-[20px] bg-black/20 dark:bg-white/5 backdrop-blur-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-white/20 shadow-lg ring-1 ring-white/10">
                                                        <span className="text-3xl filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                                                            {isLocked ? '🔒' : (diff === 'facil' ? '🕯️' : diff === 'medio' ? '📜' : diff === 'dificil' ? '🔥' : '⚔️')}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-black text-3xl uppercase tracking-tighter capitalize leading-none text-white font-display drop-shadow-md">
                                                        {diff}
                                                    </h3>
                                                    <p className="text-[9px] text-white/50 font-black uppercase tracking-[0.3em] mt-3">
                                                        {isLocked ? 'Próximamente' : 'Dificultad'}
                                                    </p>
                                                </div>

                                                <div className="relative z-10 flex justify-between items-end pt-4 border-t border-white/10">
                                                    <div className="text-left">
                                                        <p className="text-[9px] text-blue-400 dark:text-blue-300 font-black uppercase tracking-[0.2em] mb-1 opacity-80">
                                                            Multiplicador
                                                        </p>
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="font-black text-3xl text-white tracking-tighter">
                                                                {diff === 'facil' ? '1.0' : diff === 'medio' ? '1.5' : diff === 'dificil' ? '2.5' : '5.0'}
                                                            </span>
                                                            <span className="text-xs font-black text-blue-400/80">X</span>
                                                        </div>
                                                    </div>
                                                    {!isLocked && (
                                                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all shadow-lg">
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.button>
                                        );
                                    })}
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

                                    {(!arena.isLoading && showChallenge) ? (
                                        <>
                                            {arena.currentChallenge && (
                                                <ChallengeCard
                                                    key={arena.currentChallenge._id}
                                                    challenge={arena.currentChallenge}
                                                    onAnswer={handleAnswer}
                                                    disabled={arena.gameStatus === 'result'}
                                                />
                                            )}
                                            {arena.gameStatus === 'finished' && (
                                                <div className="fixed inset-0 z-[100] bg-[#0a0e27]/80 backdrop-blur-xl flex items-center justify-center p-6 text-center overflow-y-auto">
                                                    {/* Glow effect */}
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>
                                                    
                                                    <div className="relative z-10 w-full max-w-lg bg-white/5 backdrop-blur-md rounded-[3rem] p-12 border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] transition-all">
                                                        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-yellow-500/20 shadow-lg">
                                                            <span className="text-6xl filter drop-shadow-lg">🏆</span>
                                                        </div>
                                                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 italic text-transparent bg-clip-text bg-gradient-to-r from-[#f9c61f] via-yellow-200 to-[#f9c61f] drop-shadow-sm">
                                                            Misión Cumplida
                                                        </h2>
                                                        <p className="text-white font-bold max-w-sm mx-auto mb-10 text-[10px] uppercase tracking-[0.3em] leading-relaxed drop-shadow-md">
                                                            Tu sabiduría ha sido probada una vez más en los caminos del Reino.
                                                        </p>

                                                        {/* Logros de la sesión */}
                                                        {arena.lastSessionAchievements.length > 0 && (
                                                            <div className="flex flex-wrap justify-center gap-6 mb-12">
                                                                {arena.lastSessionAchievements.map((id, index) => {
                                                                    const ach = ARENA_ACHIEVEMENTS.find(a => a.id === id);
                                                                    if (!ach) return null;
                                                                    
                                                                    const isViewed = viewedAchievements.includes(id);
                                                                    const isCurrentToClick = !isViewed && (index === 0 || viewedAchievements.includes(arena.lastSessionAchievements[index - 1]));

                                                                    return (
                                                                        <motion.div 
                                                                            key={id}
                                                                            initial={{ scale: 0, rotate: -30 }}
                                                                            animate={{ 
                                                                                scale: 1, 
                                                                                rotate: 0,
                                                                            }}
                                                                            className="flex flex-col items-center gap-3 relative group"
                                                                        >
                                                                            <motion.div
                                                                                animate={isCurrentToClick ? {
                                                                                    scale: [1, 1.15, 1],
                                                                                    boxShadow: [
                                                                                        "0 0 0px rgba(249,198,31,0)",
                                                                                        "0 0 20px rgba(249,198,31,0.5)",
                                                                                        "0 0 0px rgba(249,198,31,0)"
                                                                                    ]
                                                                                } : {}}
                                                                                transition={isCurrentToClick ? {
                                                                                    duration: 2,
                                                                                    repeat: Infinity,
                                                                                    ease: "easeInOut"
                                                                                } : {}}
                                                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                                                whileTap={{ scale: 1.3 }}
                                                                                onClick={() => handleAchievementClick(ach)}
                                                                                className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl cursor-pointer transition-all duration-300 border-2 ${
                                                                                    isViewed 
                                                                                    ? 'bg-blue-500/20 border-blue-400/30' 
                                                                                    : 'bg-white/5 border-white/10 hover:border-yellow-500/50'
                                                                                } shadow-lg relative`}
                                                                            >
                                                                                {ach.icon}
                                                                                
                                                                                {/* Pulse ring for attention */}
                                                                                {isCurrentToClick && (
                                                                                    <div className="absolute inset-0 rounded-[1.5rem] border-2 border-yellow-500/50 animate-ping opacity-75" />
                                                                                )}
                                                                                
                                                                                {/* Checkmark for viewed */}
                                                                                {isViewed && (
                                                                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-[#0a0e27]">
                                                                                        <span className="material-symbols-outlined text-[14px] text-white font-black">check</span>
                                                                                    </div>
                                                                                )}
                                                                            </motion.div>
                                                                            <span className={`text-[8px] font-black uppercase tracking-widest transition-colors ${isViewed ? 'text-blue-400' : 'text-yellow-500'}`}>
                                                                                {ach.title}
                                                                            </span>
                                                                        </motion.div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col items-center gap-4 w-full max-w-xs mx-auto">
                                                            <button
                                                                onClick={() => handleLevelDifficulty(arena.selectedDifficulty)}
                                                                className="w-full px-12 py-5 rounded-2xl bg-[#f9c61f] text-black font-black text-sm uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_15px_40px_rgba(249,198,31,0.3)] border border-yellow-400/50"
                                                            >
                                                                Continuar Senda
                                                            </button>
                                                            <button
                                                                onClick={arena.resetArena}
                                                                className="w-full px-8 py-4 rounded-2xl bg-white/5 text-white/40 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all border border-white/5"
                                                            >
                                                                Volver al Menú
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <ArenaLoading 
                                            difficulty={arena.selectedDifficulty} 
                                            onReady={() => setShowChallenge(true)} 
                                        />
                                    )}

                                    {/* Achievement Detail Overlay */}
                                    <AchievementDetailModal 
                                        achievement={selectedAchievement}
                                        isOpen={!!selectedAchievement}
                                        onClose={() => setSelectedAchievement(null)}
                                    />
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
            {/* Navigations and content already closed above */}

            <AnimatePresence>
                {arena.gameStatus === 'result' && (
                    <ResultModal
                        result={arena.lastResult}
                        onNext={arena.nextChallenge}
                        onExit={arena.resetArena}
                    />
                )}
            </AnimatePresence>

            <LevelUnlockedModal 
                isOpen={showLevelModal} 
                levelName="Medio" 
                onClose={() => setShowLevelModal(false)} 
            />

            <Toaster position="bottom-center" reverseOrder={false} />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ArenaPage;
