import React from 'react';
import { useGroupChat } from '../hooks/useGroupChat';
import { AlertDialog } from '../../../shared/components/AlertDialog';
import GroupChatHeader from './Chat/GroupChatHeader';
import GroupMessageBubble from './Chat/GroupMessageBubble';
import GroupMessageInput from './Chat/GroupMessageInput';

const GroupChat = ({ groupData, refetch, user, userRole, isAdmin, isOwner, targetMessageId, onClearTargetMessage }) => {
  const {
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
    handleSendMessage, // Accepts message string
    handleDeleteMessage,
    handleReaction,
    handleToggleStar,
    alertConfig,
    setAlertConfig,
  } = useGroupChat(groupData, user, targetMessageId, onClearTargetMessage);

  const [message, setMessage] = React.useState(''); // UI State for input field

  const onSendMessage = () => {
    handleSendMessage(message).then(() => {
      setMessage('');
    }).catch(() => {
      // Error handling moved to hook or UI toast
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1F2937]">
      <GroupChatHeader messagesCount={messages.length} />

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
            <p className="text-gray-600 dark:text-gray-400 font-medium">No hay mensajes aún</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">¡Sé el primero en escribir!</p>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((msg) => (
              <GroupMessageBubble
                key={msg._id}
                msg={msg}
                user={user}
                isAdmin={isAdmin}
                isOwner={isOwner}
                onReply={setReplyTo}
                onDelete={handleDeleteMessage}
                onReact={handleReaction}
                onToggleStar={handleToggleStar}
                showEmojiPicker={showEmojiPicker}
                setShowEmojiPicker={setShowEmojiPicker}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <GroupMessageInput
        message={message}
        setMessage={setMessage}
        handleSendMessage={onSendMessage}
        handleKeyPress={handleKeyPress}
        fileInputRef={fileInputRef}
        handleFileSelect={handleFileSelect}
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        replyTo={replyTo}
        setReplyTo={setReplyTo}
      />

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

export default GroupChat;
