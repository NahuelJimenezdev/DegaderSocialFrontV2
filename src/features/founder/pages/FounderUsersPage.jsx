import React, { useEffect } from 'react';
import { Users, Shield, Ban } from 'lucide-react';
import { useFounderUsers } from '../../../shared/hooks/useFounderUsers';
import WorldMapSection from '../components/WorldMapSection';
import '../styles/worldMap.css';

/**
 * Página de gestión de usuarios para Founder
 */
export default function FounderUsersPage() {
    const {
        stats,
        geoStats,
        loading,
        fetchUsers,
        fetchGeoStats
    } = useFounderUsers();

    useEffect(() => {
        fetchGeoStats();
        fetchUsers({ limit: 1 }); // Solo para traer los stats globales
    }, [fetchGeoStats, fetchUsers]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
            {/* Header Superior */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Shield className="colorMarcaDegader" size={20} />
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
                        </div>
                        <p className="text-sm text-gray-500">Panel exclusivo Founder</p>
                    </div>
                </div>
            </div>

            {/* Stats Globales Premium */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {loading && !stats ? (
                    <div className="flex flex-wrap md:flex-nowrap gap-4 animate-pulse">
                        {[1,2,3,4].map(i => <div key={i} className="h-20 flex-1 bg-white dark:bg-gray-800 rounded-2xl"></div>)}
                    </div>
                ) : (
                    <div className="flex flex-wrap md:flex-nowrap gap-4 items-center justify-between">
                        {/* Card Total */}
                        <div className="flex-1 min-w-[150px] p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                                <Users size={20} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Usuarios</p>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">{stats?.total || 0}</h2>
                            </div>
                        </div>
 
                        {/* Card Moderadores */}
                        <div className="flex-1 min-w-[150px] p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                                <Shield size={20} className="text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Moderadores</p>
                                <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 leading-tight">{stats?.moderadores || 0}</h2>
                            </div>
                        </div>
 
                        {/* Card Admins */}
                        <div className="flex-1 min-w-[150px] p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                            <div className="p-2.5 bg-rose-50 dark:bg-rose-900/30 rounded-xl">
                                <Shield size={20} className="text-rose-600 dark:text-rose-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admins</p>
                                <h2 className="text-2xl font-black text-rose-600 dark:text-rose-400 leading-tight">{stats?.admins || 0}</h2>
                            </div>
                        </div>
 
                        {/* Card Suspendidos */}
                        <div className="flex-1 min-w-[150px] p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                            <div className="p-2.5 bg-orange-50 dark:bg-orange-900/30 rounded-xl">
                                <Ban size={20} className="text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Suspendidos</p>
                                <h2 className="text-2xl font-black text-orange-600 dark:text-orange-400 leading-tight">{stats?.suspendidos || 0}</h2>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Mapa Interactivo Mundial */}
            <div className="max-w-7xl mx-auto px-4 py-4">
                <WorldMapSection geoStats={geoStats} />
            </div>
        </div>
    );
}
