import { useState } from 'react';
import { Ticket, Filter } from 'lucide-react';
import { useAdminTickets } from '../../../shared/hooks/useAdminTickets';
import TicketCard from '../components/TicketCard';

export default function TicketsManagementPage() {
    const [filters, setFilters] = useState({ estado: '', tipo: '' });
    const { tickets, loading, resolveTicket } = useAdminTickets(filters);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    if (loading) {
        return (
            <div className="page-container">
                <p className="text-gray-600 dark:text-gray-400">Cargando tickets...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                {/* Header Superior: Título + Icono Filtro (Mobile) */}
                <div className="flex items-center justify-between w-full md:w-auto">
                    <div className="flex items-center gap-3">
                        <Ticket className="w-6 h-6 text-blue-500" />
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                            Gestión de Tickets
                        </h1>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 
                             rounded-full text-xs md:text-sm font-medium">
                            {tickets.length}
                        </span>
                    </div>
                    {/* Icono de filtro visible solo en mobile para indicar que abajo están los filtros */}
                    <Filter className="w-5 h-5 text-gray-500 md:hidden" />
                </div>

                {/* Filtros: Full width en mobile, row en desktop */}
                <div className="flex flex-row items-center justify-between gap-3 w-full md:w-auto">
                    {/* Select de Estados */}
                    <div className="relative flex-1 md:flex-none">
                        <select
                            value={filters.estado}
                            onChange={(e) => handleFilterChange('estado', e.target.value)}
                            className="w-full md:w-40 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm appearance-none"
                        >
                            <option value="">Todos los estados</option>
                            <option value="abierto">Abierto</option>
                            <option value="en_revision">En revisión</option>
                            <option value="resuelto">Resuelto</option>
                            <option value="rechazado">Rechazado</option>
                        </select>
                    </div>

                    {/* Select de Tipos */}
                    <div className="relative flex-1 md:flex-none">
                        <select
                            value={filters.tipo}
                            onChange={(e) => handleFilterChange('tipo', e.target.value)}
                            className="w-full md:w-40 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm appearance-none"
                        >
                            <option value="">Todos los tipos</option>
                            <option value="apelacion">Apelación</option>
                            <option value="reporte_bug">Bug</option>
                            <option value="consulta">Consulta</option>
                        </select>
                    </div>
                </div>
            </div>

            {tickets.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-600 dark:text-gray-400">No hay tickets con los filtros seleccionados</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {tickets.map((ticket) => (
                        <TicketCard
                            key={ticket._id}
                            ticket={ticket}
                            onResolve={resolveTicket}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
