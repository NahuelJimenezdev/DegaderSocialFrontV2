import { useState } from 'react';
import { Send, Paperclip, AlertCircle } from 'lucide-react';
import { useUserTickets } from '../../../shared/hooks/useUserTickets';

export default function AppealForm({ suspensionInfo, onSuccess }) {
    const [asunto, setAsunto] = useState('Apelación de suspensión');
    const [descripcion, setDescripcion] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { createTicket } = useUserTickets();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!descripcion.trim()) {
            setError('Por favor describe el motivo de tu apelación');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await createTicket({
                tipo: 'apelacion',
                asunto,
                descripcion,
                adjuntos: []
            });

            // Reset form
            setDescripcion('');
            if (onSuccess) onSuccess();

        } catch (err) {
            console.error('Error al crear apelación:', err);
            setError(err.response?.data?.message || 'Error al enviar apelación');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Apelar Suspensión
                </h3>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
                Si crees que tu suspensión es un error, puedes apelar. Un moderador revisará tu caso.
            </p>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                    <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Asunto
                    </label>
                    <input
                        type="text"
                        value={asunto}
                        onChange={(e) => setAsunto(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Descripción *
                    </label>
                    <textarea
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        rows={6}
                        placeholder="Explica por qué crees que la suspensión es incorrecta..."
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        disabled={loading}
                        required
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {descripcion.length}/2000 caracteres
                    </p>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={loading || !descripcion.trim()}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 
                     text-white font-medium rounded-lg transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                        {loading ? 'Enviando...' : 'Enviar Apelación'}
                    </button>
                </div>
            </form>
        </div>
    );
}
