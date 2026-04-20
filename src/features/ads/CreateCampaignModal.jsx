import React, { useState } from 'react';
import { logger } from '../../shared/utils/logger';
import { X, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, AlertCircle, Coins, Loader2, Eye, ImageIcon } from 'lucide-react';
import * as adService from '../../api/adService';

import StepBasicInfo from './components/CreateCampaignSteps/StepBasicInfo';
import StepCreative from './components/CreateCampaignSteps/StepCreative';
import StepTargeting from './components/CreateCampaignSteps/StepTargeting';
import StepBudget from './components/CreateCampaignSteps/StepBudget';
import StepPreview from './components/CreateCampaignSteps/StepPreview';
import ProgressiveImage from '../../shared/components/ProgressiveImage';

/**
 * Modal Premium Inteligente de Creación de Campaña Publicitaria (Meta Ads Style)
 */
const CreateCampaignModal = ({ isOpen, onClose, onSuccess, currentBalance, isFounderView }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    nombreCliente: '',
    callToAction: '¡Probar Ahora!',
    linkDestino: '',
    textoAlternativo: 'Anuncio Promocionado',
    imagenUrl: '',
    overrideClienteEmail: '',
    esGratuito: !!isFounderView,
    segmentacion: {
      edadMin: 18,
      edadMax: 65,
      genero: 'todos',
      intereses: [],
      ubicacion: {
        paises: [],
        ciudades: [],
        esGlobal: true
      }
    },
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    presupuesto: 100, // En DegaCoins
    costoPorImpresion: 1,
    maxImpresionesUsuario: 3,
    prioridad: 'basica',
    estado: 'pendiente_aprobacion'
  });

  const steps = [
    { number: 1, title: 'Identidad', icon: '📝' },
    { number: 2, title: 'Creativo', icon: '🖼️' },
    { number: 3, title: 'Audiencia', icon: '🎯' },
    { number: 4, title: 'Inversión', icon: '💎' },
    { number: 5, title: 'Lanzar', icon: '🚀' }
  ];

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const updateSegmentation = (field, value) => {
    setFormData(prev => ({
      ...prev,
      segmentacion: { ...prev.segmentacion, [field]: value }
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    switch (step) {
      case 1:
        if (!formData.nombreCliente.trim()) newErrors.nombreCliente = 'Requerido';
        if (!formData.linkDestino.trim()) newErrors.linkDestino = 'Requerido';
        break;
      case 2:
        if (!formData.imagenUrl.trim()) newErrors.imagenUrl = 'Debes subir o vincular una imagen';
        break;
      case 4:
        if (formData.presupuesto <= 0) newErrors.presupuesto = 'Presupuesto inválido';
        else if (formData.presupuesto > currentBalance && !(isFounderView && formData.esGratuito)) newErrors.presupuesto = `Saldo insuficiente (${currentBalance} DC)`;
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if (validateStep(currentStep)) setCurrentStep(p => Math.min(p + 1, 5)); };
  const handleBack = () => setCurrentStep(p => Math.max(p - 1, 1));

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await adService.createCampaign(formData);
      onSuccess();
      onClose();
    } catch (error) {
      logger.error('Error creando campaña:', error);
      setErrors({ submit: error.response?.data?.msg || 'Error al lanzar campaña' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Calculadora de Estimación
  const renderExpectedReach = () => {
    if (isFounderView && formData.esGratuito) {
      return (
        <div className="mt-4 p-5 rounded-xl border-2 border-emerald-500/30 bg-[#0f172a] shadow-[0_0_20px_rgba(16,185,129,0.15)] relative overflow-hidden group">
           <div className="absolute -right-4 -top-4 opacity-5 blur-sm pointer-events-none transition-transform duration-700 group-hover:scale-110">
              <ShieldCheck size={120} />
           </div>
           <p className="text-emerald-400 font-bold flex items-center gap-2 mb-2">
             <span className="bg-emerald-500/20 p-1.5 rounded-lg"><ShieldCheck size={16}/></span> Modo Dios Activado
           </p>
           <p className="text-2xl text-white font-extrabold tracking-tight">Inversión Ilimitada</p>
           <p className="text-xs text-emerald-300/70 mt-1.5 leading-relaxed max-w-[80%]">Esta campaña institucional omitirá la validación de DegaCoins y se servirá gratuitamente hasta que la pauses.</p>
        </div>
      );
    }

    const impresionesEstimadas = Math.floor(formData.presupuesto / formData.costoPorImpresion);
    const hasInsufficientFunds = formData.presupuesto > currentBalance;

    return (
      <div className={`mt-4 p-4 rounded-xl border ${hasInsufficientFunds ? 'bg-red-500/10 border-red-500/30' : 'bg-indigo-500/10 border-indigo-500/30'}`}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300 text-sm font-semibold flex items-center gap-2">
            <Coins size={16} className={hasInsufficientFunds ? 'text-red-400' : 'text-indigo-400'}/> 
            Tu Balance Disp: {currentBalance} DC
          </span>
          {hasInsufficientFunds && <span className="text-red-400 text-xs font-bold bg-red-500/20 px-2 py-1 rounded-md">¡Ups! Faltan Fondos</span>}
        </div>
        <p className="text-sm text-gray-400">Alcance Proyectado:</p>
        <p className={`text-2xl font-black ${hasInsufficientFunds ? 'text-red-400' : 'text-white'}`}>
          ~ {impresionesEstimadas.toLocaleString()} <span className="text-sm font-normal text-gray-400">Impresiones</span>
        </p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4 font-sans transition-all">
      {/* Contenedor Principal Split-View Glassmorphism */}
      <div className="bg-[#0f111a]/95 border border-[#1f2937] shadow-[0_0_50px_-12px_rgba(99,102,241,0.4)] rounded-2xl max-w-6xl w-full h-[85vh] overflow-hidden flex flex-col md:flex-row">
        
        {/* COLUMNA IZQUIERDA: Flujo del Creador */}
        <div className="flex-1 flex flex-col h-full border-r border-[#1f2937]">
          
          {/* Header Izquierdo */}
          <div className="p-6 border-b border-[#1f2937] flex items-center justify-between bg-[#131623]/80">
            <h2 className="text-xl font-extrabold text-white m-0 tracking-tight flex items-center gap-2">
              Lanzamiento de Campaña <span className="p-1 px-2 text-xs bg-indigo-500/20 text-indigo-400 rounded-md">Pro</span>
            </h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Stepper Animado y Brillante */}
          <div className="px-8 py-5 bg-[#0f111a] border-b border-[#1f2937]">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-[#1f2937]" />
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-indigo-500 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / 4) * 100}%`, boxShadow: '0 0 10px rgba(99,102,241,0.5)' }} 
              />
              {steps.map((step) => {
                const isCompleted = step.number < currentStep;
                const isCurrent = step.number === currentStep;
                return (
                  <div key={step.number} className="relative z-10 flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                      ${isCompleted ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.6)]' : 
                        isCurrent ? 'bg-white text-indigo-900 border-2 border-indigo-500 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 
                        'bg-[#1f2937] text-gray-400 border border-[#374151]'}`}>
                      {isCompleted ? <CheckCircle2 size={20} /> : step.number}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Área Dinámica de Contenido (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              {steps[currentStep -1].icon} {steps[currentStep -1].title}
            </h3>
            
            <div className="opacity-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {currentStep === 1 && <StepBasicInfo formData={formData} updateField={updateField} errors={errors} isFounderView={isFounderView} />}
              {currentStep === 2 && <StepCreative formData={formData} updateField={updateField} errors={errors} />}
              {currentStep === 3 && <StepTargeting formData={formData} updateSegmentation={updateSegmentation} errors={errors} />}
              {currentStep === 4 && (
                <div>
                  <StepBudget formData={formData} updateField={updateField} errors={errors} currentBalance={currentBalance} />
                  {renderExpectedReach()}
                </div>
              )}
              {currentStep === 5 && (
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 rounded-full text-indigo-400 mb-4 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-xl font-bold text-white">¡Todo Listo para el Algoritmo!</h3>
                  <p className="text-gray-400 mt-2 max-w-sm mx-auto">Tu campaña entrará a revisión manual. Una vez aprobada, se servirá automáticamente al Target seleccionado.</p>
                  {errors.submit && <p className="text-red-400 mt-4 bg-red-500/10 p-3 rounded-lg"><AlertCircle className="inline mr-2" size={16}/>{errors.submit}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Footer de Navegación */}
          <div className="p-6 border-t border-[#1f2937] bg-[#131623]/80 flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors ${currentStep === 1
                  ? 'text-gray-600 cursor-not-allowed opacity-50'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <ChevronLeft size={18} /> Atrás
            </button>
            
            {currentStep < 5 ? (
               <button
                 onClick={handleNext}
                 className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] text-white rounded-xl text-sm font-bold transition-all"
               >
                 Avanzar <ChevronRight size={18} />
               </button>
            ) : (
               <button
                 onClick={handleSubmit}
                 disabled={loading || (formData.presupuesto > currentBalance && !(isFounderView && formData.esGratuito))}
                 className="flex items-center gap-2 px-8 py-2.5 bg-green-500 hover:bg-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-all relative overflow-hidden"
               >
                 {loading ? <><span className="animate-spin"><Loader2 size={18}/></span> Subiendo a la Arena...</> : '🔥 Iniciar Campaña'}
               </button>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Vista Previa en Tiempo Real Viva */}
        <div className="w-[420px] bg-[#090b10] border-l border-[#1f2937] hidden md:flex flex-col relative overflow-hidden p-8 justify-center">
          
          <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
          
          <div className="text-center mb-8 relative z-10">
            <h3 className="text-gray-300 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <Eye size={16} className="text-indigo-400"/> Live Ad Preview
            </h3>
            <p className="text-gray-500 text-xs mt-1">Cómo lo verán los usuarios en DegaderSocial</p>
          </div>

          {/* El Simposio del Anuncio Falso (AdCard Mirror) */}
          <div className="bg-[#1a1d2d] rounded-2xl border border-[#2d334a] shadow-2xl overflow-hidden relative z-10 translate-y-[-10px] hover:translate-y-[-15px] transition-transform duration-500">
            
            <div className="p-4 flex items-center gap-3 border-b border-[#2d334a]/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-[#1a1d2d] flex items-center justify-center font-bold text-xs text-white">
                 AD
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white leading-tight">{formData.nombreCliente || 'Nombre Patrocinador'}</p>
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  Patrocinado • {(isFounderView && formData.esGratuito) ? <span className="text-emerald-400 flex items-center gap-1"><ShieldCheck size={10} /> Oficial (Costo Cero)</span> : 'Meta Ads Virtual'}
                </p>
              </div>
            </div>

            <div className="w-full h-[220px] bg-black relative flex justify-center items-center overflow-hidden">
              {formData.imagenUrl ? (
                <ProgressiveImage src={formData.imagenUrl} alt="Ad Visual" className="w-[110%] h-[110%] blur-sm opacity-30 absolute object-cover" />
              ) : null}
              {formData.imagenUrl ? (
                <ProgressiveImage src={formData.imagenUrl} alt="Ad Visual" className="w-full h-full object-contain relative z-10" />
              ) : (
                <div className="text-gray-600 flex flex-col items-center gap-2">
                   <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center"><ImageIcon size={24}/></div>
                   <span className="text-xs font-semibold">Tú Gráfico irá aquí</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-gradient-to-b from-[#1a1d2d] to-[#131521]">
               <div className="flex justify-between items-center">
                  <div className="flex-1 truncate pr-4">
                     <p className="text-xs text-gray-400 uppercase font-semibold">
                       {(() => {
                         try {
                           return formData.linkDestino ? new URL(formData.linkDestino).hostname.replace('www.','') : 'website.com';
                         } catch(e) {
                           return 'website.com';
                         }
                       })()}
                     </p>
                     <p className="text-sm text-gray-200 mt-0.5 line-clamp-1">{formData.textoAlternativo || 'Añade un texto atractivo'}</p>
                  </div>
                  <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border border-white/5 shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
                    {formData.callToAction}
                  </button>
               </div>
            </div>
          </div>

          {/* Panel De Confirmación Privacidad */}
          <div className="mt-8 bg-green-500/5 border border-green-500/20 rounded-xl p-4 flex gap-3 relative z-10">
            <ShieldCheck size={20} className="text-green-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-green-400 font-bold mb-1">Algoritmo GDPR Seguro</p>
              <p className="text-[10px] text-gray-400 leading-tight">La entrega se realizará bajo parámetros algorítmicos éticos ({formData.segmentacion.edadMin}-{formData.segmentacion.edadMax} años, {formData.segmentacion.intereses.length} Inters. mapeados).</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateCampaignModal;
