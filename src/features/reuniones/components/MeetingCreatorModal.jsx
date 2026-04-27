import React, { useState, useEffect } from 'react';
import { X, Video, Users, Clock, Link, Pencil, Check, XCircle, Loader2, UserCheck, UserX, Calendar } from 'lucide-react';
import { formatDate, formatTime } from '../services/meetingService';

/**
 * Modal de gestión para el CREADOR de una reunión.
 * Se abre cuando el creador toca su propia MeetingCard.
 * Tabs: Detalles (editar) | Asistentes | Pendientes (solicitudes)
 */
export function MeetingCreatorModal({ meeting: initialMeeting, isOpen, onClose, onRespond, onUpdate, onRefetch }) {
  const [tab, setTab] = useState('detalles');
  const [meeting, setMeeting] = useState(initialMeeting);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [respondingUser, setRespondingUser] = useState(null);
  const [saveError, setSaveError] = useState(null);

  // Sincronizar si cambia la reunión externamente
  useEffect(() => {
    setMeeting(initialMeeting);
    setEditData({
      title: initialMeeting?.title || '',
      description: initialMeeting?.description || '',
      meetLink: initialMeeting?.meetLink || '',
      time: initialMeeting?.time || '',
    });
  }, [initialMeeting]);

  if (!isOpen || !meeting) return null;

  const pendingRequests = (meeting.attendanceRequests || []).filter(r => r.status === 'pending');
  const approvedAttendees = meeting.attendees || [];

  const handleSave = async () => {
    // Validación de hora futura si la reunión es hoy
    const now = new Date();
    const [year, month, day] = meeting.date.split('T')[0].split('-').map(Number);
    const [hours, minutes] = editData.time.split(':').map(Number);
    const selectedDate = new Date(year, month - 1, day, hours, minutes);

    if (selectedDate <= now) {
      setSaveError('La nueva hora debe ser en el futuro.');
      return;
    }

    // Recalcular startsAt para el servidor (UTC)
    const startsAt = selectedDate.toISOString();
    const payload = { ...editData, startsAt };

    setIsSaving(true);
    setSaveError(null);
    const result = await onUpdate(meeting._id, payload);
    setIsSaving(false);
    if (result?.success) {
      setMeeting(prev => ({ ...prev, ...editData }));
      setEditMode(false);
    } else {
      setSaveError(result?.error || 'Error al guardar');
    }
  };

  const handleRespond = async (userId, action) => {
    setRespondingUser(userId + action);
    const result = await onRespond(meeting._id, userId, action);
    setRespondingUser(null);
    if (result?.success && onRefetch) {
      onRefetch();
    }
  };

  const tabClass = (t) =>
    `px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
      tab === t
        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
    }`;

  return (
    <div className="fixed inset-0 z-[10000] bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1a1f3a] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col border dark:border-gray-700">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-500" />
              Gestionar Reunión
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{meeting.title}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
          <button className={tabClass('detalles')} onClick={() => setTab('detalles')}>
            Detalles
          </button>
          <button className={tabClass('asistentes')} onClick={() => setTab('asistentes')}>
            Asistentes ({approvedAttendees.length})
          </button>
          <button className={`${tabClass('pendientes')} relative`} onClick={() => setTab('pendientes')}>
            Pendientes
            {pendingRequests.length > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {pendingRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto">

          {/* ── TAB DETALLES ── */}
          {tab === 'detalles' && (
            <div className="p-5 space-y-4">
              {/* Info básica */}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>{formatDate(meeting.date, meeting.startsAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{formatTime(meeting.time, meeting.startsAt)} · {meeting.duration}</span>
              </div>

              {editMode ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Título</label>
                    <input
                      value={editData.title}
                      onChange={e => setEditData(p => ({ ...p, title: e.target.value }))}
                      className="w-full mt-1 border dark:border-gray-600 rounded-lg p-2.5 bg-white dark:bg-[#0a0e27] dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Descripción</label>
                    <textarea
                      value={editData.description}
                      onChange={e => setEditData(p => ({ ...p, description: e.target.value }))}
                      rows={3} maxLength={2000}
                      className="w-full mt-1 border dark:border-gray-600 rounded-lg p-2.5 bg-white dark:bg-[#0a0e27] dark:text-white text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Link className="w-3" /> Enlace
                    </label>
                    <input
                      value={editData.meetLink}
                      onChange={e => setEditData(p => ({ ...p, meetLink: e.target.value }))}
                      type="url"
                      className="w-full mt-1 border dark:border-gray-600 rounded-lg p-2.5 bg-white dark:bg-[#0a0e27] dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="w-3" /> Hora
                    </label>
                    <input
                      value={editData.time}
                      onChange={e => setEditData(p => ({ ...p, time: e.target.value }))}
                      type="time"
                      min={meeting.date.split('T')[0] === new Date().toISOString().split('T')[0] 
                        ? new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }) 
                        : "00:00"}
                      max="23:59"
                      className="w-full mt-1 border dark:border-gray-600 rounded-lg p-2.5 bg-white dark:bg-[#0a0e27] dark:text-white text-sm outline-none"
                    />
                  </div>

                  {saveError && <p className="text-sm text-red-500">{saveError}</p>}

                  <div className="flex gap-2 justify-end pt-2">
                    <button onClick={() => setEditMode(false)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                      Cancelar
                    </button>
                    <button onClick={handleSave} disabled={isSaving}
                      className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-1.5 disabled:opacity-50 transition">
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Guardar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{meeting.title}</p>
                    {meeting.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{meeting.description}</p>}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 break-all">
                    <Link className="w-4 h-4 flex-shrink-0" />
                    <a href={meeting.meetLink} target="_blank" rel="noopener noreferrer" className="underline truncate">
                      {meeting.meetLink}
                    </a>
                  </div>
                  {meeting.status !== 'cancelled' && meeting.status !== 'completed' && (
                    <button onClick={() => setEditMode(true)}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition">
                      <Pencil className="w-4 h-4" /> Editar datos
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── TAB ASISTENTES ── */}
          {tab === 'asistentes' && (
            <div className="p-5 space-y-3">
              {approvedAttendees.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Sin asistentes confirmados todavía.</p>
                </div>
              ) : (
                approvedAttendees.map(attendee => {
                  const a = attendee._id ? attendee : { _id: attendee, nombres: {}, apellidos: {}, social: {} };
                  const nombre = `${a.nombres?.primero || ''} ${a.apellidos?.primero || ''}`.trim() || 'Usuario';
                  return (
                    <div key={a._id} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                      {a.social?.fotoPerfil ? (
                        <img src={a.social.fotoPerfil} alt={nombre} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center">
                          <span className="text-xs font-bold text-green-700 dark:text-green-300">{nombre[0]}</span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{nombre}</span>
                      <UserCheck className="w-4 h-4 text-green-500 ml-auto" />
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ── TAB PENDIENTES ── */}
          {tab === 'pendientes' && (
            <div className="p-5 space-y-3">
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No hay solicitudes pendientes.</p>
                </div>
              ) : (
                pendingRequests.map(req => {
                  const u = req.user;
                  const nombre = u ? `${u.nombres?.primero || ''} ${u.apellidos?.primero || ''}`.trim() : 'Usuario';
                  const userId = u?._id || u;
                  return (
                    <div key={userId} className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      {u?.social?.fotoPerfil ? (
                        <img src={u.social.fotoPerfil} alt={nombre} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-yellow-200 dark:bg-yellow-800 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-yellow-700 dark:text-yellow-300">{nombre[0]}</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{nombre}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Quiere unirse</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleRespond(userId, 'approve')}
                          disabled={respondingUser === userId + 'approve'}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg disabled:opacity-50 transition">
                          {respondingUser === userId + 'approve'
                            ? <Loader2 className="w-3 h-3 animate-spin" />
                            : <Check className="w-3 h-3" />}
                          Aceptar
                        </button>
                        <button
                          onClick={() => handleRespond(userId, 'deny')}
                          disabled={respondingUser === userId + 'deny'}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg disabled:opacity-50 transition">
                          {respondingUser === userId + 'deny'
                            ? <Loader2 className="w-3 h-3 animate-spin" />
                            : <XCircle className="w-3 h-3" />}
                          Denegar
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
