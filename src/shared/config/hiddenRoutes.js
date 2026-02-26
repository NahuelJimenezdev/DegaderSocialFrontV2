// src/shared/config/hiddenRoutes.js

/**
 * Rutas donde se deben ocultar ciertos componentes del layout (AdsSidebar, Sidebar, etc.)
 * Se pueden usar expresiones regulares (RegExp) para mayor flexibilidad.
 */

export const hideAdsSidebarRoutes = [
  // /Mis_Carpetas/id (allows alphanumeric IDs)
  /^\/Mis_carpetas\/[a-zA-Z0-9]+$/,
  // /mensajes/1, /mensajes/2, etc.
  /^\/mensajes(\/.*)?$/i,
  // /arena
  /^\/arena$/i,
]

export const hideSidebarRoutes = [
  // Ocultar sidebar global en la sección de miembros salidos (ya tiene sidebar de iglesia)
  /^\/Mi_iglesia\/[a-zA-Z0-9_-]+\/miembros_salidos.*$/,
]


