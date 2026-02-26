import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const AvatarDisplay = ({ level, rank, avatarUrl, username }) => {
    return (
        <div className="relative flex flex-col items-center">
            {/* 1. Cabecera de Nivel (Réplica Exacta) */}
            <div className="flex flex-col items-center mb-0 z-20">
                <span className="arena-level-text font-black text-2xl md:text-3xl tracking-tight drop-shadow-md">
                    Level {level}
                </span>
                <motion.span
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="arena-star-glow text-2xl md:text-3xl mt-[-5px]"
                >
                    ⭐
                </motion.span>
            </div>

            {/* Brillo de fondo sutil */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-80 md:h-80 blur-[60px] md:blur-[100px] opacity-40 rounded-full bg-blue-500 pointer-events-none`} />

            {/* 2. Contenedor del Avatar (Aumentado en Mobile) */}
            <div className="relative z-10 mt-2">
                {/* Anillo de runas / mágico (Simulado con borde y gradiente) */}
                <div className="relative w-44 h-44 md:w-64 md:h-64 p-[6px] rounded-full bg-gradient-to-b from-blue-300 via-blue-600 to-transparent shadow-[0_0_60px_rgba(37,99,235,0.4)] ring-1 ring-blue-400/40">
                    <div className="w-full h-full rounded-full bg-[#0a0e27] overflow-hidden p-[4px] md:p-[8px] relative border border-blue-500/30">
                        {/* Brillo interno */}
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent pointer-events-none" />

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
            </div>

            {/* 3. Info de Identidad (Solo si no viene de ArenaPage) */}
            <div className="mt-6 text-center space-y-1">
                <h4 className="text-white font-black text-3xl md:text-5xl tracking-tighter uppercase italic leading-none drop-shadow-lg">
                    {username || 'VALKYRIE_07'}
                </h4>
                <div className="flex items-center gap-2 justify-center">
                    <span className="text-[#3ea6ff] text-[10px] md:text-[14px] font-black uppercase tracking-[0.3em] drop-shadow-md">
                        {rank?.league || 'LIGA DEL PACTO'}
                    </span>
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
