import React, { useState, useEffect, useRef } from 'react';
import { Send, Image as ImageIcon, X, Paperclip, MoreVertical, Smile } from 'lucide-react';
import { API_BASE_URL, SOCKET_URL } from '../../../shared/config/env';
import { logger } from '../../../shared/utils/logger';
import { io } from 'socket.io-client';
import iglesiaService from '../../../api/iglesiaService';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';
import { useAuth } from '../../../context/AuthContext';
import { AlertDialog } from '../../../shared/components/AlertDialog';

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

const IglesiaChat = ({ iglesiaData }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, variant: 'info', message: '' });
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

    const socketUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace('/api', '')
      : API_BASE_URL;

    const socket = io(socketUrl, {
      transports: ['websocket'],
      reconnection: true
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      logger.log('Connected to socket');
      socket.emit('joinRoom', `iglesia:${iglesiaData._id}`);
    });

    socket.on('newIglesiaMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('iglesiaMessageDeleted', ({ messageId }) => {
      setMessages(prev => prev.filter(m => m._id !== messageId));
    });

    return () => {
      socket.disconnect();
    };
  }, [iglesiaData?._id, user?._id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const content = newMessage.trim();
      setNewMessage(''); // Optimistic clear

      await iglesiaService.sendMessage(iglesiaData._id, { content });
      // Message will be added via socket event
    } catch (error) {
      logger.error('Error sending message:', error);
      setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al enviar mensaje' });
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('¿Eliminar mensaje?')) return;
    try {
      await iglesiaService.deleteMessage(iglesiaData._id, messageId);
    } catch (error) {
      logger.error('Error deleting message:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <span className="material-symbols-outlined">forum</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Chat General</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{messages.length} mensajes</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">chat_bubble_outline</span>
            <p>No hay mensajes aún. ¡Sé el primero en escribir!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.author?._id === user?._id;
            const authorName = msg.author ? `${msg.author.nombres?.primero} ${msg.author.apellidos?.primero}` : 'Usuario';

            return (
              <div key={msg._id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''} group`}>
                <div className="flex-shrink-0">
                  <img
                    src={getUserAvatar(msg.author)}
                    alt={authorName}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
                  />
                </div>

                <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      {isMe ? 'Tú' : authorName}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>

                  <div className={`
                    px-4 py-2 rounded-2xl shadow-sm relative group-hover:shadow-md transition-shadow
                    ${isMe
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700'
                    }
                  `}>
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>

                  {/* Actions (Delete) */}
                  {isMe && (
                    <button
                      onClick={() => handleDeleteMessage(msg._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-500 hover:text-red-600 mt-1 flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">delete</span>
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

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
          <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="w-full bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 text-sm py-2"
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </form>
      </div>

      {/* AlertDialog Component */}
      <AlertDialog
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        variant={alertConfig.variant}
        message={alertConfig.message}
      />
    </div>
  );
};

export default IglesiaChat;



