import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle, XCircle, AlertCircle, Clock, User, Shield } from 'lucide-react';
import api from '../../../api/config';
import { useAuth } from '../../../context/AuthContext';
import { useUserRole } from '../../../shared/hooks/useUserRole'; // Asumiendo que existe o se puede importar así

export default function TicketDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { canModerate } = useUserRole(); // Para saber si mostrar controles de admin

    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchTicketDetails();
    }, [id]);

    useEffect(() => {
        scrollToBottom();
    }, [ticket?.mensajes]); // Scroll al cargar o recibir mensajes nuevos

    const fetchTicketDetails = async () => {
        try {
            // La ruta en backend puede variar según si eres admin o user, 
            // pero idealmente deberíamos tener un endpoint unificado o manejarlo aquí.
            // Voy a usar el endpoint de usuario genérico que debería devolver el ticket si eres dueño o admin.
            const response = await api.get(`/tickets/${id}`);
            setTicket(response.data);
        } catch (error) {
            console.error('Error fetching ticket:', error);
            // Si falla, probar ruta de admin si es moderador
            if (canModerate) {
                try {
                    const adminResponse = await api.get(`/admin/tickets/${id}`);
                    setTicket(adminResponse.data);
                } catch (adminError) {
                    console.error('Error fetching as admin:', adminError);
                    alert('No se pudo cargar el ticket');
                    navigate(-1);
                }
            } else {
                navigate(-1);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            // Endpoint para responder
            await api.post(`/tickets/${id}/responder`, { mensaje: newMessage });
            setNewMessage('');
            fetchTicketDetails(); // Recargar para ver el mensaje nuevo
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Error al enviar mensaje');
        } finally {
            setSending(false);
        }
    };

    const handleResolve = async () => {
        if (!window.confirm('¿Estás seguro de cerrar este ticket?')) return;
        try {
            await api.put(`/admin/tickets/${id}/resolver`, { resolucion: 'Cerrado por el moderador' });
            fetchTicketDetails();
        } catch (error) {
            console.error('Error resolving ticket:', error);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Cargando conversación...</div>;
    }

    if (!ticket) return null;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Volver
                </button>

                <div className="flex items-center gap-2">
                    <StatusBadge status={ticket.estado} />
                    <span className="text-sm text-gray-500">#{ticket.numeroTicket}</span>
                </div>
            </div>

            {/* Ticket Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{ticket.asunto}</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{ticket.descripcion}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Creado: {new Date(ticket.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span className="capitalize">Tipo: {ticket.tipo.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span className={`capitalize ${ticket.prioridad === 'alta' ? 'text-red-500' :
                                ticket.prioridad === 'media' ? 'text-yellow-500' : 'text-blue-500'
                            }`}>Prioridad: {ticket.prioridad}</span>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden flex flex-col h-[500px]">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {ticket.mensajes?.length === 0 ? (
                        <div className="text-center text-gray-500 italic py-10">No hay mensajes aún.</div>
                    ) : (
                        ticket.mensajes.map((msg, idx) => {
                            const isMe = msg.usuario._id === user._id || msg.usuario === user._id; // Ajustar según populate
                            const isAdmin = msg.esRespuestaAdmin; // Asumiendo que el backend marca esto

                            return (
                                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] rounded-lg p-3 ${isMe
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : isAdmin
                                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100 rounded-bl-none border border-purple-200 dark:border-purple-800'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                                        }`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            {isAdmin && <Shield className="w-3 h-3" />}
                                            <span className="text-xs opacity-70 font-semibold">
                                                {isAdmin ? 'Soporte' : (isMe ? 'Tú' : msg.usuario.nombreCompleto || 'Usuario')}
                                            </span>
                                        </div>
                                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.mensaje}</p>
                                        <span className="text-[10px] opacity-60 block text-right mt-1">
                                            {new Date(msg.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                {ticket.estado !== 'resuelto' && ticket.estado !== 'cerrado' ? (
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Escribe una respuesta..."
                                className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 px-4 py-2"
                                disabled={sending}
                            />
                            <button
                                type="submit"
                                disabled={sending || !newMessage.trim()}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 disabled:opacity-50 transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="p-4 bg-gray-100 dark:bg-gray-900 text-center text-gray-500 border-t border-gray-200 dark:border-gray-800">
                        Este ticket está cerrado. No se pueden enviar más mensajes.
                    </div>
                )}
            </div>

            {/* Admin Actions */}
            {canModerate && ticket.estado !== 'resuelto' && (
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={handleResolve}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Marcar como Resuelto
                    </button>
                    {/* Más acciones como rechazar podrían ir aquí */}
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }) {
    const badges = {
        abierto: { color: 'blue', text: 'Abierto', icon: Clock },
        en_revision: { color: 'yellow', text: 'En Revisión', icon: AlertCircle },
        resuelto: { color: 'green', text: 'Resuelto', icon: CheckCircle },
        rechazado: { color: 'red', text: 'Rechazado', icon: XCircle },
        cerrado: { color: 'gray', text: 'Cerrado', icon: XCircle },
    };
    const config = badges[status] || badges.abierto;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
            bg-${config.color}-100 dark:bg-${config.color}-900/30 text-${config.color}-700 dark:text-${config.color}-300`}>
            <Icon className="w-3 h-3" />
            {config.text}
        </span>
    );
}
