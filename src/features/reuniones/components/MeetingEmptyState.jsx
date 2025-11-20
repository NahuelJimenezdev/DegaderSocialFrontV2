import React from 'react';
import { Calendar } from 'lucide-react';

export function MeetingEmptyState({ onCreateClick }) {
  return (
    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Calendar className="w-8 h-8 text-blue-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        No hay reuniones programadas
      </h3>
      <p className="text-gray-500 mb-4">
        Crea una nueva reunión para conectar con tu comunidad
      </p>
      <button
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
        onClick={onCreateClick}
      >
        Programar Reunión
      </button>
    </div>
  );
}