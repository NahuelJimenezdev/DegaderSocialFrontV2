import React, { useState } from 'react';
import { X, AlertCircle, Check } from 'lucide-react';
import { MODERATOR_ACTIONS } from '../../../shared/constants/reportConstants';
import {
    assignReportToSelf,
    updateReportStatus,
    takeModeratorAction
} from '../../../shared/services/reportService';
import { useToast } from '../../../shared/components/Toast/ToastProvider';

/**
 * Panel de acciones de moderación
 * Permite a los moderadores tomar decisiones sobre reportes
 */
const ModeratorActions = ({ report, onActionComplete, onClose }) => {
    const [selectedAction, setSelectedAction] = useState(null);
    const [justification, setJustification] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const toast = useToast();

    // Acciones destructivas que requieren confirmación adicional
    const destructiveActions = [
        'eliminar_contenido',
        'suspension_30_dias',
        'suspension_permanente'
    ];

    const isDestructive = selectedAction && destructiveActions.includes(selectedAction);

    // Asignarse el reporte
    const handleAssignSelf = async () => {
        setIsSubmitting(true);
        try {
            await assignReportToSelf(report._id);
            toast.success('Reporte asignado correctamente');
            onActionComplete();
        } catch (error) {
            toast.error(error.message || 'Error al asignarse el reporte');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Cambiar estado del reporte
    const handleChangeStatus = async (newStatus) => {
        if (!justification.trim() || justification.trim().length < 10) {
            toast.error('La justificación debe tener al menos 10 caracteres');
            return;
        }

        setIsSubmitting(true);
        try {
            await updateReportStatus(report._id, newStatus, justification);
            toast.success('Estado actualizado correctamente');
            setJustification('');
            onActionComplete();
        } catch (error) {
            toast.error(error.message || 'Error al actualizar estado');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Aplicar acción de moderación
    const handleApplyAction = async () => {
        if (!selectedAction) {
            toast.error('Debes seleccionar una acción');
            return;
        }

        if (!justification.trim() || justification.trim().length < 10) {
            toast.error('La justificación debe tener al menos 10 caracteres');
            return;
        }

        // Si es destructiva y no hay confirmación, mostrar modal
        if (isDestructive && !showConfirmation) {
            setShowConfirmation(true);
            return;
        }

        setIsSubmitting(true);
        try {
            const isValid = selectedAction !== 'ninguna_accion';

            await takeModeratorAction(report._id, {
                action: selectedAction,
                justification: justification.trim(),
                isValid
            });

            toast.success('Acción aplicada correctamente');
            setSelectedAction(null);
            setJustification('');
            setShowConfirmation(false);
            onActionComplete();
        } catch (error) {
            toast.error(error.message || 'Error al aplicar acción');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Formatear nombre de acción
    const formatActionName = (action) => {
        const names = {
            'ocultar_contenido': 'Ocultar contenido',
            'eliminar_contenido': 'Eliminar contenido',
            'advertir_usuario': 'Advertir al usuario',
            'suspension_1_dia': 'Suspender 1 día',
            'suspension_3_dias': 'Suspender 3 días',
            'suspension_7_dias': 'Suspender 7 días',
            'suspension_30_dias': 'Suspender 30 días',
            'suspension_permanente': 'Suspensión permanente',
            'escalar_founder': 'Escalar al Founder',
            'ninguna_accion': 'Sin acción (no válido)'
        };
        return names[action] || action;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Acciones de Moderación
                </h3>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                        <X size={16} className="text-gray-600 dark:text-gray-400" />
                    </button>
                )}
            </div>

            <div className="p-4 space-y-4">
                {/* Asignarse el reporte (si no está asignado) */}
                {!report.moderation?.assignedTo && (
                    <button
                        onClick={handleAssignSelf}
                        disabled={isSubmitting}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors text-sm"
                    >
                        {isSubmitting ? 'Asignando...' : 'Asignarme este reporte'}
                    </button>
                )}

                {/* Cambiar estado rápido */}
                {report.status === 'pendiente' && report.moderation?.assignedTo && (
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Estado rápido:</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleChangeStatus('en_revision')}
                                disabled={isSubmitting || !justification.trim()}
                                className="flex-1 py-2 px-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white text-xs font-medium rounded-lg transition-colors"
                            >
                                En Revisión
                            </button>
                        </div>
                    </div>
                )}

                {/* Selección de acción */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Acción a aplicar:
                    </label>
                    <select
                        value={selectedAction || ''}
                        onChange={(e) => setSelectedAction(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Seleccionar acción...</option>
                        {MODERATOR_ACTIONS.filter(action => action !== 'ninguna_accion').map(action => (
                            <option key={action} value={action}>
                                {formatActionName(action)}
                            </option>
                        ))}
                        <option value="ninguna_accion">Sin acción requerida</option>
                    </select>
                </div>

                {/* Justificación */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Justificación (obligatorio):
                    </label>
                    <textarea
                        value={justification}
                        onChange={(e) => setJustification(e.target.value)}
                        placeholder="Explica el motivo de tu decisión (mínimo 10 caracteres)..."
                        rows={4}
                        maxLength={500}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <div className="flex justify-between items-center text-xs">
                        <span className={`${justification.trim().length < 10 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                            {justification.trim().length < 10 ? `Faltan ${10 - justification.trim().length} caracteres` : '✓ Válido'}
                        </span>
                        <span className="text-gray-400 dark:text-gray-500">
                            {justification.length}/500
                        </span>
                    </div>
                </div>

                {/* Advertencia para acciones destructivas */}
                {isDestructive && !showConfirmation && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                        <AlertCircle size={16} className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-red-700 dark:text-red-300">
                            <strong>Acción permanente:</strong> Esta acción no se puede deshacer fácilmente. Verifica los datos antes de continuar.
                        </p>
                    </div>
                )}

                {/* Modal de confirmación */}
                {showConfirmation && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl space-y-3">
                        <div className="flex items-start gap-2">
                            <AlertCircle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-red-900 dark:text-red-200">
                                    ¿Confirmas esta acción?
                                </p>
                                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                                    Estás a punto de <strong>{formatActionName(selectedAction)}</strong>. Esta acción es permanente y quedará registrada.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="flex-1 py-2 px-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-xs font-medium rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleApplyAction}
                                disabled={isSubmitting}
                                className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                            >
                                {isSubmitting ? 'Aplicando...' : (
                                    <>
                                        <Check size={14} />
                                        Confirmar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Botón aplicar */}
                {!showConfirmation && (
                    <button
                        onClick={handleApplyAction}
                        disabled={isSubmitting || !selectedAction || !justification.trim() || justification.trim().length < 10}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Aplicando acción...' : 'Aplicar Acción'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ModeratorActions;
