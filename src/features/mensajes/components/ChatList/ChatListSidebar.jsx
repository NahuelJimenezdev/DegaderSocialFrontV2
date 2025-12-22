import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ConversationSkeleton from '../skeleton/ConversationSkeleton';
import ChatListHeader from './ChatListHeader';
import ChatTabs from './ChatTabs';
import ChatFilters from './ChatFilters';
import GlobalSearch from './GlobalSearch';
import ConversationItem from './ConversationItem';
import { useChatContext } from '../../context/ChatContext';

/**
 * ChatListSidebar - Sidebar principal de la lista de conversaciones
 * Componente refactorizado que usa ChatContext para reducir props
 */
const ChatListSidebar = ({
    conversaciones,
    cargandoConversaciones,
    tabActiva,
    setTabActiva,
    pendingCount,
    mostrarBuscador,
    setMostrarBuscador,
    busquedaGlobal,
    handleBusquedaGlobal,
    resultadosBusqueda,
    cargandoBusqueda,
    seleccionarUsuarioBusqueda,
    filtroActivo,
    setFiltroActivo
}) => {
    const [busquedaLocal, setBusquedaLocal] = useState('');

    // Obtener helpers del context para el filtrado
    const { getOtroParticipante, getUnreadCount, userId } = useChatContext();

    // Lógica de filtrado local
    const conversacionesFiltradas = conversaciones.filter(conv => {
        // Filtro de búsqueda local
        if (busquedaLocal) {
            const otro = getOtroParticipante(conv);
            const nombreCompleto = `${otro?.nombres?.primero} ${otro?.apellidos?.primero}`.toLowerCase();
            if (!nombreCompleto.includes(busquedaLocal.toLowerCase())) {
                return false;
            }
        }

        // Filtros adicionales solo en pestaña principal
        if (tabActiva === 'principal') {
            if (filtroActivo === 'no_leido') {
                const unreadCount = getUnreadCount(conv);
                return unreadCount > 0;
            } else if (filtroActivo === 'destacados') {
                return conv.starredBy?.some(id => id === userId);
            }
        }

        return true;
    });

    return (
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <ChatListHeader
                    mostrarBuscador={mostrarBuscador}
                    setMostrarBuscador={setMostrarBuscador}
                />

                {/* Pestañas */}
                <ChatTabs
                    tabActiva={tabActiva}
                    setTabActiva={setTabActiva}
                    pendingCount={pendingCount}
                />

                {/* Filtro en Principal */}
                {tabActiva === 'principal' && (
                    <ChatFilters
                        filtroActivo={filtroActivo}
                        setFiltroActivo={setFiltroActivo}
                    />
                )}

                {/* Buscador global */}
                {mostrarBuscador && (
                    <GlobalSearch
                        busquedaGlobal={busquedaGlobal}
                        handleBusquedaGlobal={handleBusquedaGlobal}
                        resultadosBusqueda={resultadosBusqueda}
                        cargandoBusqueda={cargandoBusqueda}
                        seleccionarUsuarioBusqueda={seleccionarUsuarioBusqueda}
                    />
                )}
            </div>

            {/* Lista de conversaciones */}
            <div className="flex-1 overflow-y-auto min-h-0">
                {cargandoConversaciones ? (
                    <ConversationSkeleton />
                ) : conversacionesFiltradas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <MessageCircle size={64} className="text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            No tienes conversaciones
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Busca a alguien para iniciar un chat
                        </p>
                    </div>
                ) : (
                    conversacionesFiltradas.map((conv) => (
                        <ConversationItem
                            key={conv._id}
                            conversacion={conv}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatListSidebar;
