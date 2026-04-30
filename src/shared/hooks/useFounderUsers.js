import { useState, useCallback } from 'react';
import founderService from '../../api/founderService';

/**
 * Hook para gestionar usuarios (solo Founder)
 */
export function useFounderUsers(initialFilters = {}) {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [geoStats, setGeoStats] = useState([]);
    const [countryUsers, setCountryUsers] = useState([]);
    const [loadingCountryUsers, setLoadingCountryUsers] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0,
        limit: 20
    });

    // Obtener usuarios con filtros
    const fetchUsers = useCallback(async (filters = initialFilters) => {
        try {
            setLoading(true);
            setError(null);
            const data = await founderService.getAllUsers(filters);
            setUsers(data.users || []);
            setStats(data.stats || null);
            setPagination(data.pagination || pagination);
        } catch (err) {
            console.error('Error al obtener usuarios:', err);
            setError(err.response?.data?.message || 'Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(initialFilters)]);

    // Crear usuario con rol
    const createUser = async (userData) => {
        try {
            setLoading(true);
            const data = await founderService.createUserWithRole(userData);
            // Refrescar lista
            await fetchUsers();
            return data;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Error al crear usuario');
        } finally {
            setLoading(false);
        }
    };

    // Actualizar rol
    const updateRole = async (userId, roleData) => {
        try {
            setLoading(true);
            const data = await founderService.updateUserRole(userId, roleData);
            // Actualizar usuario en la lista
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, ...data.user } : u));
            return data;
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Error al actualizar rol');
        } finally {
            setLoading(false);
        }
    };

    // Eliminar usuario
    const removeUser = async (userId) => {
        try {
            setLoading(true);
            await founderService.deleteUser(userId);
            // Remover de la lista
            setUsers(prev => prev.filter(u => u._id !== userId));
            if (stats) {
                setStats(prev => ({ ...prev, total: prev.total - 1 }));
            }
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Error al eliminar usuario');
        } finally {
            setLoading(false);
        }
    };

    // Resetear contraseña (Admin)
    const resetUserPassword = async (userId, newPassword) => {
        try {
            setLoading(true);
            const authService = (await import('../../api/authService')).default;
            await authService.adminResetPassword(userId, newPassword);
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Error al resetear contraseña');
        } finally {
            setLoading(false);
        }
    };

    // Obtener estadísticas geográficas
    const fetchGeoStats = useCallback(async () => {
        try {
            const data = await founderService.getGeoStats();
            setGeoStats(data.geoStats || []);
        } catch (err) {
            console.error('Error al obtener geo stats:', err);
        }
    }, []);

    // Obtener usuarios de un país específico (para el panel del mapa)
    const fetchUsersByCountry = useCallback(async (pais) => {
        try {
            setLoadingCountryUsers(true);
            const data = await founderService.getAllUsers({ pais, limit: 5 });
            setCountryUsers(data.users || []);
        } catch (err) {
            console.error('Error al obtener usuarios por país:', err);
            setCountryUsers([]);
        } finally {
            setLoadingCountryUsers(false);
        }
    }, []);

    return {
        users,
        stats,
        loading,
        error,
        pagination,
        geoStats,
        countryUsers,
        loadingCountryUsers,
        fetchUsers,
        createUser,
        updateRole,
        removeUser,
        resetUserPassword,
        fetchGeoStats,
        fetchUsersByCountry,
        refresh: fetchUsers
    };
}
