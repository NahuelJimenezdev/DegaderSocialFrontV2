import React, { useState, useMemo, useRef, useEffect } from 'react';
import CommentItem from './CommentItem';
import { getUserAvatar } from '../../utils/avatarUtils';
import EmojiPicker from '../../components/EmojiPicker/EmojiPicker';
import { Image as ImageIcon, X, Smile, SendHorizontal, Gift } from 'lucide-react';
import MentionAutocomplete from '../MentionAutocomplete/MentionAutocomplete';

const CommentSection = ({ comments = [], postId, onAddComment, currentUser, isMobileFormat = false, highlightCommentId }) => {
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null); // { id: string, username: string }

    // Mention autocomplete state
    const [showMentions, setShowMentions] = useState(false);
    const [mentionQuery, setMentionQuery] = useState('');
    const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
    const [cursorPosition, setCursorPosition] = useState(0);

    const fileInputRef = useRef(null);
    const mainInputRef = useRef(null); // Ref for the main input

    // Build comment tree from flat array (same logic)
    const commentTree = useMemo(() => {
        if (!comments || comments.length === 0) return [];
        const commentsClone = JSON.parse(JSON.stringify(comments));
        const commentMap = {};
        const roots = [];
        commentsClone.forEach(comment => {
            comment.replies = [];
            commentMap[comment._id] = comment;
        });
        commentsClone.forEach(comment => {
            if (comment.parentComment) {
                if (commentMap[comment.parentComment]) {
                    commentMap[comment.parentComment].replies.push(commentMap[comment._id]);
                } else {
                    roots.push(commentMap[comment._id]);
                }
            } else {
                roots.push(commentMap[comment._id]);
            }
        });
        roots.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return roots;
    }, [comments]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() && !selectedImage) return;

        setIsSubmitting(true);
        try {
            // Include parentId if we are replying
            const parentId = replyingTo ? replyingTo.id : null;
            await onAddComment(postId, newComment, parentId, selectedImage);

            setNewComment('');
            setSelectedImage(null);
            setImagePreview(null);
            setReplyingTo(null); // Reset reply state
        } finally {
            setIsSubmitting(false);
        }
    };

    // Callback used by interactions in children (CommentItem)
    const handleReplyClick = (commentId, user) => {
        if (isMobileFormat) {
            // Mobile: Focus main input and set @mention
            const username = user.nombres?.primero || user.username || 'Usuario';
            setNewComment(`@${username} `);
            setReplyingTo({ id: commentId, username });
            mainInputRef.current?.focus();
        } else {
            // Desktop: We might still handle it here or let CommentItem handle it locally.
            // For now, let's keep pass-through behavior or null to let CommentItem use its own.
        }
    };

    // Helper for direct submission from CommentItem (Desktop nested forms)
    const handleNestedReplySubmit = async (parentCommentId, content, image) => {
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

    // Handle input change and detect @ for mentions
    const handleInputChange = (e) => {
        const value = e.target.value;
        const cursorPos = e.target.selectionStart;

        setNewComment(value);
        setCursorPosition(cursorPos);

        // Detect @ symbol
        const textBeforeCursor = value.substring(0, cursorPos);
        const lastAtIndex = textBeforeCursor.lastIndexOf('@');

        if (lastAtIndex !== -1) {
            const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
            // Check if there's no space after @
            if (!textAfterAt.includes(' ')) {
                setMentionQuery(textAfterAt);
                setShowMentions(true);

                // Calculate position for autocomplete dropdown
                if (mainInputRef.current) {
                    const rect = mainInputRef.current.getBoundingClientRect();
                    setMentionPosition({
                        top: rect.bottom + window.scrollY,
                        left: rect.left + window.scrollX
                    });
                }
            } else {
                setShowMentions(false);
            }
        } else {
            setShowMentions(false);
        }
    };

    // Handle mention selection
    const handleMentionSelect = (user) => {
        const textBeforeCursor = newComment.substring(0, cursorPosition);
        const lastAtIndex = textBeforeCursor.lastIndexOf('@');
        const textAfterCursor = newComment.substring(cursorPosition);

        const newText = newComment.substring(0, lastAtIndex) + `@${user.username} ` + textAfterCursor;
        setNewComment(newText);
        setShowMentions(false);

        // Focus back on input
        if (mainInputRef.current) {
            mainInputRef.current.focus();
        }
    };

    const userAvatar = getUserAvatar(currentUser);

    // Render Input Form (Reusable)
    const renderInputForm = () => (
        <form onSubmit={handleSubmit} className={`flex items-center gap-3 ${isMobileFormat ? 'w-full' : 'flex-1'}`}>
            {!isMobileFormat && (
                <img
                    src={userAvatar}
                    alt="Tu perfil"
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
            )}

            <div className="flex-1 relative">
                {/* Image Preview */}
                {imagePreview && (
                    <div className="absolute bottom-full left-0 mb-2 relative inline-block z-10">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-20 rounded-lg border border-gray-200 dark:border-gray-700 bg-white"
                        />
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}

                {/* Replying Indicator (Mobile) */}
                {isMobileFormat && replyingTo && (
                    <div className="text-xs text-gray-500 mb-1 ml-4 flex justify-between">
                        <span>Respondiendo a <b>{replyingTo.username}</b></span>
                        <button type="button" onClick={() => { setReplyingTo(null); setNewComment(''); }}>
                            <X size={12} />
                        </button>
                    </div>
                )}

                <div className={`relative flex items-center ${isMobileFormat ? 'bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2' : 'bg-gray-100 dark:bg-gray-800 rounded-2xl p-1'}`}>
                    {isMobileFormat && (
                        <img
                            src={userAvatar}
                            alt="Tu perfil"
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0 mr-2"
                        />
                    )}

                    <input
                        ref={mainInputRef}
                        type="text"
                        value={newComment}
                        onChange={handleInputChange}
                        placeholder={isMobileFormat ? (replyingTo ? `Respondiendo a ${replyingTo.username}...` : `Agrega un comentario...`) : "Escribe un comentario..."}
                        className={`flex-1 bg-transparent border-0 text-sm focus:ring-0 focus:outline-none text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 ${isMobileFormat ? 'py-1' : 'py-2 pl-3 pr-24'}`}
                    />

                    {/* Mention Autocomplete */}
                    <MentionAutocomplete
                        show={showMentions}
                        position={mentionPosition}
                        query={mentionQuery}
                        onSelect={handleMentionSelect}
                    />
                    {/* Hidden File Input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                    />

                    {/* Actions if standard desktop or integrated in input for mobile */}
                    <div className={`flex items-center gap-2 ${isMobileFormat ? 'ml-2' : 'absolute right-2'}`}>
                        {/* For Desktop: Emoji, Image, Send inside input container */}
                        {/* For Mobile: Send button only, maybe Gif/Insight icons outside? Keeping inside for now to match strict mock visual */}

                        {!isMobileFormat ? (
                            <>
                                <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-full"><Smile size={20} /></button>
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-full"><ImageIcon size={20} /></button>
                            </>
                        ) : (
                            // Mobile: Image upload button
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-gray-500"><ImageIcon size={20} /></button>
                        )}

                        <button
                            type="submit"
                            disabled={(!newComment.trim() && !selectedImage) || isSubmitting}
                            className="text-blue-500 font-semibold text-sm disabled:opacity-50"
                        >
                            {isSubmitting ? '...' : <SendHorizontal size={isMobileFormat ? 20 : 18} />}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );

    // Scroll to highlighted comment
    useEffect(() => {
        if (highlightCommentId && comments.length > 0) {
            // Need a slight delay to allow rendering
            setTimeout(() => {
                const element = document.getElementById(`comment-${highlightCommentId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.classList.add('highlight-comment'); // Add highlight style
                    setTimeout(() => element.classList.remove('highlight-comment'), 3000); // Remove after 3s
                }
            }, 500);
        }
    }, [highlightCommentId, comments]);

    return (
        <div className={isMobileFormat ? "flex flex-col h-full" : "px-4 pb-4 pt-2"}>
            <style>{`
                .highlight-comment {
                    animation: highlightPulse 2s ease-in-out;
                    border-left: 4px solid #8b5cf6; /* Indigo-500 equivalent */
                    background-color: rgba(139, 92, 246, 0.1);
                    transition: all 0.5s;
                }
                @keyframes highlightPulse {
                    0% { background-color: rgba(139, 92, 246, 0.3); }
                    100% { background-color: rgba(139, 92, 246, 0.0); }
                }
            `}</style>

            {/* Desktop: Input at Top */}
            {!isMobileFormat && (
                <div className="mb-6">
                    {renderInputForm()}
                </div>
            )}

            {/* Comments List */}
            <div className={`space-y-1 ${isMobileFormat ? 'flex-1 overflow-y-auto px-4 pb-32 scrollbar-hide' : ''}`}>
                {/* Added larger padding-bottom (pb-32) to ensure content clears the fixed footer */}
                {commentTree.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                        Sé el primero en comentar.
                    </div>
                ) : (
                    commentTree.map(comment => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            postId={postId}
                            currentUser={currentUser}
                            onReply={handleNestedReplySubmit}
                            onReplyClick={handleReplyClick} // New prop for initiating reply
                            isMobileFormat={isMobileFormat}
                            level={0}
                            highlightCommentId={highlightCommentId}
                        />
                    ))
                )}
            </div>


            {/* Mobile: Fixed Bottom Input */}
            {isMobileFormat && (
                <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-black p-3 pb-6 safe-area-bottom w-full shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    {/* Quick Reactions Bar - Optional Extra */}
                    <div className="flex justify-between px-2 mb-3 overflow-x-auto no-scrollbar gap-4">
                        {['❤️', '🙌', '🔥', '👏', '😢', '😍', '😮', '😂'].map(emoji => (
                            <button key={emoji} onClick={() => setNewComment(prev => prev + emoji)} className="text-xl hover:scale-110 transition-transform">
                                {emoji}
                            </button>
                        ))}
                    </div>

                    {renderInputForm()}
                </div>
            )}
        </div>
    );
};

export default CommentSection;
