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
            <div className="relative h-7 md:h-8 w-full bg-[#0a162b] rounded-full overflow-hidden border border-white/20 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] p-[3px]">
                {/* Brillo de fondo sutil */}
                <div className="absolute inset-0 bg-blue-500/5" />

                {/* Relleno de Progreso */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
                    className="relative h-full bg-gradient-to-r from-blue-600 via-blue-400 to-white/70 rounded-full flex items-center justify-center border-r border-white/30"
                    style={{
                        boxShadow: '0 0 20px rgba(59, 130, 246, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)'
                    }}
                >
                    {/* Efecto de barrido de luz */}
                    <motion.div
                        animate={{ x: ['-100%', '300%'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/4 skew-x-12"
                    />
                </motion.div>

                {/* Contador de XP Centrado */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[10px] md:text-[11px] font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-widest uppercase">
                        {xpEarnedInLevel.toLocaleString()} / {xpRequired.toLocaleString()} XP
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
