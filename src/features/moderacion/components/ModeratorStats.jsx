import React from 'react';
import { AlertTriangle, Clock, CheckCircle, FileText } from 'lucide-react';

/**
 * Componente de estadísticas para moderadores
 * Muestra resumen rápido del estado de reportes
 */
const ModeratorStats = ({ stats }) => {
    const statCards = [
        {
            id: 'pending',
            label: 'Pendientes',
            value: stats.pending || 0,
            icon: Clock,
            color: 'text-yellow-600 dark:text-yellow-400',
            bg: 'bg-yellow-100 dark:bg-yellow-900/30'
        },
        {
            id: 'inReview',
            label: 'En revisión',
            value: stats.inReview || 0,
            icon: FileText,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-100 dark:bg-blue-900/30'
        },
        {
            id: 'myAssigned',
            label: 'Mis asignados',
            value: stats.myAssigned || 0,
            icon: CheckCircle,
            color: 'text-green-600 dark:text-green-400',
            bg: 'bg-green-100 dark:bg-green-900/30'
        },
        {
            id: 'highPriority',
            label: 'Alta prioridad',
            value: stats.highPriority || 0,
            icon: AlertTriangle,
            color: 'text-red-600 dark:text-red-400',
            bg: 'bg-red-100 dark:bg-red-900/30'
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.id}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                      rounded-xl p-4 space-y-2"
                    >
                        <div className="flex items-center justify-between">
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <Icon size={18} className={stat.color} />
                            </div>
                            <span className={`text-2xl font-bold ${stat.color}`}>
                                {stat.value}
                            </span>
                        </div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            {stat.label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default ModeratorStats;
