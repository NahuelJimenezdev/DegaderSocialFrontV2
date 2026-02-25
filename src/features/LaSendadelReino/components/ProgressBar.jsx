import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { calculateLevelProgress } from '../utils/progression';

const ProgressBar = ({ currentXP, level, showLabel = true }) => {
    const progress = calculateLevelProgress(currentXP, level);

    return (
        <div className="w-full">
            {showLabel && (
                <div className="flex justify-between items-end mb-3">
                    <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Progreso del Guerrero</span>
                    <span className="text-blue-400 text-sm font-black font-mono tracking-tighter">{Math.floor(progress)}%</span>
                </div>
            )}
            <div className="h-2.5 w-full bg-[#1c1c1e] rounded-full overflow-hidden border border-white/5 shadow-inner">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
                    className="relative h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                >
                    {/* Brillo dinámico en la barra */}
                    <motion.div
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2"
                    />
                </motion.div>
            </div>
        </div>
    );
};

ProgressBar.propTypes = {
    currentXP: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    showLabel: PropTypes.bool,
};

export default ProgressBar;
