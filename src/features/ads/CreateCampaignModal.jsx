import React, { useState } from 'react';
import { logger } from '../../shared/utils/logger';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import * as adService from '../../api/adService';

// Importación de componentes refactorizados
import StepBasicInfo from './components/CreateCampaignSteps/StepBasicInfo';
import StepCreative from './components/CreateCampaignSteps/StepCreative';
import StepTargeting from './components/CreateCampaignSteps/StepTargeting';
import StepBudget from './components/CreateCampaignSteps/StepBudget';
import StepPreview from './components/CreateCampaignSteps/StepPreview';
import CampaignWizardStepper from './components/CreateCampaignSteps/CampaignWizardStepper';

/**
 * Modal de Creación de Campaña Publicitaria
 * Formulario multi-paso para crear campañas completas
 */
const CreateCampaignModal = ({ isOpen, onClose, onSuccess, currentBalance }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Estado del formulario
  const [formData, setFormData] = useState({
    // Paso 1: Información Básica
    nombreCliente: '',
    callToAction: '¡Prueba Ahora!',
    linkDestino: '',
    textoAlternativo: '',

    // Paso 2: Imagen
    imagenUrl: '',

    // Paso 3: Segmentación
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

    // Paso 4: Configuración
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    presupuesto: 100,
    costoPorImpresion: 1,
    maxImpresionesUsuario: 3,
    prioridad: 'basica',
    estado: 'pendiente_aprobacion'
  });

  const steps = [
    { number: 1, title: 'Información Básica', icon: '📝' },
    { number: 2, title: 'Imagen', icon: '🖼️' },
    { number: 3, title: 'Segmentación', icon: '🎯' },
    { number: 4, title: 'Configuración', icon: '⚙️' },
    { number: 5, title: 'Preview', icon: '👁️' }
  ];

  // Actualizar campo del formulario
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Actualizar campo anidado de segmentación
  const updateSegmentation = (field, value) => {
    setFormData(prev => ({
      ...prev,
      segmentacion: { ...prev.segmentacion, [field]: value }
    }));
  };

  // Validar paso actual
  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.nombreCliente.trim()) {
          newErrors.nombreCliente = 'El nombre del cliente es requerido';
        } else if (formData.nombreCliente.length < 3) {
          newErrors.nombreCliente = 'Mínimo 3 caracteres';
        }

        if (!formData.callToAction.trim()) {
          newErrors.callToAction = 'El Call to Action es requerido';
        } else if (formData.callToAction.length > 30) {
          newErrors.callToAction = 'Máximo 30 caracteres';
        }

        if (!formData.linkDestino.trim()) {
          newErrors.linkDestino = 'El link de destino es requerido';
        } else if (!/^https?:\/\/.+/.test(formData.linkDestino)) {
          newErrors.linkDestino = 'Debe ser una URL válida (http:// o https://)';
        }
        break;

      case 2:
        if (!formData.imagenUrl.trim()) {
          newErrors.imagenUrl = 'La imagen es requerida';
        } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)/i.test(formData.imagenUrl)) {
          newErrors.imagenUrl = 'Debe ser una URL de imagen válida (.jpg, .png, .webp, .gif)';
        }
        break;

      case 3:
        if (formData.segmentacion.edadMin > formData.segmentacion.edadMax) {
          newErrors.edadMin = 'La edad mínima debe ser menor o igual a la máxima';
        }
        break;

      case 4:
        if (new Date(formData.fechaInicio) >= new Date(formData.fechaFin)) {
          newErrors.fechaFin = 'La fecha de fin debe ser posterior a la de inicio';
        }

        if (formData.presupuesto <= 0) {
          newErrors.presupuesto = 'El presupuesto debe ser mayor a 0';
        } else if (formData.presupuesto > currentBalance) {
          newErrors.presupuesto = `No tienes suficientes créditos (disponible: ${currentBalance})`;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navegar al siguiente paso
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  // Navegar al paso anterior
  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Enviar formulario
  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Preparar datos para el backend
      const campaignData = {
        nombreCliente: formData.nombreCliente,
        imagenUrl: formData.imagenUrl,
        textoAlternativo: formData.textoAlternativo || formData.nombreCliente,
        linkDestino: formData.linkDestino,
        callToAction: formData.callToAction,
        segmentacion: {
          edadMin: formData.segmentacion.edadMin,
          edadMax: formData.segmentacion.edadMax,
          genero: formData.segmentacion.genero,
          intereses: formData.segmentacion.intereses,
          ubicacion: {
            esGlobal: formData.segmentacion.ubicacion.esGlobal
          }
        },
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        costoPorImpresion: formData.costoPorImpresion,
        maxImpresionesUsuario: formData.maxImpresionesUsuario,
        prioridad: formData.prioridad,
        estado: formData.estado
      };

      await adService.createCampaign(campaignData);

      onSuccess();
      onClose();
    } catch (error) {
      logger.error('Error creando campaña:', error);
      setErrors({ submit: error.response?.data?.msg || 'Error al crear la campaña' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
            Crear Nueva Campaña
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Stepper */}
        <CampaignWizardStepper steps={steps} currentStep={currentStep} />

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {currentStep === 1 && (
            <StepBasicInfo
              formData={formData}
              updateField={updateField}
              errors={errors}
            />
          )}

          {currentStep === 2 && (
            <StepCreative
              formData={formData}
              updateField={updateField}
              errors={errors}
            />
          )}

          {currentStep === 3 && (
            <StepTargeting
              formData={formData}
              updateSegmentation={updateSegmentation}
              errors={errors}
            />
          )}

          {currentStep === 4 && (
            <StepBudget
              formData={formData}
              updateField={updateField}
              errors={errors}
              currentBalance={currentBalance}
            />
          )}

          {currentStep === 5 && (
            <StepPreview
              formData={formData}
              onSubmit={handleSubmit}
              loading={loading}
              errors={errors}
            />
          )}
        </div>

        {/* Footer (Navegación) - Oculto en el último paso que tiene su propio botón de confirmar */}
        {currentStep < 5 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm transition-colors ${currentStep === 1
                  ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
            >
              <ChevronLeft size={20} />
              Anterior
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Siguiente
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCampaignModal;
