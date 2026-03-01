import React, { useState, useEffect, useRef } from 'react';
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
import { getXPForLevel } from '../utils/progression';
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
    const [scrollProgress, setScrollProgress] = useState(0); // 0 at top, 1 at threshold
    const cardRef = useRef(null);
    const rafRef = useRef(null);
    const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

    // Función para formatear el nombre: Primer Nombre + Primer Apellido
    const formatDisplayName = (name) => {
        if (!name) return 'VALKYRIE_07';
        // Limpiar puntos y separar por espacios
        const parts = name.replace(/\./g, ' ').split(' ').filter(p => p.length > 0);
        if (parts.length <= 1) return name;
        return `${parts[0]} ${parts[parts.length - 1]}`;
    };

    const displayName = formatDisplayName(user.username);

    // Detectar cambios de tema
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const handleScroll = (e) => {
            const target = e.target;
            const isMainContent = target.classList?.contains('main-content');
            const isWindow = target === window || target === document || target === document.documentElement;

            if (!isMainContent && !isWindow) return;

            // Throttle con requestAnimationFrame para no bloquear el hilo principal en mobile
            if (rafRef.current) return;
            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null;

                // Solo activar efecto sticky en mobile (< 1024px)
                if (window.innerWidth >= 1024) {
                    // En desktop siempre mostrar card, nunca sticky header
                    setScrollProgress(0);
                    setShowStickyHeader(false);
                    return;
                }

                const scrollTop = target.scrollTop !== undefined ? target.scrollTop : window.scrollY;
                const cardHeight = cardRef.current?.offsetHeight || 240;
                const threshold = Math.max(cardHeight - 104, 1);

                const progress = Math.min(scrollTop / threshold, 1);
                setScrollProgress(progress);
                setShowStickyHeader(scrollTop > threshold);
            });
        };

        window.addEventListener('scroll', handleScroll, { capture: true, passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll, { capture: true });
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
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
        // Al cambiar de pestaña, resetear el scroll de .main-content (el contenedor real en Degader)
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.scrollTop = 0;
        }
    }, [activeTab]);

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
                displayName={displayName}
                progress={((user.totalXP / (getXPForLevel(user.level + 1) || 1200)) * 100)}
                isVisible={showStickyHeader}
                opacity={scrollProgress}
                isSticky={true}
            />

            <AnimatePresence mode="wait">
                {isInitialLoading ? (
                    <ArenaSplashScreen key="splash" onFinish={() => setIsInitialLoading(false)} />
                ) : (
                    <motion.div
                        className="arena-main-wrapper min-h-screen bg-gray-50 dark:bg-[#0a0e27] text-gray-900 dark:text-white p-4 pt-16 pb-32 md:p-8 md:pt-20 md:pb-8 selection:bg-blue-500/30"
                    >
                        <div className="max-w-6xl mx-auto space-y-6">

                            {/* Header - Diseño Vertical Elegante (Réplica Opción 2) */}
                            <div
                                ref={cardRef}
                                className={`arena-vertical-card-wrapper ${scrollProgress >= 1 ? 'pointer-events-none opacity-0' : ''}`}
                                style={{
                                    opacity: 1 - scrollProgress,
                                    visibility: scrollProgress >= 1 ? 'hidden' : 'visible'
                                }}
                            >
                                <motion.div
                                    style={{
                                        opacity: 1 - scrollProgress,
                                        scale: 1 - (scrollProgress * 0.05),
                                        translateY: -scrollProgress * 20
                                    }}
                                    className={`relative overflow-hidden backdrop-blur-3xl rounded-[24px] border p-6 md:p-10 shadow-xl ring-1 ${isDark ? 'bg-[#0a1128]/95 border-blue-500/30 shadow-[0_0_80px_rgba(0,0,0,0.8)] ring-white/10' : 'bg-white/95 border-gray-200 ring-black/5'}`}
                                >
                                    {/* Textura de puntos de fondo */}
                                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: isDark ? 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)' : 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.07) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                                    {/* Logo marca de agua - img tag igual que en cabecera */}
                                    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
                                        <img
                                            src={ARENA_ASSETS.LOGO}
                                            alt=""
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: '150%',
                                                height: 'auto',
                                                objectFit: 'contain',
                                                opacity: isDark ? 0.28 : 0.15,
                                                filter: isDark ? 'none' : 'grayscale(1)',
                                            }}
                                        />
                                    </div>
                                    {/* Gradiente decorativo */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-purple-600/10 pointer-events-none" />

                                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-12">
                                        {/* Avatar con anillo de luz */}
                                        <div className="relative group">
                                            <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                            <AvatarDisplay
                                                level={user.level}
                                                rank={user.rank}
                                                avatarUrl={user.avatar}
                                                username={user.username}
                                                showInfo={false}
                                            />
                                        </div>

                                        <div className="flex-1 space-y-6 w-full text-center md:text-left">
                                            <div className="space-y-1">
                                                <h1 className={`text-xl md:text-3xl lg:text-5xl font-black tracking-tighter uppercase italic leading-tight drop-shadow-sm whitespace-nowrap overflow-hidden text-ellipsis mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {displayName}
                                                </h1>
                                                <div className="flex items-center justify-center md:justify-start gap-3">
                                                    <div className="h-[2px] w-8 bg-blue-500/50" />
                                                    <p className="text-[#3ea6ff] font-black uppercase tracking-[0.4em] text-[10px]">
                                                        LA SENDA DEL REINO
                                                    </p>
                                                    <div className="h-[2px] w-8 bg-blue-500/50" />
                                                </div>
                                            </div>

                                            <div className="max-w-md mx-auto md:mx-0">
                                                <ProgressBar currentXP={user.totalXP || 0} level={user.level || 1} />
                                            </div>

                                            {/* HUD de Estadísticas Vertical (Replica Opción 2) */}
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mt-6">
                                                {[
                                                    { label: 'POINTS', value: (user.totalXP || 0).toLocaleString(), icon: '💠', color: 'text-blue-400' },
                                                    { label: 'WINS', value: user.wins || 0, icon: '🏆', color: 'text-yellow-400' },
                                                    { label: 'GAMES', value: user.gamesPlayed || 0, icon: '⚔️', color: 'text-gray-300' },
                                                    { label: 'K/D', value: user.kdRatio || '0.00', icon: '🎯', color: 'text-red-400' }
                                                ].map((stat, i) => (
                                                    <div key={i} className={`backdrop-blur-md px-4 py-3 rounded-2xl border transition-colors group ${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-gray-100 border-gray-200 hover:bg-gray-200'}`}>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs group-hover:scale-110 transition-transform">{stat.icon}</span>
                                                            <span className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{stat.label}</span>
                                                        </div>
                                                        <span className={`text-xl font-black italic tracking-tighter ${stat.color}`}>
                                                            {stat.value}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Pestañas de Navegación - siempre en el flujo del documento */}
                            <div className="arena-nav-container" style={{ visibility: showStickyHeader ? 'hidden' : 'visible', pointerEvents: showStickyHeader ? 'none' : 'auto' }}>
                                <div className="flex gap-1 bg-gray-200/50 dark:bg-[#1c1c1e]/80 p-1.5 rounded-full w-full md:w-fit mx-auto border border-gray-200 dark:border-white/5 backdrop-blur-2xl">
                                    {[
                                        { id: 'arena', label: '🏟️ Arena' },
                                        { id: 'ranking', label: '🏆 Ranking' },
                                        { id: 'logros', label: '✨ Logros' }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex-1 md:flex-none px-6 py-2.5 rounded-full text-xs md:text-sm font-black transition-all duration-300 ${activeTab === tab.id
                                                ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-[1.02]'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-300/50 dark:hover:bg-white/5'
                                                }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Pestañas fijas animadas (se deslizan cuando la cabecera sticky está activa) */}
                            <AnimatePresence>
                                {showStickyHeader && (
                                    <motion.div
                                        key="sticky-nav"
                                        initial={{ y: -56, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -56, opacity: 0 }}
                                        transition={{ type: 'spring', stiffness: 380, damping: 32, mass: 0.8 }}
                                        className="fixed left-0 right-0 z-[9998] px-4 py-2"
                                        style={{ top: '110px' }}
                                    >
                                        <div className="flex gap-1 bg-gray-200/50 dark:bg-[#1c1c1e]/80 p-1.5 rounded-full w-full md:w-fit mx-auto border border-gray-200 dark:border-white/5 backdrop-blur-2xl">
                                            {[
                                                { id: 'arena', label: '🏟️ Arena' },
                                                { id: 'ranking', label: '🏆 Ranking' },
                                                { id: 'logros', label: '✨ Logros' }
                                            ].map((tab) => (
                                                <button
                                                    key={tab.id}
                                                    onClick={() => setActiveTab(tab.id)}
                                                    className={`flex-1 md:flex-none px-6 py-2.5 rounded-full text-xs md:text-sm font-black transition-all duration-300 ${activeTab === tab.id
                                                        ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-[1.02]'
                                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-300/50 dark:hover:bg-white/5'
                                                        }`}
                                                >
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Contenido Dinámico de Pestañas */}
                            <div className="arena-content-area">
                                <AnimatePresence mode="wait" initial={false}>
                                    <div className={activeTab === 'arena' ? "arena-tab-content" : ""}>
                                        {activeTab === 'arena' ? (
                                            <motion.div
                                                key="arena-tab"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="w-full"
                                            >
                                                <div className="flex flex-col items-center gap-10 py-4 w-full">
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
                                                                        <div className={`absolute inset-0 z-0 transition-opacity duration-500 ${isLocked ? 'opacity-20' : 'opacity-80 dark:opacity-40 group-hover:opacity-90 dark:group-hover:opacity-60'}`} style={{ backgroundImage: `url(${ARENA_ASSETS.BACKGROUNDS[diff]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                                                                        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/20 to-black/40 dark:from-black/40 dark:via-transparent dark:to-black/20 z-0" />
                                                                        <div className="relative z-10 text-left">
                                                                            <div className="w-14 h-14 rounded-[20px] bg-black/20 dark:bg-white/5 backdrop-blur-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-white/20 shadow-lg ring-1 ring-white/10">
                                                                                <span className="text-3xl filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                                                                                    {isLocked ? '🔒' : (diff === 'facil' ? '🕯️' : diff === 'medio' ? '📜' : diff === 'dificil' ? '🔥' : '⚔️')}
                                                                                </span>
                                                                            </div>
                                                                            <h3 className="font-black text-3xl uppercase tracking-tighter capitalize leading-none text-white font-display drop-shadow-md">{diff}</h3>
                                                                            <p className="text-[9px] text-white/50 font-black uppercase tracking-[0.3em] mt-3">{isLocked ? 'Próximamente' : 'Dificultad'}</p>
                                                                        </div>
                                                                        <div className="relative z-10 flex justify-between items-end pt-4 border-t border-white/10">
                                                                            <div className="text-left">
                                                                                <p className="text-[9px] text-blue-400 dark:text-blue-300 font-black uppercase tracking-[0.2em] mb-1 opacity-80">Multiplicador</p>
                                                                                <div className="flex items-baseline gap-1">
                                                                                    <span className="font-black text-3xl text-white tracking-tighter">{diff === 'facil' ? '1.0' : diff === 'medio' ? '1.5' : diff === 'dificil' ? '2.5' : '5.0'}</span>
                                                                                    <span className="text-xs font-black text-blue-400/80">X</span>
                                                                                </div>
                                                                            </div>
                                                                            {!isLocked && (
                                                                                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all shadow-lg">
                                                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
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
                                                                <button onClick={arena.resetArena} className="mb-8 flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-200/50 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>Volver a Niveles</button>
                                                            )}
                                                            {(!arena.isLoading && showChallenge) ? (
                                                                <>
                                                                    {arena.currentChallenge && <ChallengeCard key={arena.currentChallenge._id} challenge={arena.currentChallenge} onAnswer={handleAnswer} disabled={arena.gameStatus === 'result'} />}
                                                                    {arena.gameStatus === 'finished' && (
                                                                        <div className="fixed inset-0 z-[100] bg-[#0a0e27]/80 backdrop-blur-xl flex items-center justify-center p-6 text-center overflow-y-auto">
                                                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>
                                                                            <div className="relative z-10 w-full max-w-lg bg-white/5 backdrop-blur-md rounded-[3rem] p-12 border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
                                                                                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-yellow-500/20 shadow-lg"><span className="text-6xl filter drop-shadow-lg">🏆</span></div>
                                                                                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 italic text-transparent bg-clip-text bg-gradient-to-r from-[#f9c61f] via-yellow-200 to-[#f9c61f] drop-shadow-sm">Misión Cumplida</h2>
                                                                                <p className="text-white font-bold max-w-sm mx-auto mb-10 text-[10px] uppercase tracking-[0.3em] leading-relaxed drop-shadow-md">Tu sabiduría ha sido probada una vez más en los caminos del Reino.</p>
                                                                                {arena.lastSessionAchievements.length > 0 && (
                                                                                    <div className="flex flex-wrap justify-center gap-6 mb-12">
                                                                                        {arena.lastSessionAchievements.map((id, index) => {
                                                                                            const ach = ARENA_ACHIEVEMENTS.find(a => a.id === id);
                                                                                            if (!ach) return null;
                                                                                            const isViewed = viewedAchievements.includes(id);
                                                                                            return (
                                                                                                <motion.div key={id} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} className="flex flex-col items-center gap-3 relative group" onClick={() => handleAchievementClick(ach)}>
                                                                                                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl cursor-pointer transition-all duration-300 border-2 ${isViewed ? 'bg-blue-500/20 border-blue-400/30' : 'bg-white/5 border-white/10 hover:border-yellow-500/50'} shadow-lg relative`}>{ach.icon}{isViewed && <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-[#0a0e27]"><span className="material-symbols-outlined text-[14px] text-white font-black">check</span></div>}</div>
                                                                                                    <span className={`text-[8px] font-black uppercase tracking-widest transition-colors ${isViewed ? 'text-blue-400' : 'text-yellow-500'}`}>{ach.title}</span>
                                                                                                </motion.div>
                                                                                            );
                                                                                        })}
                                                                                    </div>
                                                                                )}
                                                                                <div className="flex flex-col items-center gap-4 w-full max-w-xs mx-auto">
                                                                                    <button onClick={() => handleLevelDifficulty(arena.selectedDifficulty)} className="w-full px-12 py-5 rounded-2xl bg-[#f9c61f] text-black font-black text-sm uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_15px_40px_rgba(249,198,31,0.3)] border border-yellow-400/50">Continuar Senda</button>
                                                                                    <button onClick={arena.resetArena} className="w-full px-8 py-4 rounded-2xl bg-white/5 text-white/40 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all border border-white/5">Volver al Menú</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <ArenaLoading difficulty={arena.selectedDifficulty} onReady={() => setShowChallenge(true)} />
                                                            )}
                                                            <AchievementDetailModal achievement={selectedAchievement} isOpen={!!selectedAchievement} onClose={() => setSelectedAchievement(null)} />
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ) : activeTab === 'ranking' ? (
                                            <motion.div
                                                key="ranking-tab"
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.98 }}
                                                transition={{ duration: 0.2 }}
                                                className="w-full"
                                            >
                                                <Leaderboard />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="logros-tab"
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.98 }}
                                                transition={{ duration: 0.2 }}
                                                className="w-full"
                                            >
                                                <AchievementGrid />
                                            </motion.div>
                                        )}
                                    </div>
                                </AnimatePresence>
                            </div>

                            <AnimatePresence>
                                {arena.gameStatus === 'result' && (
                                    <ResultModal
                                        result={arena.lastResult}
                                        onNext={arena.nextChallenge}
                                        onExit={arena.resetArena}
                                    />
                                )}
                            </AnimatePresence>

                            <LevelUnlockedModal isOpen={showLevelModal} levelName="Medio" onClose={() => setShowLevelModal(false)} />
                            <Toaster position="bottom-center" reverseOrder={false} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ArenaPage;
