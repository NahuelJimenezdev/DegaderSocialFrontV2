import React, { useState, useEffect } from 'react';
import { Shield, Filter, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getAllReports, getModeratorStats } from '../../../shared/services/reportService';
import { PRIORITY_LEVELS, REPORT_STATUSES } from '../../../shared/constants/reportConstants';
import ReportListItem from '../components/ReportListItem';
import ReportFilters from '../components/ReportFilters';
import ModeratorStats from '../components/ModeratorStats';
import ReportDetailModal from '../components/ReportDetailModal';
import { useToast } from '../../../shared/components/Toast/ToastProvider';

/**
 * Dashboard principal de moderación
 * Mobile-first design (360×640)
 */
const ModeratorDashboard = () => {
    const [reports, setReports] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState(null);

    // Filtros
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        contentType: '',
        sortBy: 'priority',
        page: 1,
        limit: 20
    });

    const toast = useToast();

    // Cargar reportes y estadísticas
    useEffect(() => {
        loadReports();
        loadStats();
    }, [filters]);

    const loadReports = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllReports(filters);
            setReports(response.data.reports);
        } catch (err) {
            console.error('Error al cargar reportes:', err);
            setError(err.message || 'Error al cargar reportes');
            toast.error('Error al cargar reportes');
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const response = await getModeratorStats();
            setStats(response.data);
        } catch (err) {
            console.error('Error al cargar estadísticas:', err);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters({ ...filters, ...newFilters, page: 1 });
    };

    const handleReportClick = (reportId) => {
        setSelectedReportId(reportId);
    };

    const handleCloseDetail = () => {
        setSelectedReportId(null);
        // Refrescar datos cuando se cierra el modal
        loadReports();
        loadStats();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Shield size={24} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Trust & Safety
                                </h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Dashboard de Moderación
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <Filter size={20} className="text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
                {/* Estadísticas */}
                {stats && <ModeratorStats stats={stats} />}

                {/* Filtros (colapsable en mobile) */}
                {showFilters && (
                    <ReportFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClose={() => setShowFilters(false)}
                    />
                )}

                {/* Estado de carga */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Cargando reportes...
                        </p>
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                        <AlertCircle size={20} className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-900 dark:text-red-200">
                                Error al cargar reportes
                            </p>
                            <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {/* Lista de reportes */}
                {!loading && !error && (
                    <div className="space-y-3">
                        {/* Encabezado de lista */}
                        <div className="flex items-center justify-between px-4 py-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {reports.length} reporte{reports.length !== 1 ? 's' : ''}
                            </p>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                                className="text-xs px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                          rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 
                          focus:ring-blue-500"
                            >
                                <option value="priority">Prioridad</option>
                                <option value="createdAt">Más recientes</option>
                                <option value="status">Estado</option>
                            </select>
                        </div>

                        {/* Items de reporte */}
                        {reports.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={32} className="text-gray-400 dark:text-gray-600" />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400">
                                    No hay reportes pendientes
                                </p>
                            </div>
                        ) : (
                            reports.map((report) => (
                                <ReportListItem
                                    key={report._id}
                                    report={report}
                                    onClick={() => handleReportClick(report._id)}
                                />
                            ))
                        )}
                    </div>
                )}

                {/* Paginación simple */}
                {!loading && reports.length > 0 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                        <button
                            onClick={() => handleFilterChange({ page: filters.page - 1 })}
                            disabled={filters.page === 1}
                            className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                        rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 
                        disabled:cursor-not-allowed transition-colors"
                        >
                            Anterior
                        </button>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Página {filters.page}
                        </span>
                        <button
                            onClick={() => handleFilterChange({ page: filters.page + 1 })}
                            disabled={reports.length < filters.limit}
                            className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                        rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 
                        disabled:cursor-not-allowed transition-colors"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>

            {/* Modal de detalle */}
            <ReportDetailModal
                reportId={selectedReportId}
                isOpen={!!selectedReportId}
                onClose={handleCloseDetail}
            />
        </div>
    );
};

export default ModeratorDashboard;
