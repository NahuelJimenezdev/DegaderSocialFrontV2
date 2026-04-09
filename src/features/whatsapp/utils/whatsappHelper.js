/**
 * Genera un enlace de WhatsApp con un mensaje predefinido para los usuarios de Degader Social.
 * 
 * ESTRUCTURA:
 * "Hola {nombres.primero + apellidos.primero}, ¿Cómo estás? En Degader Social deseamos que estés bien."
 */
export const getWhatsAppLink = (userData) => {
  if (!userData || !userData.personal?.celular) return null;

  const nombre = userData.nombres?.primero || '';
  const apellido = userData.apellidos?.primero || '';
  const fullName = `${nombre} ${apellido}`.trim();
  
  const message = `Hola ${fullName}, ¿Cómo estás? En Degader Social deseamos que estés bien.`;
  
  // Limpiar el número de teléfono (solo dígitos)
  const cleanPhone = userData.personal.celular.replace(/\D/g, '');
  
  // Retornar la URL de WhatsApp con el texto encodeado
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
