import React, { useState, useEffect } from 'react';
import { logger } from '../../../shared/utils/logger';
import { createPortal } from 'react-dom';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';
import api from '../../../api/config';
import { AlertDialog } from '../../../shared/components/AlertDialog';

const ShareModal = ({ isOpen, onClose, post }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [shareMessage, setShareMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, variant: 'info', message: '' });

  useEffect(() => {
    if (selectedOption === 'user') {
      fetchFriends();
    } else if (selectedOption === 'group') {
      fetchGroups();
    }
  }, [selectedOption]);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await api.get('/amistades/friends');
      if (response.data.success) {
        setFriends(response.data.data || []);
      }
    } catch (error) {
      logger.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await api.get('/grupos');
      if (response.data.success) {
        // Handle both array and object responses
        const groupsData = Array.isArray(response.data.data)
          ? response.data.data
          : (response.data.data?.grupos || []);
        setGroups(groupsData);
      }
    } catch (error) {
      logger.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendToUser = async (friendId) => {
    try {
      setSending(true);

      // Copy link to clipboard
      const postUrl = `${window.location.origin}/post/${post._id}`;
      await navigator.clipboard.writeText(postUrl);

      // Show success message with instructions
      setAlertConfig({ isOpen: true, variant: 'success', message: '¡Enlace copiado al portapapeles!\n\nAhora puedes enviarlo a tu amigo por mensaje privado.' });
      onClose();
    } catch (error) {
      logger.error('Error sharing to user:', error);
      setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al copiar enlace. Por favor intenta de nuevo.' });
    } finally {
      setSending(false);
    }
  };

  const handleSendToGroup = async (groupId) => {
    try {
      setSending(true);
      // Enviar mensaje al grupo con el enlace
      const message = {
        contenido: shareMessage || `Compartió una publicación: ${post.contenido?.substring(0, 100)}...`,
        tipo: 'texto',
        metadata: {
          sharedPost: post._id,
          postUrl: `${window.location.origin}/post/${post._id}`
        }
      };

      await api.post(`/grupos/${groupId}/mensajes`, message);
      setAlertConfig({ isOpen: true, variant: 'success', message: '¡Publicación compartida en el grupo!' });
      onClose();
    } catch (error) {
      logger.error('Error sharing to group:', error);
      setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al compartir. Intenta de nuevo.' });
    } finally {
      setSending(false);
    }
  };

  if (!isOpen || !post) return null;

  const shareOptions = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: '💬',
      color: 'bg-green-500 hover:bg-green-600',
      action: () => {
        const text = encodeURIComponent(`${shareMessage || post.contenido}\n\nVer más: ${window.location.origin}/post/${post._id}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
      }
    },
    {
      id: 'copy',
      name: 'Copiar enlace',
      icon: '🔗',
      color: 'bg-gray-500 hover:bg-gray-600',
      action: () => {
        navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
        setAlertConfig({ isOpen: true, variant: 'success', message: '¡Enlace copiado al portapapeles!' });
        onClose();
      }
    },
    {
      id: 'user',
      name: 'Enviar a usuario',
      icon: '👤',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => setSelectedOption('user')
    },
    {
      id: 'group',
      name: 'Enviar a grupo',
      icon: '👥',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => setSelectedOption('group')
    }
  ];

  const author = post.usuario;
  const authorName = `${author.nombres?.primero || ''} ${author.apellidos?.primero || ''}`.trim() || 'Usuario';

  const filteredFriends = friends.filter(friend => {
    const friendName = `${friend.nombres?.primero || ''} ${friend.apellidos?.primero || ''}`.toLowerCase();
    return friendName.includes(searchQuery.toLowerCase());
  });

  const filteredGroups = groups.filter(group =>
    group.nombre?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center flex-shrink-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {selectedOption === 'user' ? 'Enviar a usuario' : selectedOption === 'group' ? 'Enviar a grupo' : 'Compartir publicación'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Post Preview */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{authorName}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                {post.contenido}
              </p>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {!selectedOption ? (
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                {shareOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={option.action}
                    className={`${option.color} text-white p-4 rounded-xl transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-2 shadow-lg`}
                  >
                    <span className="text-3xl">{option.icon}</span>
                    <span className="font-medium text-sm">{option.name}</span>
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                  Mensaje opcional
                </label>
                <textarea
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  placeholder="Agrega un mensaje personalizado..."
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white"
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <div className="p-4">
              <button
                onClick={() => {
                  setSelectedOption(null);
                  setSearchQuery('');
                }}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                <span className="text-sm font-medium">Volver</span>
              </button>

              {/* Search */}
              <div className="mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={selectedOption === 'user' ? 'Buscar amigo...' : 'Buscar grupo...'}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white"
                />
              </div>

              {/* Message input */}
              <div className="mb-4">
                <textarea
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  placeholder="Mensaje opcional..."
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white"
                  rows={2}
                />
              </div>

              {/* List */}
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : selectedOption === 'user' ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredFriends.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm">
                      No se encontraron amigos
                    </p>
                  ) : (
                    filteredFriends.map(friend => (
                      <button
                        key={friend._id}
                        onClick={() => handleSendToUser(friend._id)}
                        disabled={sending}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors disabled:opacity-50"
                      >
                        <img
                          src={getUserAvatar(friend)}
                          alt={friend.nombres?.primero}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 text-left">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {friend.nombres?.primero} {friend.apellidos?.primero}
                          </p>
                        </div>
                        {sending && <span className="animate-spin h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full"></span>}
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredGroups.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8 text-sm">
                      No se encontraron grupos
                    </p>
                  ) : (
                    filteredGroups.map(group => (
                      <button
                        key={group._id}
                        onClick={() => handleSendToGroup(group._id)}
                        disabled={sending}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors disabled:opacity-50"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {group.nombre?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {group.nombre}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {group.miembros?.length || 0} miembros
                          </p>
                        </div>
                        {sending && <span className="animate-spin h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full"></span>}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* AlertDialog Component */}
        <AlertDialog
          isOpen={alertConfig.isOpen}
          onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
          variant={alertConfig.variant}
          message={alertConfig.message}
        />
      </div>
    </div>,
    document.body
  );
};

export default ShareModal;



