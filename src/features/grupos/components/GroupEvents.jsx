import { useState, useEffect } from 'react';
import groupService from '../../../api/groupService';

const GroupEvents = ({ groupData }) => {
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
              <span className="material-symbols-outlined text-yellow-500 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mensajes Destacados</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {destacados.length} {destacados.length === 1 ? 'mensaje' : 'mensajes'} guardado{destacados.length !== 1 ? 's' : ''} para ti
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-4">Cargando mensajes destacados...</p>
            </div>
          </div>
        ) : destacados.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-16 text-center border border-gray-100 dark:border-gray-700">
            <div className="w-24 h-24 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-yellow-400 dark:text-yellow-500" style={{ fontSize: '48px' }}>
                star_outline
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No hay mensajes destacados
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Destaca mensajes importantes desde el chat para encontrarlos fácilmente aquí
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {destacados.map((msg) => {
              const senderName = msg.author
                ? `${msg.author.nombre || ''} ${msg.author.apellido || ''}`.trim()
                : 'Usuario';

              return (
                <div
                  key={msg._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border-l-4 border-yellow-400 hover:shadow-md transition-shadow"
                >
                  <div className="p-5">
                    {/* Header del mensaje */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 overflow-hidden flex-shrink-0 ring-2 ring-white dark:ring-gray-800">
                          {msg.author?.avatar ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${msg.author.avatar}`}
                              alt={senderName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="material-symbols-outlined text-white text-xl">person</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white">{senderName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                      <span
                        className="material-symbols-outlined text-yellow-500 flex-shrink-0"
                        style={{ fontVariationSettings: "'FILL' 1", fontSize: '24px' }}
                      >
                        star
                      </span>
                    </div>

                    {/* Reply To */}
                    {msg.replyTo && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 border-l-2 border-primary rounded-r-lg p-3 mb-3">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Respuesta a: {msg.replyTo.author ? `${msg.replyTo.author.nombre} ${msg.replyTo.author.apellido}` : 'Usuario'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {msg.replyTo.content || 'Archivo adjunto'}
                        </p>
                      </div>
                    )}

                    {/* Contenido del mensaje */}
                    {msg.content && (
                      <p className="text-[15px] text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    )}

                    {/* Archivos adjuntos */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className={`${msg.content ? 'mt-4' : ''} space-y-3`}>
                        {msg.attachments.map((att, idx) => {
                          if (att.type === 'image') {
                            return (
                              <div key={idx} className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                                <img
                                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${att.url}`}
                                  alt={att.name || 'Imagen'}
                                  className="max-w-full h-auto max-h-96 object-contain cursor-pointer hover:opacity-95 transition-opacity"
                                  onClick={() => window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${att.url}`, '_blank')}
                                />
                              </div>
                            );
                          } else if (att.type === 'video') {
                            return (
                              <div key={idx} className="rounded-xl overflow-hidden">
                                <video
                                  controls
                                  className="max-w-full h-auto max-h-96 rounded-xl"
                                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${att.url}`}
                                >
                                  Tu navegador no soporta video
                                </video>
                              </div>
                            );
                          } else if (att.type === 'link') {
                            return (
                              <a
                                key={idx}
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-3 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
                              >
                                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">link</span>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-blue-600 dark:text-blue-400 truncate group-hover:underline">
                                    {att.preview?.title || att.url}
                                  </p>
                                  {att.preview?.description && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mt-0.5">
                                      {att.preview.description}
                                    </p>
                                  )}
                                </div>
                                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-lg">
                                  open_in_new
                                </span>
                              </a>
                            );
                          } else {
                            // Archivo genérico
                            return (
                              <a
                                key={idx}
                                href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${att.url}`}
                                download={att.name}
                                className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                              >
                                <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-xl">
                                  insert_drive_file
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 dark:text-white truncate">
                                    {att.name}
                                  </p>
                                  {att.size && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {(att.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  )}
                                </div>
                                <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-lg">
                                  download
                                </span>
                              </a>
                            );
                          }
                        })}
                      </div>
                    )}

                    {/* Reacciones */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        {Object.entries(
                          msg.reactions.reduce((acc, r) => {
                            acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                            return acc;
                          }, {})
                        ).map(([emoji, count]) => (
                          <div
                            key={emoji}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                          >
                            <span className="text-base">{emoji}</span>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
