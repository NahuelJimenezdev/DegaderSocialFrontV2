import nivelesPorPais from "./nivelesPorPais";

const capitalizar = (texto) =>
  texto ? texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase() : "";

const obtenerNivel = (usuario) => {
  
  const pais = usuario.fundacion?.territorio?.pais;
  const nivel = usuario.fundacion?.nivel?.toLowerCase();

  return nivelesPorPais[pais]?.[nivel] || capitalizar(nivel);
};

export const formatNivelDetallado = (usuario) => {
  const f = usuario.fundacion;
  if (!f) return "";

  const nivelTraduccion = obtenerNivel(usuario);
  const nivelKey = f.nivel?.toLowerCase();
  const t = f.territorio || {};

  switch (nivelKey) {
    case 'nacional':
      return `nivel nacional en ${t.pais || 'Global'}`;
    
    case 'departamental':
      return `a nivel ${nivelTraduccion.toLowerCase()} en ${t.departamento || 'N/A'} - ${t.pais || ''}`;
    
    case 'regional':
      return `a nivel regional - ${t.region || 'N/A'} - ${t.pais || ''}`;
    
    case 'municipal':
      return `a nivel municipal en ${t.municipio || 'N/A'} del departamento de ${t.departamento || 'N/A'} - ${t.pais || ''}`;
    
    default:
      return `a nivel ${nivelTraduccion.toLowerCase()} en ${t.pais || 'Global'}`;
  }
};

export default obtenerNivel;