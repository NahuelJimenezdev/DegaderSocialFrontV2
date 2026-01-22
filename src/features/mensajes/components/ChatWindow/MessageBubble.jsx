import React from 'react';
import api from '../../../../api/config';

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

const MessageBubble = ({ msg, currentUserId }) => {
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
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${esMio
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                    }`}
            >
                {/* Mostrar archivo si existe */}
                {tieneArchivo && (
                    <div className="mb-2">
                        {esImagen ? (
                            <img
                                src={getMediaUrl(msg.archivo.url)}
                                alt={msg.archivo.nombre || 'Imagen'}
                                className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={handleImageClick}
                                onError={(e) => {
                                    console.error('Error cargando imagen:', msg.archivo.url);
                                    e.target.style.display = 'none';
                                }}
                            />
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

                <p className={`text-xs mt-1 ${esMio ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {formatearTiempo(msg.createdAt)}
                </p>
            </div>
        </div>
    );
};

export default MessageBubble;
