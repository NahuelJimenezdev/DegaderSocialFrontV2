import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ARENA_ASSETS } from '../constants/arenaConfig';
import { getXPForLevel } from '../utils/progression';

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
                    className="sticky-arena-header lg:hidden"
                >
                    {/* Logo marca de agua centrado y visible */}
                    <div className="sticky-arena-watermark">
                        <img
                            src={ARENA_ASSETS.LOGO}
                            alt=""
                            style={{
                                opacity: isDark ? 0.25 : 0.4,
                                filter: isDark ? 'invert(1) brightness(0.2)' : 'sepia(0.2) saturate(0.5) brightness(1.2) hue-rotate(185deg)',
                            }}
                        />
                    </div>

                    {/* SECCIÓN IZQUIERDA: Avatar */}
                    <div className="sticky-avatar-container">
                        <img
                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                            alt={user.username}
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
                                <span>🏆</span> <span className="sticky-stat-value">{user.wins}</span>
                            </div>
                            <div className="sticky-stat-mini-pill games">
                                <span>⚔️</span> <span className="sticky-stat-value">{user.gamesPlayed}</span>
                            </div>
                            <div className="sticky-stat-mini-pill kd">
                                <span>🎯</span> <span className="sticky-stat-value kd-value">{user.kdRatio}</span>
                            </div>
                        </div>

                        <div className="sticky-rank-box shadow-sm">
                            <span className="mr-1">🛡️</span> {user.rank?.label || 'Novato'}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StickyArenaHeader;
