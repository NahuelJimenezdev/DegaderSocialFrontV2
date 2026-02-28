import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ARENA_ASSETS } from '../constants/arenaConfig';

const ArenaLoading = ({ difficulty, onReady }) => {
    const [progress, setProgress] = useState(0);
    const characterImg = ARENA_ASSETS.CHARACTERS[difficulty] || ARENA_ASSETS.CHARACTERS.facil;

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => onReady && onReady(), 500);
                    return 100;
                }
                // Progreso más lento para disfrutar la visualización (aprox 2-3 segundos adicionales)
                const increment = Math.random() * 5 + 3;
                return Math.min(prev + increment, 100);
            });
        }, 150);

        return () => clearInterval(interval);
    }, [onReady]);

    const messages = {
        facil: "Iniciando el camino del Discípulo...",
        medio: "Consultando los rollos del Escriba...",
        dificil: "Escuchando las visiones del Profeta...",
        experto: "Invocando al Guardián del Pacto..."
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-[#0a0e27] flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Background effects similar to splash screen */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-3xl animate-pulse" />
            </div>

            <div className="relative z-10 flex flex-col items-center w-full max-w-lg px-6">
                <div className="relative w-64 h-64 md:w-96 md:h-96 mb-4">
                    {/* Aura circular */}
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-blue-500/20 blur-3xl"
                    />

                    {/* Logo/Character */}
                    <motion.img
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ 
                            scale: 1, 
                            opacity: 1,
                            y: [0, -10, 0]
                        }}
                        transition={{
                            scale: { duration: 0.5 },
                            y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                        src={ARENA_ASSETS.LOGO}
                        alt="Loading..."
                        className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_10px_30px_rgba(59,130,246,0.3)]"
                    />
                </div>

                {/* Barra de Progreso Estilo Premium */}
                <div className="w-full space-y-4 text-center mt-8">
                    <div className="flex justify-between items-end mb-1 px-1">
                        <motion.span 
                            key={difficulty}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500"
                        >
                            {difficulty} Nivel
                        </motion.span>
                        <span className="text-xl font-black italic tracking-tighter text-white">
                            {Math.round(progress)}%
                        </span>
                    </div>
                    
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[2px]">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.p
                            key={Math.floor(progress / 30)} 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-sm font-bold text-white/40 italic"
                        >
                            {progress < 40 ? messages[difficulty] : progress < 80 ? "Preparando desafíos..." : "Casi listo..."}
                        </motion.p>
                    </AnimatePresence>
                </div>

                <p className="mt-12 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
                    La Senda del Reino
                </p>
            </div>
        </motion.div>
    );
};

export default ArenaLoading;
