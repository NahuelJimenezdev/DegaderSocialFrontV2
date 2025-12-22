import React, { useState } from 'react';
import { Filter } from 'lucide-react';

/**
 * ChatFilters - Dropdown de filtros para conversaciones
 * @param {string} filtroActivo - Filtro actualmente seleccionado ('todos', 'no_leido', 'destacados')
 * @param {Function} setFiltroActivo - Función para cambiar el filtro
 */
const ChatFilters = ({ filtroActivo, setFiltroActivo }) => {
    const [mostrarFiltro, setMostrarFiltro] = useState(false);

    const filtros = [
        { id: 'todos', label: 'Todos' },
        { id: 'no_leido', label: 'No leído' },
        { id: 'destacados', label: 'Destacados' }
    ];

    const filtroActual = filtros.find(f => f.id === filtroActivo) || filtros[0];

    const handleSeleccionarFiltro = (filtroId) => {
        setFiltroActivo(filtroId);
        setMostrarFiltro(false);
    };

    return (
        <div className="mb-4 flex gap-2">
            <div className="relative flex-1">
                <button
                    onClick={() => setMostrarFiltro(!mostrarFiltro)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-full"
                    aria-label={`Filtro actual: ${filtroActual.label}`}
                    aria-expanded={mostrarFiltro}
                >
                    <Filter size={16} />
                    {filtroActual.label}
                </button>

                {mostrarFiltro && (
                    <div className="absolute top-12 left-0 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                        {filtros.map(filtro => (
                            <button
                                key={filtro.id}
                                onClick={() => handleSeleccionarFiltro(filtro.id)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                            >
                                {filtro.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatFilters;
