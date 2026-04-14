import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Download, 
  FileText, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft,
  Heart
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import userService from '../../../../api/userService';
import { useToast } from '../../../../shared/components/Toast/ToastProvider';

const FormularioFHSYL = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  
  // Ref for PDF export
  const formRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    direccion: '',
    localidad: '', 
    barrio: '',
    celular: '',
    email: '',
    upz: '',
    ocupacion: '',
    estadoCivil: '',
    nombreConyuge: '',
    hijos: [{ nombre: '', edad: '' }], 
    deseaSerCoordinadorLocalidad: '', 
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
    tieneCasaPropia: '', 
    iglesiaTienePropiedad: '', 
    necesidadesFamiliaPastoral: ['', '', '', '', ''],
    necesidadesCongregacion: ['', '', '', '', ''],
    profesionalesIglesia: '',
    proyectoPsicosocial: ''
  });

  useEffect(() => {
    // Scroll window and main content to top on mount
    window.scrollTo(0, 0);
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.scrollTo(0, 0);
    }

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
          
          upz: docFHSYL.upz || '',
          ocupacion: docFHSYL.ocupacion || user.fundacion?.entrevista?.respuestas?.profesion || '',
          estadoCivil: docFHSYL.estadoCivil || user.personal?.estadoCivil || '',
          nombreConyuge: docFHSYL.nombreConyuge || '',
          hijos: docFHSYL.hijos?.length > 0 ? docFHSYL.hijos : [{ nombre: '', edad: '' }],
          deseaSerCoordinadorLocalidad: docFHSYL.deseaSerCoordinadorLocalidad === true ? "SI" : docFHSYL.deseaSerCoordinadorLocalidad === false ? "NO" : '',
          localidadCoordinar: docFHSYL.localidadCoordinar || '',
          testimonioConversion: docFHSYL.testimonioConversion || '',
          
          // --- SINCRONIZACIÓN CROSS-FORM (FALLBACKS) ---
          llamadoPastoral: docFHSYL.llamadoPastoral || 
                           user.fundacion?.entrevista?.respuestas?.llamado || '',
          
          virtudes: hydrateArray(docFHSYL.virtudes, 3),
          areasMejora: hydrateArray(docFHSYL.areasMejora, 2),
          eventosExito: hydrateArray(docFHSYL.eventosExito, 2),
          
          nombreCongregacionPastorea: docFHSYL.nombreCongregacionPastorea || '',
          alianzaPastores: docFHSYL.alianzaPastores || '',
          
          referencias: (docFHSYL.referencias?.length >= 2) ? docFHSYL.referencias : [
            { 
              nombre: docFHSYL.referencias?.[0]?.nombre || user.fundacion?.hojaDeVida?.datos?.nombre_personales_1 || '', 
              relacion: docFHSYL.referencias?.[0]?.relacion || user.fundacion?.hojaDeVida?.datos?.profesion_personal_1 || '', 
              contacto: docFHSYL.referencias?.[0]?.contacto || user.fundacion?.hojaDeVida?.datos?.telefonopers_1 || '' 
            },
            { 
              nombre: docFHSYL.referencias?.[1]?.nombre || user.fundacion?.hojaDeVida?.datos?.nombre_personales_2 || '', 
              relacion: docFHSYL.referencias?.[1]?.relacion || user.fundacion?.hojaDeVida?.datos?.profesion_personal_2 || '', 
              contacto: docFHSYL.referencias?.[1]?.contacto || user.fundacion?.hojaDeVida?.datos?.telefonopers_2 || '' 
            }
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

  const LOCALSTORAGE_KEY = `fundacion_fhsyl_${user?._id || 'draft'}`;

  // 🔧 FIX: Restaurar desde localStorage al montar SI no hay datos del servidor
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCALSTORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const docFHSYL = user?.fundacion?.documentacionFHSYL || {};
        const hasServerData = !!(docFHSYL.testimonioConversion || docFHSYL.ocupacion || docFHSYL.estadoCivil);
        if (!hasServerData && Object.keys(parsed).length > 0) {
          console.log('📦 [FHSYL] Restaurando datos desde localStorage');
          setFormData(prev => ({ ...prev, ...parsed }));
        }
      }
    } catch (e) { /* Ignorar errores de parse */ }
  }, []); // Solo al montar

  // 🔧 FIX: Auto-guardar en localStorage al cambiar campos
  useEffect(() => {
    try {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(formData));
    } catch (e) { /* Ignorar errores de storage lleno */ }
  }, [formData, LOCALSTORAGE_KEY]);

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
    try {
      const payload = {
        direccion: formData.direccion,
        localidad: formData.localidad,
        barrio: formData.barrio,
        celular: formData.celular,
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

      const response = await userService.saveDocumentationFHSYL(payload);
      
      if (response.success) {
        if (response.data) {
          updateUser(response.data);
        }
        // 🔧 FIX: Limpiar localStorage — guardado exitoso confirmado por backend
        try { localStorage.removeItem(LOCALSTORAGE_KEY); } catch (e) { /* noop */ }
        toast.success('Documentación guardada correctamente');
        setTimeout(() => navigate('/fundacion'), 2000);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error al guardar. Tus datos están respaldados localmente.');
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
          ${formData.hijos.filter(h => h.nombre).map(h => {
            const ageText = (h.edad !== undefined && h.edad !== null && h.edad !== '') ? ` (${h.edad} años)` : '';
            return `<li>${h.nombre}${ageText}</li>`;
          }).join('')}
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
    window.print();
  };

  // Helper for input classes to avoid repeating long strings
  const inputClasses = "w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-gray-100 outline-none shadow-sm";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Botón Volver */}
      <button 
        onClick={() => navigate('/fundacion')} 
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 font-medium transition-colors"
      >
        <ChevronLeft size={20} />
        Volver a Fundación
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Header Premium - Background solid and white text to ensure visibility */}
        <div className="bg-blue-600 bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shrink-0">
              <Heart size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight text-white">
                Aplicativo República Argentina
              </h1>
              <p className="text-blue-50 font-medium">
                Fundación Humanitaria Sol y Luna
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div ref={formRef} className="p-8 md:p-10 space-y-10 print:p-0">
          
          {/* Sección Personal */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3 flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
              Datos Personales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Nombre completo</label>
                <input type="text" name="nombreCompleto" value={formData.nombreCompleto} onChange={handleChange} className={inputClasses} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Dirección</label>
                <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} className={inputClasses} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Localidad</label>
                <input type="text" name="localidad" value={formData.localidad} onChange={handleChange} className={inputClasses} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Barrio</label>
                <input type="text" name="barrio" value={formData.barrio} onChange={handleChange} className={inputClasses} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">UPZ</label>
                <input type="text" name="upz" value={formData.upz} onChange={handleChange} className={inputClasses} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Celular</label>
                <input type="tel" name="celular" value={formData.celular} onChange={handleChange} className={inputClasses} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Dirección electrónica</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClasses} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Ocupación</label>
                <input type="text" name="ocupacion" value={formData.ocupacion} onChange={handleChange} className={inputClasses} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Estado Civil</label>
                <input type="text" name="estadoCivil" value={formData.estadoCivil} onChange={handleChange} className={inputClasses} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Nombre del Cónyugue</label>
                <input type="text" name="nombreConyuge" value={formData.nombreConyuge} onChange={handleChange} className={inputClasses} />
              </div>
            </div>

            <div className="mt-8 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-700">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-6 ml-1 italic">Nombre de los hijos y edad</label>
              <div className="space-y-6">
                {formData.hijos.map((hijo, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative group">
                    <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase tracking-wider">Nombre del Hijo/a</label>
                      <input 
                        placeholder="Nombre Completo" 
                        type="text" 
                        value={hijo.nombre || ''} 
                        onChange={(e) => handleObjectArrayChange('hijos', index, 'nombre', e.target.value)} 
                        className={inputClasses} 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase tracking-wider">Edad</label>
                      <div className="flex gap-3">
                        <input 
                          placeholder="Edad" 
                          type="number" 
                          value={hijo.edad ?? ''} 
                          onChange={(e) => handleObjectArrayChange('hijos', index, 'edad', e.target.value)} 
                          className={`${inputClasses} flex-1`} 
                        />
                        {index > 0 && (
                          <button 
                            type="button" 
                            onClick={() => removeHijo(index)} 
                            className="px-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-bold flex items-center justify-center border border-red-100"
                            title="Eliminar hijo"
                          >
                            X
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                type="button" 
                onClick={addHijo} 
                className="mt-6 w-full md:w-auto px-6 py-3 text-sm bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all font-bold border border-blue-100 dark:border-blue-800/50 flex items-center justify-center gap-2"
              >
                + Agregar otro hijo
              </button>
            </div>
          </div>

          {/* Sección Coordinación */}
          <div className="space-y-6 bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/20">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
              Área de Coordinación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">¿Desea ser Coordinador de una Localidad?</label>
                <select name="deseaSerCoordinadorLocalidad" value={formData.deseaSerCoordinadorLocalidad} onChange={handleChange} className={inputClasses}>
                  <option value="">Seleccione</option>
                  <option value="SI">SI</option>
                  <option value="NO">NO</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Localidad de interés</label>
                <input type="text" name="localidadCoordinar" value={formData.localidadCoordinar} onChange={handleChange} className={inputClasses} />
              </div>
            </div>
          </div>

          {/* Sección Vida y Ministerio */}
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3 flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
              Vida y Ministerio
            </h3>
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 italic">1. Comparta su testimonio personal brevemente:</label>
              <textarea name="testimonioConversion" value={formData.testimonioConversion} onChange={handleChange} rows="4" className={inputClasses + " resize-none"} />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 italic">2. Compártanos acerca de su llamado Pastoral:</label>
              <textarea name="llamadoPastoral" value={formData.llamadoPastoral} onChange={handleChange} rows="4" className={inputClasses + " resize-none"} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">3. Tres Virtudes</label>
                {formData.virtudes.map((v, i) => (
                  <input key={i} type="text" value={v} onChange={(e) => handleArrayChange('virtudes', i, e.target.value)} className={`${inputClasses} mb-2`} placeholder={`Virtud ${i+1}`} />
                ))}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">4. Dos Áreas a mejorar</label>
                {formData.areasMejora.map((v, i) => (
                  <input key={i} type="text" value={v} onChange={(e) => handleArrayChange('areasMejora', i, e.target.value)} className={`${inputClasses} mb-2`} placeholder={`Área ${i+1}`} />
                ))}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1">5. Eventos de Éxito</label>
                {formData.eventosExito.map((v, i) => (
                  <input key={i} type="text" value={v} onChange={(e) => handleArrayChange('eventosExito', i, e.target.value)} className={`${inputClasses} mb-2`} placeholder={`Evento ${i+1}`} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Congregación que Pastorea</label>
                <input type="text" name="nombreCongregacionPastorea" value={formData.nombreCongregacionPastorea} onChange={handleChange} className={inputClasses} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Alianza / Concilio</label>
                <input type="text" name="alianzaPastores" value={formData.alianzaPastores} onChange={handleChange} className={inputClasses} />
              </div>
            </div>
          </div>

          {/* Referencias */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3 flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
              Referencias (No familiares)
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">Por favor coloque a su autoridad espiritual de primera.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.referencias.map((ref, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4">
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-xs uppercase tracking-widest">Referencia {index + 1}</span>
                  <div className="space-y-3">
                    <input placeholder="Nombre" type="text" value={ref.nombre} onChange={(e) => handleObjectArrayChange('referencias', index, 'nombre', e.target.value)} className={`${inputClasses} text-sm`} />
                    <input placeholder="Relación" type="text" value={ref.relacion} onChange={(e) => handleObjectArrayChange('referencias', index, 'relacion', e.target.value)} className={`${inputClasses} text-sm`} />
                    <input placeholder="Celular / Email" type="text" value={ref.contacto} onChange={(e) => handleObjectArrayChange('referencias', index, 'contacto', e.target.value)} className={`${inputClasses} text-sm`} />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 space-y-2">
               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Pastor que le Invitó a la Fundación:</label>
               <input type="text" name="pastorQueInvito" value={formData.pastorQueInvito} onChange={handleChange} className={inputClasses} />
            </div>
          </div>

          {/* Sección Preguntas Finales */}
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3 flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
              Preguntas Adicionales
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">1. ¿Tiene Casa Propia?</label>
                <select name="tieneCasaPropia" value={formData.tieneCasaPropia} onChange={handleChange} className={`${inputClasses} text-sm`}>
                  <option value="">Seleccione</option>
                  <option value="SI">SI</option>
                  <option value="NO">NO</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">2. ¿La iglesia tiene propiedad?</label>
                <select name="iglesiaTienePropiedad" value={formData.iglesiaTienePropiedad} onChange={handleChange} className={`${inputClasses} text-sm`}>
                  <option value="">Seleccione</option>
                  <option value="SI">SI</option>
                  <option value="NO">NO</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">3. Necesidades (Familia Pastoral)</label>
                {formData.necesidadesFamiliaPastoral.map((v, i) => (
                  <input key={i} type="text" value={v} onChange={(e) => handleArrayChange('necesidadesFamiliaPastoral', i, e.target.value)} className={`${inputClasses} text-sm`} placeholder={`Necesidad ${i+1}`} />
                ))}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">4. Necesidades (Congregación)</label>
                 {formData.necesidadesCongregacion.map((v, i) => (
                  <input key={i} type="text" value={v} onChange={(e) => handleArrayChange('necesidadesCongregacion', i, e.target.value)} className={`${inputClasses} text-sm`} placeholder={`Necesidad ${i+1}`} />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 italic">5. ¿Tiene usted profesionales en su iglesia? (Mencione profesiones):</label>
              <textarea name="profesionalesIglesia" value={formData.profesionalesIglesia} onChange={handleChange} rows="3" className={inputClasses + " resize-none"} />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1 italic">6. Mencione un Proyecto Psico-social que quiera desarrollar:</label>
              <textarea name="proyectoPsicosocial" value={formData.proyectoPsicosocial} onChange={handleChange} rows="4" className={inputClasses + " resize-none"} />
            </div>

          </div>
        </div>

        {/* Footer Submit Button */}
        <div className="bg-gray-50 dark:bg-gray-900 p-10 border-t border-gray-100 dark:border-gray-700 flex flex-col items-center backdrop-blur-sm">
          <button 
            onClick={saveToDatabase}
            disabled={loading}
            className="w-full md:w-auto px-12 py-4 bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-300 font-extrabold rounded-2xl border border-blue-600/30 dark:border-blue-400/30 shadow-sm hover:shadow-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
          >
            {loading ? 'Guardando...' : (
              <>
                <Save className="w-6 h-6 text-blue-700 dark:text-blue-300" /> 
                <span className="text-blue-700 dark:text-blue-300">Guardar Documentación</span>
              </>
            )}
          </button>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-6 text-center max-w-lg">
            Sus datos se guardarán de forma segura en su perfil institucional de la Fundación Humanitaria Sol y Luna.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormularioFHSYL;
