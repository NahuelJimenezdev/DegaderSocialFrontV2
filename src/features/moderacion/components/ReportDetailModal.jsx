import React, { useState, useEffect } from 'react';
import { X, AlertCircle, User, Flag, Clock, Shield } from 'lucide-react';
import { getReportById } from '../../../shared/services/reportService';
import { formatRelativeTime } from '../../../shared/utils/dateUtils';
import { REPORT_REASONS } from '../../../shared/constants/reportConstants';
import ReportTimeline from './ReportTimeline';
import ModeratorActions from './ModeratorActions';

/**
 * Modal de detalle completo de un reporte
 * Vista full-screen mobile-first    */
const ReportDetailModal = ({ reportId, isOpen, onClose }) => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showActions, setShowActions] = useState(false);

    // Cargar reporte
    useEffect(() => {
        if (!isOpen || !reportId) return;

        const loadReport = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getReportById(reportId);
                setReport(response.data.report);
            } catch (err) {
                setError(err.message || 'Error al cargar el reporte');
            } finally {
                setLoading(false);
            }
        };

        loadReport();
    }, [reportId, isOpen]);

    // Refresh cuando se completa una acción
    const handleActionComplete = async () => {
        setShowActions(false);
        try {
            const response = await getReportById(reportId);
            setReport(response.data.report);
        } catch (err) {
            console.error('Error al recargar reporte:', err);
        }
    };

    if (!isOpen) return null;

    // Obtener información del motivo principal
    const reasonInfo = REPORT_REASONS.find(r => r.id === report?.classification?.reason);

    // Badge de prioridad
    const priorityBadge = {
        alta: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
        media: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
        baja: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
    };

    // Badge de estado
    const statusBadge = {
        pendiente: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
        en_revision: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
        valido: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        no_valido: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
        escalado: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-800 w-full sm:max-w-4xl h-full sm:h-[90vh] sm:rounded-2xl shadow-2xl flex flex-col animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Flag size={20} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {report?.reportNumber || 'Cargando...'}
                            </h2>
                            {report && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatRelativeTime(report.createdAt)}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-700 dark:text-gray-300" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {loading && (
                        <div className="flex items-center justify-center h-full">
                            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                        </div>
                    )}

                    {error && (
                        <div className="flex flex-col items-center justify-center h-full p-6">
                            <AlertCircle size={48} className="text-red-500 mb-4" />
                            <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
                        </div>
                    )}

                    {!loading && !error && report && (
                        <div className="p-4 space-y-6">
                            {/* Badges de prioridad y estado */}
                            <div className="flex flex-wrap gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityBadge[report.priority]}`}>
                                    Prioridad {report.priority}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge[report.status]}`}>
                                    {report.status.replace(/_/g, ' ')}
                                </span>
                                {report.flags?.isEscalated && (
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                                        Escalado
                                    </span>
                                )}
                            </div>

                            {/* Clasificación */}
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-3">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Flag size={16} />
                                    Motivo del Reporte
                                </h3>
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Categoría principal:</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {reasonInfo?.label || report.classification.reason}
                                        </p>
                                    </div>
                                    {report.classification.subreason && (
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Subcategoría:</p>
                                            <p className="text-sm text-gray-900 dark:text-white">
                                                {report.classification.subreason.replace(/_/g, ' ')}
                                            </p>
                                        </div>
                                    )}
                                    {report.classification.comment && (
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Comentario adicional:</p>
                                            <p className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg p-2">
                                                {report.classification.comment}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Snapshot del contenido */}
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-3">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Contenido Reportado
                                </h3>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <User size={14} />
                                        <span>
                                            {report.contentSnapshot.author.nombreCompleto} (@{report.contentSnapshot.author.username})
                                        </span>
                                        <span>•</span>
                                        <Clock size={14} />
                                        <span>{formatRelativeTime(report.contentSnapshot.createdAt)}</span>
                                    </div>

                                    {/* Texto del post */}
                                    {report.contentSnapshot.content.texto && (
                                        <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                                            {report.contentSnapshot.content.texto}
                                        </p>
                                    )}

                                    {/* Imágenes */}
                                    {report.contentSnapshot.content.imagenes && report.contentSnapshot.content.imagenes.length > 0 && (
                                        <div className="grid grid-cols-2 gap-2">
                                            {report.contentSnapshot.content.imagenes.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={img}
                                                    alt={`Imagen ${idx + 1}`}
                                                    className="w-full h-40 object-cover rounded-lg"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Información del reportador */}
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-2">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Reportado Por
                                </h3>
                                <div className="flex items-center gap-2">
                                    <User size={16} className="text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm text-gray-900 dark:text-white">
                                        {report.reportedBy.username}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatRelativeTime(report.reportedBy.timestamp)}
                                    </span>
                                </div>
                            </div>

                            {/* Moderación */}
                            {report.moderation?.assignedTo && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 space-y-2">
                                    <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                                        <Shield size={16} />
                                        Moderador Asignado
                                    </h3>
                                    <p className="text-sm text-blue-800 dark:text-blue-300">
                                        Asignado a moderador
                                    </p>
                                    {report.moderation.reviewedBy && (
                                        <div className="text-xs text-blue-700 dark:text-blue-400">
                                            <p>Revisado {formatRelativeTime(report.moderation.reviewedAt)}</p>
                                            {report.moderation.decision && (
                                                <p className="mt-1">
                                                    Decisión: <strong>{report.moderation.decision.isValid ? 'Válido' : 'No válido'}</strong>
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Timeline */}
                            {report.actionHistory && report.actionHistory.length > 0 && (
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                                    <ReportTimeline actionHistory={report.actionHistory} />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer - Acciones */}
                {!loading && !error && report && (
                    <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
                        {showActions ? (
                            <ModeratorActions
                                report={report}
                                onActionComplete={handleActionComplete}
                                onClose={() => setShowActions(false)}
                            />
                        ) : (
                            <button
                                onClick={() => setShowActions(true)}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                            >
                                Tomar Acción
                            </button>
                        )}
                    </div>
                )}
            </div>

            <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
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

export default ReportDetailModal;
