import React from 'react';
import { Eye, Download, Trash2, HardDrive, Calendar } from 'lucide-react';
import { getFileIcon, getFileColor, formatSize, formatDate, getUserInitials, getUserName } from '../../utils/fileUtils.jsx';

const FileGrid = ({ files, onPreview, onDelete, canEdit }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {files.map((archivo) => (
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
                                onClick={() => onPreview(archivo)}
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
                            {canEdit && (
                                <button
                                    onClick={() => onDelete(archivo._id)}
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
    );
};

export default FileGrid;
