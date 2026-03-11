import React, { useState, useEffect, useRef } from 'react';
import { Download, FileText, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../api/config';

const FormularioFHSYL = () => {
  const { user, login } = useAuth(); // login to update auth context state if needed
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Ref for PDF export
  const formRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    // Pre-filled existing data
    nombreCompleto: '',
    direccion: '',
    localidad: '', // could be ciudad
    barrio: '',
    celular: '',
    email: '',
    
    // New FHSYL fields
    upz: '',
    ocupacion: '',
    estadoCivil: '',
    nombreConyuge: '',
    hijos: [{ nombre: '', edad: '' }], // Array of objects
    deseaSerCoordinadorLocalidad: '', // "SI" o "NO"
    localidadCoordinar: '',
    testimonioConversion: '',
    llamadoPastoral: '',
    virtudes: ['', '', ''],
    areasMejora: ['', ''],
    eventosExito: ['', ''],
    nombreCongregacionPastorea: '',
    alianzaPastores: '',
    referencias: [
      { nombre: '', relacion: '', contacto: '' },
      { nombre: '', relacion: '', contacto: '' }
    ],
    pastorQueInvito: '',
    // Preguntas finales
    tieneCasaPropia: '', // "SI" o "NO"
    iglesiaTienePropiedad: '', // "SI" o "NO"
    necesidadesFamiliaPastoral: ['', '', '', '', ''],
    necesidadesCongregacion: ['', '', '', '', ''],
    profesionalesIglesia: '',
    proyectoPsicosocial: ''
  });

  useEffect(() => {
    // Pre-fill existing user data
    if (user) {
      const docFHSYL = user.fundacion?.documentacionFHSYL || {};
      
      const fetchUserData = () => {
        let nombre = '';
        if (user.nombres) {
          nombre = `${user.nombres.primero} ${user.nombres.segundo || ''} ${user.apellidos?.primero || ''} ${user.apellidos?.segundo || ''}`.trim();
        }
        
        setFormData(prev => ({
          ...prev,
          nombreCompleto: nombre || prev.nombreCompleto,
          direccion: user.personal?.direccion || '',
          localidad: user.personal?.ubicacion?.ciudad || '',
          barrio: user.personal?.ubicacion?.barrio || '',
          celular: user.personal?.celular || '',
          email: user.email || '',
          
          // Hydrate from DB if exists
          upz: docFHSYL.upz || '',
          ocupacion: docFHSYL.ocupacion || '',
          estadoCivil: docFHSYL.estadoCivil || '',
          nombreConyuge: docFHSYL.nombreConyuge || '',
          hijos: docFHSYL.hijos?.length > 0 ? docFHSYL.hijos : [{ nombre: '', edad: '' }],
          deseaSerCoordinadorLocalidad: docFHSYL.deseaSerCoordinadorLocalidad === true ? "SI" : docFHSYL.deseaSerCoordinadorLocalidad === false ? "NO" : '',
          localidadCoordinar: docFHSYL.localidadCoordinar || '',
          testimonioConversion: docFHSYL.testimonioConversion || '',
          llamadoPastoral: docFHSYL.llamadoPastoral || '',
          
          virtudes: hydrateArray(docFHSYL.virtudes, 3),
          areasMejora: hydrateArray(docFHSYL.areasMejora, 2),
          eventosExito: hydrateArray(docFHSYL.eventosExito, 2),
          
          nombreCongregacionPastorea: docFHSYL.nombreCongregacionPastorea || '',
          alianzaPastores: docFHSYL.alianzaPastores || '',
          
          referencias: docFHSYL.referencias?.length === 2 ? docFHSYL.referencias : [
            { nombre: '', relacion: '', contacto: '' },
            { nombre: '', relacion: '', contacto: '' }
          ],
          
          pastorQueInvito: docFHSYL.pastorQueInvito || '',
          
          tieneCasaPropia: docFHSYL.tieneCasaPropia === true ? "SI" : docFHSYL.tieneCasaPropia === false ? "NO" : '',
          iglesiaTienePropiedad: docFHSYL.iglesiaTienePropiedad === true ? "SI" : docFHSYL.iglesiaTienePropiedad === false ? "NO" : '',
          
          necesidadesFamiliaPastoral: hydrateArray(docFHSYL.necesidadesFamiliaPastoral, 5),
          necesidadesCongregacion: hydrateArray(docFHSYL.necesidadesCongregacion, 5),
          
          profesionalesIglesia: docFHSYL.profesionalesIglesia || '',
          proyectoPsicosocial: docFHSYL.proyectoPsicosocial || ''
        }));
      };
      
      fetchUserData();
    }
  }, [user]);

  // Helper to ensure array size
  const hydrateArray = (arr, size) => {
    let newArr = Array(size).fill('');
    if (arr && Array.isArray(arr)) {
      arr.forEach((val, idx) => {
        if (idx < size) newArr[idx] = val;
      });
    }
    return newArr;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (arrayName, index, value) => {
    setFormData(prev => {
      const newArray = [...prev[arrayName]];
      newArray[index] = value;
      return { ...prev, [arrayName]: newArray };
    });
  };

  const handleObjectArrayChange = (arrayName, index, field, value) => {
    setFormData(prev => {
      const newArray = [...prev[arrayName]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayName]: newArray };
    });
  };

  const addHijo = () => {
    setFormData(prev => ({
      ...prev,
      hijos: [...prev.hijos, { nombre: '', edad: '' }]
    }));
  };

  const removeHijo = (index) => {
    setFormData(prev => ({
      ...prev,
      hijos: prev.hijos.filter((_, i) => i !== index)
    }));
  };

  const saveToDatabase = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const payload = {
        upz: formData.upz,
        ocupacion: formData.ocupacion,
        estadoCivil: formData.estadoCivil,
        nombreConyuge: formData.nombreConyuge,
        hijos: formData.hijos.filter(h => h.nombre.trim() !== ''),
        deseaSerCoordinadorLocalidad: formData.deseaSerCoordinadorLocalidad === "SI" ? true : formData.deseaSerCoordinadorLocalidad === "NO" ? false : null,
        localidadCoordinar: formData.localidadCoordinar,
        testimonioConversion: formData.testimonioConversion,
        llamadoPastoral: formData.llamadoPastoral,
        virtudes: formData.virtudes.filter(v => v.trim() !== ''),
        areasMejora: formData.areasMejora.filter(v => v.trim() !== ''),
        eventosExito: formData.eventosExito.filter(v => v.trim() !== ''),
        nombreCongregacionPastorea: formData.nombreCongregacionPastorea,
        alianzaPastores: formData.alianzaPastores,
        referencias: formData.referencias.filter(r => r.nombre.trim() !== ''),
        pastorQueInvito: formData.pastorQueInvito,
        tieneCasaPropia: formData.tieneCasaPropia === "SI" ? true : formData.tieneCasaPropia === "NO" ? false : null,
        iglesiaTienePropiedad: formData.iglesiaTienePropiedad === "SI" ? true : formData.iglesiaTienePropiedad === "NO" ? false : null,
        necesidadesFamiliaPastoral: formData.necesidadesFamiliaPastoral.filter(v => v.trim() !== ''),
        necesidadesCongregacion: formData.necesidadesCongregacion.filter(v => v.trim() !== ''),
        profesionalesIglesia: formData.profesionalesIglesia,
        proyectoPsicosocial: formData.proyectoPsicosocial
      };

      const res = await api.put('/usuarios/documentacionFHSYL', payload);
      
      // Update local context
      if (res.data.data) {
        login(res.data.data);
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al guardar en la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  const exportToWord = () => {
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Aplicativo FHSYL</title>
        <style>
          body { font-family: 'Arial', sans-serif; padding: 20px; line-height: 1.5; }
          h1 { text-align: center; color: #1e3a8a; }
          .field { margin-bottom: 10px; }
          .label { font-weight: bold; }
          .value { border-bottom: 1px solid #000; display: inline-block; min-width: 200px; }
          .section { margin-top: 20px; margin-bottom: 10px; font-weight: bold; background: #eee; padding: 5px; }
        </style>
      </head>
      <body>
        <h1>APLICATIVO REPUBLICA ARGENTINA<br>Fundación Humanitaria Sol y Luna</h1>
        
        <div class="field"><span class="label">Nombre:</span> <span class="value">${formData.nombreCompleto}</span></div>
        <div class="field"><span class="label">Dirección:</span> <span class="value">${formData.direccion}</span></div>
        <div class="field"><span class="label">Localidad:</span> <span class="value">${formData.localidad}</span></div>
        <div class="field"><span class="label">Barrio:</span> <span class="value">${formData.barrio}</span> <span class="label">UPZ:</span> <span class="value">${formData.upz}</span></div>
        <div class="field"><span class="label">Celular:</span> <span class="value">${formData.celular}</span></div>
        <div class="field"><span class="label">Dirección electrónica:</span> <span class="value">${formData.email}</span></div>
        <div class="field"><span class="label">Ocupación:</span> <span class="value">${formData.ocupacion}</span></div>
        <div class="field"><span class="label">Estado Civil:</span> <span class="value">${formData.estadoCivil}</span></div>
        <div class="field"><span class="label">Nombre del Cónyugue:</span> <span class="value">${formData.nombreConyuge}</span></div>
        
        <div class="field"><span class="label">Nombre de los hijos, y su respectiva edad:</span></div>
        <ul>
          ${formData.hijos.filter(h => h.nombre).map(h => `<li>${h.nombre} (${h.edad} años)</li>`).join('')}
        </ul>
        
        <div class="field"><span class="label">Desea ser Coordinador de una Localidad:</span> <span class="value">${formData.deseaSerCoordinadorLocalidad}</span></div>
        <div class="field"><span class="label">Localidad:</span> <span class="value">${formData.localidadCoordinar}</span></div>
        
        <div class="section">1. Comparta su testimonio personal brevemente, y su conversión a Cristo Jesús:</div>
        <p>${formData.testimonioConversion}</p>
        
        <div class="section">2. Compártanos acerca de su llamado Pastoral:</div>
        <p>${formData.llamadoPastoral}</p>
        
        <div class="section">3. Por favor, describa tres virtudes personales que tenga:</div>
        <ol>
          ${formData.virtudes.map(v => `<li>${v}</li>`).join('')}
        </ol>
        
        <div class="section">4. Por favor, describa dos áreas donde necesite mejorar personalmente:</div>
        <ol>
          ${formData.areasMejora.map(v => `<li>${v}</li>`).join('')}
        </ol>
        
        <div class="section">5. Describa dos eventos en su ministerio en los que tuvo éxito y le produjo alegría realizarlos:</div>
        <ol>
          ${formData.eventosExito.map(v => `<li>${v}</li>`).join('')}
        </ol>
        
        <div class="field"><span class="label">Nombre de la Congregación que Pastorea:</span> <span class="value">${formData.nombreCongregacionPastorea}</span></div>
        <div class="field"><span class="label">Alianza de pastores a la cual pertenece (Concilio, misión):</span> <span class="value">${formData.alianzaPastores}</span></div>
        
        <div class="section">6. Por favor, denos dos referencias que no sean miembros de familia:</div>
        ${formData.referencias.map((ref, idx) => `
          <div><b>Referencia ${idx + 1}:</b></div>
          <div class="field"><span class="label">Nombre:</span> <span class="value">${ref.nombre}</span></div>
          <div class="field"><span class="label">Relación con usted:</span> <span class="value">${ref.relacion}</span></div>
          <div class="field"><span class="label">Número celular y dirección email:</span> <span class="value">${ref.contacto}</span></div>
        `).join('<br>')}
        
        <div class="field" style="margin-top: 20px;"><span class="label">Nombre del pastor que le Invitó a la presentación de Visión Fundación Humanitaria Sol y Luna:</span> <span class="value">${formData.pastorQueInvito}</span></div>
        
        <div class="section">PREGUNTAS FINALES</div>
        <div class="field"><span class="label">1. ¿Tiene Casa Propia?</span> <span class="value">${formData.tieneCasaPropia}</span></div>
        <div class="field"><span class="label">2. ¿La iglesia que usted pastorea tiene propiedad?</span> <span class="value">${formData.iglesiaTienePropiedad}</span></div>
        
        <div class="field"><span class="label">3. Mencione 5 necesidades que tenga como familia Pastoral:</span></div>
        <ol>
          ${formData.necesidadesFamiliaPastoral.map(v => `<li>${v}</li>`).join('')}
        </ol>
        
        <div class="field"><span class="label">4. Mencione 5 necesidades que usted como pastor visualiza en el general de las familias de su congregación:</span></div>
        <ol>
          ${formData.necesidadesCongregacion.map(v => `<li>${v}</li>`).join('')}
        </ol>
        
        <div class="field"><span class="label">5. ¿Tiene usted profesionales en su iglesia? Mencione qué profesiones:</span></div>
        <p>${formData.profesionalesIglesia}</p>
        
        <div class="field"><span class="label">6. Mencione un Proyecto Psico-social que quiera desarrollar y qué falencias tiene para desarrollarlo:</span></div>
        <p>${formData.proyectoPsicosocial}</p>

      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FHSYL_Aplicativo_${formData.nombreCompleto.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    // Uses CSS print media queries to perfectly format the document
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden mb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white text-center">
        <h1 className="text-2xl font-bold uppercase tracking-wider">Aplicativo República Argentina</h1>
        <h2 className="text-lg opacity-90">Fundación Humanitaria Sol y Luna</h2>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          <span>Complete la información y guárdela, o descárguela en formato físico.</span>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button 
            onClick={exportToWord}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition"
          >
            <FileText className="w-4 h-4" /> Word
          </button>
          <button 
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition"
          >
            <Download className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      {/* Form Content (Ref for PDF) */}
      <div ref={formRef} className="p-6 md:p-10 space-y-8 print:p-0 print:m-0 print:w-full">
        
        {/* Sección Personal */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Datos Personales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
              <input type="text" name="nombreCompleto" value={formData.nombreCompleto} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Dirección</label>
              <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Localidad</label>
              <input type="text" name="localidad" value={formData.localidad} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Barrio</label>
              <input type="text" name="barrio" value={formData.barrio} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">UPZ</label>
              <input type="text" name="upz" value={formData.upz} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Celular</label>
              <input type="tel" name="celular" value={formData.celular} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Dirección electrónica</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ocupación</label>
              <input type="text" name="ocupacion" value={formData.ocupacion} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado Civil</label>
              <input type="text" name="estadoCivil" value={formData.estadoCivil} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre del Cónyugue</label>
              <input type="text" name="nombreConyuge" value={formData.nombreConyuge} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de los hijos, y su respectiva edad</label>
            {formData.hijos.map((hijo, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input placeholder="Nombre" type="text" value={hijo.nombre} onChange={(e) => handleObjectArrayChange('hijos', index, 'nombre', e.target.value)} className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                <input placeholder="Edad" type="number" value={hijo.edad} onChange={(e) => handleObjectArrayChange('hijos', index, 'edad', e.target.value)} className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                {index > 0 && (
                  <button type="button" onClick={() => removeHijo(index)} className="px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100">X</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addHijo} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">+ Añadir otro hijo</button>
          </div>
        </div>

        {/* Sección Coordinación */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Área de Coordinación</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">¿Desea ser Coordinador de una Localidad?</label>
              <select name="deseaSerCoordinadorLocalidad" value={formData.deseaSerCoordinadorLocalidad} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option value="">Seleccione</option>
                <option value="SI">SI</option>
                <option value="NO">NO</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Localidad</label>
              <input type="text" name="localidadCoordinar" value={formData.localidadCoordinar} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
          </div>
        </div>

        {/* Sección Narrativa Minsiterial */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Vida y Ministerio</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">1. Comparta su testimonio personal brevemente, y su conversión a Cristo Jesús</label>
            <textarea name="testimonioConversion" value={formData.testimonioConversion} onChange={handleChange} rows="3" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">2. Compartanos acerca de su llamado Pastoral:</label>
            <textarea name="llamadoPastoral" value={formData.llamadoPastoral} onChange={handleChange} rows="3" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">3. Por favor, describa tres virtudes personales que tenga:</label>
            {formData.virtudes.map((v, i) => (
              <input key={i} type="text" value={v} onChange={(e) => handleArrayChange('virtudes', i, e.target.value)} className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder={`Virtud ${i+1}`} />
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">4. Por favor, describa dos áreas donde necesite mejorar personalmente:</label>
            {formData.areasMejora.map((v, i) => (
              <input key={i} type="text" value={v} onChange={(e) => handleArrayChange('areasMejora', i, e.target.value)} className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder={`Área ${i+1}`} />
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">5. Describa dos eventos en su ministerio en los que tuvo éxito y le produjo alegria realizarlos:</label>
            {formData.eventosExito.map((v, i) => (
              <input key={i} type="text" value={v} onChange={(e) => handleArrayChange('eventosExito', i, e.target.value)} className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder={`Evento ${i+1}`} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700">Nombre de la Congregación que Pastorea</label>
              <input type="text" name="nombreCongregacionPastorea" value={formData.nombreCongregacionPastorea} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Alianza de pastores a la cual pertenece (Concilio, misión)</label>
              <input type="text" name="alianzaPastores" value={formData.alianzaPastores} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
          </div>
        </div>

        {/* Referencias */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Referencias</h3>
          <p className="text-sm text-gray-500">Por favor, denos dos referencias que no sean miembros de familia (Por favor coloque a su autoridad espiritual de primeras y despues pastor, líder de la comunidad, miembro de la iglesia, etc.)</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.referencias.map((ref, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                <span className="font-semibold text-gray-700 text-sm block">Referencia {index + 1}</span>
                <div>
                  <label className="block text-xs font-medium text-gray-600">Nombre</label>
                  <input type="text" value={ref.nombre} onChange={(e) => handleObjectArrayChange('referencias', index, 'nombre', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">Relación con usted</label>
                  <input type="text" value={ref.relacion} onChange={(e) => handleObjectArrayChange('referencias', index, 'relacion', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">Número celular y dirección email</label>
                  <input type="text" value={ref.contacto} onChange={(e) => handleObjectArrayChange('referencias', index, 'contacto', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm" />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
             <label className="block text-sm font-medium text-gray-700">Nombre del pastor que le Invito a la presentación de Visión Fundación Humanitaria Sol y Luna</label>
             <input type="text" name="pastorQueInvito" value={formData.pastorQueInvito} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
        </div>

        {/* Sección Preguntas Finales */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Preguntas Adicionales</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">1. Tiene Casa Propia</label>
              <select name="tieneCasaPropia" value={formData.tieneCasaPropia} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option value="">Seleccione</option>
                <option value="SI">SI</option>
                <option value="NO">NO</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">2. La iglesia que usted pastorea tiene propiedad</label>
              <select name="iglesiaTienePropiedad" value={formData.iglesiaTienePropiedad} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option value="">Seleccione</option>
                <option value="SI">SI</option>
                <option value="NO">NO</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">3. Mencione 5 necesidades que tenga como familia Pastoral:</label>
            {formData.necesidadesFamiliaPastoral.map((v, i) => (
              <input key={i} type="text" value={v} onChange={(e) => handleArrayChange('necesidadesFamiliaPastoral', i, e.target.value)} className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder={`Necesidad ${i+1}`} />
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">4. Mencione 5 necesidades que usted como pastor visualiza en el general de las familias de su congregación:</label>
             {formData.necesidadesCongregacion.map((v, i) => (
              <input key={i} type="text" value={v} onChange={(e) => handleArrayChange('necesidadesCongregacion', i, e.target.value)} className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder={`Necesidad ${i+1}`} />
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">5. Tiene usted profesionales en su iglesia? Mencione que profesiones.</label>
            <textarea name="profesionalesIglesia" value={formData.profesionalesIglesia} onChange={handleChange} rows="2" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">6. Mencione un Proyecto Psico-social que quiera desarrollar y que falencias tiene para desarrollarlo.</label>
            <textarea name="proyectoPsicosocial" value={formData.proyectoPsicosocial} onChange={handleChange} rows="3" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
          </div>

        </div>
      </div>

      {/* Footer Submit Button */}
      <div className="bg-gray-50 p-6 border-t border-gray-200 flex flex-col items-center">
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-600 font-medium flex items-center gap-2 mb-3"><CheckCircle2 className="w-5 h-5"/> Guardado correctamente en tu perfil.</p>}
        
        <button 
          onClick={saveToDatabase}
          disabled={loading}
          className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? 'Guardando...' : <><Save className="w-5 h-5" /> Guardar en Base de Datos</>}
        </button>
        <p className="text-xs text-gray-400 mt-4 text-center max-w-lg">
          Al guardar, esta información quedará vinculada en tu cuenta bajo la sección Fundación Humanitaria Sol y Luna.
        </p>
      </div>

    </div>
  );
};

export default FormularioFHSYL;
