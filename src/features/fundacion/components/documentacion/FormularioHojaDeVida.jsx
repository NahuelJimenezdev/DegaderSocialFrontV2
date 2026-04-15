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
import { toast } from 'react-hot-toast';
import userService from '../../../../api/userService';
import { downloadCV } from '../../utils/docUtils';

export default function FormularioHojaDeVida() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [firmaPreview, setFirmaPreview] = useState(null);

  // Estado del formulario (Mantenido exactamente igual para no perder datos)
  const [formData, setFormData] = useState({
    // DATOS GENERALES
    nombre_completo: '',
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
    descripcion_breve_ministerio_profesion: '',

    // NIVEL EDUCATIVO - EDUCACIÓN BÁSICA
    'completa/incompleta': 'completa',
    grado1: '', grado2: '', grado3: '', grado4: '', grado5: '', // Primaria
    grado6: '', grado7: '', grado8: '', grado9: '', // Secundaria
    grado10: '', grado11: '', // Media
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
    sector_empresa: 'privada', 

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
        lugar_expedicion: user.personal?.lugarExpedicion || user.personal?.expedicion || '',
        estado_civil: user.fundacion?.documentacionFHSYL?.estadoCivil || user.personal?.estadoCivil || '',
        nombre_personales_1: user.fundacion?.documentacionFHSYL?.referencias?.[0]?.nombre || '',
        profesion_personal_1: user.fundacion?.documentacionFHSYL?.referencias?.[0]?.relacion || '',
        telefonopers_1: user.fundacion?.documentacionFHSYL?.referencias?.[0]?.contacto || '',
        nombre_personales_2: user.fundacion?.documentacionFHSYL?.referencias?.[1]?.nombre || '',
        profesion_personal_2: user.fundacion?.documentacionFHSYL?.referencias?.[1]?.relacion || '',
        telefonopers_2: user.fundacion?.documentacionFHSYL?.referencias?.[1]?.contacto || '',
        nombre_iglesia: user.eclesiastico?.iglesia?.nombre || ''
      };

      const hojaDeVidaDatos = user.fundacion?.hojaDeVida?.datos || {};
      const savedData = {};
      Object.entries(hojaDeVidaDatos).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          savedData[key] = value;
          // Corregir typos históricos
          if (key === 'profesion_personal2') savedData['profesion_personal_2'] = value;
          if (key === 'profesion_personal3') savedData['profesion_personal_3'] = value;
          if (key === 'profesion2_personal') savedData['profesion_personal_2'] = value;
          if (key === 'profesion3_personal') savedData['profesion_personal_3'] = value;
          if (key === 'doc_num' || key === 'documento') savedData['documento_num'] = value;
          if (key === 'lugar_exp' || key === 'expedicion') savedData['lugar_expedicion'] = value;
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
    if (!silent) setLoading(true);
    try {
      const response = await userService.saveHojaDeVida(formData);
      if (response?.success && response?.data) updateUser(response.data);
      try { localStorage.removeItem(LOCALSTORAGE_KEY); } catch (e) { /* noop */ }
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

  const FormSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm mb-8">
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-50 dark:border-gray-700/50">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl">
          <Icon size={24} strokeWidth={2.5} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 pt-16 pb-32 md:py-12">
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
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-11 gap-2 mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(num => (
                <button
                  key={num}
                  onClick={() => setFormData(prev => ({ ...prev, [`grado${num}`]: prev[`grado${num}`] === 'X' ? '' : 'X' }))}
                  className={`py-3 rounded-xl text-xs font-black border-2 transition-all ${formData[`grado${num}`] === 'X' ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400'}`}
                >
                  {num}°
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div> <label className="label-premium text-[10px]">Mes de Grado</label> <input name="fecha_mes_grado" value={formData.fecha_mes_grado} onChange={handleChange} className="form-input-premium w-full" placeholder="Ej: Diciembre" /> </div>
              <div> <label className="label-premium text-[10px]">Año de Grado</label> <input name="fecha_año_grado" value={formData.fecha_año_grado} onChange={handleChange} className="form-input-premium w-full" placeholder="AAAA" /> </div>
            </div>
        </div>

        <div className="md:col-span-2 lg:col-span-3 mt-4">
          <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">Educación Superior</h4>
          <div className="flex flex-wrap gap-6 mb-6 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-50 dark:border-gray-700">
              {[
                { id: 'seleccionar_tecnica', label: 'Técnica' },
                { id: 'seleccionar_tecnologica', label: 'Tecnológica' },
                { id: 'seleccionar_universitario', label: 'Pregrado' },
                { id: 'seleccionar_posgrado', label: 'Posgrado' }
              ].map(item => (
                <label key={item.id} className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" name={item.id} checked={formData[item.id]} onChange={handleChange} className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-xs font-black text-gray-600 dark:text-gray-300 group-hover:text-blue-600 transition tracking-tight">{item.label}</span>
                </label>
              ))}
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-6 bg-gray-50 dark:bg-gray-900/40 rounded-3xl border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-2">
                  <label className="label-premium text-[10px]">Título u Obra Realizada {i}</label>
                  <input name={`nombreTitulo_${i}`} value={formData[`nombreTitulo_${i}`]} onChange={handleChange} className="form-input-premium w-full bg-white dark:bg-gray-800" />
                </div>
                <div>
                  <label className="label-premium text-[10px]">Semestres / Años</label>
                  <input name={`numero_aprobado_${i}`} value={formData[`numero_aprobado_${i}`]} onChange={handleChange} className="form-input-premium w-full bg-white dark:bg-gray-800" />
                </div>
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
            ))}
          </div>
        </div>
      </FormSection>

      {/* --- SECCIÓN 3: EXPERIENCIA --- */}
      <FormSection title="Experiencia Laboral" icon={Briefcase}>
        <div className="md:col-span-2 lg:col-span-3">
          <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">Prácticas Formativas (Solo Estudiantes)</h4>
          <div className="space-y-3">
             {[1, 2, 3].map(i => (
                <div key={i} className="flex flex-col md:flex-row gap-3 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <div className="flex-1">
                    <label className="label-premium text-[9px]">Corporación / Empresa {i}</label>
                    <input name={`aplica/noAplica${i}`} value={formData[`aplica/noAplica${i}`]} onChange={handleChange} className="form-input-premium w-full text-sm bg-white dark:bg-gray-800" />
                  </div>
                  <div className="w-full md:w-32">
                    <label className="label-premium text-[9px]">Horas Totales</label>
                    <input name={`numero_horas${i}`} value={formData[`numero_horas${i}`]} onChange={handleChange} className="form-input-premium w-full text-sm bg-white dark:bg-gray-800" />
                  </div>
                  <div className="flex items-center gap-4 px-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
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
             ))}
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-3 mt-8">
            <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-6">Trayectoria Profesional / Ministerial</h4>
            <div className="space-y-12">
              {[
                { prefix: '', label: 'Actual o Último Cargo' },
                { prefix: '2', label: 'Cargo Anterior' },
                { prefix: '3', label: 'Cargo Anterior' }
              ].map((exp, idx) => (
                <div key={idx} className="relative p-6 md:p-8 bg-gray-50 dark:bg-gray-900/40 rounded-[2.5rem] border border-gray-100 dark:border-gray-700">
                  <span className="absolute -top-3 left-8 px-4 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase shadow-lg">{exp.label}</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <div> <label className="label-premium text-[9px]">Teléfono Empresa</label> <input name={`teléfono_emrpesa${exp.prefix}`} value={formData[`teléfono_emrpesa${exp.prefix}`]} onChange={handleChange} className="form-input-premium w-full text-sm bg-white dark:bg-gray-800" /> </div>
                    <div className="lg:col-span-2">
                       <label className="label-premium text-[9px]">Fecha de Ingreso (DD/MM/AAAA)</label>
                       <div className="grid grid-cols-3 gap-2">
                          <input name={`dia_inicio${exp.prefix}`} value={formData[`dia_inicio${exp.prefix}`]} onChange={handleChange} className="form-input-premium w-full text-center bg-white dark:bg-gray-800" placeholder="DD" />
                          <input name={`mes_inicio${exp.prefix}`} value={formData[`mes_inicio${exp.prefix}`]} onChange={handleChange} className="form-input-premium w-full text-center bg-white dark:bg-gray-800" placeholder="MM" />
                          <input name={`año_inicio${exp.prefix}`} value={formData[`año_inicio${exp.prefix}`]} onChange={handleChange} className="form-input-premium w-full text-center bg-white dark:bg-gray-800" placeholder="AAAA" />
                       </div>
                    </div>
                    <div className="lg:col-span-2">
                       <label className="label-premium text-[9px]">Fecha de Retiro (DD/MM/AAAA)</label>
                       <div className="grid grid-cols-3 gap-2">
                          <input name={`dia_fin${exp.prefix}`} value={formData[`dia_fin${exp.prefix}`]} onChange={handleChange} className="form-input-premium w-full text-center bg-white dark:bg-gray-800" placeholder="DD" />
                          <input name={`mes_fin${exp.prefix}`} value={formData[`mes_fin${exp.prefix}`]} onChange={handleChange} className="form-input-premium w-full text-center bg-white dark:bg-gray-800" placeholder="MM" />
                          <input name={`año_fin${exp.prefix}`} value={formData[`año_fin${exp.prefix}`]} onChange={handleChange} className="form-input-premium w-full text-center bg-white dark:bg-gray-800" placeholder="AAAA" />
                       </div>
                    </div>
                    <div className="lg:col-span-4"> <label className="label-premium text-[9px]">Dirección Completa de la Empresa</label> <input name={`dirección_empresa${exp.prefix}`} value={formData[`dirección_empresa${exp.prefix}`]} onChange={handleChange} className="form-input-premium w-full text-sm bg-white dark:bg-gray-800" /> </div>
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
            <div className="space-y-3">
               {[1, 2, 3, 4].map(i => (
                  <div key={i} className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-4"> <label className="label-premium text-[8px]">Academia / Entidad</label> <input name={`academia_${i}`} value={formData[`academia_${i}`]} onChange={handleChange} className="form-input-premium w-full text-xs bg-white dark:bg-gray-800" /> </div>
                    <div className="md:col-span-4"> <label className="label-premium text-[8px]">Título Obtenido</label> <input name={`titulo_obtenido${i}`} value={formData[`titulo_obtenido${i}`]} onChange={handleChange} className="form-input-premium w-full text-xs bg-white dark:bg-gray-800" /> </div>
                    <div className="md:col-span-2"> <label className="label-premium text-[8px]">H. Inten.</label> <input name={`intensidad_horaria${i}`} value={formData[`intensidad_horaria${i}`]} onChange={handleChange} className="form-input-premium w-full text-xs text-center bg-white dark:bg-gray-800" /> </div>
                    <div className="md:col-span-2"> <label className="label-premium text-[8px]">Año</label> <input name={`añoTaller${i}`} value={formData[`añoTaller${i}`]} onChange={handleChange} className="form-input-premium w-full text-xs text-center bg-white dark:bg-gray-800" /> </div>
                  </div>
               ))}
            </div>
         </div>
      </FormSection>

      {/* --- SECCIÓN 5: IDIOMAS Y CARGO --- */}
      <FormSection title="Habilidades y Aspiración" icon={FileText}>
          <div className="md:col-span-2 lg:col-span-3">
            <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">Talleres y Congresos Profesionales</h4>
            <div className="space-y-3">
               {[5, 6, 7, 8].map(i => (
                  <div key={i} className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-4"> <label className="label-premium text-[8px]">Entidad</label> <input name={`academia_${i}`} value={formData[`academia_${i}`]} onChange={handleChange} className="form-input-premium w-full text-xs bg-white dark:bg-gray-800" /> </div>
                    <div className="md:col-span-4"> <label className="label-premium text-[8px]">Título Obtenido</label> <input name={`titulo_obtenido${i}`} value={formData[`titulo_obtenido${i}`]} onChange={handleChange} className="form-input-premium w-full text-xs bg-white dark:bg-gray-800" /> </div>
                    <div className="md:col-span-2"> <label className="label-premium text-[8px]">Horas</label> <input name={`intensidad_horaria${i}`} value={formData[`intensidad_horaria${i}`]} onChange={handleChange} className="form-input-premium w-full text-xs text-center bg-white dark:bg-gray-800" /> </div>
                    <div className="md:col-span-2"> <label className="label-premium text-[8px]">Año</label> <input name={`añoTaller${i}`} value={formData[`añoTaller${i}`]} onChange={handleChange} className="form-input-premium w-full text-xs text-center bg-white dark:bg-gray-800" /> </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="md:col-span-2 lg:col-span-3 mt-8">
            <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">Idiomas</h4>
            <div className="grid grid-cols-1 gap-4">
               {[1, 2, 3].map(i => (
                  <div key={i} className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div> <label className="label-premium">Idioma {i}</label> <input name={`idioma_${i}`} value={formData[`idioma_${i}`]} onChange={handleChange} className="form-input-premium w-full bg-white dark:bg-gray-800" /> </div>
                    <div> <label className="label-premium text-[10px]">Habla (%)</label> <input name={`habla_${i}`} value={formData[`habla_${i}`]} onChange={handleChange} className="form-input-premium w-full bg-white dark:bg-gray-800" placeholder="Ej: 80%" /> </div>
                    <div> <label className="label-premium text-[10px]">Lee (%)</label> <input name={`lee_${i}`} value={formData[`lee_${i}`]} onChange={handleChange} className="form-input-premium w-full bg-white dark:bg-gray-800" placeholder="Ej: 90%" /> </div>
                    <div> <label className="label-premium text-[10px]">Escribe (%)</label> <input name={`escribe_${i}`} value={formData[`escribe_${i}`]} onChange={handleChange} className="form-input-premium w-full bg-white dark:bg-gray-800" placeholder="Ej: 70%" /> </div>
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

      {/* --- PANEL DE ACCIONES FLOTANTE --- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-50">
         <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl p-4 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl flex items-center justify-between">
            <div className="hidden md:block pl-4">
               <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase leading-none">Guardado Inteligente</p>
               <p className="text-[8px] text-gray-400 font-medium tracking-tight">Datos sincronizados con la nube</p>
            </div>
            
            <div className="flex w-full sm:w-auto gap-4">
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
      </div>

    </div>
  );
}
