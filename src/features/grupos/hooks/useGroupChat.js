import { useState, useEffect, useRef } from 'react';
import { logger } from '../../../shared/utils/logger';
import { io } from 'socket.io-client';
import groupService from '../../../api/groupService';

/**
 * Agrupa las reacciones por emoji
 */
const groupReactions = (reactions) => {
    if (!reactions || !Array.isArray(reactions)) return [];

    const grouped = {};

    reactions.forEach((reaction) => {
        const emoji = reaction.emoji;
        if (!grouped[emoji]) {
            grouped[emoji] = {
                emoji,
                count: 0,
                users: []
            };
        }
        grouped[emoji].count++;
        if (reaction.usuario) {
            grouped[emoji].users.push(reaction.usuario);
        }
    });

    return Object.values(grouped);
};

/**
 * Transforma un mensaje del backend
 */
const transformMessage = (msg) => {
    return {
        ...msg,
        reactions: groupReactions(msg.reactions)
    };
};

export const useGroupChat = (groupData, user, targetMessageId, onClearTargetMessage) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, variant: 'info', message: '' });

    // Estados UI
    const [replyTo, setReplyTo] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(null);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const socketRef = useRef(null);
    const prevMessagesLengthRef = useRef(0);

    // Scroll to target message
    useEffect(() => {
        if (targetMessageId && messages.length > 0) {
            setTimeout(() => {
                const element = document.getElementById(`message-${targetMessageId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.classList.add('ring-2', 'ring-yellow-400', 'ring-offset-2', 'dark:ring-offset-gray-900');
                    setTimeout(() => {
                        element.classList.remove('ring-2', 'ring-yellow-400', 'ring-offset-2', 'dark:ring-offset-gray-900');
                        if (onClearTargetMessage) onClearTargetMessage();
                    }, 3000);
                }
            }, 100);
        }
    }, [targetMessageId, messages, onClearTargetMessage]);

    // Cargar mensajes
    useEffect(() => {
        const loadMessages = async () => {
            try {
                logger.log('📥 [LOAD] Cargando mensajes del grupo:', groupData._id);
                setLoading(true);
                const data = await groupService.getMessages(groupData._id);
                const transformedMessages = Array.isArray(data) ? data.map(transformMessage) : [];
                setMessages(transformedMessages);
                prevMessagesLengthRef.current = transformedMessages.length;

                // Scroll instantáneo al final después de cargar mensajes
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
                }, 100);
            } catch (err) {
                logger.error('❌ [LOAD] Error loading messages:', err);
                setMessages([]);
            } finally {
                setLoading(false);
            }
        };

        if (groupData?._id) {
            loadMessages();
        }
    }, [groupData?._id]);

    // WebSocket connection
    useEffect(() => {
        if (!groupData?._id || !user?._id) {
            return;
        }

        const socketUrl = import.meta.env.VITE_API_URL
            ? import.meta.env.VITE_API_URL.replace('/api', '')
            : 'http://localhost:3001';

        const socket = io(socketUrl, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketRef.current = socket;

        // Autenticar el socket
        const token = localStorage.getItem('token');
        socket.emit('authenticate', { token });

        socket.on('authenticated', () => {
            socket.emit('subscribeGroup', { groupId: groupData._id });
        });

        // Escuchar nuevos mensajes del grupo
        socket.on('newGroupMessage', (newMessage) => {
            const transformedNewMessage = transformMessage(newMessage);
            setMessages((prev) => {
                // Evitar duplicados
                const existsById = prev.some(msg => msg._id === transformedNewMessage._id);
                if (existsById) return prev;

                // Si es mi propio mensaje, verificar si ya existe como optimista
                const isMyMessage = String(transformedNewMessage.author?._id) === String(user._id);
                if (isMyMessage) {
                    const hasOptimisticOrRecent = prev.some(msg =>
                        (msg.isOptimistic && String(msg.author?._id) === String(user._id)) ||
                        (msg.attachments?.length > 0 && String(msg.author?._id) === String(user._id) && Math.abs(new Date(msg.createdAt) - new Date(transformedNewMessage.createdAt)) < 5000)
                    );
                    if (hasOptimisticOrRecent) return prev;
                }

                const newMessages = [...prev, transformedNewMessage];
                prevMessagesLengthRef.current = newMessages.length;
                return newMessages;
            });
            if (!targetMessageId) {
                scrollToBottom();
            }
        });

        // Escuchar mensajes eliminados
        socket.on('messageDeleted', ({ groupId, messageId }) => {
            setMessages((prev) => {
                const filtered = prev.filter((msg) => msg._id !== messageId);
                prevMessagesLengthRef.current = filtered.length;
                return filtered;
            });
        });

        // Escuchar actualizaciones de reacciones
        socket.on('messageReactionUpdated', ({ groupId, messageId, message: updatedMessage }) => {
            if (updatedMessage) {
                setMessages((prev) => {
                    return prev.map((msg) => {
                        if (msg._id === messageId) {
                            return {
                                ...msg,
                                reactions: groupReactions(updatedMessage.reactions)
                            };
                        }
                        return msg;
                    });
                });
            }
        });

        return () => {
            socket.emit('unsubscribeGroup', { groupId: groupData._id });
            socket.disconnect();
        };
    }, [groupData?._id, user?._id]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    };

    useEffect(() => {
        if (!targetMessageId && messages.length > prevMessagesLengthRef.current) {
            scrollToBottom();
            prevMessagesLengthRef.current = messages.length;
        }
    }, [messages, targetMessageId]);

    const handleSendMessage = async (messageText) => {
        if (!messageText.trim() && selectedFiles.length === 0) return;

        const tempId = `optimistic_${Date.now()}`;
        const filesToSend = [...selectedFiles];
        const replyToMsg = replyTo;

        // Mensaje optimista
        const optimisticAttachments = filesToSend.map((f) => ({
            type: f.type?.startsWith('image/') ? 'image' : f.type?.startsWith('video/') ? 'video' : 'file',
            url: URL.createObjectURL(f),
            name: f.name,
            size: f.size
        }));

        const optimisticMessage = {
            _id: tempId,
            content: messageText,
            author: {
                _id: user._id,
                nombre: user.nombres?.primero,
                apellido: user.apellidos?.primero,
                avatar: user.social?.fotoPerfil,
            },
            createdAt: new Date().toISOString(),
            reactions: [],
            starredBy: [],
            replyTo: replyToMsg ? { _id: replyToMsg._id, content: replyToMsg.content, author: replyToMsg.author } : null,
            isOptimistic: true,
            attachments: optimisticAttachments,
        };

        setMessages((prev) => [...prev, optimisticMessage]);
        setSelectedFiles([]);
        setReplyTo(null);

        try {
            let sentMessage;
            if (filesToSend.length > 0) {
                sentMessage = await groupService.sendMessageWithFiles(groupData._id, {
                    content: messageText,
                    replyTo: replyToMsg?._id,
                    files: filesToSend,
                    clientTempId: tempId,
                });
            } else {
                sentMessage = await groupService.sendMessage(groupData._id, {
                    content: messageText,
                    replyTo: replyToMsg?._id,
                    clientTempId: tempId,
                });
            }

            if (sentMessage) {
                const transformedSentMessage = transformMessage(sentMessage);
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg._id === tempId
                            ? { ...transformedSentMessage, isOptimistic: false }
                            : msg
                    )
                );
            }
        } catch (err) {
            logger.error('Error sending message:', err);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg._id === tempId
                        ? { ...msg, isOptimistic: false, error: true }
                        : msg
                )
            );
            // alert('Error al enviar el mensaje'); // Handled by UI error state
            throw err;
        }
    };

    const handleDeleteMessage = async (messageId) => {
        if (!window.confirm('¿Eliminar este mensaje?')) return;
        try {
            await groupService.deleteMessage(groupData._id, messageId);
        } catch (err) {
            logger.error('Error al eliminar mensaje:', err);
            setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al eliminar el mensaje' });
        }
    };

    const handleReaction = async (messageId, emoji) => {
        try {
            await groupService.reactToMessage(groupData._id, messageId, emoji);
            setShowEmojiPicker(null);
        } catch (err) {
            setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al reaccionar' });
        }
    };

    const handleToggleStar = async (messageId) => {
        try {
            setMessages((prev) =>
                prev.map((msg) => {
                    if (msg._id === messageId) {
                        const isCurrentlyStarred = msg.starredBy?.includes(user._id);
                        const newStarredBy = isCurrentlyStarred
                            ? (msg.starredBy || []).filter((id) => id !== user._id)
                            : [...(msg.starredBy || []), user._id];
                        return { ...msg, starredBy: newStarredBy, isOptimistic: true };
                    }
                    return msg;
                })
            );

            const response = await groupService.toggleStar(groupData._id, messageId);
            const updatedMessage = response.data || response;

            setMessages((prev) =>
                prev.map((msg) =>
                    msg._id === messageId
                        ? { ...msg, starredBy: updatedMessage.starredBy, isOptimistic: false }
                        : msg
                )
            );
        } catch (err) {
            setMessages((prev) =>
                prev.map((msg) => {
                    if (msg._id === messageId) {
                        const isCurrentlyStarred = msg.starredBy?.includes(user._id);
                        const revertedStarredBy = isCurrentlyStarred
                            ? (msg.starredBy || []).filter((id) => id !== user._id)
                            : [...(msg.starredBy || []), user._id];
                        return { ...msg, starredBy: revertedStarredBy, isOptimistic: false, error: true };
                    }
                    return msg;
                })
            );
            setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al destacar el mensaje' });
        }
    };

    return {
        messages,
        loading,
        replyTo,
        setReplyTo,
        selectedFiles,
        setSelectedFiles,
        showEmojiPicker,
        setShowEmojiPicker,
        messagesEndRef,
        fileInputRef,
        handleSendMessage,
        handleDeleteMessage,
        handleReaction,
        handleToggleStar,
        alertConfig,
        setAlertConfig,
    };
};
