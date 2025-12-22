import React from 'react';
import { Calendar, Clock, XCircle, AlertCircle } from 'lucide-react';

// Función utilitaria para tiempo relativo
const getTimeAgo = (date) => {
  if (!date) return '';
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `Hace ${minutes}m`;
  if (hours < 24) return `Hace ${hours}h`;
  if (days < 7) return `Hace ${days}d`;
  return new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

/**
 * Componente para mostrar notificaciones de reuniones
 * Tipos: meeting_created, meeting_reminder, meeting_starting, meeting_cancelled
 */
export function MeetingNotificationCard({ notification, onClick, onMarkAsRead }) {
  const { metadata, contenido, createdAt, leida } = notification;
  const eventType = metadata?.eventType;

  // Determinar icono y color según el tipo de evento
  const getNotificationStyle = () => {
    switch (eventType) {
      case 'meeting_created':
        return {
          icon: Calendar,
          bgColor: 'bg-blue-500/20',
          textColor: 'text-blue-600',
          iconBg: 'bg-blue-100',
        };
      case 'meeting_reminder':
        return {
          icon: AlertCircle,
          bgColor: 'bg-yellow-500/20',
          textColor: 'text-yellow-600',
          iconBg: 'bg-yellow-100',
        };
      case 'meeting_starting':
        return {
          icon: Clock,
          bgColor: 'bg-green-500/20',
          textColor: 'text-green-600',
          iconBg: 'bg-green-100',
        };
      case 'meeting_cancelled':
        return {
          icon: XCircle,
          bgColor: 'bg-red-500/20',
          textColor: 'text-red-600',
          iconBg: 'bg-red-100',
        };
      default:
        return {
          icon: Calendar,
          bgColor: 'bg-gray-500/20',
          textColor: 'text-gray-600',
          iconBg: 'bg-gray-100',
        };
    }
  };

  const style = getNotificationStyle();
  const Icon = style.icon;

  // Determinar título según el tipo
  const getTitle = () => {
    switch (eventType) {
      case 'meeting_created':
        return 'Nueva Reunión';
      case 'meeting_reminder':
        return 'Recordatorio de Reunión';
      case 'meeting_starting':
        return 'Reunión en Curso';
      case 'meeting_cancelled':
        return 'Reunión Cancelada';
      default:
        return 'Notificación de Reunión';
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(notification);
    }
    if (!leida && onMarkAsRead) {
      onMarkAsRead(notification._id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex justify-between gap-4 rounded-xl bg-white p-3 shadow-sm dark:bg-zinc-800/50 mb-3 cursor-pointer transition-all hover:shadow-md ${
        !leida ? 'ring-2 ring-blue-400/50' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icono */}
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-full ${style.iconBg}`}
        >
          <Icon className={`w-6 h-6 ${style.textColor}`} />
        </div>

        {/* Contenido */}
        <div className="flex flex-1 flex-col justify-center gap-0.5">
          <p className="text-base font-medium leading-normal text-zinc-900 dark:text-white">
            {getTitle()}
          </p>
          <p className="text-sm font-normal leading-normal text-zinc-600 dark:text-zinc-400">
            {contenido}
          </p>
          <p className="text-xs font-normal leading-normal text-zinc-500 dark:text-zinc-500">
            {getTimeAgo(createdAt)}
          </p>
        </div>
      </div>

      {/* Indicador de no leído */}
      {!leida && (
        <div className="shrink-0 pt-1">
          <div className="flex size-6 items-center justify-center">
            <div className="size-2.5 rounded-full bg-[#0bda5b]"></div>
          </div>
        </div>
      )}

      {/* Timestamp si está leído */}
      {leida && (
        <div className="shrink-0 pt-1">
          <p className="text-xs font-normal leading-normal text-zinc-500 dark:text-zinc-500">
            {new Date(createdAt).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      )}
    </div>
  );
}


