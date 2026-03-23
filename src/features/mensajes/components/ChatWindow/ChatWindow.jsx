import React, { useRef } from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { getUserAvatar, handleImageError } from '../../../../shared/utils/avatarUtils';
import { getSocket } from '../../../../shared/lib/socket';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import ProgressiveImage from '../../../../shared/components/ProgressiveImage';

const ChatWindow = ({
    conversacionActual,
    cargando,
    mensajes,
    userId,
    navigate,
    // Actions & State
    mensajesEndRef,
    nuevoMensaje,
    setNuevoMensaje,
    archivoSeleccionado,
    previsualizacionArchivo,
    handleFileSelect,
    handleCancelarArchivo,
    fileInputRef,
    mostrarEmojiPicker,
    setMostrarEmojiPicker,
    handleEmojiSelect,
    getOtroParticipante,
    handleCerrarChat, // Handler para botón atrás móvil
    handleLoadMore,
    pagination,
    replyingTo,
    setReplyingTo,
    retryMessage
}) => {
    const otroUsuario = conversacionActual ? getOtroParticipante(conversacionActual) : null;
    const [isTyping, setIsTyping] = React.useState(false);
    const typingTimeoutRef = useRef(null);
    const lastTypingEmittedRef = useRef(0);

    // Socket: Escuchar eventos de escritura
    React.useEffect(() => {
        const socket = getSocket();
        if (!socket || !conversacionActual) return;

        const handleRemoteTypingStart = (data) => {
            // Verificar si el evento es para esta conversación O para este usuario (si es chat nuevo)
            // Aquí asumimos que si llega el evento es relevante, PERO validamos conversationId si existe
            if (data.userId !== userId) { // No mostramos nuestro propio typing
                if (data.conversationId && data.conversationId === conversacionActual._id) {
                    setIsTyping(true);
                } else if (!data.conversationId && otroUsuario && data.userId === otroUsuario._id) {
                    // Caso chat nuevo: si el sender es el otro usuario de este chat
                    setIsTyping(true);
                }
            }
        };

        const handleRemoteTypingStop = (data) => {
            if (data.userId !== userId) {
                if (data.conversationId && data.conversationId === conversacionActual._id) {
                    setIsTyping(false);
                } else if (!data.conversationId && otroUsuario && data.userId === otroUsuario._id) {
                    setIsTyping(false);
                }
            }
        };

        socket.on('user_typing_start', handleRemoteTypingStart);
        socket.on('user_typing_stop', handleRemoteTypingStop);

        return () => {
            socket.off('user_typing_start', handleRemoteTypingStart);
            socket.off('user_typing_stop', handleRemoteTypingStop);
        };
    }, [conversacionActual, userId, otroUsuario]);

    // Efecto para marcar mensajes como leídos
    React.useEffect(() => {
        const socket = getSocket();
        if (!socket || !conversacionActual || !userId) return;

        // Verificar si hay mensajes no leídos para mí
        // Usamos toString() para asegurar comparación correcta entre ObjectId y strings
        const unreadMessages = conversacionActual.mensajesNoLeidos?.some(m =>
            (m.usuario?._id || m.usuario)?.toString() === userId?.toString() && m.cantidad > 0
        );

        // Si hay mensajes no leídos, emitir evento de lectura
        if (unreadMessages) {
            console.log('[ChatWindow] Emitiendo message_read para limpieza de no leídos');
            socket.emit('message_read', {
                conversationId: conversacionActual._id,
                readerId: userId
            });
        }
    }, [conversacionActual, userId]);

    // Función para manejar el input del usuario y emitir eventos
    const handleTypingLocal = (text) => {
        const socket = getSocket();
        if (!socket || !otroUsuario) return;

        const now = Date.now();
        const THROTTLE_TIME = 2000;

        // Emitir start si ha pasado el tiempo de throttle
        if (now - lastTypingEmittedRef.current > THROTTLE_TIME) {
            socket.emit('typing_start', {
                recipientId: otroUsuario._id,
                conversationId: conversacionActual?._id
            });
            lastTypingEmittedRef.current = now;
        }

        // Limpiar timeout anterior de stop
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Configurar nuevo timeout para emitir stop después de dejar de escribir
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('typing_stop', {
                recipientId: otroUsuario._id,
                conversationId: conversacionActual?._id
            });
            lastTypingEmittedRef.current = 0; // Reset para permitir nuevo start inmediato
        }, 1500);
    };

    return (
        <div className={`
            flex-1 flex flex-col bg-white dark:bg-gray-900 overflow-hidden
            ${conversacionActual
                ? 'max-md:fixed max-md:inset-0 max-md:z-[200]'
                : 'max-md:hidden'
            }
        `}>
            {!conversacionActual || cargando ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-center p-6">
                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full"></div>
                            <MessageCircle size={80} className="text-indigo-500/40 dark:text-indigo-400/40 relative z-10 mx-auto" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            {cargando ? 'Sincronizando...' : 'Tu espacio de mensajería'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                            {cargando 
                                ? 'Espera un momento mientras recuperamos tus conversaciones.' 
                                : 'Conecta con tus amigos y grupos de forma segura. Selecciona un chat para comenzar.'}
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Header del chat */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 bg-white dark:bg-gray-900">
                        {/* Botón atrás - solo visible en móvil */}
                        <button
                            onClick={handleCerrarChat}
                            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            aria-label="Volver a lista de mensajes"
                        >
                            <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
                        </button>

                        {otroUsuario && (
                            <>
                                <ProgressiveImage
                                    src={getUserAvatar(otroUsuario)}
                                    medium={otroUsuario?.social?.fotoPerfilObj?.medium}
                                    large={otroUsuario?.social?.fotoPerfilObj?.large}
                                    blurHash={otroUsuario?.social?.fotoPerfilObj?.blurHash}
                                    alt={`${otroUsuario.nombres?.primero} ${otroUsuario.apellidos?.primero}`}
                                    className="w-10 h-10 rounded-full object-cover cursor-pointer block"
                                    onClick={() => navigate(`/perfil/${otroUsuario._id}`)}
                                    onError={handleImageError}
                                />
                                <div>
                                    <h3
                                        className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:colorMarcaDegader"
                                        onClick={() => navigate(`/perfil/${otroUsuario._id}`)}
                                    >
                                        {otroUsuario.nombres?.primero} {otroUsuario.apellidos?.primero}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Click para ver perfil</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mensajes */}
                    <div 
                        onScroll={(e) => {
                            if (e.target.scrollTop === 0) {
                                handleLoadMore();
                            }
                        }}
                        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900 min-h-0"
                    >
                        {pagination.hasMore && (
                            <div className="flex justify-center py-2">
                                <span className="text-xs text-gray-500 italic">Cargando mensajes anteriores...</span>
                            </div>
                        )}
                        {mensajes.length === 0 ? (
                            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                                <p>No hay mensajes aún. ¡Envía el primero!</p>
                            </div>
                        ) : (
                            mensajes.map((msg, index) => (
                                <MessageBubble
                                    key={msg._id || msg.clientMessageId || index}
                                    msg={msg}
                                    currentUserId={userId}
                                    onReply={setReplyingTo}
                                    onRetry={retryMessage}
                                />
                            ))
                        )}

                        {/* Indicador de escritura */}
                        {isTyping && (
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm ml-4 animate-pulse">
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                                <span>Escribiendo...</span>
                            </div>
                        )}

                        <div ref={mensajesEndRef} />
                    </div>

                    {/* Input de mensaje */}
                    <ChatInput
                        nuevoMensaje={nuevoMensaje}
                        setNuevoMensaje={setNuevoMensaje}
                        archivoSeleccionado={archivoSeleccionado}
                        previsualizacionArchivo={previsualizacionArchivo}
                        handleFileSelect={handleFileSelect}
                        handleCancelarArchivo={handleCancelarArchivo}
                        fileInputRef={fileInputRef}
                        mostrarEmojiPicker={mostrarEmojiPicker}
                        setMostrarEmojiPicker={setMostrarEmojiPicker}
                        handleEmojiSelect={handleEmojiSelect}
                        handleEnviarMensaje={handleEnviarMensaje}
                        handleTyping={handleTypingLocal}
                        replyingTo={replyingTo}
                        setReplyingTo={setReplyingTo}
                    />
                </>
            )}
        </div>
    );
};

export default ChatWindow;
