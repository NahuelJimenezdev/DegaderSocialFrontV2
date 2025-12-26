import React from 'react';
import { X } from 'lucide-react';

/**
 * FilePreview - Preview de archivos (imágenes y videos) con opción de eliminar
 * @param {Array} previews - Array de previews {url, type}
 * @param {Function} onRemove - Callback al eliminar un archivo
 */
const FilePreview = ({ previews, onRemove }) => {
    if (previews.length === 0) return null;

    return (
        <div className={`mt-3 gap-2 ${previews.length === 1 ? 'grid grid-cols-1' : 'grid grid-cols-2'}`}>
            {previews.slice(0, 4).map((preview, index) => (
                <div
                    key={index}
                    className={`relative group ${previews.length === 3 && index === 0 ? 'col-span-2' : ''}`}
                >
                    {preview.type === 'video' ? (
                        <video
                            src={preview.url}
                            className={`w-full object-cover rounded-lg border border-gray-200 dark:border-gray-700 ${previews.length === 1 ? 'h-64' :
                                    previews.length === 3 && index === 0 ? 'h-48' :
                                        'h-40'
                                }`}
                            controls
                        />
                    ) : (
                        <img
                            src={preview.url}
                            alt={`Preview ${index + 1}`}
                            className={`w-full object-cover rounded-lg border border-gray-200 dark:border-gray-700 ${previews.length === 1 ? 'h-64' :
                                    previews.length === 3 && index === 0 ? 'h-48' :
                                        'h-40'
                                }`}
                        />
                    )}

                    {/* Counter overlay for 4th item if more than 4 */}
                    {index === 3 && previews.length > 4 && (
                        <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                            <span className="text-white text-4xl font-bold">+{previews.length - 4}</span>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 z-10"
                        aria-label={`Eliminar archivo ${index + 1}`}
                    >
                        <X size={18} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default FilePreview;
