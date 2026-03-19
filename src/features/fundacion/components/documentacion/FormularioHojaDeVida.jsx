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
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import ImageModule from 'docxtemplater-image-module-free';
import { saveAs } from 'file-saver';

const SECTIONS = [
  { id: 'personal', title: 'Información Personal', icon: User },
  { id: 'profesional', title: 'Perfil y Estudios', icon: BookOpen },
  { id: 'laboral', title: 'Experiencia Laboral', icon: Briefcase },
  { id: 'ministerial', title: 'Experiencia Ministerial', icon: Users },
  { id: 'referencias', title: 'Referencias', icon: Users }
];

export default function FormularioHojaDeVida() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [photoPreview, setPhotoPreview] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    // Personal
    nombre_completo: '',
    nacionalidad: '',
    documento_tipo: 'DNI',
    documento_num: '',
    fecha_nacimiento: '',
    estado_civil: '',
    direccion: '',
    telefono: '',
    email: '',
    region: '',
    
    // Profesional
    perfil_profesional: '',
    estudios: '',
    
    // Laboral
    experiencia_laboral: '',
    
    // Ministerial
    experiencia_ministerial: '',
    iglesia: '',
    
    // Referencias
    referencia_1_nombre: '',
    referencia_1_contacto: '',
    referencia_2_nombre: '',
    referencia_2_contacto: ''
  });

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
        region: user.fundacion?.territorio?.region || '',
        iglesia: user.eclesiastico?.iglesia?.nombre || '',
        documento_num: user.fundacion?.documentacionFHSYL?.upz || ''
      }));
      
      if (user.social?.fotoPerfil) {
        setPhotoPreview(user.social.fotoPerfil);
      }
    }
  }, [user]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateWord = async () => {
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
        getImage: (tagValue) => {
          return new Promise((resolve, reject) => {
            const base64 = tagValue.split(',')[1] || tagValue;
            const binaryString = window.atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            resolve(bytes.buffer);
          });
        },
        getSize: () => [120, 150], // Tamaño en píxeles [ancho, alto] para el Word
      };
      
      const imageModule = new ImageModule(opts);
      
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        modules: [imageModule]
      });

      // 2. Mapear datos (asegurar que no haya nulos)
      const dataToRender = {
        ...formData,
        foto_perfil: photoPreview || '' // Etiqueta {%foto_perfil}
      };

      Object.keys(dataToRender).forEach(key => {
        if (!dataToRender[key] && key !== 'foto_perfil') {
          dataToRender[key] = '---';
        }
      });

      // 3. Renderizar asincrónicamente para procesar la imagen
      await doc.resolveData(dataToRender);
      doc.render();

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

    switch (activeSection) {
      case 'personal':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                  Sube una foto profesional. Se redimensionará automáticamente en el documento Word.
                </p>
                <div className="mt-3 flex gap-2 justify-center md:justify-start">
                  <button 
                    onClick={() => setPhotoPreview(user?.social?.fotoPerfil)}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Usar foto de perfil actual
                  </button>
                  {photoPreview && (
                    <button 
                      onClick={() => setPhotoPreview(null)}
                      className="text-xs font-bold text-red-500 hover:underline ml-3"
                    >
                      Quitar foto
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelClasses}>Nombre Completo</label>
              <input name="nombre_completo" value={formData.nombre_completo} onChange={handleChange} className={inputClasses} placeholder="Nombre completo..." />
            </div>
            <div>
              <label className={labelClasses}>Nacionalidad</label>
              <input name="nacionalidad" value={formData.nacionalidad} onChange={handleChange} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Región / Provincia / Estado</label>
              <input name="region" value={formData.region} onChange={handleChange} className={inputClasses} placeholder="Nombre de la región o provincia..." />
            </div>
            <div>
              <label className={labelClasses}>Estado Civil</label>
              <input name="estado_civil" value={formData.estado_civil} onChange={handleChange} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Tipo de Documento</label>
              <select name="documento_tipo" value={formData.documento_tipo} onChange={handleChange} className={inputClasses}>
                <option value="DNI">DNI</option>
                <option value="Cédula">Cédula</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Número de Documento</label>
              <input name="documento_num" value={formData.documento_num} onChange={handleChange} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Fecha de Nacimiento</label>
              <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Teléfono / Celular</label>
              <input name="telefono" value={formData.telefono} onChange={handleChange} className={inputClasses} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClasses}>Dirección de Residencia</label>
              <input name="direccion" value={formData.direccion} onChange={handleChange} className={inputClasses} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClasses}>Correo Electrónico</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClasses} />
            </div>
          </div>
        </div>
        );
      case 'profesional':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className={labelClasses}>Perfil Profesional (Breve resumen)</label>
              <textarea name="perfil_profesional" value={formData.perfil_profesional} onChange={handleChange} className={textareaClasses} placeholder="Escribe un breve resumen de tu perfil profesional..." />
            </div>
            <div>
              <label className={labelClasses}>Estudios Realizados</label>
              <textarea name="estudios" value={formData.estudios} onChange={handleChange} className={textareaClasses} placeholder="Lista tus títulos, cursos o certificaciones..." />
            </div>
          </div>
        );
      case 'laboral':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <label className={labelClasses}>Experiencia Laboral</label>
            <textarea name="experiencia_laboral" value={formData.experiencia_laboral} onChange={handleChange} className={textareaClasses} placeholder="Describe tus empleos anteriores y responsabilidades..." />
          </div>
        );
      case 'ministerial':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className={labelClasses}>Iglesia a la que pertenece</label>
              <input name="iglesia" value={formData.iglesia} onChange={handleChange} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Experiencia Ministerial / Llamado</label>
              <textarea name="experiencia_ministerial" value={formData.experiencia_ministerial} onChange={handleChange} className={textareaClasses} placeholder="Describe tu servicio en la obra de Dios..." />
            </div>
          </div>
        );
      case 'referencias':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                <Users size={18} /> Referencia 1
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Nombre</label>
                  <input name="referencia_1_nombre" value={formData.referencia_1_nombre} onChange={handleChange} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Contacto (Tel/Email)</label>
                  <input name="referencia_1_contacto" value={formData.referencia_1_contacto} onChange={handleChange} className={inputClasses} />
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
              <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                <Users size={18} /> Referencia 2
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>Nombre</label>
                  <input name="referencia_2_nombre" value={formData.referencia_2_nombre} onChange={handleChange} className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Contacto (Tel/Email)</label>
                  <input name="referencia_2_contacto" value={formData.referencia_2_contacto} onChange={handleChange} className={inputClasses} />
                </div>
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
            <button
              onClick={generateWord}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <>Generando...</>
              ) : (
                <>
                  <Download size={22} />
                  Descargar Hoja de Vida (.docx)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
