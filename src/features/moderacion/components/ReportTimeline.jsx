import React from 'react';
import {
    CheckCircle,
    XCircle,
    User,
    Eye,
    EyeOff,
    Trash2,
    AlertTriangle,
    Clock,
    ArrowUp,
    Shield
} from 'lucide-react';
import { formatRelativeTime } from '../../../shared/utils/dateUtils';

/**
 * Línea de tiempo del historial de acciones de un reporte
 * Diseñado mobile-first para 360×640
 */
const ReportTimeline = ({ actionHistory = [] }) => {
    // Si no hay historial, mostrar mensaje
    if (!actionHistory || actionHistory.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Clock size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay acciones registradas aún</p>
            </div>
        );
    }

    // Mapeo de iconos por tipo de acción
    const getActionIcon = (action) => {
        const iconMap = {
            'reporte_creado': User,
            'asignacion': Shield,
            'cambio_estado': CheckCircle,
            'ocultar_contenido': EyeOff,
            'eliminar_contenido': Trash2,
            'advertir_usuario': AlertTriangle,
            'suspension_1_dia': Clock,
            'suspension_3_dias': Clock,
            'suspension_7_dias': Clock,
            'suspension_30_dias': Clock,
            'suspension_permanente': XCircle,
            'escalar_founder': ArrowUp,
            'ninguna_accion': CheckCircle,
            'founder_escalate': ArrowUp,
            'founder_revert': CheckCircle
        };

        return iconMap[action] || CheckCircle;
    };

    // Color por tipo de acción
    const getActionColor = (action) => {
        if (action.includes('suspension') || action.includes('eliminar')) {
            return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
        }
        if (action.includes('advertir') || action.includes('ocultar')) {
            return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
        }
        if (action.includes('escalar') || action.includes('founder')) {
            return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30';
        }
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
    };

    // Formatear nombre de acción para display
    const formatActionName = (action) => {
        const nameMap = {
            'reporte_creado': 'Reporte creado',
            'asignacion': 'Asignado a moderador',
            'cambio_estado': 'Estado actualizado',
            'ocultar_contenido': 'Contenido ocultado',
            'eliminar_contenido': 'Contenido eliminado',
            'advertir_usuario': 'Usuario advertido',
            'suspension_1_dia': 'Suspensión 1 día',
            'suspension_3_dias': 'Suspensión 3 días',
            'suspension_7_dias': 'Suspensión 7 días',
            'suspension_30_dias': 'Suspensión 30 días',
            'suspension_permanente': 'Suspensión permanente',
            'escalar_founder': 'Escalado al Founder',
            'ninguna_accion': 'Sin acción requerida',
            'founder_escalate': 'Founder: Escalado',
            'founder_revert': 'Founder: Revertido'
        };

        return nameMap[action] || action.replace(/_/g, ' ');
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Historial de Acciones
            </h3>

            <div className="relative">
                {/* Línea vertical conectora */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                {/* Lista de acciones */}
                <div className="space-y-4">
                    {actionHistory.map((entry, index) => {
                        const Icon = getActionIcon(entry.action);
                        const colorClass = getActionColor(entry.action);

                        return (
                            <div key={index} className="relative flex gap-3">
                                {/* Icono */}
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${colorClass} z-10`}>
                                    <Icon size={16} />
                                </div>

                                {/* Contenido */}
                                <div className="flex-1 min-w-0 pb-4">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatActionName(entry.action)}
                                        </p>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                            {formatRelativeTime(entry.timestamp)}
                                        </span>
                                    </div>

                                    {/* Moderador */}
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        Por: <span className="font-medium">{entry.performedByName || 'Sistema'}</span>
                                    </p>

                                    {/* Justificación */}
                                    {entry.justification && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-2 mt-2">
                                            {entry.justification}
                                        </p>
                                    )}

                                    {/* Metadata adicional */}
                                    {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-2 space-y-0.5">
                                            {entry.metadata.previousStatus && (
                                                <p>
                                                    <span className="font-medium">Estado anterior:</span> {entry.metadata.previousStatus}
                                                </p>
                                            )}
                                            {entry.metadata.newStatus && (
                                                <p>
                                                    <span className="font-medium">Nuevo estado:</span> {entry.metadata.newStatus}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ReportTimeline;
