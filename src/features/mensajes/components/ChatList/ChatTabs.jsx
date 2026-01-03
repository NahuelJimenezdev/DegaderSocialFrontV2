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
        <div className="flex gap-1 md:gap-2 mb-4 w-full">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setTabActiva(tab.id)}
                    className={`
                        flex-1 
                        py-2 px-1 md:px-4 
                        rounded-lg 
                        text-[11px] md:text-sm 
                        font-medium 
                        transition-colors 
                        relative 
                        flex items-center justify-center
                        ${tabActiva === tab.id
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }
                    `}
                    aria-label={`${tab.label}${tab.count ? ` (${tab.count} pendientes)` : ''}`}
                >
                    <span className="truncate">{tab.label}</span>
                    {tab.count > 0 && (
                        <span className={`
                            ml-1 md:ml-1.5 
                            ${tabActiva === tab.id ? 'bg-indigo-400' : 'bg-red-500'} 
                            text-white 
                            text-[10px] md:text-xs 
                            font-bold 
                            rounded-full 
                            min-w-[1.25rem] h-5 
                            flex items-center justify-center 
                            px-1
                        `}>
                            {tab.count > 9 ? '9+' : tab.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};

export default ChatTabs;
