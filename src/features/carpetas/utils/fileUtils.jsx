import React from 'react';
import {
    File, FileText, Image as ImageIcon, Video, Music
} from 'lucide-react';

/**
 * Retorna el icono correspondiente al tipo de archivo
 */
export const getFileIcon = (type, className = "w-6 h-6") => {
    switch (type) {
        case 'image': return <ImageIcon className={`${className} text-blue-500`} />;
        case 'video': return <Video className={`${className} text-red-500`} />;
        case 'audio': return <Music className={`${className} text-purple-500`} />;
        case 'pdf': return <FileText className={`${className} text-red-600`} />;
        case 'document': return <FileText className={`${className} text-blue-600`} />;
        case 'spreadsheet': return <FileText className={`${className} text-green-600`} />;
        case 'presentation': return <FileText className={`${className} text-orange-600`} />;
        default: return <File className={`${className} text-gray-500`} />;
    }
};

/**
 * Retorna las clases de color de fondo y borde según el tipo de archivo
 */
export const getFileColor = (type) => {
    switch (type) {
        case 'image': return 'bg-blue-500/10 border-blue-500/20';
        case 'video': return 'bg-red-500/10 border-red-500/20';
        case 'audio': return 'bg-purple-500/10 border-purple-500/20';
        case 'pdf': return 'bg-red-600/10 border-red-600/20';
        case 'document': return 'bg-blue-600/10 border-blue-600/20';
        case 'spreadsheet': return 'bg-green-600/10 border-green-600/20';
        case 'presentation': return 'bg-orange-600/10 border-orange-600/20';
        default: return 'bg-gray-500/10 border-gray-500/20';
    }
};

/**
 * Formatea bytes a tamaño legible (KB, MB, GB)
 */
export const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Formatea fecha ISO a formato local legible
 */
export const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

/**
 * Obtiene iniciales del nombre de usuario
 */
export const getUserInitials = (nombre) => {
    if (!nombre) return 'U';
    const parts = nombre.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
};

/**
 * Obtiene nombre de usuario seguro desde objeto uploadedBy
 */
export const getUserName = (uploadedBy) => {
    if (!uploadedBy) return 'Usuario';
    if (uploadedBy.nombres && uploadedBy.apellidos) {
        return `${uploadedBy.nombres.primero} ${uploadedBy.apellidos.primero}`;
    }
    return uploadedBy.nombre || 'Usuario';
};
