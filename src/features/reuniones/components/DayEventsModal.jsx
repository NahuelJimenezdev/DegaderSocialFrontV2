import React from 'react';
import { X, Clock, Users, Video, ExternalLink, Calendar as CalendarIcon } from 'lucide-react';
import { getTypeColor, getStatusColor } from '../services/meetingService';

export function DayEventsModal({
  isOpen,
  onClose,
  day,
  month,
  year,
  meetings,
  onSelectMeeting
}) {
  if (!isOpen) return null;

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const getTypeLabel = (type) => {
    const types = {
      administrative: 'Administrativa',
      training: 'Capacitación',
      community: 'Comunitaria',
      personal: 'Personal'
    };
    return types[type] || type;
  };

  const getStatusLabel = (status) => {
    const statuses = {
      upcoming: 'Próxima',
      'in-progress': 'En curso',
      completed: 'Completada',
      cancelled: 'Cancelada'
    };
    return statuses[status] || status;
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-hidden flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Encabezado - RESPONSIVE */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-yellow-50">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-500 rounded-lg">
              <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold text-gray-900">
                Reuniones del día {day}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                {monthNames[month]} {year} • {meetings.length} {meetings.length === 1 ? 'reunión' : 'reuniones'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition active:scale-95"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Drag indicator para mobile */}
        <div className="sm:hidden flex justify-center py-2 bg-gradient-to-r from-blue-50 to-yellow-50">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Lista de reuniones - RESPONSIVE */}
        <div className="overflow-y-auto p-3 sm:p-5 space-y-2 sm:space-y-3 flex-1">
          {meetings.map((meeting) => {
            const numAttendees = Array.isArray(meeting.attendees) ? meeting.attendees.length : 0;

            return (
              <div
                key={meeting._id}
                onClick={() => onSelectMeeting(meeting)}
                className="bg-white border-2 border-gray-100 rounded-xl p-3 sm:p-4 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group active:scale-[0.98]"
              >
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                      {meeting.title}
                    </h3>
                    {meeting.description && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                        {meeting.description}
                      </p>
                    )}
                  </div>

                  {/* Badges de tipo y estado - RESPONSIVE */}
                  <div className="flex flex-col gap-1 ml-2 sm:ml-3 flex-shrink-0">
                    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${getStatusColor(meeting.status)}`}>
                      {getStatusLabel(meeting.status)}
                    </span>
                    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border ${getTypeColor(meeting.type)}`}>
                      {getTypeLabel(meeting.type)}
                    </span>
                  </div>
                </div>

                {/* Detalles de la reunión - RESPONSIVE */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="font-medium">{meeting.time}</span>
                    <span className="text-gray-400">•</span>
                    <span>{meeting.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>{numAttendees} participantes</span>
                  </div>
                </div>

                {/* Acciones - RESPONSIVE */}
                {meeting.status === 'upcoming' && (
                  <div className="flex flex-col sm:flex-row gap-2 pt-2 sm:pt-3 border-t border-gray-100">
                    <a
                      href={meeting.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-1 bg-blue-500 text-white px-3 py-2 sm:py-1.5 rounded-lg text-xs sm:text-sm hover:bg-blue-600 transition-colors active:scale-95 font-medium"
                    >
                      <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Unirse</span>
                      <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Aquí podrías agregar funcionalidad de recordatorio
                      }}
                      className="flex items-center justify-center gap-1 px-3 py-2 sm:py-1.5 text-blue-600 border border-blue-200 rounded-lg text-xs sm:text-sm hover:bg-blue-50 transition-colors active:scale-95 font-medium"
                    >
                      Recordar
                    </button>
                  </div>
                )}

                {meeting.status === 'completed' && (
                  <div className="pt-2 sm:pt-3 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Aquí podrías agregar funcionalidad para ver resumen
                      }}
                      className="w-full flex items-center justify-center gap-1 px-3 py-2 sm:py-1.5 text-gray-600 border border-gray-200 rounded-lg text-xs sm:text-sm hover:bg-gray-50 transition-colors active:scale-95 font-medium"
                    >
                      Ver resumen
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer - RESPONSIVE */}
        <div className="p-3 sm:p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 sm:py-2 text-gray-600 hover:text-gray-800 font-semibold text-sm sm:text-base transition-colors rounded-lg hover:bg-gray-100 active:scale-95"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
