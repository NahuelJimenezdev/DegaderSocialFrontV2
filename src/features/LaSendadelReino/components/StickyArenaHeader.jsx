import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ARENA_ASSETS } from '../constants/arenaConfig';
import { getXPForLevel } from '../utils/progression';

/**
 * StickyArenaHeader - Cabecera compacta horizontal para móviles
 * Se activa al hacer scroll hacia abajo en la Arena.
 */
const StickyArenaHeader = ({ user, progress, isVisible }) => {
    // Calculamos el XP necesario para el siguiente nivel
    const nextLevelXP = getXPForLevel(user.level + 1);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -80, opacity: 0 }}
                    transition={{ 
                        duration: 0.4, 
                        ease: [0.4, 0, 0.2, 1],
                        opacity: { duration: 0.2 }
                    }}
                    className="sticky-arena-header lg:hidden"
                >
                    {/* Marca de agua del Logo */}
                    <div className="sticky-arena-watermark">
                        <img src={ARENA_ASSETS.LOGO} alt="Fondo" />
                    </div>

                    {/* Extremo Izquierdo: Avatar */}
                    <div className="sticky-avatar-container">
                        <img 
                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                            alt={user.username} 
                        />
                    </div>

                    {/* Sección Central: Progresión */}
                    <div className="sticky-center-section">
                        <div className="flex flex-col mb-1">
                            <h2 className="sticky-user-name leading-tight">{user.username}</h2>
                            <span className="sticky-sub-label leading-none">LA SENDA DEL REINO</span>
                        </div>
                        
                        <div className="sticky-progress-container">
                            <div className="sticky-progress-bar-bg">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="sticky-progress-fill" 
                                />
                            </div>
                            <span className="sticky-xp-text">
                                {user.totalXP} / {nextLevelXP || 1200} XP
                            </span>
                            
                            <div className="sticky-ap-container">
                                <span className="sticky-ap-icon">💠</span>
                                <span className="sticky-ap-value">{user.totalXP} AP</span>
                            </div>
                        </div>
                    </div>

                    {/* Extremo Derecho: Estadísticas y Rango */}
                    <div className="sticky-right-section">
                        <div className="sticky-stats-grid">
                            <div className="sticky-stat-mini wins">
                                <span>🏆</span> {user.wins}
                            </div>
                            <div className="sticky-stat-mini games">
                                <span>⚔️</span> {user.gamesPlayed}
                            </div>
                            <div className="sticky-stat-mini kd">
                                <span>🎯</span> {user.kdRatio}
                            </div>
                        </div>
                        
                        <div className="sticky-rank-compact">
                            RANK {user.level}: {user.rank.label}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StickyArenaHeader;
