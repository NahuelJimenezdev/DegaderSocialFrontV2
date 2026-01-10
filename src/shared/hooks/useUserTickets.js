import { useState, useEffect, useCallback } from 'react';
import ticketService from '../../api/ticketService';

/**
 * Hook para gestionar tickets del usuario
 */
export function useUserTickets(filters = {}) {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTickets = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await ticketService.getUserTickets(filters);
            setTickets(data.tickets || []);
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

    const createTicket = async (ticketData) => {
        try {
            const data = await ticketService.createTicket(ticketData);
            setTickets(prev => [data.ticket, ...prev]);
            return data.ticket;
        } catch (err) {
            throw err;
        }
    };

    const addResponse = async (ticketId, responseData) => {
        try {
            const data = await ticketService.addResponse(ticketId, responseData);
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
        refresh: fetchTickets,
        createTicket,
        addResponse
    };
}
