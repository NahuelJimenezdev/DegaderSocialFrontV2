// src/features/grupos/components/SidebarGroup.jsx
import React from 'react';

const SidebarGroup = ({ groupData, navigate, activeSection, setActiveSection, menuItems }) => {
  return (
    <aside className="w-64 bg-white dark:bg-[#334155] flex flex-col shadow-lg margin-top-71">
      {/* Header del sidebar - fijo */}
      <div className="flex items-center gap-3 p-2 border-b border-[#E5E7EB] dark:border-[#374151] flex-shrink-0">
        <button
          onClick={() => navigate('/Mis_grupos')}
          className="text-[#64748b] dark:text-[#94a3b8] hover:text-primary transition-colors p-1 rounded-md"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h2 className="text-xl font-bold text-[#0f172a] dark:text-[#e2e8f0] truncate">
          {groupData.title}
        </h2>
      </div>

      {/* Menú de navegación - con scroll independiente */}
      <nav className="flex flex-col gap-2 p-4 overflow-y-auto flex-1">
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
  );
};

export default SidebarGroup;