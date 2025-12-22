import React from 'react';
import { Filter, ArrowUpDown, LayoutGrid, List } from 'lucide-react';

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  sort, 
  onSortChange, 
  viewMode, 
  onViewModeChange 
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Filters */}
      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mr-2">
          <Filter size={18} />
          <span className="text-sm font-medium">Filtrar:</span>
        </div>
        
        <select
          value={filters.denominacion}
          onChange={(e) => onFilterChange('denominacion', e.target.value)}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="">Todas las denominaciones</option>
          <option value="Bautista">Bautista</option>
          <option value="Pentecostal">Pentecostal</option>
          <option value="Católica">Católica</option>
          <option value="Presbiteriana">Presbiteriana</option>
          <option value="Metodista">Metodista</option>
          <option value="Otra">Otra</option>
        </select>

        <select
          value={filters.ubicacion}
          onChange={(e) => onFilterChange('ubicacion', e.target.value)}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="">Todas las ubicaciones</option>
          {/* This would ideally be populated dynamically */}
          <option value="Buenos Aires">Buenos Aires</option>
          <option value="Córdoba">Córdoba</option>
          <option value="Rosario">Rosario</option>
          <option value="Mendoza">Mendoza</option>
        </select>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown size={16} className="text-gray-400" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-lg border-none bg-transparent text-gray-700 dark:text-gray-200 focus:ring-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguas</option>
            <option value="name_asc">Nombre (A-Z)</option>
            <option value="name_desc">Nombre (Z-A)</option>
            <option value="members_desc">Más miembros</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'grid' 
                ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
            }`}
            title="Vista Cuadrícula"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'list' 
                ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
            }`}
            title="Vista Lista"
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;


