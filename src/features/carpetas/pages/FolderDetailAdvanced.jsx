import { useState, useEffect, useRef } from 'react';
import { logger } from '../../../shared/utils/logger';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Filter } from 'lucide-react';
import folderService from '../../../api/folderService';
import { useAuth } from '../../../context/AuthContext';
import { AlertDialog } from '../../../shared/components/AlertDialog';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';

// Importación de componentes refactorizados
import FolderHeader from '../components/FolderDetail/FolderHeader';
import FolderToolbar from '../components/FolderDetail/FolderToolbar';
import FileGrid from '../components/FolderDetail/FileGrid';
import FileList from '../components/FolderDetail/FileList';
import FilePreviewModal from '../components/FolderDetail/FilePreviewModal';

const FolderDetailAdvanced = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [carpeta, setCarpeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  // View & Filter States
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [filterType, setFilterType] = useState('all'); // 'all' | 'documents' | 'images' | 'videos'
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, variant: 'info', message: '' });
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null, variant: 'warning' });

  const fileInputRef = useRef(null);

  useEffect(() => {
    cargarCarpeta();
  }, [id]);

  const cargarCarpeta = async () => {
    try {
      setLoading(true);
      const response = await folderService.getFolderById(id);
      if (response && response.data) {
        setCarpeta(response.data);
      }
    } catch (err) {
      logger.error('Error al cargar carpeta:', err);
      setError('No se pudo cargar la carpeta o no tienes permisos.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setAlertConfig({ isOpen: true, variant: 'warning', message: 'El archivo es demasiado grande (Máx 50MB)' });
      return;
    }

    try {
      setUploading(true);
      await folderService.uploadFile(id, file);
      await cargarCarpeta();
    } catch (err) {
      logger.error('Error al subir archivo:', err);
      setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al subir el archivo' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileDelete = async (fileId) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Eliminar Archivo',
      message: '¿Estás seguro de eliminar este archivo?',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await folderService.deleteFile(id, fileId);
          setCarpeta(prev => ({
            ...prev,
            archivos: prev.archivos.filter(f => f._id !== fileId)
          }));
          setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        } catch (err) {
          logger.error('Error al eliminar archivo:', err);
          setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al eliminar el archivo' });
          setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const tienePermisoEscritura = () => {
    if (!carpeta || !user) return false;
    if (carpeta.propietario._id === user._id) return true;
    const compartido = carpeta.compartidaCon.find(c => c.usuario._id === user._id);
    return compartido && ['escritura', 'admin'].includes(compartido.permisos);
  };

  const getFilteredFiles = () => {
    if (!carpeta) return [];

    let filtered = carpeta.archivos;

    if (filterType !== 'all') {
      filtered = filtered.filter(file => {
        if (filterType === 'documents') {
          return ['pdf', 'document', 'spreadsheet', 'presentation', 'text'].includes(file.tipo);
        }
        if (filterType === 'images') {
          return file.tipo === 'image';
        }
        if (filterType === 'videos') {
          return file.tipo === 'video';
        }
        return true;
      });
    }

    return filtered;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Cargando carpeta...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">⚠️</div>
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
          <button
            onClick={() => navigate('/Mis_carpetas')}
            className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!carpeta) return null;

  const filteredFiles = getFilteredFiles();
  const canEdit = tienePermisoEscritura();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <FolderHeader
          carpeta={carpeta}
          onUpload={handleFileUpload}
          uploading={uploading}
          tienePermisoEscritura={canEdit}
          fileInputRef={fileInputRef}
        />

        {/* Toolbar */}
        <FolderToolbar
          filterType={filterType}
          setFilterType={setFilterType}
          viewMode={viewMode}
          setViewMode={setViewMode}
          showFilterMenu={showFilterMenu}
          setShowFilterMenu={setShowFilterMenu}
        />

        {/* Files Display */}
        {filteredFiles.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-16 text-center shadow-sm">
            <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
              {filterType === 'all' ? (
                <Upload className="text-gray-400 dark:text-gray-500" size={40} />
              ) : (
                <Filter className="text-gray-400 dark:text-gray-500" size={40} />
              )}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              {filterType === 'all' ? 'Carpeta vacía' : 'No hay archivos de este tipo'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filterType === 'all'
                ? 'Sube archivos para comenzar a compartir'
                : 'Intenta con otro filtro'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <FileGrid
            files={filteredFiles}
            onPreview={setPreviewFile}
            onDelete={handleFileDelete}
            canEdit={canEdit}
          />
        ) : (
          <FileList
            files={filteredFiles}
            onPreview={setPreviewFile}
            onDelete={handleFileDelete}
            canEdit={canEdit}
          />
        )}
      </div>

      {/* Preview Modal */}
      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />

      {/* AlertDialog Component */}
      <AlertDialog
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        variant={alertConfig.variant}
        message={alertConfig.message}
      />

      {/* ConfirmDialog Component */}
      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        variant={confirmConfig.variant}
      />
    </div>
  );
};

export default FolderDetailAdvanced;
