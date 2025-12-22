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
    const esMio = msg.emisor?._id === currentUserId || msg.emisor === currentUserId;
    const tieneArchivo = msg.archivo && msg.archivo.url;
    const esImagen = msg.tipo === 'imagen' || msg.archivo?.tipo?.startsWith('image');
    const esVideo = msg.tipo === 'video' || msg.archivo?.tipo?.startsWith('video');

    const handleImageClick = () => {
        if (msg.archivo?.url) {
            const url = `${api.defaults.baseURL.replace('/api', '')}/${msg.archivo.url}`;
            window.open(url, '_blank');
        }
    };

    const getMediaUrl = (url) => {
        return `${api.defaults.baseURL.replace('/api', '')}/${url}`;
    };

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
                            />
                        ) : esVideo ? (
                            <video
                                src={getMediaUrl(msg.archivo.url)}
                                controls
                                className="max-w-full rounded-lg"
                            />
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
