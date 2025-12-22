/**
 * Utilidades para trabajar con datos de usuarios
 */

/**
 * Obtiene el nombre completo del usuario desde la estructura UserV2
 * @param {Object} user - Objeto usuario
 * @returns {string} Nombre completo del usuario
 */
export const getNombreCompleto = (user) => {
  if (!user) return 'Usuario';

  const nombre = user.nombres?.primero || '';
  const apellido = user.apellidos?.primero || '';

  return `${nombre} ${apellido}`.trim() || 'Usuario';
};

/**
 * Obtiene las iniciales del usuario para el avatar
 * @param {Object} user - Objeto usuario
 * @returns {string} Iniciales del usuario (ej: "JD")
 */
export const getIniciales = (user) => {
  if (!user) return 'U';

  const nombre = user.nombres?.primero || '';
  const apellido = user.apellidos?.primero || '';

  const inicialNombre = nombre.charAt(0).toUpperCase();
  const inicialApellido = apellido.charAt(0).toUpperCase();

  return `${inicialNombre}${inicialApellido}`.trim() || 'U';
};

/**
 * Obtiene el nombre para mostrar (nombre completo o email si no hay nombre)
 * @param {Object} user - Objeto usuario
 * @returns {string} Nombre para mostrar
 */
export const getNombreDisplay = (user) => {
  const nombreCompleto = getNombreCompleto(user);
  return nombreCompleto !== 'Usuario' ? nombreCompleto : user?.email || 'Usuario';
};


