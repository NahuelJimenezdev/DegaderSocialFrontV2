import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ARENA_ASSETS } from '../constants/arenaConfig';
import { getXPForLevel } from '../utils/progression';
import ProgressiveImage from '../../../shared/components/ProgressiveImage/ProgressiveImage';

/**
 * StickyArenaHeader - Perfección 1:1 basada en promp detallado
 * Estructura de 3 secciones: [Avatar] [Identidad/Progreso] [Stats/Rango]
 */
const StickyArenaHeader = ({ user, displayName, progress, isVisible, opacity }) => {
    const nextLevelXP = getXPForLevel(user.level + 1);
    const isDark = document.documentElement.classList.contains('dark');


    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: opacity !== undefined ? opacity : 1
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.4,
                        ease: "easeInOut"
                    }}
                    style={{
                        pointerEvents: (opacity > 0.8 || isVisible) ? 'auto' : 'none'
                    }}
                    className="sticky-arena-header !overflow-visible"
                >
                    {/* Logo marca de agua centrado y visible */}
                    <div className="sticky-arena-watermark">
                        <ProgressiveImage
                            src={ARENA_ASSETS.LOGO}
                            alt=""
                            style={{
                                opacity: isDark ? 0.25 : 0.4,
                                filter: isDark ? 'brightness(0.8)' : 'sepia(0.2) saturate(0.5) brightness(1.2) hue-rotate(185deg)',
                                mixBlendMode: 'multiply'
                            }}
                        />
                    </div>

                    {/* SECCIÓN IZQUIERDA: Avatar */}
                    <div className="shrink-0 relative flex items-center justify-center w-[64px] h-[64px] rounded-full border-2 border-blue-500 bg-white p-[2px] shadow-[0_0_15px_rgba(59,130,246,0.4)] z-10">
                        <ProgressiveImage
                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                            alt={user.username}
                            className="w-full h-full object-cover rounded-full"
                            style={{ clipPath: 'circle(50%)' }}
                        />
                    </div>

                    {/* SECCIÓN CENTRAL: Identidad y Progresión */}
                    <div className="sticky-center-section">
                        <div className="flex flex-col">
                            <h2 className="sticky-user-name">{displayName || user.username}</h2>
                            <span className="sticky-sub-label">LA SENDA DEL REINO</span>
                        </div>

                        <div className="sticky-progression-row">
                            <div className="flex items-center justify-between w-[95%] mb-1 px-1">
                                <span className="sticky-xp-text">
                                    {user.totalXP.toLocaleString()} / {nextLevelXP?.toLocaleString() || 1200} XP
                                </span>
                                <div className="sticky-ap-pill shadow-sm">
                                    <span className="sticky-ap-icon">💠</span>
                                    <span className="sticky-ap-value">{(user.totalXP || 0).toLocaleString()} AP</span>
                                </div>
                            </div>
                            <div className={`sticky-progress-bar-bg relative ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
                                    className={`sticky-progress-fill relative overflow-hidden ${isDark ? 'border-r border-white/40' : 'border-r border-white/50'}`}
                                    style={{
                                        boxShadow: isDark
                                            ? '0 0 15px rgba(59, 130, 246, 0.4)'
                                            : '0 2px 8px rgba(37, 99, 235, 0.2)'
                                    }}
                                >
                                    <motion.div
                                        animate={{ x: ['-200%', '300%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full skew-x-12"
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN DERECHA: Estadísticas y Rango */}
                    <div className="sticky-right-section">
                        <div className="sticky-stats-grid-mini">
                            <div className="sticky-stat-mini-pill wins">
                                <span className="text-[9px] md:text-xs">🏆</span> <span className="sticky-stat-value text-[9px] md:text-xs">{user.wins}</span>
                            </div>
                            <div className="sticky-stat-mini-pill games">
                                <span className="text-[9px] md:text-xs">⚔️</span> <span className="sticky-stat-value text-[9px] md:text-xs">{user.gamesPlayed}</span>
                            </div>
                            <div className="sticky-stat-mini-pill kd">
                                <span className="text-[9px] md:text-xs">🎯</span> <span className="sticky-stat-value kd-value text-[9px] md:text-xs">{user.kdRatio}</span>
                            </div>
                        </div>

                        <div className="sticky-rank-box shadow-sm text-[6px] md:text-[7px]">
                            <span className="mr-0.5">🛡️</span> {user.rank?.label || 'Novato'}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StickyArenaHeader;
