import React, { useState, useRef } from 'react';
import { logger } from '../../utils/logger';
import { getUserAvatar } from '../../utils/avatarUtils';
import EmojiPicker from '../../components/EmojiPicker/EmojiPicker';
import { Image as ImageIcon, X, Smile, Send } from 'lucide-react';

const CreatePostCard = ({ currentUser, onPostCreated, alwaysExpanded = false, error = null }) => {
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
            const postData = {
                contenido: content || ' ',
                privacidad: 'publico'
            };

            // Convert images/videos to base64 if present
            if (selectedImages.length > 0) {
                logger.log('📸 Converting', selectedImages.length, 'files to base64...');
                const mediaPromises = selectedImages.map(file => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            // Simple detection based on MIME type
                            const isVideo = file.type.startsWith('video/');
                            resolve({
                                url: reader.result,
                                name: file.name,
                                type: isVideo ? 'video' : 'image'
                            });
                        };
                        reader.onerror = (error) => {
                            logger.error('❌ Error converting file:', file.name, error);
                            reject(error);
                        };
                        reader.readAsDataURL(file);
                    });
                });

                const base64Media = await Promise.all(mediaPromises);

                // Separate images and videos for API compatibility
                // Using object format {url, alt} to support both Feed and Profile backend expectations
                postData.images = base64Media.filter(m => m.type === 'image').map(m => ({ url: m.url, alt: m.name }));

                // Some backends expect 'videos' array, others mix them. 
                const videos = base64Media.filter(m => m.type === 'video').map(m => ({ url: m.url, title: m.name }));
                if (videos.length > 0) {
                    postData.videos = videos;
                }

                logger.log('📦 Post data prep:', {
                    contenido: postData.contenido,
                    imageCount: postData.images?.length || 0,
                    videoCount: postData.videos?.length || 0
                });
            }

            logger.log('🚀 Sending post data:', postData);
            await onPostCreated(postData);

            // Reset form on success
            setContent('');
            setSelectedImages([]);
            setImagePreviews([]);
            if (!alwaysExpanded) setIsExpanded(false);

        } catch (error) {
            logger.error('❌ Error creating post:', error);
            logger.error('❌ Error response:', error.response?.data);
            // Form remains populated so user can retry
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEmojiSelect = (emoji) => {
        setContent(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        // Allow images and videos
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

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 mb-6">
            <div className="flex gap-3">
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

                <div className="flex-1">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {!isExpanded && !alwaysExpanded ? (
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="w-full text-left bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full px-4 py-2.5 text-gray-500 dark:text-gray-400 transition-colors"
                        >
                            ¿Qué estás pensando?
                        </button>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex-1">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="¿Qué estás pensando?"
                                className="w-full bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                                rows={3}
                                autoFocus={!alwaysExpanded}
                            />

                            {/* Media Previews - Max 4 with Counter */}
                            {imagePreviews.length > 0 && (
                                <div className={`mt-3 gap-2 ${imagePreviews.length === 1 ? 'grid grid-cols-1' :
                                    'grid grid-cols-2'
                                    }`}>
                                    {imagePreviews.slice(0, 4).map((preview, index) => (
                                        <div
                                            key={index}
                                            className={`relative group ${imagePreviews.length === 3 && index === 0 ? 'col-span-2' : ''
                                                }`}
                                        >
                                            {preview.type === 'video' ? (
                                                <video
                                                    src={preview.url}
                                                    className={`w-full object-cover rounded-lg border border-gray-200 dark:border-gray-700 ${imagePreviews.length === 1 ? 'h-64' :
                                                        imagePreviews.length === 3 && index === 0 ? 'h-48' :
                                                            'h-40'
                                                        }`}
                                                    controls
                                                />
                                            ) : (
                                                <img
                                                    src={preview.url}
                                                    alt={`Preview ${index + 1}`}
                                                    className={`w-full object-cover rounded-lg border border-gray-200 dark:border-gray-700 ${imagePreviews.length === 1 ? 'h-64' :
                                                        imagePreviews.length === 3 && index === 0 ? 'h-48' :
                                                            'h-40'
                                                        }`}
                                                />
                                            )}

                                            {/* Counter overlay for 4th item if more than 4 */}
                                            {index === 3 && imagePreviews.length > 4 && (
                                                <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                                                    <span className="text-white text-4xl font-bold">+{imagePreviews.length - 4}</span>
                                                </div>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 z-10"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex gap-2 relative">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
                                        title="Agregar foto o video"
                                    >
                                        <ImageIcon size={20} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
                                        title="Agregar emoji"
                                    >
                                        <Smile size={20} />
                                    </button>

                                    {/* Emoji Picker */}
                                    {showEmojiPicker && (
                                        <div className="absolute bottom-full left-0 mb-2 z-50">
                                            <EmojiPicker
                                                onEmojiSelect={handleEmojiSelect}
                                                onClose={() => setShowEmojiPicker(false)}
                                            />
                                        </div>
                                    )}
                                </div>

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
            </div>
        </div>
    );
};

export default CreatePostCard;
