// src/features/grupos/components/SidebarGroup.jsx
import React from 'react';
import "../styles/styles.css";

const SidebarGroup = ({ groupData, navigate, activeSection, setActiveSection, menuItems }) => {
  return (
    <aside className="w-full h-full flex flex-col shadow-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
      {/* Header del sidebar */}
      <div className="flex items-center gap-1 p-2 flex-shrink-0" style={{ borderBottom: '1px solid var(--border-primary)' }}>
        <button
          onClick={() => navigate('/Mis_grupos')}
          className="transition-colors p-2 rounded-lg"
          style={{ color: 'var(--text-secondary)' }}
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h2 className="text-xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>
          {groupData.nombre || groupData.title}
        </h2>
      </div>

      {/* Menú de navegación - con scroll independiente */}
      <nav className="flex flex-col gap-2 p-4 overflow-y-auto flex-1 scrollbar-thin">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-all duration-200 relative ${activeSection === item.id
              ? 'text-white bg-primary shadow-md'
              : 'hover:bg-gray-100 dark:hover:bg-slate-600'
              }`}
            style={{ color: activeSection === item.id ? 'white' : 'var(--text-secondary)' }}
          >
            <span className="material-symbols-outlined text-lg">{item.icon}</span>
            <span className="flex-1 text-left">{item.label}</span>
            {/* Badge contador - similar al de notificaciones */}
            {item.count > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full">
                {item.count > 99 ? '99+' : item.count}
              </span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default SidebarGroup;

