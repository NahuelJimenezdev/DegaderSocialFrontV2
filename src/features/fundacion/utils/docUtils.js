import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import ImageModule from 'docxtemplater-image-module-free';

/**
 * Sanitiza recursivamente un objeto para asegurar que no haya valores null/undefined
 * que puedan romper docxtemplater, y asegura que las listas sean arrays.
 */
const sanitizeData = (data) => {
  if (data === null || data === undefined) return "";
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }
  
  if (typeof data === 'object') {
    const sanitized = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        sanitized[key] = sanitizeData(data[key]);
      }
    }
    return sanitized;
  }
  
  return data;
};
const EMPTY_IMAGE = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const processSignatureImage = (base64) => {
  return new Promise((resolve) => {
    if (!base64 || typeof base64 !== 'string' || !base64.startsWith('data:image')) {
      console.warn('processSignatureImage: base64 inválido o vacío');
      return resolve(null);
    }
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width || 180;
      canvas.height = img.height || 60;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('processSignatureImage: No se pudo obtener el contexto 2d');
        return resolve(base64);
      }
      ctx.drawImage(img, 0, 0);
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData && imageData.data) {
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            if (data[i] > 200 && data[i + 1] > 200 && data[i + 2] > 200) data[i + 3] = 0;
          }
          ctx.putImageData(imageData, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          resolve(base64);
        }
      } catch (e) {
        console.error('processSignatureImage: Error al procesar píxeles', e);
        resolve(base64);
      }
    };
    img.onerror = () => {
      console.error('processSignatureImage: Error al cargar la imagen');
      resolve(null);
    };
    img.src = base64;
  });
};

/**
 * Obtiene el contenido binario de una imagen (Base64 o URL vía proxy)
 */
const getBinary = async (tagValue) => {
  console.log('getBinary invocado con:', tagValue);
  // Fallback a imagen transparente 1x1 para evitar errores de length de docxtemplater
  if (!tagValue || tagValue === '' || tagValue === '---' || typeof tagValue !== 'string') {
    const binaryString = window.atob(EMPTY_IMAGE);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  try {
    const strVal = tagValue.toString();
    // Caso 1: Es una data URI (Base64)
    if (strVal.startsWith('data:image')) {
      console.log('getBinary: procesando data:image');
      const parts = strVal.split(',');
      if (parts.length < 2) throw new Error('Formato data:image inválido');
      const binaryString = window.atob(parts[1]);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    }

    // Caso 2: Es una URL de imagen (requiere proxy para evitar CORS)
    const baseUrl = import.meta.env.VITE_API_URL || 'https://degadersocial.com/api';
    let finalUrl = strVal;
    
    // Corregir rutas relativas si es necesario
    if (strVal.startsWith('/') && !strVal.startsWith('//')) {
      finalUrl = `${baseUrl.replace('/api', '')}${strVal}`;
    }

    console.log('getBinary: descargando vía proxy:', finalUrl);
    const proxyUrl = `${baseUrl}/upload/proxy?url=${encodeURIComponent(finalUrl)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status} al descargar imagen`);

    const buffer = await response.arrayBuffer();
    console.log('getBinary: descarga exitosa, tamaño:', buffer.byteLength);
    return new Uint8Array(buffer);
  } catch (error) {
    console.warn('Error en getBinary, usando fallback vacío:', error.message);
    const binaryString = window.atob(EMPTY_IMAGE);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
       bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
};

export const generateCV = async (userData) => {
  const meta = userData.fundacion || {};
  const formData = meta.hojaDeVida?.datos || {};
  
  // Plantilla configurable desde el usuario o por defecto
  const templatePath = meta.hojaDeVida?.templatePath || '/templates/FORMATO HOJA DE VIDA FHISYL.docx';
  
  const response = await fetch(templatePath);
  if (!response.ok) {
    console.warn(`No se pudo cargar la plantilla en ${templatePath}, reintentando con la por defecto.`);
    const fallbackResponse = await fetch('/templates/FORMATO HOJA DE VIDA FHISYL.docx');
    if (!fallbackResponse.ok) throw new Error('No se pudo cargar ninguna plantilla de Hoja de Vida.');
    var content = await fallbackResponse.arrayBuffer();
  } else {
    var content = await response.arrayBuffer();
  }
  
  const zip = new PizZip(content);
  
  const opts = {
    centered: false,
    getImage: getBinary,
    getSize: (img, tagValue, tagName) => {
      if (tagName === 'foto_perfil' || tagName === 'fotoUser') return [110, 140];
      if (tagName === 'firma_digital' || tagName === 'firmaUser') return [180, 60];
      return [100, 100];
    },
  };
  
  const doc = new Docxtemplater(zip, { 
    paragraphLoop: true, 
    linebreaks: true, 
    modules: [new ImageModule(opts)], 
    nullGetter: () => "" 
  });
  
  console.log('Pre-cargando binarios de imágenes...');
  const photoData = await getBinary(formData.foto_perfil || '');
  
  let firma = formData.firma_digital || '';
  if (firma.startsWith('data:image')) firma = await processSignatureImage(firma);
  const firmaData = await getBinary(firma);

  const rawData = formData;
  const dataToRender = sanitizeData({
    ...rawData,
    foto_perfil: photoData,
    fotoUser: photoData,
    firma_digital: firmaData,
    firmaUser: firmaData,
    seleccionar_tecnica: rawData.seleccionar_tecnica ? 'X' : '',
    seleccionar_tecnologica: rawData.seleccionar_tecnologica ? 'X' : '',
    seleccionar_profesional: rawData.seleccionar_profesional ? 'X' : '',
    seleccionar_postgrado: rawData.seleccionar_postgrado ? 'X' : '',
    sol_si: rawData.solicitud_ingreso === 'si' ? 'X' : '',
    sol_no: rawData.solicitud_ingreso === 'no' ? 'X' : '',
    autorizo_si: rawData.autorizo_si ? 'X' : '',
    autorizo_no: rawData.autorizo_no ? 'X' : '',
    'fraseUser': rawData.frase_identificadora || '',
    'descripMain': rawData.descripcion_breve_ministerio_profesion || '',
    'profesion_personal _2': rawData.profesion_personal_2 || '',
    'profesion_personal _3': rawData.profesion_personal_3 || '',
    'sector_publica_1': rawData.sector_empresa === 'publica' ? 'X' : '',
    'sector_privada_1': rawData.sector_empresa === 'privada' ? 'X' : '',
    'sector_publica_2': rawData.sector_empresa2 === 'publica' ? 'X' : '',
    'sector_privada_2': rawData.sector_empresa2 === 'privada' ? 'X' : '',
    'sector_publica_3': rawData.sector_empresa3 === 'publica' ? 'X' : '',
    'sector_privada_3': rawData.sector_empresa3 === 'privada' ? 'X' : ''
  });

  console.log('Datos sanitizados listos para renderizar:', dataToRender);
  
  try {
    await doc.renderAsync(dataToRender);
  } catch (renderError) {
    console.error('Error detallado en renderAsync:', renderError);
    if (renderError.properties && renderError.properties.errors) {
      console.error('Errores de validación de Docxtemplater:', renderError.properties.errors);
    }
    throw renderError;
  }

  return doc.getZip().generate({ 
    type: 'blob', 
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
  });
};

const getHtmlBase = (title, bodyContent) => `
  <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Arial', sans-serif; color: #333; line-height: 1.4; padding: 20px; }
        .header { text-align: center; border-bottom: 3px solid #1e3a8a; padding-bottom: 10px; margin-bottom: 20px; }
        .title { color: #1e3a8a; font-size: 22px; font-weight: bold; margin: 0; text-transform: uppercase; }
        .subtitle { color: #444; font-size: 16px; margin-top: 5px; font-weight: bold; }
        .section { background: #e5e7eb; padding: 8px; font-weight: bold; margin: 15px 0 10px 0; border-left: 5px solid #1e3a8a; color: #1e3a8a; }
        .field { margin-bottom: 6px; font-size: 12px; }
        .label { font-weight: bold; color: #374151; width: 180px; display: inline-block; }
        .value { color: #000; border-bottom: 1px solid #ccc; min-width: 150px; display: inline-block; }
        .block-text { margin-top: 5px; padding: 10px; border: 1px solid #e5e7eb; background: #fff; font-size: 12px; }
        .footer { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; font-size: 10px; color: #666; text-align: center; }
        ul, ol { margin-top: 5px; margin-bottom: 5px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <p class="title">${title}</p>
        <p class="subtitle">Fundación Humanitaria Internacional Sol y Luna</p>
      </div>
      ${bodyContent}
      <div class="footer">Este documento es confidencial y propiedad intelectual de la FHSYL - Generado el ${new Date().toLocaleDateString()}</div>
    </body>
  </html>
`;

export const generateFHSYL = (userData) => {
  const data = userData.fundacion?.documentacionFHSYL || {};
  const nombreC = `${userData.nombres?.primero || ''} ${userData.apellidos?.primero || ''}`;
  
  const content = getHtmlBase('Aplicativo República Argentina', `
    <div class="section">1. DATOS PERSONALES</div>
    <div class="field"><span class="label">Nombre completo:</span> <span class="value">${data.nombreCompleto || nombreC}</span></div>
    <div class="field"><span class="label">Dirección:</span> <span class="value">${data.direccion || ''}</span></div>
    <div class="field"><span class="label">Localidad / Barrio:</span> <span class="value">${data.localidad || ''} / ${data.barrio || ''}</span></div>
    <div class="field"><span class="label">UPZ:</span> <span class="value">${data.upz || ''}</span></div>
    <div class="field"><span class="label">Celular / Email:</span> <span class="value">${data.celular || ''} / ${userData.email || ''}</span></div>
    <div class="field"><span class="label">Ocupación / Estado Civil:</span> <span class="value">${data.ocupacion || ''} / ${data.estadoCivil || ''}</span></div>
    <div class="field"><span class="label">Cónyuge:</span> <span class="value">${data.nombreConyuge || 'N/A'}</span></div>
    
    <div class="field"><b>Hijos:</b></div>
    <ul>
      ${(data.hijos || []).map(h => `<li>${h.nombre} (${h.edad} años)</li>`).join('') || '<li>Sin hijos registrados</li>'}
    </ul>

    <div class="section">2. COORDINACIÓN Y LIDERAZGO</div>
    <div class="field"><span class="label">¿Desea ser Coordinador?:</span> <span class="value">${data.deseaSerCoordinadorLocalidad ? 'SÍ' : 'NO'}</span></div>
    <div class="field"><span class="label">Localidad a Coordinar:</span> <span class="value">${data.localidadCoordinar || 'N/A'}</span></div>

    <div class="section">3. VIDA Y MINISTERIO</div>
    <div class="field"><b>Testimonio de conversión:</b></div>
    <div class="block-text">${data.testimonioConversion || 'Pendiente'}</div>
    
    <div class="field"><b>Llamado Pastoral:</b></div>
    <div class="block-text">${data.llamadoPastoral || 'Pendiente'}</div>

    <div class="field"><b>Virtudes Personales:</b></div>
    <ul>${(data.virtudes || []).map(v => `<li>${v}</li>`).join('')}</ul>

    <div class="field"><b>Áreas a Mejorar:</b></div>
    <ul>${(data.areasMejora || []).map(v => `<li>${v}</li>`).join('')}</ul>

    <div class="field"><b>Eventos de Éxito en Ministerio:</b></div>
    <ul>${(data.eventosExito || []).map(v => `<li>${v}</li>`).join('')}</ul>

    <div class="field"><span class="label">Congregación que pastorea:</span> <span class="value">${data.nombreCongregacionPastorea || ''}</span></div>
    <div class="field"><span class="label">Alianza / Concilio:</span> <span class="value">${data.alianzaPastores || ''}</span></div>

    <div class="section">4. REFERENCIAS Y OTROS</div>
    ${(data.referencias || []).map((ref, i) => `
      <div class="field"><b>Ref ${i+1}:</b> ${ref.nombre} (${ref.relacion}) - ${ref.contacto}</div>
    `).join('')}

    <div class="field"><span class="label">Invitado por el Pastor:</span> <span class="value">${data.pastorQueInvito || ''}</span></div>
    
    <div class="section">5. PREGUNTAS FINALES</div>
    <div class="field"><span class="label">¿Tiene Casa Propia?:</span> <span class="value">${data.tieneCasaPropia ? 'SÍ' : 'NO'}</span></div>
    <div class="field"><span class="label">¿Iglesia tiene propiedad?:</span> <span class="value">${data.iglesiaTienePropiedad ? 'SÍ' : 'NO'}</span></div>
    
    <div class="field"><b>Necesidades Fam. Pastoral:</b></div>
    <ul>${(data.necesidadesFamiliaPastoral || []).map(v => `<li>${v}</li>`).join('')}</ul>
    
    <div class="field"><b>Necesidades Congregación:</b></div>
    <ul>${(data.necesidadesCongregacion || []).map(v => `<li>${v}</li>`).join('')}</ul>

    <div class="field"><span class="label">Profesionales en Iglesia:</span> <span class="value">${data.profesionalesIglesia || 'N/A'}</span></div>
    <div class="field"><b>Proyecto Psicosocial a Desarrollar:</b></div>
    <div class="block-text">${data.proyectoPsicosocial || 'No especificado'}</div>
  `);
  return new Blob(['\ufeff', content], { type: 'application/msword' });
};

export const generateEntrevista = (userData) => {
  const resp = userData.fundacion?.entrevista?.respuestas || {};
  const content = getHtmlBase('Entrevista Institucional', `
    <div class="section">I. INFORMACIÓN Y MINISTERIO</div>
    <div class="field"><span class="label">Postulante:</span> <span class="value">${resp.nombre || ''}</span></div>
    <div class="field"><span class="label">Fecha Nacimiento:</span> <span class="value">${resp.fechaNacimiento || ''}</span></div>
    <div class="field"><span class="label">UPZ / Localidad:</span> <span class="value">${resp.upzLocalidad || ''}</span></div>
    
    <div class="field"><b>¿Cuál es su llamado?:</b></div>
    <div class="block-text">${resp.llamado || ''}</div>
    
    <div class="field"><b>¿Qué es lo que más le gusta hacer?:</b></div>
    <div class="block-text">${resp.loQueMasGusta || ''}</div>

    <div class="section">II. CARÁCTER Y SUJECIÓN</div>
    <div class="field"><span class="label">Amigos dirían:</span> <span class="value">${resp.caracterAmigos || ''}</span></div>
    <div class="field"><span class="label">Compañeros dirían:</span> <span class="value">${resp.caracterCompañeros || ''}</span></div>
    
    <div class="field"><b>Respuesta ante situaciones difíciles:</b></div>
    <div class="block-text">${resp.respuestaSituacion || ''}</div>

    <div class="field"><span class="label">Autoridad Espiritual:</span> <span class="value">${resp.autoridadEspiritual || ''}</span></div>
    <div class="field"><span class="label">Manejo de Diferencias:</span> <span class="value">${resp.manejoDiferencias || ''}</span></div>

    <div class="section">III. DONES Y COMPETENCIAS</div>
    <div class="field"><b>Dones espirituales:</b></div>
    <div class="block-text">${resp.dones || ''}</div>
    
    <div class="field"><b>Talentos naturales:</b></div>
    <div class="block-text">${resp.talentos || ''}</div>

    <div class="field"><span class="label">Profesión:</span> <span class="value">${resp.profesion || ''}</span></div>
    <div class="field"><span class="label">Maneja Word/Excel:</span> <span class="value">${resp.manejaOffice || ''}</span></div>

    <div class="section">IV. FAMILIA Y COMPROMISO</div>
    <div class="field"><b>Vínculo Familiar:</b></div>
    <div class="block-text">${resp.vinculoFamiliar || ''}</div>
    
    <div class="field"><span class="label">Tiempo Pastoreando:</span> <span class="value">${resp.tiempoPastoreando || ''}</span></div>
    <div class="field"><span class="label">Disponibilidad de Tiempo:</span> <span class="value">${resp.disponibilidadTiempo || ''}</span></div>
    
    <div class="field"><b>Palabras Voluntarias:</b></div>
    <div class="block-text">${resp.palabrasVoluntarias || ''}</div>
  `);
  return new Blob(['\ufeff', content], { type: 'application/msword' });
};

export const generateSolicitud = (userData) => {
  const f = userData.fundacion || {};
  const t = f.territorio || {};
  const content = getHtmlBase('Solicitud de Ingreso', `
    <div class="section">ESTRUCTURA ORGANIZACIONAL</div>
    <div class="field"><span class="label">Nivel Jerárquico:</span> <span class="value">${(f.nivel || '').replace(/_/g, ' ').toUpperCase()}</span></div>
    <div class="field"><span class="label">Cargo Institucional:</span> <span class="value">${f.cargo || ''}</span></div>
    <div class="field"><span class="label">Área / Dirección:</span> <span class="value">${f.area || 'N/A'}</span></div>
    ${f.subArea ? `<div class="field"><span class="label">Sub-Área:</span> <span class="value">${f.subArea}</span></div>` : ''}
    ${f.programa ? `<div class="field"><span class="label">Programa:</span> <span class="value">${f.programa}</span></div>` : ''}

    <div class="section">UBICACIÓN TERRITORIAL (JURISDICCIÓN)</div>
    <div class="field"><span class="label">País:</span> <span class="value">${t.pais || ''}</span></div>
    ${t.region ? `<div class="field"><span class="label">Región:</span> <span class="value">${t.region}</span></div>` : ''}
    ${t.departamento ? `<div class="field"><span class="label">Departamento / Prov:</span> <span class="value">${t.departamento}</span></div>` : ''}
    ${t.municipio ? `<div class="field"><span class="label">Municipio / Ciudad:</span> <span class="value">${t.municipio}</span></div>` : ''}
    ${t.barrio ? `<div class="field"><span class="label">Barrio / Vereda:</span> <span class="value">${t.barrio}</span></div>` : ''}

    <div class="section">ESTADO DE CUENTA</div>
    <div class="field"><span class="label">Estado de Aprobación:</span> <span class="value">${(f.estadoAprobacion || 'pendiente').toUpperCase()}</span></div>
    <div class="field"><span class="label">Fecha de Ingreso:</span> <span class="value">${f.fechaIngreso ? new Date(f.fechaIngreso).toLocaleDateString() : 'N/A'}</span></div>
  `);
  return new Blob(['\ufeff', content], { type: 'application/msword' });
};

export const generateUserZip = async (userData) => {
  const zip = new PizZip();
  const name = `${userData.nombres?.primero || 'Usuario'}_${userData.apellidos?.primero || ''}`.replace(/\s+/g, '_');
  
  // 1. Hoja de Vida (Word)
  const cvBlob = await generateCV(userData);
  zip.file(`1.Hoja_de_Vida_${name}.docx`, await cvBlob.arrayBuffer());
  
  // 2. FHSYL (Word)
  const fhsylBlob = generateFHSYL(userData);
  zip.file(`2.Aplicativo_FHSYL_${name}.doc`, await fhsylBlob.arrayBuffer());
  
  // 3. Entrevista (Word)
  const entrevistaBlob = generateEntrevista(userData);
  zip.file(`3.Entrevista_${name}.doc`, await entrevistaBlob.arrayBuffer());
  
  // 4. Solicitud (Word)
  const solicitudBlob = generateSolicitud(userData);
  zip.file(`4.Solicitud_Ingreso_${name}.doc`, await solicitudBlob.arrayBuffer());
  
  const content = zip.generate({ type: 'blob' });
  saveAs(content, `Documentacion_${name}.zip`);
};
