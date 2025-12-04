import { useState, useEffect } from 'react';
import groupService from '../../../api/groupService';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';
import AudioPlayer from '../../../shared/components/AudioPlayer/AudioPlayer';

// URL base para archivos estáticos (sin /api)
const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  return apiUrl.replace('/api', '');
};

// Obtener URL completa para un attachment
const getAttachmentUrl = (url) => {
  if (!url) return '';
  // Si ya es una URL completa (blob, http, https), devolverla tal cual
  if (url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Si es una URL relativa, agregar el base URL
  return `${getBaseUrl()}${url}`;
};

// Obtener información del archivo según su extensión para mostrar preview estilo WhatsApp
const getFileInfo = (fileName) => {
  if (!fileName) return { icon: 'description', color: 'bg-gray-500', label: 'Archivo' };

  const ext = fileName.split('.').pop()?.toLowerCase();

  const fileTypes = {
    // PDFs
    pdf: { icon: 'picture_as_pdf', color: 'bg-red-600', label: 'PDF' },
    // Word
    doc: { icon: 'description', color: 'bg-blue-600', label: 'Word' },
    docx: { icon: 'description', color: 'bg-blue-600', label: 'Word' },
    // Excel
    xls: { icon: 'table_chart', color: 'bg-green-600', label: 'Excel' },
    xlsx: { icon: 'table_chart', color: 'bg-green-600', label: 'Excel' },
    // PowerPoint
    ppt: { icon: 'slideshow', color: 'bg-orange-600', label: 'PowerPoint' },
    pptx: { icon: 'slideshow', color: 'bg-orange-600', label: 'PowerPoint' },
    // Texto
    txt: { icon: 'article', color: 'bg-gray-600', label: 'Texto' },
    // Código
    js: { icon: 'code', color: 'bg-yellow-500', label: 'JavaScript' },
    py: { icon: 'code', color: 'bg-blue-500', label: 'Python' },
    html: { icon: 'code', color: 'bg-orange-500', label: 'HTML' },
    css: { icon: 'code', color: 'bg-purple-500', label: 'CSS' },
    json: { icon: 'data_object', color: 'bg-gray-700', label: 'JSON' },
    // Comprimidos
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

const GroupEvents = ({ groupData, onGoToMessage }) => {
  const [destacados, setDestacados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDestacados = async () => {
      try {
        setLoading(true);
        const response = await groupService.getDestacados(groupData._id);
        // Extraer data del response
        const data = response.data || response;
        setDestacados(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error loading destacados:', err);
        setDestacados([]);
      } finally {
        setLoading(false);
      }
    };

    if (groupData?._id) {
      loadDestacados();
    }
  }, [groupData?._id]);

  // Formatear fecha de forma más legible
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    if (days > 0) return `Hace ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return 'Ahora mismo';
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 scrollbar-thin">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mensajes Destacados</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {destacados.length} {destacados.length === 1 ? 'mensaje' : 'mensajes'} guardado{destacados.length !== 1 ? 's' : ''} para ti
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : destacados.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700">
              star_outline
            </span>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              No hay mensajes destacados aún
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {destacados.map((msg) => {
              const senderName = msg.author
                ? `${msg.author.nombres?.primero || ''} ${msg.author.apellidos?.primero || ''}`.trim()
                : 'Usuario';

              return (
                <div
                  key={msg._id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-colors cursor-pointer p-4"
                  onClick={() => onGoToMessage && onGoToMessage(msg._id)}
                >
                  {/* Header del mensaje */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 overflow-hidden flex-shrink-0">
                        <img
                          src={getUserAvatar(msg.author)}
                          alt={senderName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/avatars/default-avatar.png';
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{senderName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-yellow-400 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  </div>

                  {/* Reply To */}
                  {msg.replyTo && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 border-l-2 border-primary rounded-r p-2 mb-3 text-xs">
                      <p className="font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                        Respuesta a: {msg.replyTo.author ? `${msg.replyTo.author.nombres?.primero || ''} ${msg.replyTo.author.apellidos?.primero || ''}` : 'Usuario'}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 line-clamp-1">
                        {msg.replyTo.content || 'Archivo adjunto'}
                      </p>
                    </div>
                  )}

                  {/* Contenido del mensaje */}
                  {msg.content && (
                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>
                  )}

                  {/* Archivos adjuntos - Versión simplificada */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className={`${msg.content ? 'mt-3' : ''} space-y-2`}>
                      {msg.attachments.map((att, idx) => {
                        if (att.type === 'image') {
                          return (
                            <div key={idx} className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 max-w-sm">
                              <img
                                src={getAttachmentUrl(att.url)}
                                alt={att.name || 'Imagen'}
                                className="max-h-60 object-contain"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(getAttachmentUrl(att.url), '_blank');
                                }}
                              />
                            </div>
                          );
                        } else if (att.type === 'audio') {
                          return (
                            <div key={idx} className="max-w-md">
                              <AudioPlayer
                                audioUrl={getAttachmentUrl(att.url)}
                                isMyMessage={false}
                              />
                            </div>
                          );
                        } else {
                          // Archivos genéricos y links simplificados
                          const isLink = att.type === 'link';
                          const icon = isLink ? 'link' : getFileInfo(att.name).icon;
                          
                          return (
                            <a
                              key={idx}
                              href={isLink ? att.url : getAttachmentUrl(att.url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className={`w-8 h-8 rounded flex items-center justify-center ${isLink ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
                                <span className="material-symbols-outlined text-lg">{icon}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {isLink ? (att.preview?.title || att.url) : att.name}
                                </p>
                                {!isLink && att.size && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatFileSize(att.size)}
                                  </p>
                                )}
                              </div>
                            </a>
                          );
                        }
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupEvents;
