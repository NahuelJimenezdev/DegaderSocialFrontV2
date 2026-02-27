import React from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Muestra una notificación premium de logro desbloqueado
 */
export const showAchievementToast = (achievement) => {
    toast.custom((t) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white dark:bg-[#1c1c1e] shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2.5rem] pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden border border-blue-500/30 backdrop-blur-2xl`}
        >
            <div className="flex-1 w-0 p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0 pt-0.5">
                        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg shadow-orange-500/20">
                            {achievement.icon}
                        </div>
                    </div>
                    <div className="ml-5 flex-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-1">
                            ¡Logro Desbloqueado!
                        </p>
                        <p className="text-xl font-black italic tracking-tighter text-gray-900 dark:text-white mb-0.5">
                            {achievement.title}
                        </p>
                        <p className="text-xs font-bold text-gray-500 dark:text-white/40 leading-tight">
                            {achievement.description}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex border-l border-gray-100 dark:border-white/5">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus:outline-none"
                >
                    OK
                </button>
            </div>
        </motion.div>
    ), { duration: 5000 });

    // Haptic feedback (if supported)
    if (window.navigator?.vibrate) {
        window.navigator.vibrate([50, 30, 50]);
    }
};
