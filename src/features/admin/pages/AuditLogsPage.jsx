import { useState } from 'react';
import { useAuditLogs } from '../../../shared/hooks/useAuditLogs';
import { FileText, Filter, Search, Shield, AlertTriangle } from 'lucide-react';

export default function AuditLogsPage() {
    const [filters, setFilters] = useState({
        accion: '',
        moderador: '',
        fechaInicio: '',
        fechaFin: ''
    });

    const { logs, loading, pagination, changePage } = useAuditLogs(filters);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        changePage(1); // Reset a primera página al filtrar
    };

    const getActionBadge = (action) => {
        let color = 'gray';
        if (action.includes('eliminar') || action.includes('suspender')) color = 'red';
        if (action.includes('crear') || action.includes('resolver')) color = 'green';
        if (action.includes('editar') || action.includes('cambiar')) color = 'blue';
        if (action.includes('seguridad') || action.includes('denegado')) color = 'orange';

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 dark:bg-${color}-900/30 text-${color}-800 dark:text-${color}-300 capitalize`}>
                {action.replace(/_/g, ' ')}
            </span>
        );
    };

    if (loading && logs.length === 0) {
        return <div className="p-8 text-center text-gray-500">Cargando registros...</div>;
    }

    return (
        <div className="page-container">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Registros de Auditoría
                    </h1>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                    Historial de acciones realizadas por moderadores y administradores.
                </p>
            </div>

            {/* Filtros */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Acción</label>
                        <select
                            value={filters.accion}
                            onChange={(e) => handleFilterChange('accion', e.target.value)}
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                        >
                            <option value="">Todas</option>
                            <option value="crear_usuario">Crear Usuario</option>
                            <option value="eliminar_usuario">Eliminar Usuario</option>
                            <option value="suspender_usuario">Suspender Usuario</option>
                            <option value="eliminar_post">Eliminar Post</option>
                            <option value="acceso_denegado">Acceso Denegado</option>
                        </select>
                    </div>
                    {/* Más filtros si se requieren */}
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Moderador
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Acción
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Detalles
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    IP
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {logs.map((log) => (
                                <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {log.moderador?.nombreCompleto || 'Sistema'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getActionBadge(log.accion)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate" title={typeof log.detalles === 'object' ? JSON.stringify(log.detalles) : log.detalles}>
                                        {typeof log.detalles === 'object' ? log.detalles.message || JSON.stringify(log.detalles) : log.detalles}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 font-mono text-xs">
                                        {log.ipAddress}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {logs.length === 0 && !loading && (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        No se encontraron registros de auditoría.
                    </div>
                )}

                {/* Paginación simple */}
                <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6 flex items-center justify-between">
                    <button
                        onClick={() => changePage(pagination.page - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        Página {pagination.page} de {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => changePage(pagination.page + 1)}
                        disabled={!pagination.hasNextPage}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
}
