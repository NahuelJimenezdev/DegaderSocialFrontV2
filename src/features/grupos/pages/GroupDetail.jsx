// src/features/grupos/pages/GroupDetail.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import myGroups from '../../../shared/json/MyGroups.json';

const GroupDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeSection, setActiveSection] = useState('chat');
  const [message, setMessage] = useState('');
  const [groupData, setGroupData] = useState(null);

  // Cargar los datos del grupo según el ID
  useEffect(() => {
    const group = myGroups.find(g => g.id === parseInt(id));
    if (group) {
      setGroupData({
        ...group,
        messages: [
          {
            id: 1,
            text: '¡Hola a todos! ¿Alguien tiene planes para el próximo encuentro familiar?',
            time: '10:30 AM',
            isMine: true
          },
          {
            id: 2,
            text: 'Yo puedo organizar un asado el sábado. ¿Qué les parece?',
            time: '10:35 AM',
            isMine: false
          },
          {
            id: 3,
            text: '¡Excelente idea! Contamos contigo entonces.',
            time: '10:40 AM',
            isMine: true
          },
          {
            id: 4,
            text: 'Necesitamos confirmar cuántos seremos para las compras.',
            time: '10:45 AM',
            isMine: false
          }
        ]
      });
    } else {
      // Si no se encuentra el grupo, redirigir
      navigate('/grupos');
    }
  }, [id, navigate]);

  const menuItems = [
    { id: 'chat', icon: 'chat', label: 'Chat' },
    { id: 'feed', icon: 'article', label: 'Feed' },
    { id: 'detail', icon: 'info', label: 'Detalle' },
    { id: 'members', icon: 'group', label: 'Miembros' },
    { id: 'multimedia', icon: 'collections', label: 'Multimedia' },
    { id: 'files', icon: 'folder', label: 'Archivos' },
    { id: 'links', icon: 'link', label: 'Enlaces' },
    { id: 'events', icon: 'event', label: 'Eventos Destacados' }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Aquí agregarías la lógica para enviar el mensaje
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

  // Mostrar loading mientras se cargan los datos
  if (!groupData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-[#64748b] dark:text-[#94a3b8]">Cargando grupo...</p>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar del grupo */}
      <aside className="w-64 bg-white dark:bg-[#334155] p-6 flex flex-col gap-2 shadow-lg z-10">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/Mis_grupos')}
            className="text-[#64748b] dark:text-[#94a3b8] hover:text-primary transition-colors p-1 rounded-md"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h2 className="text-xl font-bold text-[#0f172a] dark:text-[#e2e8f0]">
            {groupData.title}
          </h2>
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${activeSection === item.id
                  ? 'text-white bg-primary'
                  : 'text-[#64748b] dark:text-[#94a3b8] hover:bg-gray-100 dark:hover:bg-slate-600'
                }`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-4">
        <header className="flex justify-between items-center mt-3">
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

        <div className="bg-white dark:bg-[#334155] rounded-lg p-6 min-h-[calc(100vh-180px)] flex flex-col justify-between">
          {/* Área de mensajes */}
          <div className="flex-grow overflow-y-auto mb-4">
            <div className="flex flex-col gap-4">
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

          {/* Input de mensaje */}
          <div className="flex items-center gap-3">
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
      </main>
    </div>
  );
};

export default GroupDetail;