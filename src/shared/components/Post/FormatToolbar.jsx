import React from 'react';
import { Image as ImageIcon, Smile } from 'lucide-react';
import EmojiPicker from '../EmojiPicker/EmojiPicker';

/**
 * FormatToolbar - Toolbar con botones de formato (imagen, emoji)
 * @param {Object} fileInputRef - Ref del input de archivos
 * @param {boolean} showEmojiPicker - Si el emoji picker está visible
 * @param {Function} onToggleEmojiPicker - Toggle del emoji picker
 * @param {Function} onEmojiSelect - Callback al seleccionar emoji
 */
const FormatToolbar = ({
    fileInputRef,
    showEmojiPicker,
    onToggleEmojiPicker,
    onEmojiSelect
}) => {
    return (
        <div className="flex gap-2 relative">
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
                title="Agregar foto o video"
                aria-label="Agregar foto o video"
            >
                <ImageIcon size={20} />
            </button>

            <button
                type="button"
                onClick={onToggleEmojiPicker}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
                title="Agregar emoji"
                aria-label="Agregar emoji"
            >
                <Smile size={20} />
            </button>

            {/* Emoji Picker */}
            {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 z-50">
                    <EmojiPicker
                        onEmojiSelect={(emoji) => {
                            onEmojiSelect(emoji);
                            onToggleEmojiPicker();
                        }}
                        onClose={onToggleEmojiPicker}
                    />
                </div>
            )}
        </div>
    );
};

export default FormatToolbar;
