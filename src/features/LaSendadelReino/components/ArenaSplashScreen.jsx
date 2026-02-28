import React from 'react';
import { motion } from 'framer-motion';
import { ARENA_ASSETS } from '../constants/arenaConfig';

const ArenaSplashScreen = ({ onFinish }) => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            onAnimationComplete={onFinish}
            className="fixed inset-0 z-[99999] bg-[#0a0e27] flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Fondo con rayos/luces */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-3xl animate-pulse" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Logo con Animación de Entrada */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ 
                        type: "spring", 
                        damping: 10, 
                        stiffness: 100,
                        duration: 1 
                    }}
                    className="w-[150vw] h-[150vw] md:w-[480px] md:h-[480px] -mb-26 md:-mb-16"
                >
                    <img 
                        src={ARENA_ASSETS.LOGO} 
                        alt="Degader Logo" 
                        className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]" 
                    />
                </motion.div>

                {/* Título Estilizado */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-center"
                >
                    <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter text-white uppercase mb-2">
                        La Senda <span className="text-blue-500">del Reino</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
                        Presentado por Degader
                    </p>
                </motion.div>
            </div>

            {/* Efecto de partículas sutil */}
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ 
                        x: Math.random() * window.innerWidth, 
                        y: Math.random() * window.innerHeight,
                        opacity: 0,
                        scale: 0
                    }}
                    animate={{ 
                        opacity: [0, 0.5, 0],
                        scale: [0, 1.2, 0],
                        y: ["-20%", "120%"]
                    }}
                    transition={{ 
                        duration: 2 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 2
                    }}
                    className="absolute w-1 h-1 bg-blue-400 rounded-full blur-[1px]"
                />
            ))}
        </motion.div>
    );
};

export default ArenaSplashScreen;
