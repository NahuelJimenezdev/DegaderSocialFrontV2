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
                // Progreso variable para sentirlo "natural"
                const increment = Math.random() * 15 + 5;
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
        <div className="flex flex-col items-center justify-center py-12 px-6 w-full max-w-lg mx-auto">
            <div className="relative w-48 h-48 md:w-64 md:h-64 mb-4">
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
                    <span className="text-xl font-black italic tracking-tighter text-gray-900 dark:text-white">
                        {Math.round(progress)}%
                    </span>
                </div>
                
                <div className="h-3 w-full bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden border border-gray-300/30 dark:border-white/5 p-[2px]">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                    />
                </div>

                <AnimatePresence mode="wait">
                    <motion.p
                        key={Math.floor(progress / 30)} // Cambia el mensaje según el progreso
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-sm font-bold text-gray-500 dark:text-white/40 italic"
                    >
                        {progress < 40 ? messages[difficulty] : progress < 80 ? "Preparando desafíos..." : "Casi listo..."}
                    </motion.p>
                </AnimatePresence>
            </div>

            <p className="mt-12 text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-white/20">
                La Senda del Reino
            </p>
        </div>
    );
};

export default ArenaLoading;
