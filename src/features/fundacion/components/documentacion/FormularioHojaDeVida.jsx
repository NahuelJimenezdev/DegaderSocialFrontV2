import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Save, 
  Download, 
  User, 
  Briefcase, 
  BookOpen, 
  Cross, 
  Users,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { toast } from 'react-hot-toast';
import userService from '../../../../api/userService';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import ImageModule from 'docxtemplater-image-module-free';
import { saveAs } from 'file-saver';

const SECTIONS = [
  { id: 'personal', title: 'Datos Generales', icon: User },
  { id: 'educacion', title: 'Nivel Educativo', icon: BookOpen },
  { id: 'experiencia', title: 'Experiencia', icon: Briefcase },
  { id: 'iglesia_talleres', title: 'Iglesia y Talleres', icon: Users },
  { id: 'idiomas_cargo', title: 'Idiomas y Cargo', icon: BookOpen },
  { id: 'referencias', title: 'Referencias', icon: Users },
  { id: 'firma', title: 'Firma Digital', icon: Save }
];

export default function FormularioHojaDeVida() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [firmaPreview, setFirmaPreview] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    // DATOS GENERALES
    nombre_completo: '',
    documento_num: '',
    lugar_expedicion: '',
    fecha_nacimiento: '',
    nacionalidad: '', // Usado para "Lugar de nacimiento" y "Pais"
    estado_civil: '',
    departamento_estado_provincia: '',
    municipio: '',
    direccion: '',
    telefono: '',
    email: '',
    frase_identificadora: '',
    descripcion_breve_ministerio_profesion: '',

    // NIVEL EDUCATIVO - EDUCACIÓN BÁSICA
    'completa/incompleta': 'completa',
    '1_grado': '', '2_grado': '', '3_grado': '', '_grado_4': '', '5_grado': '', // Primaria
    '6_grado': '', '7_grado': '', '8_grado': '', '9_grado': '', // Secundaria
    '10_grado': '', '11_grado': '', // Media
    fecha_mes_grado: '',
    fecha_año_grado: '',

    // EDUCACIÓN SUPERIOR
    seleccionar_tecnica: false, seleccionar_tecnologica: false, seleccionar_universitario: false, seleccionar_posgrado: false,
    numero_aprobado_1: '', graduadoSi_1: false, graduadoNo_1: false, nombreTitulo_1: '',
    numero_aprobado_2: '', graduadoSi_2: false, graduadoNo_2: false, nombreTitulo_2: '',
    numero_aprobado_3: '', graduadoSi_3: false, graduadoNo_3: false, nombreTitulo_3: '',

    // EXPERIENCIA - PRÁCTICAS
    'aplica/noAplica1': '', numero_horas1: '', exp_si1: false, exp_no1: false,
    'aplica/noAplica2': '', numero_horas2: '', exp_si2: false, exp_no2: false,
    'aplica/noAplica3': '', numero_horas3: '', exp_si3: false, exp_no3: false,

    // EXPERIENCIA LABORAL 1
    empresa_actual: '', departamento_empresa: '', municipio_empresa: '', email_empresa: '',
    teléfono_emrpesa: '', dia_inicio: '', mes_inicio: '', año_inicio: '',
    dia_fin: '', mes_fin: '', año_fin: '', cargo_empresa: '', dirección_empresa: '',
    sector_empresa: 'privada', // 'publica' o 'privada'

    // EXPERIENCIA LABORAL 2
    empresa_dos: '', departamento_empresa2: '', municipio_empresa2: '', email_empresa2: '',
    teléfono_emrpesa2: '', dia_inicio2: '', mes_inicio2: '', año_inicio2: '',
    dia_fin2: '', mes_fin2: '', año_fin2: '', cargo_empresa2: '', dirección_empresa2: '',
    sector_empresa2: 'privada',

    // EXPERIENCIA LABORAL 3
    empresa_tres: '', departamento_empresa3: '', municipio_empresa3: '', email_empresa3: '',
    teléfono_emrpesa3: '', dia_inicio3: '', mes_inicio3: '', año_inicio3: '',
    dia_fin3: '', mes_fin3: '', año_fin3: '', cargo_empresa3: '', dirección_empresa3: '',
    sector_empresa3: 'privada',

    // DATOS DE LA IGLESIA
    nombre_iglesia: '', nombre_pastor: '', telefono_pastor: '',
    país_iglesia: '', direccion_iglesia: '', ciudad_iglesia: '', estado_iglesia: '',

    // TALLERES MINISTERIALES
    academia_1: '', titulo_obtenido1: '', intensidad_horaria1: '', añoTaller1: '',
    academia_2: '', titulo_obtenido2: '', intensidad_horaria2: '', añoTaller2: '',
    academia_3: '', titulo_obtenido3: '', intensidad_horaria3: '', añoTaller3: '',
    academia_4: '', titulo_obtenido4: '', intensidad_horaria4: '', añoTaller4: '',

    // TALLERES PROFESIONALES
    academia_5: '', titulo_obtenido5: '', intensidad_horaria5: '', añoTaller5: '',
    academia_6: '', titulo_obtenido6: '', intensidad_horaria6: '', añoTaller6: '',
    academia_7: '', titulo_obtenido7: '', intensidad_horaria7: '', añoTaller7: '',
    academia_8: '', titulo_obtenido8: '', intensidad_horaria8: '', añoTaller8: '',

    // IDIOMAS
    idioma_1: '', habla_1: '', lee_1: '', escribe_1: '',
    idioma_2: '', habla_2: '', lee_2: '', escribe_2: '',
    idioma_3: '', habla_3: '', lee_3: '', escribe_3: '',

    // CARGO Y AUTORIZACION
    cargo_en_FHISYL: '',
    autorizo_si: false,
    autorizo_no: false,

    // REFERENCIAS FAMILIARES
    nombre_familia_1: '', parentezco_1: '', profesion_1: '', telefonofam_1: '',
    nombre_familia_2: '', parentezco_2: '', profesion_2: '', telefonofam_2: '',
    nombre_familia_3: '', parentezco_3: '', profesion_3: '', telefonofam_3: '',

    // REFERENCIAS PERSONALES
    nombre_personales_1: '', profesion_personal_1: '', telefonopers_1: '',
    nombre_personales_2: '', profesion_personal_2: '', telefonopers_2: '',
    nombre_personales_3: '', profesion_personal_3: '', telefonopers_3: ''
  });

  const getFullImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    const baseUrl = import.meta.env.VITE_API_URL || 'https://degadersocial.com';
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  // Cargar datos iniciales del usuario
  useEffect(() => {
    // Scroll window and main content to top on mount
    window.scrollTo(0, 0);
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.scrollTo(0, 0);
    }

    if (user) {
      setFormData(prev => ({
        ...prev,
        nombre_completo: `${user.nombres?.primero || ''} ${user.nombres?.segundo || ''} ${user.apellidos?.primero || ''} ${user.apellidos?.segundo || ''}`.replace(/\s+/g, ' ').trim(),
        email: user.email || '',
        telefono: user.personal?.celular || '',
        direccion: user.personal?.direccion || '',
        fecha_nacimiento: user.personal?.fechaNacimiento ? new Date(user.personal.fechaNacimiento).toISOString().split('T')[0] : '',
        nacionalidad: user.personal?.ubicacion?.pais || '',
        departamento_estado_provincia: user.fundacion?.territorio?.region || '',
        municipio: user.fundacion?.territorio?.zona || '',
        nombre_iglesia: user.eclesiastico?.iglesia?.nombre || '',
        documento_num: user.fundacion?.documentacionFHSYL?.upz || ''
      }));

      // Cargar datos específicos del formulario si existen en el backend
      if (user.fundacion?.hojaDeVida?.datos) {
        setFormData(prev => ({
          ...prev,
          ...user.fundacion.hojaDeVida.datos
        }));
      }
      
      if (user.social?.fotoPerfil) {
        setPhotoPreview(getFullImageUrl(user.social.fotoPerfil));
      }
    }
  }, [user]);

  const handleSave = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      await userService.saveHojaDeVida(formData);
      await refreshProfile();
      if (!silent) toast.success('Información guardada correctamente');
      return true;
    } catch (error) {
      console.error('Error al guardar Hoja de Vida:', error);
      if (!silent) toast.error('Error al guardar la información');
      return false;
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFirmaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFirmaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
        
        // Convertir blanco (o casi blanco) a transparente
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Si es muy claro, hacerlo transparente
          if (r > 200 && g > 200 && b > 200) {
            data[i + 3] = 0;
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = base64;
    });
  };

  const generateWord = async () => {
    // Primero guardamos la información por defecto
    const saved = await handleSave(true);
    if (!saved) {
      toast.error('No se pudo guardar la información antes de descargar. Inténtalo de nuevo.');
      return;
    }

    setLoading(true);
    try {
      // 1. Cargar el template desde la carpeta pública
      const response = await fetch('/templates/hoja_de_vida_template.docx');
      if (!response.ok) throw new Error('No se pudo cargar la plantilla de Word');
      
      const content = await response.arrayBuffer();
      const zip = new PizZip(content);
      
      // Configuración del módulo de imagen
      const opts = {
        centered: false,
        getImage: async (tagValue) => {
          if (!tagValue || tagValue === '---') return null;

          try {
            // Caso 1: Data URL (Base64)
            if (tagValue.toString().startsWith('data:image')) {
              const base64 = tagValue.split(',')[1];
              const binaryString = window.atob(base64);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              return bytes.buffer;
            }

            // Caso 2: URL (http o path absoluto)
            // Usar el proxy para evitar problemas de CORS
            const baseUrl = import.meta.env.VITE_API_URL || 'https://degadersocial.com';
            const proxyUrl = `${baseUrl}/api/upload/proxy?url=${encodeURIComponent(tagValue)}`;
            
            const response = await fetch(proxyUrl);
            if (!response.ok) throw new Error('Error al cargar imagen via proxy');
            return await response.arrayBuffer();
          } catch (error) {
            console.error('Error procesando imagen para Word:', error, 'TagValue:', tagValue);
          }

          return null;
        },
        getSize: (img, tagValue, tagName) => {
          if (tagName === 'foto_perfil') return [110, 140];
          if (tagName === 'firma_digital') return [180, 60];
          return [100, 100];
        },
      };
      
      const imageModule = new ImageModule(opts);
      
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        modules: [imageModule]
      });

      // Procesar firma para transparencia si existe
      let finalSignature = firmaPreview || '';
      if (finalSignature.startsWith('data:image')) {
        finalSignature = await processSignatureImage(finalSignature);
      }

      // 2. Mapear datos (asegurar que no haya nulos)
      const dataToRender = {
        ...formData,
        foto_perfil: photoPreview || '', // Etiqueta {%foto_perfil}
        firma_digital: finalSignature, // Etiqueta {%firma_digital}
        // Booleanos a X para el Word
        seleccionar_tecnica: formData.seleccionar_tecnica ? 'X' : '',
        seleccionar_tecnologica: formData.seleccionar_tecnologica ? 'X' : '',
        seleccionar_universitario: formData.seleccionar_universitario ? 'X' : '',
        seleccionar_posgrado: formData.seleccionar_posgrado ? 'X' : '',
        graduadoSi_1: formData.graduadoSi_1 ? 'X' : '',
        graduadoNo_1: formData.graduadoNo_1 ? 'X' : '',
        graduadoSi_2: formData.graduadoSi_2 ? 'X' : '',
        graduadoNo_2: formData.graduadoNo_2 ? 'X' : '',
        graduadoSi_3: formData.graduadoSi_3 ? 'X' : '',
        graduadoNo_3: formData.graduadoNo_3 ? 'X' : '',
        exp_si1: formData.exp_si1 ? 'X' : '',
        exp_no1: formData.exp_no1 ? 'X' : '',
        exp_si2: formData.exp_si2 ? 'X' : '',
        exp_no2: formData.exp_no2 ? 'X' : '',
        exp_si3: formData.exp_si3 ? 'X' : '',
        exp_no3: formData.exp_no3 ? 'X' : '',
        autorizo_si: formData.autorizo_si ? 'X' : '',
        autorizo_no: formData.autorizo_no ? 'X' : '',
        // Sector empresa (mapeo a x fija en el Word si coincide)
        empresa_actual_pub: formData.sector_empresa === 'publica' ? 'X' : '',
        empresa_actual_priv: formData.sector_empresa === 'privada' ? 'X' : '',
        empresa_dos_pub: formData.sector_empresa2 === 'publica' ? 'X' : '',
        empresa_dos_priv: formData.sector_empresa2 === 'privada' ? 'X' : '',
        empresa_tres_pub: formData.sector_empresa3 === 'publica' ? 'X' : '',
        empresa_tres_priv: formData.sector_empresa3 === 'privada' ? 'X' : '',
        // Corregir espacios en tags detectados en el template para Referencias Personales 2 y 3
        'profesion_personal _2': formData.profesion_personal_2,
        'profesion_personal _3': formData.profesion_personal_3
      };

      Object.keys(dataToRender).forEach(key => {
        if (dataToRender[key] === undefined || dataToRender[key] === null) {
          dataToRender[key] = '';
        }
      });

      // 3. Renderizar asincrónicamente
      await doc.renderAsync(dataToRender);

      // 4. Generar blob y descargar
      const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      
      saveAs(out, `Hoja_de_Vida_${formData.nombre_completo.replace(/\s+/g, '_')}.docx`);
      toast.success('¡Hoja de Vida generada con éxito!');
    } catch (error) {
      console.error('Error generando Word:', error);
      toast.error('Error al generar el documento. Verifica la plantilla.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    const inputClasses = "w-full p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900 dark:text-gray-100";
    const labelClasses = "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1";
    const textareaClasses = "w-full p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900 dark:text-gray-100 min-h-[120px]";
    const sectionTitleClasses = "text-lg font-black text-blue-600 dark:text-blue-400 mb-6 flex items-center gap-2 border-b border-blue-100 dark:border-blue-900/30 pb-2";

    const handleCheckboxChange = (name) => {
      setFormData(prev => ({ ...prev, [name]: !prev[name] }));
    };

    switch (activeSection) {
      case 'personal':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={sectionTitleClasses}><User size={20} /> Datos Generales</div>
            {/* Foto de Perfil */}
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700">
              <div className="relative group">
                <div className="w-32 h-40 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden shadow-inner">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Perfil" className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} className="text-gray-300" />
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg cursor-pointer hover:bg-blue-700 transition-all active:scale-90">
                  <Download size={16} className="rotate-180" />
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Foto para Hoja de Vida</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                  Sube una foto profesional. Se redimensionará automáticamente.
                </p>
                <div className="mt-3 flex gap-2 justify-center md:justify-start">
                  <button onClick={() => setPhotoPreview(user?.social?.fotoPerfil)} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                    Usar foto de perfil actual
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={labelClasses}>Nombre Completo</label>
                <input name="nombre_completo" value={formData.nombre_completo} onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Número de Documento</label>
                <input name="documento_num" value={formData.documento_num} onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Lugar de Expedición</label>
                <input name="lugar_expedicion" value={formData.lugar_expedicion} onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Fecha de Nacimiento</label>
                <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Lugar de Nacimiento / País</label>
                <input name="nacionalidad" value={formData.nacionalidad} onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Estado Civil</label>
                <input name="estado_civil" value={formData.estado_civil} onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Departamento / Prov / Estado</label>
                <input name="departamento_estado_provincia" value={formData.departamento_estado_provincia} onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Municipio / Ciudad</label>
                <input name="municipio" value={formData.municipio} onChange={handleChange} className={inputClasses} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClasses}>Dirección de Residencia</label>
                <input name="direccion" value={formData.direccion} onChange={handleChange} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Teléfono</label>
                <input name="telefono" value={formData.telefono} onChange={handleChange} className={inputClasses} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClasses}>Email</label>
                <input name="email" value={formData.email} onChange={handleChange} className={inputClasses} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClasses}>Frase Identificadora</label>
                <input name="frase_identificadora" value={formData.frase_identificadora} onChange={handleChange} className={inputClasses} placeholder="Una frase que te identifique..." />
              </div>
            </div>
          </div>
        );

      case 'educacion':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <div className={sectionTitleClasses}><BookOpen size={20} /> Educación Básica</div>
              <div className="bg-gray-50 dark:bg-gray-900/40 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 space-y-6">
                <div>
                  <label className={labelClasses}>Estado de Educación Básica</label>
                  <div className="flex gap-4">
                    {['completa', 'incompleta'].map(val => (
                      <button
                        key={val}
                        onClick={() => setFormData(prev => ({ ...prev, 'completa/incompleta': val }))}
                        className={`flex-1 py-2 rounded-xl font-bold transition ${formData['completa/incompleta'] === val ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      >
                        {val.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>Grados Cursados (Marca los aprobados)</label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(num => {
                      const key = num === 4 ? '_grado_4' : `${num}_grado`;
                      return (
                        <button
                          key={num}
                          onClick={() => setFormData(prev => ({ ...prev, [key]: prev[key] ? '' : 'X' }))}
                          className={`p-2 rounded-lg text-sm font-bold border transition ${formData[key] === 'X' ? 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-300 text-indigo-700 dark:text-indigo-300' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'}`}
                        >
                          {num}°
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>Mes de Grado</label>
                    <input name="fecha_mes_grado" value={formData.fecha_mes_grado} onChange={handleChange} className={inputClasses} placeholder="Ej: Junio" />
                  </div>
                  <div>
                    <label className={labelClasses}>Año de Grado</label>
                    <input name="fecha_año_grado" value={formData.fecha_año_grado} onChange={handleChange} className={inputClasses} placeholder="Ej: 2015" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className={sectionTitleClasses}><BookOpen size={20} /> Educación Superior</div>
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-700">
                  {[
                    { id: 'seleccionar_tecnica', label: 'Técnica' },
                    { id: 'seleccionar_tecnologica', label: 'Tecnológica' },
                    { id: 'seleccionar_universitario', label: 'Universitaria' },
                    { id: 'seleccionar_posgrado', label: 'Posgrado' }
                  ].map(item => (
                    <label key={item.id} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" checked={formData[item.id]} onChange={() => handleCheckboxChange(item.id)} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition">{item.label}</span>
                    </label>
                  ))}
                </div>

                {[1, 2, 3].map(i => (
                  <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <label className={labelClasses}>Título o Estudio {i}</label>
                        <input name={`nombreTitulo_${i}`} value={formData[`nombreTitulo_${i}`]} onChange={handleChange} className={inputClasses} />
                      </div>
                      <div>
                        <label className={labelClasses}>Semestres</label>
                        <input name={`numero_aprobado_${i}`} value={formData[`numero_aprobado_${i}`]} onChange={handleChange} className={inputClasses} placeholder="N°" />
                      </div>
                      <div className="flex items-center gap-4 pt-6">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked={formData[`graduadoSi_${i}`]} onChange={() => setFormData(prev => ({ ...prev, [`graduadoSi_${i}`]: !prev[`graduadoSi_${i}`], [`graduadoNo_${i}`]: false }))} className="rounded" />
                          <span className="text-xs font-bold text-green-600">SÍ</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked={formData[`graduadoNo_${i}`]} onChange={() => setFormData(prev => ({ ...prev, [`graduadoNo_${i}`]: !prev[`graduadoNo_${i}`], [`graduadoSi_${i}`]: false }))} className="rounded" />
                          <span className="text-xs font-bold text-red-600">NO</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'experiencia':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <div className={sectionTitleClasses}><Briefcase size={20} /> Prácticas Formativas</div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="md:col-span-2">
                        <label className={labelClasses}>Corporación / Universidad {i}</label>
                        <input name={`aplica/noAplica${i}`} value={formData[`aplica/noAplica${i}`]} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div>
                        <label className={labelClasses}>Horas</label>
                        <input name={`numero_horas${i}`} value={formData[`numero_horas${i}`]} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div className="flex items-center gap-4 pt-6">
                        <label className="text-xs font-black text-gray-400 uppercase mr-1">Aprobado:</label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked={formData[`exp_si${i}`]} onChange={() => setFormData(prev => ({ ...prev, [`exp_si${i}`]: !prev[`exp_si${i}`], [`exp_no${i}`]: false }))} className="rounded" />
                          <span className="text-xs font-bold text-green-600">SÍ</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked={formData[`exp_no${i}`]} onChange={() => setFormData(prev => ({ ...prev, [`exp_no${i}`]: !prev[`exp_no${i}`], [`exp_si${i}`]: false }))} className="rounded" />
                          <span className="text-xs font-bold text-red-600">NO</span>
                        </label>
                      </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className={sectionTitleClasses}><Briefcase size={20} /> Experiencia Laboral</div>
              <div className="space-y-8">
                {[
                  { prefix: '', label: 'Actual o Última' },
                  { prefix: '2', label: 'Anterior' },
                  { prefix: '3', label: 'Anterior' }
                ].map((exp, idx) => (
                  <div key={idx} className="p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
                    <h5 className="font-black text-gray-400 text-sm uppercase tracking-widest">{exp.label} Empresa</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-1">
                        <label className={labelClasses}>Empresa o Entidad</label>
                        <input name={exp.prefix === '' ? 'empresa_actual' : `empresa_${exp.prefix === '2' ? 'dos' : 'tres'}`} value={formData[exp.prefix === '' ? 'empresa_actual' : `empresa_${exp.prefix === '2' ? 'dos' : 'tres'}`]} onChange={handleChange} className={inputClasses} />
                      </div>
                      <div className="md:col-span-1">
                        <label className={labelClasses}>Sector</label>
                        <select 
                          name={`sector_empresa${exp.prefix}`} 
                          value={formData[`sector_empresa${exp.prefix}`]} 
                          onChange={handleChange} 
                          className={inputClasses}
                        >
                          <option value="privada">Privada</option>
                          <option value="publica">Pública</option>
                        </select>
                      </div>
                      <div> <label className={labelClasses}>Departamento</label> <input name={`departamento_empresa${exp.prefix}`} value={formData[`departamento_empresa${exp.prefix}`]} onChange={handleChange} className={inputClasses} /> </div>
                      <div> <label className={labelClasses}>Municipio</label> <input name={`municipio_empresa${exp.prefix}`} value={formData[`municipio_empresa${exp.prefix}`]} onChange={handleChange} className={inputClasses} /> </div>
                      <div> <label className={labelClasses}>E-mail Empresa</label> <input name={`email_empresa${exp.prefix}`} value={formData[`email_empresa${exp.prefix}`]} onChange={handleChange} className={inputClasses} /> </div>
                      <div> <label className={labelClasses}>Teléfono Empresa</label> <input name={`teléfono_emrpesa${exp.prefix}`} value={formData[`teléfono_emrpesa${exp.prefix}`]} onChange={handleChange} className={inputClasses} /> </div>
                      <div className="md:col-span-2 grid grid-cols-3 gap-2">
                        <div className="col-span-3"><label className={labelClasses}>Fecha de Ingreso (DD/MM/AAAA)</label></div>
                        <input name={`dia_inicio${exp.prefix}`} value={formData[`dia_inicio${exp.prefix}`]} onChange={handleChange} className={inputClasses} placeholder="DD" />
                        <input name={`mes_inicio${exp.prefix}`} value={formData[`mes_inicio${exp.prefix}`]} onChange={handleChange} className={inputClasses} placeholder="MM" />
                        <input name={`año_inicio${exp.prefix}`} value={formData[`año_inicio${exp.prefix}`]} onChange={handleChange} className={inputClasses} placeholder="AAAA" />
                      </div>
                      <div className="md:col-span-2 grid grid-cols-3 gap-2">
                        <div className="col-span-3"><label className={labelClasses}>Fecha de Retiro (DD/MM/AAAA)</label></div>
                        <input name={`dia_fin${exp.prefix}`} value={formData[`dia_fin${exp.prefix}`]} onChange={handleChange} className={inputClasses} placeholder="DD" />
                        <input name={`mes_fin${exp.prefix}`} value={formData[`mes_fin${exp.prefix}`]} onChange={handleChange} className={inputClasses} placeholder="MM" />
                        <input name={`año_fin${exp.prefix}`} value={formData[`año_fin${exp.prefix}`]} onChange={handleChange} className={inputClasses} placeholder="AAAA" />
                      </div>
                      <div className="md:col-span-2"> <label className={labelClasses}>Cargo o Contrato</label> <input name={`cargo_empresa${exp.prefix}`} value={formData[`cargo_empresa${exp.prefix}`]} onChange={handleChange} className={inputClasses} /> </div>
                      <div className="md:col-span-2"> <label className={labelClasses}>Dirección de la Empresa</label> <input name={`dirección_empresa${exp.prefix}`} value={formData[`dirección_empresa${exp.prefix}`]} onChange={handleChange} className={inputClasses} /> </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'iglesia_talleres':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <div className={sectionTitleClasses}><Users size={20} /> Datos de la Iglesia</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"> <label className={labelClasses}>Nombre de la Iglesia</label> <input name="nombre_iglesia" value={formData.nombre_iglesia} onChange={handleChange} className={inputClasses} /> </div>
                <div> <label className={labelClasses}>Nombre del Pastor</label> <input name="nombre_pastor" value={formData.nombre_pastor} onChange={handleChange} className={inputClasses} /> </div>
                <div> <label className={labelClasses}>Teléfono Pastor</label> <input name="telefono_pastor" value={formData.telefono_pastor} onChange={handleChange} className={inputClasses} /> </div>
                <div> <label className={labelClasses}>País</label> <input name="país_iglesia" value={formData.país_iglesia} onChange={handleChange} className={inputClasses} /> </div>
                <div> <label className={labelClasses}>Ciudad</label> <input name="ciudad_iglesia" value={formData.ciudad_iglesia} onChange={handleChange} className={inputClasses} /> </div>
                <div className="md:col-span-2"> <label className={labelClasses}>Dirección</label> <input name="direccion_iglesia" value={formData.direccion_iglesia} onChange={handleChange} className={inputClasses} /> </div>
                <div className="md:col-span-2"> <label className={labelClasses}>Departamento / Prov / Estado</label> <input name="estado_iglesia" value={formData.estado_iglesia} onChange={handleChange} className={inputClasses} /> </div>
              </div>
            </div>

            <div>
              <div className={sectionTitleClasses}><BookOpen size={20} /> Talleres y Congresos Ministeriales</div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-4"> <label className={labelClasses}>Academia</label> <input name={`academia_${i}`} value={formData[`academia_${i}`]} onChange={handleChange} className={inputClasses} /> </div>
                    <div className="md:col-span-4"> <label className={labelClasses}>Título</label> <input name={`titulo_obtenido${i}`} value={formData[`titulo_obtenido${i}`]} onChange={handleChange} className={inputClasses} /> </div>
                    <div className="md:col-span-2"> <label className={labelClasses}>Horas</label> <input name={`intensidad_horaria${i}`} value={formData[`intensidad_horaria${i}`]} onChange={handleChange} className={inputClasses} /> </div>
                    <div className="md:col-span-2"> <label className={labelClasses}>Año</label> <input name={`añoTaller${i}`} value={formData[`añoTaller${i}`]} onChange={handleChange} className={inputClasses} /> </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'idiomas_cargo':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <div className={sectionTitleClasses}><BookOpen size={20} /> Talleres y Congresos Profesionales</div>
              <div className="space-y-4">
                {[5, 6, 7, 8].map(i => (
                  <div key={i} className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-4"> <label className={labelClasses}>Academia</label> <input name={`academia_${i}`} value={formData[`academia_${i}`]} onChange={handleChange} className={inputClasses} /> </div>
                    <div className="md:col-span-4"> <label className={labelClasses}>Título</label> <input name={`titulo_obtenido${i}`} value={formData[`titulo_obtenido${i}`]} onChange={handleChange} className={inputClasses} /> </div>
                    <div className="md:col-span-2"> <label className={labelClasses}>Horas</label> <input name={`intensidad_horaria${i}`} value={formData[`intensidad_horaria${i}`]} onChange={handleChange} className={inputClasses} /> </div>
                    <div className="md:col-span-2"> <label className={labelClasses}>Año</label> <input name={`añoTaller${i}`} value={formData[`añoTaller${i}`]} onChange={handleChange} className={inputClasses} /> </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className={sectionTitleClasses}><BookOpen size={20} /> Idiomas</div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div> <label className={labelClasses}>Idioma {i}</label> <input name={`idioma_${i}`} value={formData[`idioma_${i}`]} onChange={handleChange} className={inputClasses} /> </div>
                    <div> <label className={labelClasses}>Habla</label> <input name={`habla_${i}`} value={formData[`habla_${i}`]} onChange={handleChange} className={inputClasses} placeholder="Bajo/Medio/Alto" /> </div>
                    <div> <label className={labelClasses}>Lee</label> <input name={`lee_${i}`} value={formData[`lee_${i}`]} onChange={handleChange} className={inputClasses} placeholder="Bajo/Medio/Alto" /> </div>
                    <div> <label className={labelClasses}>Escribe</label> <input name={`escribe_${i}`} value={formData[`escribe_${i}`]} onChange={handleChange} className={inputClasses} placeholder="Bajo/Medio/Alto" /> </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className={sectionTitleClasses}><User size={20} /> Cargo a Desempeñar en la Fundación</div>
              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>Cargo que aspira</label>
                  <input name="cargo_en_FHISYL" value={formData.cargo_en_FHISYL} onChange={handleChange} className={inputClasses} placeholder="Nombre del cargo que aspira..." />
                </div>
                <div>
                  <label className={labelClasses}>Breve descripción del ministerio / profesión</label>
                  <textarea name="descripcion_breve_ministerio_profesion" value={formData.descripcion_breve_ministerio_profesion} onChange={handleChange} className={textareaClasses} placeholder="Describe tu ministerio o profesión..." />
                </div>
              </div>
            </div>
          </div>
        );

      case 'referencias':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <div className={sectionTitleClasses}><Users size={20} /> Referencias Familiares</div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-5 bg-gray-50 dark:bg-gray-900/40 rounded-3xl border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2"> <label className={labelClasses}>Nombre Completo {i}</label> <input name={`nombre_familia_${i}`} value={formData[`nombre_familia_${i}`]} onChange={handleChange} className={inputClasses} /> </div>
                    <div> <label className={labelClasses}>Parentesco</label> <input name={`parentezco_${i}`} value={formData[`parentezco_${i}`]} onChange={handleChange} className={inputClasses} /> </div>
                    <div> <label className={labelClasses}>Profesión</label> <input name={`profesion_${i}`} value={formData[`profesion_${i}`]} onChange={handleChange} className={inputClasses} /> </div>
                    <div className="md:col-span-2"> <label className={labelClasses}>Teléfono</label> <input name={`telefonofam_${i}`} value={formData[`telefonofam_${i}`]} onChange={handleChange} className={inputClasses} /> </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className={sectionTitleClasses}><Users size={20} /> Referencias Personales</div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-5 bg-gray-50 dark:bg-gray-900/40 rounded-3xl border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2"> <label className={labelClasses}>Nombre Completo {i}</label> <input name={`nombre_personales_${i}`} value={formData[`nombre_personales_${i}`]} onChange={handleChange} className={inputClasses} /> </div>
                    <div> <label className={labelClasses}>Profesión</label> <input name={`profesion_personal_${i}`} value={formData[`profesion_personal_${i}`]} onChange={handleChange} className={inputClasses} /> </div>
                    <div> <label className={labelClasses}>Teléfono</label> <input name={`telefonopers_${i}`} value={formData[`telefonopers_${i}`]} onChange={handleChange} className={inputClasses} /> </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'firma':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <div className={sectionTitleClasses}><AlertCircle size={20} /> Autorización de Datos</div>
              <div className="p-8 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/30 text-center">
                <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed mb-6 font-medium">
                  AUTORIZO A LA FUNDACIÓN HUMANITARIA SOL Y LUNA A USAR LA INFORMACIÓN AQUÍ SUMINISTRADA PARA EL TRATAMIENTO DE MIS DATOS, ÚNICAMENTE PARA FINES Y PROPÓSITOS RELACIONADAS CON LAS FUNCIONES ASIGNADAS A MI CARGO Y BAJO LOS OBJETIVOS DE LA MISIÓN Y VISIÓN DE LA FUNDACIÓN. CERTIFICO QUE LOS DATOS SON VERACES (LEY 1581 DE 2012).
                </p>
                <div className="flex justify-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={formData.autorizo_si} onChange={() => setFormData(prev => ({ ...prev, autorizo_si: !prev.autorizo_si, autorizo_no: false }))} className="w-6 h-6 rounded-lg border-amber-300 text-amber-600 focus:ring-amber-500" />
                    <span className="font-black text-amber-700 dark:text-amber-400">SÍ, AUTORIZO</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={formData.autorizo_no} onChange={() => setFormData(prev => ({ ...prev, autorizo_no: !prev.autorizo_no, autorizo_si: false }))} className="w-6 h-6 rounded-lg border-amber-300 text-red-600 focus:ring-amber-500" />
                    <span className="font-black text-red-700 dark:text-red-400">NO AUTORIZO</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <div className={sectionTitleClasses}><Save size={20} /> Firma Digital</div>
              <div className="flex flex-col items-center gap-6 p-10 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-700 border-dashed">
                <div className="w-64 h-32 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden shadow-inner relative">
                  {firmaPreview ? (
                    <img src={firmaPreview} alt="Firma" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-gray-300 text-xs font-bold uppercase tracking-widest text-center px-4">Sube una imagen de tu firma o trazo digital</span>
                  )}
                </div>
                <label className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg cursor-pointer hover:bg-indigo-700 transition active:scale-95 flex items-center gap-2">
                  <Download size={18} className="rotate-180" />
                  Subir Firma
                  <input type="file" accept="image/*" onChange={handleFirmaChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-16 pb-8 md:py-8">
      {/* Botón Volver */}
      <button 
        onClick={() => navigate('/fundacion')} 
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 font-bold transition-all group"
      >
        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        Volver a Fundación
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-80 bg-gray-50 dark:bg-gray-900/40 p-6 border-r border-gray-100 dark:border-gray-700">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
              Hoja de Vida
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Completa tu información para generar el formato oficial de la fundación.
            </p>
          </div>

          <nav className="space-y-2">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl text-left font-bold transition-all ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98]'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  {section.title}
                </button>
              );
            })}
          </nav>

          <div className="mt-12 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-900/30">
            <div className="flex gap-3 text-amber-700 dark:text-amber-400">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-xs leading-relaxed">
                Los datos se pre-cargan desde tu perfil, pero puedes modificarlos aquí solo para el documento.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-10 flex flex-col">
          <div className="flex-1">
            {renderContent()}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              * El diseño del Word se mantendrá intacto.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleSave(false)}
                disabled={loading}
                className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
              >
                <Save size={22} />
                Guardar Información
              </button>
              <button
                onClick={generateWord}
                disabled={loading}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
              >
                {loading ? (
                  <>Procesando...</>
                ) : (
                  <>
                    <Download size={22} />
                    Descargar Word (.docx)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
