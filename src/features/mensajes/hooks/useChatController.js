import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { logger } from '../../../shared/utils/logger';
import { getSocket } from '../../../shared/lib/socket';
import conversationService from '../../../api/conversationService';
import { usePendingMessageCounter } from '../../../hooks/usePendingMessageCounter';
import api from '../../../api/config';
import { requestFirebaseToken } from '../../../shared/lib/firebase';

// Helper para generar ID temporal único para idempotencia
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const useChatController = () => {
    const { id: paramConvId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const userId = user?._id || user?.id;

    const [conversaciones, setConversaciones] = useState([]);
    const [conversacionActual, setConversacionActual] = useState(null);
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [mostrarBuscador, setMostrarBuscador] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [cargandoConversaciones, setCargandoConversaciones] = useState(false);
    const [busquedaGlobal, setBusquedaGlobal] = useState('');
    const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
    const [cargandoBusqueda, setCargandoBusqueda] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(null);
    const [tabActiva, setTabActiva] = useState('principal');
    const [pendingCount, setPendingCount] = useState(0);
    const [filtroActivo, setFiltroActivo] = useState('todos');
    const [mostrarEmojiPicker, setMostrarEmojiPicker] = useState(false);
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
    const [previsualizacionArchivo, setPrevisualizacionArchivo] = useState(null);
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, variant: 'info', message: '' });
    const [pagination, setPagination] = useState({ nextCursor: null, hasMore: false });
    const [replyingTo, setReplyingTo] = useState(null);
    const [pendingQueue, setPendingQueue] = useState([]); // Cola de mensajes esperando envío/idempotencia
    const mensajesEndRef = useRef(null);
    const timeoutRef = useRef(null);
    const fileInputRef = useRef(null);
    const isFetching = useRef(false); // Flag para evitar fetches concurrentes
    const isSendingMessageRef = useRef(false); // Lock para evitar duplicación por doble click o Enter+Click
    const conversationCreationLock = useRef({}); // Lock para evitar creación duplicada de conversaciones

    // Hook para actualizar contador de mensajes pendientes
    const { refreshPendingCount } = usePendingMessageCounter(userId);

    // Helper local: Formatear tiempo
    const formatearTiempo = React.useCallback((fecha) => {
        if (!fecha) return '';
        const now = new Date();
        const msgDate = new Date(fecha);
        const diff = now - msgDate;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Ahora';
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        if (days < 7) return `${days}d`;
        return msgDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    }, []);

    // Helper local: Obtener otro participante
    const getOtroParticipante = React.useCallback((conv) => {
        if (!conv || !conv.participantes) return null;
        return conv.participantes.find(p => p._id !== userId);
    }, [userId]);

    // Helper local: Contador unread
    const getUnreadCount = React.useCallback((conv) => {
        const unread = conv.mensajesNoLeidos?.find(m => m.usuario?.toString() === userId?.toString());
        return unread?.cantidad || 0;
    }, [userId]);

    // Cargar contador de pendientes
    useEffect(() => {
        if (!userId) return;

        const fetchPendingCount = async () => {
            try {
                const response = await conversationService.getPendingCount();
                const count = response.data?.count || 0;
                setPendingCount(count);
            } catch (error) {
                logger.error('Error al cargar contador de pendientes:', error);
            }
        };

        fetchPendingCount();
        const interval = setInterval(fetchPendingCount, 30000);
        
        // 🔔 Registrar para Notificaciones Push (FCM)
        const registerPush = async () => {
            try {
                // Si el permiso YA fue concedido anteriormente, podemos pedir el token "silenciosamente" al inicio.
                // Si es "default", debemos esperar a un gesto del usuario (ej: click en enviar mensaje).
                if ('Notification' in window && Notification.permission === 'granted') {
                    setTimeout(async () => {
                        await requestFirebaseToken(userId);
                    }, 2000);
                }
            } catch (err) {
                console.error('Error in silent push registration:', err);
            }
        };
        registerPush();

        return () => clearInterval(interval);
    }, [userId]);

    // Cargar conversaciones según la pestaña activa
    useEffect(() => {
        if (!userId) return;

        const fetchConversaciones = async () => {
            try {
                setCargandoConversaciones(true);
                const response = await conversationService.getAllConversations(tabActiva);
                const convs = response.data?.conversations || response.conversations || response.data || [];
                setConversaciones(Array.isArray(convs) ? convs : []);
            } catch (error) {
                logger.error('Error al cargar conversaciones:', error);
                setConversaciones([]);
            } finally {
                setCargandoConversaciones(false);
            }
        };

        fetchConversaciones();
    }, [userId, tabActiva]);

    const loadMessages = async (conversationId, cursor = null) => {
        try {
            if (cursor) setCargando(true);
            const response = await conversationService.getConversationById(
                conversationId, 
                cursor?.createdAt, 
                cursor?._id
            );
            const data = response.data || response;
            const msgs = data.mensajes || [];
            
            if (cursor) {
                // Paginación (scroll up)
                // 🧠 MEJORA: Mantener posición de scroll al cargar más (vía ref en el componente)
                setMensajes(prev => [...msgs, ...prev]);
            } else {
                // Carga inicial
                setMensajes(msgs);
                // Reset optimista del contador
                setConversaciones(prev => prev.map(c =>
                    c._id === conversationId
                        ? {
                            ...c, mensajesNoLeidos: c.mensajesNoLeidos?.map(m =>
                                m.usuario?.toString() === userId?.toString() ? { ...m, cantidad: 0 } : m
                            )
                        }
                        : c
                ));
                await conversationService.markAsRead(conversationId);
                setTimeout(() => scrollToBottom(), 100);
            }

            setPagination({
                nextCursor: data.pagination?.nextCursor,
                hasMore: data.pagination?.hasMore
            });
        } catch (error) {
            logger.error('Error al cargar mensajes:', error);
            if (!cursor) setMensajes([]);
        } finally {
            if (cursor) setCargando(false);
        }
    };

    const handleLoadMore = () => {
        if (pagination.hasMore && !cargando && conversacionActual) {
            loadMessages(conversacionActual._id, pagination.nextCursor);
        }
    };

    // Cargar conversación específica
    useEffect(() => {
        const targetUserId = searchParams.get('userId');

        if (targetUserId && userId && !paramConvId) {
            const loadConversation = async () => {
                // Verificar si ya hay una solicitud en progreso para este usuario
                const lockKey = `user:${targetUserId}`;
                if (conversationCreationLock.current[lockKey]) {
                    logger.log('🔒 [DEDUP] Ya hay una solicitud en progreso para:', lockKey);
                    return;
                }

                try {
                    conversationCreationLock.current[lockKey] = true;
                    setCargando(true);
                    const response = await conversationService.getOrCreateConversation(targetUserId);
                    const conv = response.data?.conversation || response.conversation || response.data;

                    if (conv) {
                        setConversacionActual(conv);
                        loadMessages(conv._id);
                        navigate(`/mensajes/${conv._id}`, { replace: true });

                        // Recargar conversaciones
                        const convResponse = await conversationService.getAllConversations(tabActiva);
                        const convs = convResponse.data?.conversations || convResponse.conversations || convResponse.data || [];
                        setConversaciones(Array.isArray(convs) ? convs : []);
                    }
                } catch (error) {
                    logger.error('Error al cargar conversación:', error);
                } finally {
                    setCargando(false);
                    delete conversationCreationLock.current[lockKey];
                }
            };
            loadConversation();
            return;
        }

        if (!paramConvId || !userId) return;

        const loadConversation = async () => {
            try {
                setCargando(true);
                if (paramConvId.startsWith('user:')) {
                    const targetUserId = paramConvId.substring(5);

                    // Verificar si ya hay una solicitud en progreso para este usuario
                    const lockKey = `user:${targetUserId}`;
                    if (conversationCreationLock.current[lockKey]) {
                        logger.log('🔒 [DEDUP] Ya hay una solicitud en progreso para:', lockKey);
                        return;
                    }

                    conversationCreationLock.current[lockKey] = true;

                    const response = await conversationService.getOrCreateConversation(targetUserId);
                    const conv = response.data?.conversation || response.conversation || response.data;
                    if (conv) {
                        setConversacionActual(conv);
                        loadMessages(conv._id);
                        navigate(`/mensajes/${conv._id}`, { replace: true });

                        const convResponse = await conversationService.getAllConversations(tabActiva);
                        const convs = convResponse.data?.conversations || convResponse.conversations || convResponse.data || [];
                        setConversaciones(Array.isArray(convs) ? convs : []);
                    }

                    delete conversationCreationLock.current[lockKey];
                } else {
                    const response = await conversationService.getConversationById(paramConvId);
                    const conv = response.data?.conversation || response.conversation || response.data;
                    if (conv) {
                        setConversacionActual(conv);
                        loadMessages(paramConvId);
                    }
                }
            } catch (error) {
                logger.error('Error al cargar conversación:', error);
            } finally {
                setCargando(false);
            }
        };

        loadConversation();
    }, [paramConvId, userId, navigate, searchParams, tabActiva]);

    useEffect(() => {
        if (!userId) return;
        const socket = getSocket();
        if (!socket) return;

        const handleNewMessage = (message) => {
            logger.log('🔍 [DEBUG] newMessage recibido:', {
                messageId: message._id,
                conversationId: message.conversationId,
                timestamp: new Date().toISOString(),
                conversacionActualId: conversacionActual?._id,
                tabActiva
            });

            const fetchConvsIfNeeded = async () => {
                if (isFetching.current) {
                    logger.log('🔍 [DEBUG] Ya hay fetch en progreso, ignorando duplicado');
                    return;
                }

                isFetching.current = true;
                logger.log('🔍 [DEBUG] Iniciando fetch de conversaciones...');
                try {
                    const response = await conversationService.getAllConversations(tabActiva);
                    const convs = response.data?.conversations || response.conversations || response.data || [];
                    setConversaciones(Array.isArray(convs) ? convs : []);
                    logger.log('🔍 [DEBUG] Conversaciones actualizadas:', convs.length);
                } catch (error) {
                    logger.error('Error al actualizar conversaciones:', error);
                } finally {
                    isFetching.current = false;
                }
            };

            if (message.conversationId !== conversacionActual?._id) {
                logger.log('🔍 [DEBUG] Mensaje de otra conversación, recargando lista');
                fetchConvsIfNeeded();
            }

            if (conversacionActual && message.conversationId === conversacionActual._id) {
                logger.log('🔍 [DEBUG] Mensaje de conversación actual, agregando a lista');
                setMensajes(prev => {
                    // Si ya existe por clientMessageId (mensaje optimista), lo actualizamos con la data del server
                    if (message.clientMessageId && prev.some(m => m.clientMessageId === message.clientMessageId)) {
                        return prev.map(m => m.clientMessageId === message.clientMessageId ? message : m);
                    }
                    if (prev.some(m => m._id === message._id)) {
                        logger.log('🔍 [DEBUG] Mensaje duplicado detectado, ignorando');
                        return prev;
                    }
                    return [...prev, message];
                });
                scrollToBottom();

                // 🆕 Emitir ACK de entrega si el mensaje no es mío
                if (message.sender?._id !== userId && message.sender !== userId) {
                    socket.emit('message_delivered', {
                        conversationId: conversacionActual._id,
                        messageId: message._id
                    });
                    
                    // Si el chat está visible, también marcar como leído
                    if (document.visibilityState === 'visible') {
                        socket.emit('message_read', {
                            conversationId: conversacionActual._id,
                            messageId: message._id,
                            readerId: userId
                        });
                    }
                }
            }
        };

        const handleMessageStatusUpdate = (data) => {
            logger.log('🚚 [DEBUG] status_update recibido:', data);
            const { messageId, estado, fechaEntregado, fechaLeido } = data;
            setMensajes(prev => prev.map(msg => 
                msg._id === messageId ? { ...msg, estado, fechaEntregado, fechaLeido } : msg
            ));
        };

        const handleConversationRead = (data) => {
            logger.log('🔍 [DEBUG] conversationRead recibido:', data);
            const { conversationId } = data;

            // Actualizar el contador de no leídos en el estado local
            setConversaciones(prev => prev.map(c =>
                c._id === conversationId
                    ? {
                        ...c, mensajesNoLeidos: c.mensajesNoLeidos?.map(m =>
                            m.usuario?.toString() === userId?.toString() ? { ...m, cantidad: 0 } : m
                        )
                    }
                    : c
            ));
        };

        const handleMessagesReadUpdate = (data) => {
            logger.log('🔍 [DEBUG] messagesReadUpdate recibido:', data);
            if (conversacionActual && data.conversationId === conversacionActual._id) {
                setMensajes(prev => prev.map(msg => {
                    // Convertir a string para asegurar comparación
                    const senderId = msg.sender?._id?.toString() || msg.sender?.toString();
                    // Si yo soy el emisor, marcar como leído
                    if (senderId === userId) {
                        return { ...msg, leido: true, estado: 'leido', fechaLeido: data.readAt };
                    }
                    return msg;
                }));
            }
        };

        socket.on('newMessage', handleNewMessage);
        socket.on('message_status_update', handleMessageStatusUpdate);
        socket.on('conversationRead', handleConversationRead);
        socket.on('messages_read_update', handleMessagesReadUpdate);

        // Subscribe to conversation room
        if (conversacionActual?._id) {
            socket.emit('subscribeConversation', { conversationId: conversacionActual._id });
        }

        // Sincronizar cola offline al montar y al reconectar
        const processOfflineQueue = async () => {
            if (!navigator.onLine) return;
            const queue = JSON.parse(localStorage.getItem('chat_pending_queue') || '[]');
            if (queue.length === 0) return;

            logger.log('📡 [OFFLINE] Procesando cola de mensajes pendientes...');
            const newQueue = [];
            
            for (const msg of queue) {
                try {
                    // Update optimistically to 'sending' while processing
                    setMensajes(prev => prev.map(m => 
                        m.clientMessageId === msg.clientMessageId ? { ...m, estado: 'sending' } : m
                    ));

                    // Use raw axio/fetch or the service, but handle the response
                    let sentMessage = null;
                    if (msg.archivo && msg.archivo.nombre) {
                        // We do not currently re-upload files from queue easily if they are File objects 
                        // because File objects cannot be stored in LocalStorage.
                        // If it's a file, we might mark it as failed and ask for manual retry.
                        setMensajes(prev => prev.map(m => 
                            m.clientMessageId === msg.clientMessageId ? { ...m, estado: 'failed' } : m
                        ));
                        continue;
                    } else {
                        const response = await conversationService.sendMessage(msg.conversationId, msg.contenido, {
                            clientMessageId: msg.clientMessageId,
                            replyTo: msg.replyTo?._id
                        });
                        sentMessage = response.data?.data || response.data || response;
                    }

                    if (sentMessage) {
                        setMensajes(prev => prev.map(m => 
                            m.clientMessageId === msg.clientMessageId ? sentMessage : m
                        ));
                    }
                } catch (error) {
                    // Si es un error de red, mantener en cola. Si es un 4xx/5xx, fallar.
                    if (!error.response) {
                        newQueue.push(msg); // Error de red, mantener en cola
                        setMensajes(prev => prev.map(m => 
                            m.clientMessageId === msg.clientMessageId ? { ...m, estado: 'queued' } : m
                        ));
                    } else {
                        // Error definitivo del servidor
                        setMensajes(prev => prev.map(m => 
                            m.clientMessageId === msg.clientMessageId ? { ...m, estado: 'failed' } : m
                        ));
                    }
                }
            }
            localStorage.setItem('chat_pending_queue', JSON.stringify(newQueue));
        };

        window.addEventListener('online', processOfflineQueue);
        processOfflineQueue();

        return () => {
            socket.off('newMessage', handleNewMessage);
            socket.off('message_status_update', handleMessageStatusUpdate);
            socket.off('conversationRead', handleConversationRead);
            socket.off('messages_read_update', handleMessagesReadUpdate);
            window.removeEventListener('online', processOfflineQueue);
            if (conversacionActual?._id) {
                socket.emit('unsubscribeConversation', { conversationId: conversacionActual._id });
            }
        };
    }, [conversacionActual?._id, userId, tabActiva]);

    useEffect(() => {
        const handleClickOutside = () => {
            if (menuAbierto) {
                setMenuAbierto(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [menuAbierto]);

    const scrollToBottom = () => {
        mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 50 * 1024 * 1024) {
            setAlertConfig({ isOpen: true, variant: 'warning', message: 'El archivo es demasiado grande. Máximo 50MB' });
            return;
        }

        const allowedTypes = [
            // Imágenes
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
            // Videos
            'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/quicktime',
            // Audio
            'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a',
            // PDF
            'application/pdf',
            // Word
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            // Excel
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            // PowerPoint
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            // Texto
            'text/plain', 'text/csv'
        ];
        if (!allowedTypes.includes(file.type)) {
            setAlertConfig({ isOpen: true, variant: 'warning', message: 'Tipo de archivo no permitido. Se permiten: imágenes, videos, audio, PDF, Word, Excel, PowerPoint y archivos de texto' });
            return;
        }

        setArchivoSeleccionado(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setPrevisualizacionArchivo({
                url: e.target.result,
                tipo: file.type.startsWith('image/') ? 'imagen' : 'video',
                nombre: file.name
            });
        };
        reader.readAsDataURL(file);
    };

    const handleCancelarArchivo = () => {
        setArchivoSeleccionado(null);
        setPrevisualizacionArchivo(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleEmojiSelect = (emoji) => {
        setNuevoMensaje(prev => prev + emoji);
        setMostrarEmojiPicker(false);
    };

    const handleEnviarMensaje = async (e, existingMsg = null) => {
        if (e) e.preventDefault();
        
        // 🧠 FIXED FCM PUSH BUGS: Solicitar token si aún no tenemos permiso
        // El navegador solo mostrará el "Popup" nativo si se pide DENTRO de un evento de click del usuario.
        if ('Notification' in window && Notification.permission === 'default') {
            requestFirebaseToken(userId).catch(err => console.error('Error FCM post-click', err));
        }
        
        // Prevención estricta de doble-submit (race condition)
        if (isSendingMessageRef.current && !existingMsg) {
            logger.log('🔒 [DEDUP] Bloqueando doble envío accidental');
            return;
        }

        // Si no hay mensaje nuevo ni archivo ni mensaje existente, salir
        if (!existingMsg && (!nuevoMensaje.trim() && !archivoSeleccionado) || !conversacionActual) return;

        isSendingMessageRef.current = true;

        const clientMessageId = existingMsg ? existingMsg.clientMessageId : generateUUID();
        const contenido = existingMsg ? existingMsg.contenido : nuevoMensaje.trim();
        const attachments = existingMsg ? existingMsg.archivo : archivoSeleccionado;
        const replyingToMsg = existingMsg ? existingMsg.replyTo : replyingTo;

        // Mensaje optimista (o reutilizar el existente si es retry)
        const optimisticMessage = existingMsg || {
            clientMessageId,
            conversationId: conversacionActual._id,
            sender: { _id: userId, nombres: user.nombres, apellidos: user.apellidos },
            contenido: contenido || (attachments ? 'Archivo adjunto' : ''),
            tipo: attachments ? 
                  (attachments.type?.startsWith('image/') || attachments.tipo?.startsWith('image') ? 'imagen' : 
                   attachments.type?.startsWith('video/') || attachments.tipo?.startsWith('video') ? 'video' : 'archivo') : 'texto',
            estado: 'sending',
            createdAt: new Date().toISOString(),
            replyTo: replyingToMsg
        };

        // Si es mensaje nuevo, agregar a la lista
        if (!existingMsg) {
            setMensajes(prev => [...prev, optimisticMessage]);
            setNuevoMensaje('');
            setReplyingTo(null);
            scrollToBottom();
        } else {
            // Si es retry, asegurar que el estado visual vuelva a 'sending'
            setMensajes(prev => prev.map(m => m.clientMessageId === clientMessageId ? { ...m, estado: 'sending' } : m));
        }

        // 🧠 MEJORA DE RESILIENCIA: Guardar en cola local ANTES de enviar 
        const isFile = !!attachments;
        if (!isFile) {
            saveToOfflineQueue(optimisticMessage);
        }

        // Si no hay internet, no intentar la petición, dejar en 'queued' si es texto, 'failed' si es archivo
        if (!navigator.onLine) {
            setMensajes(prev => prev.map(m => 
                m.clientMessageId === clientMessageId ? { ...m, estado: isFile ? 'failed' : 'queued' } : m
            ));
            return;
        }

        try {
            let sentMessage = null;

            if (attachments && !existingMsg) { 
                const formData = new FormData();
                formData.append('contenido', contenido || 'Archivo adjunto');
                formData.append('attachments', attachments);
                formData.append('clientMessageId', clientMessageId);
                if (replyingToMsg) formData.append('replyTo', replyingToMsg._id);
                
                const token = localStorage.getItem('token');
                const response = await api.post(`/conversaciones/${conversacionActual._id}/message`, formData, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                sentMessage = response.data.data || response.data;
                handleCancelarArchivo();
            } else {
                const response = await conversationService.sendMessage(conversacionActual._id, contenido, {
                    clientMessageId,
                    replyTo: replyingToMsg?._id
                });
                sentMessage = response.data.data || response.data || response;
            }

            // Actualizar el mensaje optimista con el del servidor
            if (sentMessage) {
                setMensajes(prev => prev.map(m => 
                    m.clientMessageId === clientMessageId ? sentMessage : m
                ));
                // Eliminar de la cola local al tener éxito
                if (!isFile) {
                    removeFromOfflineQueue(clientMessageId);
                }
            }
        } catch (error) {
            logger.error('Error al enviar mensaje:', error);
            // Marcar como failed o queued dependiendo si es error de red
            const isNetworkError = !error.response;
            
            setMensajes(prev => prev.map(m => 
                m.clientMessageId === clientMessageId ? { ...m, estado: (isNetworkError && !isFile) ? 'queued' : 'failed' } : m
            ));
            
            if (!isNetworkError || isFile) {
                removeFromOfflineQueue(clientMessageId);
            }
        } finally {
            // Liberar el lock después de un pequeño delay para permitir envíos rápidos pero evitar doble-clicks en ms
            setTimeout(() => {
                isSendingMessageRef.current = false;
            }, 150);
        }
    };

    const saveToOfflineQueue = (msg) => {
        const queue = JSON.parse(localStorage.getItem('chat_pending_queue') || '[]');
        if (!queue.some(m => m.clientMessageId === msg.clientMessageId)) {
            queue.push(msg);
            localStorage.setItem('chat_pending_queue', JSON.stringify(queue));
        }
    };

    const removeFromOfflineQueue = (clientMessageId) => {
        const queue = JSON.parse(localStorage.getItem('chat_pending_queue') || '[]');
        const filtered = queue.filter(m => m.clientMessageId !== clientMessageId);
        localStorage.setItem('chat_pending_queue', JSON.stringify(filtered));
    };

    const retryMessage = async (msg) => {
        handleEnviarMensaje(null, msg); 
    };

    const handleSeleccionarConversacion = (conv) => {
        navigate(`/mensajes/${conv._id}`);
    };

    const buscarUsuarios = async (query) => {
        if (!query || query.length < 2) {
            setResultadosBusqueda([]);
            return;
        }
        setCargandoBusqueda(true);
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`/buscar?q=${encodeURIComponent(query)}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResultadosBusqueda(response.data?.resultados?.usuarios || []);
        } catch (error) {
            logger.error('Error al buscar usuarios:', error);
            setResultadosBusqueda([]);
        } finally {
            setCargandoBusqueda(false);
        }
    };

    const handleBusquedaGlobal = (e) => {
        const value = e.target.value;
        setBusquedaGlobal(value);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (value.length >= 2) {
            timeoutRef.current = setTimeout(() => buscarUsuarios(value), 300);
        } else {
            setResultadosBusqueda([]);
        }
    };

    const seleccionarUsuarioBusqueda = (usuario) => {
        navigate(`/mensajes/user:${usuario._id}`);
        setMostrarBuscador(false);
        setBusquedaGlobal('');
        setResultadosBusqueda([]);
    };

    const handleEliminarChat = async (conversationId) => {
        // Confirmación delegada a la UI (ConfirmDialog)
        try {
            await conversationService.deleteConversation(conversationId);
            setConversaciones(prev => prev.filter(conv => conv._id !== conversationId));
            if (conversacionActual?._id === conversationId) {
                navigate('/mensajes');
                setConversacionActual(null);
                setMensajes([]);
            }
            setMenuAbierto(null);
        } catch (error) {
            logger.error('Error al eliminar conversación:', error);
            setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al eliminar la conversación' });
        }
    };

    const handleArchivarChat = async (conversationId) => {
        try {
            await conversationService.archiveConversation(conversationId);
            if (conversacionActual?._id === conversationId) {
                navigate('/mensajes');
                setConversacionActual(null);
                setMensajes([]);
            }
            const response = await conversationService.getAllConversations(tabActiva);
            setConversaciones(Array.isArray(response.data?.conversations) ? response.data.conversations : []);
            setMenuAbierto(null);
        } catch (error) {
            logger.error('Error al archivar conversación:', error);
            setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al archivar la conversación' });
        }
    };

    const handleVaciarConversacion = async (conversationId) => {
        // Confirmación delegada a la UI (ConfirmDialog)
        try {
            await conversationService.clearConversation(conversationId);
            if (conversacionActual?._id === conversationId) {
                setMensajes([]);
            }
            setConversaciones(prev => prev.map(conv =>
                conv._id === conversationId ? { ...conv, ultimoMensaje: null, mensajes: [] } : conv
            ));
            setMenuAbierto(null);
        } catch (error) {
            logger.error('Error al vaciar conversación:', error);
            setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al vaciar la conversación' });
        }
    };

    const handleAceptarSolicitud = async (conversationId) => {
        try {
            await conversationService.acceptMessageRequest(conversationId);
            setConversaciones(prev => prev.filter(conv => conv._id !== conversationId));
            if (conversacionActual?._id === conversationId) {
                navigate('/mensajes');
                setConversacionActual(null);
                setMensajes([]);
            }
            const response = await conversationService.getAllConversations(tabActiva);
            setConversaciones(Array.isArray(response.data?.conversations) ? response.data.conversations : []);
            // Actualizar contador de pendientes inmediatamente
            if (refreshPendingCount) {
                refreshPendingCount();
            }
        } catch (error) {
            logger.error('Error al aceptar solicitud:', error);
            setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al aceptar la solicitud' });
        }
    };

    const handleRechazarSolicitud = async (conversationId) => {
        // Confirmación delegada a la UI (ConfirmDialog)
        try {
            await conversationService.declineMessageRequest(conversationId);
            setConversaciones(prev => prev.filter(conv => conv._id !== conversationId));
            if (conversacionActual?._id === conversationId) {
                navigate('/mensajes');
                setConversacionActual(null);
                setMensajes([]);
            }
            // Actualizar contador de pendientes inmediatamente
            if (refreshPendingCount) {
                refreshPendingCount();
            }
        } catch (error) {
            logger.error('Error al rechazar solicitud:', error);
            setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al rechazar la solicitud' });
        }
    };

    const handleDestacarChat = async (conversationId) => {
        try {
            await conversationService.starConversation(conversationId);
            setConversaciones(prev => prev.map(conv => {
                if (conv._id === conversationId) {
                    const isStarred = conv.starredBy?.some(id => id === userId);
                    return {
                        ...conv,
                        starredBy: isStarred ? conv.starredBy.filter(id => id !== userId) : [...(conv.starredBy || []), userId]
                    };
                }
                return conv;
            }));
            setMenuAbierto(null);
        } catch (error) {
            logger.error('Error al destacar conversación:', error);
            setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al destacar la conversación' });
        }
    };

    // ========================================
    // Handler para cerrar chat (botón atrás móvil)
    // ========================================
    const handleCerrarChat = () => {
        setConversacionActual(null);
        setMensajes([]);
        navigate('/mensajes');
    };

    return {
        conversaciones,
        conversacionActual,
        mensajes,
        nuevoMensaje,
        setNuevoMensaje,
        mostrarBuscador,
        setMostrarBuscador,
        cargando,
        cargandoConversaciones,
        busquedaGlobal,
        resultadosBusqueda,
        cargandoBusqueda,
        menuAbierto,
        setMenuAbierto,
        tabActiva,
        setTabActiva,
        pendingCount,
        filtroActivo,
        setFiltroActivo,
        mostrarEmojiPicker,
        setMostrarEmojiPicker,
        archivoSeleccionado,
        setArchivoSeleccionado,
        previsualizacionArchivo,
        setPrevisualizacionArchivo,
        handleCerrarChat,
        handleLoadMore,
        pagination,
        replyingTo,
        setReplyingTo,
        retryMessage,
        // Restored missing:
        mensajesEndRef,
        fileInputRef,
        handleBusquedaGlobal,
        seleccionarUsuarioBusqueda,
        handleSeleccionarConversacion,
        handleAceptarSolicitud,
        handleRechazarSolicitud,
        handleDestacarChat,
        handleEliminarChat,
        handleArchivarChat,
        handleVaciarConversacion,
        handleFileSelect,
        handleCancelarArchivo,
        handleEmojiSelect,
        handleEnviarMensaje,
        getOtroParticipante,
        getUnreadCount,
        formatearTiempo,
        userId,
        navigate,
        alertConfig,
        setAlertConfig
    };
};
