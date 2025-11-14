import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, Search, Send, X, User, Loader, MoreVertical, Trash2, Archive, Eraser, Star, Filter, Paperclip, Smile, Image as ImageIcon, Video } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getSocket } from '../../../shared/lib/socket';
import conversationService from '../../../api/conversationService';
import { getAvatarUrl, handleImageError } from '../../../shared/utils/avatarUtils';
import api from '../../../api/config';
import EmojiPicker from '../../../shared/components/EmojiPicker/EmojiPicker';

const MensajesPage = () => {
  const { id: paramConvId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?._id || user?.id;

  const [conversaciones, setConversaciones] = useState([]);
  const [conversacionActual, setConversacionActual] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [busquedaGlobal, setBusquedaGlobal] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(null); // ID de conversación con menú abierto
  const [tabActiva, setTabActiva] = useState('principal'); // 'principal', 'pending', 'archived'
  const [pendingCount, setPendingCount] = useState(0); // Contador de pendientes
  const [filtroActivo, setFiltroActivo] = useState('todos'); // 'todos', 'no_leido', 'destacados'
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [mostrarEmojiPicker, setMostrarEmojiPicker] = useState(false);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [previsualizacionArchivo, setPrevisualizacionArchivo] = useState(null);
  const mensajesEndRef = useRef(null);
  const timeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  // Cargar contador de pendientes
  useEffect(() => {
    if (!userId) return;

    const fetchPendingCount = async () => {
      try {
        const response = await conversationService.getPendingCount();
        const count = response.data?.count || 0;
        setPendingCount(count);
      } catch (error) {
        console.error('Error al cargar contador de pendientes:', error);
      }
    };

    fetchPendingCount();
    // Recargar cada 30 segundos
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  // Cargar conversaciones según la pestaña activa
  useEffect(() => {
    if (!userId) return;

    const fetchConversaciones = async () => {
      try {
        const response = await conversationService.getAllConversations(tabActiva);
        const convs = response.data?.conversations || response.conversations || response.data || [];
        setConversaciones(Array.isArray(convs) ? convs : []);
      } catch (error) {
        console.error('Error al cargar conversaciones:', error);
        setConversaciones([]);
      }
    };

    fetchConversaciones();
  }, [userId, tabActiva]);

  // Cargar conversación específica desde parámetro de URL
  useEffect(() => {
    if (!paramConvId || !userId) return;

    const loadConversation = async () => {
      try {
        setCargando(true);

        // Si viene de /mensajes/user:ID, crear/obtener conversación
        if (paramConvId.startsWith('user:')) {
          const targetUserId = paramConvId.substring(5);
          const response = await conversationService.getOrCreateConversation(targetUserId);
          const conv = response.data?.conversation || response.conversation || response.data;

          if (conv) {
            setConversacionActual(conv);
            loadMessages(conv._id);

            // Actualizar URL a conversación real
            navigate(`/mensajes/${conv._id}`, { replace: true });

            // Recargar conversaciones para mostrar la nueva
            const response = await conversationService.getAllConversations(tabActiva);
            const convs = response.data?.conversations || response.conversations || response.data || [];
            setConversaciones(Array.isArray(convs) ? convs : []);
          }
        } else {
          // Conversación normal por ID
          const response = await conversationService.getConversationById(paramConvId);
          const conv = response.data?.conversation || response.conversation || response.data;

          if (conv) {
            setConversacionActual(conv);
            loadMessages(paramConvId);
          }
        }
      } catch (error) {
        console.error('Error al cargar conversación:', error);
      } finally {
        setCargando(false);
      }
    };

    loadConversation();
  }, [paramConvId, userId, navigate]);

  // Cargar mensajes de conversación
  const loadMessages = async (conversationId) => {
    try {
      const response = await conversationService.getConversationById(conversationId);
      const conv = response.data?.conversation || response.conversation || response.data;
      const msgs = conv?.mensajes || [];
      setMensajes(Array.isArray(msgs) ? msgs : []);

      // Marcar como leída
      await conversationService.markAsRead(conversationId);

      // Scroll al final
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      setMensajes([]);
    }
  };

  // Socket.IO - Escuchar nuevos mensajes
  useEffect(() => {
    if (!conversacionActual) return;

    const socket = getSocket();
    if (!socket) return;

    // Suscribirse a la conversación
    socket.emit('subscribeConversation', { conversationId: conversacionActual._id });

    const handleNewMessage = (message) => {
      console.log('💬 Nuevo mensaje recibido:', message);

      // Solo agregar si es de la conversación actual
      if (message.conversationId === conversacionActual._id) {
        setMensajes(prev => [...prev, message]);
        scrollToBottom();

        // Marcar como leída si no es mensaje propio
        if (message.emisor?._id !== userId && message.emisor !== userId) {
          conversationService.markAsRead(conversacionActual._id).catch(console.error);
        }
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [conversacionActual, userId]);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = () => {
      if (menuAbierto) {
        setMenuAbierto(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuAbierto]);

  // Scroll al final de mensajes
  const scrollToBottom = () => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Manejar selección de archivo
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (10MB máximo)
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 10MB');
      return;
    }

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de archivo no permitido. Solo imágenes (JPEG, PNG, GIF, WEBP) y videos (MP4, AVI, MOV, WMV)');
      return;
    }

    setArchivoSeleccionado(file);

    // Crear previsualización
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

  // Cancelar archivo seleccionado
  const handleCancelarArchivo = () => {
    setArchivoSeleccionado(null);
    setPrevisualizacionArchivo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Manejar selección de emoji
  const handleEmojiSelect = (emoji) => {
    setNuevoMensaje(prev => prev + emoji);
    setMostrarEmojiPicker(false);
  };

  // Enviar mensaje
  const handleEnviarMensaje = async (e) => {
    e.preventDefault();

    if ((!nuevoMensaje.trim() && !archivoSeleccionado) || !conversacionActual) return;

    try {
      const mensaje = nuevoMensaje.trim();

      // Si hay archivo, enviar con FormData
      if (archivoSeleccionado) {
        const formData = new FormData();
        formData.append('contenido', mensaje || 'Archivo adjunto');
        formData.append('archivo', archivoSeleccionado);

        const token = localStorage.getItem('token');
        await api.post(`/conversaciones/${conversacionActual._id}/message`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        // Limpiar archivo
        handleCancelarArchivo();
      } else {
        // Enviar mensaje de texto normal
        await conversationService.sendMessage(conversacionActual._id, mensaje);
      }

      setNuevoMensaje('');

      // NO agregamos el mensaje aquí - Socket.IO lo hará automáticamente
      // Esto evita la duplicación

      // Actualizar última mensaje en lista de conversaciones
      setConversaciones(prev =>
        prev.map(conv =>
          conv._id === conversacionActual._id
            ? { ...conv, ultimoMensaje: { contenido: mensaje || 'Archivo adjunto', fecha: new Date() } }
            : conv
        )
      );
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      alert('Error al enviar el mensaje');
    }
  };

  // Seleccionar conversación
  const handleSeleccionarConversacion = (conv) => {
    navigate(`/mensajes/${conv._id}`);
  };

  // Obtener el otro participante
  const getOtroParticipante = (conv) => {
    if (!conv || !conv.participantes) return null;
    return conv.participantes.find(p => p._id !== userId);
  };

  // Formatear tiempo
  const formatearTiempo = (fecha) => {
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
  };

  // Contador de no leídos por conversación
  const getUnreadCount = (conv) => {
    const unread = conv.mensajesNoLeidos?.find(m => m.usuario?.toString() === userId?.toString());
    return unread?.cantidad || 0;
  };

  // Búsqueda global de usuarios
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

      const usuarios = response.data?.resultados?.usuarios || [];
      setResultadosBusqueda(usuarios);
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      setResultadosBusqueda([]);
    } finally {
      setCargandoBusqueda(false);
    }
  };

  // Handler para búsqueda con debounce
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

  // Seleccionar usuario de búsqueda
  const seleccionarUsuarioBusqueda = (usuario) => {
    navigate(`/mensajes/user:${usuario._id}`);
    setMostrarBuscador(false);
    setBusquedaGlobal('');
    setResultadosBusqueda([]);
  };

  // Función para eliminar chat
  const handleEliminarChat = async (conversationId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta conversación?')) return;

    try {
      await conversationService.deleteConversation(conversationId);

      // Remover de la lista local
      setConversaciones(prev => prev.filter(conv => conv._id !== conversationId));

      // Si era la conversación actual, navegar a /mensajes
      if (conversacionActual?._id === conversationId) {
        navigate('/mensajes');
        setConversacionActual(null);
        setMensajes([]);
      }

      setMenuAbierto(null);
    } catch (error) {
      console.error('Error al eliminar conversación:', error);
      alert('Error al eliminar la conversación');
    }
  };

  // Función para archivar chat
  const handleArchivarChat = async (conversationId) => {
    try {
      await conversationService.archiveConversation(conversationId);

      // Si era la conversación actual, navegar a /mensajes
      if (conversacionActual?._id === conversationId) {
        navigate('/mensajes');
        setConversacionActual(null);
        setMensajes([]);
      }

      // Recargar conversaciones según la pestaña actual
      const response = await conversationService.getAllConversations(tabActiva);
      const convs = response.data?.conversations || response.conversations || response.data || [];
      setConversaciones(Array.isArray(convs) ? convs : []);

      setMenuAbierto(null);
    } catch (error) {
      console.error('Error al archivar conversación:', error);
      alert('Error al archivar la conversación');
    }
  };

  // Función para vaciar conversación
  const handleVaciarConversacion = async (conversationId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar todos los mensajes de esta conversación?')) return;

    try {
      await conversationService.clearConversation(conversationId);

      // Si es la conversación actual, vaciar los mensajes localmente
      if (conversacionActual?._id === conversationId) {
        setMensajes([]);
      }

      // Actualizar la lista de conversaciones para quitar el último mensaje
      setConversaciones(prev => prev.map(conv =>
        conv._id === conversationId
          ? { ...conv, ultimoMensaje: null, mensajes: [] }
          : conv
      ));

      setMenuAbierto(null);
    } catch (error) {
      console.error('Error al vaciar conversación:', error);
      alert('Error al vaciar la conversación');
    }
  };

  // Función para aceptar solicitud de mensaje
  const handleAceptarSolicitud = async (conversationId) => {
    try {
      await conversationService.acceptMessageRequest(conversationId);

      // Remover de la lista de pendientes
      setConversaciones(prev => prev.filter(conv => conv._id !== conversationId));

      // Si era la conversación actual, navegar a /mensajes
      if (conversacionActual?._id === conversationId) {
        navigate('/mensajes');
        setConversacionActual(null);
        setMensajes([]);
      }

      // Recargar conversaciones para actualizar
      const response = await conversationService.getAllConversations(tabActiva);
      const convs = response.data?.conversations || response.conversations || response.data || [];
      setConversaciones(Array.isArray(convs) ? convs : []);
    } catch (error) {
      console.error('Error al aceptar solicitud:', error);
      alert('Error al aceptar la solicitud');
    }
  };

  // Función para rechazar solicitud de mensaje
  const handleRechazarSolicitud = async (conversationId) => {
    if (!confirm('¿Estás seguro de que quieres rechazar esta solicitud?')) return;

    try {
      await conversationService.declineMessageRequest(conversationId);

      // Remover de la lista local
      setConversaciones(prev => prev.filter(conv => conv._id !== conversationId));

      // Si era la conversación actual, navegar a /mensajes
      if (conversacionActual?._id === conversationId) {
        navigate('/mensajes');
        setConversacionActual(null);
        setMensajes([]);
      }
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
      alert('Error al rechazar la solicitud');
    }
  };

  // Función para destacar/quitar estrella
  const handleDestacarChat = async (conversationId) => {
    try {
      await conversationService.starConversation(conversationId);

      // Actualizar la lista local
      setConversaciones(prev => prev.map(conv => {
        if (conv._id === conversationId) {
          const isStarred = conv.starredBy?.some(id => id === userId);
          return {
            ...conv,
            starredBy: isStarred
              ? conv.starredBy.filter(id => id !== userId)
              : [...(conv.starredBy || []), userId]
          };
        }
        return conv;
      }));

      setMenuAbierto(null);
    } catch (error) {
      console.error('Error al destacar conversación:', error);
      alert('Error al destacar la conversación');
    }
  };

  const otroUsuario = conversacionActual ? getOtroParticipante(conversacionActual) : null;

  // Filtrar conversaciones según filtro activo (solo en pestaña principal)
  const conversacionesFiltradas = conversaciones.filter(conv => {
    // Filtro de búsqueda local
    if (busqueda) {
      const otro = getOtroParticipante(conv);
      const nombreCompleto = `${otro?.nombre} ${otro?.apellido}`.toLowerCase();
      if (!nombreCompleto.includes(busqueda.toLowerCase())) {
        return false;
      }
    }

    // Filtros adicionales solo en pestaña principal
    if (tabActiva === 'principal') {
      if (filtroActivo === 'no_leido') {
        const unreadCount = getUnreadCount(conv);
        return unreadCount > 0;
      } else if (filtroActivo === 'destacados') {
        return conv.starredBy?.some(id => id === userId);
      }
    }

    return true;
  });

  return (
    <div className="h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto h-full max-w-7xl">
        <div className="grid grid-cols-12 h-full border-l border-r border-gray-200 dark:border-gray-700">
          {/* Sidebar de conversaciones */}
          <div className="col-span-4 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Mensajes
                </h1>
                <button
                  onClick={() => setMostrarBuscador(!mostrarBuscador)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  {mostrarBuscador ? <X size={20} /> : <Search size={20} />}
                </button>
              </div>

              {/* Pestañas */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setTabActiva('principal')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    tabActiva === 'principal'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Principal
                </button>
                <button
                  onClick={() => setTabActiva('pending')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors relative ${
                    tabActiva === 'pending'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Pendientes
                  {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {pendingCount > 9 ? '9+' : pendingCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setTabActiva('archived')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    tabActiva === 'archived'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Archivados
                </button>
              </div>

              {/* Filtro en Principal */}
              {tabActiva === 'principal' && (
                <div className="mb-4 flex gap-2">
                  <div className="relative flex-1">
                    <button
                      onClick={() => setMostrarFiltro(!mostrarFiltro)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-full"
                    >
                      <Filter size={16} />
                      {filtroActivo === 'todos' && 'Todos'}
                      {filtroActivo === 'no_leido' && 'No leído'}
                      {filtroActivo === 'destacados' && 'Destacados'}
                    </button>

                    {mostrarFiltro && (
                      <div className="absolute top-12 left-0 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                        <button
                          onClick={() => { setFiltroActivo('todos'); setMostrarFiltro(false); }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          Todos
                        </button>
                        <button
                          onClick={() => { setFiltroActivo('no_leido'); setMostrarFiltro(false); }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          No leído
                        </button>
                        <button
                          onClick={() => { setFiltroActivo('destacados'); setMostrarFiltro(false); }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          Destacados
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Buscador global */}
              {mostrarBuscador && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Buscar usuario para chatear:</p>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Buscar personas..."
                      value={busquedaGlobal}
                      onChange={handleBusquedaGlobal}
                      className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Resultados de búsqueda */}
                  {(cargandoBusqueda || resultadosBusqueda.length > 0) && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
                      {cargandoBusqueda ? (
                        <div className="flex items-center justify-center p-4 text-gray-500">
                          <Loader size={20} className="animate-spin mr-2" />
                          Buscando...
                        </div>
                      ) : resultadosBusqueda.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          No se encontraron usuarios
                        </div>
                      ) : (
                        resultadosBusqueda.map((usuario) => (
                          <div
                            key={usuario._id}
                            onClick={() => seleccionarUsuarioBusqueda(usuario)}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
                          >
                            <img
                              src={getAvatarUrl(usuario.avatar)}
                              alt={`${usuario.nombre} ${usuario.apellido}`}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={handleImageError}
                            />
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 dark:text-white text-sm">
                                {usuario.nombre} {usuario.apellido}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {usuario.rol || 'Usuario'} · {usuario.ciudad || 'Sin ubicación'}
                              </div>
                            </div>
                            <User size={16} className="text-gray-400" />
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Lista de conversaciones */}
            <div className="flex-1 overflow-y-auto">
              {conversacionesFiltradas.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <MessageCircle size={64} className="text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    No tienes conversaciones
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Busca a alguien para iniciar un chat
                  </p>
                </div>
              ) : (
                conversacionesFiltradas.map((conv) => {
                  const otro = getOtroParticipante(conv);
                  const unreadCount = getUnreadCount(conv);

                  if (!otro) return null;

                  return (
                    <div
                      key={conv._id}
                      className={`relative flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 ${
                        conversacionActual?._id === conv._id ? 'bg-gray-100 dark:bg-gray-800' : ''
                      }`}
                    >
                      <div
                        className="flex items-center gap-3 flex-1 min-w-0"
                        onClick={() => handleSeleccionarConversacion(conv)}
                      >
                        <img
                          src={getAvatarUrl(otro.avatar)}
                          alt={`${otro.nombre} ${otro.apellido}`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                {otro.nombre} {otro.apellido}
                              </h4>
                              {conv.starredBy?.some(id => id === userId) && (
                                <Star size={14} className="text-yellow-500 fill-yellow-500 flex-shrink-0" />
                              )}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatearTiempo(conv.ultimoMensaje?.fecha)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {conv.ultimoMensaje?.contenido || 'Nueva conversación'}
                          </p>
                        </div>
                        {unreadCount > 0 && (
                          <span className="bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        )}
                      </div>

                      {/* Botón de menú o botones de aceptar/rechazar */}
                      {tabActiva === 'pending' ? (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAceptarSolicitud(conv._id);
                            }}
                            className="px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white text-xs rounded-md transition-colors"
                          >
                            Aceptar
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRechazarSolicitud(conv._id);
                            }}
                            className="px-3 py-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-md transition-colors"
                          >
                            Rechazar
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuAbierto(menuAbierto === conv._id ? null : conv._id);
                            }}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                          >
                            <MoreVertical size={18} className="text-gray-600 dark:text-gray-400" />
                          </button>

                          {/* Menú desplegable */}
                          {menuAbierto === conv._id && (
                          <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 w-48 z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDestacarChat(conv._id);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-yellow-600 dark:text-yellow-400"
                            >
                              <Star size={16} className={conv.starredBy?.some(id => id === userId) ? 'fill-yellow-500' : ''} />
                              {conv.starredBy?.some(id => id === userId) ? 'Quitar destacado' : 'Destacar'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEliminarChat(conv._id);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600 dark:text-red-400"
                            >
                              <Trash2 size={16} />
                              Eliminar chat
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleArchivarChat(conv._id);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                            >
                              <Archive size={16} />
                              Archivar
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVaciarConversacion(conv._id);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                            >
                              <Eraser size={16} />
                              Vaciar conversación
                            </button>
                          </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Panel de chat */}
          <div className="col-span-8 flex flex-col h-full bg-white dark:bg-gray-900">
            {!conversacionActual || cargando ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle size={80} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {cargando ? 'Cargando...' : 'Selecciona una conversación'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {cargando ? 'Espera un momento' : 'Elige una conversación del panel izquierdo para comenzar a chatear'}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Header del chat */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 bg-white dark:bg-gray-900">
                  {otroUsuario && (
                    <>
                      <img
                        src={getAvatarUrl(otroUsuario.avatar)}
                        alt={`${otroUsuario.nombre} ${otroUsuario.apellido}`}
                        className="w-10 h-10 rounded-full object-cover cursor-pointer"
                        onClick={() => navigate(`/perfil/${otroUsuario._id}`)}
                      />
                      <div>
                        <h3
                          className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-indigo-600"
                          onClick={() => navigate(`/perfil/${otroUsuario._id}`)}
                        >
                          {otroUsuario.nombre} {otroUsuario.apellido}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Click para ver perfil</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Mensajes */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
                  {mensajes.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <p>No hay mensajes aún. ¡Envía el primero!</p>
                    </div>
                  ) : (
                    mensajes.map((msg, index) => {
                      const esMio = msg.emisor?._id === userId || msg.emisor === userId;
                      const tieneArchivo = msg.archivo && msg.archivo.url;
                      const esImagen = msg.tipo === 'imagen' || msg.archivo?.tipo?.startsWith('image');
                      const esVideo = msg.tipo === 'video' || msg.archivo?.tipo?.startsWith('video');

                      return (
                        <div
                          key={msg._id || index}
                          className={`flex ${esMio ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                              esMio
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            {/* Mostrar archivo si existe */}
                            {tieneArchivo && (
                              <div className="mb-2">
                                {esImagen ? (
                                  <img
                                    src={`${api.defaults.baseURL.replace('/api', '')}/${msg.archivo.url}`}
                                    alt={msg.archivo.nombre || 'Imagen'}
                                    className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => window.open(`${api.defaults.baseURL.replace('/api', '')}/${msg.archivo.url}`, '_blank')}
                                  />
                                ) : esVideo ? (
                                  <video
                                    src={`${api.defaults.baseURL.replace('/api', '')}/${msg.archivo.url}`}
                                    controls
                                    className="max-w-full rounded-lg"
                                  />
                                ) : null}
                              </div>
                            )}

                            {/* Mostrar texto si existe */}
                            {msg.contenido && (
                              <p className="text-sm break-words">{msg.contenido}</p>
                            )}

                            <p className={`text-xs mt-1 ${esMio ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
                              {formatearTiempo(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={mensajesEndRef} />
                </div>

                {/* Input de mensaje */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  {/* Previsualización de archivo */}
                  {previsualizacionArchivo && (
                    <div className="mb-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        {previsualizacionArchivo.tipo === 'imagen' ? (
                          <img
                            src={previsualizacionArchivo.url}
                            alt="Vista previa"
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <Video size={32} className="text-gray-500" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {previsualizacionArchivo.nombre}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {previsualizacionArchivo.tipo === 'imagen' ? 'Imagen' : 'Video'}
                          </p>
                        </div>
                        <button
                          onClick={handleCancelarArchivo}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                          <X size={20} className="text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleEnviarMensaje} className="flex items-center gap-2 relative">
                    {/* Input file oculto */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/avi,video/mov,video/wmv"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {/* Botón de adjuntar archivo */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-400"
                    >
                      <Paperclip size={20} />
                    </button>

                    {/* Botón de emoji */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMostrarEmojiPicker(!mostrarEmojiPicker);
                      }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-400"
                    >
                      <Smile size={20} />
                    </button>

                    {/* Input de texto */}
                    <input
                      type="text"
                      placeholder="Escribe un mensaje..."
                      value={nuevoMensaje}
                      onChange={(e) => setNuevoMensaje(e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                    />

                    {/* Botón enviar */}
                    <button
                      type="submit"
                      disabled={!nuevoMensaje.trim() && !archivoSeleccionado}
                      className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={20} />
                    </button>

                    {/* Emoji Picker */}
                    {mostrarEmojiPicker && (
                      <EmojiPicker
                        onEmojiSelect={handleEmojiSelect}
                        onClose={() => setMostrarEmojiPicker(false)}
                      />
                    )}
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MensajesPage;
