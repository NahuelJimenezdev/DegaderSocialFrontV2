import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { 
  Heart, 
  ChevronLeft, 
  Save, 
  User, 
  Briefcase, 
  Shield, 
  Star, 
  Users, 
  Clock,
  CheckCircle2,
  FileText
} from 'lucide-react';
import userService from '../../../../api/userService';
import { useToast } from '../../../../shared/components/Toast/ToastProvider';

// Componente de sección extraído para evitar re-montajes innecesarios que causan pérdida de foco y reinicio de animaciones
const FormSection = ({ title, icon: Icon, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-50 dark:border-gray-700/50">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl">
        <Icon size={24} strokeWidth={2.5} />
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);

export default function FormularioEntrevista() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  
  // Función para obtener estado inicial con mezcla (merge)
  const getInitialState = () => {
    const defaultRespuestas = {
      nombre: user?.nombres ? `${user.nombres.primero} ${user.apellidos?.primero || ''}`.trim() : '',
      fechaNacimiento: (() => {
        if (!user?.personal?.fechaNacimiento) return '';
        const d = new Date(user.personal.fechaNacimiento);
        return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
      })(),
      upzLocalidad: user?.fundacion?.documentacionFHSYL?.upz || '',
      llamado: user?.fundacion?.documentacionFHSYL?.llamadoPastoral || '',
      loQueMasGusta: '',
      sacrificioPastoral: '',
      caracterAmigos: '',
      caracterCompañeros: '',
      situacionDificil: '',
      respuestaSituacion: '',
      cambioSituacion: '',
      autoridadEspiritual: '',
      personeriaJuridica: '',
      manejoDiferencias: '',
      dones: '',
      talentos: '',
      profesion: user?.fundacion?.documentacionFHSYL?.ocupacion || '',
      enfrentamientoConflictos: '',
      porqueCoordinador: '',
      manejaOffice: '',
      tiempoPastoreando: '',
      permanenciaMinisterio: '',
      vinculoFamiliar: '',
      familiaInvolucrada: '',
      formaEspiritual: '',
      disponibilidadTiempo: '',
      palabrasVoluntarias: ''
    };

    const savedRespuestas = user?.fundacion?.entrevista?.respuestas || {};
    return { ...defaultRespuestas, ...savedRespuestas };
  };

  const LOCALSTORAGE_KEY = `fundacion_entrevista_${user?._id || 'draft'}`;

  const [respuestas, setRespuestas] = useState(() => {
    const initial = getInitialState();
    try {
      const saved = localStorage.getItem(LOCALSTORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const serverData = user?.fundacion?.entrevista?.respuestas || {};
        const hasServerData = Object.keys(serverData).some(k => serverData[k] && String(serverData[k]).trim());
        if (!hasServerData) {
          return { ...initial, ...parsed };
        }
      }
    } catch (e) { /* noop */ }
    return initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(respuestas));
    } catch (e) { /* noop */ }
  }, [respuestas, LOCALSTORAGE_KEY]);

  useEffect(() => {
    // Solo scrollear al inicio si entramos por primera vez
    window.scrollTo(0, 0);
    const mainContent = document.querySelector('.main-content');
    if (mainContent) mainContent.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRespuestas(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Validación mínima: Al menos los campos básicos
    const required = [
      { key: 'fechaNacimiento', label: 'Fecha de Nacimiento' },
      { key: 'upzLocalidad', label: 'UPZ / Localidad' },
      { key: 'llamado', label: '¿Cuál es su llamado espiritual?' },
      { key: 'autoridadEspiritual', label: 'Autoridad Espiritual' },
      { key: 'profesion', label: 'Profesión u Oficio' },
      { key: 'vinculoFamiliar', label: 'Vínculo Familiar' },
      { key: 'porqueCoordinador', label: '¿Por qué desea ser Coordinador?' },
      { key: 'disponibilidadTiempo', label: 'Disponibilidad de Tiempo' }
    ];

    const missing = required.filter(f => !respuestas[f.key]?.trim());
    
    if (missing.length > 0) {
      toast.error(`Falta el campo obligatorio: ${missing[0].label}`);
      return;
    }

    setLoading(true);
    try {
      const response = await userService.saveInterview(respuestas);
      if (response.success) {
        if (response.data) updateUser(response.data);
        // 🔧 MANTENER BACKUP: No borramos localmente por seguridad
        toast.success('Entrevista guardada exitosamente');
        // navigate('/fundacion'); // No navegamos para que el usuario vea que sus datos siguen ahí
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar. Tus datos están respaldados localmente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-16 pb-24 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate('/fundacion')} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-all group">
          <div className="p-2 rounded-xl group-hover:bg-blue-50 transition-colors">
            <ChevronLeft size={20} />
          </div>
          Volver
        </button>
        
        <div className="text-right">
          <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Documento Oficial</span>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-none">Entrevista de Ingreso</h1>
        </div>
      </div>

      <div className="mb-10 p-6 bg-blue-600 rounded-[2.5rem] shadow-xl shadow-blue-500/20 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-6">
          <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl">
            <FileText size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold">¡Bienvenido al Proceso de Selección!</h3>
            <p className="text-blue-100 text-sm mt-1 max-w-md">
              Esta entrevista es fundamental para conocer tu corazón, tu llamado y cómo podemos servir juntos en la obra social.
            </p>
          </div>
        </div>
      </div>

      <FormSection title="Información General" icon={User}>
        <div className="md:col-span-2">
          <label className="label-premium">Nombre Completo</label>
          <input name="nombre" value={respuestas.nombre} onChange={handleChange} className="form-input-premium w-full bg-gray-50/50" readOnly />
          <p className="text-[10px] text-gray-400 mt-1 italic">Este campo se toma de tu perfil maestro.</p>
        </div>
        <div>
          <label className="label-premium">Fecha de Nacimiento</label>
          <input type="date" name="fechaNacimiento" value={respuestas.fechaNacimiento} onChange={handleChange} className="form-input-premium w-full" />
        </div>
        <div>
          <label className="label-premium">UPZ y Localidad / Sector (Solo Ubicación)</label>
          <input name="upzLocalidad" value={respuestas.upzLocalidad} onChange={handleChange} className="form-input-premium w-full" placeholder="Ej: UPZ 45 - Kennedy (Ubicación Urbana)" />
        </div>
      </FormSection>

      <FormSection title="Vida y Ministerio" icon={Star}>
        <div className="md:col-span-2">
          <label className="label-premium">¿Cuál es su llamado?</label>
          <textarea name="llamado" value={respuestas.llamado} onChange={handleChange} className="form-input-premium w-full h-24 pt-3" placeholder="Describe tu llamado ministerial..." />
        </div>
        <div className="md:col-span-2">
          <label className="label-premium">¿Qué es lo que más le gusta hacer y lo hace muy bien?</label>
          <textarea name="loQueMasGusta" value={respuestas.loQueMasGusta} onChange={handleChange} className="form-input-premium w-full h-24 pt-3" />
        </div>
        <div className="md:col-span-2">
          <label className="label-premium">¿En qué área ha estado más dispuesto a hacer un sacrificio por el ministerio?</label>
          <textarea name="sacrificioPastoral" value={respuestas.sacrificioPastoral} onChange={handleChange} className="form-input-premium w-full h-24 pt-3" />
        </div>
      </FormSection>

      <FormSection title="Carácter y Resiliencia" icon={Shield}>
        <div>
          <label className="label-premium">¿Qué dirían de usted sus amigos?</label>
          <input name="caracterAmigos" value={respuestas.caracterAmigos} onChange={handleChange} className="form-input-premium w-full" placeholder="Honestidad, lealtad..." />
        </div>
        <div>
          <label className="label-premium">¿Qué dirían sus compañeros de trabajo?</label>
          <input name="caracterCompañeros" value={respuestas.caracterCompañeros} onChange={handleChange} className="form-input-premium w-full" placeholder="Responsabilidad, equipo..." />
        </div>
        <div className="md:col-span-2">
          <label className="label-premium">Cuéntenos de un momento de dificultad o crisis que haya enfrentado.</label>
          <textarea name="situacionDificil" value={respuestas.situacionDificil} onChange={handleChange} className="form-input-premium w-full h-24 pt-3" placeholder="Describe la situación de forma breve..." />
        </div>
        <div>
          <label className="label-premium">¿Cómo respondió ante eso?</label>
          <textarea name="respuestaSituacion" value={respuestas.respuestaSituacion} onChange={handleChange} className="form-input-premium w-full h-24 pt-3" />
        </div>
        <div>
          <label className="label-premium">¿Qué cambiaría si pudiera volver atrás?</label>
          <textarea name="cambioSituacion" value={respuestas.cambioSituacion} onChange={handleChange} className="form-input-premium w-full h-24 pt-3" />
        </div>
      </FormSection>

      <FormSection title="Sujeción y Autoridad" icon={Users}>
        <div className="md:col-span-2">
          <label className="label-premium">¿Quién es su autoridad espiritual directa?</label>
          <input name="autoridadEspiritual" value={respuestas.autoridadEspiritual} onChange={handleChange} className="form-input-premium w-full" placeholder="Nombre de su pastor o cobertura" />
        </div>
        <div className="md:col-span-2">
          <label className="label-premium">¿Su denominación cuenta con personería jurídica o está bajo cobertura?</label>
          <input name="personeriaJuridica" value={respuestas.personeriaJuridica} onChange={handleChange} className="form-input-premium w-full" />
        </div>
        <div className="md:col-span-2">
          <label className="label-premium">¿Cómo maneja diferencias de criterio frente a sus autoridades?</label>
          <textarea name="manejoDiferencias" value={respuestas.manejoDiferencias} onChange={handleChange} className="form-input-premium w-full h-24 pt-3" />
        </div>
      </FormSection>

      <FormSection title="Dones, Talentos y Profesión" icon={Briefcase}>
        <div>
          <label className="label-premium">Dones Espirituales (Aporte al equipo)</label>
          <textarea name="dones" value={respuestas.dones} onChange={handleChange} className="form-input-premium w-full h-24 pt-3" />
        </div>
        <div>
          <label className="label-premium">Talentos Naturales / Habilidades</label>
          <textarea name="talentos" value={respuestas.talentos} onChange={handleChange} className="form-input-premium w-full h-24 pt-3" />
        </div>
        <div>
          <label className="label-premium">Profesión u Oficio</label>
          <input name="profesion" value={respuestas.profesion} onChange={handleChange} className="form-input-premium w-full" />
        </div>
        <div>
          <label className="label-premium">Manejo de Word/Excel (Herramientas)</label>
          <input name="manejaOffice" value={respuestas.manejaOffice} onChange={handleChange} className="form-input-premium w-full" placeholder="Básico, medio, avanzado..." />
        </div>
        <div className="md:col-span-2">
          <label className="label-premium">¿Cómo suele enfrentar los conflictos interpersonales?</label>
          <input name="enfrentamientoConflictos" value={respuestas.enfrentamientoConflictos} onChange={handleChange} className="form-input-premium w-full" />
        </div>
        <div className="md:col-span-2">
          <label className="label-premium">¿Qué experiencias previas cree que le califican para ser un Coordinador?</label>
          <textarea name="porqueCoordinador" value={respuestas.porqueCoordinador} onChange={handleChange} className="form-input-premium w-full h-24 pt-3" />
        </div>
      </FormSection>

      <FormSection title="Familia y Devoción" icon={Heart}>
        <div className="md:col-span-2">
          <label className="label-premium">¿Quiénes componen su vínculo familiar primario?</label>
          <textarea name="vinculoFamiliar" value={respuestas.vinculoFamiliar} onChange={handleChange} className="form-input-premium w-full h-20 pt-2" />
        </div>
        <div className="md:col-span-2">
          <label className="label-premium">¿Cómo está involucrada su familia en su labor ministerial?</label>
          <textarea name="familiaInvolucrada" value={respuestas.familiaInvolucrada} onChange={handleChange} className="form-input-premium w-full h-20 pt-2" />
        </div>
        <div className="md:col-span-2">
          <label className="label-premium">¿Qué disciplinas practica para mantenerse en buena forma espiritual?</label>
          <textarea name="formaEspiritual" value={respuestas.formaEspiritual} onChange={handleChange} className="form-input-premium w-full h-20 pt-2" placeholder="Oración, ayuno, lectura..." />
        </div>
      </FormSection>

      <FormSection title="Compromiso Institucional" icon={Clock}>
        <div>
          <label className="label-premium">Tiempo dedicado al pastorado (Años/Meses)</label>
          <input name="tiempoPastoreando" value={respuestas.tiempoPastoreando} onChange={handleChange} className="form-input-premium w-full" />
        </div>
        <div className="md:col-span-2">
          <label className="label-premium">A pesar de las pruebas, ¿qué le ha sostenido en el ministerio?</label>
          <textarea name="permanenciaMinisterio" value={respuestas.permanenciaMinisterio} onChange={handleChange} className="form-input-premium w-full h-24 pt-3" />
        </div>
        <div className="md:col-span-2">
          <label className="label-premium">¿Cuenta con la disponibilidad de tiempo que requiere la coordinación?</label>
          <input name="disponibilidadTiempo" value={respuestas.disponibilidadTiempo} onChange={handleChange} className="form-input-premium w-full" placeholder="Describe tu disposición horaria..." />
        </div>
        <div className="md:col-span-2">
          <label className="label-premium">Palabras adicionales que desee aportar:</label>
          <textarea name="palabrasVoluntarias" value={respuestas.palabrasVoluntarias} onChange={handleChange} className="form-input-premium w-full h-24 pt-3" />
        </div>
      </FormSection>

      <div className="sticky bottom-6 md:static mt-12 flex justify-center">
        <button
          onClick={handleSave}
          disabled={loading}
          className="group relative flex items-center justify-center gap-3 px-10 py-4 bg-green-600 hover:bg-green-700 text-white rounded-[2rem] font-black text-lg transition-all shadow-2xl shadow-green-600/30 hover:shadow-green-500/40 active:scale-95 disabled:opacity-50 overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Guardando...</span>
            </div>
          ) : (
            <>
              <Save size={24} className="group-hover:rotate-12 transition-transform" />
              <span>Finalizar y Enviar Entrevista</span>
              <CheckCircle2 size={24} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </>
          )}
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-400 text-xs font-medium uppercase tracking-tighter">
          Degader Social • Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}
