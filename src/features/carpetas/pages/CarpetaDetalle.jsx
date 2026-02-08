import { useState, useEffect, useRef } from 'react';
import { logger } from '../../../shared/utils/logger';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Upload, File, FileText, Image as ImageIcon,
  Video, Music, MoreVertical, Trash2, Download, Eye,
  Share2, Shield, Users, Building, Globe
} from 'lucide-react';
import folderService from '../../../api/folderService';
import { useAuth } from '../../../hooks/useAuth';
import { AlertDialog } from '../../../shared/components/AlertDialog';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';

const CarpetaDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [carpeta, setCarpeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
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

    // Validar tamaño (50MB)
    if (file.size > 50 * 1024 * 1024) {
      setAlertConfig({ isOpen: true, variant: 'warning', message: 'El archivo es demasiado grande (Máx 50MB)' });
      return;
    }

    try {
      setUploading(true);
      await folderService.uploadFile(id, file);
      await cargarCarpeta(); // Recargar para ver el nuevo archivo
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

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <ImageIcon className="text-blue-500" />;
      case 'video': return <Video className="text-red-500" />;
      case 'audio': return <Music className="text-purple-500" />;
      case 'pdf': return <FileText className="text-red-600" />;
      case 'document': return <FileText className="text-blue-600" />;
      case 'spreadsheet': return <FileText className="text-green-600" />;
      case 'presentation': return <FileText className="text-orange-600" />;
      default: return <File className="text-gray-500" />;
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const tienePermisoEscritura = () => {
    if (!carpeta || !user) return false;
    // Propietario
    if (carpeta.propietario._id === user._id) return true;
    // Compartido con permiso
    const compartido = carpeta.compartidaCon.find(c => c.usuario._id === user._id);
    return compartido && ['escritura', 'admin'].includes(compartido.permisos);
  };

  if (loading) return <div className="p-8 text-center">Cargando carpeta...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!carpeta) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs & Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/carpetas')}
            className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4 transition-colors"
          >
            <ArrowLeft size={20} className="mr-1" />
            Volver a Mis Carpetas
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: carpeta.color + '20' }}>
                <Folder style={{ color: carpeta.color }} size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{carpeta.nombre}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{carpeta.descripcion}</p>

                {/* Visibility Badges */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${carpeta.tipo === 'personal' ? 'bg-blue-100 text-blue-800' :
                    carpeta.tipo === 'grupal' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                    {carpeta.tipo === 'personal' && <Shield size={12} className="mr-1" />}
                    {carpeta.tipo === 'grupal' && <Users size={12} className="mr-1" />}
                    {carpeta.tipo === 'institucional' && <Building size={12} className="mr-1" />}
                    {carpeta.tipo.charAt(0).toUpperCase() + carpeta.tipo.slice(1)}
                  </span>

                  {carpeta.visibilidadPorArea?.habilitado && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      <Building size={12} className="mr-1" />
                      {carpeta.visibilidadPorArea.areas.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {tienePermisoEscritura() && (
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-50"
                >
                  <Upload size={20} />
                  {uploading ? 'Subiendo...' : 'Subir Archivo'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* File List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {carpeta.archivos.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Upload className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Carpeta vacía</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Sube archivos para comenzar a compartir</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamaño</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {carpeta.archivos.map((archivo) => (
                    <tr key={archivo._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                            {getFileIcon(archivo.tipo)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs" title={archivo.originalName}>
                              {archivo.originalName}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{archivo.tipo}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatSize(archivo.size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(archivo.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setPreviewFile(archivo)}
                            className="p-1 text-gray-400 hover:colorMarcaDegader transition-colors"
                            title="Ver/Descargar"
                          >
                            <Eye size={18} />
                          </button>
                          {tienePermisoEscritura() && (
                            <button
                              onClick={() => handleFileDelete(archivo._id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl h-[80vh] flex flex-col">
            <div className="flex justify-between items-center text-white mb-4">
              <h3 className="text-lg font-medium truncate">{previewFile.originalName}</h3>
              <div className="flex items-center gap-4">
                <a
                  href={previewFile.url}
                  download
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Download size={18} /> Descargar
                </a>
                <button onClick={() => setPreviewFile(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-black rounded-xl overflow-hidden flex items-center justify-center border border-gray-800">
              {previewFile.tipo === 'image' && (
                <img src={previewFile.url} alt={previewFile.originalName} className="max-w-full max-h-full object-contain" />
              )}
              {previewFile.tipo === 'video' && (
                <video src={previewFile.url} controls className="max-w-full max-h-full" />
              )}
              {previewFile.tipo === 'audio' && (
                <audio src={previewFile.url} controls className="w-full max-w-md" />
              )}
              {previewFile.tipo === 'pdf' && (
                <iframe src={previewFile.url} className="w-full h-full" title="PDF Preview" />
              )}
              {!['image', 'video', 'audio', 'pdf'].includes(previewFile.tipo) && (
                <div className="text-center text-gray-400">
                  <File size={64} className="mx-auto mb-4 opacity-50" />
                  <p>Vista previa no disponible para este tipo de archivo.</p>
                  <p className="text-sm mt-2">Por favor descarga el archivo para verlo.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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

export default CarpetaDetalle;



