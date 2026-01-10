import React from 'react';
import { PRIORITY_LEVELS, REPORT_REASONS, CONTENT_TYPES } from '../../../shared/constants/reportConstants';
import { formatRelativeTime } from '../../../shared/utils/dateUtils';

/**
 * Item de lista de reporte (mobile-first)
 * Diseño compacto para 360×640
 */
const ReportListItem = ({ report, onClick }) => {
    const priorityConfig = PRIORITY_LEVELS[report.priority];
    const reason = REPORT_REASONS.find(r => r.id === report.classification.reason);

    // Tiempo relativo
    const timeAgo = report.timeElapsed || formatRelativeTime(report.createdAt);

    // Nombre del usuario reportado
    const reportedUsername = report.contentSnapshot?.author?.username || 'Usuario';

    // Tipo de contenido
    const contentType = CONTENT_TYPES[report.contentSnapshot?.type] || 'Contenido';

    return (
        <button
            onClick={onClick}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                rounded-xl p-4 hover:border-blue-500 dark:hover:border-blue-500 transition-all
                text-left space-y-3 group"
        >
            {/* Header: Prioridad y tiempo */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${priorityConfig.badge}`} />
                    <span className={`text-xs font-medium ${priorityConfig.color}`}>
                        {priorityConfig.label}
                    </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {timeAgo}
                </span>
            </div>

            {/* Motivo principal */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    {reason && <reason.icon size={18} className="text-gray-600 dark:text-gray-400" />}
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {reason?.label || report.classification.reason}
                    </h3>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                    @{reportedUsername} · {contentType}
                </p>
            </div>

            {/* Estado */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <StatusBadge status={report.status} />
                </div>

                {report.moderation?.assignedTo && (
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        Asignado
                    </span>
                )}
            </div>
        </button>
    );
};

/**
 * Badge de estado
 */
const StatusBadge = ({ status }) => {
    const statusConfig = {
        pendiente: {
            label: 'Pendiente',
            color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
        },
        en_revision: {
            label: 'En revisión',
            color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
        },
        valido: {
            label: 'Válido',
            color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
        },
        no_valido: {
            label: 'No válido',
            color: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
        },
        duplicado: {
            label: 'Duplicado',
            color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
        },
        escalado: {
            label: 'Escalado',
            color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        }
    };

    const config = statusConfig[status] || statusConfig.pendiente;

    return (
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${config.color}`}>
            {config.label}
        </span>
    );
};

export default ReportListItem;
