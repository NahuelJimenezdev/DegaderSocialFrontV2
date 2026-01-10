import { useState, useEffect, useCallback } from 'react';
import adminService from '../../api/adminService';

/**
 * Hook para gestionar tickets en el panel admin
 */
export function useAdminTickets(filters = {}) {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0
    });

    const fetchTickets = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await adminService.getAllTickets(filters);
            setTickets(data.tickets || []);
            setPagination({
                currentPage: data.currentPage || 1,
                totalPages: data.totalPages || 1,
                total: data.total || 0
            });
        } catch (err) {
            console.error('Error al obtener tickets:', err);
            setError(err.response?.data?.message || 'Error al cargar tickets');
        } finally {
            setLoading(false);
        }
    }, [JSON.stringify(filters)]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const resolveTicket = async (ticketId, aprobado, motivo) => {
        try {
            const data = await adminService.resolveTicket(ticketId, { aprobado, motivo });
            // Actualizar ticket en la lista
            setTickets(prev => prev.map(t =>
                t._id === ticketId ? data.ticket : t
            ));
            return data.ticket;
        } catch (err) {
            throw err;
        }
    };

    return {
        tickets,
        loading,
        error,
        pagination,
        refresh: fetchTickets,
        resolveTicket
    };
}
