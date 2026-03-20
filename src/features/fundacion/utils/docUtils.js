import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import ImageModule from 'docxtemplater-image-module-free';

const EMPTY_IMAGE = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const processSignatureImage = (base64) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 200 && data[i + 1] > 200 && data[i + 2] > 200) data[i + 3] = 0;
      }
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = base64;
  });
};

const getBinary = async (tagValue) => {
  if (!tagValue || tagValue === '' || tagValue === '---') {
    const binaryString = window.atob(EMPTY_IMAGE);
    return new Uint8Array(binaryString.length).map((_, i) => binaryString.charCodeAt(i)).buffer;
  }
  try {
    const strVal = tagValue.toString();
    if (strVal.startsWith('data:image')) {
      const base64 = strVal.split(',')[1];
      const binaryString = window.atob(base64);
      return new Uint8Array(binaryString.length).map((_, i) => binaryString.charCodeAt(i)).buffer;
    }
    const baseUrl = import.meta.env.VITE_API_URL || 'https://degadersocial.com/api';
    let finalUrl = strVal;
    if (strVal.startsWith('/') && !strVal.startsWith('//')) finalUrl = `${baseUrl.replace('/api', '')}${strVal}`;
    const proxyUrl = `${baseUrl}/upload/proxy?url=${encodeURIComponent(finalUrl)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error('Error proxy');
    return await response.arrayBuffer();
  } catch (e) {
    const binaryString = window.atob(EMPTY_IMAGE);
    return new Uint8Array(binaryString.length).map((_, i) => binaryString.charCodeAt(i)).buffer;
  }
};

export const generateCV = async (userData) => {
  const formData = userData.fundacion.hojaDeVida || {};
  const response = await fetch('/templates/FORMATO HOJA DE VIDA FHISYL.docx');
  const content = await response.arrayBuffer();
  const zip = new PizZip(content);
  const opts = {
    centered: false,
    getImage: getBinary,
    getSize: (img, tagValue, tagName) => (tagName.includes('firma') ? [180, 60] : [110, 140]),
  };
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true, modules: [new ImageModule(opts)], nullGetter: () => "" });
  
  let firma = formData.firma_digital || '';
  if (firma.startsWith('data:image')) firma = await processSignatureImage(firma);
  
  const dataToRender = {
    ...formData,
    foto_perfil: formData.foto_perfil || '',
    fotoUser: formData.foto_perfil || '',
    firma_digital: firma,
    firmaUser: firma,
    seleccionar_tecnica: formData.seleccionar_tecnica ? 'X' : '',
    seleccionar_tecnologica: formData.seleccionar_tecnologica ? 'X' : '',
    seleccionar_universitario: formData.seleccionar_universitario ? 'X' : '',
    seleccionar_posgrado: formData.seleccionar_posgrado ? 'X' : '',
    'fraseUser': formData.frase_identificadora || '',
    'descripMain': formData.descripcion_breve_ministerio_profesion || '',
    'profesion_personal _2': formData.profesion_personal_2 || '',
    'profesion_personal _3': formData.profesion_personal_3 || ''
  };

  await doc.renderAsync(dataToRender);
  return doc.getZip().generate({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
};

const getHtmlBase = (title, bodyContent) => `
  <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #1d4ed8; padding-bottom: 10px; margin-bottom: 20px; }
        .title { color: #1d4ed8; font-size: 24px; font-weight: bold; margin: 0; }
        .subtitle { color: #666; font-size: 14px; margin-top: 5px; }
        .section { background: #f3f4f6; padding: 10px; font-weight: bold; margin: 20px 0 10px 0; border-radius: 5px; }
        .field { margin-bottom: 8px; }
        .label { font-weight: bold; color: #4b5563; min-width: 150px; display: inline-block; }
        .value { color: #111827; }
        .footer { margin-top: 40px; border-top: 1px solid #eee; padding-top: 10px; font-size: 12px; color: #999; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <p class="title">${title}</p>
        <p class="subtitle">Fundación Humanitaria Sol y Luna</p>
      </div>
      ${bodyContent}
      <div class="footer">Generado automáticamente por Degader Social - ${new Date().toLocaleDateString()}</div>
    </body>
  </html>
`;

export const generateFHSYL = (userData) => {
  const data = userData.fundacion.documentacionFHSYL || {};
  const content = getHtmlBase('Aplicativo República Argentina', `
    <div class="section">Información Personal</div>
    <div class="field"><span class="label">Nombre:</span> <span class="value">${data.nombreCompleto}</span></div>
    <div class="field"><span class="label">Dirección:</span> <span class="value">${data.direccion}</span></div>
    <div class="section">Llamado Pastoral</div>
    <p>${data.llamadoPastoral || 'No especificado'}</p>
  `);
  return new Blob(['\ufeff', content], { type: 'application/msword' });
};

export const generateEntrevista = (userData) => {
  const data = userData.fundacion.entrevista?.respuestas || {};
  const content = getHtmlBase('Entrevista Fundación', `
    <div class="section">Datos de la Entrevista</div>
    <div class="field"><span class="label">Nombre:</span> <span class="value">${data.nombre}</span></div>
    <div class="section">Preguntas Clave</div>
    <div class="field"><span class="label">¿Cuál es su llamado?</span></div>
    <p>${data.llamado || 'No especificado'}</p>
  `);
  return new Blob(['\ufeff', content], { type: 'application/msword' });
};

export const generateSolicitud = (userData) => {
  const data = userData.fundacion || {};
  const content = getHtmlBase('Solicitud de Ingreso', `
    <div class="section">Perfil Institucional</div>
    <div class="field"><span class="label">Nivel:</span> <span class="value">${data.nivel}</span></div>
    <div class="field"><span class="label">Cargo:</span> <span class="value">${data.cargo}</span></div>
    <div class="field"><span class="label">Área:</span> <span class="value">${data.area}</span></div>
  `);
  return new Blob(['\ufeff', content], { type: 'application/msword' });
};
