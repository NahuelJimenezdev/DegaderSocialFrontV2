import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import groupService from '../../../api/groupService';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';

// URL base para archivos estáticos (sin /api)
const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  return apiUrl.replace('/api', '');
};

// Obtener URL completa para un attachment (maneja URLs blob y URLs relativas)
const getAttachmentUrl = (url) => {
  if (!url) return '';
  // Si ya es una URL completa (blob, http, https), devolverla tal cual
  if (url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Si es una URL relativa, agregar el base URL
  return `${getBaseUrl()}${url}`;
};

// Obtener información del archivo según su extensión para mostrar preview estilo WhatsApp
const getFileInfo = (fileName) => {
  if (!fileName) return { icon: 'description', color: 'bg-gray-500', label: 'Archivo' };

  const ext = fileName.split('.').pop()?.toLowerCase();

  const fileTypes = {
    // PDFs
    pdf: { icon: 'picture_as_pdf', color: 'bg-red-600', label: 'PDF' },
    // Word
    doc: { icon: 'description', color: 'bg-blue-600', label: 'Word' },
    docx: { icon: 'description', color: 'bg-blue-600', label: 'Word' },
    // Excel
    xls: { icon: 'table_chart', color: 'bg-green-600', label: 'Excel' },
    xlsx: { icon: 'table_chart', color: 'bg-green-600', label: 'Excel' },
    csv: { icon: 'table_chart', color: 'bg-green-600', label: 'CSV' },
    // PowerPoint
    ppt: { icon: 'slideshow', color: 'bg-orange-600', label: 'PowerPoint' },
    pptx: { icon: 'slideshow', color: 'bg-orange-600', label: 'PowerPoint' },
    // Texto
    txt: { icon: 'article', color: 'bg-gray-600', label: 'Texto' },
    rtf: { icon: 'article', color: 'bg-gray-600', label: 'RTF' },
    // Código
    js: { icon: 'code', color: 'bg-yellow-600', label: 'JavaScript' },
    ts: { icon: 'code', color: 'bg-blue-500', label: 'TypeScript' },
    html: { icon: 'code', color: 'bg-orange-500', label: 'HTML' },
    css: { icon: 'code', color: 'bg-purple-500', label: 'CSS' },
    json: { icon: 'data_object', color: 'bg-gray-700', label: 'JSON' },
    // Comprimidos
    zip: { icon: 'folder_zip', color: 'bg-yellow-700', label: 'ZIP' },
    rar: { icon: 'folder_zip', color: 'bg-purple-700', label: 'RAR' },
    '7z': { icon: 'folder_zip', color: 'bg-gray-700', label: '7Z' },
  };

  return fileTypes[ext] || { icon: 'description', color: 'bg-gray-500', label: ext?.toUpperCase() || 'Archivo' };
};

// Formatear tamaño de archivo
const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Agrupa las reacciones por emoji y cuenta cuántos usuarios reaccionaron con cada emoji
 * Backend: [{ usuario: {...}, emoji: '👍' }, { usuario: {...}, emoji: '👍' }]
 * Frontend: [{ emoji: '👍', count: 2, users: [...] }]
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
 * Transforma un mensaje del backend para asegurar que las reacciones estén agrupadas
 */
const transformMessage = (msg) => {
  return {
    ...msg,
    reactions: groupReactions(msg.reactions)
  };
};

const GroupChat = ({ groupData, refetch, user, userRole, isAdmin, isOwner, targetMessageId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Estados para funcionalidades del chat
  const [replyTo, setReplyTo] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null); // messageId para mostrar picker
  const [editingMessage, setEditingMessage] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const socketRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);

  // Scroll to target message
  useEffect(() => {
    if (targetMessageId && messages.length > 0) {
      // Esperar un poco para asegurar que el renderizado esté completo
      setTimeout(() => {
        const element = document.getElementById(`message-${targetMessageId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Highlight effect
          element.classList.add('ring-2', 'ring-yellow-400', 'ring-offset-2', 'dark:ring-offset-gray-900');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-yellow-400', 'ring-offset-2', 'dark:ring-offset-gray-900');
          }, 3000);
        }
      }, 100);
    }
  }, [targetMessageId, messages]);

  // Cargar mensajes
  useEffect(() => {
    const loadMessages = async () => {
      try {
        console.log('📥 [LOAD] Cargando mensajes del grupo:', groupData._id);
        setLoading(true);
        // Si hay un targetMessageId, podríamos necesitar cargar mensajes antiguos alrededor de ese ID
        // Por ahora asumimos que está en los últimos 50 o implementamos paginación después
        const data = await groupService.getMessages(groupData._id);
        console.log('📥 [LOAD] Mensajes recibidos del servidor:', data?.length || 0);
        // Transformar mensajes para agrupar reacciones
        const transformedMessages = Array.isArray(data) ? data.map(transformMessage) : [];
        console.log('📥 [LOAD] Mensajes transformados:', transformedMessages.length);
        console.log('📥 [LOAD] IDs de mensajes cargados:', transformedMessages.map(m => m._id));
        setMessages(transformedMessages);
        prevMessagesLengthRef.current = transformedMessages.length;
      } catch (err) {
        console.error('❌ [LOAD] Error loading messages:', err);
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
      console.warn('⚠️ [SOCKET] No se puede conectar - falta groupData o user');
      return;
    }

    console.log('═══════════════════════════════════════════');
    console.log('🔌 [SOCKET] Iniciando conexión Socket.IO');
    console.log('🔌 [SOCKET] Grupo ID:', groupData._id);
    console.log('🔌 [SOCKET] Usuario ID:', user._id);
    console.log('═══════════════════════════════════════════');

    // Conectar al socket - IMPORTANTE: Socket.IO se conecta a la raíz del servidor, no a /api
    const socketUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace('/api', '')
      : 'http://localhost:3001';

    console.log('🔌 [SOCKET] URL de Socket.IO:', socketUrl);

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
      console.log('🔌 [SOCKET] ✅ Autenticado correctamente');
      // Una vez autenticado, suscribirse al grupo
      socket.emit('subscribeGroup', { groupId: groupData._id });
      console.log('🔔 [SOCKET] Solicitando suscripción al grupo:', groupData._id);
    });

    socket.on('subscribedToGroup', ({ groupId }) => {
      console.log('✅ [SOCKET] ✅ Confirmación: Suscrito al grupo:', groupId);
      console.log('✅ [SOCKET] Ahora escuchando eventos de este grupo en tiempo real');
    });

    // Escuchar nuevos mensajes del grupo
    socket.on('newGroupMessage', (newMessage) => {
      console.log('📨 Nuevo mensaje recibido vía Socket.IO:', newMessage);
      const transformedNewMessage = transformMessage(newMessage);
      setMessages((prev) => {
        // Evitar duplicados - verificar si el mensaje ya existe por ID
        const existsById = prev.some(msg => msg._id === transformedNewMessage._id);
        if (existsById) {
          console.log('⚠️ Mensaje duplicado ignorado (mismo ID):', transformedNewMessage._id);
          return prev;
        }

        // Si es mi propio mensaje, verificar si ya existe como optimista o si ya fue procesado
        const isMyMessage = String(transformedNewMessage.author?._id) === String(user._id);
        if (isMyMessage) {
          // Buscar mensaje optimista pendiente O mensaje ya reemplazado con mismo clientTempId
          const hasOptimisticOrRecent = prev.some(msg =>
            // Es un mensaje optimista mío
            (msg.isOptimistic && String(msg.author?._id) === String(user._id)) ||
            // O es un mensaje reciente mío con attachments (posible duplicado de imagen)
            (msg.attachments?.length > 0 &&
             String(msg.author?._id) === String(user._id) &&
             Math.abs(new Date(msg.createdAt) - new Date(transformedNewMessage.createdAt)) < 5000)
          );

          if (hasOptimisticOrRecent) {
            console.log('⚠️ Ignorando mensaje propio - ya existe como optimista o reciente');
            return prev;
          }
        }

        console.log('✅ Añadiendo nuevo mensaje a la lista');
        const newMessages = [...prev, transformedNewMessage];
        prevMessagesLengthRef.current = newMessages.length;
        return newMessages;
      });
      // Solo scroll si NO estamos viendo un mensaje específico antiguo
      if (!targetMessageId) {
        scrollToBottom();
      }
    });

    // Escuchar mensajes eliminados en tiempo real
    socket.on('messageDeleted', ({ groupId, messageId }) => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🗑️ [SOCKET] ✅ Evento messageDeleted recibido!');
      console.log('🗑️ [SOCKET] Group ID:', groupId);
      console.log('🗑️ [SOCKET] Message ID a eliminar:', messageId);
      console.log('🗑️ [SOCKET] Grupo actual:', groupData._id);
      console.log('🗑️ [SOCKET] ¿Es el mismo grupo?', String(groupId) === String(groupData._id));

      setMessages((prev) => {
        console.log('🗑️ [SOCKET] Mensajes antes de filtrar:', prev.length);
        console.log('🗑️ [SOCKET] IDs de mensajes actuales:', prev.map(m => m._id));
        console.log('🗑️ [SOCKET] Buscando mensaje con ID:', messageId);

        const messageExists = prev.find(m => m._id === messageId);
        console.log('🗑️ [SOCKET] ¿Mensaje existe?', !!messageExists);
        if (messageExists) {
          console.log('🗑️ [SOCKET] Mensaje encontrado:', messageExists);
        }

        const filtered = prev.filter((msg) => msg._id !== messageId);
        console.log('🗑️ [SOCKET] Mensajes después de filtrar:', filtered.length);
        console.log('🗑️ [SOCKET] ✅ Mensaje eliminado. Antes:', prev.length, 'Después:', filtered.length);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        prevMessagesLengthRef.current = filtered.length;
        return filtered;
      });
    });

    // Escuchar actualizaciones de reacciones en tiempo real
    socket.on('messageReactionUpdated', ({ groupId, messageId, message: updatedMessage }) => {
      console.log('😀 Evento messageReactionUpdated recibido:', { groupId, messageId });
      if (updatedMessage) {
        setMessages((prev) => {
          const updated = prev.map((msg) => {
            if (msg._id === messageId) {
              // Solo actualizar las reacciones, mantener el resto del mensaje original
              // Esto evita perder la información del autor y mover el mensaje de lado
              return {
                ...msg,
                reactions: groupReactions(updatedMessage.reactions)
              };
            }
            return msg;
          });
          console.log('😀 Mensaje actualizado con nuevas reacciones');
          return updated;
        });
      }
    });

    socket.on('connect', () => {
      console.log('🔌 [SOCKET] ✅ Conectado! Socket ID:', socket.id);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ [SOCKET] Error de conexión:', error);
      console.error('❌ [SOCKET] URL intentada:', socketUrl);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 [SOCKET] Desconectado. Razón:', reason);
    });

    return () => {
      console.log('🔌 Limpiando conexión Socket.IO');
      socket.emit('unsubscribeGroup', { groupId: groupData._id });
      socket.disconnect();
    };
  }, [groupData?._id, user?._id]); // IMPORTANTE: Incluir user en dependencias

  // Auto-scroll al final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Solo scroll al fondo si:
    // 1. NO hay un targetMessageId (no estamos navegando a un mensaje específico)
    // 2. El número de mensajes aumentó (nuevo mensaje, no actualización)
    if (!targetMessageId && messages.length > prevMessagesLengthRef.current) {
      scrollToBottom();
      prevMessagesLengthRef.current = messages.length;
    }
  }, [messages, targetMessageId]);

  // Enviar mensaje
  const handleSendMessage = async () => {
    if (!message.trim() && selectedFiles.length === 0) return;

    const tempId = `optimistic_${Date.now()}`;
    const messageText = message.trim();
    const filesToSend = [...selectedFiles];
    const replyToMsg = replyTo;

    // Crear mensaje optimista - MOSTRAR INMEDIATAMENTE
    // Preparar attachments para el UI mientras se sube
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

    // Agregar mensaje optimista al UI INMEDIATAMENTE
    setMessages((prev) => [...prev, optimisticMessage]);

    // Limpiar input INMEDIATAMENTE para mejor UX
    setMessage('');
    setSelectedFiles([]);
    setReplyTo(null);

    // DESPUÉS enviar al servidor en background
    try {
      let sentMessage;

      if (filesToSend.length > 0) {
        // Mensaje con archivos
        sentMessage = await groupService.sendMessageWithFiles(groupData._id, {
          content: messageText,
          replyTo: replyToMsg?._id,
          files: filesToSend,
          clientTempId: tempId,
        });
      } else {
        // Mensaje de texto
        sentMessage = await groupService.sendMessage(groupData._id, {
          content: messageText,
          replyTo: replyToMsg?._id,
          clientTempId: tempId,
        });
      }

      // Reemplazar mensaje optimista con el real
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
      console.error('Error sending message:', err);

      // Marcar mensaje como error (NO eliminarlo)
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId
            ? { ...msg, isOptimistic: false, error: true }
            : msg
        )
      );

      alert('Error al enviar el mensaje');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Seleccionar archivos
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  // Eliminar mensaje
  const handleDeleteMessage = async (messageId) => {
    console.log('🗑️ [DELETE] Iniciando eliminación de mensaje:', messageId);
    console.log('🗑️ [DELETE] Grupo ID:', groupData._id);
    console.log('🗑️ [DELETE] Mensajes actuales antes de eliminar:', messages.length);

    if (!window.confirm('¿Eliminar este mensaje?')) {
      console.log('🗑️ [DELETE] Usuario canceló la eliminación');
      return;
    }

    console.log('🗑️ [DELETE] Usuario confirmó la eliminación');

    try {
      console.log('🗑️ [DELETE] Llamando a groupService.deleteMessage...');
      const response = await groupService.deleteMessage(groupData._id, messageId);
      console.log('🗑️ [DELETE] Respuesta del servidor:', response);
      console.log('🗑️ [DELETE] Esperando evento Socket.IO messageDeleted...');
      // El mensaje se eliminará por WebSocket
    } catch (err) {
      console.error('🗑️ [DELETE] ❌ Error al eliminar mensaje:', err);
      console.error('🗑️ [DELETE] ❌ Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      alert('Error al eliminar el mensaje');
    }
  };

  // Reaccionar a mensaje
  const handleReaction = async (messageId, emoji) => {
    try {
      await groupService.reactToMessage(groupData._id, messageId, emoji);
      setShowEmojiPicker(null);
      // La reacción se actualizará por WebSocket
    } catch (err) {
      console.error('Error reacting to message:', err);
      alert('Error al reaccionar');
    }
  };

  // Toggle star (personal - solo para el usuario actual)
  const handleToggleStar = async (messageId) => {
    try {
      // Optimistic UI - alternar inmediatamente
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

      // Hacer la petición al servidor
      const response = await groupService.toggleStar(groupData._id, messageId);
      const updatedMessage = response.data || response;

      // Actualizar SOLO el campo starredBy con la respuesta del servidor
      // NO reemplazar todo el mensaje para evitar perder attachments y otros datos
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId 
            ? { ...msg, starredBy: updatedMessage.starredBy, isOptimistic: false } 
            : msg
        )
      );

      console.log('⭐ Destacado actualizado:', messageId);
    } catch (err) {
      console.error('Error toggling star:', err);

      // Revertir el cambio optimista en caso de error
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

      alert('Error al destacar el mensaje');
    }
  };

  // Emojis comunes
  const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🎉', '🔥'];

  // Formatear fecha
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'ahora';
  };

  // Verificar si el usuario puede eliminar el mensaje
  const canDeleteMessage = (msg) => {
    if (!user) return false;
    const isAuthor = String(msg.author?._id) === String(user._id);
    return isAuthor || isAdmin || isOwner;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1F2937]">
      {/* Header - Estilo Instagram minimalista */}
      <div className="flex justify-between items-center px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-2xl sm:text-3xl text-primary">forum</span>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Chat del Grupo</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">{messages.length} mensajes</p>
          </div>
        </div>
      </div>

      {/* Área de mensajes - Fondo limpio */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6 bg-gray-50 dark:bg-[#0a0e27] scrollbar-thin">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-600">
                chat_bubble
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              No hay mensajes aún
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              ¡Sé el primero en escribir!
            </p>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((msg) => {
              const isMyMessage = String(msg.author?._id) === String(user?._id);
              const senderName = msg.author
                ? `${msg.author.nombre || ''} ${msg.author.apellido || ''}`.trim()
                : 'Usuario';
              const senderAvatar = msg.author?.avatar;

              return (
                <div
                  key={msg._id}
                  id={`message-${msg._id}`}
                  className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} group`}
                >
                  <div className={`flex gap-2 sm:gap-3 max-w-[95%] sm:max-w-[85%] md:max-w-[75%] ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar - Más grande y prominente tipo Instagram */}
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 overflow-hidden flex-shrink-0 ring-2 ring-white dark:ring-gray-800 shadow-sm">
                        <img
                          src={getUserAvatar(msg.author)}
                          alt={senderName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/avatars/default-avatar.png';
                          }}
                        />
                      </div>

                    {/* Contenedor del mensaje */}
                    <div className={`flex flex-col gap-1 ${isMyMessage ? 'items-end' : 'items-start'}`}>
                      {/* Nombre del remitente - Siempre visible, más elegante */}
                      <div className={`flex items-center gap-2 px-1 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                          {isMyMessage ? 'Tú' : senderName}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>

                      {/* Reply To - Más compacto estilo WhatsApp */}
                      {msg.replyTo && (
                        <div className={`text-xs rounded-lg p-2 mb-1.5 max-w-[90%] sm:max-w-sm border-l-[3px] ${
                          isMyMessage
                            ? 'bg-primary/10 border-primary'
                            : 'bg-gray-100 dark:bg-gray-800 border-gray-400 dark:border-gray-600'
                        }`}>
                          <div className="flex items-start gap-1.5">
                            <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-[14px] flex-shrink-0 mt-0.5">reply</span>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-gray-700 dark:text-gray-300 text-[11px] mb-0.5 truncate">
                                {msg.replyTo.author
                                  ? `${msg.replyTo.author.nombre || ''} ${msg.replyTo.author.apellido || ''}`.trim()
                                  : 'Usuario'}
                              </p>
                              <p className="text-gray-600 dark:text-gray-400 text-[11px] truncate leading-tight">
                                {msg.replyTo.content || '📎 Archivo adjunto'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Contenido del mensaje - Bordes más redondeados estilo Instagram */}
                      <div
                        className={`rounded-3xl px-4 py-2.5 shadow-sm ${
                          isMyMessage
                            ? 'bg-primary text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                        } ${msg.error ? 'border-2 border-red-500' : ''}`}
                        style={{
                          opacity: msg.isOptimistic ? 0.6 : 1,
                          transition: 'opacity 0.3s ease'
                        }}
                      >
                        {msg.content && (
                          <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                            {msg.content}
                          </p>
                        )}
                        {msg.error && (
                          <p className="text-xs text-red-500 mt-1">
                            ✗ Error al enviar
                          </p>
                        )}

                        {/* Attachments - Mejorado */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className={`${msg.content ? 'mt-3' : ''} space-y-2`}>
                            {msg.attachments.map((att, idx) => (
                              <div key={`${msg._id}-att-${idx}-${att.name || ''}`}>
                                {att.type === 'image' && (
                                  <img
                                    src={getAttachmentUrl(att.url)}
                                    alt={att.name || 'Imagen'}
                                    className="max-w-[240px] sm:max-w-xs rounded-2xl cursor-pointer hover:opacity-95 transition-opacity shadow-md w-full h-auto"
                                    onClick={() => window.open(getAttachmentUrl(att.url), '_blank')}
                                  />
                                )}
                                {att.type === 'video' && (
                                  <video
                                    src={getAttachmentUrl(att.url)}
                                    controls
                                    className="max-w-[240px] sm:max-w-xs rounded-2xl shadow-md w-full"
                                  />
                                )}
                                {att.type === 'audio' && (
                                  <audio
                                    src={getAttachmentUrl(att.url)}
                                    controls
                                    className="max-w-xs"
                                  />
                                )}
                                {att.type === 'file' && (() => {
                                  const fileInfo = getFileInfo(att.name);
                                  return (
                                    <a
                                      href={getAttachmentUrl(att.url)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl w-full max-w-[240px] sm:max-w-[280px] transition-all hover:opacity-90 ${
                                        isMyMessage
                                          ? 'bg-white/10 hover:bg-white/20'
                                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                      }`}
                                    >
                                      {/* Icono del tipo de archivo */}
                                      <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 ${fileInfo.color} rounded-lg flex items-center justify-center shadow-sm`}>
                                        <span className="material-symbols-outlined text-white text-xl sm:text-2xl">{fileInfo.icon}</span>
                                      </div>
                                      {/* Info del archivo */}
                                      <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${
                                          isMyMessage ? 'text-white' : 'text-gray-900 dark:text-white'
                                        }`}>
                                          {att.name || 'Archivo'}
                                        </p>
                                        <p className={`text-xs mt-0.5 ${
                                          isMyMessage ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                                        }`}>
                                          {formatFileSize(att.size)} {att.size ? '•' : ''} {fileInfo.label}
                                        </p>
                                      </div>
                                      {/* Icono de descarga */}
                                      <div className={`flex-shrink-0 ${
                                        isMyMessage ? 'text-white/70' : 'text-gray-400 dark:text-gray-500'
                                      }`}>
                                        <span className="material-symbols-outlined text-xl">download</span>
                                      </div>
                                    </a>
                                  );
                                })()}
                                {att.type === 'link' && (
                                  <a
                                    href={att.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 text-sm font-medium ${
                                      isMyMessage ? 'text-white/90 hover:text-white' : 'text-primary hover:text-primary/80'
                                    } transition-colors`}
                                  >
                                    <span className="material-symbols-outlined text-lg">link</span>
                                    {att.title || att.url}
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Reacciones - Estilo más limpio */}
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className={`flex gap-1.5 mt-1 flex-wrap ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                          {msg.reactions.map((reaction, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleReaction(msg._id, reaction.emoji)}
                              className="flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium hover:border-primary hover:shadow-sm transition-all"
                              title={reaction.users?.map((u) => `${u.nombre} ${u.apellido}`).join(', ')}
                            >
                              <span className="text-base">{reaction.emoji}</span>
                              <span className="text-gray-700 dark:text-gray-300">{reaction.count || reaction.users?.length || 0}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Acciones del mensaje - Más discretas y elegantes */}
                      <div className={`opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-0.5 mt-1 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Reply */}
                        <button
                          onClick={() => setReplyTo(msg)}
                          className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                          title="Responder"
                        >
                          <span className="material-symbols-outlined text-[18px]">reply</span>
                        </button>

                        {/* React */}
                        <div className="relative">
                          <button
                            onClick={() => setShowEmojiPicker(showEmojiPicker === msg._id ? null : msg._id)}
                            className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                            title="Reaccionar"
                          >
                            <span className="material-symbols-outlined text-[18px]">add_reaction</span>
                          </button>

                          {showEmojiPicker === msg._id && (
                            <div className={`absolute bottom-full mb-1 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 px-2 py-1.5 flex gap-0.5 z-10 ${
                              isMyMessage ? 'right-0' : 'left-0'
                            }`}>
                              {commonEmojis.map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => handleReaction(msg._id, emoji)}
                                  className="text-base hover:scale-110 active:scale-95 transition-transform p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                  title={emoji}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Star - Solo visible para el usuario que destaca */}
                        <button
                          onClick={() => handleToggleStar(msg._id)}
                          className={`p-1.5 rounded-full transition-all ${
                            msg.starredBy?.includes(user._id)
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : 'text-gray-500 dark:text-gray-400 hover:text-yellow-500'
                          } hover:bg-gray-100 dark:hover:bg-gray-800`}
                          title={msg.starredBy?.includes(user._id) ? 'Quitar destacado' : 'Destacar'}
                        >
                          <span
                            className="material-symbols-outlined text-[18px]"
                            style={{
                              fontVariationSettings: msg.starredBy?.includes(user._id)
                                ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20"
                                : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20"
                            }}
                          >
                            star
                          </span>
                        </button>

                        {/* Delete */}
                        {canDeleteMessage(msg) && (
                          <button
                            onClick={() => handleDeleteMessage(msg._id)}
                            className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                            title="Eliminar"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Reply Banner - Más compacto estilo WhatsApp */}
      {replyTo && (
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-primary/5 dark:bg-primary/10 border-t border-primary/30 dark:border-primary/40">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-1 h-10 bg-primary rounded-full flex-shrink-0"></div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-primary dark:text-primary-light mb-0.5">
                Respondiendo a {replyTo.author ? `${replyTo.author.nombre} ${replyTo.author.apellido}` : 'Usuario'}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {replyTo.content || '📎 Archivo adjunto'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setReplyTo(null)}
            className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
            title="Cancelar respuesta"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Selected Files Preview - Estilo Instagram */}
      {selectedFiles.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm shadow-sm"
              >
                <span className="material-symbols-outlined text-lg text-primary">
                  {file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'videocam' : 'description'}
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-[100px] sm:max-w-[150px]">{file.name}</span>
                <button
                  onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
                  className="p-0.5 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input de mensaje - Estilo Instagram minimalista */}
      <div className="flex items-end gap-2 sm:gap-3 px-2 sm:px-4 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F2937] flex-shrink-0">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 sm:p-2.5 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          title="Adjuntar archivo"
        >
          <span className="material-symbols-outlined text-[22px]">attach_file</span>
        </button>

        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            rows={1}
            className="w-full resize-none bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl py-2 sm:py-3 px-3 sm:px-5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white max-h-32 overflow-y-auto scrollbar-thin transition-all"
          />
        </div>

        <button
          onClick={handleSendMessage}
          disabled={!message.trim() && selectedFiles.length === 0}
          className="p-2 sm:p-2.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          title="Enviar mensaje"
        >
          <span className="material-symbols-outlined text-[22px]">send</span>
        </button>
      </div>
    </div>
  );
};

export default GroupChat;
