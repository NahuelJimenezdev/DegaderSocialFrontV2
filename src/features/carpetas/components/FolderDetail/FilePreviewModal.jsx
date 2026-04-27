import React from 'react';
import { createPortal } from 'react-dom';
import { Download, X, Music, File, HardDrive, Calendar, Loader2 } from 'lucide-react';
import { formatSize, formatDate } from '../../utils/fileUtils.jsx';
import ProgressiveImage from '../../../../shared/components/ProgressiveImage';

const FilePreviewModal = ({ file, onClose, onDownload, isDownloading }) => {
    if (!file) return null;

    const rawUrl = file.url || '';
    // Limpiamos posibles dobles barras en la URL (ej: dev//folders -> dev/folders) 
    // pero mantenemos la de http:// o https://
    const url = rawUrl.replace(/([^:]\/)\/+/g, "$1");
    
    const name = file.originalName || '';
    const tipo = file.tipo || '';

    // Lógica EXPLÍCITA de visor
    const isExcel = tipo === 'spreadsheet' || /\.(xls|xlsx)$/i.test(name);
    const isPPT = tipo === 'presentation' || /\.(ppt|pptx)$/i.test(name);
    const isPDF = tipo === 'pdf' || /\.pdf$/i.test(name);
    const isWord = tipo === 'document' || /\.(doc|docx)$/i.test(name);
    const isWordLegacy = tipo === 'document' || /\.(doc)$/i.test(name);
    const isText = tipo === 'text' || /\.txt$/i.test(name);

    let viewerUrl = null;
    if (isExcel || isPPT) {
        // Para Office pesado, priorizamos Microsoft (mejor renderizado)
        viewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`;
    } else if (isPDF || isWord || isWordLegacy || isText) {
        // Para lectura fija/móvil, priorizamos Google (mejor carga en mobile)
        viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    }

    const modalContent = (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-6xl h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6 px-4">
                    <div className="flex-1 min-w-0 mr-4">
                        <h3 className="text-xl font-semibold truncate mb-1 text-white">{file.originalName}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                                <HardDrive size={14} />
                                {formatSize(file.size)}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {formatDate(file.uploadedAt)}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onDownload(file)}
                            disabled={isDownloading}
                            className={`flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-medium text-white ${isDownloading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isDownloading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Descargando...
                                </>
                            ) : (
                                <>
                                    <Download size={18} />
                                    Descargar
                                </>
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="flex-1 bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-800">
                    {file.tipo === 'image' && (
                        <ProgressiveImage
                            src={file.url}
                            medium={file.medium}
                            large={file.large}
                            blurHash={file.blurHash}
                            alt={file.originalName}
                            className="max-w-full max-h-full object-contain"
                        />
                    )}
                    {file.tipo === 'video' && (
                        <video
                            src={file.url}
                            controls
                            className="max-w-full max-h-full"
                            autoPlay
                        />
                    )}
                    {file.tipo === 'audio' && (
                        <div className="w-full max-w-2xl p-8">
                            <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
                                <Music size={64} className="mx-auto mb-6 text-purple-500" />
                                <h4 className="text-lg font-medium mb-6 text-white">{file.originalName}</h4>
                                <audio src={file.url} controls className="w-full" />
                            </div>
                        </div>
                    )}
                    {viewerUrl && (
                        <iframe
                            src={viewerUrl}
                            className="w-full h-full border-0"
                            title="Document Preview"
                        />
                    )}
                    {!viewerUrl && !['image', 'video', 'audio'].includes(file.tipo) && (
                        <div className="text-center p-8">
                            <File size={80} className="mx-auto mb-6 text-gray-600" />
                            <h3 className="text-xl font-semibold mb-2 text-white">Vista previa no disponible</h3>
                            <p className="text-gray-400 mb-6">Este tipo de archivo no se puede previsualizar en el navegador.</p>
                            <button
                                onClick={() => onDownload(file)}
                                disabled={isDownloading}
                                className={`inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-medium text-white ${isDownloading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isDownloading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Descargando archivo...
                                    </>
                                ) : (
                                    <>
                                        <Download size={20} />
                                        Descargar archivo
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.getElementById('modal-root') || document.body);
};

export default FilePreviewModal;
