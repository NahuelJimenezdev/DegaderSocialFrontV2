import { useState, useEffect } from 'react';
import groupService from '../../../api/groupService';

const GroupFiles = ({ groupData }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        setLoading(true);
        const data = await groupService.getArchivos(groupData._id);
        setFiles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error loading files:', err);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    if (groupData?._id) {
      loadFiles();
    }
  }, [groupData?._id]);

  // Extraer archivos de los mensajes
  const allFiles = files.flatMap((msg) =>
    (msg.attachments || [])
      .filter((att) => ['file', 'video', 'audio'].includes(att.type))
      .map((att) => ({
        ...att,
        message: msg,
        sender: msg.sender,
        createdAt: msg.createdAt,
      }))
  );

  // Obtener icono según tipo de archivo
  const getFileIcon = (type, name) => {
    if (type === 'video') return 'videocam';
    if (type === 'audio') return 'audiotrack';

    // Detectar por extensión
    const ext = name?.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext)) return 'picture_as_pdf';
    if (['doc', 'docx'].includes(ext)) return 'description';
    if (['xls', 'xlsx'].includes(ext)) return 'table_chart';
    if (['ppt', 'pptx'].includes(ext)) return 'slideshow';
    if (['zip', 'rar', '7z'].includes(ext)) return 'folder_zip';

    return 'insert_drive_file';
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 scrollbar-thin">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Archivos</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {allFiles.length} {allFiles.length === 1 ? 'archivo' : 'archivos'} compartidos
        </p>
      </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : allFiles.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700">
            folder_open
          </span>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            No se han compartido archivos en este grupo aún
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
          {allFiles.map((file, idx) => {
            const senderName = file.sender
              ? `${file.sender.primernombreUsuario || ''} ${file.sender.primerapellidoUsuario || ''}`.trim()
              : 'Usuario';

            return (
              <div key={idx} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-4">
                  {/* Icono del archivo */}
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-2xl text-primary">
                      {getFileIcon(file.type, file.name)}
                    </span>
                  </div>

                  {/* Info del archivo */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {file.name || 'Archivo sin nombre'}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <span>{senderName}</span>
                      <span>•</span>
                      <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Preview para videos y audios */}
                  {file.type === 'video' && (
                    <div className="hidden sm:block flex-shrink-0">
                      <video
                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${file.url}`}
                        className="w-32 h-20 rounded-lg object-cover"
                        muted
                      />
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {file.type === 'video' && (
                      <a
                        href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${file.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Ver"
                      >
                        <span className="material-symbols-outlined">play_circle</span>
                      </a>
                    )}
                    {file.type === 'audio' && (
                      <audio
                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${file.url}`}
                        controls
                        className="h-10"
                      />
                    )}
                    <a
                      href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${file.url}`}
                      download
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Descargar"
                    >
                      <span className="material-symbols-outlined">download</span>
                    </a>
                  </div>
                </div>

                {/* Contenido del mensaje */}
                {file.message?.content && (
                  <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 pl-16">
                    {file.message.content}
                  </p>
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

export default GroupFiles;
