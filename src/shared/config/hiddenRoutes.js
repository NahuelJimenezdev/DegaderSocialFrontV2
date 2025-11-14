// src/shared/config/hiddenRoutes.js

/**
 * Rutas donde se deben ocultar ciertos componentes del layout (QuickSearch, Sidebar, etc.)
 * Se pueden usar expresiones regulares (RegExp) para mayor flexibilidad.
 */

export const hideQuickSearchRoutes = [
  // /Mis_grupos/1, /Mis_grupos/2, etc.
  /^\/Mis_grupos\/\d+$/,

  // /Mi_iglesia y todas sus subrutas (case-insensitive)
  /^\/mi_iglesia(\/.*)?$/i,
  // Ese patrón significa:
  //? ^\/Mi_iglesia → empieza con /Mi_iglesia
  //? (\/.*) ? → puede o no tener una barra y algo más después
  //? $ → fin de la cadena
  //? Si en algún momento tenés rutas con mayúsculas y minúsculas mezcladas, podés agregar el flag i (case-insensitive)

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
]
