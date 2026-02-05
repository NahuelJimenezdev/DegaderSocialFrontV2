import React from 'react';
import { Menu } from 'lucide-react';

const GroupChatHeader = ({ messagesCount, onMenuClick }) => {
    return (
        <div className="flex justify-between items-center px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center gap-3">
                {/* Botón hamburguesa - Solo visible en mobile */}
                {onMenuClick && (
                    <button
                        onClick={onMenuClick}
                        className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        aria-label="Abrir menú"
                    >
                        <Menu size={24} className="text-gray-700 dark:text-gray-300" />
                    </button>
                )}
                <span className="material-symbols-outlined text-2xl sm:text-3xl text-primary">forum</span>
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Chat del Grupo</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{messagesCount} mensajes</p>
                </div>
            </div>
        </div>
    );
};

export default GroupChatHeader;
