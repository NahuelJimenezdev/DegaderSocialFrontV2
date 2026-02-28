import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ARENA_ASSETS } from '../constants/arenaConfig';
import { getXPForLevel } from '../utils/progression';

/**
 * StickyArenaHeader - Perfección 1:1 basada en promp detallado
 * Estructura de 3 secciones: [Avatar] [Identidad/Progreso] [Stats/Rango]
 */
const StickyArenaHeader = ({ user, progress, isVisible, opacity }) => {
    const nextLevelXP = getXPForLevel(user.level + 1);

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
                                opacity: 0.18,
                                mixBlendMode: 'soft-light',
                                filter: 'none'
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
                            <h2 className="sticky-user-name">{user.username}</h2>
                            <span className="sticky-sub-label">LA SENDA DEL REINO</span>
                        </div>
                        
                        <div className="sticky-progression-row">
                            <div className="sticky-progress-bar-bg">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="sticky-progress-fill" 
                                />
                            </div>
                            <span className="sticky-xp-text">
                                {user.totalXP} / {nextLevelXP || 1200} XP
                            </span>
                            
                            <div className="sticky-ap-pill">
                                <span className="sticky-ap-icon">💎</span>
                                <span className="sticky-ap-value">{user.totalXP} AP</span>
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
                        
                        <div className="sticky-rank-box">
                            <span>🛡️</span> RANK {user.level}: {user.rank.label}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StickyArenaHeader;
