import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const AvatarDisplay = ({ level, rank, avatarUrl, username }) => {
    return (
        <div className="relative flex flex-col items-center">
            {/* Brillo de fondo sutil */}
            <div className={`absolute inset-0 w-24 h-24 md:w-40 md:h-40 blur-[40px] md:blur-[60px] opacity-10 rounded-full bg-blue-500`} />

            {/* Contenedor del Avatar */}
            <div className="relative z-10">
                <div className="relative w-28 h-28 md:w-44 md:h-44 p-1 rounded-full bg-gradient-to-b from-white/10 to-transparent shadow-[0_20px_40px_rgba(0,0,0,0.6)] border border-white/10">
                    <div className="w-full h-full rounded-full bg-[#1c1c1e] overflow-hidden p-[2px] md:p-[4px]">
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

                {/* Badge de Nivel Metal/iOS Style */}
                <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15, delay: 0.4 }}
                    className="absolute -bottom-1 -right-1 z-20 w-10 h-10 md:w-14 md:h-14 bg-white text-black font-black text-xs md:text-lg flex items-center justify-center rounded-full shadow-[0_12px_24px_rgba(0,0,0,0.8)] border-[2px] md:border-[4px] border-[#1c1c1e]"
                >
                    {level}
                </motion.div>
            </div>

            {/* Info de Rango Refinada */}
            <div className="mt-6 md:mt-10 text-center space-y-1 md:space-y-3">
                <h4 className="text-white font-black text-xl md:text-4xl tracking-tighter uppercase italic leading-none">{rank.label}</h4>
                <div className="flex items-center gap-2 md:gap-4 justify-center opacity-40">
                    <span className="w-1 h-1 md:w-2 md:h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[8px] md:text-[12px] font-black uppercase tracking-[0.4em]">
                        Liga del Pacto
                    </span>
                    <span className="w-1 h-1 md:w-2 md:h-2 rounded-full bg-blue-500 animate-pulse" />
                </div>
            </div>
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
