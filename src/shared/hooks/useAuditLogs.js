import { useState, useEffect, useCallback } from 'react';
import adminService from '../../api/adminService';

/**
 * Hook para gestionar logs de auditoría
 */
export function useAuditLogs(filters = {}) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0
    });

    const fetchLogs = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await adminService.getAuditLogs(filters);
            setLogs(data.logs || []);
            setPagination({
                currentPage: data.currentPage || 1,
                totalPages: data.totalPages || 1,
                total: data.total || 0
            });
        } catch (err) {
            console.error('Error al obtener logs:', err);
            setError(err.response?.data?.message || 'Error al cargar logs');
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(filters)]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    return {
        logs,
        loading,
        error,
        pagination,
        refresh: fetchLogs
    };
}
