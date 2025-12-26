import React from 'react';

/**
 * EmojiCategory - Botón de categoría de emojis
 * @param {Object} category - Objeto con id, icono y nombre
 * @param {boolean} isActive - Si la categoría está activa
 * @param {Function} onClick - Callback al hacer click
 */
const EmojiCategory = ({ category, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex-shrink-0 p-2 rounded-lg text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isActive ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
            title={category.nombre}
            aria-label={category.nombre}
            aria-pressed={isActive}
        >
            {category.icono}
        </button>
    );
};

export default EmojiCategory;
