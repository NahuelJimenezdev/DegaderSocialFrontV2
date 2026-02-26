import React from 'react';
import { motion } from 'framer-motion';
import { ARENA_ASSETS } from '../constants/arenaConfig';

const ArenaLoading = ({ difficulty }) => {
    const characterImg = ARENA_ASSETS.CHARACTERS[difficulty] || ARENA_ASSETS.CHARACTERS.facil;

    const messages = {
        facil: "Iniciando el camino del Discípulo...",
        medio: "Consultando los rollos del Escriba...",
        dificil: "Escuchando las visiones del Profeta...",
        experto: "Invocando al Guardián del Pacto..."
    };

    return (
        <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
                {/* Aura de poder circular estilo iOS */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: 360,
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 via-indigo-500/10 to-transparent blur-3xl"
                />

                {/* Personaje con efecto de avance */}
                <motion.img
                    initial={{ x: -100, opacity: 0, scale: 0.8 }}
                    animate={{
                        x: 0,
                        opacity: 1,
                        scale: 1,
                        y: [0, -10, 0]
                    }}
                    transition={{
                        x: { type: "spring", damping: 12 },
                        opacity: { duration: 0.5 },
                        y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                    src={characterImg}
                    alt="Cargando personaje..."
                    className="relative z-10 w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,122,255,0.3)]"
                />

                {/* Partículas de luz */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: [0, 1, 0],
                            x: [0, (i % 2 === 0 ? 100 : -100)],
                            y: [0, (i < 3 ? 100 : -100)],
                            scale: [0, 1, 0]
                        }}
                        transition={{
                            duration: 2,
                            delay: i * 0.3,
                            repeat: Infinity,
                            ease: "easeOut"
                        }}
                        className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-400 rounded-full blur-sm"
                    />
                ))}
            </div>

            {/* Texto de carga iOS Style */}
            <div className="mt-12 text-center space-y-3">
                <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-black tracking-tight text-gray-900 dark:text-white"
                >
                    {messages[difficulty] || "Preparando Desafío..."}
                </motion.h3>

                <div className="flex items-center gap-2 justify-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 1 }}
                    className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 dark:text-white/60"
                >
                    La Senda del Reino
                </motion.p>
            </div>
        </div>
    );
};

export default ArenaLoading;
