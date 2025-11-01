// src/features/grupos/components/GroupChat.jsx
import React, { useState } from 'react';
import '../../grupos/styles/styles.css';

const GroupChat = ({ groupData }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Enviando mensaje:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header fijo */}
      <header className="flex justify-between items-center p-4 border-b border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#1F2937] flex-shrink-0">
        <h1 className="text-3xl font-bold text-[#0f172a] dark:text-[#e2e8f0]">
          Chat del Grupo
        </h1>
        <div className="flex items-center gap-4">
          <button className="text-[#64748b] dark:text-[#94a3b8] hover:text-primary transition-colors p-2 rounded-full">
            <span className="material-symbols-outlined text-2xl">search</span>
          </button>
          <button className="bg-primary text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-xl">person_add</span>
            Invitar
          </button>
        </div>
      </header>

      {/* Contenedor del chat con scroll */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#334155] m-4 rounded-lg tamano_chat">
        {/* Área de mensajes con scroll */}
        <div className="flex-1 overflow-y-auto p-6 pr-2">
          <div className="flex flex-col gap-4 tamano_chat">
            {groupData.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-lg max-w-xs break-words ${msg.isMine
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-slate-600 text-[#0f172a] dark:text-[#e2e8f0]'
                    }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <span
                    className={`text-xs block mt-1 ${msg.isMine
                        ? 'opacity-75 text-right'
                        : 'text-[#64748b] dark:text-[#94a3b8]'
                      }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input de mensaje fijo en la parte inferior */}
        <div className="flex items-center gap-3 p-6 border-t border-[#E5E7EB] dark:border-[#374151] flex-shrink-0">
          <button className="p-2 rounded-full text-[#64748b] dark:text-[#94a3b8] hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
            <span className="material-symbols-outlined">attach_file</span>
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-grow bg-[#f8fafc] dark:bg-[#1e293b] border-none rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary placeholder-[#64748b] dark:placeholder-[#94a3b8] text-[#0f172a] dark:text-[#e2e8f0]"
            placeholder="Escribe tu mensaje..."
          />
          <button
            onClick={handleSendMessage}
            className="bg-primary text-white p-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;