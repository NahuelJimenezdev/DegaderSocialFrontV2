import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const AvatarDisplay = ({ level, rank, avatarUrl, username, layout = 'vertical' }) => {
    const isHorizontal = layout === 'horizontal';

    return (
        <div className={`relative flex ${isHorizontal ? 'flex-col items-center gap-2' : 'flex-col items-center'}`}>
            {/* Cabecera de Nivel (Solo en horizontal para réplica exacta) */}
            {isHorizontal && (
                <div className="flex flex-col items-center mb-1">
                    <span className="text-[10px] md:text-[13px] font-bold text-[#f3e3b4] tracking-tight mb-1 drop-shadow-md">
                        Level {level}
                    </span>
                    <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-lg md:text-xl drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                    >
                        ⭐
                    </motion.span>
                </div>
            )}

            {/* Brillo de fondo sutil */}
            <div className={`absolute ${isHorizontal ? 'top-12' : 'inset-0'} w-32 h-32 md:w-64 md:h-64 blur-[50px] md:blur-[80px] opacity-30 rounded-full bg-blue-500`} />

            {/* Contenedor del Avatar */}
            <div className="relative z-10">
                <div className={`relative ${isHorizontal ? 'w-24 h-24 md:w-56 md:h-56' : 'w-28 h-28 md:w-44 md:h-44'} p-[4px] rounded-full bg-gradient-to-b from-blue-400 via-blue-600 to-transparent shadow-[0_0_40px_rgba(37,99,235,0.5)] border border-blue-400/30`}>
                    <div className="w-full h-full rounded-full bg-[#0a0e27] overflow-hidden p-[3px] md:p-[6px]">
                        <motion.img
                            key={level}
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'Level' + level}`}
                            alt="Avatar"
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                </div>

                {/* Badge de Nivel Vertical (Oculto en horizontal) */}
                {!isHorizontal && (
                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 15, delay: 0.4 }}
                        className="absolute -bottom-1 -right-1 z-20 w-10 h-10 md:w-14 md:h-14 bg-white text-black flex flex-col items-center justify-center rounded-full shadow-lg border-[2px] md:border-[4px] border-gray-100"
                    >
                        <span className="text-[8px] md:text-[10px]">⭐</span>
                        <span className="font-black text-xs md:text-lg">{level}</span>
                    </motion.div>
                )}
            </div>

            {/* Info de Rango (Solo en vertical) */}
            {!isHorizontal && (
                <div className="mt-6 md:mt-10 text-center space-y-1 md:space-y-3">
                    <h4 className="text-gray-900 dark:text-white font-black text-xl md:text-4xl tracking-tighter uppercase italic leading-none">{rank.label}</h4>
                    <div className="flex items-center gap-2 md:gap-4 justify-center opacity-40">
                        <span className="w-1 h-1 md:w-2 md:h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[8px] md:text-[12px] font-black uppercase tracking-[0.4em]">
                            Liga del Pacto
                        </span>
                        <span className="w-1 h-1 md:w-2 md:h-2 rounded-full bg-blue-500 animate-pulse" />
                    </div>
                </div>
            )}
        </div>
    );
};

AvatarDisplay.propTypes = {
    level: PropTypes.number.isRequired,
    rank: PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string,
        color: PropTypes.string,
    }).isRequired,
    avatarUrl: PropTypes.string,
    username: PropTypes.string,
};

export default AvatarDisplay;
