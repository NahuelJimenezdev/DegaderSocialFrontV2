import React, { useState } from "react";
import { Calendar, Clock, Users, Video, ExternalLink, XCircle } from "lucide-react";
import { getStatusColor, getTypeColor, formatDate } from "../services/meetingService";

export function MeetingCard({ meeting, onCancel, currentUserId }) {
  const { title, description, date, time, duration, attendees, type, meetLink, status, creator } = meeting;
  const numAttendees = Array.isArray(attendees) ? attendees.length : 0;
  const [isCancelling, setIsCancelling] = useState(false);

  // Verificar si el usuario actual es el creador
  const isCreator = creator && (creator._id === currentUserId || creator === currentUserId);

  const handleCancelClick = async () => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta reunión?')) {
      return;
    }

    setIsCancelling(true);
    try {
      await onCancel(meeting._id);
    } catch (error) {
      console.error('Error al cancelar:', error);
      alert('Error al cancelar la reunión. Intenta nuevamente.');
    } finally {
      setIsCancelling(false);
    }
  };

  const renderStatus = (s) => {
    const statusMap = {
      upcoming: "Próxima",
      "in-progress": "En curso",
      completed: "Completada",
      cancelled: "Cancelada"
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(s)}`}
      >
        {statusMap[s] || s}
      </span>
    );
  };

  const renderType = (t) => {
    const text =
      t === "administrative"
        ? "Administrativa"
        : t === "training"
          ? "Capacitación"
          : "Comunitaria";

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(
          t
        )}`}
      >
        {text}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 p-6 w-full hover:shadow-md transition-all duration-200 flex flex-col justify-between">

      {/* ---------- Header ---------- */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {description}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            {renderStatus(status)}
            {renderType(type)}
          </div>
        </div>
      </div>

      {/* ---------- Datos ---------- */}
      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(date)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>
            {time} ({duration})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{numAttendees} participantes</span>
        </div>
        
      </div>

      {/* ---------- Footer ---------- */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
        {/* <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
          <Video className="w-4 h-4" />
          <span>Google Meet</span>
        </div> */}

        <div className="w-full flex items-center justify-between sm:grid sm:grid-cols-2 sm:gap-2 sm:justify-end">

          {/* Google Meet - solo celular */}
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm whitespace-nowrap">
            <Video className="w-4 h-4" />
            <span>Google Meet</span>
          </div>


          {/* Contenedor de botones */}
          <div className="flex flex-wrap justify-end gap-2 w-auto">

            {/* Botones para estado PRÓXIMA */}
            {status === "upcoming" && (
              <>
                <button className="px-3 py-1.5 text-blue-600 border border-blue-300 rounded-lg text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30">
                  Recordar
                </button>

                <a
                  href={meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600"
                >
                  <Video className="w-4 h-4" />
                  <span>Unirse</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {isCreator && onCancel && (
                  <button
                    onClick={handleCancelClick}
                    disabled={isCancelling}
                    className="flex items-center gap-1 px-3 py-1.5 text-red-600 border border-red-300 rounded-lg text-sm hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>{isCancelling ? "Cancelando..." : "Cancelar"}</span>
                  </button>
                )}
              </>
            )}

            {/* Botones para estado EN CURSO */}
            {status === "in-progress" && (
              <a
                href={meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 font-semibold animate-pulse"
              >
                <Video className="w-4 h-4" />
                <span>En curso</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {/* COMPLETADA */}
            {status === "completed" && (
              <button className="px-3 py-1.5 text-gray-600 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                Ver resumen
              </button>
            )}

            {/* CANCELADA */}
            {status === "cancelled" && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <XCircle className="w-4 h-4" />
                <span className="font-medium">Esta reunión fue cancelada</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
