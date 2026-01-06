import React from 'react';
import { Eye, Download, Trash2 } from 'lucide-react';
import { getFileIcon, getFileColor, formatSize, formatDate, getUserInitials, getUserName } from '../../utils/fileUtils.jsx';

const FileList = ({ files, onPreview, onDelete, canEdit }) => {
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm dark:shadow-none">
            <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Nombre
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                            Tamaño
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                            Subido por
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                            Fecha
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {files.map((archivo) => (
                        <tr
                            key={archivo._id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center ${getFileColor(archivo.tipo)}`}>
                                        {getFileIcon(archivo.tipo)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-medium truncate text-gray-900 dark:text-gray-100" title={archivo.originalName}>
                                            {archivo.originalName}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{archivo.tipo}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                                {formatSize(archivo.size)}
                            </td>
                            <td className="px-6 py-4 hidden lg:table-cell">
                                {archivo.uploadedBy && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-medium">
                                            {getUserInitials(getUserName(archivo.uploadedBy))}
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {getUserName(archivo.uploadedBy)}
                                        </span>
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                                {formatDate(archivo.uploadedAt)}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => onPreview(archivo)}
                                        className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        title="Vista previa"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <a
                                        href={archivo.url}
                                        download
                                        className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        title="Descargar"
                                    >
                                        <Download size={18} />
                                    </a>
                                    {canEdit && (
                                        <button
                                            onClick={() => onDelete(archivo._id)}
                                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
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
    );
};

export default FileList;
