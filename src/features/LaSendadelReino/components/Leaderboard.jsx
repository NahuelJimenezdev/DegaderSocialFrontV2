import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { ArenaService } from '../services/arenaService';
import { useUserStore } from '../stores/useUserStore';

const Leaderboard = () => {
    const { location } = useUserStore();
    const [filter, setFilter] = useState('global');
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRanking = async () => {
            setLoading(true);
            let response;

            if (filter === 'global') {
                response = await ArenaService.getRanking('global');
            } else if (filter === 'country') {
                response = await ArenaService.getRanking('country', location.country);
            } else if (filter === 'state') {
                response = await ArenaService.getRanking('state', location.country, location.state);
            }

            setRanking(response?.data || []);
            setLoading(false);
        };
        fetchRanking();
    }, [filter, location]);

    const filters = [
        { id: 'global', label: 'Mundial' },
        ...(location.country ? [{ id: 'country', label: `En ${location.country}` }] : []),
        ...(location.state ? [{ id: 'state', label: `En ${location.state}` }] : [])
    ];

    return (
        <div className="w-full bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Header & Filtros */}
            <div className="p-6 border-b border-white/5 bg-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="text-amber-400">🏆</span> Ranking Mundial
                </h3>

                <div className="flex bg-black/20 p-1 rounded-xl border border-white/5 overflow-x-auto max-w-full">
                    {filters.map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${filter === f.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-white/40 hover:text-white/60'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-[10px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">
                            <th className="px-6 py-4">Puesto</th>
                            <th className="px-6 py-4">Guerrero</th>
                            <th className="px-6 py-4">Nivel</th>
                            <th className="px-6 py-4 text-right">XP Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        <AnimatePresence mode="popLayout">
                            {loading ? (
                                <tr className="animate-pulse">
                                    <td colSpan="4" className="px-6 py-20 text-center text-white/20 italic">Cargando leyendas...</td>
                                </tr>
                            ) : (
                                ranking.map((item, index) => (
                                    <motion.tr
                                        key={item.userId}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: 20, opacity: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className={`w-8 h-8 flex items-center justify-center rounded-lg font-black text-sm ${index === 0 ? 'bg-amber-500 text-slate-900 shadow-[0_0_15px_rgba(251,191,36,0.5)]' :
                                                index === 1 ? 'bg-slate-300 text-slate-900' :
                                                    index === 2 ? 'bg-amber-700 text-white' :
                                                        'text-white/40'
                                                }`}>
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={item.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.userId}`} className="w-10 h-10 rounded-full bg-slate-800" alt={item.user?.name} />
                                                <div>
                                                    <div className="text-white font-bold text-sm tracking-tight">{item.user?.name || 'Guerrero Anónimo'}</div>
                                                    <div className="text-[10px] text-white/40 font-medium">{item.user?.country || 'Reino Unido'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-blue-400 font-bold text-xs">
                                                Lvl {item.user?.level || 1}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-amber-500 font-bold text-sm">
                                            {(item.rankPoints || 0).toLocaleString()}
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;
