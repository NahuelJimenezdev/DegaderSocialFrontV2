import { useState, useEffect } from 'react';
import groupService from '../../../api/groupService';

const GroupLinks = ({ groupData }) => {
  const [enlaces, setEnlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEnlaces = async () => {
      try {
        setLoading(true);
        const response = await groupService.getEnlaces(groupData._id);
        // Extraer data del response
        const data = response.data || response;
        setEnlaces(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error loading enlaces:', err);
        setEnlaces([]);
      } finally {
        setLoading(false);
      }
    };

    if (groupData?._id) {
      loadEnlaces();
    }
  }, [groupData?._id]);

  // Formatear fecha
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

  // Obtener dominio de la URL
  const getDomain = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  // Obtener favicon de la URL
  const getFavicon = (url) => {
    try {
      const urlObj = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
    } catch {
      return null;
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 scrollbar-thin">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-3xl">
                link
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Enlaces Compartidos</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {enlaces.length} {enlaces.length === 1 ? 'enlace compartido' : 'enlaces compartidos'}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-4">Cargando enlaces...</p>
            </div>
          </div>
        ) : enlaces.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-16 text-center border border-gray-100 dark:border-gray-700">
            <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400" style={{ fontSize: '48px' }}>
                link_off
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No hay enlaces compartidos
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Los enlaces que se compartan en el chat aparecerán aquí automáticamente
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {enlaces.map((enlace, idx) => {
              const senderName = enlace.author
                ? `${enlace.author.nombres?.primero || ''} ${enlace.author.apellidos?.primero || ''}`.trim()
                : 'Usuario';

              const domain = getDomain(enlace.url);
              const favicon = getFavicon(enlace.url);

              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-colors"
                >
                  <a
                    href={enlace.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4"
                  >
                    <div className="flex items-start gap-3">
                      {/* Favicon */}
                      {favicon && (
                        <img
                          src={favicon}
                          alt="favicon"
                          className="w-5 h-5 mt-0.5 flex-shrink-0 rounded"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1 text-sm">
                          {enlace.title || enlace.url}
                        </h3>
                        {enlace.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                            {enlace.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {domain}
                          </span>
                          <span className="text-gray-300 dark:text-gray-600">•</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {senderName}
                          </span>
                          <span className="text-gray-300 dark:text-gray-600">•</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {formatDate(enlace.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* External link icon */}
                      <span className="material-symbols-outlined text-gray-400 text-lg flex-shrink-0">
                        open_in_new
                      </span>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupLinks;
