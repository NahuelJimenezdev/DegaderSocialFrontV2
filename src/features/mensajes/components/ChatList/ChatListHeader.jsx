import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * ChatListHeader - Header del sidebar de mensajes
 * @param {boolean} mostrarBuscador - Si el buscador global está visible
 * @param {Function} setMostrarBuscador - Función para toggle del buscador
 */
const ChatListHeader = ({ mostrarBuscador, setMostrarBuscador }) => {
    return (
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Mensajes
            </h1>
            <button
                onClick={() => setMostrarBuscador(!mostrarBuscador)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label={mostrarBuscador ? "Cerrar búsqueda" : "Abrir búsqueda"}
            >
                {mostrarBuscador ? <X size={20} /> : <Search size={20} />}
            </button>
        </div>
    );
};

export default ChatListHeader;
