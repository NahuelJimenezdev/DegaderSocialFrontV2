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

    return (
        <div className="w-full">
            <div className="relative h-6 md:h-8 w-full bg-[#0a162b] rounded-full overflow-hidden border border-white/10 shadow-[inset_0_2px_8px_rgba(0,0,0,0.9)] p-[2px]">
                {/* Brillo de fondo sutil */}
                <div className="absolute inset-0 bg-blue-500/10" />

                {/* Relleno de Progreso (Gradiente Refinado) */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
                    className="relative h-full bg-gradient-to-r from-[#1a4eff] via-[#3ea6ff] to-white/90 rounded-full flex items-center justify-center border-r border-white/40"
                    style={{
                        boxShadow: '0 0 25px rgba(59, 130, 246, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.4)'
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
                    <span className="text-[9px] md:text-[11px] font-black text-white drop-shadow-[0_1px_3px_rgba(0,0,0,1)] tracking-widest uppercase">
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
