import { useState } from 'react';
import { X } from 'lucide-react';
import EmojiCategory from './EmojiCategory';
import EmojiGrid from './EmojiGrid';
import { emojis, categorias } from './emojiData';

/**
 * EmojiPicker - Selector de emojis refactorizado con UI mejorada
 * @param {Function} onEmojiSelect - Callback al seleccionar un emoji
 * @param {Function} onClose - Callback al cerrar el picker
 */
const EmojiPicker = ({ onEmojiSelect, onClose }) => {
  const [categoriaActiva, setCategoriaActiva] = useState('rostros');

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-80 max-h-96 flex flex-col"
      style={{ zIndex: 9999 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {emojis[categoriaActiva].nombre}
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label="Cerrar selector de emojis"
        >
          <X size={18} className="text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Categorías - Con scrollbar personalizado y gradientes */}
      <div className="relative border-b border-gray-200 dark:border-gray-700">
        {/* Gradiente izquierdo */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-gray-800 to-transparent pointer-events-none z-10" />

        {/* Gradiente derecho */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-800 to-transparent pointer-events-none z-10" />

        <div
          className="flex gap-2 px-3 py-2.5 overflow-x-auto emoji-categories-scroll"
        >
          <style jsx>{`
            .emoji-categories-scroll::-webkit-scrollbar {
              height: 4px;
            }
            .emoji-categories-scroll::-webkit-scrollbar-track {
              background: transparent;
            }
            .emoji-categories-scroll::-webkit-scrollbar-thumb {
              background: rgba(156, 163, 175, 0.3);
              border-radius: 2px;
            }
            .emoji-categories-scroll::-webkit-scrollbar-thumb:hover {
              background: rgba(156, 163, 175, 0.5);
            }
            /* Firefox */
            .emoji-categories-scroll {
              scrollbar-width: thin;
              scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
            }
          `}</style>
          {categorias.map((cat) => (
            <EmojiCategory
              key={cat.id}
              category={cat}
              isActive={categoriaActiva === cat.id}
              onClick={() => setCategoriaActiva(cat.id)}
            />
          ))}
        </div>
      </div>

      {/* Grid de emojis - Con scrollbar personalizado */}
      <div className="flex-1 overflow-y-auto p-2 emoji-grid-scroll">
        <style jsx>{`
          .emoji-grid-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .emoji-grid-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .emoji-grid-scroll::-webkit-scrollbar-thumb {
            background: rgba(156, 163, 175, 0.3);
            border-radius: 3px;
          }
          .emoji-grid-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(156, 163, 175, 0.5);
          }
          /* Firefox */
          .emoji-grid-scroll {
            scrollbar-width: thin;
            scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
          }
        `}</style>
        <EmojiGrid
          emojis={emojis[categoriaActiva].emojis}
          onEmojiSelect={onEmojiSelect}
        />
      </div>
    </div>
  );
};

export default EmojiPicker;
