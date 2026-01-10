import { useState, useEffect, useCallback } from 'react';
import adminService from '../../api/adminService';

/**
 * Hook para gestionar usuarios suspendidos (admin)
 */
export function useSuspendedUsers(params = {}) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0
    });

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await adminService.getSuspendedUsers(params);
            setUsers(data.users || []);
            setPagination({
                currentPage: data.currentPage || 1,
                totalPages: data.totalPages || 1,
                total: data.total || 0
            });
        } catch (err) {
            console.error('Error al obtener usuarios suspendidos:', err);
            setError(err.response?.data?.message || 'Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(params)]); // Usar JSON.stringify para evitar recreación infinita

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const liftSuspension = async (userId, motivo) => {
        try {
            await adminService.liftSuspension(userId, motivo);
            // Remover usuario de la lista
            setUsers(prev => prev.filter(u => u._id !== userId));
            setPagination(prev => ({ ...prev, total: prev.total - 1 }));
        } catch (err) {
            throw err;
        }
    };

    return {
        users,
        loading,
        error,
        pagination,
        refresh: fetchUsers,
        liftSuspension
    };
}
