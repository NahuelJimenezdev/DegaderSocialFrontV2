import React from 'react';
import { X, Users, Bell, UserMinus, BarChart2 } from 'lucide-react';

const EventStatsModal = ({ isOpen, onClose, stats, eventTitle }) => {
    if (!isOpen || !stats) return null;

    return (
        <div className="fixed inset-0 z-[10000] bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">

                {/* Header */}
                <div className="bg-indigo-600 p-6 flex justify-between items-start text-white">
                    <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <BarChart2 size={20} />
                            Estadísticas
                        </h3>
                        <p className="text-indigo-100 text-sm mt-1 line-clamp-1">{eventTitle}</p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="p-6 space-y-4">

                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300 rounded-lg">
                                <Users size={20} />
                            </div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Asistirán</span>
                        </div>
                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {stats.attendeesCount}
                        </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 rounded-lg">
                                <Bell size={20} />
                            </div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Recordatorios</span>
                        </div>
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {stats.remindersCount}
                        </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-600">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg">
                                <UserMinus size={20} />
                            </div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">No interesados</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                            {stats.notInterestedCount}
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EventStatsModal;
