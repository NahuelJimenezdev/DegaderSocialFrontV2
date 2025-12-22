import React, { useState } from 'react';
import { API_BASE_URL } from '../../../../shared/config/env';
import AudioPlayer from '../../../../shared/components/AudioPlayer/AudioPlayer';
import { getUserAvatar } from '../../../../shared/utils/avatarUtils';

// URL base para archivos estáticos (sin /api)
const getBaseUrl = () => {
    const apiUrl = API_BASE_URL;
    return apiUrl.replace('/api', '');
};

// Obtener URL completa para un attachment
const getAttachmentUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `${getBaseUrl()}${url}`;
};

// Obtener información del archivo
const getFileInfo = (fileName) => {
    if (!fileName) return { icon: 'description', color: 'bg-gray-500', label: 'Archivo' };
    const ext = fileName.split('.').pop()?.toLowerCase();
    const fileTypes = {
        pdf: { icon: 'picture_as_pdf', color: 'bg-red-600', label: 'PDF' },
        doc: { icon: 'description', color: 'bg-blue-600', label: 'Word' },
        docx: { icon: 'description', color: 'bg-blue-600', label: 'Word' },
        xls: { icon: 'table_chart', color: 'bg-green-600', label: 'Excel' },
        xlsx: { icon: 'table_chart', color: 'bg-green-600', label: 'Excel' },
        csv: { icon: 'table_chart', color: 'bg-green-600', label: 'CSV' },
        ppt: { icon: 'slideshow', color: 'bg-orange-600', label: 'PowerPoint' },
        pptx: { icon: 'slideshow', color: 'bg-orange-600', label: 'PowerPoint' },
        txt: { icon: 'article', color: 'bg-gray-600', label: 'Texto' },
        rtf: { icon: 'article', color: 'bg-gray-600', label: 'RTF' },
        js: { icon: 'code', color: 'bg-yellow-600', label: 'JavaScript' },
        ts: { icon: 'code', color: 'bg-blue-500', label: 'TypeScript' },
        html: { icon: 'code', color: 'bg-orange-500', label: 'HTML' },
        css: { icon: 'code', color: 'bg-purple-500', label: 'CSS' },
        json: { icon: 'data_object', color: 'bg-gray-700', label: 'JSON' },
        zip: { icon: 'folder_zip', color: 'bg-yellow-700', label: 'ZIP' },
        rar: { icon: 'folder_zip', color: 'bg-purple-700', label: 'RAR' },
        '7z': { icon: 'folder_zip', color: 'bg-gray-700', label: '7Z' },
    };
    return fileTypes[ext] || { icon: 'description', color: 'bg-gray-500', label: ext?.toUpperCase() || 'Archivo' };
};

// Formatear tamaño de archivo
const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Formatear fecha
const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'ahora';
};

const GroupMessageBubble = ({
    msg,
    user,
    isAdmin,
    isOwner,
    onReply,
    onDelete,
    onReact,
    onToggleStar,
    showEmojiPicker,
    setShowEmojiPicker
}) => {
    const isMyMessage = String(msg.author?._id) === String(user?._id);
    const senderName = msg.author
        ? `${msg.author.nombres?.primero || ''} ${msg.author.apellidos?.primero || ''}`.trim()
        : 'Usuario';

    return (
        <div
            id={`message-${msg._id}`}
            className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} group`}
        >
            <div className={`flex gap-2 sm:gap-3 max-w-[95%] sm:max-w-[85%] md:max-w-[75%] ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 overflow-hidden flex-shrink-0 ring-2 ring-white dark:ring-gray-800 shadow-sm">
                    <img
                        src={getUserAvatar(msg.author)}
                        alt={senderName}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/avatars/default-avatar.png'; }}
                    />
                </div>

                {/* Contenedor del mensaje */}
                <div className={`flex flex-col gap-1 ${isMyMessage ? 'items-end' : 'items-start'}`}>
                    {/* Nombre del remitente */}
                    <div className={`flex items-center gap-2 px-1 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {isMyMessage ? 'Tú' : senderName}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                            {formatTime(msg.createdAt)}
                        </span>
                        {/* Indicador de destacado */}
                        {msg.starredBy?.includes(user?._id) && (
                            <span className="material-symbols-outlined text-xs text-yellow-500">star</span>
                        )}
                    </div>

                    {/* Reply To */}
                    {msg.replyTo && (
                        <div className={`text-xs rounded-lg p-2 mb-1.5 max-w-[90%] sm:max-w-sm border-l-[3px] ${isMyMessage
                            ? 'bg-primary/10 border-primary'
                            : 'bg-gray-100 dark:bg-gray-800 border-gray-400 dark:border-gray-600'
                            }`}>
                            <div className="flex items-start gap-1.5">
                                <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-[14px] flex-shrink-0 mt-0.5">reply</span>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-gray-700 dark:text-gray-300 text-[11px] mb-0.5 truncate">
                                        {msg.replyTo.author
                                            ? `${msg.replyTo.author.nombres?.primero || ''} ${msg.replyTo.author.apellidos?.primero || ''}`.trim()
                                            : 'Usuario'}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 text-[11px] truncate leading-tight">
                                        {msg.replyTo.content || '📎 Archivo adjunto'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contenido del mensaje */}
                    <div
                        className={`rounded-3xl px-4 py-2.5 shadow-sm ${isMyMessage
                            ? 'bg-primary text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                            } ${msg.error ? 'border-2 border-red-500' : ''}`}
                        style={{
                            opacity: msg.isOptimistic ? 0.6 : 1,
                            transition: 'opacity 0.3s ease'
                        }}
                    >
                        {msg.content && (
                            <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                                {msg.content}
                            </p>
                        )}
                        {msg.error && (
                            <p className="text-xs text-red-500 mt-1">
                                ✗ Error al enviar
                            </p>
                        )}

                        {/* Attachments */}
                        {msg.attachments && msg.attachments.length > 0 && (
                            <div className={`${msg.content ? 'mt-3' : ''} space-y-2`}>
                                {msg.attachments.map((att, idx) => (
                                    <div key={`${msg._id}-att-${idx}-${att.name || ''}`}>
                                        {att.type === 'image' && (
                                            <img
                                                src={getAttachmentUrl(att.url)}
                                                alt={att.name || 'Imagen'}
                                                className="max-w-[240px] sm:max-w-xs rounded-2xl cursor-pointer hover:opacity-95 transition-opacity shadow-md w-full h-auto"
                                                onClick={() => window.open(getAttachmentUrl(att.url), '_blank')}
                                            />
                                        )}
                                        {att.type === 'video' && (
                                            <video
                                                src={getAttachmentUrl(att.url)}
                                                controls
                                                className="max-w-[240px] sm:max-w-xs rounded-2xl shadow-md w-full"
                                            />
                                        )}
                                        {att.type === 'audio' && (
                                            <AudioPlayer
                                                audioUrl={getAttachmentUrl(att.url)}
                                                isMyMessage={isMyMessage}
                                            />
                                        )}
                                        {att.type === 'file' && (() => {
                                            const fileInfo = getFileInfo(att.name);
                                            return (
                                                <a
                                                    href={getAttachmentUrl(att.url)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl w-full max-w-[240px] sm:max-w-[280px] transition-all hover:opacity-90 ${isMyMessage
                                                        ? 'bg-white/10 hover:bg-white/20'
                                                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                        }`}
                                                >
                                                    <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 ${fileInfo.color} rounded-lg flex items-center justify-center shadow-sm`}>
                                                        <span className="material-symbols-outlined text-white text-xl sm:text-2xl">{fileInfo.icon}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium truncate ${isMyMessage ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                                            {att.name || 'Archivo'}
                                                        </p>
                                                        <p className={`text-xs mt-0.5 ${isMyMessage ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                                                            {formatFileSize(att.size)} {att.size ? '•' : ''} {fileInfo.label}
                                                        </p>
                                                    </div>
                                                    <div className={`flex-shrink-0 ${isMyMessage ? 'text-white/70' : 'text-gray-400 dark:text-gray-500'}`}>
                                                        <span className="material-symbols-outlined text-xl">download</span>
                                                    </div>
                                                </a>
                                            );
                                        })()}
                                        {att.type === 'link' && (
                                            <a
                                                href={att.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex items-center gap-2 text-sm font-medium ${isMyMessage ? 'text-white/90 hover:text-white' : 'text-primary hover:text-primary/80'
                                                    } transition-colors`}
                                            >
                                                <span className="material-symbols-outlined text-lg">link</span>
                                                {att.title || att.url}
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Reacciones */}
                    {msg.reactions && msg.reactions.length > 0 && (
                        <div className={`flex gap-1.5 mt-1 flex-wrap ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                            {msg.reactions.map((reaction, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onReact && onReact(msg._id, reaction.emoji)}
                                    className="flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium hover:border-primary hover:shadow-sm transition-all"
                                    title={reaction.users?.map((u) => `${u.nombre} ${u.apellido}`).join(', ')}
                                >
                                    <span className="text-base">{reaction.emoji}</span>
                                    <span className="text-gray-700 dark:text-gray-300">{reaction.count || reaction.users?.length || 0}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Acciones (Reply, React, Delete, Star) */}
                    <div className={`opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-0.5 mt-1 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                        <button
                            onClick={() => onReply(msg)}
                            className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                            title="Responder"
                        >
                            <span className="material-symbols-outlined text-[18px]">reply</span>
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowEmojiPicker(showEmojiPicker === msg._id ? null : msg._id)}
                                className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                                title="Reaccionar"
                            >
                                <span className="material-symbols-outlined text-[18px]">add_reaction</span>
                            </button>
                            {showEmojiPicker === msg._id && (
                                <div className={`absolute z-10 bottom-full mb-2 bg-white dark:bg-gray-800 shadow-xl rounded-full px-3 py-2 border border-gray-100 dark:border-gray-700 flex gap-2 ${isMyMessage ? 'right-0' : 'left-0'}`}>
                                    {['👍', '❤️', '😂', '😮', '😢', '🙏'].map(emoji => (
                                        <button
                                            key={emoji}
                                            onClick={() => onReact(msg._id, emoji)}
                                            className="text-xl hover:scale-125 transition-transform"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => onToggleStar(msg._id)}
                            className={`p-1.5 rounded-full transition-all ${msg.starredBy?.includes(user._id) ? 'text-yellow-500' : 'text-gray-500 dark:text-gray-400 hover:text-yellow-500'}`}
                            title="Destacar"
                        >
                            <span className={`material-symbols-outlined text-[18px] ${msg.starredBy?.includes(user._id) ? 'fill-current' : ''}`}>star</span>
                        </button>

                        {((isMyMessage) || isAdmin || isOwner) && (
                            <button
                                onClick={() => onDelete(msg._id)}
                                className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                title="Eliminar"
                            >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupMessageBubble;
