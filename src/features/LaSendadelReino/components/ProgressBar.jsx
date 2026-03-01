import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { getXPForLevel } from '../utils/progression';

const ProgressBar = ({ currentXP, level }) => {
    const xpStart = getXPForLevel(level);
    const xpEnd = getXPForLevel(level + 1);
    const xpRequired = xpEnd - xpStart;
    const xpEarnedInLevel = currentXP - xpStart;
    const progress = Math.min(100, Math.max(0, (xpEarnedInLevel / xpRequired) * 100));
    const isDark = document.documentElement.classList.contains('dark');

    return (
        <div className="w-full">
            <div className={`relative h-6 md:h-8 w-full rounded-full overflow-hidden border shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] p-[2px] ${isDark ? 'bg-[#0a162b] border-white/10 shadow-[inset_0_2px_8px_rgba(0,0,0,0.9)]' : 'bg-blue-50/50 border-blue-200 shadow-[inset_0_2px_4px_rgba(37,99,235,0.1)]'}`}>
                {/* Brillo de fondo sutil */}
                <div className={`absolute inset-0 ${isDark ? 'bg-blue-500/10' : 'bg-blue-600/5'}`} />

                {/* Relleno de Progreso (Gradiente Refinado) */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
                    className={`relative h-full rounded-full flex items-center justify-center border-r ${isDark ? 'bg-gradient-to-r from-[#1a4eff] via-[#3ea6ff] to-white/90 border-white/40' : 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 border-white/50'}`}
                    style={{
                        boxShadow: isDark
                            ? '0 0 25px rgba(59, 130, 246, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.4)'
                            : '0 4px 15px rgba(37, 99, 235, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.5)'
                    }}
                >
                    {/* Efecto de barrido de luz (Más rápido) */}
                    <motion.div
                        animate={{ x: ['-200%', '400%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-2/3 skew-x-12"
                    />
                </motion.div>

                {/* Contador de XP Centrado (Compacto) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className={`text-[9px] md:text-[11px] font-black drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)] tracking-widest uppercase ${isDark ? 'text-white' : 'text-white'}`}>
                        {currentXP.toLocaleString()} / {xpEnd.toLocaleString()} XP
                    </span>
                </div>
            </div>
        </div>
    );
};

ProgressBar.propTypes = {
    currentXP: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired
};

export default ProgressBar;
