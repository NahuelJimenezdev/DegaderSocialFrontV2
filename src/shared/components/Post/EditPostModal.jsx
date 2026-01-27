import React, { useState, useEffect } from 'react';
import { X, Save, Edit3 } from 'lucide-react';
import { useToast } from '../Toast/ToastProvider';

export default function EditPostModal({ isOpen, onClose, post, onSave }) {
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const toast = useToast();

    // Cargar contenido al abrir
    useEffect(() => {
        if (isOpen && post) {
            setContent(post.contenido || '');
        }
    }, [isOpen, post]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            toast.error('El contenido no puede estar vacío');
            return;
        }

        try {
            setIsSaving(true);
            await onSave(content);
            onClose();
        } catch (error) {
            console.error('Error in EditPostModal:', error);
            // El error debe ser manejado por quien pasa onSave, pero por si acaso
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <Edit3 size={20} className="text-indigo-600 dark:text-indigo-400" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">Editar publicación</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Contenido
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full min-h-[150px] p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y transition-all placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="¿En qué estás pensando?"
                            maxLength={5000}
                            autoFocus
                        />
                        <div className="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">
                            {content.length}/5000
                        </div>
                    </div>

                    {/* Footer / Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            disabled={isSaving}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving || !content.trim() || content === post?.contenido}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Guardar cambios
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
