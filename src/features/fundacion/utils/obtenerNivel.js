import nivelesPorPais from "./nivelesPorPais";
import { NIVELES_DISPLAY } from "../../../shared/constants/fundacionConstants";

const capitalizar = (texto) =>
  texto ? texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase() : "";

const obtenerNivel = (usuario) => {
  
  const pais = usuario.fundacion?.territorio?.pais;
  const nivel = usuario.fundacion?.nivel?.toLowerCase();

  return nivelesPorPais[pais]?.[nivel] || NIVELES_DISPLAY[nivel] || capitalizar(nivel);
};

export const formatNivelDetallado = (usuario) => {
  const f = usuario.fundacion;
  if (!f) return "";

  const nivelTraduccion = obtenerNivel(usuario);
  const nivelKey = f.nivel?.toLowerCase();
  const t = f.territorio || {};

  switch (nivelKey) {
    case 'directivo_general':
    case 'organo_control':
    case 'organismo_internacional':
    case 'internacional':
      return `a nivel de ${nivelTraduccion}${t.pais ? ` (Base en ${t.pais})` : ''}`;
      
    case 'continental':
      return `a nivel ${nivelTraduccion.toLowerCase()} en ${t.region || t.pais || 'el continente'}`;

    case 'nacional':
      return `a nivel nacional en ${t.pais || 'Global'}`;
    
    case 'departamental':
      return `a nivel ${nivelTraduccion.toLowerCase()} en ${t.departamento || 'N/A'}, ${t.pais || ''}`;
    
    case 'regional':
      return `a nivel regional en ${t.region || 'N/A'}, ${t.pais || ''}`;
    
    case 'municipal':
      return `a nivel municipal en ${t.municipio || 'N/A'} (${t.departamento || 'N/A'}), ${t.pais || ''}`;
    
    default:
      return `a nivel ${nivelTraduccion.toLowerCase()}${t.pais ? ` en ${t.pais}` : ''}`;
  }
};

export const formatDescripcionInstitucional = (usuario) => {
  const f = usuario.fundacion;
  if (!f) return "Sin cargo";

  const cargo = f.cargo || "Miembro";
  const area = f.area;
  const nivel = f.nivel?.toLowerCase();
  const t = f.territorio || {};

  // Formatear el nivel de jurisdicción (Ej: "Nacional", "Municipal")
  const nivelTexto = NIVELES_DISPLAY[nivel] || capitalizar(nivel);

  // Reglas profesionales para mejorar títulos redundantes:
  let tituloFormat = cargo;

  // 1. Si es Director General territorial, fusionar cargo y nivel (Ej: Director General Nacional -> Director Nacional)
  const esTerritorial = ['nacional', 'regional', 'departamental', 'municipal', 'continental'].includes(nivel);
  if (cargo === 'Director General' && esTerritorial) {
      if (nivel === 'nacional') tituloFormat = 'Director Nacional';
      else if (nivel === 'regional') tituloFormat = 'Director Regional';
      else if (nivel === 'departamental') tituloFormat = 'Director Departamental';
      else if (nivel === 'municipal') tituloFormat = 'Director Municipal';
      else if (nivel === 'continental') tituloFormat = 'Director Continental';
  } else if (cargo === 'Subdirector General' && esTerritorial) {
      if (nivel === 'nacional') tituloFormat = 'Subdirector Nacional';
      else if (nivel === 'regional') tituloFormat = 'Subdirector Regional';
      else if (nivel === 'departamental') tituloFormat = 'Subdirector Departamental';
      else if (nivel === 'municipal') tituloFormat = 'Subdirector Municipal';
      else if (nivel === 'continental') tituloFormat = 'Subdirector Continental';
  } else if (cargo === 'Secretario Director General' && esTerritorial) {
      if (nivel === 'nacional') tituloFormat = 'Secretario Nacional';
      else if (nivel === 'regional') tituloFormat = 'Secretario Regional';
      else if (nivel === 'departamental') tituloFormat = 'Secretario Departamental';
      else if (nivel === 'municipal') tituloFormat = 'Secretario Municipal';
      else if (nivel === 'continental') tituloFormat = 'Secretario Continental';
  }

  // 2. Preposición de Área
  let areaFormat = "";
  if (area) {
    if (area === "Dirección y organismo Ejecutivo" || area === "Dirección Ejecutiva") {
      areaFormat = "en la Dirección Ejecutiva";
    } else {
      areaFormat = `en el área de ${area}`;
      // Ajuste gramatical según la primera palabra
      let lowerArea = area.toLowerCase();
      if (lowerArea.startsWith('dirección') || lowerArea.startsWith('coordinación') || lowerArea.startsWith('gerencia') || lowerArea.startsWith('junta') || lowerArea.startsWith('secretaría')) {
        areaFormat = `en la ${area}`;
      } else if (lowerArea.startsWith('programa') || lowerArea.startsWith('despacho') || lowerArea.startsWith('equipo')) {
        areaFormat = `en el ${area}`;
      } else if (lowerArea.startsWith('fhisyl')) {
          areaFormat = ""; // Limpiar redundancia si eligieron FHISYL
      }
    }
  }

  // 3. Jurisdicción y Territorio
  let jurisdiccion = "";
  if (nivel === 'afiliado') {
      jurisdiccion = `desde ${t.pais || 'su país'}`;
  } else {
      switch (nivel) {
        case 'directivo_general':
        case 'organo_control':
        case 'organismo_internacional':
        case 'internacional':
          jurisdiccion = `(Asignación Global${t.pais ? ` base en ${t.pais}` : ''})`;
          break;
        case 'continental':
          jurisdiccion = `para ${t.region || t.pais || 'el continente'}`;
          break;
        case 'nacional':
          jurisdiccion = `en la República de ${t.pais || 'su país'}`;
          break;
        case 'departamental':
          jurisdiccion = `para la entidad de ${t.departamento || 'N/A'}, ${t.pais || ''}`;
          break;
        case 'regional':
          jurisdiccion = `para la región de ${t.region || 'N/A'}, ${t.pais || ''}`;
          break;
        case 'municipal':
          jurisdiccion = `para el municipio de ${t.municipio || 'N/A'} (${t.departamento || 'N/A'}), ${t.pais || ''}`;
          break;
        default:
          jurisdiccion = `en ${t.pais || 'Global'}`;
      }
  }

  // Filtrar espacios extra
  const cleanStr = [tituloFormat, areaFormat, jurisdiccion].filter(Boolean).map(s => s.trim()).join(" ");
  return `Se desempeña como ${cleanStr}`;
};

export default obtenerNivel;