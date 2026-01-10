import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function LiftSuspensionModal({ user, onClose, onConfirm }) {
    const [motivo, setMotivo] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleConfirm = async () => {
        if (!motivo.trim()) {
            setError('Debes especificar un motivo');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await onConfirm(user._id, motivo);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al levantar suspensión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Confirmar Levantamiento de Suspensión
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            Vas a levantar la suspensión de <strong>@{user.username}</strong>.
                            Esta acción quedará registrada en el log de auditoría.
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Motivo del levantamiento *
                        </label>
                        <textarea
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            rows={4}
                            placeholder="Ej: Apelación aprobada, suspensión incorrecta, etc."
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            disabled={loading}
                            required
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 
                     font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading || !motivo.trim()}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg 
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Levantando...' : 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
