import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AchievementDetailModal = ({ achievement, isOpen, onClose }) => {
    if (!achievement) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                    {/* Backdrop with extreme blur to match glass effect */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative z-10 w-full max-w-sm bg-[#1c1c1e]/90 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/10 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.7)] text-center overflow-hidden"
                    >
                        {/* Light flare effect */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />

                        {/* Icon Container */}
                        <div className="relative mb-8">
                            <motion.div
                                initial={{ rotate: -10, scale: 0.8 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto text-5xl border border-white/20 shadow-2xl relative z-10"
                                style={{ boxShadow: `0 15px 40px -10px rgba(0,0,0,0.5)` }}
                            >
                                {achievement.icon}
                            </motion.div>
                            {/* Reflection/Glow below icon */}
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-blue-400/20 blur-xl rounded-full" />
                        </div>

                        {/* Achievement Info */}
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-500 mb-2 block"
                        >
                            Logro Alcanzado
                        </motion.span>
                        <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4"
                        >
                            {achievement.title}
                        </motion.h3>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-white/60 text-xs font-bold leading-relaxed mb-10 px-4"
                        >
                            {achievement.description}
                        </motion.p>

                        {/* Close button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                            className="w-full py-4 rounded-2xl bg-white/10 text-white font-black text-xs uppercase tracking-[0.2em] border border-white/10 hover:bg-white/20 transition-all shadow-lg"
                        >
                            Entendido
                        </motion.button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AchievementDetailModal;
