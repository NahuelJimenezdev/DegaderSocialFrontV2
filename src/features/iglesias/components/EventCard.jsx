import React from 'react';
import { Clock, MapPin, Calendar, Video, Share2 } from 'lucide-react';
import { useToast } from '../../../shared/components/Toast/ToastProvider';

const EventCard = ({ event, isOnline }) => {
  const toast = useToast();

  const handleAddToCalendar = () => {
    // Mock functionality for now
    toast.success('Evento añadido al calendario (Simulado)');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${event.nombre} - ${event.dia} a las ${event.hora}`);
    toast.success('Información del evento copiada');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all group">
      {/* Date Badge (Left Side) */}
      <div className="flex">
        <div className="w-24 bg-indigo-50 dark:bg-indigo-900/20 flex flex-col items-center justify-center p-4 border-r border-gray-100 dark:border-gray-700">
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase">
            {event.dia.substring(0, 3)}
          </span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {/* Mock date number since we only have day name */}
            --
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {event.nombre}
            </h3>
            {isOnline && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                <Video size={12} />
                Online
              </span>
            )}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock size={16} className="mr-2 text-gray-400" />
              {event.hora}
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <MapPin size={16} className="mr-2 text-gray-400" />
              {isOnline ? 'Transmisión en vivo' : 'Auditorio Principal'}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button 
              onClick={handleAddToCalendar}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gray-50 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg text-sm font-medium transition-colors"
            >
              <Calendar size={16} />
              Agendar
            </button>
            <button 
              onClick={handleShare}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Compartir"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
