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
  
  // GUARDIA: No tocar datos binarios (evita corrupción de imágenes)
  if (data instanceof Uint8Array || data instanceof ArrayBuffer || (typeof Blob !== 'undefined' && data instanceof Blob)) {
    return data;
  }
  
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
  console.log('getBinary invocado con:', typeof tagValue === 'string' ? tagValue.substring(0, 80) + '...' : tagValue);
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

    // Caso 2: Es una URL de imagen
    const baseUrl = import.meta.env.VITE_API_URL || 'https://degadersocial.com/api';
    let finalUrl = strVal;
    
    // Corregir rutas relativas (asegurar que empiecen con / si no son URLs completas ni base64)
    if (!strVal.startsWith('http') && !strVal.startsWith('data:') && !strVal.startsWith('//')) {
      const leadingSlash = strVal.startsWith('/') ? '' : '/';
      finalUrl = `${baseUrl.replace('/api', '')}${leadingSlash}${strVal}`;
    }

    // Caso 2a: URLs de R2 (directamente accesibles sin proxy)
    if (finalUrl.includes('.r2.dev/') || finalUrl.includes('r2.cloudflarestorage.com')) {
      console.log('getBinary: descargando directamente desde R2:', finalUrl);
      try {
        const response = await fetch(finalUrl);
        if (response.ok) {
          const buffer = await response.arrayBuffer();
          console.log('getBinary: descarga directa R2 exitosa, tamaño:', buffer.byteLength);
          return new Uint8Array(buffer);
        }
        console.warn('getBinary: descarga directa R2 falló (HTTP', response.status, '), intentando proxy...');
      } catch (directErr) {
        console.warn('getBinary: fetch directo R2 falló, intentando proxy...', directErr.message);
      }
    }

    // Caso 2b: Usar proxy para evitar CORS
    console.log('getBinary: descargando vía proxy:', finalUrl);
    const proxyUrl = `${baseUrl}/upload/proxy?url=${encodeURIComponent(finalUrl)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status} al descargar imagen vía proxy`);

    const buffer = await response.arrayBuffer();
    console.log('getBinary: descarga vía proxy exitosa, tamaño:', buffer.byteLength);
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

/**
 * Convierte un Map o Objeto de datos en un objeto plano para generadores de documentos
 */
const ensurePlainObject = (data) => {
  if (!data) return {};
  if (typeof data.get === 'function' && typeof data.forEach === 'function') {
    const obj = {};
    data.forEach((v, k) => { obj[k] = v; });
    return obj;
  }
  return data;
};

export const generateCV = async (userData, overrideData = null, overridePhotos = null) => {
  const meta = userData.fundacion || {};
  const rawFormData = overrideData || meta.hojaDeVida?.datos || {};
  const formData = ensurePlainObject(rawFormData);
  
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
    getImage: (tagValue) => {
      console.log('getImage (Sync) invocado. Tipo de dato:', (tagValue instanceof Uint8Array ? 'Uint8Array' : typeof tagValue));
      if (tagValue instanceof Uint8Array) return tagValue;
      
      try {
        const binaryString = window.atob(EMPTY_IMAGE);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
      } catch (e) {
        return new Uint8Array(0);
      }
    },
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
  const photoSource = overridePhotos?.photo || 
                    formData.foto_perfil || 
                    formData.foto_perfil_form || 
                    formData.fotoUser || 
                    userData.social?.fotoPerfil || '';
  const photoData = await getBinary(photoSource);
  
  let firmaSource = overridePhotos?.firma || formData.firma_digital || formData.firmaUser || '';
  if (firmaSource.startsWith('data:image')) firmaSource = await processSignatureImage(firmaSource);
  const firmaData = await getBinary(firmaSource);

  const rawData = { ...formData };
  
  // 🔍 DEBUG: Log de datos que llegan para renderizar
  console.log('📄 [DOC GEN] Datos antes de renderizar CV:', {
    hasFormData: Object.keys(formData).length > 0,
    nombre: formData.nombre_completo || 'N/D',
    completado: meta.hojaDeVida?.completado
  });

  // 🆕 1. ASEGURAR QUE TENEMOS DATOS BÁSICOS SI NO VIENEN EN EL FORM (Fallback agresivo)
  if (!rawData.nombre_completo && userData.nombres) {
    rawData.nombre_completo = `${userData.nombres.primero} ${userData.nombres.segundo || ''} ${userData.apellidos?.primero || ''} ${userData.apellidos?.segundo || ''}`.trim().replace(/\s+/g, ' ');
  }
  if (!rawData.email && userData.email) rawData.email = userData.email;
  if (!rawData.telefono && userData.personal?.celular) rawData.telefono = userData.personal.celular;
  if (!rawData.direccion && userData.personal?.direccion) rawData.direccion = userData.personal.direccion;
  if (!rawData.municipio && userData.personal?.ubicacion?.ciudad) rawData.municipio = userData.personal.ubicacion.ciudad;
  if (!rawData.departamento_estado_provincia && userData.personal?.ubicacion?.estado) {
    rawData.departamento_estado_provincia = userData.personal.ubicacion.estado;
  }
  
  // Soporte para variaciones de nombres de campos (Fuzzy Mapping)
  if (rawData.profesion_personal2) rawData.profesion_personal_2 = rawData.profesion_personal2;
  if (rawData.profesion_personal3) rawData.profesion_personal_3 = rawData.profesion_personal3;
  if (rawData.profesion2_personal) rawData.profesion_personal_2 = rawData.profesion2_personal;
  if (rawData.profesion3_personal) rawData.profesion_personal_3 = rawData.profesion3_personal;
  
  // Asegurar que las referencias tengan el espacio correcto (algunos templates tienen 'profesion_personal _2' con espacio)
  if (rawData.profesion_personal_2) rawData['profesion_personal _2'] = rawData.profesion_personal_2;
  if (rawData.profesion_personal_3) rawData['profesion_personal _3'] = rawData.profesion_personal_3;

  if (!rawData.documento_num && (rawData.doc_num || rawData.documento || rawData.cedula)) {
    rawData.documento_num = rawData.doc_num || rawData.documento || rawData.cedula;
  }
  if (!rawData.lugar_expedicion && (rawData.lugar_exp || rawData.expedicion)) {
    rawData.lugar_expedicion = rawData.lugar_exp || rawData.expedicion;
  }

  const dataToRender = sanitizeData({
    ...rawData,
    foto_perfil: photoData,
    fotoUser: photoData,
    firma_digital: firmaData,
    firmaUser: firmaData,
    seleccionar_tecnica: rawData.seleccionar_tecnica ? 'X' : '',
    seleccionar_tecnologica: rawData.seleccionar_tecnologica ? 'X' : '',
    seleccionar_universitario: rawData.seleccionar_universitario ? 'X' : '',
    seleccionar_posgrado: rawData.seleccionar_posgrado ? 'X' : '',
    graduadoSi_1: rawData.graduadoSi_1 ? 'X' : '',
    graduadoNo_1: rawData.graduadoNo_1 ? 'X' : '',
    graduadoSi_2: rawData.graduadoSi_2 ? 'X' : '',
    graduadoNo_2: rawData.graduadoNo_2 ? 'X' : '',
    graduadoSi_3: rawData.graduadoSi_3 ? 'X' : '',
    graduadoNo_3: rawData.graduadoNo_3 ? 'X' : '',
    exp_si1: rawData.exp_si1 ? 'X' : '',
    exp_no1: rawData.exp_no1 ? 'X' : '',
    exp_si2: rawData.exp_si2 ? 'X' : '',
    exp_no2: rawData.exp_no2 ? 'X' : '',
    exp_si3: rawData.exp_si3 ? 'X' : '',
    exp_no3: rawData.exp_no3 ? 'X' : '',
    autorizo_si: rawData.autorizo_si ? 'X' : '',
    autorizo_no: rawData.autorizo_no ? 'X' : '',
    'fraseUser': rawData.frase_identificadora || '',
    'descripMain': rawData.descripcion_breve_ministerio_profesion || '',
    'grado1': rawData.grado1 || '', 'grado2': rawData.grado2 || '', 'grado3': rawData.grado3 || '',
    'grado4': rawData.grado4 || '', 'grado5': rawData.grado5 || '', 'grado6': rawData.grado6 || '',
    'grado7': rawData.grado7 || '', 'grado8': rawData.grado8 || '', 'grado9': rawData.grado9 || '',
    'grado10': rawData.grado10 || '', 'grado11': rawData.grado11 || '',
    'profesion_personal_2': rawData.profesion_personal_2 || rawData.profesion_personal2 || rawData['profesion_personal _2'] || '',
    'profesion_personal_3': rawData.profesion_personal_3 || rawData.profesion_personal3 || rawData['profesion_personal _3'] || '',
    'telefono_empresa_1': rawData.telefono_empresa || rawData.teléfono_emrpesa || '',
    'telefono_empresa_2': rawData.telefono_empresa2 || rawData.teléfono_emrpesa2 || '',
    'telefono_empresa_3': rawData.telefono_empresa3 || rawData.teléfono_emrpesa3 || '',
    'direccion_empresa_1': rawData.direccion_empresa || rawData.dirección_empresa || '',
    'direccion_empresa_2': rawData.direccion_empresa2 || rawData.dirección_empresa2 || '',
    'direccion_empresa_3': rawData.direccion_empresa3 || rawData.dirección_empresa3 || '',
    'nombres_completos': rawData.nombre_completo || '',
    'cedula': rawData.documento_num || '',
    'lugar_de_expedicion': rawData.lugar_expedicion || '',
    'pais_nacionalidad': rawData.nacionalidad || '',
    'sector_publico_1': rawData.sector_empresa === 'publica' ? 'X' : '',
    'sector_privado_1': rawData.sector_empresa === 'privada' ? 'X' : '',
    'sector_publico_2': rawData.sector_empresa2 === 'publica' ? 'X' : '',
    'sector_privado_2': rawData.sector_empresa2 === 'privada' ? 'X' : '',
    'sector_publico_3': rawData.sector_empresa3 === 'publica' ? 'X' : '',
    'sector_privado_3': rawData.sector_empresa3 === 'privada' ? 'X' : '',
    'empresa_1': rawData.empresa_actual || '',
    'empresa_2': rawData.empresa_dos || '',
    'empresa_3': rawData.empresa_tres || '',
    'cargo_1': rawData.cargo_empresa || '',
    'cargo_2': rawData.cargo_empresa2 || '',
    'cargo_3': rawData.cargo_empresa3 || '',
    'sol_si': rawData.solicitud_ingreso === 'si' ? 'X' : '',
    'sol_no': rawData.solicitud_ingreso === 'no' ? 'X' : ''
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

/**
 * Función unificada para descargar la Hoja de Vida con el nombre de archivo correcto.
 */
export const downloadCV = async (userData, overrideData = null, overridePhotos = null) => {
  try {
    const blob = await generateCV(userData, overrideData, overridePhotos);
    const meta = userData.fundacion || {};
    const formData = overrideData || meta.hojaDeVida?.datos || {};
    
    // Generación de nombre de archivo idéntica a la del formulario del usuario
    const fullName = formData.nombre_completo || 
                   `${userData.nombres?.primero || ''} ${userData.nombres?.segundo || ''} ${userData.apellidos?.primero || ''} ${userData.apellidos?.segundo || ''}`.trim().replace(/\s+/g, ' ') || 
                   'Usuario';
                   
    const fileName = `Hoja_de_Vida_${fullName.replace(/\s+/g, '_')}.docx`;
    
    saveAs(blob, fileName);
    return true;
  } catch (error) {
    console.error('Error en downloadCV:', error);
    throw error;
  }
};


const getHtmlBase = (title, bodyContent) => `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
    <meta charset="utf-8">
    <title>${title}</title>
    <!--[if gte mso 9]>
    <xml>
        <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
    </xml>
    <![endif]-->
    <style>
        @page { size: 8.5in 11in; margin: 1in; }
        body { font-family: 'Calibri', 'Arial', sans-serif; color: #333; line-height: 1.5; font-size: 11pt; }
        .header { text-align: center; border-bottom: 2pt solid #1e3a8a; margin-bottom: 20px; padding-bottom: 10px; }
        .title { color: #1e3a8a; font-size: 18pt; font-weight: bold; margin: 0; text-transform: uppercase; }
        .section { background: #f3f4f6; padding: 5pt; font-weight: bold; margin: 15pt 0 5pt 0; border-left: 4pt solid #1e3a8a; color: #1e3a8a; font-size: 12pt; }
        .field { margin-bottom: 4pt; clear: both; }
        .label { font-weight: bold; color: #374151; width: 160pt; display: inline-block; }
        .value { color: #000; border-bottom: 0.5pt solid #ddd; padding: 1pt; }
        .block-text { margin-top: 5pt; padding: 8pt; border: 0.5pt solid #e5e7eb; background: #fafafa; font-size: 10pt; min-height: 40pt; }
        .footer { margin-top: 40pt; border-top: 0.5pt solid #ddd; padding-top: 10pt; font-size: 8pt; color: #666; text-align: center; }
        .signature-box { margin-top: 30pt; text-align: center; border-top: 1pt solid #000; width: 200pt; padding-top: 5pt; }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">${title}</h1>
        <p style="margin:0; font-weight:bold; color:#1e3a8a;">FUNDACIÓN HUMANITARIA INTERNOS SOL Y LUNA</p>
    </div>
    ${bodyContent}
    <div class="footer">
        Documento Generado el ${new Date().toLocaleDateString()} • DegaderSocial Platform • Propiedad Intelectual FHSYL
    </div>
</body>
</html>
`;

export const generateFHSYL = async (userData, firmaB64 = null) => {
  const data = userData.fundacion?.documentacionFHSYL || {};
  const nombreC = `${userData.nombres?.primero || ''} ${userData.apellidos?.primero || ''}`;
  
  // Si no llega firma por parámetro, intentar obtenerla del usuario
  let finalFirmaB64 = firmaB64;
  if (!finalFirmaB64) {
    const firmaUrl = userData.fundacion?.hojaDeVida?.datos?.firma_digital || 
                     userData.fundacion?.hojaDeVida?.datos?.get?.('firma_digital') ||
                     userData.social?.firma; 
    if (firmaUrl) {
      try {
        const binary = await getBinary(firmaUrl);
        // Convertir binary (Uint8Array) a base64 para el HTML
        const blob = new Blob([binary], { type: 'image/png' });
        finalFirmaB64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.warn('No se pudo cargar la firma para FHSYL:', err);
      }
    }
  }

  let firmaHtml = '';
  if (finalFirmaB64) {
    firmaHtml = `
      <div style="margin-top: 20pt;">
        <img src="${finalFirmaB64}" width="180" style="display:block; margin-bottom:-10pt;" />
        <div class="signature-box">Firma del Solicitante</div>
      </div>
    `;
  }

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
      ${(data.hijos || []).map(h => {
        const ageText = (h.edad !== undefined && h.edad !== null && h.edad !== '') ? ` (${h.edad} años)` : '';
        return `<li>${h.nombre}${ageText}</li>`;
      }).join('') || '<li>Sin hijos registrados</li>'}
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
    <ul>${(data.virtudes || []).map(v => `<li>${v}</li>`).join('') || '<li>N/A</li>'}</ul>

    <div class="field"><b>Áreas a Mejorar:</b></div>
    <ul>${(data.areasMejora || []).map(v => `<li>${v}</li>`).join('') || '<li>N/A</li>'}</ul>

    <div class="field"><b>Eventos de Éxito en Ministerio:</b></div>
    <ul>${(data.eventosExito || []).map(v => `<li>${v}</li>`).join('') || '<li>N/A</li>'}</ul>

    <div class="field"><span class="label">Congregación que pastorea:</span> <span class="value">${data.nombreCongregacionPastorea || ''}</span></div>
    <div class="field"><span class="label">Alianza / Concilio:</span> <span class="value">${data.alianzaPastores || ''}</span></div>

    <div class="section">4. REFERENCIAS Y OTROS</div>
    ${(data.referencias || []).length > 0 
      ? data.referencias.map((ref, i) => `<div class="field"><b>Ref ${i+1}:</b> ${ref.nombre} (${ref.relacion}) - ${ref.contacto}</div>`).join('') 
      : '<div class="field">No registra referencias</div>'}

    <div class="field"><span class="label">Invitado por el Pastor:</span> <span class="value">${data.pastorQueInvito || ''}</span></div>
    
    <div class="section">5. PREGUNTAS FINALES</div>
    <div class="field"><span class="label">¿Tiene Casa Propia?:</span> <span class="value">${data.tieneCasaPropia ? 'SÍ' : 'NO'}</span></div>
    <div class="field"><span class="label">¿Iglesia tiene propiedad?:</span> <span class="value">${data.iglesiaTienePropiedad ? 'SÍ' : 'NO'}</span></div>
    
    <div class="field"><b>Necesidades Fam. Pastoral:</b></div>
    <ul>${(data.necesidadesFamiliaPastoral || []).map(v => `<li>${v}</li>`).join('') || '<li>N/A</li>'}</ul>
    
    <div class="field"><b>Necesidades Congregación:</b></div>
    <ul>${(data.necesidadesCongregacion || []).map(v => `<li>${v}</li>`).join('') || '<li>N/A</li>'}</ul>

    <div class="field"><span class="label">Profesionales en Iglesia:</span> <span class="value">${data.profesionalesIglesia || 'N/A'}</span></div>
    <div class="field"><b>Proyecto Psicosocial a Desarrollar:</b></div>
    <div class="block-text">${data.proyectoPsicosocial || 'No especificado'}</div>
    
    ${firmaHtml}
  `);
  return new Blob(['\ufeff', content], { type: 'application/vnd.ms-word' });
};

export const generateEntrevista = async (userData, firmaB64 = null) => {
  // Manejar si respuestas es un Map o un Object
  let resp = userData.fundacion?.entrevista?.respuestas || {};
  if (typeof resp.get === 'function') {
    const plainResp = {};
    resp.forEach((v, k) => { plainResp[k] = v; });
    resp = plainResp;
  }
  
  // Si no llega firma por parámetro, intentar obtenerla
  let finalFirmaB64 = firmaB64;
  if (!finalFirmaB64) {
    const firmaUrl = userData.fundacion?.hojaDeVida?.datos?.firma_digital || 
                     userData.fundacion?.hojaDeVida?.datos?.get?.('firma_digital') ||
                     userData.social?.firma;
    if (firmaUrl) {
      try {
        const binary = await getBinary(firmaUrl);
        const blob = new Blob([binary], { type: 'image/png' });
        finalFirmaB64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.warn('No se pudo cargar la firma para Entrevista:', err);
      }
    }
  }

  let firmaHtml = '';
  if (finalFirmaB64) {
    firmaHtml = `
      <div style="margin-top: 20pt;">
        <img src="${finalFirmaB64}" width="180" style="display:block; margin-bottom:-10pt;" />
        <div class="signature-box">Firma del Postulante</div>
      </div>
    `;
  }

  const content = getHtmlBase('Entrevista Institucional', `
    <div class="section">I. INFORMACIÓN Y MINISTERIO</div>
    <div class="field"><span class="label">Postulante:</span> <span class="value">${resp.nombre || ''}</span></div>
    <div class="field"><span class="label">Fecha Nacimiento:</span> <span class="value">${resp.fechaNacimiento || ''}</span></div>
    <div class="field"><span class="label">UPZ / Localidad:</span> <span class="value">${resp.upzLocalidad || ''}</span></div>
    
    <div class="field"><b>¿Cuál es su llamado?:</b></div>
    <div class="block-text">${resp.llamado || ''}</div>
    
    <div class="field"><b>¿Qué es lo que más le gusta hacer y lo hace muy bien?:</b></div>
    <div class="block-text">${resp.loQueMasGusta || ''}</div>

    <div class="field"><b>Área de sacrificio por el ministerio:</b></div>
    <div class="block-text">${resp.sacrificioPastoral || ''}</div>

    <div class="section">II. CARÁCTER Y RESILIENCIA</div>
    <div class="field"><span class="label">Amigos dirían:</span> <span class="value">${resp.caracterAmigos || ''}</span></div>
    <div class="field"><span class="label">Compañeros dirían:</span> <span class="value">${resp.caracterCompañeros || ''}</span></div>
    
    <div class="field"><b>Momento de dificultad o crisis:</b></div>
    <div class="block-text">${resp.situacionDificil || ''}</div>

    <div class="field"><b>Respuesta ante esa situación:</b></div>
    <div class="block-text">${resp.respuestaSituacion || ''}</div>

    <div class="field"><b>¿Qué cambiaría si pudiera volver atrás?:</b></div>
    <div class="block-text">${resp.cambioSituacion || ''}</div>

    <div class="section">III. SUJECIÓN Y AUTORIDAD</div>
    <div class="field"><span class="label">Autoridad Espiritual Directa:</span> <span class="value">${resp.autoridadEspiritual || ''}</span></div>
    <div class="field"><span class="label">¿Tiene Personería Jurídica?:</span> <span class="value">${resp.personeriaJuridica || ''}</span></div>
    
    <div class="field"><b>Manejo de diferencias de criterio:</b></div>
    <div class="block-text">${resp.manejoDiferencias || ''}</div>

    <div class="field"><b>Enfrentamiento de conflictos interpersonales:</b></div>
    <div class="block-text">${resp.enfrentamientoConflictos || ''}</div>

    <div class="field"><b>Experiencias que califican como Coordinador:</b></div>
    <div class="block-text">${resp.porqueCoordinador || ''}</div>

    <div class="section">IV. FAMILIA Y DEVOCIÓN</div>
    <div class="field"><b>Vínculo Familiar Primario:</b></div>
    <div class="block-text">${resp.vinculoFamiliar || ''}</div>

    <div class="field"><b>Involucramiento familiar en la labor:</b></div>
    <div class="block-text">${resp.familiaInvolucrada || ''}</div>

    <div class="field"><b>Disciplinas espirituales:</b></div>
    <div class="block-text">${resp.formaEspiritual || ''}</div>

    <div class="section">V. COMPROMISO INSTITUCIONAL</div>
    <div class="field"><span class="label">Tiempo Pastoreando:</span> <span class="value">${resp.tiempoPastoreando || ''}</span></div>
    <div class="field"><span class="label">Disponibilidad de Tiempo:</span> <span class="value">${resp.disponibilidadTiempo || ''}</span></div>
    
    <div class="field"><b>¿Qué le ha sostenido en el ministerio?:</b></div>
    <div class="block-text">${resp.permanenciaMinisterio || ''}</div>

    <div class="field"><b>Palabras Adicionales:</b></div>
    <div class="block-text">${resp.palabrasVoluntarias || ''}</div>

    ${firmaHtml}
  `);
  return new Blob(['\ufeff', content], { type: 'application/vnd.ms-word' });
};

export const generateSolicitud = async (userData, firmaB64 = null) => {
  const f = userData.fundacion || {};
  const t = f.territorio || {};
  
  // Intentar obtener firma si no se proporciona
  let finalFirmaB64 = firmaB64;
  if (!finalFirmaB64) {
    const firmaUrl = userData.fundacion?.hojaDeVida?.datos?.firma_digital || 
                     userData.fundacion?.hojaDeVida?.datos?.get?.('firma_digital') ||
                     userData.social?.firma;
    if (firmaUrl) {
      try {
        const binary = await getBinary(firmaUrl);
        const blob = new Blob([binary], { type: 'image/png' });
        finalFirmaB64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.warn('No se pudo cargar la firma para Solicitud:', err);
      }
    }
  }

  let firmaHtml = '';
  if (finalFirmaB64) {
    firmaHtml = `
      <div style="margin-top: 30pt; text-align: center;">
        <img src="${finalFirmaB64}" width="180" style="display:inline-block;" />
        <div style="margin-top: 5pt; border-top: 1pt solid #000; width: 220pt; margin-left: auto; margin-right: auto; padding-top: 5pt;">
          Firma del Solicitante / Miembro
        </div>
      </div>
    `;
  }

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

    ${firmaHtml}
  `);
  return new Blob(['\ufeff', content], { type: 'application/vnd.ms-word' });
};

export const generateUserZip = async (userData) => {
  const zip = new PizZip();
  const name = `${userData.nombres?.primero || 'Usuario'}_${userData.apellidos?.primero || ''}`.replace(/\s+/g, '_');
  
  // 0. Obtener Firma en Base64 para los documentos HTML (porque Word necesita el binario embebido si es HTML)
  const firmaSource = userData.fundacion?.hojaDeVida?.datos?.get ? userData.fundacion.hojaDeVida.datos.get('firmaUser') || userData.fundacion.hojaDeVida.datos.get('firma_digital') : userData.fundacion?.hojaDeVida?.datos?.firmaUser || userData.fundacion?.hojaDeVida?.datos?.firma_digital;
  
  let firmaB64 = null;
  if (firmaSource) {
    if (firmaSource.startsWith('data:image')) {
      firmaB64 = await processSignatureImage(firmaSource);
    } else {
        // Si es una URL, necesitamos convertirla a Base64 para que el HTML embebido funcione en Word local
        try {
            const blob = await fetch(firmaSource).then(r => r.blob());
            firmaB64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
            firmaB64 = await processSignatureImage(firmaB64);
        } catch (e) {
            console.warn('No se pudo convertir firma URL a Base64 para el ZIP', e);
        }
    }
  }

  // 1. Hoja de Vida (Word .docx nativo)
  const cvBlob = await generateCV(userData);
  zip.file(`1.Hoja_de_Vida_${name}.docx`, await cvBlob.arrayBuffer());
  
  // 2. FHSYL (Word .doc vía HTML mejorado)
  const fhsylBlob = await generateFHSYL(userData, firmaB64);
  zip.file(`2.Aplicativo_FHSYL_${name}.doc`, await fhsylBlob.arrayBuffer());
  
  // 3. Entrevista (Word .doc vía HTML mejorado)
  const entrevistaBlob = await generateEntrevista(userData, firmaB64);
  zip.file(`3.Entrevista_${name}.doc`, await entrevistaBlob.arrayBuffer());
  
  // 4. Solicitud (Word .doc vía HTML mejorado)
  const solicitudBlob = await generateSolicitud(userData, firmaB64);
  zip.file(`4.Solicitud_Ingreso_${name}.doc`, await solicitudBlob.arrayBuffer());
  
  const content = zip.generate({ type: 'blob' });
  saveAs(content, `Documentacion_${name}.zip`);
};
