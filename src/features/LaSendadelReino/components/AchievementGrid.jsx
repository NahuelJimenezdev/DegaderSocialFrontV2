import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '../stores/useUserStore';
import { ARENA_ACHIEVEMENTS } from '../constants/arenaConfig';

const categoryMap = {
    xp: { label: '📈 Progresión', color: '#fbbf24', group: 'Progresión' },
    streak: { label: '🔥 Rachas', color: '#ef4444', group: 'Habilidad' },
    speed: { label: '⚡ Velocidad', color: '#8b5cf6', group: 'Habilidad' },
    perfect_game: { label: '✨ Precisión', color: '#fbbf24', group: 'Habilidad' },
    total_questions: { label: '🛡️ Esfuerzo', color: '#3b82f6', group: 'Esfuerzo' },
    days_streak: { label: '🗓️ Persistencia', color: '#94a3b8', group: 'Persistencia' },
    time_played: { label: '⏳ Tiempo', color: '#3b82f6', group: 'Esfuerzo' },
    misc: { label: '🏆 Otros', color: '#94a3b8', group: 'Otros' }
};

const AchievementGrid = () => {
    const user = useUserStore();
    const userAchievements = user.achievements || [];

    const groupedAchievements = useMemo(() => {
        const groups = {
            'Progresión': [],
            'Habilidad': [],
            'Esfuerzo': [],
            'Persistencia': [],
            'Otros': []
        };

        ARENA_ACHIEVEMENTS.forEach(a => {
            const unlocked = userAchievements.includes(a.id);
            const cat = categoryMap[a.type] || categoryMap.misc;
            groups[cat.group].push({ ...a, unlocked, color: cat.color });
        });

        return groups;
    }, [userAchievements]);

    const stats = useMemo(() => ({
        unlocked: userAchievements.length,
        total: ARENA_ACHIEVEMENTS.length
    }), [userAchievements]);

    return (
        <div className="space-y-12">
            {/* Stats Summary */}
            <div className="flex items-center justify-between bg-gray-100 dark:bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-inner">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-white/40 mb-1">Tu Colección</span>
                    <span className="text-3xl font-black italic tracking-tighter text-gray-900 dark:text-white">
                        {stats.unlocked} <span className="text-gray-300 dark:text-white/20">/ {stats.total}</span>
                    </span>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-white/5 flex items-center justify-center relative">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                            cx="32"
                            cy="32"
                            r="28"
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="4"
                            strokeDasharray={`${(stats.unlocked / stats.total) * 175.9} 175.9`}
                            className="transition-all duration-1000"
                        />
                    </svg>
                    <span className="text-xs font-black text-yellow-400">{Math.round((stats.unlocked / stats.total) * 100)}%</span>
                </div>
            </div>

            {Object.entries(groupedAchievements).map(([groupName, groupItems]) => (
                <div key={groupName} className="space-y-6">
                    <div className="flex items-center gap-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-white/40 whitespace-nowrap">
                            {groupName}
                        </h4>
                        <div className="h-[1px] w-full bg-gradient-to-r from-gray-200 dark:from-white/10 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupItems.map((achievement, index) => (
                            <motion.div
                                key={achievement.id}
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className={`p-5 rounded-[2rem] border transition-all duration-300 relative overflow-hidden group ${achievement.unlocked
                                    ? 'bg-white dark:bg-[#1c1c1e] border-blue-100 dark:border-white/10 shadow-xl'
                                    : 'bg-gray-50/50 dark:bg-black/20 border-gray-200 dark:border-white/5 opacity-60 grayscale'
                                    }`}
                            >
                                {/* Background glow for unlocked icons */}
                                {achievement.unlocked && (
                                    <div 
                                        className="absolute -top-4 -left-4 w-16 h-16 blur-2xl opacity-20 transition-opacity group-hover:opacity-40"
                                        style={{ backgroundColor: achievement.color }}
                                    />
                                )}

                                <div className="flex items-start gap-4 relative z-10">
                                    <div 
                                        className={`w-14 h-14 shrink-0 flex items-center justify-center rounded-2xl text-2xl shadow-lg border transition-transform group-hover:rotate-12 ${
                                            achievement.unlocked 
                                            ? 'bg-white dark:bg-black/40 border-white/20' 
                                            : 'bg-gray-100 dark:bg-white/5 border-transparent'
                                        }`}
                                        style={achievement.unlocked ? { boxShadow: `0 8px 16px ${achievement.color}15` } : {}}
                                    >
                                        <span className={`${achievement.unlocked ? 'drop-shadow-md' : 'opacity-40'}`}>
                                            {achievement.icon}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h5 className={`font-black text-[13px] uppercase tracking-tighter leading-tight mb-1 truncate ${
                                            achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-white/20'
                                        }`}>
                                            {achievement.title}
                                        </h5>
                                        <p className={`text-[10px] leading-relaxed font-bold tracking-tight line-clamp-2 ${
                                            achievement.unlocked ? 'text-gray-500 dark:text-white/40' : 'text-gray-400 dark:text-white/10'
                                        }`}>
                                            {achievement.description}
                                        </p>
                                    </div>
                                </div>

                                {achievement.unlocked && (
                                    <div className="mt-4 flex justify-between items-center bg-gray-50 dark:bg-black/20 -mx-5 -mb-5 px-5 py-3 border-t border-gray-100 dark:border-white/5">
                                        <span 
                                            className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border"
                                            style={{ color: achievement.color, borderColor: `${achievement.color}40`, backgroundColor: `${achievement.color}10` }}
                                        >
                                            Completado
                                        </span>
                                        <span className="material-symbols-outlined text-xs text-green-500 font-black">check_circle</span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AchievementGrid;
