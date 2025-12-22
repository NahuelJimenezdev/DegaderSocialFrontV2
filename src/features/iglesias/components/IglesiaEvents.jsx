import React from 'react';
import { churchColors } from '../utils/colors';
import EventCard from './EventCard';

const IglesiaEvents = ({ iglesiaData }) => {
  const reuniones = iglesiaData?.reuniones || [];

  // Helper to determine if event is online (basic logic)
  const isOnlineEvent = (eventName) => {
    return eventName.toLowerCase().includes('online') || 
           eventName.toLowerCase().includes('virtual') ||
           eventName.toLowerCase().includes('zoom');
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 bg-gray-50 dark:bg-gray-900 scrollbar-thin">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className={`${churchColors.cardBg} rounded-lg shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4`}>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Horarios de Reunión
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Próximos eventos y cultos programados
            </p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">calendar_add_on</span>
            <span>Ver Calendario Completo</span>
          </button>
        </div>

        {/* Events Grid */}
        {reuniones.length === 0 ? (
          <div className={`${churchColors.cardBg} rounded-xl shadow-lg p-12 text-center`}>
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700">
              event_busy
            </span>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              No hay reuniones programadas actualmente
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {reuniones.map((reunion, index) => (
              <EventCard 
                key={index} 
                event={reunion} 
                isOnline={isOnlineEvent(reunion.nombre)} 
              />
            ))}
          </div>
        )}

        {/* Note Section */}
        {reuniones.length > 0 && (
          <div className={`mt-8 ${churchColors.cardBg} p-6 rounded-xl shadow-sm border-l-4 ${churchColors.accentBorder} flex items-start gap-4`}>
            <span className="material-symbols-outlined text-indigo-500 mt-1">info</span>
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">Información Importante</h4>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm leading-relaxed">
                Las reuniones de líderes y coordinadores son privadas y se notifican directamente a los involucrados. 
                Si tienes dudas sobre algún evento, por favor contacta a la administración.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default IglesiaEvents;


