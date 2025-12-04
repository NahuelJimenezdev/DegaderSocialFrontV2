import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Upload, File, FileText, Image as ImageIcon, 
  Video, Music, MoreVertical, Trash2, Download, Eye,
  Share2, Shield, Users, Building, Globe, Grid3x3, List,
  Filter, X, Calendar, User, HardDrive, ChevronDown
} from 'lucide-react';
import folderService from '../../../api/folderService';
import { useAuth } from '../../../context/AuthContext';

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
      console.error('Error al cargar carpeta:', err);
      setError('No se pudo cargar la carpeta o no tienes permisos.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert('El archivo es demasiado grande (Máx 50MB)');
      return;
    }

    try {
      setUploading(true);
      await folderService.uploadFile(id, file);
      await cargarCarpeta();
    } catch (err) {
      console.error('Error al subir archivo:', err);
      alert('Error al subir el archivo');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileDelete = async (fileId) => {
    if (!window.confirm('¿Estás seguro de eliminar este archivo?')) return;

    try {
      await folderService.deleteFile(id, fileId);
      setCarpeta(prev => ({
        ...prev,
        archivos: prev.archivos.filter(f => f._id !== fileId)
      }));
    } catch (err) {
      console.error('Error al eliminar archivo:', err);
      alert('Error al eliminar el archivo');
    }
  };

  const getFileIcon = (type) => {
    const iconClass = "w-6 h-6";
    switch (type) {
      case 'image': return <ImageIcon className={`${iconClass} text-blue-500`} />;
      case 'video': return <Video className={`${iconClass} text-red-500`} />;
      case 'audio': return <Music className={`${iconClass} text-purple-500`} />;
      case 'pdf': return <FileText className={`${iconClass} text-red-600`} />;
      case 'document': return <FileText className={`${iconClass} text-blue-600`} />;
      case 'spreadsheet': return <FileText className={`${iconClass} text-green-600`} />;
      case 'presentation': return <FileText className={`${iconClass} text-orange-600`} />;
      default: return <File className={`${iconClass} text-gray-500`} />;
    }
  };

  const getFileColor = (type) => {
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

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  const getUserInitials = (nombre) => {
    if (!nombre) return 'U';
    const parts = nombre.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  };

  const getUserName = (uploadedBy) => {
    if (!uploadedBy) return 'Usuario';
    if (uploadedBy.nombres && uploadedBy.apellidos) {
      return `${uploadedBy.nombres.primero} ${uploadedBy.apellidos.primero}`;
    }
    return uploadedBy.nombre || 'Usuario';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando carpeta...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">⚠️</div>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={() => navigate('/Mis_carpetas')}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!carpeta) return null;

  const filteredFiles = getFilteredFiles();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/Mis_carpetas')}
            className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors group"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver a Mis Carpetas
          </button>

          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 md:p-8 shadow-2xl">
            {/* Top Row: Button on mobile/tablet */}
            <div className="flex lg:hidden justify-end mb-4">
              {tienePermisoEscritura() && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-white"
                  >
                    <Upload size={18} />
                    {uploading ? 'Subiendo...' : 'Subir Archivo'}
                  </button>
                </>
              )}
            </div>

            {/* Main Content Row */}
            <div className="flex items-start gap-5">
              {/* Icon - Always Left */}
              <div 
                className="flex-shrink-0 p-4 md:p-5 rounded-2xl border-2 bg-yellow-500/10"
                style={{ 
                  borderColor: '#EAB308'
                }}
              >
                <HardDrive style={{ color: '#EAB308' }} size={40} />
              </div>
              
              {/* Center Content: Text + Badges */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">{carpeta.nombre}</h1>
                    <p className="text-gray-400 text-sm mb-4">{carpeta.descripcion}</p>
                  </div>

                  {/* Button - Desktop Only (Top Right) */}
                  <div className="hidden lg:flex items-start">
                    {tienePermisoEscritura() && (
                      <>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-white whitespace-nowrap"
                        >
                          <Upload size={20} />
                          {uploading ? 'Subiendo...' : 'Subir Archivo'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                    carpeta.tipo === 'personal' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    carpeta.tipo === 'grupal' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                    'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                  }`}>
                    {carpeta.tipo === 'personal' && <Shield size={14} className="mr-1.5" />}
                    {carpeta.tipo === 'grupal' && <Users size={14} className="mr-1.5" />}
                    {carpeta.tipo === 'institucional' && <Building size={14} className="mr-1.5" />}
                    {carpeta.tipo.charAt(0).toUpperCase() + carpeta.tipo.slice(1)}
                  </span>
                  
                  {carpeta.visibilidadPorArea?.habilitado && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-700/80 text-gray-300 border border-gray-600">
                      <Building size={14} className="mr-1.5" />
                      {carpeta.visibilidadPorArea.areas[0]}
                    </span>
                  )}

                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-700/80 text-gray-300 border border-gray-600">
                    <File size={14} className="mr-1.5" />
                    {carpeta.archivos.length} archivo{carpeta.archivos.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          {/* Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600"
            >
              <Filter size={18} />
              <span className="text-sm font-medium">
                {filterType === 'all' && 'Todos los archivos'}
                {filterType === 'documents' && 'Documentos'}
                {filterType === 'images' && 'Imágenes'}
                {filterType === 'videos' && 'Videos'}
              </span>
              <ChevronDown size={16} className={`transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
            </button>

            {showFilterMenu && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 overflow-hidden">
                {[
                  { value: 'all', label: 'Todos los archivos', icon: File },
                  { value: 'documents', label: 'Documentos', icon: FileText },
                  { value: 'images', label: 'Imágenes', icon: ImageIcon },
                  { value: 'videos', label: 'Videos', icon: Video }
                ].map(filter => (
                  <button
                    key={filter.value}
                    onClick={() => {
                      setFilterType(filter.value);
                      setShowFilterMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-700 transition-colors ${
                      filterType === filter.value ? 'bg-gray-700 text-indigo-400' : 'text-gray-300'
                    }`}
                  >
                    <filter.icon size={16} />
                    <span className="text-sm">{filter.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-1 border border-gray-600">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Vista de cuadrícula"
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Vista de lista"
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Files Display */}
        {filteredFiles.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-16 text-center">
            <div className="mx-auto w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mb-6">
              {filterType === 'all' ? (
                <Upload className="text-gray-500" size={40} />
              ) : (
                <Filter className="text-gray-500" size={40} />
              )}
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {filterType === 'all' ? 'Carpeta vacía' : 'No hay archivos de este tipo'}
            </h3>
            <p className="text-gray-400">
              {filterType === 'all' 
                ? 'Sube archivos para comenzar a compartir' 
                : 'Intenta con otro filtro'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          // GRID VIEW
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFiles.map((archivo) => (
              <div
                key={archivo._id}
                className={`bg-gray-800 border rounded-xl overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all group ${getFileColor(archivo.tipo)}`}
              >
                {/* Preview Area */}
                <div className="aspect-video bg-gray-900/50 flex items-center justify-center p-6 relative overflow-hidden">
                  {archivo.tipo === 'image' ? (
                    <img 
                      src={archivo.url} 
                      alt={archivo.originalName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      {getFileIcon(archivo.tipo)}
                    </div>
                  )}
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPreviewFile(archivo)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
                      title="Vista previa"
                    >
                      <Eye size={20} />
                    </button>
                    <a
                      href={archivo.url}
                      download
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
                      title="Descargar"
                    >
                      <Download size={20} />
                    </a>
                    {tienePermisoEscritura() && (
                      <button
                        onClick={() => handleFileDelete(archivo._id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg backdrop-blur-sm transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>

                {/* File Info */}
                <div className="p-4">
                  <h3 className="font-medium text-sm mb-2 truncate" title={archivo.originalName}>
                    {archivo.originalName}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <HardDrive size={12} />
                      {formatSize(archivo.size)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(archivo.uploadedAt)}
                    </span>
                  </div>

                  {/* Uploader Info */}
                  {archivo.uploadedBy && (
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-700">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-medium">
                        {getUserInitials(getUserName(archivo.uploadedBy))}
                      </div>
                      <span className="text-xs text-gray-400 truncate">
                        {getUserName(archivo.uploadedBy)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // LIST VIEW
          <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-900/50 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Tamaño
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                    Subido por
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredFiles.map((archivo) => (
                  <tr 
                    key={archivo._id} 
                    className="hover:bg-gray-700/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center ${getFileColor(archivo.tipo)}`}>
                          {getFileIcon(archivo.tipo)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium truncate" title={archivo.originalName}>
                            {archivo.originalName}
                          </div>
                          <div className="text-xs text-gray-400 capitalize">{archivo.tipo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 hidden md:table-cell">
                      {formatSize(archivo.size)}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      {archivo.uploadedBy && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-medium">
                            {getUserInitials(getUserName(archivo.uploadedBy))}
                          </div>
                          <span className="text-sm text-gray-400">
                            {getUserName(archivo.uploadedBy)}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 hidden sm:table-cell">
                      {formatDate(archivo.uploadedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setPreviewFile(archivo)}
                          className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-gray-700 rounded-lg transition-colors"
                          title="Vista previa"
                        >
                          <Eye size={18} />
                        </button>
                        <a
                          href={archivo.url}
                          download
                          className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-lg transition-colors"
                          title="Descargar"
                        >
                          <Download size={18} />
                        </a>
                        {tienePermisoEscritura() && (
                          <button 
                            onClick={() => handleFileDelete(archivo._id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
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

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-6xl h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 px-4">
              <div className="flex-1 min-w-0 mr-4">
                <h3 className="text-xl font-semibold truncate mb-1">{previewFile.originalName}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <HardDrive size={14} />
                    {formatSize(previewFile.size)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(previewFile.uploadedAt)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href={previewFile.url} 
                  download 
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-medium"
                >
                  <Download size={18} />
                  Descargar
                </a>
                <button 
                  onClick={() => setPreviewFile(null)} 
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-800">
              {previewFile.tipo === 'image' && (
                <img 
                  src={previewFile.url} 
                  alt={previewFile.originalName} 
                  className="max-w-full max-h-full object-contain"
                />
              )}
              {previewFile.tipo === 'video' && (
                <video 
                  src={previewFile.url} 
                  controls 
                  className="max-w-full max-h-full"
                  autoPlay
                />
              )}
              {previewFile.tipo === 'audio' && (
                <div className="w-full max-w-2xl p-8">
                  <div className="bg-gray-800 rounded-xl p-8 text-center">
                    <Music size={64} className="mx-auto mb-6 text-purple-500" />
                    <h4 className="text-lg font-medium mb-6">{previewFile.originalName}</h4>
                    <audio src={previewFile.url} controls className="w-full" />
                  </div>
                </div>
              )}
              {previewFile.tipo === 'pdf' && (
                <iframe 
                  src={previewFile.url} 
                  className="w-full h-full" 
                  title="PDF Preview"
                />
              )}
              {!['image', 'video', 'audio', 'pdf'].includes(previewFile.tipo) && (
                <div className="text-center p-8">
                  <File size={80} className="mx-auto mb-6 text-gray-600" />
                  <h3 className="text-xl font-semibold mb-2">Vista previa no disponible</h3>
                  <p className="text-gray-400 mb-6">Este tipo de archivo no se puede previsualizar en el navegador.</p>
                  <a
                    href={previewFile.url}
                    download
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-medium"
                  >
                    <Download size={20} />
                    Descargar archivo
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderDetailAdvanced;
