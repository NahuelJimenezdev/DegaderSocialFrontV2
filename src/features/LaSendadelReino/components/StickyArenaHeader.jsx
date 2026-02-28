import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ARENA_ASSETS } from '../constants/arenaConfig';

/**
 * StickyArenaHeader - Rediseño premium basado en ejemplo_cardStiky.png
 * Versión horizontal 110px de alto para máxima visibilidad estadística.
 */
const StickyArenaHeader = ({ user, isVisible }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -120, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -120, opacity: 0 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                        opacity: { duration: 0.3 }
                    }}
                    className="sticky-arena-header lg:hidden"
                >
                    {/* Marca de agua del Logo central */}
                    <div className="sticky-arena-watermark">
                        <img src={ARENA_ASSETS.LOGO} alt="Fondo" />
                    </div>

                    {/* Izquierda: Avatar con Brillo */}
                    <div className="sticky-avatar-wrapper">
                        <div className="sticky-avatar-glow" />
                        <div className="sticky-avatar-container">
                            <img 
                                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                                alt={user.username} 
                            />
                        </div>
                    </div>

                    {/* Centro/Derecha: Datos agrupados en 2 filas */}
                    <div className="sticky-info-main">
                        {/* Fila Superior: Nivel y AP */}
                        <div className="sticky-top-row">
                            <div className="sticky-level-info">
                                Level {user.level} <span className="sticky-level-star">⭐</span>
                            </div>
                            <div className="sticky-ap-info">
                                <span className="sticky-ap-diamond">💎</span>
                                <span className="sticky-ap-text-large">{user.totalXP} AP</span>
                            </div>
                        </div>

                        {/* Fila Inferior: Stats Circulares */}
                        <div className="sticky-bottom-row">
                            <div className="sticky-stat-item-redesign">
                                <div className="sticky-stat-icon-circle">🏆</div>
                                <div className="sticky-stat-content">
                                    <span className="sticky-stat-label-new">Wins</span>
                                    <span className="sticky-stat-value-new">{user.wins}</span>
                                </div>
                            </div>

                            <div className="sticky-stat-item-redesign">
                                <div className="sticky-stat-icon-circle">⚔️</div>
                                <div className="sticky-stat-content">
                                    <span className="sticky-stat-label-new">Games</span>
                                    <span className="sticky-stat-value-new">{user.gamesPlayed}</span>
                                </div>
                            </div>

                            <div className="sticky-stat-item-redesign">
                                <div className="sticky-stat-icon-circle">🎯</div>
                                <div className="sticky-stat-content">
                                    <span className="sticky-stat-label-new">K/D</span>
                                    <span className="sticky-stat-value-new kd-color">{user.kdRatio}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StickyArenaHeader;
