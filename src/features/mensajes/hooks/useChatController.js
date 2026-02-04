import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { logger } from '../../../shared/utils/logger';
import { getSocket } from '../../../shared/lib/socket';
import conversationService from '../../../api/conversationService';
import { usePendingMessageCounter } from '../../../hooks/usePendingMessageCounter';
import api from '../../../api/config';

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
    const mensajesEndRef = useRef(null);
    const timeoutRef = useRef(null);
    const fileInputRef = useRef(null);
    const isFetching = useRef(false); // Flag para evitar fetches concurrentes
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

    const loadMessages = async (conversationId) => {
        try {
            const response = await conversationService.getConversationById(conversationId);
            const conv = response.data?.conversation || response.conversation || response.data;
            const msgs = conv?.mensajes || [];
            setMensajes(Array.isArray(msgs) ? msgs : []);

            // Reset optimista del contador de no leídos (UX inmediata)
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
        } catch (error) {
            logger.error('Error al cargar mensajes:', error);
            setMensajes([]);
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
                    if (prev.some(m => m._id === message._id)) {
                        logger.log('🔍 [DEBUG] Mensaje duplicado detectado, ignorando');
                        return prev;
                    }
                    return [...prev, message];
                });
                scrollToBottom();
                if (message.emisor?._id !== userId && message.emisor !== userId) {
                    // 🆕 Emitir evento socket 'message_read' inmediatamente para actualización en tiempo real (ticks azules)
                    // en lugar de llamada REST lenta
                    socket.emit('message_read', {
                        conversationId: conversacionActual._id,
                        readerId: userId
                    });
                }
            }
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
                    const emisorId = msg.emisor?._id?.toString() || msg.emisor?.toString();
                    // Si yo soy el emisor, marcar como leído
                    if (emisorId === userId) {
                        return { ...msg, leido: true, estado: 'leido', fechaLeido: data.readAt };
                    }
                    return msg;
                }));
            }
        };

        socket.on('newMessage', handleNewMessage);
        socket.on('conversationRead', handleConversationRead);
        socket.on('messages_read_update', handleMessagesReadUpdate);

        // Subscribe to conversation room
        if (conversacionActual?._id) {
            socket.emit('subscribeConversation', { conversationId: conversacionActual._id });
        }

        return () => {
            socket.off('newMessage', handleNewMessage);
            socket.off('conversationRead', handleConversationRead);
            socket.off('messages_read_update', handleMessagesReadUpdate);
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

    const handleEnviarMensaje = async (e) => {
        e.preventDefault();
        if ((!nuevoMensaje.trim() && !archivoSeleccionado) || !conversacionActual) return;

        try {
            const mensaje = nuevoMensaje.trim();
            let sentMessage = null;

            if (archivoSeleccionado) {
                const formData = new FormData();
                formData.append('contenido', mensaje || 'Archivo adjunto');
                formData.append('attachments', archivoSeleccionado);
                const token = localStorage.getItem('token');
                const response = await api.post(`/conversaciones/${conversacionActual._id}/message`, formData, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                sentMessage = response.data.data || response.data; // Capture response for file
                handleCancelarArchivo();
            } else {
                const response = await conversationService.sendMessage(conversacionActual._id, mensaje);
                sentMessage = response.data.data || response.data || response; // Capture response for text
            }

            // Immediately update state with the sent message
            if (sentMessage) {
                setMensajes(prev => {
                    if (prev.some(m => m._id === sentMessage._id)) return prev;
                    return [...prev, sentMessage];
                });
                scrollToBottom();
            }

            setNuevoMensaje('');
            setConversaciones(prev =>
                prev.map(conv =>
                    conv._id === conversacionActual._id
                        ? { ...conv, ultimoMensaje: { contenido: mensaje || 'Archivo adjunto', fecha: new Date() } }
                        : conv
                )
            );
        } catch (error) {
            logger.error('Error al enviar mensaje:', error);
            setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al enviar el mensaje' });
        }
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
        if (!confirm('¿Estás seguro de que quieres eliminar esta conversación?')) return;
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
        if (!confirm('¿Estás seguro de que quieres eliminar todos los mensajes de esta conversación?')) return;
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
        if (!confirm('¿Estás seguro de que quieres rechazar esta solicitud?')) return;
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
        setAlertConfig,
        handleCerrarChat, // Nuevo handler para botón atrás móvil
    };
};
