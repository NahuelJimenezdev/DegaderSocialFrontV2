import React from 'react';
import { X } from 'lucide-react';
import { REPORT_STATUSES, PRIORITY_LEVELS, CONTENT_TYPES } from '../../../shared/constants/reportConstants';

/**
 * Componente de filtros para el dashboard de moderación
 * Mobile-first con diseño colapsable
 */
const ReportFilters = ({ filters, onFilterChange, onClose }) => {
    const handleFilterChange = (key, value) => {
        onFilterChange({ [key]: value });
    };

    const clearFilters = () => {
        onFilterChange({
            status: '',
            priority: '',
            contentType: ''
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Filtros
                </h3>
                <button
                    onClick={onClose}
                    className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                    <X size={18} className="text-gray-600 dark:text-gray-400" />
                </button>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Estado */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Estado
                    </label>
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700
                      rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 
                      focus:ring-blue-500"
                    >
                        <option value="">Todos</option>
                        {Object.entries(REPORT_STATUSES).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Prioridad */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Prioridad
                    </label>
                    <select
                        value={filters.priority}
                        onChange={(e) => handleFilterChange('priority', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700
                      rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 
                      focus:ring-blue-500"
                    >
                        <option value="">Todas</option>
                        {Object.entries(PRIORITY_LEVELS).map(([key, config]) => (
                            <option key={key} value={key}>
                                {config.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tipo de contenido */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Tipo de contenido
                    </label>
                    <select
                        value={filters.contentType}
                        onChange={(e) => handleFilterChange('contentType', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700
                      rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 
                      focus:ring-blue-500"
                    >
                        <option value="">Todos</option>
                        {Object.entries(CONTENT_TYPES).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Botón limpiar filtros */}
            <div className="flex justify-end">
                <button
                    onClick={clearFilters}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                    Limpiar filtros
                </button>
            </div>
        </div>
    );
};

export default ReportFilters;
