import React, { useState } from "react";
import { logger } from '../../../shared/utils/logger';
import { Calendar, Clock, Users, Video, ExternalLink, XCircle, HandHeart, Globe, BookOpen, UsersRound } from "lucide-react";
import { getStatusColor, getTypeColor, formatDate, formatTime } from "../services/meetingService";
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';
import { AlertDialog } from '../../../shared/components/AlertDialog';
import { MeetingCreatorModal } from './MeetingCreatorModal';

/**
 * Determinar el estado de asistencia del usuario en la reunión.
 * @returns 'creator' | 'approved' | 'pending' | 'denied' | 'invited' | 'none'
 */
function getAttendanceStatus(meeting, currentUserId) {
  if (!currentUserId) return 'none';
  const uid = currentUserId.toString();

  const creatorId = meeting.creator?._id?.toString() || meeting.creator?.toString();
  if (creatorId === uid) return 'creator';

  // Aprobado: está en attendees
  const isApproved = (meeting.attendees || []).some(a => (a._id || a).toString() === uid);
  if (isApproved) return 'approved';

  // Solicitud existente
  const req = (meeting.attendanceRequests || []).find(r => (r.user?._id || r.user).toString() === uid);
  if (req) return req.status; // 'pending' | 'approved' | 'denied'

  // Invitado (pero sin solicitud aún)
  const isInvited = (meeting.invitedUsers || []).some(u => (u._id || u).toString() === uid);
  if (isInvited) return 'invited';

  return 'none';
}

const typeIcons = {
  publica: Globe,
  capacitacion: BookOpen,
  grupal: UsersRound,
};

export function MeetingCard({ meeting, onCancel, onRequestAttendance, onRespondAttendance, onUpdateMeeting, onRefetch, currentUserId }) {
  const { title, description, date, time, duration, attendees, type, meetLink, status, creator } = meeting;
  const numAttendees = Array.isArray(attendees) ? attendees.length : 0;

  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, variant: 'info', message: '' });
  const [showCreatorModal, setShowCreatorModal] = useState(false);

  const attendanceStatus = getAttendanceStatus(meeting, currentUserId);
  const isCreator = attendanceStatus === 'creator';
  const isApproved = attendanceStatus === 'approved' || attendanceStatus === 'creator';

  const TypeIcon = typeIcons[type] || Video;

  // ── Handlers ──

  const handleCancelClick = () => setShowCancelConfirm(true);

  const handleConfirmCancel = async () => {
    setShowCancelConfirm(false);
    setIsCancelling(true);
    try {
      await onCancel(meeting._id);
    } catch {
      setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al cancelar la reunión.' });
    } finally {
      setIsCancelling(false);
    }
  };

  const handleAsistire = async () => {
    if (!onRequestAttendance) return;
    setIsRequesting(true);
    try {
      const result = await onRequestAttendance(meeting._id);
      if (result?.success) {
        setAlertConfig({ isOpen: true, variant: 'success', message: 'Solicitud enviada. El creador te responderá pronto.' });
      }
    } catch {
      setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al enviar la solicitud.' });
    } finally {
      setIsRequesting(false);
    }
  };

  const handleCreatorClick = () => {
    if (isCreator) setShowCreatorModal(true);
  };

  // ── Render Helpers ──

  const renderStatus = (s) => {
    const map = { upcoming: 'Próxima', 'in-progress': 'En curso', completed: 'Completada', cancelled: 'Cancelada' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(s)}`}>{map[s] || s}</span>;
  };

  const renderType = (t) => {
    const labels = {
      publica: 'Pública', capacitacion: 'Capacitación', grupal: 'Grupal',
      oracion: 'Oración', estudio_biblico: 'Est. Bíblico', culto: 'Culto',
      escuela_dominical: 'Esc. Dominical', administrative: 'Administrativa',
      training: 'Capacitación', community: 'Comunitaria', personal: 'Personal',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(t)} flex items-center gap-1`}>
        <TypeIcon className="w-3 h-3" />
        {labels[t] || 'Reunión'}
      </span>
    );
  };

  // Botones para usuarios NO creadores
  const renderAttendeeButtons = () => {
    if (status === 'cancelled' || status === 'completed') return null;

    switch (attendanceStatus) {
      case 'approved':
        if (status === 'in-progress') {
          return (
            <a href={meetLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-600 font-semibold animate-pulse">
              <Video className="w-4 h-4" /><span>Unirse</span><ExternalLink className="w-3 h-3" />
            </a>
          );
        }
        return (
          <a href={meetLink} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/60">
            <Video className="w-4 h-4" /><span>Ver enlace</span>
          </a>
        );

      case 'pending':
        return (
          <span className="px-3 py-1.5 text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg text-sm">
            Solicitud enviada...
          </span>
        );

      case 'denied':
        return (
          <span className="px-3 py-1.5 text-red-600 dark:text-red-400 text-sm flex items-center gap-1">
            <XCircle className="w-4 h-4" /> No autorizado
          </span>
        );

      case 'invited':
      case 'none':
        // Solo mostrar "Asistiré" si la reunión es pública, de capacitación o grupal, y está próxima/en curso
        return (
          <button onClick={handleAsistire} disabled={isRequesting}
            className="flex items-center gap-1 px-3 py-1.5 text-blue-600 border border-blue-300 rounded-lg text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 disabled:opacity-50 transition">
            <HandHeart className="w-4 h-4" />
            <span>{isRequesting ? 'Enviando...' : 'Asistiré'}</span>
          </button>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div
        onClick={isCreator ? handleCreatorClick : undefined}
        className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 w-full hover:shadow-md transition-all duration-200 flex flex-col justify-between
          ${isCreator ? 'cursor-pointer hover:border-blue-300 dark:hover:border-blue-600' : ''}`}
      >
        {/* Header */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
                {isCreator && (
                  <span className="ml-2 text-xs font-normal text-blue-500 dark:text-blue-400">(toca para gestionar)</span>
                )}
              </h3>
              {description && <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{description}</p>}
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              {renderStatus(status)}
              {renderType(type)}
            </div>
          </div>
        </div>

        {/* Datos */}
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>{formatDate(date, meeting.startsAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{formatTime(time, meeting.startsAt)} · {duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 flex-shrink-0" />
            <span>{numAttendees} confirmados</span>
            {(meeting.attendanceRequests || []).filter(r => r.status === 'pending').length > 0 && (
              <span className="text-xs text-yellow-600 dark:text-yellow-400">
                · {(meeting.attendanceRequests || []).filter(r => r.status === 'pending').length} pendientes
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
            <Video className="w-4 h-4" />
            <span>Google Meet</span>
          </div>

          <div className="flex gap-2 flex-wrap justify-end" onClick={e => e.stopPropagation()}>
            {/* Botones para el CREADOR */}
            {isCreator && status === 'upcoming' && onCancel && (
              <button onClick={handleCancelClick} disabled={isCancelling}
                className="flex items-center gap-1 px-3 py-1.5 text-red-600 border border-red-300 rounded-lg text-sm hover:bg-red-50 disabled:opacity-50 transition">
                <XCircle className="w-4 h-4" />
                <span>{isCancelling ? 'Cancelando...' : 'Cancelar'}</span>
              </button>
            )}

            {isCreator && status === 'in-progress' && (
              <a href={meetLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-600 font-semibold animate-pulse">
                <Video className="w-4 h-4" /><span>En curso</span><ExternalLink className="w-3 h-3" />
              </a>
            )}

            {isCreator && status === 'completed' && (
              <span className="text-sm text-gray-400 dark:text-gray-500">Reunión finalizada</span>
            )}

            {isCreator && status === 'cancelled' && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <XCircle className="w-4 h-4" /><span>Cancelada</span>
              </div>
            )}

            {/* Botones para NO creadores */}
            {!isCreator && renderAttendeeButtons()}

            {/* Completada / cancelada para no creadores */}
            {!isCreator && status === 'completed' && (
              <span className="text-sm text-gray-400">Reunión finalizada</span>
            )}
            {!isCreator && status === 'cancelled' && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <XCircle className="w-4 h-4" /><span>Cancelada</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={handleConfirmCancel}
        title="Cancelar Reunión"
        message="¿Estás seguro de que deseas cancelar esta reunión?"
        confirmText="Sí, cancelar"
        cancelText="No, volver"
        variant="danger"
        isLoading={isCancelling}
      />
      <AlertDialog
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        variant={alertConfig.variant}
        message={alertConfig.message}
      />

      {/* Modal de gestión del creador */}
      {isCreator && (
        <MeetingCreatorModal
          meeting={meeting}
          isOpen={showCreatorModal}
          onClose={() => setShowCreatorModal(false)}
          onRespond={onRespondAttendance}
          onUpdate={onUpdateMeeting}
          onRefetch={onRefetch}
        />
      )}
    </>
  );
}
