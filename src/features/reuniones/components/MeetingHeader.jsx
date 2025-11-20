import React from 'react';
import { Plus } from 'lucide-react';

// Aceptar la prop onNewMeeting
export function MeetingHeader({ onNewMeeting }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reuniones</h1>
        <p className="text-gray-600 mt-1">Gestiona y únete a reuniones virtuales</p>
      </div>
      <button
        // Asignar la función onNewMeeting al evento onClick
        onClick={onNewMeeting}
        className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-yellow-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-yellow-600 transition-all duration-200 shadow-lg"
      >
        <Plus className="w-4 h-4" />
        <span>Nueva Reunión</span>
      </button>
    </div>
  );
}