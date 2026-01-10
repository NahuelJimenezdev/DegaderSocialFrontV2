import React, { useState } from 'react';
import { X, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { REPORT_REASONS, REPORT_SUBREASONS } from '../../constants/reportConstants';
import { createReport } from '../../services/reportService';

/**
 * Modal mobile-first para reportar contenido
 * Diseñado para funcionar perfectamente en 360×640
 */
const ReportModal = ({
    isOpen,
    onClose,
    contentType = 'post',
    contentId,
    onReportSuccess
}) => {
    const [step, setStep] = useState(1); // 1: motivo, 2: submotivo, 3: comentario, 4: confirmación
    const [selectedReason, setSelectedReason] = useState(null);
    const [selectedSubreason, setSelectedSubreason] = useState(null);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Resetear estado al cerrar
    const handleClose = () => {
        setStep(1);
        setSelectedReason(null);
        setSelectedSubreason(null);
        setComment('');
        setError(null);
        setSuccess(false);
        onClose();
    };

    // Manejar selección de motivo principal
    const handleReasonSelect = (reason) => {
        setSelectedReason(reason);
        setError(null);

        // Si tiene submotivos, ir al paso 2; si no, ir directo al paso 3
        if (reason.hasSubmotivos) {
            setStep(2);
        } else {
            setStep(3);
        }
    };

    // Manejar selección de submotivo
    const handleSubreasonSelect = (subreason) => {
        setSelectedSubreason(subreason);
        setStep(3);
    };

    // Enviar reporte
    const handleSubmit = async () => {
        if (!selectedReason) {
            setError('Debes seleccionar un motivo');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const reportData = {
                contentType,
                contentId,
                reason: selectedReason.id,
                subreason: selectedSubreason?.id,
                comment: comment.trim() || undefined,
                platform: 'web'
            };

            const response = await createReport(reportData);

            setSuccess(true);
            setStep(4);

            // Notificar éxito al componente padre
            if (onReportSuccess) {
                onReportSuccess(response.data);
            }

            // Cerrar automáticamente después de 2 segundos
            setTimeout(() => {
                handleClose();
            }, 2000);

        } catch (err) {
            console.error('Error al crear reporte:', err);
            setError(err.message || 'Error al enviar el reporte. Por favor, intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-800 w-full sm:max-w-lg sm:rounded-t-2xl rounded-t-3xl shadow-2xl
                      max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        {step > 1 && step < 4 && !success && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
                            </button>
                        )}
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {step === 4 ? 'Reporte enviado' : 'Reportar contenido'}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-700 dark:text-gray-300" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* Paso 1: Seleccionar motivo principal */}
                    {step === 1 && (
                        <div className="p-4 space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                ¿Por qué estás reportando este contenido?
                            </p>

                            {REPORT_REASONS.map((reason) => {
                                const Icon = reason.icon;
                                return (
                                    <button
                                        key={reason.id}
                                        onClick={() => handleReasonSelect(reason)}
                                        className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50
                              rounded-xl transition-colors text-left group border border-transparent
                              hover:border-gray-200 dark:hover:border-gray-600"
                                    >
                                        <div className="mt-0.5">
                                            <Icon size={20} className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {reason.label}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                {reason.description}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Paso 2: Seleccionar submotivo */}
                    {step === 2 && selectedReason && (
                        <div className="p-4 space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                ¿Qué tipo de {selectedReason.label.toLowerCase()}?
                            </p>

                            {REPORT_SUBREASONS[selectedReason.id]?.map((subreason) => (
                                <button
                                    key={subreason.id}
                                    onClick={() => handleSubreasonSelect(subreason)}
                                    className="w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50
                            rounded-xl transition-colors text-left border border-transparent
                            hover:border-gray-200 dark:hover:border-gray-600"
                                >
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {subreason.label}
                                    </p>
                                </button>
                            ))}

                            <button
                                onClick={() => setStep(3)}
                                className="w-full px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
                          hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors"
                            >
                                Omitir este paso
                            </button>
                        </div>
                    )}

                    {/* Paso 3: Comentario opcional */}
                    {step === 3 && !success && (
                        <div className="p-4 space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Detalles adicionales (opcional)
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                    Proporciona más información si lo deseas
                                </p>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Escribe aquí cualquier detalle adicional..."
                                    maxLength={500}
                                    rows={4}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700
                            rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                            resize-none"
                                />
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-right">
                                    {comment.length}/500
                                </p>
                            </div>

                            {error && (
                                <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                    <AlertCircle size={18} className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-red-600 dark:text-red-400">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                <p className="text-xs text-blue-900 dark:text-blue-200">
                                    <strong>Resumen:</strong> Reportando por <strong>{selectedReason?.label}</strong>
                                    {selectedSubreason && <> · {selectedSubreason.label}</>}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Paso 4: Confirmación */}
                    {step === 4 && success && (
                        <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <Check size={32} className="text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Reporte enviado
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Gracias por tu reporte. Nuestro equipo lo revisará y tomará las medidas necesarias.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer - Botones de acción */}
                {step === 3 && !success && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !selectedReason}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700
                        text-white font-medium rounded-xl transition-colors disabled:cursor-not-allowed
                        flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                'Enviar reporte'
                            )}            </button>
                        <button
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                        text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors
                        disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }

        @media (min-width: 640px) {
          .animate-slide-up {
            animation: none;
          }
        }
      `}</style>
        </div>
    );
};

export default ReportModal;
