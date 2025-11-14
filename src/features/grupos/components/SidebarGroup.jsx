// src/features/grupos/components/SidebarGroup.jsx
import React from 'react';
import "../styles/styles.css";

const SidebarGroup = ({ groupData, navigate, activeSection, setActiveSection, menuItems }) => {
  return (
    <aside className="w-full h-full bg-white dark:bg-[#334155] flex flex-col shadow-lg">
      {/* Header del sidebar */}
      <div className="flex items-center gap-1 p-2 border-b border-[#E5E7EB] dark:border-[#374151] flex-shrink-0">
        <button
          onClick={() => navigate('/Mis_grupos')}
          className="text-[#64748b] dark:text-[#94a3b8] hover:text-primary transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h2 className="text-xl font-bold text-[#0f172a] dark:text-[#e2e8f0] truncate">
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
                : 'text-[#64748b] dark:text-[#94a3b8] hover:bg-gray-100 dark:hover:bg-slate-600'
              }`}
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