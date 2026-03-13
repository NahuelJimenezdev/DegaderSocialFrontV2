import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  User, 
  Briefcase, 
  Shield, 
  Star, 
  Users, 
  Clock 
} from 'lucide-react';
import userService from '../../../../api/userService';
import { useToast } from '../../../../shared/components/Toast/ToastProvider';

const SECTIONS = [
  { id: 'info', title: 'Información General', icon: User },
  { id: 'ministerio', title: 'Ministerio', icon: Star },
  { id: 'caracter', title: 'Carácter', icon: Shield },
  { id: 'sujecion', title: 'Sujeción y Legal', icon: Users },
  { id: 'dones', title: 'Dones y Talentos', icon: Briefcase },
  { id: 'familia', title: 'Familia y Devoción', icon: Heart },
  { id: 'otros', title: 'Compromiso y Tiempo', icon: Clock }
];

export default function FormularioEntrevista() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [respuestas, setRespuestas] = useState(user?.fundacion?.entrevista?.respuestas || {
    nombre: `${user?.nombres?.primero} ${user?.apellidos?.primero}`,
    fechaNacimiento: user?.personal?.fechaNacimiento ? new Date(user.personal.fechaNacimiento).toISOString().split('T')[0] : '',
    upzLocalidad: '',
    llamado: '',
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
    profesion: '',
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRespuestas(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await userService.saveInterview(respuestas);
      if (response.success) {
        toast.success('Entrevista guardada exitosamente');
        // Actualizar contexto local si el backend devolvió el usuario actualizado
        // Si no, podemos hacer un getMe o actualizar manualmente
        navigate('/fundacion');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar la entrevista');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, SECTIONS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Información General</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nombre Completo</label>
                <input name="nombre" value={respuestas.nombre} onChange={handleChange} className="form-input-premium w-full" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Fecha de Nacimiento</label>
                <input type="date" name="fechaNacimiento" value={respuestas.fechaNacimiento} onChange={handleChange} className="form-input-premium w-full" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">UPZ y Localidad</label>
                <input name="upzLocalidad" value={respuestas.upzLocalidad} onChange={handleChange} className="form-input-premium w-full" placeholder="Ej: UPZ 45 - Kennedy" />
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Ministerio</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">¿Cuál es su llamado?</label>
                <textarea name="llamado" value={respuestas.llamado} onChange={handleChange} className="form-input-premium w-full h-24" placeholder="Describe tu llamado ministerial..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">¿Qué es lo que más le gusta hacer y lo hace muy bien?</label>
                <textarea name="loQueMasGusta" value={respuestas.loQueMasGusta} onChange={handleChange} className="form-input-premium w-full h-24" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">En el ministerio pastoral, ¿en qué área ha estado más dispuesto a hacer un sacrificio?</label>
                <textarea name="sacrificioPastoral" value={respuestas.sacrificioPastoral} onChange={handleChange} className="form-input-premium w-full h-24" />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Carácter</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">¿Qué dirían de usted sus Amigos?</label>
                  <input name="caracterAmigos" value={respuestas.caracterAmigos} onChange={handleChange} className="form-input-premium w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">¿Qué dirían sus Compañeros de trabajo?</label>
                  <input name="caracterCompañeros" value={respuestas.caracterCompañeros} onChange={handleChange} className="form-input-premium w-full" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Cuénteme de un momento en que se encontró en una situación difícil. ¿Cómo respondió? ¿Qué cambiaría?</label>
                <textarea name="situacionDificil" value={respuestas.situacionDificil} onChange={handleChange} className="form-input-premium w-full h-32" />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Sujeción y Situación Legal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">¿Quién es su autoridad espiritual directa?</label>
                <input name="autoridadEspiritual" value={respuestas.autoridadEspiritual} onChange={handleChange} className="form-input-premium w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">¿La denominación que usted pastorea cuenta con Personería jurídica especial? ¿O está bajo cobertura de otra?</label>
                <input name="personeriaJuridica" value={respuestas.personeriaJuridica} onChange={handleChange} className="form-input-premium w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">¿Cómo maneja sus situaciones difíciles o diferencias frente a sus autoridades espirituales?</label>
                <textarea name="manejoDiferencias" value={respuestas.manejoDiferencias} onChange={handleChange} className="form-input-premium w-full h-24" />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Dones y Talentos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">¿Con cuáles dones y talentos aportaría usted al equipo?</label>
                <textarea name="dones" value={respuestas.dones} onChange={handleChange} className="form-input-premium w-full h-24" placeholder="Dones, talentos..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Profesión</label>
                <input name="profesion" value={respuestas.profesion} onChange={handleChange} className="form-input-premium w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">¿Cómo enfrenta usted los conflictos?</label>
                <input name="enfrentamientoConflictos" value={respuestas.enfrentamientoConflictos} onChange={handleChange} className="form-input-premium w-full" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">¿Qué experiencias ha tenido que le hace creer que sería bueno para Coordinador?</label>
                <textarea name="porqueCoordinador" value={respuestas.porqueCoordinador} onChange={handleChange} className="form-input-premium w-full h-24" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">¿Sabe manejar Excel y Word para llenar formatos de seguimiento?</label>
                <input name="manejaOffice" value={respuestas.manejaOffice} onChange={handleChange} className="form-input-premium w-full" placeholder="Sí / No / Nivel" />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Familia y Devoción</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">¿Quiénes componen su vínculo familiar?</label>
                <textarea name="vinculoFamiliar" value={respuestas.vinculoFamiliar} onChange={handleChange} className="form-input-premium w-full h-20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">¿Cómo está involucrada su familia en el ministerio?</label>
                <textarea name="familiaInvolucrada" value={respuestas.familiaInvolucrada} onChange={handleChange} className="form-input-premium w-full h-20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">¿Qué hace usted para mantenerse en buena forma espiritual?</label>
                <textarea name="formaEspiritual" value={respuestas.formaEspiritual} onChange={handleChange} className="form-input-premium w-full h-20" />
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Compromiso y Tiempo</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">¿Por cuánto tiempo ha pastoreado la iglesia?</label>
                  <input name="tiempoPastoreando" value={respuestas.tiempoPastoreando} onChange={handleChange} className="form-input-premium w-full" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">A pesar de las adversidades, ¿qué le ha hecho permanecer en el ministerio?</label>
                  <textarea name="permanenciaMinisterio" value={respuestas.permanenciaMinisterio} onChange={handleChange} className="form-input-premium w-full h-24" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">La coordinación va a requerir tiempo para socializar la visión. ¿Tiene usted el tiempo necesario?</label>
                <input name="disponibilidadTiempo" value={respuestas.disponibilidadTiempo} onChange={handleChange} className="form-input-premium w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Palabras Voluntarias que quiera aportar:</label>
                <textarea name="palabrasVoluntarias" value={respuestas.palabrasVoluntarias} onChange={handleChange} className="form-input-premium w-full h-24" />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/fundacion')} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 font-medium transition-colors">
        <ChevronLeft size={20} />
        Volver a Fundación
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-8 border-b border-gray-100 dark:border-gray-700">
          <div className="section-header">
              <div className="section-header__icon-box">
                  <Heart className="section-header__icon" strokeWidth={2.5} size={32} />
              </div>
              <div className="section-header__content">
                  <h1 className="section-header__title section-header__title--heavy">
                      Entrevista Fundación
                  </h1>
                  <p className="section-header__subtitle">
                      Complementa tu perfil para la Fundación Humanitaria Internacional Sol y Luna.
                  </p>
              </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <span>Sección {currentStep + 1} de {SECTIONS.length}</span>
              <span>{Math.round(((currentStep + 1) / SECTIONS.length) * 100)}% Completado</span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(37,99,235,0.3)]" 
                style={{ width: `${((currentStep + 1) / SECTIONS.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row min-h-[500px]">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-72 bg-gray-50 dark:bg-gray-900/50 p-6 border-r border-gray-100 dark:border-gray-700 hidden md:block">
            <div className="space-y-2">
              {SECTIONS.map((section, idx) => {
                const Icon = section.icon;
                const isActive = currentStep === idx;
                const isPast = currentStep > idx;

                return (
                  <button
                    key={section.id}
                    onClick={() => setCurrentStep(idx)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold transition-all ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : isPast 
                          ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20' 
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20' : isPast ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-200 dark:bg-gray-700'}`}>
                      <Icon size={16} />
                    </div>
                    {section.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 p-8">
            {renderStepContent()}

            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-6 py-2.5 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-2"
              >
                <ChevronLeft size={20} />
                Anterior
              </button>

              {currentStep === SECTIONS.length - 1 ? (
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-8 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
                >
                  {loading ? 'Guardando...' : 'Finalizar y Guardar'}
                  <Save size={20} />
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
                >
                  Siguiente
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
