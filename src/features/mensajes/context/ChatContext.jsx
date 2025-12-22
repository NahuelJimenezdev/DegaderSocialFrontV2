import { createContext, useContext, useMemo } from 'react';

/**
 * ChatContext - Context para compartir estado y funciones del chat
 * Reduce props drilling en componentes de mensajes
 */
const ChatContext = createContext(null);

/**
 * ChatProvider - Provider del contexto de chat
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos
 * @param {Object} props.conversacionActual - Conversación actualmente seleccionada
 * @param {string} props.userId - ID del usuario actual
 * @param {string} props.tabActiva - Tab actualmente activa
 * @param {string|null} props.menuAbierto - ID del menú abierto
 * @param {Function} props.setMenuAbierto - Setter para menú abierto
 * @param {Object} props.handlers - Objeto con handlers de acciones
 * @param {Object} props.helpers - Objeto con funciones helper
 */
export const ChatProvider = ({
    children,
    conversacionActual,
    userId,
    tabActiva,
    menuAbierto,
    setMenuAbierto,
    handlers,
    helpers
}) => {
    // Memoizar el value para evitar re-renders innecesarios
    const value = useMemo(() => ({
        // Estado
        conversacionActual,
        userId,
        tabActiva,
        menuAbierto,
        setMenuAbierto,
        // Handlers
        handleSeleccionarConversacion: handlers.handleSeleccionarConversacion,
        handleAceptarSolicitud: handlers.handleAceptarSolicitud,
        handleRechazarSolicitud: handlers.handleRechazarSolicitud,
        handleDestacarChat: handlers.handleDestacarChat,
        handleEliminarChat: handlers.handleEliminarChat,
        handleArchivarChat: handlers.handleArchivarChat,
        handleVaciarConversacion: handlers.handleVaciarConversacion,
        // Helpers
        getOtroParticipante: helpers.getOtroParticipante,
        getUnreadCount: helpers.getUnreadCount,
        formatearTiempo: helpers.formatearTiempo
    }), [
        conversacionActual,
        userId,
        tabActiva,
        menuAbierto,
        setMenuAbierto,
        handlers,
        helpers
    ]);

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

/**
 * useChatContext - Hook para acceder al contexto de chat
 * @returns {Object} Contexto de chat con estado, handlers y helpers
 * @throws {Error} Si se usa fuera de ChatProvider
 */
export const useChatContext = () => {
    const context = useContext(ChatContext);

    if (!context) {
        throw new Error('useChatContext must be used within ChatProvider');
    }

    return context;
};

export default ChatContext;
