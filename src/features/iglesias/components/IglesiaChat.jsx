import React, { useState, useEffect, useRef } from 'react';
import { Send, Image as ImageIcon, X, Paperclip, Smile, ArrowLeft, Menu, MoreVertical } from 'lucide-react';
import { API_BASE_URL } from '../../../shared/config/env';
import { logger } from '../../../shared/utils/logger';
import { getSocket } from '../../../shared/lib/socket';
import iglesiaService from '../../../api/iglesiaService';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';
import { useAuth } from '../../../context/AuthContext';
import { AlertDialog } from '../../../shared/components/AlertDialog';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog/ConfirmDialog';
import { useNavigate } from 'react-router-dom';

// Helper to format time
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return 'ahora';

  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  return `${Math.floor(hours / 24)}d`;
};

const IglesiaChat = ({ iglesiaData, setSidebarOpen, setActiveSection, isMobile }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, variant: 'info', message: '' });
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', variant: 'warning', onConfirm: null });
  const [messageToDelete, setMessageToDelete] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        if (!iglesiaData?._id) return;
        setLoading(true);
        const data = await iglesiaService.getMessages(iglesiaData._id);
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        logger.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [iglesiaData?._id]);

  // Socket connection
  useEffect(() => {
    if (!iglesiaData?._id || !user?._id) return;

    console.log('[IglesiaChat] Initializing socket connection for church:', iglesiaData._id);
    const socket = getSocket();

    if (!socket) {
      console.error('[IglesiaChat] Socket not initialized or not found!');
      logger.warn('[IglesiaChat] Socket not initialized');
      return;
    }

    if (!socket.connected) {
      console.warn('[IglesiaChat] Socket found but disconnected. ID:', socket.id);
    } else {
      console.log('[IglesiaChat] Socket connected. ID:', socket.id);
    }

    // Join room
    const roomName = `iglesia:${iglesiaData._id}`;
    console.log('[IglesiaChat] Joining room:', roomName);
    socket.emit('joinRoom', roomName);

    // Listeners
    const handleNewMessage = (message) => {
      console.log('[IglesiaChat] Received new message via socket:', message);
      setMessages(prev => {
        // Prevent duplicates just in case
        if (prev.some(m => m._id === message._id)) {
          console.log('[IglesiaChat] Duplicate message ignored:', message._id);
          return prev;
        }
        return [...prev, message];
      });
    };

    const handleMessageDeleted = ({ messageId }) => {
      console.log('[IglesiaChat] Message deleted via socket:', messageId);
      setMessages(prev => prev.filter(m => m._id !== messageId));
    };

    socket.on('newIglesiaMessage', handleNewMessage);
    socket.on('iglesiaMessageDeleted', handleMessageDeleted);

    return () => {
      if (socket) {
        console.log('[IglesiaChat] Leaving room:', roomName);
        socket.emit('leaveRoom', roomName);
        socket.off('newIglesiaMessage', handleNewMessage);
        socket.off('iglesiaMessageDeleted', handleMessageDeleted);
      }
    };
  }, [iglesiaData?._id, user?._id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const content = newMessage.trim();
      setNewMessage(''); // Optimistic clear

      console.log('[IglesiaChat] Sending message via API...');
      const response = await iglesiaService.sendMessage(iglesiaData._id, { content });
      console.log('[IglesiaChat] Message sent successfully via API:', response);

      // Message will be added via socket event
    } catch (error) {
      console.error('[IglesiaChat] Error sending message:', error);
      logger.error('Error sending message:', error);
      setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al enviar mensaje' });
    }
  };

  const executeDeleteMessage = async () => {
    setConfirmConfig(prev => ({ ...prev, isOpen: false }));
    if (!messageToDelete) return;

    try {
      await iglesiaService.deleteMessage(iglesiaData._id, messageToDelete);
    } catch (error) {
      logger.error('Error deleting message:', error);
      setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al eliminar mensaje' });
    } finally {
      setMessageToDelete(null);
    }
  };

  const handleDeleteMessage = (messageId) => {
    setMessageToDelete(messageId);
    setConfirmConfig({
      isOpen: true,
      title: 'Eliminar mensaje',
      message: '¿Estás seguro de que deseas eliminar este mensaje?',
      variant: 'danger',
      onConfirm: executeDeleteMessage
    });
  };

  return (
    <div className={`
      flex flex-col bg-white dark:bg-gray-900 overflow-hidden
      ${isMobile ? 'fixed inset-0 z-[100]' : 'h-full'}
    `}>
      {/* Header Estilo Mensajes - Altura fija para evitar saltos */}
      <div className="h-[70px] border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 bg-white dark:bg-gray-900 shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          {/* Botón Menú Hamburguesa para Sidebar */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex items-center justify-center lg:hidden"
              aria-label="Abrir menú de iglesia"
            >
              <Menu size={24} className="text-gray-700 dark:text-gray-300" />
            </button>
          )}

          <div className="flex flex-col ml-1 min-w-0">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm md:text-base truncate max-w-[150px] xs:max-w-[200px] md:max-w-none leading-tight">
              {iglesiaData?.nombre || 'Chat General'}
            </h3>
            <p className="text-[10px] text-green-500 font-medium leading-none mt-1">En línea</p>
          </div>
        </div>

        {/* Espacio reservado para mantener el balance si fuera necesario, o simplemente vacío */}
        <div className="w-10" />
      </div>

      {/* Messages Area - Estilo Burbujas */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-600 py-10">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl opacity-30">chat_bubble_outline</span>
            </div>
            <p className="text-sm font-medium">No hay mensajes aún</p>
            <p className="text-xs opacity-70">¡Sé el primero en escribir!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.author?._id === user?._id;
            const authorName = msg.author ? `${msg.author.nombres?.primero} ${msg.author.apellidos?.primero}` : 'Usuario';

            return (
              <div key={msg._id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                {!isMe && (
                  <div className="flex-shrink-0 self-end mb-1">
                    <img
                      src={getUserAvatar(msg.author)}
                      alt={authorName}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shadow-sm cursor-pointer"
                      onClick={() => navigate(`/perfil/${msg.author?._id}`)}
                    />
                  </div>
                )}

                <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && (
                    <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 ml-1 mb-0.5">
                      {authorName}
                    </span>
                  )}

                  <div className={`
                    px-4 py-2 rounded-2xl shadow-sm relative transition-all duration-200
                    ${isMe
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700'
                    }
                  `}>
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                    <div className={`text-[9px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                      {formatTime(msg.createdAt)}
                    </div>
                  </div>

                  {isMe && (
                    <button
                      onClick={() => handleDeleteMessage(msg._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-red-500 hover:text-red-600 mt-1 flex items-center gap-1 px-1"
                    >
                      <span className="material-symbols-outlined text-[12px]">delete</span>
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area Estilo Mensajes */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shrink-0">
        <form onSubmit={handleSendMessage} className="flex gap-2 items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-1 md:gap-2">
            <button
              type="button"
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <Paperclip size={22} />
            </button>
            <button
              type="button"
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors hidden md:block"
            >
              <Smile size={22} />
            </button>
          </div>

          <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center px-4 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all border border-transparent">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="w-full bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 text-sm py-1"
            />
          </div>

          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`
              p-3 rounded-full shadow-md transition-all transform active:scale-95 flex items-center justify-center
              ${newMessage.trim()
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'}
            `}
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      <AlertDialog
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        variant={alertConfig.variant}
        message={alertConfig.message}
      />

      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        variant={confirmConfig.variant}
      />
    </div>
  );
};

export default IglesiaChat;



