import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '../stores/useUserStore';
import { ARENA_ACHIEVEMENTS } from '../constants/arenaConfig';

const AchievementGrid = () => {
    const user = useUserStore();
    const userAchievements = user.achievements || [];

    const achievements = useMemo(() => {
        return ARENA_ACHIEVEMENTS.map(a => ({
            ...a,
            unlocked: userAchievements.includes(a.id)
        }));
    }, [userAchievements]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
                <motion.div
                    key={achievement.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className={`p-5 rounded-3xl border transition-all ${achievement.unlocked
                        ? 'bg-white dark:bg-[#1c1c1e] border-blue-100 dark:border-white/10 shadow-lg'
                        : 'bg-white/5 dark:bg-black/20 border-white/5 opacity-50 grayscale'
                        }`}
                >
                    <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 flex items-center justify-center rounded-2xl text-2xl shadow-inner ${achievement.unlocked ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'bg-gray-200 dark:bg-white/5 text-gray-400 dark:text-white/20'
                            }`}>
                            {achievement.icon}
                        </div>
                        <div className="flex-1">
                            <h5 className={`font-bold text-sm mb-1 ${achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-white/20'}`}>
                                {achievement.title}
                            </h5>
                            <p className={`text-xs leading-relaxed font-medium ${achievement.unlocked ? 'text-gray-600 dark:text-white/40' : 'text-white/10'}`}>
                                {achievement.description}
                            </p>
                        </div>
                    </div>

                    {achievement.unlocked && (
                        <div className="mt-4 flex justify-end">
                            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full border border-indigo-400/20">
                                Desbloqueado
                            </span>
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
};

export default AchievementGrid;
