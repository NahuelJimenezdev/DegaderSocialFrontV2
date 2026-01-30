// src/shared/config/hiddenRoutes.js

/**
 * Rutas donde se deben ocultar ciertos componentes del layout (AdsSidebar, Sidebar, etc.)
 * Se pueden usar expresiones regulares (RegExp) para mayor flexibilidad.
 */

export const hideAdsSidebarRoutes = [
  // /Mis_grupos/1, /Mis_grupos/2, etc.
  /^\/Mis_grupos\/\d+$/,

  // /Mis_Carpetas/1, /Mis_Carpetas/2, etc.
  /^\/Mis_Carpetas\/\d+$/,
  // /mensajes/1, /mensajes/2, etc.
  /^\/mensajes(\/.*)?$/i,
]

/**
 * Rutas donde se debe ocultar el Sidebar global
 * Útil para páginas que tienen su propio sidebar personalizado
 */
export const hideSidebarRoutes = [
  // /Mis_grupos/1, /Mis_grupos/2, etc. - Los grupos tienen su propio sidebar
  /^\/Mis_grupos\/\d+$/,
  // Ocultar sidebar global en la sección de miembros salidos (ya tiene sidebar de iglesia)
  /^\/Mi_iglesia\/[a-zA-Z0-9_-]+\/miembros_salidos.*$/,
]


