import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import groupService from '../../../api/groupService';

// URL base para archivos estáticos (sin /api)
const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  return apiUrl.replace('/api', '');
};

const GroupMultimedia = ({ groupData }) => {
  const [multimedia, setMultimedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const loadMultimedia = async () => {
      try {
        setLoading(true);
        const data = await groupService.getMultimedia(groupData._id);
        setMultimedia(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error loading multimedia:', err);
        setMultimedia([]);
      } finally {
        setLoading(false);
      }
    };

    if (groupData?._id) {
      loadMultimedia();
    }
  }, [groupData?._id]);

  // Extraer todas las imágenes de los mensajes
  const images = multimedia.flatMap((msg) =>
    (msg.attachments || [])
      .filter((att) => att.type === 'image')
      .map((att) => ({
        ...att,
        message: msg,
        sender: msg.sender,
        createdAt: msg.createdAt,
      }))
  );

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden p-6 bg-gray-50 dark:bg-gray-900 scrollbar-thin">
      <div className="max-w-6xl mx-auto space-y-6 overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Multimedia</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {images.length} {images.length === 1 ? 'imagen' : 'imágenes'} compartidas
        </p>
      </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : images.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700">
            image
          </span>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            No se han compartido imágenes en este grupo aún
            </p>
          </div>
        ) : (
          <>
            {/* Grid de imágenes - 3 por fila en todos los dispositivos */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
            {images.map((img, idx) => {
              const senderName = img.sender
                ? `${img.sender.nombres?.primero || ''} ${img.sender.apellidos?.primero || ''}`.trim()
                : 'Usuario';

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group relative"
                >
                  <img
                    src={`${getBaseUrl()}${img.url}`}
                    alt={img.name || 'Imagen'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Overlay con info */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <p className="text-white text-xs font-medium truncate">{senderName}</p>
                    <p className="text-white/75 text-xs">
                      {new Date(img.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                );
              })}
            </div>

            {/* Modal lightbox - usando Portal para renderizar fuera del contenedor con overflow-hidden */}
            {selectedImage && createPortal(
              <div
                className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
                onClick={() => setSelectedImage(null)}
              >
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                >
                  <span className="material-symbols-outlined text-4xl">close</span>
                </button>

                <div className="max-w-6xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
                  <img
                    src={`${getBaseUrl()}${selectedImage.url}`}
                    alt={selectedImage.name || 'Imagen'}
                    className="max-w-full max-h-[85vh] object-contain mx-auto rounded-lg"
                  />

                  {/* Info del mensaje */}
                  <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 overflow-hidden flex-shrink-0">
                        {selectedImage.sender?.avatar || selectedImage.sender?.perfil?.perfilUsuario ? (
                          <img
                            src={`${getBaseUrl()}${selectedImage.sender.avatar || selectedImage.sender.perfil.perfilUsuario}`}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-xl">person</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedImage.sender
                            ? `${selectedImage.sender.nombres?.primero || ''} ${selectedImage.sender.apellidos?.primero || ''}`.trim()
                            : 'Usuario'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(selectedImage.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {selectedImage.message?.content && (
                      <p className="mt-3 text-gray-700 dark:text-gray-300">
                        {selectedImage.message.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>,
              document.body
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GroupMultimedia;
