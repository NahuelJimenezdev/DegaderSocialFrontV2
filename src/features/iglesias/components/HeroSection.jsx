import React from 'react';
import { Search, MapPin, Users, Calendar } from 'lucide-react';

const HeroSection = ({
  searchQuery,
  onSearchChange,
  stats = { churches: 0, members: 0, events: 0 }
}) => {
  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="relative max-w-2xl mb-6">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nombre, ciudad o denominación..."
          className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500/30 focus:outline-none transition-all"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl">
        <div className="flex flex-col items-center p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <MapPin className="w-6 h-6 mb-2 colorMarcaDegader dark:text-indigo-400" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.churches}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Iglesias</span>
        </div>
        <div className="flex flex-col items-center p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <Users className="w-6 h-6 mb-2 text-purple-600 dark:text-purple-400" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.members}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Miembros</span>
        </div>
        <div className="flex flex-col items-center p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <Calendar className="w-6 h-6 mb-2 text-pink-600 dark:text-pink-400" />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.events}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">Eventos</span>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
