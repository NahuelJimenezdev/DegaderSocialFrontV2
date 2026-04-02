import React from 'react';

/**
 * Procesa el texto para detectar URLs y menciones (@usuario) y devolver elementos React.
 * @param {string} content - El texto original.
 * @param {Object} options - Opciones de personalización.
 * @returns {Array|null} Array de elementos React o null si no hay contenido.
 */
export const renderContentWithItems = (content, options = {}) => {
  if (!content || typeof content !== 'string') return content;

  const {
    linkClass = "!text-blue-600 dark:!text-blue-400 font-bold hover:underline break-all",
    mentionClass = "!text-indigo-600 dark:!text-indigo-400 font-bold cursor-pointer hover:underline"
  } = options;

  // Regex combinada para capturar URLs y menciones
  // Capturamos URLs que empiecen con http/https o www. (esta última se tratará como link externo)
  const combinedRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|@[a-zA-Z0-9._-]+)/g;

  return content.split(combinedRegex).map((part, index) => {
    // 1. Detección de URLs
    if (part.match(/^https?:\/\/[^\s]+$/) || part.match(/^www\.[^\s]+$/)) {
      const href = part.startsWith('www.') ? `https://${part}` : part;
      return (
        <a
          key={`link-${index}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }

    // 2. Detección de Menciones
    if (part.match(/^@[a-zA-Z0-9._-]+$/)) {
      return (
        <span
          key={`mention-${index}`}
          className={mentionClass}
        >
          {part}
        </span>
      );
    }

    // 3. Texto normal
    return part;
  });
};
