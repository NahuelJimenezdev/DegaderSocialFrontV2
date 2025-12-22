import React from 'react';

const GroupMessageInput = ({
    message,
    setMessage,
    handleSendMessage,
    handleKeyPress,
    fileInputRef,
    handleFileSelect,
    selectedFiles,
    setSelectedFiles,
    replyTo,
    setReplyTo,
    loading
}) => {
    return (
        <div className="p-3 sm:p-4 bg-white dark:bg-[#1F2937] border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-3xl mx-auto">
                {/* Preview de Archivos Seleccionados */}
                {selectedFiles.length > 0 && (
                    <div className="flex gap-4 overflow-x-auto pb-4 mb-2 scrollbar-thin">
                        {selectedFiles.map((file, idx) => (
                            <div key={idx} className="relative flex-shrink-0 group">
                                <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 shadow-sm relative bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                                    {file.type.startsWith('image/') ? (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : file.type.startsWith('video/') ? (
                                        <span className="material-symbols-outlined text-3xl text-gray-400">videocam</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-3xl text-gray-400">description</span>
                                    )}
                                    {/* Overlay con tamaño */}
                                    <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] py-0.5 px-1 text-center truncate">
                                        {(file.size / 1024).toFixed(0)} KB
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white shadow-md hover:bg-red-600 flex items-center justify-center transition-transform hover:scale-110"
                                >
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Preview de Respuesta */}
                {replyTo && (
                    <div className="flex items-center justify-between bg-primary/5 dark:bg-primary/20 border-l-4 border-primary rounded-lg p-3 mb-3">
                        <div className="flex flex-col overflow-hidden mr-4">
                            <span className="text-xs font-semibold text-primary mb-1">
                                Respondiendo a {replyTo.author?.nombres?.primero || 'Usuario'}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                {replyTo.content || '📎 Archivo adjunto'}
                            </span>
                        </div>
                        <button
                            onClick={() => setReplyTo(null)}
                            className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined text-gray-500 text-xl">close</span>
                        </button>
                    </div>
                )}

                {/* Barra de Input */}
                <div className="flex items-end gap-2 bg-gray-50 dark:bg-gray-800 rounded-[28px] p-2 border border-gray-200 dark:border-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all">
                    <input
                        type="file"
                        multiple
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2.5 sm:p-3 text-gray-400 dark:text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors flex-shrink-0"
                        title="Adjuntar archivos"
                    >
                        <span className="material-symbols-outlined text-xl sm:text-2xl">attach_file</span>
                    </button>

                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 bg-transparent border-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 py-3 sm:py-3.5 px-2 focus:ring-0 resize-none max-h-32 text-sm sm:text-base scrollbar-hide leading-relaxed"
                        rows="1"
                        style={{ minHeight: '48px' }}
                        disabled={loading}
                    />

                    <button
                        onClick={handleSendMessage}
                        disabled={(!message.trim() && selectedFiles.length === 0) || loading}
                        className={`p-2.5 sm:p-3 rounded-full flex-shrink-0 transition-all duration-300 mb-0.5 ${(!message.trim() && selectedFiles.length === 0) || loading
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-primary to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                            }`}
                    >
                        <span className="material-symbols-outlined text-xl sm:text-2xl font-medium">send</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupMessageInput;
