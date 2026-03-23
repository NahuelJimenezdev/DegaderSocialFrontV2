import React from 'react';
import { Check, CheckCheck, Clock, AlertCircle, Quote } from 'lucide-react';
import api from '../../../../api/config';
import ProgressiveImage from '../../../../shared/components/ProgressiveImage/ProgressiveImage';

// Función auxiliar para formatear tiempo (copiada para encapsulamiento)
// Podría moverse a shared/utils en el futuro
const formatearTiempo = (fecha) => {
    if (!fecha) return '';
    const now = new Date();
    const msgDate = new Date(fecha);
    const diff = now - msgDate;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return msgDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};

const MessageBubble = ({ msg, currentUserId, onReply, onRetry }) => {
    // Normalizar IDs para comparación robusta (manejar objetos y strings)
    const emisorId = msg.emisor?._id?.toString() || msg.emisor?.toString();
    const userId = currentUserId?.toString();
    const esMio = emisorId === userId;
    const tieneArchivo = msg.archivo && msg.archivo.url;
    const esImagen = msg.tipo === 'imagen' || msg.archivo?.tipo?.startsWith('image');
    const esVideo = msg.tipo === 'video' || msg.archivo?.tipo?.startsWith('video');

    const getMediaUrl = (url) => {
        // Si la URL ya es absoluta (comienza con http), usarla directamente
        if (url?.startsWith('http')) {
            return url;
        }
        // Si es relativa, concatenar con baseURL
        return `${api.defaults.baseURL.replace('/api', '')}/${url}`;
    };

    const handleImageClick = () => {
        if (msg.archivo?.url) {
            window.open(getMediaUrl(msg.archivo.url), '_blank');
        }
    };

    const esAudio = msg.tipo === 'audio' || msg.archivo?.tipo?.startsWith('audio');
    const esArchivo = msg.tipo === 'archivo' || (!esImagen && !esVideo && !esAudio && tieneArchivo);

    return (
        <div className={`flex ${esMio ? 'justify-end' : 'justify-start'}`}>
            <div
                onDoubleClick={() => onReply && onReply(msg)}
                className={`group relative max-w-[70%] rounded-2xl px-4 py-2 ${esMio
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                    }`}
            >
                {/* Botón de respuesta rápido */}
                {onReply && (
                   <button 
                     onClick={() => onReply(msg)}
                     className="absolute -right-8 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 md:opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                     title="Responder"
                   >
                     <Quote size={12} className="text-indigo-500" />
                   </button>
                )}

                {/* VISUALIZACIÓN DE RESPUESTA (REPLY) */}
                {msg.replyTo && (
                    <div className={`mb-2 p-2 rounded-lg text-xs border-l-4 ${
                        esMio ? 'bg-indigo-700/50 border-indigo-300' : 'bg-gray-100 dark:bg-gray-700 border-indigo-500'
                    } opacity-80 truncate`}>
                        <p className="font-bold mb-1">
                            {msg.replyTo.sender?.nombres || 'Usuario'}
                        </p>
                        <p className="truncate italic">
                            {msg.replyTo.contenido || (msg.replyTo.tipo === 'imagen' ? '📷 Imagen' : '📎 Archivo')}
                        </p>
                    </div>
                )}
                {/* Mostrar archivo si existe */}
                {tieneArchivo && (
                    <div className="mb-2">
                        {esImagen ? (
                            <div onClick={handleImageClick} className="cursor-pointer">
                                <ProgressiveImage
                                    src={getMediaUrl(msg.archivo.medium || msg.archivo.large || msg.archivo.url)}
                                    blurHash={msg.archivo.blurHash}
                                    alt={msg.archivo.nombre || 'Imagen'}
                                    className="max-w-full rounded-lg hover:opacity-90 transition-opacity"
                                />
                            </div>
                        ) : esVideo ? (
                            <video
                                src={getMediaUrl(msg.archivo.url)}
                                controls
                                className="max-w-full rounded-lg"
                            />
                        ) : esAudio ? (
                            <audio
                                src={getMediaUrl(msg.archivo.url)}
                                controls
                                className="w-full"
                            />
                        ) : esArchivo ? (
                            <a
                                href={getMediaUrl(msg.archivo.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 p-2 rounded-lg ${esMio ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'} transition-colors`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{msg.archivo.nombre || 'Archivo'}</p>
                                    {msg.archivo.tamaño && (
                                        <p className={`text-xs ${esMio ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {(msg.archivo.tamaño / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    )}
                                </div>
                            </a>
                        ) : null}
                    </div>
                )}

                {/* Mostrar texto si existe */}
                {msg.contenido && (
                    <p className="text-sm break-words">{msg.contenido}</p>
                )}

                {/* Previsualización de Publicación Compartida */}
                {msg.metadata && (msg.metadata.sharedPostId || msg.metadata.postUrl) && (
                    <div className={`mt-2 p-3 rounded-xl border ${esMio ? 'bg-indigo-700/50 border-indigo-500' : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'}`}>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="material-symbols-outlined text-[18px] text-blue-400">share</span>
                            <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">Publicación Compartida</span>
                        </div>
                        <a
                            href={msg.metadata.postUrl || `/post/${msg.metadata.sharedPostId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:underline flex items-center gap-1 mt-1 font-medium"
                        >
                            Ver publicación original
                            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                        </a>
                    </div>
                )}

                <div className={`flex items-center justify-end gap-1 mt-1`}>
                    <p className={`text-xs ${esMio ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
                        {formatearTiempo(msg.createdAt)}
                    </p>
                    {esMio && (
                        <span className="flex items-center" title={msg.estado || (msg.leido ? 'leido' : 'enviado')}>
                            {msg.estado === 'sending' ? (
                                <Clock size={12} className="text-indigo-200 animate-pulse" />
                            ) : msg.estado === 'failed' ? (
                                <button onClick={() => onRetry && onRetry(msg)} title="Reintentar">
                                    <AlertCircle size={14} className="text-red-300" />
                                </button>
                            ) : (msg.estado === 'leido' || msg.leido) ? (
                                <CheckCheck size={16} className="text-cyan-300" />
                            ) : (msg.estado === 'entregado') ? (
                                <CheckCheck size={16} className="text-indigo-200" />
                            ) : (
                                <Check size={16} className="text-indigo-200" />
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
