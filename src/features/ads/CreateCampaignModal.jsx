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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#0f1229',
        border: '1px solid #1a1f3a',
        borderRadius: '16px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #1a1f3a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>
            Crear Nueva Campaña
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Stepper */}
        <CampaignWizardStepper steps={steps} currentStep={currentStep} />

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem'
        }}>
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
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid #1a1f3a',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'none',
                border: '1px solid #374151',
                color: currentStep === 1 ? '#4b5563' : '#ffffff',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem'
              }}
            >
              <ChevronLeft size={20} />
              Anterior
            </button>
            <button
              onClick={handleNext}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#6366f1',
                color: '#ffffff',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
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
