import React from 'react';
import { Download, X, Music, File, HardDrive, Calendar } from 'lucide-react';
import { formatSize, formatDate } from '../../utils/fileUtils.jsx';

const FilePreviewModal = ({ file, onClose }) => {
    if (!file) return null;

    return (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
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
                        <a
                            href={file.url}
                            download
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-medium text-white"
                        >
                            <Download size={18} />
                            Descargar
                        </a>
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
                        <img
                            src={file.url}
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
                    {file.tipo === 'pdf' && (
                        <iframe
                            src={file.url}
                            className="w-full h-full"
                            title="PDF Preview"
                        />
                    )}
                    {!['image', 'video', 'audio', 'pdf'].includes(file.tipo) && (
                        <div className="text-center p-8">
                            <File size={80} className="mx-auto mb-6 text-gray-600" />
                            <h3 className="text-xl font-semibold mb-2 text-white">Vista previa no disponible</h3>
                            <p className="text-gray-400 mb-6">Este tipo de archivo no se puede previsualizar en el navegador.</p>
                            <a
                                href={file.url}
                                download
                                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-medium text-white"
                            >
                                <Download size={20} />
                                Descargar archivo
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilePreviewModal;
