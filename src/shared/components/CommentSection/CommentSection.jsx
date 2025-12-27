import React, { useState, useMemo, useRef } from 'react';
import CommentItem from './CommentItem';
import { getUserAvatar } from '../../utils/avatarUtils';
import EmojiPicker from '../../components/EmojiPicker/EmojiPicker';
import { Image as ImageIcon, X, Smile, Send } from 'lucide-react';

const CommentSection = ({ comments = [], postId, onAddComment, currentUser }) => {
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    // Build comment tree from flat array if needed
    const commentTree = useMemo(() => {
        if (!comments || comments.length === 0) return [];

        // If comments are already structured (e.g. have 'replies' likely not populated recursively from backend but let's assume flat list for safety as per Feed implementation)
        // Feed implementation assumed flat list and built tree. Profile implementation assumed populated list?
        // Let's reuse the robust tree builder from Feed logic.

        // Deep clone to avoid mutating props
        const commentsClone = JSON.parse(JSON.stringify(comments));
        const commentMap = {};
        const roots = [];

        // First pass: Create map
        commentsClone.forEach(comment => {
            // Ensure replies array exists
            comment.replies = [];
            commentMap[comment._id] = comment;
        });

        // Second pass: Link
        commentsClone.forEach(comment => {
            if (comment.parentComment) {
                if (commentMap[comment.parentComment]) {
                    commentMap[comment.parentComment].replies.push(commentMap[comment._id]);
                } else {
                    // Parent not found in current set (maybe pagination?), treat as root or orphan
                    // For now treat as root if parent missing
                    roots.push(commentMap[comment._id]);
                }
            } else {
                roots.push(commentMap[comment._id]);
            }
        });

        // Sort: Newest roots first
        roots.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return roots;
    }, [comments]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() && !selectedImage) return;

        setIsSubmitting(true);
        try {
            await onAddComment(postId, newComment, null, selectedImage);
            setNewComment('');
            setSelectedImage(null);
            setImagePreview(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReply = async (parentCommentId, content, image) => {
        await onAddComment(postId, content, parentCommentId, image);
    };

    const handleEmojiSelect = (emoji) => {
        setNewComment(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const userAvatar = getUserAvatar(currentUser);

    return (
        <div className="px-4 pb-4 pt-2">
            {/* Input Area */}
            <div className="flex gap-3 mb-6">
                <img
                    src={userAvatar}
                    alt="Tu perfil"
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <form onSubmit={handleSubmit} className="flex-1">
                    <div className="relative">
                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="mb-2 relative inline-block">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-h-32 rounded-lg border border-gray-200 dark:border-gray-700"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        {/* Input Container */}
                        <div className="relative flex items-center bg-gray-100 dark:bg-gray-800 rounded-2xl">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Escribe un comentario..."
                                className="flex-1 bg-transparent border-0 rounded-2xl py-2 pl-4 pr-24 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
                            />

                            {/* Action Buttons Container */}
                            <div className="absolute right-2 flex items-center gap-1">
                                {/* Emoji Button */}
                                <button
                                    type="button"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                                    title="Agregar emoji"
                                >
                                    <Smile size={20} />
                                </button>

                                {/* Image Button */}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                                    title="Agregar imagen"
                                >
                                    <ImageIcon size={20} />
                                </button>

                                {/* Send Button */}
                                <button
                                    type="submit"
                                    disabled={(!newComment.trim() && !selectedImage) || isSubmitting}
                                    className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <span className="animate-spin h-5 w-5 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full inline-block"></span>
                                    ) : (
                                        <Send size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Hidden File Input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />

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
                </form>
            </div>

            {/* Comments List */}
            <div className="space-y-1">
                {commentTree.map(comment => (
                    <CommentItem
                        key={comment._id}
                        comment={comment}
                        onReply={handleReply}
                        level={0}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
