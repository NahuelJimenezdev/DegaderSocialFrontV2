import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LevelUnlockedModal = ({ isOpen, levelName, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                        onClick={onClose}
                    />
                    
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        className="relative w-full max-w-lg bg-[#0a1128] rounded-[3rem] border border-yellow-500/30 overflow-hidden shadow-[0_0_100px_rgba(249,198,31,0.2)]"
                    >
                        {/* Partículas / Brillos (Simplificado) */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ 
                                        x: '50%', 
                                        y: '50%',
                                        scale: 0 
                                    }}
                                    animate={{ 
                                        x: `${Math.random() * 100}%`,
                                        y: `${Math.random() * 100}%`,
                                        scale: [0, 1, 0],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{ 
                                        duration: 2 + Math.random() * 2,
                                        repeat: Infinity,
                                        delay: Math.random() * 2
                                    }}
                                    className="absolute w-2 h-2 bg-yellow-400 rounded-full blur-[2px]"
                                />
                            ))}
                        </div>

                        <div className="p-10 flex flex-col items-center text-center relative z-10">
                            <motion.div 
                                initial={{ rotate: -180, scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ type: "spring", damping: 10, stiffness: 100, delay: 0.2 }}
                                className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center text-6xl shadow-2xl mb-8 border-4 border-white/20"
                            >
                                🔓
                            </motion.div>

                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-yellow-500 mb-4 drop-shadow-lg">
                                Nuevo Nivel Alcanzado
                            </h2>
                            
                            <h3 className="text-5xl md:text-6xl font-black italic tracking-tighter text-white mb-6 uppercase">
                                ¡Nivel {levelName} <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-white to-yellow-400">Desbloqueado!</span>
                            </h3>

                            <p className="text-sm font-bold text-white/60 mb-10 max-w-sm">
                                "La Senda se ensancha." Has demostrado ser digno del siguiente desafío en el Reino.
                            </p>

                            <button
                                onClick={onClose}
                                className="w-full py-5 rounded-2xl bg-[#f9c61f] text-black font-black uppercase tracking-[0.2em] shadow-lg shadow-yellow-500/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                Continuar Senda
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LevelUnlockedModal;
