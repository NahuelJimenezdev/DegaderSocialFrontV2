import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Save, 
  Download, 
  User, 
  Briefcase, 
  BookOpen, 
  Users,
  AlertCircle,
  FileText,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { useToast } from '../../../../shared/components/Toast/ToastProvider';
import userService from '../../../../api/userService';
import { downloadCV } from '../../utils/docUtils';

// Componente de sección extraído para evitar re-montajes que causan pérdida de foco
const FormSection = ({ title, icon: Icon, children }) => (
  <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-[2rem] p-6 md:p-8 border border-gray-100 dark:border-gray-700/50 shadow-sm mb-8 transition-all hover:shadow-md">
    <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-100 dark:border-gray-700/30">
      <div className="p-3 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-2xl">
        <Icon size={22} strokeWidth={2.5} />
      </div>
      <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{title}</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-7">
      {children}
    </div>
  </div>
);

export default function FormularioHojaDeVida() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [firmaPreview, setFirmaPreview] = useState(null);

  // Estado del formulario (Mantenido exactamente igual para no perder datos)
  const [formData, setFormData] = useState({
    // DATOS GENERALES
    nombre_completo: '',
    tipo_documento: '',
    documento_num: '',
    lugar_expedicion: '',
    fecha_nacimiento: '',
    nacionalidad: '', 
    estado_civil: '',
    departamento_estado_provincia: '',
    municipio: '',
    direccion: '',
    telefono: '',
    email: '',
    frase_identificadora: '',
    cargo_en_FHISYL: '',
    descripcion_breve_ministerio_profesion: '',
    autorizo_si: false,
    autorizo_no: false,

    // NIVEL EDUCATIVO - EDUCACIÓN BÁSICA
    'completa/incompleta': 'completa',
    ...Array.from({ length: 11 }, (_, i) => ({ [`grado${i + 1}`]: '' })).reduce((a, b) => ({ ...a, ...b }), {}),
    fecha_mes_grado: '',
    fecha_año_grado: '',
    nivel_educacion_superior: 'sin_estudios',
    nombreTitulo_1: '', numero_aprobado_1: '', graduadoSi_1: false, graduadoNo_1: false,
    nombreTitulo_2: '', numero_aprobado_2: '', graduadoSi_2: false, graduadoNo_2: false,
    nombreTitulo_3: '', numero_aprobado_3: '', graduadoSi_3: false, graduadoNo_3: false,

    // Prácticas y Experiencia
    modo_practicas1: 'sin_experiencia', modo_practicas2: 'sin_experiencia', modo_practicas3: 'sin_experiencia',
    'aplica/noAplica1': '', numero_horas1: '', exp_si1: false, exp_no1: false,
    'aplica/noAplica2': '', numero_horas2: '', exp_si2: false, exp_no2: false,
    'aplica/noAplica3': '', numero_horas3: '', exp_si3: false, exp_no3: false,

    modo_experiencia: 'sin_experiencia', modo_experiencia2: 'sin_experiencia', modo_experiencia3: 'sin_experiencia',
    empresa_actual: '', sector_empresa: 'privada', cargo_empresa: '', departamento_empresa: '', municipio_empresa: '', email_empresa: '', telefono_empresa: '', dia_inicio: '', mes_inicio: '', año_inicio: '', dia_fin: '', mes_fin: '', año_fin: '', trabajando_actualmente: false, direccion_empresa: '',
    empresa_dos: '', sector_empresa2: 'privada', cargo_empresa2: '', departamento_empresa2: '', municipio_empresa2: '', email_empresa2: '', telefono_empresa2: '', dia_inicio2: '', mes_inicio2: '', año_inicio2: '', dia_fin2: '', mes_fin2: '', año_fin2: '', trabajando_actualmente2: false, direccion_empresa2: '',
    empresa_tres: '', sector_empresa3: 'privada', cargo_empresa3: '', departamento_empresa3: '', municipio_empresa3: '', email_empresa3: '', telefono_empresa3: '', dia_inicio3: '', mes_inicio3: '', año_inicio3: '', dia_fin3: '', mes_fin3: '', año_fin3: '', trabajando_actualmente3: false, direccion_empresa3: '',

    nombre_iglesia: '', nombre_pastor: '', telefono_pastor: '', país_iglesia: '', ciudad_iglesia: '', estado_iglesia: '', direccion_iglesia: '',
    
    ...Array.from({ length: 8 }, (_, i) => ({ 
      [`modo_talleres${i + 1}`]: 'sin_datos',
      [`academia_${i + 1}`]: '', 
      [`titulo_obtenido${i + 1}`]: '', 
      [`intensidad_horaria${i + 1}`]: '', 
      [`añoTaller${i + 1}`]: '' 
    })).reduce((a, b) => ({ ...a, ...b }), {}),

    ...Array.from({ length: 3 }, (_, i) => ({ 
      [`modo_idiomas${i + 1}`]: 'sin_datos',
      [`idioma_${i + 1}`]: '', 
      [`habla_${i + 1}`]: '', 
      [`lee_${i + 1}`]: '', 
      [`escribe_${i + 1}`]: '' 
    })).reduce((a, b) => ({ ...a, ...b }), {}),
    
    nombre_familia_1: '', parentezco_1: '', profesion_1: '', telefonofam_1: '',
    nombre_familia_2: '', parentezco_2: '', profesion_2: '', telefonofam_2: '',
    nombre_familia_3: '', parentezco_3: '', profesion_3: '', telefonofam_3: '',

    // REFERENCIAS PERSONALES
    nombre_personales_1: '', profesion_personal_1: '', telefonopers_1: '',
    nombre_personales_2: '', profesion_personal_2: '', telefonopers_2: '',
    nombre_personales_3: '', profesion_personal_3: '', telefonopers_3: '',

    // IMAGENES
    foto_perfil_form: null,
    firma_digital: null
  });

  const getFullImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    const baseUrl = import.meta.env.VITE_API_URL || 'https://degadersocial.com';
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  useEffect(() => {
    // Solo scrollear al inicio si entramos por primera vez
    window.scrollTo(0, 0);
    const mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.scrollTo(0, 0);

    if (user) {
      const baseData = {
        nombre_completo: user.nombres ? `${user.nombres.primero} ${user.nombres.segundo || ''} ${user.apellidos?.primero || ''} ${user.apellidos?.segundo || ''}`.trim() : '',
        email: user.email || '',
        telefono: user.personal?.celular || user.personal?.telefonoFijo || '',
        direccion: user.personal?.direccion || '',
        fecha_nacimiento: (() => {
          if (!user.personal?.fechaNacimiento) return '';
          const d = new Date(user.personal.fechaNacimiento);
          return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
        })(),
        nacionalidad: user.personal?.nacionalidad || user.personal?.ubicacion?.pais || '',
        departamento_estado_provincia: user.personal?.ubicacion?.departamento || user.personal?.ubicacion?.provincia || user.fundacion?.territorio?.region || user.personal?.ubicacion?.estado || '',
        municipio: user.personal?.ubicacion?.ciudad || user.personal?.ubicacion?.municipio || user.fundacion?.territorio?.zona || user.fundacion?.territorio?.municipio || '',
        documento_num: user.personal?.documentoNumero || user.personal?.documento || user.documento || '',
        tipo_documento: user.fundacion?.documentacionFHSYL?.tipoDocumento || user.personal?.tipoDocumento || '',
        lugar_expedicion: user.personal?.lugarExpedicion || user.personal?.expedicion || '',
        estado_civil: user.fundacion?.documentacionFHSYL?.estadoCivil || user.personal?.estadoCivil || '',
        nombre_personales_1: user.fundacion?.documentacionFHSYL?.referencias?.[0]?.nombre || '',
        profesion_personal_1: user.fundacion?.documentacionFHSYL?.referencias?.[0]?.relacion || '',
        telefonopers_1: user.fundacion?.documentacionFHSYL?.referencias?.[0]?.contacto || '',
        nombre_personales_2: user.fundacion?.documentacionFHSYL?.referencias?.[1]?.nombre || '',
        profesion_personal_2: user.fundacion?.documentacionFHSYL?.referencias?.[1]?.relacion || '',
        telefonopers_2: user.fundacion?.documentacionFHSYL?.referencias?.[1]?.contacto || '',
        nombre_iglesia: user.eclesiastico?.iglesia?.nombre || '',
        cargo_en_FHISYL: user.fundacion?.cargo || ''
      };

      const hojaDeVidaDatos = user.fundacion?.hojaDeVida?.datos || {};
      const savedData = {};
      Object.entries(hojaDeVidaDatos).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          savedData[key] = value;
          if (key === 'profesion_personal2' || key === 'profesion2_personal') savedData['profesion_personal_2'] = value;
          if (key === 'profesion_personal3' || key === 'profesion3_personal') savedData['profesion_personal_3'] = value;
          if (key === 'doc_num' || key === 'documento') savedData['documento_num'] = value;
          if (key === 'lugar_exp' || key === 'expedicion') savedData['lugar_expedicion'] = value;
          if (key === 'teléfono_emrpesa') savedData['telefono_empresa'] = value;
          if (key === 'teléfono_emrpesa2') savedData['telefono_empresa2'] = value;
          if (key === 'teléfono_emrpesa3') savedData['telefono_empresa3'] = value;
          if (key === 'dirección_empresa') savedData['direccion_empresa'] = value;
          if (key === 'dirección_empresa2') savedData['direccion_empresa2'] = value;
          if (key === 'dirección_empresa3') savedData['direccion_empresa3'] = value;
        }
      });

      setFormData(prev => ({ ...prev, ...baseData, ...savedData }));
      
      if (savedData.foto_perfil_form) {
        setPhotoPreview(savedData.foto_perfil_form);
      } else if (user.social?.fotoPerfil) {
        setPhotoPreview(getFullImageUrl(user.social.fotoPerfil));
      }

      if (savedData.firma_digital) {
        setFirmaPreview(getFullImageUrl(savedData.firma_digital));
      }
    }
  }, [user]);

  const LOCALSTORAGE_KEY = `fundacion_hdv_${user?._id || 'draft'}`;

  // Restaurar de localStorage si no hay data en el servidor
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCALSTORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const serverData = user?.fundacion?.hojaDeVida?.datos || {};
        const hasServerData = Object.keys(serverData).some(k => serverData[k] && String(serverData[k]).trim());
        if (!hasServerData && Object.keys(parsed).length > 0) {
          setFormData(prev => ({ ...prev, ...parsed }));
        }
      }
    } catch (e) { /* noop */ }
  }, []);

  // Auto-guardado local
  useEffect(() => {
    try {
      const dataToCache = { ...formData };
      if (dataToCache.foto_perfil_form?.length > 50000) delete dataToCache.foto_perfil_form;
      if (dataToCache.firma_digital?.length > 50000) delete dataToCache.firma_digital;
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(dataToCache));
    } catch (e) { /* noop */ }
  }, [formData, LOCALSTORAGE_KEY]);

  const handleSave = async (silent = false) => {
    // 🔍 VALIDACIÓN: Solo si no es un guardado silencioso (auto-save)
    if (!silent) {
       const required = [
         { key: 'nombre_completo', label: 'Nombre Completo' },
         { key: 'documento_num', label: 'Número de Documento' },
         { key: 'lugar_expedicion', label: 'Lugar de Expedición' },
         { key: 'fecha_nacimiento', label: 'Fecha de Nacimiento' },
         { key: 'nacionalidad', label: 'País / Nacionalidad' },
         { key: 'direccion', label: 'Dirección' },
         { key: 'telefono', label: 'Teléfono' },
         { key: 'email', label: 'E-mail' },
         { key: 'nombre_iglesia', label: 'Nombre de la Iglesia' },
         { key: 'cargo_en_FHISYL', label: 'Cargo al que aspira' }
       ];

       const missing = required.filter(f => !formData[f.key] || !String(formData[f.key]).trim());
       
       if (missing.length > 0) {
         toast.error(`Falta el campo obligatorio: ${missing[0].label}`);
         setLoading(false);
         return false;
       }

       if (!formData.autorizo_si && !formData.autorizo_no) {
         toast.error('Debe marcar si Autoriza o No el tratamiento de datos');
         setLoading(false);
         return false;
       }
    }

    if (!silent) setLoading(true);
    try {
      const dataToSave = { ...formData };
      
      // Procesar Educación Superior
      if (formData.nivel_educacion_superior === 'sin_estudios') {
        [1,2,3].forEach(i => {
          dataToSave[`nombreTitulo_${i}`] = 'Sin datos';
          dataToSave[`numero_aprobado_${i}`] = '---';
        });
      } else {
        [2,3].forEach(i => {
          if (!dataToSave[`nombreTitulo_${i}`]) dataToSave[`nombreTitulo_${i}`] = 'Sin datos';
        });
      }

      // Procesar Prácticas
      [1,2,3].forEach(i => {
        if (formData[`modo_practicas${i}`] === 'sin_experiencia') {
          dataToSave[`aplica/noAplica${i}`] = 'Sin experiencia Laboral de practicas';
          dataToSave[`numero_horas${i}`] = '0';
        }
      });

      // Procesar Experiencia Laboral
      const expKeys = ['', '2', '3'];
      expKeys.forEach(p => {
        const modoKey = p === '' ? 'modo_experiencia' : `modo_experiencia${p}`;
        const empKey = p === '' ? 'empresa_actual' || 'empresa_actual' : `empresa_${p === '2' ? 'dos' : 'tres'}`;
        
        if (formData[modoKey] === 'sin_experiencia') {
          dataToSave[empKey] = 'Sin experiencia Laboral/Ministerial';
          dataToSave[`cargo_empresa${p}`] = 'N/A';
        } else if (formData[p === '' ? 'trabajando_actualmente' : `trabajando_actualmente${p}`]) {
          dataToSave[`dia_fin${p}`] = '---';
          dataToSave[`mes_fin${p}`] = 'Trabajando Actualmente';
          dataToSave[`año_fin${p}`] = '---';
        }
      });

      // Procesar Talleres e Idiomas de forma independiente
      Array.from({ length: 8 }).forEach((_, i) => { 
        if (formData[`modo_talleres${i+1}`] === 'sin_datos') {
          dataToSave[`academia_${i+1}`] = 'Sin datos';
          dataToSave[`titulo_obtenido${i+1}`] = 'Sin datos';
        }
      });
      Array.from({ length: 3 }).forEach((_, i) => { 
        if (formData[`modo_idiomas${i+1}`] === 'sin_datos') {
          dataToSave[`idioma_${i+1}`] = 'Sin datos adicionales';
        }
      });

      const response = await userService.saveHojaDeVida(dataToSave);
      if (response?.success && response?.data) updateUser(response.data);
      // 🔧 MANTENER BACKUP: Ya no borramos el localStorage para que sirva de respaldo permanente
      if (!silent) toast.success('Información guardada correctamente');
      return true;
    } catch (error) {
      if (!silent) toast.error('Error al guardar. Datos respaldados localmente.');
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
        setFormData(prev => ({ ...prev, foto_perfil_form: reader.result }));
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
        setFormData(prev => ({ ...prev, firma_digital: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const generateWord = async () => {
    const saved = await handleSave(true);
    if (!saved) return toast.error('Error al guardar antes de descargar.');
    setLoading(true);
    try {
      const success = await downloadCV(user, formData, { photo: photoPreview, firma: firmaPreview });
      if (success) toast.success('Hoja de Vida generada con éxito.');
    } catch (error) {
      toast.error('Error al generar el documento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-16 pb-48 md:py-12 relative">
      <style>{`
        .label-premium {
          display: block;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
          margin-left: 0.25rem;
          color: #64748b; /* slate-500 */
        }
        .dark .label-premium {
          color: #94a3b8; /* slate-400 */
        }
        .form-input-premium {
          width: 100%;
          padding: 0.875rem 1rem;
          background-color: #ffffff;
          border: 1.5px solid #f1f5f9;
          border-radius: 1rem;
          font-size: 0.9375rem;
          font-weight: 500;
          color: #1e293b;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
        }
        .dark .form-input-premium {
          background-color: #0f172a; /* slate-900 */
          border-color: #1e293b; /* slate-800 */
          color: #f1f5f9;
        }
        .form-input-premium:focus {
          border-color: #3b82f6;
          background-color: #ffffff;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        .dark .form-input-premium:focus {
          background-color: #020617;
          border-color: #60a5fa;
          box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.15);
        }
        .form-input-premium::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }
      `}</style>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate('/fundacion')} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-all group">
          <div className="p-2 rounded-xl group-hover:bg-blue-50 transition-colors">
            <ChevronLeft size={20} />
          </div>
          Volver
        </button>
        <div className="text-right">
          <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Formato Oficial</span>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-none">Hoja de Vida FHISYL</h1>
        </div>
      </div>

      <div className="mb-10 p-8 bg-blue-600 rounded-[2.5rem] shadow-xl shadow-blue-500/20 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-blue-400 rounded-full blur-3xl opacity-20" />
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          {/* Avatar Formulario */}
          <div className="relative shrink-0">
            <div className="w-32 h-40 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 flex items-center justify-center overflow-hidden shadow-2xl transition-transform hover:scale-105 duration-300">
              {photoPreview ? (
                <img src={photoPreview} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <User size={64} className="text-white/40" />
              )}
            </div>
            <label className="absolute -bottom-3 -right-3 p-3 bg-white text-blue-600 rounded-2xl shadow-xl cursor-pointer hover:bg-gray-50 transition-all active:scale-90 border-2 border-blue-600">
              <ImageIcon size={18} />
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
          </div>
          <div>
            <h3 className="text-2xl font-black italic">Tu Perfil Oficial</h3>
            <p className="text-blue-100 text-sm mt-2 max-w-xl leading-relaxed">
              Completa cada sección para generar el documento de Hoja de Vida. Recuerda que la veracidad de los datos es fundamental.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase font-bold tracking-wider">
               <span className="px-3 py-1 bg-white/10 rounded-full">Sincronizado con Perfil</span>
               <span className="px-3 py-1 bg-white/10 rounded-full font-black text-white">130 CAMPOS ACTORES</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECCIÓN 1: DATOS GENERALES --- */}
      <FormSection title="Datos Generales" icon={User}>
        <div className="md:col-span-2 lg:col-span-3">
          <label className="label-premium">Nombre Completo</label>
          <input name="nombre_completo" value={formData.nombre_completo} onChange={handleChange} className="form-input-premium w-full" />
        </div>
        <div>
          <label className="label-premium">Tipo de Documento</label>
          <select 
            name="tipo_documento" 
            value={formData.tipo_documento} 
            onChange={handleChange} 
            className="form-input-premium w-full"
          >
            <option value="">Seleccione...</option>
            <option value="DNI">DNI (Documento Nacional de Identidad)</option>
            <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
            <option value="Cédula de Extranjería">Cédula de Extranjería</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
            <option value="Registro Civil">Registro Civil</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div>
          <label className="label-premium">Número de Documento</label>
          <input name="documento_num" value={formData.documento_num} onChange={handleChange} className="form-input-premium w-full" />
        </div>
        <div>
          <label className="label-premium">Lugar de Expedición</label>
          <input name="lugar_expedicion" value={formData.lugar_expedicion} onChange={handleChange} className="form-input-premium w-full" />
        </div>
        <div>
          <label className="label-premium">Fecha de Nacimiento</label>
          <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} className="form-input-premium w-full" />
        </div>
        <div>
          <label className="label-premium">País / Nacionalidad</label>
          <input name="nacionalidad" value={formData.nacionalidad} onChange={handleChange} className="form-input-premium w-full" />
        </div>
        <div>
          <label className="label-premium">Estado Civil</label>
          <input name="estado_civil" value={formData.estado_civil} onChange={handleChange} className="form-input-premium w-full" />
        </div>
        <div>
          <label className="label-premium">Departamento / Provincia / Estado</label>
          <input name="departamento_estado_provincia" value={formData.departamento_estado_provincia} onChange={handleChange} className="form-input-premium w-full" />
        </div>
        <div>
          <label className="label-premium">Municipio / Ciudad</label>
          <input name="municipio" value={formData.municipio} onChange={handleChange} className="form-input-premium w-full" />
        </div>
        <div className="md:col-span-2">
          <label className="label-premium">Dirección de Residencia</label>
          <input name="direccion" value={formData.direccion} onChange={handleChange} className="form-input-premium w-full" />
        </div>
        <div>
          <label className="label-premium">Teléfono</label>
          <input name="telefono" value={formData.telefono} onChange={handleChange} className="form-input-premium w-full" />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <label className="label-premium">E-mail</label>
          <input name="email" value={formData.email} onChange={handleChange} className="form-input-premium w-full" />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <label className="label-premium">Frase Identificadora</label>
          <input name="frase_identificadora" value={formData.frase_identificadora} onChange={handleChange} className="form-input-premium w-full" placeholder="Una frase que te identifique..." />
        </div>
      </FormSection>

      {/* --- SECCIÓN 2: EDUCACIÓN --- */}
      <FormSection title="Nivel Educativo" icon={BookOpen}>
        <div className="md:col-span-2 lg:col-span-3 bg-gray-50 dark:bg-gray-900/40 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700">
           <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">Educación Básica</h4>
           <div className="flex gap-4 mb-6">
              {['completa', 'incompleta'].map(val => (
                <button
                  key={val}
                  onClick={() => setFormData(prev => ({ ...prev, 'completa/incompleta': val }))}
                  className={`flex-1 py-3 rounded-2xl font-black text-sm transition-all ${formData['completa/incompleta'] === val ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700'}`}
                >
                  {val.toUpperCase()}
                </button>
              ))}
            </div>
            <label className="label-premium mb-3">Grados Aprobados (Clic para marcar)</label>
            <div className={`grid grid-cols-4 sm:grid-cols-6 md:grid-cols-11 gap-2 mb-6 ${formData['completa/incompleta'] === 'completa' ? 'opacity-40 pointer-events-none' : ''}`}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(num => (
                <button
                  key={num}
                  disabled={formData['completa/incompleta'] === 'completa'}
                  onClick={() => setFormData(prev => ({ ...prev, [`grado${num}`]: prev[`grado${num}`] === 'X' ? '' : 'X' }))}
                  className={`py-3 rounded-xl text-xs font-black border-2 transition-all ${formData[`grado${num}`] === 'X' ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400'}`}
                >
                  {num}°
                </button>
              ))}
            </div>
            <div className={`grid grid-cols-2 gap-4 ${formData['completa/incompleta'] === 'incompleta' ? 'opacity-40 pointer-events-none' : ''}`}>
              <div> <label className="label-premium text-[10px]">Mes de Grado</label> <input name="fecha_mes_grado" disabled={formData['completa/incompleta'] === 'incompleta'} value={formData.fecha_mes_grado} onChange={handleChange} className="form-input-premium w-full" placeholder="Ej: Diciembre" /> </div>
              <div> <label className="label-premium text-[10px]">Año de Grado</label> <input name="fecha_año_grado" disabled={formData['completa/incompleta'] === 'incompleta'} value={formData.fecha_año_grado} onChange={handleChange} className="form-input-premium w-full" placeholder="AAAA" /> </div>
            </div>
        </div>

        <div className="md:col-span-2 lg:col-span-3 mt-4">
          <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">Educación Superior</h4>
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-50 dark:border-gray-700">
              {[
                { id: 'tecnica', label: 'Técnica' },
                { id: 'tecnologica', label: 'Tecnológica' },
                { id: 'pregrado', label: 'Pregrado' },
                { id: 'posgrado', label: 'Posgrado' },
                { id: 'sin_estudios', label: 'Sin estudios' }
              ].map(item => (
                <label key={item.id} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="nivel_educacion_superior" 
                    value={item.id}
                    checked={formData.nivel_educacion_superior === item.id} 
                    onChange={handleChange} 
                    className="w-5 h-5 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500" 
                  />
                  <span className="text-xs font-black text-gray-600 dark:text-gray-300 group-hover:text-blue-600 transition tracking-tight">{item.label}</span>
                </label>
              ))}
          </div>
          
          <div className={`space-y-4 ${formData.nivel_educacion_superior === 'sin_estudios' ? 'opacity-40 pointer-events-none' : ''}`}>
            {[1, 2, 3].map(i => (
              <div key={i} className="p-6 bg-gray-50 dark:bg-gray-900/40 rounded-3xl border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-2">
                  <label className="label-premium text-[10px]">Título u Obra Realizada {i}</label>
                  <input name={`nombreTitulo_${i}`} value={formData[`nombreTitulo_${i}`]} onChange={handleChange} className="form-input-premium w-full bg-white dark:bg-gray-800" placeholder={i > 1 ? "Opcional (Sin datos)" : "Ingrese el título"} />
                </div>
                <div>
                  <label className="label-premium text-[10px]">Semestres / Años</label>
                  <input name={`numero_aprobado_${i}`} value={formData[`numero_aprobado_${i}`]} onChange={handleChange} className="form-input-premium w-full bg-white dark:bg-gray-800" />
                </div>
                <div>
                  <label className="label-premium text-[10px] block text-center mb-2">TERMINADA</label>
                  <div className="flex justify-center gap-4 bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={formData[`graduadoSi_${i}`]} onChange={() => setFormData(prev => ({ ...prev, [`graduadoSi_${i}`]: !prev[`graduadoSi_${i}`], [`graduadoNo_${i}`]: false }))} className="rounded" />
                      <span className="text-[10px] font-black text-green-600">SÍ</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={formData[`graduadoNo_${i}`]} onChange={() => setFormData(prev => ({ ...prev, [`graduadoNo_${i}`]: !prev[`graduadoNo_${i}`], [`graduadoSi_${i}`]: false }))} className="rounded" />
                      <span className="text-[10px] font-black text-red-600">NO</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FormSection>

      {/* --- SECCIÓN 3: EXPERIENCIA --- */}
      <FormSection title="Experiencia Laboral" icon={Briefcase}>
        <div className="md:col-span-2 lg:col-span-3">
          <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">Prácticas Formativas (Solo Estudiantes)</h4>
          <div className="space-y-6">
             {[1, 2, 3].map(i => (
                <div key={i} className="p-6 bg-gray-50 dark:bg-gray-900/40 rounded-3xl border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                       <label className="label-premium text-[10px]">Modo de Práctica {i}</label>
                       <select 
                         name={`modo_practicas${i}`} 
                         value={formData[`modo_practicas${i}`]} 
                         onChange={handleChange} 
                         className="form-input-premium w-full bg-white dark:bg-gray-800 text-xs font-bold"
                       >
                         <option value="sin_experiencia">🚫 Sin experiencia Laboral de practicas</option>
                         <option value="ingresar_datos">✍️ Ingresar datos</option>
                       </select>
                    </div>
                  </div>

                  <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 items-end ${formData[`modo_practicas${i}`] === 'sin_experiencia' ? 'opacity-30 pointer-events-none' : ''}`}>
                    <div className="md:col-span-2">
                       <label className="label-premium text-[9px]">Corporación / Empresa {i}</label>
                       <input name={`aplica/noAplica${i}`} value={formData[`aplica/noAplica${i}`]} onChange={handleChange} className="form-input-premium w-full text-sm bg-white dark:bg-gray-800" />
                    </div>
                    <div className="w-full">
                       <label className="label-premium text-[9px]">Horas Totales</label>
                       <input name={`numero_horas${i}`} value={formData[`numero_horas${i}`]} onChange={handleChange} className="form-input-premium w-full text-sm bg-white dark:bg-gray-800" />
                    </div>
                    <div className="flex items-center justify-center gap-4 h-11 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                      <span className="text-[10px] font-black text-gray-400 mr-2">TERMINÓ</span>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={formData[`exp_si${i}`]} onChange={() => setFormData(prev => ({ ...prev, [`exp_si${i}`]: !prev[`exp_si${i}`], [`exp_no${i}`]: false }))} className="rounded" />
                        <span className="text-[10px] font-black text-green-600">SÍ</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={formData[`exp_no${i}`]} onChange={() => setFormData(prev => ({ ...prev, [`exp_no${i}`]: !prev[`exp_no${i}`], [`exp_si${i}`]: false }))} className="rounded" />
                        <span className="text-[10px] font-black text-red-600">NO</span>
                      </label>
                    </div>
                  </div>
                </div>
             ))}
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-3 mt-8">
            <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-6">Trayectoria Profesional / Ministerial</h4>
            <div className="space-y-12">
              {[
                { prefix: '', label: 'Cargo Actual o Último', modoKey: 'modo_experiencia' },
                { prefix: '2', label: 'Cargo Anterior (2)', modoKey: 'modo_experiencia2' },
                { prefix: '3', label: 'Cargo Anterior (3)', modoKey: 'modo_experiencia3' }
              ].map((exp, idx) => (
                <div key={idx} className="relative p-6 md:p-8 bg-gray-50 dark:bg-gray-900/40 rounded-[2.5rem] border border-gray-100 dark:border-gray-700">
                  <span className="absolute -top-3 left-8 px-4 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase shadow-lg">{exp.label}</span>
                  
                  <div className="mb-6 max-w-xs">
                    <label className="label-premium text-[10px]">Historial Laboral</label>
                    <select 
                      name={exp.modoKey} 
                      value={formData[exp.modoKey]} 
                      onChange={handleChange} 
                      className="form-input-premium w-full bg-white dark:bg-gray-800 font-bold text-xs"
                    >
                      <option value="sin_experiencia">🚫 Sin Experiencia Laboral/Ministerial</option>
                      <option value="cargar_datos">✍️ Cargar datos</option>
                    </select>
                  </div>

                  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${formData[exp.modoKey] === 'sin_experiencia' ? 'opacity-30 pointer-events-none' : ''}`}>
                    <div className="lg:col-span-2">
                       <label className="label-premium">Empresa o Entidad</label>
                       <input name={exp.prefix === '' ? 'empresa_actual' : `empresa_${exp.prefix === '2' ? 'dos' : 'tres'}`} value={formData[exp.prefix === '' ? 'empresa_actual' : `empresa_${exp.prefix === '2' ? 'dos' : 'tres'}`]} onChange={handleChange} className="form-input-premium w-full bg-white dark:bg-gray-800" />
                    </div>
                    <div>
                       <label className="label-premium">Sector</label>
                       <select name={`sector_empresa${exp.prefix}`} value={formData[`sector_empresa${exp.prefix}`]} onChange={handleChange} className="form-input-premium w-full bg-white dark:bg-gray-800">
                          <option value="privada">📍 PRIVADA</option>
                          <option value="publica">🏛️ PÚBLICA</option>
                       </select>
                    </div>
                    <div>
                       <label className="label-premium">Cargo Desempeñado</label>
                       <input name={`cargo_empresa${exp.prefix}`} value={formData[`cargo_empresa${exp.prefix}`]} onChange={handleChange} className="form-input-premium w-full bg-white dark:bg-gray-800" />
                    </div>
                    <div> <label className="label-premium text-[9px]">Departamento</label> <input name={`departamento_empresa${exp.prefix}`} value={formData[`departamento_empresa${exp.prefix}`]} onChange={handleChange} className="form-input-premium w-full text-sm bg-white dark:bg-gray-800" /> </div>
                    <div> <label className="label-premium text-[9px]">Municipio / Ciudad</label> <input name={`municipio_empresa${exp.prefix}`} value={formData[`municipio_empresa${exp.prefix}`]} onChange={handleChange} className="form-input-premium w-full text-sm bg-white dark:bg-gray-800" /> </div>
                    <div> <label className="label-premium text-[9px]">Email Empresa</label> <input name={`email_empresa${exp.prefix}`} value={formData[`email_empresa${exp.prefix}`]} onChange={handleChange} className="form-input-premium w-full text-sm bg-white dark:bg-gray-800" /> </div>
                    <div> <label className="label-premium text-[9px]">Teléfono Empresa</label> <input name={`telefono_empresa${exp.prefix}`} value={formData[`telefono_empresa${exp.prefix}`]} onChange={handleChange} className="form-input-premium w-full text-sm bg-white dark:bg-gray-800" /> </div>
                    <div className="lg:col-span-2">
                       <label className="label-premium text-[9px]">Fecha de Ingreso (DD/MM/AAAA)</label>
                       <div className="grid grid-cols-3 gap-2">
                          <input name={`dia_inicio${exp.prefix}`} value={formData[`dia_inicio${exp.prefix}`]} onChange={handleChange} className="form-input-premium w-full text-center bg-white dark:bg-gray-800" placeholder="DD" />
                          <input name={`mes_inicio${exp.prefix}`} value={formData[`mes_inicio${exp.prefix}`]} onChange={handleChange} className="form-input-premium w-full text-center bg-white dark:bg-gray-800" placeholder="MM" />
                          <input name={`año_inicio${exp.prefix}`} value={formData[`año_inicio${exp.prefix}`]} onChange={handleChange} className="form-input-premium w-full text-center bg-white dark:bg-gray-800" placeholder="AAAA" />
                       </div>
                    </div>
                    <div className="lg:col-span-2">
                       <label className="label-premium text-[9px] flex justify-between items-center">
                          Fecha de Retiro (DD/MM/AAAA)
                          <div className="flex items-center gap-1.5 cursor-pointer">
                             <input 
                               type="checkbox" 
                               checked={formData[exp.prefix === '' ? 'trabajando_actualmente' : `trabajando_actualmente${exp.prefix}`]} 
                               onChange={() => setFormData(prev => ({ ...prev, [exp.prefix === '' ? 'trabajando_actualmente' : `trabajando_actualmente${exp.prefix}`]: !prev[exp.prefix === '' ? 'trabajando_actualmente' : `trabajando_actualmente${exp.prefix}`] }))} 
                               className="rounded w-3 h-3" 
                             />
                             <span className="text-[8px] font-black text-blue-600 dark:text-blue-400">TRABAJANDO ACTUALMENTE</span>
                          </div>
                       </label>
                       <div className={`grid grid-cols-3 gap-2 ${formData[exp.prefix === '' ? 'trabajando_actualmente' : `trabajando_actualmente${exp.prefix}`] ? 'opacity-20 pointer-events-none' : ''}`}>
                          <input name={`dia_fin${exp.prefix}`} value={formData[`dia_fin${exp.prefix}`]} onChange={handleChange} className="form-input-premium w-full text-center bg-white dark:bg-gray-800" placeholder="DD" />
                          <input name={`mes_fin${exp.prefix}`} value={formData[`mes_fin${exp.prefix}`]} onChange={handleChange} className="form-input-premium w-full text-center bg-white dark:bg-gray-800" placeholder="MM" />
                          <input name={`año_fin${exp.prefix}`} value={formData[`año_fin${exp.prefix}`]} onChange={handleChange} className="form-input-premium w-full text-center bg-white dark:bg-gray-800" placeholder="AAAA" />
                       </div>
                    </div>
                    <div className="lg:col-span-4"> <label className="label-premium text-[9px]">Dirección Completa de la Empresa</label> <input name={`direccion_empresa${exp.prefix}`} value={formData[`direccion_empresa${exp.prefix}`]} onChange={handleChange} className="form-input-premium w-full text-sm bg-white dark:bg-gray-800" /> </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </FormSection>

      {/* --- SECCIÓN 4: IGLESIA Y TALLERES --- */}
      <FormSection title="Vida Eclesiástica y Formación" icon={Users}>
         <div className="md:col-span-2 lg:col-span-3">
            <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">Congregación</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               <div className="md:col-span-3"> <label className="label-premium">Nombre de la Iglesia</label> <input name="nombre_iglesia" value={formData.nombre_iglesia} onChange={handleChange} className="form-input-premium w-full" /> </div>
               <div> <label className="label-premium">Nombre del Pastor</label> <input name="nombre_pastor" value={formData.nombre_pastor} onChange={handleChange} className="form-input-premium w-full" /> </div>
               <div> <label className="label-premium">Teléfono Pastor</label> <input name="telefono_pastor" value={formData.telefono_pastor} onChange={handleChange} className="form-input-premium w-full" /> </div>
               <div> <label className="label-premium">País</label> <input name="país_iglesia" value={formData.país_iglesia} onChange={handleChange} className="form-input-premium w-full" /> </div>
               <div> <label className="label-premium">Ciudad / Municipio</label> <input name="ciudad_iglesia" value={formData.ciudad_iglesia} onChange={handleChange} className="form-input-premium w-full" /> </div>
               <div> <label className="label-premium">Dep. / Estado</label> <input name="estado_iglesia" value={formData.estado_iglesia} onChange={handleChange} className="form-input-premium w-full" /> </div>
               <div className="md:col-span-3"> <label className="label-premium">Dirección de la Iglesia</label> <input name="direccion_iglesia" value={formData.direccion_iglesia} onChange={handleChange} className="form-input-premium w-full" /> </div>
            </div>
         </div>

         <div className="md:col-span-2 lg:col-span-3 mt-8">
            <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">Talleres y Congresos Ministeriales</h4>
            <div className="space-y-6">
               {[1, 2, 3, 4].map(i => (
                  <div key={i} className="p-6 bg-gray-50 dark:bg-gray-900/40 rounded-3xl border border-gray-100 dark:border-gray-700">
                    <div className="mb-4 max-w-xs">
                      <label className="label-premium text-[10px]">Taller Ministerial {i}</label>
                      <select name={`modo_talleres${i}`} value={formData[`modo_talleres${i}`]} onChange={handleChange} className="form-input-premium w-full font-bold text-xs bg-white dark:bg-gray-800">
                        <option value="sin_datos">🚫 Sin datos / No aplica</option>
                        <option value="cargar_datos">✍️ Cargar datos</option>
                      </select>
                    </div>
                    <div className={`grid grid-cols-1 md:grid-cols-12 gap-3 items-end ${formData[`modo_talleres${i}`] === 'sin_datos' ? 'opacity-30 pointer-events-none' : ''}`}>
                      <div className="md:col-span-4"> <label className="label-premium text-[8px]">Academia / Entidad</label> <input name={`academia_${i}`} value={formData[`academia_${i}`]} onChange={handleChange} className="form-input-premium w-full text-xs bg-white dark:bg-gray-800" /> </div>
                      <div className="md:col-span-4"> <label className="label-premium text-[8px]">Título Obtenido</label> <input name={`titulo_obtenido${i}`} value={formData[`titulo_obtenido${i}`]} onChange={handleChange} className="form-input-premium w-full text-xs bg-white dark:bg-gray-800" /> </div>
                      <div className="md:col-span-2"> <label className="label-premium text-[8px]">H. Inten.</label> <input name={`intensidad_horaria${i}`} value={formData[`intensidad_horaria${i}`]} onChange={handleChange} className="form-input-premium w-full text-xs text-center bg-white dark:bg-gray-800" /> </div>
                      <div className="md:col-span-2"> <label className="label-premium text-[8px]">Año</label> <input name={`añoTaller${i}`} value={formData[`añoTaller${i}`]} onChange={handleChange} className="form-input-premium w-full text-xs text-center bg-white dark:bg-gray-800" /> </div>
                    </div>
                  </div>
               ))}
            </div>
         </div>
      </FormSection>

      {/* --- SECCIÓN 5: IDIOMAS Y CARGO --- */}
      <FormSection title="Habilidades y Aspiración" icon={FileText}>
          <div className="md:col-span-2 lg:col-span-3">
            <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">Talleres y Congresos Profesionales</h4>
            <div className="space-y-6">
               {[5, 6, 7, 8].map(i => (
                  <div key={i} className="p-6 bg-gray-50 dark:bg-gray-900/40 rounded-3xl border border-gray-100 dark:border-gray-700">
                    <div className="mb-4 max-w-xs">
                      <label className="label-premium text-[10px]">Taller Profesional {i}</label>
                      <select name={`modo_talleres${i}`} value={formData[`modo_talleres${i}`]} onChange={handleChange} className="form-input-premium w-full font-bold text-xs bg-white dark:bg-gray-800">
                        <option value="sin_datos">🚫 Sin datos / No aplica</option>
                        <option value="cargar_datos">✍️ Cargar datos</option>
                      </select>
                    </div>
                    <div className={`grid grid-cols-1 md:grid-cols-12 gap-3 items-end ${formData[`modo_talleres${i}`] === 'sin_datos' ? 'opacity-30 pointer-events-none' : ''}`}>
                      <div className="md:col-span-4"> <label className="label-premium text-[8px]">Entidad</label> <input name={`academia_${i}`} value={formData[`academia_${i}`]} onChange={handleChange} className="form-input-premium w-full text-xs bg-white dark:bg-gray-800" /> </div>
                      <div className="md:col-span-4"> <label className="label-premium text-[8px]">Título Obtenido</label> <input name={`titulo_obtenido${i}`} value={formData[`titulo_obtenido${i}`]} onChange={handleChange} className="form-input-premium w-full text-xs bg-white dark:bg-gray-800" /> </div>
                      <div className="md:col-span-2"> <label className="label-premium text-[8px]">Horas</label> <input name={`intensidad_horaria${i}`} value={formData[`intensidad_horaria${i}`]} onChange={handleChange} className="form-input-premium w-full text-xs text-center bg-white dark:bg-gray-800" /> </div>
                      <div className="md:col-span-2"> <label className="label-premium text-[8px]">Año</label> <input name={`añoTaller${i}`} value={formData[`añoTaller${i}`]} onChange={handleChange} className="form-input-premium w-full text-xs text-center bg-white dark:bg-gray-800" /> </div>
                    </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="md:col-span-2 lg:col-span-3 mt-8">
            <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">Idiomas</h4>
            <div className="grid grid-cols-1 gap-6">
               {[1, 2, 3].map(i => (
                  <div key={i} className="p-6 bg-gray-50 dark:bg-gray-900/40 rounded-3xl border border-gray-100 dark:border-gray-700">
                    <div className="mb-4 max-w-xs">
                      <label className="label-premium text-[10px]">Idioma {i}</label>
                      <select name={`modo_idiomas${i}`} value={formData[`modo_idiomas${i}`]} onChange={handleChange} className="form-input-premium w-full font-bold text-xs bg-white dark:bg-gray-800">
                        <option value="sin_datos">🚫 Sin datos adicional</option>
                        <option value="cargar_datos">✍️ Cargar datos</option>
                      </select>
                    </div>
                    <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 items-end ${formData[`modo_idiomas${i}`] === 'sin_datos' ? 'opacity-30 pointer-events-none' : ''}`}>
                      <div> <label className="label-premium">Nombre Idioma</label> <input name={`idioma_${i}`} value={formData[`idioma_${i}`]} onChange={handleChange} className="form-input-premium w-full bg-white dark:bg-gray-800" /> </div>
                      <div> <label className="label-premium text-[10px]">Habla (%)</label> <input name={`habla_${i}`} value={formData[`habla_${i}`]} onChange={handleChange} className="form-input-premium w-full bg-white dark:bg-gray-800" placeholder="Ej: 80%" /> </div>
                      <div> <label className="label-premium text-[10px]">Lee (%)</label> <input name={`lee_${i}`} value={formData[`lee_${i}`]} onChange={handleChange} className="form-input-premium w-full bg-white dark:bg-gray-800" placeholder="Ej: 90%" /> </div>
                      <div> <label className="label-premium text-[10px]">Escribe (%)</label> <input name={`escribe_${i}`} value={formData[`escribe_${i}`]} onChange={handleChange} className="form-input-premium w-full bg-white dark:bg-gray-800" placeholder="Ej: 70%" /> </div>
                    </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="md:col-span-2 lg:col-span-3 mt-8">
            <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">Aspiración Institucional</h4>
            <div className="space-y-6 bg-blue-50/30 dark:bg-blue-900/10 p-6 rounded-[2rem] border border-blue-100 dark:border-blue-900/30">
                <div>
                   <label className="label-premium text-blue-700 dark:text-blue-300">Cargo al que aspira en la Fundación</label>
                   <input name="cargo_en_FHISYL" value={formData.cargo_en_FHISYL} onChange={handleChange} className="form-input-premium w-full" placeholder="Escribe el nombre del cargo..." />
                </div>
                <div>
                   <label className="label-premium text-blue-700 dark:text-blue-300">Breve descripción de su ministerio / profesión</label>
                   <textarea name="descripcion_breve_ministerio_profesion" value={formData.descripcion_breve_ministerio_profesion} onChange={handleChange} className="form-input-premium w-full h-32 pt-4 shadow-inner" placeholder="Explica brevemente tu experiencia y propósito..." />
                </div>
            </div>
         </div>
      </FormSection>

      {/* --- SECCIÓN 6: REFERENCIAS --- */}
      <FormSection title="Referencias" icon={Users}>
         <div className="md:col-span-2 lg:col-span-3">
            <h4 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-4">Relaciones Familiares</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-6 bg-gray-50 dark:bg-gray-900/40 rounded-3xl border border-gray-100 dark:border-gray-700 hover:border-emerald-200 transition-all">
                    <div className="mb-4"> <label className="label-premium text-[9px]">Nombre Completo {i}</label> <input name={`nombre_familia_${i}`} value={formData[`nombre_familia_${i}`]} onChange={handleChange} className="form-input-premium w-full bg-white dark:bg-gray-800" /> </div>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                       <div> <label className="label-premium text-[9px]">Parentesco</label> <input name={`parentezco_${i}`} value={formData[`parentezco_${i}`]} onChange={handleChange} className="form-input-premium w-full bg-white dark:bg-gray-800" /> </div>
                       <div> <label className="label-premium text-[9px]">Profesión</label> <input name={`profesion_${i}`} value={formData[`profesion_${i}`]} onChange={handleChange} className="form-input-premium w-full bg-white dark:bg-gray-800" /> </div>
                    </div>
                    <div> <label className="label-premium text-[9px]">Contacto / Celular</label> <input name={`telefonofam_${i}`} value={formData[`telefonofam_${i}`]} onChange={handleChange} className="form-input-premium w-full bg-white dark:bg-gray-800" /> </div>
                  </div>
                ))}
            </div>
         </div>

         <div className="md:col-span-2 lg:col-span-3 mt-8">
            <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4">Relaciones Personales</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-6 bg-gray-50 dark:bg-gray-900/40 rounded-3xl border border-gray-100 dark:border-gray-700 hover:border-indigo-200 transition-all">
                    <div className="mb-4"> <label className="label-premium text-[10px]">Nombre Completo {i}</label> <input name={`nombre_personales_${i}`} value={formData[`nombre_personales_${i}`]} onChange={handleChange} className="form-input-premium w-full bg-white dark:bg-gray-800" /> </div>
                    <div className="mb-4"> <label className="label-premium text-[10px]">Profesión</label> <input name={`profesion_personal_${i}`} value={formData[`profesion_personal_${i}`]} onChange={handleChange} className="form-input-premium w-full bg-white dark:bg-gray-800" /> </div>
                    <div> <label className="label-premium text-[10px]">Contacto / Celular</label> <input name={`telefonopers_${i}`} value={formData[`telefonopers_${i}`]} onChange={handleChange} className="form-input-premium w-full bg-white dark:bg-gray-800" /> </div>
                  </div>
                ))}
            </div>
         </div>
      </FormSection>

      {/* --- SECCIÓN 7: AUTORIZACIÓN Y FIRMA --- */}
      <FormSection title="Compromiso Legal y Firma" icon={CheckCircle2}>
         <div className="md:col-span-2 lg:col-span-3">
            <div className="p-8 bg-amber-50 dark:bg-amber-900/10 rounded-[2.5rem] border border-amber-100 dark:border-amber-900/30 font-medium">
               <div className="flex gap-4 items-start mb-6">
                 <AlertCircle className="shrink-0 text-amber-600" size={24} />
                 <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                   AUTORIZO A LA FUNDACIÓN HUMANITARIA SOL Y LUNA A USAR LA INFORMACIÓN AQUÍ SUMINISTRADA PARA EL TRATAMIENTO DE MIS DATOS, ÚNICAMENTE PARA FINES Y PROPÓSITOS RELACIONADAS CON LAS FUNCIONES ASIGNADAS A MI CARGO Y BAJO LOS OBJETIVOS DE LA MISIÓN Y VISIÓN DE LA FUNDACIÓN. CERTIFICO QUE LOS DATOS SON VERACES (LEY 1581 DE 2012).
                 </p>
               </div>
               <div className="flex justify-center gap-8">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" name="autorizo_si" checked={formData.autorizo_si} onChange={() => setFormData(prev => ({ ...prev, autorizo_si: !prev.autorizo_si, autorizo_no: false }))} className="w-6 h-6 rounded-lg text-emerald-600" />
                    <span className="font-black text-amber-700 dark:text-amber-400 text-sm">SÍ, AUTORIZO</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" name="autorizo_no" checked={formData.autorizo_no} onChange={() => setFormData(prev => ({ ...prev, autorizo_no: !prev.autorizo_no, autorizo_si: false }))} className="w-6 h-6 rounded-lg text-red-600" />
                    <span className="font-black text-red-700 dark:text-red-400 text-sm">NO AUTORIZO</span>
                  </label>
               </div>
            </div>
         </div>

         <div className="md:col-span-2 lg:col-span-3 mt-8">
            <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center mb-6">Trazo Digital / Firma</h4>
            <div className="flex flex-col items-center gap-8 p-10 bg-gray-50 dark:bg-gray-900/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800 shadow-inner">
                <div className="w-full max-w-sm h-40 bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-100 dark:border-gray-700 flex items-center justify-center overflow-hidden shadow-2xl relative group">
                  {firmaPreview ? (
                    <img src={firmaPreview} alt="Firma" className="w-full h-full object-contain p-4 transition-transform group-hover:scale-110 duration-500" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-300">
                      <ImageIcon size={32} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Sube tu firma</span>
                    </div>
                  )}
                </div>
                <label className="px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl shadow-indigo-500/30 cursor-pointer hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-3">
                  <Download size={22} className="rotate-180" />
                  SELECCIONAR FIRMA
                  <input type="file" accept="image/*" onChange={handleFirmaChange} className="hidden" />
                </label>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">PNG, JPG recomendado (Fondo blanco)</p>
            </div>
         </div>
      </FormSection>

      {/* --- PANEL DE ACCIONES --- */}
      <div className="mt-16 w-full max-w-4xl mx-auto px-4">
         <div className="bg-white dark:bg-gray-900/80 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left pl-0 md:pl-4">
               <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase leading-none mb-1">Guardado Inteligente</p>
               <p className="text-[8px] text-gray-400 font-medium tracking-tight uppercase">Datos sincronizados automáticamente</p>
            </div>
            
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
               <button
                  onClick={() => handleSave(false)}
                  disabled={loading}
                  className="flex-1 sm:flex-none px-10 py-4 bg-emerald-600 text-white rounded-[2rem] font-black hover:bg-emerald-700 hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 shadow-lg shadow-emerald-500/20"
               >
                  <Save size={20} />
                  <span>Guardar</span>
               </button>
               <button
                  onClick={generateWord}
                  disabled={loading}
                  className="flex-1 sm:flex-none px-10 py-4 bg-blue-600 text-white rounded-[2rem] font-black hover:bg-blue-700 hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 shadow-lg shadow-blue-500/20"
               >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Download size={20} />
                      <span>Descargar Word</span>
                    </>
                  )}
               </button>
            </div>
         </div>
         <p className="mt-8 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-50">
           Fundación Humanitaria Internacional Sol y Luna • Formato Oficial 2026
         </p>
      </div>

    </div>
  );
}
