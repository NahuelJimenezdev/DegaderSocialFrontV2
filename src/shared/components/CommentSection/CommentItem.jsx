import React, { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { getUserAvatar } from '../../utils/avatarUtils';
import { Image as ImageIcon, X, Heart, MoreHorizontal, Flag, Trash2 } from 'lucide-react';
import postService from '../../../features/feed/services/postService';
import ReportModal from '../Report/ReportModal';
import { useToast } from '../Toast/ToastProvider';

const CommentItem = ({ comment, postId, currentUser, onReply, onReplyClick, isMobileFormat = false, level = 0, highlightCommentId }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const [isLiked, setIsLiked] = useState(comment.likes?.includes(currentUser?._id) || false);
    const [likesCount, setLikesCount] = useState(comment.likes?.length || 0);
    const [showMenu, setShowMenu] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const { toast } = useToast();

    const menuRef = useRef(null);

    // Cerrar menú al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const [replyImage, setReplyImage] = useState(null);
    const replyFileInputRef = useRef(null);

    // Sync like state when comment updates (e.g., from real-time updates)
    useEffect(() => {
        setIsLiked(comment.likes?.includes(currentUser?._id) || false);
        setLikesCount(comment.likes?.length || 0);
    }, [comment.likes, currentUser?._id]);

    const handleReplyImageSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setReplyImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitReply = (e) => {
        e.preventDefault();
        if (replyContent.trim() || replyImage) {
            const targetParentId = comment.parentComment || comment._id;

            // If we are already at level >= 1, we must reply to the ORIGINAL parent comment, not this reply.
            // The backend likely enforces max 2 levels (root + reply), so replying to a reply (level 1)
            // should target the ROOT comment (level 0) but maybe tag the user? 
            // OR the backend logic "parentComment.parentComment" suggests strictly 1 level of nesting.
            // Let's ensure targetParentId is always the root comment ID if we are deep.

            let finalTargetId = comment._id;
            const parentReference = comment.parentComment;
            if (parentReference) {
                finalTargetId = (typeof parentReference === 'object') ? parentReference._id : parentReference;
            }

            // Ensure mention is added for desktop reply
            const mentionName = user.nombres?.primero || user.username || 'Usuario';
            let finalContent = replyContent;
            if (!finalContent.startsWith(`@${mentionName}`)) {
                finalContent = `@${mentionName} ${finalContent}`;
            }

            onReply(finalTargetId, finalContent, replyImage);



            setReplyContent('');
            setReplyImage(null);
            setIsReplying(false);
        }
    };

    const toggleLike = async () => {
        const previousLiked = isLiked;
        const previousCount = likesCount;

        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

        try {
            await postService.toggleCommentLike(postId, comment._id);
        } catch (error) {
            console.error('Error toggling like:', error);
            setIsLiked(previousLiked);
            setLikesCount(previousCount);
        }
    };

    const user = comment.usuario;
    const avatar = getUserAvatar(user);
    const fullName = `${user.nombres?.primero || ''} ${user.apellidos?.primero || ''}`.trim() || user.username || 'Usuario';

    // Clean time format
    const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { locale: es, addSuffix: false })
        .replace('alrededor de ', '')
        .replace('menos de un minuto', '1m')
        .replace(' minutos', 'm')
        .replace(' minuto', 'm')
        .replace(' horas', 'h')
        .replace(' hora', 'h')
        .replace(' días', 'd')
        .replace(' día', 'd');

    // Instagram style indentation: minimal logic
    // Root level: px-4 (standard padding)
    // Level 1+: pl-12 (indent matched to avatar width + gap) to align with parent text
    const containerClasses = level > 0 ? "pl-12 mt-3" : "px-4 mt-4";

    return (
        <div id={`comment-${comment._id}`} className={containerClasses}>
            <div className="flex gap-3 group items-start">
                {/* Content & Right Interaction */}
                <div className="flex-1 min-w-0 pr-1">
                    <div className="flex flex-col gap-1">

                        {/* 1. Imagen + Nombre + (Heart at far right) (Header Row) */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex-shrink-0 cursor-pointer">
                                    <img
                                        src={avatar}
                                        alt={fullName}
                                        className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-100 dark:ring-gray-800"
                                    />
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white text-[13px] cursor-pointer hover:text-gray-600 dark:hover:text-gray-300">
                                    {fullName}
                                </span>
                            </div>

                            {/* Right Actions: Heart + Menu */}
                            <div className="flex items-start gap-2">
                                {/* Heart Icon with Counter */}
                                <div className="flex flex-col items-center gap-0.5">
                                    <button
                                        onClick={toggleLike}
                                        className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                                    >
                                        <Heart size={14} className={isLiked ? "fill-current" : ""} />
                                    </button>
                                    {likesCount > 0 && (
                                        <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">
                                            {likesCount}
                                        </span>
                                    )}
                                </div>

                                {/* Options Menu */}
                                <div className="relative" ref={menuRef}>
                                    <button
                                        onClick={() => setShowMenu(!showMenu)}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <MoreHorizontal size={14} />
                                    </button>

                                    {showMenu && (
                                        <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-10">
                                            <button
                                                onClick={() => {
                                                    setShowMenu(false);
                                                    setShowReportModal(true);
                                                }}
                                                className="w-full px-4 py-2 text-left text-xs flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <Flag size={12} />
                                                Reportar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 2. Mensaje Escrito (Content Row) */}
                        <div className="text-[14px] leading-5 text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words pl-8">
                            {/* Mention Highlighting: Match @word and wrap in colored span.
                                 Using simple split/map to avoid dangerous HTML or complex parsing.
                                 Regex matches @ followed by word characters. 
                             */}
                            {comment.contenido.split(/(@[\w\u00C0-\u00FF]+)/g).map((part, index) =>
                                part.startsWith('@') ? (
                                    <span key={index} className="text-violet-600 dark:text-violet-400 font-medium">
                                        {part}
                                    </span>
                                ) : (
                                    part
                                )
                            )}
                        </div>

                        {comment.image && (
                            <div className="mt-2 pl-8">
                                <img
                                    src={comment.image}
                                    alt="Imagen adjunta"
                                    className="max-h-48 rounded-lg object-cover"
                                />
                            </div>
                        )}

                        {/* 3. Hora - Me gusta - Responder (Metadata Row) */}
                        <div className="flex items-center gap-4 mt-1 pl-8 text-xs text-gray-500 dark:text-gray-400 font-medium">
                            <span>{timeAgo}</span>

                            {/* Like Logic in Metadata Row? User said "Hora - Me gusta - Responder"
                                But usually Like Icon is on the right. 
                                "Me gusta" as text usually means "Reply" or "Like" count. 
                                User: "3. hora - me gusta - Responder" 
                                This might mean the TEXT "Me gusta" to like it? Or the count?
                                Instagram: [Time] [Like(verb)] [Reply]
                                Let's assume standard "Like" text button or just count?
                                "10 me gusta" is count.
                                Let's put the Like ICON on the right as requested before, and COUNT here.
                                Wait, user complained: "corazones like simepre al final ... muy disparejo"
                                Using flex justify-between for the whole row might be better?
                                Let's keep the Heart icon on the absolute right of the container, 
                                and use this row for "Time - Count - ReplyButton".
                            */}
                            {likesCount > 0 && <span>{likesCount} me gusta</span>}

                            <button
                                onClick={() => {
                                    if (isMobileFormat && onReplyClick) {
                                        // Flatten logic: if replying to a reply, use the ORIGINAL parent ID
                                        let finalTargetId = comment._id;
                                        const parentReference = comment.parentComment;
                                        if (parentReference) {
                                            finalTargetId = (typeof parentReference === 'object') ? parentReference._id : parentReference;
                                        }
                                        onReplyClick(finalTargetId, user);
                                    } else {
                                        setIsReplying(!isReplying);
                                    }
                                }}
                                className="hover:text-gray-800 dark:hover:text-gray-300 font-semibold"
                            >
                                Responder
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reply Form - Rendered outside main flex to maintain full width reference if needed, though for form indentation we might want it aligned with text. 
                But for cleaner DOM structure let's keep it here but indented. 
                Wait, if we move it out, we need to manually indent it to match text.
                Let's indent via padding-left on the wrapper div if it's outside.
            */}
            {
                isReplying && (
                    <div className="pl-11 mt-2"> {/* Manual indentation to align with text start */}
                        <form onSubmit={handleSubmitReply} className="flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                            {replyImage && (
                                <div className="relative inline-block w-fit">
                                    <img src={replyImage} alt="Preview" className="h-10 w-10 rounded object-cover border border-gray-200 dark:border-gray-700" />
                                    <button
                                        type="button"
                                        onClick={() => setReplyImage(null)}
                                        className="absolute -top-1 -right-1 bg-gray-900 text-white rounded-full p-0.5"
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                            )}
                            <input
                                type="text"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder={`Responder a ${fullName}...`}
                                // Pre-fill / Force mention visual if needed, but placeholder says "Responder a X"
                                className="flex-1 bg-transparent border-b border-gray-300 dark:border-gray-700 py-1 px-0 text-sm focus:ring-0 focus:border-indigo-500 dark:text-white placeholder:text-gray-400"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => replyFileInputRef.current?.click()}
                                    className="text-gray-400 hover:text-gray-600 pt-1"
                                >
                                    <ImageIcon size={18} />
                                </button>
                                <button
                                    type="submit"
                                    disabled={!replyContent.trim() && !replyImage}
                                    className="text-blue-500 font-semibold text-sm pt-1 disabled:opacity-50"
                                >
                                    Publicar
                                </button>
                            </div>
                            <input
                                ref={replyFileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleReplyImageSelect}
                                className="hidden"
                            />
                        </form>
                    </div>
                )
            }

            {/* Nested Replies */}
            {
                comment.replies && comment.replies.length > 0 && (
                    <div className="space-y-0 mt-3">
                        {comment.replies.map(reply => (
                            <CommentItem
                                key={reply._id}
                                comment={reply}
                                postId={postId}
                                currentUser={currentUser}
                                onReply={onReply}
                                onReplyClick={onReplyClick}
                                isMobileFormat={isMobileFormat}
                                level={level + 1}
                                highlightCommentId={highlightCommentId}
                            />
                        ))}
                    </div>
                )
            }

            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                contentType="comment"
                contentId={comment._id}
                onReportSuccess={() => toast.success('Comentario reportado')}
            />
        </div>
    );
};

export default CommentItem;
