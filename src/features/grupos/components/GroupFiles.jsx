import { useState, useEffect, useRef } from 'react';
import groupService from '../../../api/groupService';
import '../styles/GroupFiles.css';

// URL base para archivos estáticos (sin /api)
const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  return apiUrl.replace('/api', '');
};

// Categorías de filtro
const FILTER_TABS = [
  { id: 'all', label: 'Todos', icon: 'folder' },
  { id: 'documents', label: 'Documentos', icon: 'description' },
  { id: 'audio', label: 'Audio', icon: 'audiotrack' },
  { id: 'video', label: 'Video', icon: 'videocam' },
];

// Extensiones de documentos
const DOCUMENT_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'txt', 'rtf', 'json'];

const GroupFiles = ({ groupData }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [playingAudio, setPlayingAudio] = useState(null); // ID del audio reproduciéndose
  const audioRef = useRef(null);

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

  // Obtener icono y color según tipo de archivo
  const getFileInfo = (type, name) => {
    if (type === 'video') return { icon: 'videocam', color: 'bg-purple-600' };
    if (type === 'audio') return { icon: 'audiotrack', color: 'bg-pink-600' };

    const ext = name?.split('.').pop()?.toLowerCase();

    const fileTypes = {
      // PDFs
      pdf: { icon: 'picture_as_pdf', color: 'bg-red-600' },
      // Word
      doc: { icon: 'description', color: 'bg-blue-600' },
      docx: { icon: 'description', color: 'bg-blue-600' },
      // Excel
      xls: { icon: 'table_chart', color: 'bg-green-600' },
      xlsx: { icon: 'table_chart', color: 'bg-green-600' },
      csv: { icon: 'table_chart', color: 'bg-green-600' },
      // PowerPoint
      ppt: { icon: 'slideshow', color: 'bg-orange-600' },
      pptx: { icon: 'slideshow', color: 'bg-orange-600' },
      // Texto
      txt: { icon: 'article', color: 'bg-gray-600' },
      rtf: { icon: 'article', color: 'bg-gray-600' },
      // Código
      js: { icon: 'code', color: 'bg-yellow-600' },
      ts: { icon: 'code', color: 'bg-blue-500' },
      html: { icon: 'code', color: 'bg-orange-500' },
      css: { icon: 'code', color: 'bg-purple-500' },
      json: { icon: 'data_object', color: 'bg-gray-700' },
      // Comprimidos
      zip: { icon: 'folder_zip', color: 'bg-yellow-700' },
      rar: { icon: 'folder_zip', color: 'bg-purple-700' },
      '7z': { icon: 'folder_zip', color: 'bg-gray-700' },
    };

    return fileTypes[ext] || { icon: 'insert_drive_file', color: 'bg-gray-500' };
  };

  // Filtrar archivos según la pestaña activa
  const getFilteredFiles = () => {
    if (activeFilter === 'all') return allFiles;

    return allFiles.filter((file) => {
      if (activeFilter === 'video') return file.type === 'video';
      if (activeFilter === 'audio') return file.type === 'audio';
      if (activeFilter === 'documents') {
        const ext = file.name?.split('.').pop()?.toLowerCase();
        return DOCUMENT_EXTENSIONS.includes(ext);
      }
      return true;
    });
  };

  const filteredFiles = getFilteredFiles();

  // Contar archivos por categoría
  const getCounts = () => ({
    all: allFiles.length,
    documents: allFiles.filter((f) => DOCUMENT_EXTENSIONS.includes(f.name?.split('.').pop()?.toLowerCase())).length,
    audio: allFiles.filter((f) => f.type === 'audio').length,
    video: allFiles.filter((f) => f.type === 'video').length,
  });

  const counts = getCounts();

  // Controlar reproducción de audio
  const handleAudioPlay = (audioId, audioUrl) => {
    if (playingAudio === audioId) {
      // Pausar si ya está reproduciéndose
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingAudio(null);
    } else {
      // Reproducir nuevo audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(`${getBaseUrl()}${audioUrl}`);
      audio.onended = () => setPlayingAudio(null);
      audio.play();
      audioRef.current = audio;
      setPlayingAudio(audioId);
    }
  };

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 scrollbar-thin">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Archivos</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            {allFiles.length} {allFiles.length === 1 ? 'archivo' : 'archivos'} compartidos
          </p>
        </div>

        {/* Tabs de filtro */}
        <div className="files-tabs-container">
          <div className="files-tabs">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`files-tab ${activeFilter === tab.id ? 'files-tab-active' : ''}`}
              >
                <span className="material-symbols-outlined files-tab-icon">{tab.icon}</span>
                <span className="files-tab-label">{tab.label}</span>
                {counts[tab.id] > 0 && (
                  <span className={`files-tab-count ${activeFilter === tab.id ? 'files-tab-count-active' : ''}`}>
                    {counts[tab.id]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 sm:p-12 text-center">
            <span className="material-symbols-outlined text-5xl sm:text-6xl text-gray-300 dark:text-gray-700">
              {activeFilter === 'all' ? 'folder_open' : FILTER_TABS.find((t) => t.id === activeFilter)?.icon || 'folder_open'}
            </span>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-4">
              {activeFilter === 'all'
                ? 'No se han compartido archivos en este grupo aún'
                : `No hay ${FILTER_TABS.find((t) => t.id === activeFilter)?.label.toLowerCase() || 'archivos'} en este grupo`}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
            {filteredFiles.map((file, idx) => {
            const senderName = file.sender
              ? `${file.sender.nombre || file.sender.primernombreUsuario || ''} ${file.sender.apellido || file.sender.primerapellidoUsuario || ''}`.trim()
              : 'Usuario';

            return (
              <div key={idx} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-4">
                  {/* Icono del archivo */}
                  {(() => {
                    const fileInfo = getFileInfo(file.type, file.name);
                    return (
                      <div className={`w-12 h-12 rounded-lg ${fileInfo.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <span className="material-symbols-outlined text-2xl text-white">
                          {fileInfo.icon}
                        </span>
                      </div>
                    );
                  })()}

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
                        src={`${getBaseUrl()}${file.url}`}
                        className="w-32 h-20 rounded-lg object-cover"
                        muted
                      />
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {file.type === 'video' && (
                      <a
                        href={`${getBaseUrl()}${file.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Ver"
                      >
                        <span className="material-symbols-outlined">play_circle</span>
                      </a>
                    )}
                    {file.type === 'audio' && (
                      <button
                        onClick={() => handleAudioPlay(`audio-${idx}`, file.url)}
                        className={`audio-player-btn ${playingAudio === `audio-${idx}` ? 'audio-player-btn-playing' : ''}`}
                        title={playingAudio === `audio-${idx}` ? 'Pausar' : 'Reproducir'}
                      >
                        <span className="material-symbols-outlined">
                          {playingAudio === `audio-${idx}` ? 'pause' : 'play_arrow'}
                        </span>
                      </button>
                    )}
                    <a
                      href={`${getBaseUrl()}${file.url}`}
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
