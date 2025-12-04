import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

let socket = null;
let currentToken = null;

/**
 * Inicializa o reutiliza la conexión socket.io
 * @param {string} token - Token de autenticación
 * @returns {Socket} Instancia del socket
 */
export const initSocket = (token) => {
  // Si ya existe un socket conectado y el token es el mismo, reutilizarlo
  if (socket && socket.connected && currentToken === token) {
    console.debug('[Socket] Reutilizando socket existente');
    return socket;
  }

  // Si existe pero no conectado o token diferente, desconectar
  if (socket) {
    try {
      socket.disconnect();
    } catch (e) {
      console.warn('[Socket] Error al desconectar socket previo', e);
    }
    socket = null;
  }

  currentToken = token;
  console.debug('[Socket] Inicializando nuevo socket, URL:', SOCKET_URL, ' token present:', !!token);

  socket = io(SOCKET_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling']
  });

  // Eventos globales de conexión
  socket.on('connect', () => {
    console.log('🔌 Socket conectado:', socket.id, 'connected:', socket.connected);

    // Autenticar después de conectar
    if (token) {
      socket.emit('authenticate', { token });
    }
  });

  // Evento de autenticación exitosa
  socket.on('authenticated', (data) => {
    console.log('✅ Socket autenticado:', data);
  });

  socket.on('connect_error', (err) => {
    console.error('🔌 Socket connect_error:', err?.message || err);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Socket desconectado');
  });

  // Eventos de publicaciones
  socket.on('post:created', (post) => {
    window.dispatchEvent(new CustomEvent('socket:post:created', { detail: post }));
  });

  socket.on('post:liked', ({ postId, userId, isLike }) => {
    window.dispatchEvent(new CustomEvent('socket:post:liked', { detail: { postId, userId, isLike } }));
  });

  // Evento de actualización de post (unificado)
  socket.on('post_updated', (post) => {
    console.log('📢 Post actualizado recibido:', post._id);
    window.dispatchEvent(new CustomEvent('socket:post:updated', { detail: post }));
  });

  // Eventos de comentarios
  socket.on('comment:added', ({ postId, comment }) => {
    window.dispatchEvent(new CustomEvent('socket:comment:added', { detail: { postId, comment } }));
  });

  socket.on('comment:liked', ({ postId, commentId, userId, isLike }) => {
    window.dispatchEvent(new CustomEvent('socket:comment:liked', { detail: { postId, commentId, userId, isLike } }));
  });

  // Eventos de respuestas a comentarios
  socket.on('reply:added', ({ postId, commentId, reply }) => {
    window.dispatchEvent(new CustomEvent('socket:reply:added', { detail: { postId, commentId, reply } }));
  });

  socket.on('reply:liked', ({ postId, commentId, replyId, userId, isLike }) => {
    window.dispatchEvent(new CustomEvent('socket:reply:liked', { detail: { postId, commentId, replyId, userId, isLike } }));
  });

  // Eventos de perfil
  socket.on('profile:updated', ({ userId, changes }) => {
    window.dispatchEvent(new CustomEvent('socket:profile:updated', { detail: { userId, changes } }));
  });

  // Eventos de amigos
  socket.on('friend:request_received', (data) => {
    window.dispatchEvent(new CustomEvent('socket:friend:request', { detail: data }));
  });

  socket.on('user:online', (data) => {
    window.dispatchEvent(new CustomEvent('socket:user:online', { detail: data }));
  });

  socket.on('user:offline', (data) => {
    window.dispatchEvent(new CustomEvent('socket:user:offline', { detail: data }));
  });

  // Eventos de notificaciones en tiempo real
  socket.on('newNotification', (notification) => {
    console.log('📨 Nueva notificación recibida:', notification);
    window.dispatchEvent(new CustomEvent('socket:notification:new', { detail: notification }));
  });

  // Eventos de mensajes en tiempo real
  socket.on('newMessage', (message) => {
    console.log('💬 Nuevo mensaje recibido:', message);
    window.dispatchEvent(new CustomEvent('socket:message:new', { detail: message }));
  });

  // Seguridad cliente: evitar que sockets no autenticados emitan eventos sensibles
  try {
    const originalEmit = socket.emit.bind(socket);
    socket.emit = (event, ...args) => {
      if (event === 'post:new' && !socket.auth?.token) {
        console.warn('[Socket] Blocked unauthenticated attempt to emit "post:new"');
        return;
      }
      return originalEmit(event, ...args);
    };
  } catch (e) {
    console.warn('[Socket] No se pudo aplicar el wrapper de seguridad para socket.emit', e);
  }

  return socket;
};

/**
 * Obtiene la instancia actual del socket
 * @returns {Socket|null} Instancia del socket o null si no está inicializado
 */
export const getSocket = () => socket;

/**
 * Desconecta y limpia el socket actual
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentToken = null;
  }
};
