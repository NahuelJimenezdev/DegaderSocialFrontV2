import React from 'react';
import { Plus } from 'lucide-react';

// Aceptar la prop onNewMeeting
export function MeetingHeader({ onNewMeeting }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reuniones</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Gestiona y únete a reuniones virtuales</p>
      </div>
      <button
        // Asignar la función onNewMeeting al evento onClick
        onClick={onNewMeeting}
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
      >
        <Plus className="w-4 h-4" />
        <span>Nueva Reunión</span>
      </button>
    </div>
  );
}

