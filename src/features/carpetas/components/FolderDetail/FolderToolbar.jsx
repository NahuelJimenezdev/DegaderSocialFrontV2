import React from 'react';
import {
    Filter, Grid3x3, List, ChevronDown,
    File, FileText, Image as ImageIcon, Video
} from 'lucide-react';

const FolderToolbar = ({
    filterType,
    setFilterType,
    viewMode,
    setViewMode,
    showFilterMenu,
    setShowFilterMenu
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            {/* Filter */}
            <div className="relative">
                <button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200"
                >
                    <Filter size={18} />
                    <span className="text-sm font-medium">
                        {filterType === 'all' && 'Todos los archivos'}
                        {filterType === 'documents' && 'Documentos'}
                        {filterType === 'images' && 'Imágenes'}
                        {filterType === 'videos' && 'Videos'}
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
                </button>

                {showFilterMenu && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10 overflow-hidden">
                        {[
                            { value: 'all', label: 'Todos los archivos', icon: File },
                            { value: 'documents', label: 'Documentos', icon: FileText },
                            { value: 'images', label: 'Imágenes', icon: ImageIcon },
                            { value: 'videos', label: 'Videos', icon: Video }
                        ].map(filter => (
                            <button
                                key={filter.value}
                                onClick={() => {
                                    setFilterType(filter.value);
                                    setShowFilterMenu(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${filterType === filter.value ? 'bg-indigo-50 dark:bg-gray-700 colorMarcaDegader dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                <filter.icon size={16} />
                                <span className="text-sm">{filter.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 border border-gray-200 dark:border-gray-600">
                <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-indigo-600 shadow-sm colorMarcaDegader dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    title="Vista de cuadrícula"
                >
                    <Grid3x3 size={18} />
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-indigo-600 shadow-sm colorMarcaDegader dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    title="Vista de lista"
                >
                    <List size={18} />
                </button>
            </div>
        </div>
    );
};

export default FolderToolbar;
