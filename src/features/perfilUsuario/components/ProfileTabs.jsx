import React, { memo, useMemo, useCallback } from 'react';

/**
 * Componente para las pestañas de navegación del perfil
 * Optimizado con React.memo y useMemo para evitar re-renders innecesarios
 */
const ProfileTabs = memo(({ activeTab, onTabChange }) => {
  // Memoizar el array de tabs (constante)
  const tabs = useMemo(() => [
    { id: 'posts', label: 'Publicaciones' },
    { id: 'media', label: 'Multimedia' },
    { id: 'likes', label: 'Guardados' }
  ], []);

  // Memoizar handlers de click
  const handleTabClick = useCallback((tabId) => {
    onTabChange(tabId);
  }, [onTabChange]);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 mt-6 sticky top-0 bg-white dark:bg-gray-800 z-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex-1 py-3 text-sm md:text-base font-medium capitalize border-b-2 transition-colors ${activeTab === tab.id
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

ProfileTabs.displayName = 'ProfileTabs';

export default ProfileTabs;


