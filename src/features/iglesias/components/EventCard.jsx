import React, { useState } from 'react';
import { Clock, MapPin, Calendar, Share2, Bell, CheckCircle, XCircle, BarChart2 } from 'lucide-react';
import { useToast } from '../../../shared/components/Toast/ToastProvider';
import { interactWithEvent, getEventStats } from '../services/churchEventService';
import EventStatsModal from './EventStatsModal';
import { useAuth } from '../../../context/AuthContext';

const EventCard = ({ event, isOnline, onDismiss, onEdit, onCancel }) => {
  const toast = useToast();
  const { user } = useAuth();
  const [interactionState, setInteractionState] = useState(null); // 'attend' | 'remind' | null
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState(null);

  // Check initial state
  React.useEffect(() => {
    if (event.attendees?.some(a => a.user === user?._id)) setInteractionState('attend');
    else if (event.reminders?.some(r => r.user === user?._id)) setInteractionState('remind');
  }, [event, user]);

  const handleInteract = async (action) => {
    // Optimistic Update
    const prevState = interactionState;
    if (action === 'dismiss') {
      onDismiss(event._id);
    } else {
      setInteractionState(action);
    }

    const result = await interactWithEvent(event._id, action);
    if (result.success) {
      if (action !== 'dismiss') toast.success(action === 'attend' ? 'Asistencia confirmada' : 'Recordatorio activado');
    } else {
      setInteractionState(prevState); // Revert
      toast.error('Error al actualizar');
    }
  };

  const handleShowStats = async () => {
    const data = await getEventStats(event._id);
    if (data) {
      setStats(data);
      setShowStats(true);
    }
  };

  const isCreator = user?._id === event.creator?._id || user?._id === event.creator;

  const handleShare = () => {
    navigator.clipboard.writeText(`${event.title} - ${event.dates[0] ? new Date(event.dates[0]).toLocaleDateString() : ''}`);
    toast.success('Información copiada');
  };

  const dateObject = event.dates && event.dates[0] ? new Date(event.dates[0]) : new Date();
  const dayName = dateObject.toLocaleDateString('es-ES', { weekday: 'short' });
  const dayNumber = dateObject.getDate();

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all group relative">

        {isCreator && (
          <button
            onClick={handleShowStats}
            className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-sm colorMarcaDegader hover:bg-gray-100 z-10"
            title="Ver estadísticas"
          >
            <BarChart2 size={18} />
          </button>
        )}

        <div className="flex h-full">
          {/* Date Badge */}
          <div className="w-24 bg-indigo-50 dark:bg-indigo-900/20 flex flex-col items-center justify-center p-4 border-r border-gray-100 dark:border-gray-700">
            <span className="text-sm font-medium colorMarcaDegader dark:text-indigo-400 uppercase">
              {dayName}
            </span>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {dayNumber}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2 pr-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:colorMarcaDegader dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {event.title || event.nombre}
                </h3>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock size={16} className="mr-2 text-gray-400" />
                  {event.time || event.hora}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin size={16} className="mr-2 text-gray-400" />
                  {event.location?.ciudad ? `${event.location.ciudad}, ${event.location.provincia}` : (event.ubicacion || 'Ubicación a confirmar')}
                </div>
                {event.guest && (
                  <div className="flex items-center text-sm text-purple-600 dark:text-purple-400 font-medium">
                    <Users size={16} className="mr-2" />
                    {event.guest}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className={`grid ${isCreator ? 'grid-cols-2' : 'grid-cols-3'} gap-2 pt-4 border-t border-gray-100 dark:border-gray-700`}>
              {isCreator ? (
                <>
                  <button
                    onClick={onEdit}
                    className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-xs font-medium bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                    Editar
                  </button>
                  <button
                    onClick={onCancel}
                    className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <XCircle size={18} />
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleInteract('remind')}
                    className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors ${interactionState === 'remind' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'}`}
                  >
                    <Bell size={18} className={interactionState === 'remind' ? 'fill-current' : ''} />
                    Recordar
                  </button>

                  <button
                    onClick={() => handleInteract('attend')}
                    className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors ${interactionState === 'attend' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'}`}
                  >
                    <CheckCircle size={18} className={interactionState === 'attend' ? 'fill-current' : ''} />
                    Asistiré
                  </button>

                  <button
                    onClick={() => handleInteract('dismiss')}
                    className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-600"
                  >
                    <XCircle size={18} />
                    No interesa
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <EventStatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        stats={stats}
        eventTitle={event.title}
      />
    </>
  );
};

export default EventCard;


