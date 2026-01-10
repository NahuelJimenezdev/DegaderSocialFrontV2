import { useState } from 'react';
import { CheckCircle, XCircle, User, Calendar } from 'lucide-react';

export default function TicketCard({ ticket, onResolve }) {
    const [showResolveForm, setShowResolveForm] = useState(false);
    const [motivo, setMotivo] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResolve = async (aprobado) => {
        if (!motivo.trim()) {
            alert('Debes especificar un motivo');
            return;
        }

        try {
            setLoading(true);
            await onResolve(ticket._id, aprobado, motivo);
            setShowResolveForm(false);
            setMotivo('');
        } catch (err) {
            alert(err.response?.data?.message || 'Error al resolver ticket');
        } finally {
            setLoading(false);
        }
    };

    const getTipoBadge = (tipo) => {
        const badges = {
            apelacion: { color: 'red', text: 'Apelación' },
            reporte_bug: { color: 'purple', text: 'Bug' },
            consulta: { color: 'blue', text: 'Consulta' }
        };
        const badge = badges[tipo] || badges.consulta;
        return (
            <span className={`px-2 py-1 rounded text-xs font-medium bg-${badge.color}-100 dark:bg-${badge.color}-900/30 
                       text-${badge.color}-700 dark:text-${badge.color}-400`}>
                {badge.text}
            </span>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900 dark:text-white">{ticket.asunto}</h3>
                        {getTipoBadge(ticket.tipo)}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {ticket.descripcion}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>@{ticket.usuario?.username}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                        {ticket.numeroRespuestas > 0 && (
                            <span>{ticket.numeroRespuestas} respuesta(s)</span>
                        )}
                    </div>
                </div>

                {ticket.estado === 'abierto' || ticket.estado === 'en_revision' ? (
                    <button
                        onClick={() => setShowResolveForm(!showResolveForm)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium 
                     rounded-lg transition-colors"
                    >
                        Resolver
                    </button>
                ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                          ${ticket.estado === 'resuelto'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                        {ticket.estado === 'resuelto' ? 'Resuelto' : 'Rechazado'}
                    </span>
                )}
            </div>

            {showResolveForm && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <textarea
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        placeholder="Motivo de la resolución..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-3"
                        disabled={loading}
                    />

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleResolve(true)}
                            disabled={loading || !motivo.trim()}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white 
                       text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Aprobar
                        </button>

                        <button
                            onClick={() => handleResolve(false)}
                            disabled={loading || !motivo.trim()}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white 
                       text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                            <XCircle className="w-4 h-4" />
                            Rechazar
                        </button>

                        <button
                            onClick={() => setShowResolveForm(false)}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 
                       text-sm font-medium rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
