import React from 'react';
import { Search, MapPin, Users, Calendar } from 'lucide-react';

const HeroSection = ({ 
  searchQuery, 
  onSearchChange, 
  stats = { churches: 0, members: 0, events: 0 } 
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl mb-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
        </svg>
      </div>

      <div className="relative z-10 px-8 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-in slide-in-from-bottom duration-500">
            Encuentra tu Comunidad de Fe
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 mb-8 animate-in slide-in-from-bottom duration-700 delay-100">
            Conecta con iglesias, únete a eventos y crece espiritualmente junto a otros creyentes.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-10 animate-in slide-in-from-bottom duration-700 delay-200">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por nombre, ciudad o denominación..."
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 bg-white/95 backdrop-blur-sm shadow-lg focus:ring-4 focus:ring-indigo-500/30 focus:outline-none transition-all"
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto animate-in slide-in-from-bottom duration-700 delay-300">
            <div className="flex flex-col items-center p-3 rounded-lg bg-white/10 backdrop-blur-md">
              <MapPin className="w-6 h-6 mb-2 text-indigo-200" />
              <span className="text-2xl font-bold">{stats.churches}</span>
              <span className="text-xs md:text-sm text-indigo-200">Iglesias</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-white/10 backdrop-blur-md">
              <Users className="w-6 h-6 mb-2 text-purple-200" />
              <span className="text-2xl font-bold">{stats.members}</span>
              <span className="text-xs md:text-sm text-purple-200">Miembros</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-white/10 backdrop-blur-md">
              <Calendar className="w-6 h-6 mb-2 text-pink-200" />
              <span className="text-2xl font-bold">{stats.events}</span>
              <span className="text-xs md:text-sm text-pink-200">Eventos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
