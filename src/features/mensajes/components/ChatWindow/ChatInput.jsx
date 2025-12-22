import React from 'react';
import { Paperclip, Smile, Send, X, Video } from 'lucide-react';
import EmojiPicker from '../../../../shared/components/EmojiPicker/EmojiPicker';

/**
 * ChatInput - Componente reutilizable para input de mensajes
 * 
 * @param {string} nuevoMensaje - Texto del mensaje actual
 * @param {Function} setNuevoMensaje - Función para actualizar el mensaje
 * @param {File} archivoSeleccionado - Archivo seleccionado para enviar
 * @param {Object} previsualizacionArchivo - Datos de previsualización del archivo
 * @param {Function} handleFileSelect - Manejador de selección de archivo
 * @param {Function} handleCancelarArchivo - Manejador para cancelar archivo
 * @param {React.RefObject} fileInputRef - Referencia al input de archivo
 * @param {boolean} mostrarEmojiPicker - Estado del emoji picker
 * @param {Function} setMostrarEmojiPicker - Función para mostrar/ocultar emoji picker
 * @param {Function} handleEmojiSelect - Manejador de selección de emoji
 * @param {Function} handleEnviarMensaje - Manejador de envío de mensaje
 */
const ChatInput = ({
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
    handleEnviarMensaje
}) => {
    return (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            {/* Previsualización de archivo */}
            {previsualizacionArchivo && (
                <div className="mb-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                        {previsualizacionArchivo.tipo === 'imagen' ? (
                            <img
                                src={previsualizacionArchivo.url}
                                alt="Vista previa"
                                className="w-20 h-20 object-cover rounded-lg"
                            />
                        ) : (
                            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <Video size={32} className="text-gray-500" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {previsualizacionArchivo.nombre}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {previsualizacionArchivo.tipo === 'imagen' ? 'Imagen' : 'Video'}
                            </p>
                        </div>
                        <button
                            onClick={handleCancelarArchivo}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleEnviarMensaje} className="flex items-center gap-2 relative">
                {/* Input file oculto */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/avi,video/mov,video/wmv"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                {/* Botón de adjuntar archivo */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-400"
                >
                    <Paperclip size={20} />
                </button>

                {/* Botón de emoji */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setMostrarEmojiPicker(!mostrarEmojiPicker);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-400"
                >
                    <Smile size={20} />
                </button>

                {/* Input de texto */}
                <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                />

                {/* Botón enviar */}
                <button
                    type="submit"
                    disabled={!nuevoMensaje.trim() && !archivoSeleccionado}
                    className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send size={20} />
                </button>

                {/* Emoji Picker */}
                {mostrarEmojiPicker && (
                    <EmojiPicker
                        onEmojiSelect={handleEmojiSelect}
                        onClose={() => setMostrarEmojiPicker(false)}
                    />
                )}
            </form>
        </div>
    );
};

export default ChatInput;
