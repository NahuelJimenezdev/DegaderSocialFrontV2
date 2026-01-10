import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useUserTickets } from '../../../shared/hooks/useUserTickets';
import { useNavigate } from 'react-router-dom';

export default function TicketViewer() {
    const { tickets, loading } = useUserTickets();
    const navigate = useNavigate();

    const getEstadoBadge = (estado) => {
        const badges = {
            abierto: { icon: Clock, color: 'blue', text: 'Abierto' },
            en_revision: { icon: AlertCircle, color: 'yellow', text: 'En revisión' },
            resuelto: { icon: CheckCircle, color: 'green', text: 'Resuelto' },
            rechazado: { icon: XCircle, color: 'red', text: 'Rechazado' },
            cerrado: { icon: XCircle, color: 'gray', text: 'Cerrado' }
        };

        const badge = badges[estado] || badges.abierto;
        const Icon = badge.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
                       bg-${badge.color}-100 dark:bg-${badge.color}-900/30 
                       text-${badge.color}-700 dark:text-${badge.color}-400`}>
                <Icon className="w-3 h-3" />
                {badge.text}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <p className="text-gray-600 dark:text-gray-400">Cargando tickets...</p>
            </div>
        );
    }

    if (tickets.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">No tienes tickets activos</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Mis Tickets ({tickets.length})
            </h3>

            {tickets.map((ticket) => (
                <div
                    key={ticket._id}
                    onClick={() => navigate(`/tickets/${ticket._id}`)}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer
                   hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                {ticket.asunto}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {ticket.descripcion}
                            </p>
                        </div>
                        {getEstadoBadge(ticket.estado)}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-3">
                        <span>Creado: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                        {ticket.numeroRespuestas > 0 && (
                            <span>{ticket.numeroRespuestas} respuesta(s)</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
