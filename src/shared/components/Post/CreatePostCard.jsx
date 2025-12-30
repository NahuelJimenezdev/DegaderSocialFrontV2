import React, { useState, useRef } from 'react';
import { logger } from '../../utils/logger';
import { getUserAvatar } from '../../utils/avatarUtils';
import FilePreview from './FilePreview';
import FormatToolbar from './FormatToolbar';
import { Send } from 'lucide-react';

/**
 * CreatePostCard - Componente refactorizado para crear posts
 * @param {Object} currentUser - Usuario actual
 * @param {Function} onPostCreated - Callback al crear post
 * @param {boolean} alwaysExpanded - Si siempre está expandido
 * @param {string} error - Mensaje de error
 */
const CreatePostCard = ({ currentUser, onPostCreated, alwaysExpanded = false, error = null, showAvatar = false }) => {
    // ... (state vars same)
    const [content, setContent] = useState('');
    const [isExpanded, setIsExpanded] = useState(alwaysExpanded);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const fileInputRef = useRef(null);

    const userAvatar = getUserAvatar(currentUser);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && selectedImages.length === 0) return;

        setIsSubmitting(true);
        try {
            // 🆕 Usar FormData para enviar archivos reales (R2)
            const formData = new FormData();
            formData.append('contenido', content || ' ');
            formData.append('privacidad', 'publico');

            // Agregar archivos reales (no base64)
            if (selectedImages.length > 0) {
                logger.log('📸 Adding', selectedImages.length, 'files to FormData...');
                selectedImages.forEach(file => {
                    formData.append('media', file);
                });
            }

            logger.log('🚀 Sending post with FormData');
            await onPostCreated(formData);

            // Reset form on success
            setContent('');
            setSelectedImages([]);
            setImagePreviews([]);
            if (!alwaysExpanded) setIsExpanded(false);

        } catch (error) {
            logger.error('❌ Error creating post:', error);
            logger.error('❌ Error response:', error.response?.data);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEmojiSelect = (emoji) => {
        setContent(prev => prev + emoji);
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file =>
            file.type.startsWith('image/') || file.type.startsWith('video/')
        );

        if (validFiles.length > 0) {
            setSelectedImages(prev => [...prev, ...validFiles]);

            validFiles.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviews(prev => [...prev, {
                        url: reader.result,
                        type: file.type.startsWith('video/') ? 'video' : 'image'
                    }]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleRemoveImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleCancel = () => {
        if (!alwaysExpanded) setIsExpanded(false);
        setContent('');
        setSelectedImages([]);
        setImagePreviews([]);
        setShowEmojiPicker(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // ... (return)
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-900 p-4 mb-6">
            {!isExpanded && !alwaysExpanded ? (
                <div className="flex gap-3">
                    {showAvatar && (
                        <img
                            src={userAvatar}
                            alt="Tu perfil"
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            onError={(e) => {
                                e.target.onerror = null;
                                const name = currentUser?.nombreCompleto || currentUser?.email?.split('@')[0] || 'Usuario';
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=128`;
                            }}
                        />
                    )}
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="w-full text-left bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full px-4 py-2.5 text-gray-500 dark:text-gray-400 transition-colors"
                    >
                        ¿Qué estás pensando?
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {/* Error Message */}
                    {error && (
                        <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="flex gap-3 mb-3">
                        {showAvatar && (
                            <img
                                src={userAvatar}
                                alt="Tu perfil"
                                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    const name = currentUser?.nombreCompleto || currentUser?.email?.split('@')[0] || 'Usuario';
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=128`;
                                }}
                            />
                        )}
                        <div className="flex-1">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="¿Qué estás pensando?"
                                className="w-full bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none p-0 text-base text-justify"
                                rows={3}
                                autoFocus={!alwaysExpanded}
                            />
                        </div>
                    </div>

                    {/* File Previews - Ahora full width debajo del input */}
                    <div className="pl-0 md:pl-13"> {/* Padding left en desktop para alinear con texto, 0 en mobile */}
                        <FilePreview
                            previews={imagePreviews}
                            onRemove={handleRemoveImage}
                        />
                    </div>

                    <div className="flex flex-wrap items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 gap-y-2">
                        {/* Format Toolbar */}
                        <FormatToolbar
                            fileInputRef={fileInputRef}
                            showEmojiPicker={showEmojiPicker}
                            onToggleEmojiPicker={() => setShowEmojiPicker(!showEmojiPicker)}
                            onEmojiSelect={handleEmojiSelect}
                        />

                        <div className="flex gap-2">
                            {!alwaysExpanded && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={(!content.trim() && selectedImages.length === 0) || isSubmitting}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                ) : (
                                    <>
                                        <span>Publicar</span>
                                        <Send size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Hidden File Input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                    />
                </form>
            )}
        </div>
    );
};

export default CreatePostCard;
