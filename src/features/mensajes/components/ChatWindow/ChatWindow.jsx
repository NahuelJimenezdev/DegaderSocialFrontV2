import React, { useRef } from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { getUserAvatar, handleImageError } from '../../../../shared/utils/avatarUtils';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

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
    handleEnviarMensaje,
    getOtroParticipante,
    handleCerrarChat // Handler para botón atrás móvil
}) => {
    const otroUsuario = conversacionActual ? getOtroParticipante(conversacionActual) : null;

    return (
        <div className={`
            flex-1 flex flex-col bg-white dark:bg-gray-900 overflow-hidden
            ${conversacionActual
                ? 'max-md:fixed max-md:inset-0 max-md:z-50'
                : 'max-md:hidden'
            }
        `}>
            {!conversacionActual || cargando ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <MessageCircle size={80} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {cargando ? 'Cargando...' : 'Selecciona una conversación'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {cargando ? 'Espera un momento' : 'Elige una conversación del panel izquierdo para comenzar a chatear'}
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
                                <img
                                    src={getUserAvatar(otroUsuario)}
                                    alt={`${otroUsuario.nombres?.primero} ${otroUsuario.apellidos?.primero}`}
                                    className="w-10 h-10 rounded-full object-cover cursor-pointer"
                                    onClick={() => navigate(`/perfil/${otroUsuario._id}`)}
                                    onError={handleImageError}
                                />
                                <div>
                                    <h3
                                        className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-indigo-600"
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
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900 min-h-0">
                        {mensajes.length === 0 ? (
                            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                                <p>No hay mensajes aún. ¡Envía el primero!</p>
                            </div>
                        ) : (
                            mensajes.map((msg, index) => (
                                <MessageBubble
                                    key={msg._id || index}
                                    msg={msg}
                                    currentUserId={userId}
                                />
                            ))
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
                    />
                </>
            )}
        </div>
    );
};

export default ChatWindow;
