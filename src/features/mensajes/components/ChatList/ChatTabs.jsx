import React from 'react';

/**
 * ChatTabs - Pestañas de navegación para el sidebar de mensajes
 * @param {string} tabActiva - Tab actualmente seleccionada ('principal', 'pending', 'archived')
 * @param {Function} setTabActiva - Función para cambiar de tab
 * @param {number} pendingCount - Contador de solicitudes pendientes
 */
const ChatTabs = ({ tabActiva, setTabActiva, pendingCount }) => {
    const tabs = [
        { id: 'principal', label: 'Principal' },
        { id: 'pending', label: 'Pendientes', count: pendingCount },
        { id: 'archived', label: 'Archivados' }
    ];

    return (
        <div className="flex gap-2 mb-4">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setTabActiva(tab.id)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors relative ${tabActiva === tab.id
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    aria-label={`${tab.label}${tab.count ? ` (${tab.count} pendientes)` : ''}`}
                >
                    {tab.label}
                    {tab.count > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {tab.count > 9 ? '9+' : tab.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};

export default ChatTabs;
