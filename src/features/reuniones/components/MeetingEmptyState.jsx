import React from 'react';
import { Calendar } from 'lucide-react';

export function MeetingEmptyState({ onCreateClick }) {
  return (
    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
        <Calendar className="w-8 h-8 text-blue-500 dark:text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No hay reuniones programadas
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Crea una nueva reunión para conectar con tu comunidad
      </p>
      <button
        className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
        onClick={onCreateClick}
      >
        Programar Reunión
      </button>
    </div>
  );
}

