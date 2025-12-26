import React from 'react';

/**
 * EmojiGrid - Grid de emojis con lazy rendering
 * @param {Array} emojis - Array de emojis a mostrar
 * @param {Function} onEmojiSelect - Callback al seleccionar un emoji
 */
const EmojiGrid = ({ emojis, onEmojiSelect }) => {
    return (
        <div className="grid grid-cols-8 gap-1">
            {emojis.map((emoji, index) => (
                <button
                    key={index}
                    onClick={() => onEmojiSelect(emoji)}
                    className="text-2xl p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label={`Emoji ${emoji}`}
                >
                    {emoji}
                </button>
            ))}
        </div>
    );
};

export default EmojiGrid;
