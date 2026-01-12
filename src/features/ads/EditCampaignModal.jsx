import React, { useState, useEffect } from 'react';
import { logger } from '../../shared/utils/logger';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import * as adService from '../../api/adService';

/**
 * Modal de Edición de Campaña Publicitaria
 * Permite editar campañas existentes (borradores o pausadas)
 */
const EditCampaignModal = ({ isOpen, onClose, onSuccess, currentBalance, campaign }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombreCliente: '',
    callToAction: '',
    linkDestino: '',
    textoAlternativo: '',
    imagenUrl: '',
    segmentacion: {
      edadMin: 18,
      edadMax: 65,
      genero: 'todos',
      intereses: [],
      ubicacion: {
        esGlobal: true
      }
    },
    fechaInicio: '',
    fechaFin: '',
    presupuesto: 0,
    costoPorImpresion: 1,
    maxImpresionesUsuario: 3,
    prioridad: 'basica',
    estado: 'borrador' // No se envía al editar, pero lo mantenemos en el estado local
  });

  // Cargar datos de la campaña al abrir
  useEffect(() => {
    if (campaign && isOpen) {
      // Formatear fechas para inputs tipo date
      const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
      };

      setFormData({
        nombreCliente: campaign.nombreCliente || '',
        callToAction: campaign.callToAction || '',
        linkDestino: campaign.linkDestino || '',
        textoAlternativo: campaign.textoAlternativo || '',
        imagenUrl: campaign.imagenUrl || '',
        segmentacion: {
          edadMin: campaign.segmentacion?.edadMin || 18,
          edadMax: campaign.segmentacion?.edadMax || 65,
          genero: campaign.segmentacion?.genero || 'todos',
          intereses: campaign.segmentacion?.intereses || [],
          ubicacion: {
            esGlobal: campaign.segmentacion?.ubicacion?.esGlobal ?? true
            // Nota: Si no es global, necesitaríamos más lógica para mostrar/editar coordenadas, 
            // por ahora simplificamos a mantener si es global o no.
          }
        },
        fechaInicio: formatDate(campaign.fechaInicio),
        fechaFin: formatDate(campaign.fechaFin),
        presupuesto: 0, // El presupuesto no se edita directamente así, depende del diseño. 
        // Omitiremos edición de presupuesto por ahora ya que implica lógica de créditos compleja.
        costoPorImpresion: campaign.costoPorImpresion || 1,
        maxImpresionesUsuario: campaign.maxImpresionesUsuario || 3,
        prioridad: campaign.prioridad || 'basica',
        estado: campaign.estado
      });
    }
  }, [campaign, isOpen]);


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
        // Omitimos validación de presupuesto para edición
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

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
        // No enviamos costoPorImpresion ni presupuesto al editar por ahora
        maxImpresionesUsuario: formData.maxImpresionesUsuario,
        prioridad: formData.prioridad
      };

      await adService.updateCampaign(campaign._id, campaignData);

      onSuccess();
      onClose();
    } catch (error) {
      logger.error('Error actualizando campaña:', error);
      setErrors({ submit: error.response?.data?.msg || 'Error al actualizar la campaña' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#0f1229', border: '1px solid #1a1f3a', borderRadius: '16px',
        maxWidth: '900px', width: '100%', maxHeight: '90vh', overflow: 'hidden',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1a1f3a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>
            Editar Campaña
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '0.5rem' }}>
            <X size={24} />
          </button>
        </div>

        {/* Stepper */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1a1f3a', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '600px' }}>
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    backgroundColor: currentStep >= step.number ? '#6366f1' : '#1a1f3a',
                    color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', transition: 'all 0.3s'
                  }}>
                    {currentStep > step.number ? <Check size={24} /> : step.icon}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: currentStep >= step.number ? '#ffffff' : '#6b7280', textAlign: 'center', fontWeight: currentStep === step.number ? '600' : '400' }}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div style={{ flex: 1, height: '2px', backgroundColor: currentStep > step.number ? '#6366f1' : '#1a1f3a', margin: '0 0.5rem 1.5rem', transition: 'all 0.3s' }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          {currentStep === 1 && (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '1.5rem' }}>Información Básica</h3>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Nombre del Cliente/Empresa *</label>
                <input type="text" value={formData.nombreCliente} onChange={(e) => updateField('nombreCliente', e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1a1f3a', border: `1px solid ${errors.nombreCliente ? '#ef4444' : '#374151'}`, borderRadius: '8px', color: '#ffffff', fontSize: '1rem' }} />
                {errors.nombreCliente && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.nombreCliente}</p>}
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Call to Action *</label>
                <input type="text" value={formData.callToAction} onChange={(e) => updateField('callToAction', e.target.value)} maxLength={30} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1a1f3a', border: `1px solid ${errors.callToAction ? '#ef4444' : '#374151'}`, borderRadius: '8px', color: '#ffffff', fontSize: '1rem' }} />
                {errors.callToAction && <p style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.callToAction}</p>}
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Link de Destino *</label>
                <input type="url" value={formData.linkDestino} onChange={(e) => updateField('linkDestino', e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1a1f3a', border: `1px solid ${errors.linkDestino ? '#ef4444' : '#374151'}`, borderRadius: '8px', color: '#ffffff', fontSize: '1rem' }} />
                {errors.linkDestino && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.linkDestino}</p>}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '1.5rem' }}>Imagen del Anuncio</h3>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>URL de la Imagen *</label>
                <input type="url" value={formData.imagenUrl} onChange={(e) => updateField('imagenUrl', e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1a1f3a', border: `1px solid ${errors.imagenUrl ? '#ef4444' : '#374151'}`, borderRadius: '8px', color: '#ffffff', fontSize: '1rem' }} />
                {errors.imagenUrl && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.imagenUrl}</p>}
              </div>
              {formData.imagenUrl && !errors.imagenUrl && (
                <div style={{ width: '100%', maxWidth: '400px', height: '300px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#1a1f3a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={formData.imagenUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Error+al+cargar+imagen'; }} />
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '1.5rem' }}>Segmentación</h3>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Rango de Edad</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input type="number" min="13" max="100" value={formData.segmentacion.edadMin} onChange={(e) => updateSegmentation('edadMin', parseInt(e.target.value))} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1a1f3a', border: '1px solid #374151', borderRadius: '8px', color: '#ffffff', fontSize: '1rem' }} />
                  <input type="number" min="13" max="100" value={formData.segmentacion.edadMax} onChange={(e) => updateSegmentation('edadMax', parseInt(e.target.value))} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1a1f3a', border: '1px solid #374151', borderRadius: '8px', color: '#ffffff', fontSize: '1rem' }} />
                </div>
                {errors.edadMin && <p style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.edadMin}</p>}
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Género</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {['todos', 'masculino', 'femenino', 'otro'].map(g => (
                    <label key={g} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#fff' }}>
                      <input type="radio" name="genero" value={g} checked={formData.segmentacion.genero === g} onChange={(e) => updateSegmentation('genero', e.target.value)} /> <span style={{ textTransform: 'capitalize' }}>{g}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Intereses</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  {['religión', 'deportes', 'tecnología', 'música', 'arte', 'educación'].map(i => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#fff' }}>
                      <input type="checkbox" checked={formData.segmentacion.intereses.includes(i)} onChange={(e) => {
                        const newIntereses = e.target.checked ? [...formData.segmentacion.intereses, i] : formData.segmentacion.intereses.filter(int => int !== i);
                        updateSegmentation('intereses', newIntereses);
                      }} /> <span style={{ textTransform: 'capitalize' }}>{i}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '1.5rem' }}>Configuración</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Fecha de Inicio</label>
                  <input type="date" value={formData.fechaInicio} onChange={(e) => updateField('fechaInicio', e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1a1f3a', border: '1px solid #374151', borderRadius: '8px', color: '#ffffff', fontSize: '1rem' }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Fecha de Fin</label>
                  <input type="date" value={formData.fechaFin} onChange={(e) => updateField('fechaFin', e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1a1f3a', border: `1px solid ${errors.fechaFin ? '#ef4444' : '#374151'}`, borderRadius: '8px', color: '#ffffff', fontSize: '1rem' }} />
                  {errors.fechaFin && <p style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.fechaFin}</p>}
                </div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Prioridad</label>
                <select value={formData.prioridad} onChange={(e) => updateField('prioridad', e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#1a1f3a', border: '1px solid #374151', borderRadius: '8px', color: '#ffffff', fontSize: '1rem' }}>
                  <option value="basica">Básica</option>
                  <option value="premium">Premium</option>
                  <option value="destacada">Destacada</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '1.5rem' }}>Vista Previa</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ backgroundColor: '#1a1f3a', borderRadius: '12px', overflow: 'hidden', border: '1px solid #374151' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={formData.imagenUrl} alt="Ad" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', padding: '0.25rem 0.5rem', backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '4px', fontSize: '0.625rem', color: '#ffffff', fontWeight: '600' }}>PUBLICIDAD</div>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <h4 style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>{formData.nombreCliente}</h4>
                    <button style={{ width: '100%', padding: '0.5rem', backgroundColor: '#6366f1', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>{formData.callToAction}</button>
                  </div>
                </div>
                <div>
                  <h4 style={{ color: '#ffffff', marginBottom: '1rem' }}>Resumen</h4>
                  <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}><strong>Cliente:</strong> {formData.nombreCliente}</p>
                  <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}><strong>Fechas:</strong> {formData.fechaInicio} - {formData.fechaFin}</p>
                  <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}><strong>Prioridad:</strong> {formData.prioridad}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid #1a1f3a', display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={handleBack} disabled={currentStep === 1} style={{ opacity: currentStep === 1 ? 0.5 : 1, padding: '0.75rem 1.5rem', backgroundColor: 'transparent', border: '1px solid #374151', borderRadius: '8px', color: '#ffffff', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ChevronLeft size={20} /> Anterior
          </button>
          {currentStep < 5 ? (
            <button onClick={handleNext} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#6366f1', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Siguiente <ChevronRight size={20} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#10b981', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Guardando...' : 'Guardar Cambios'} <Check size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCampaignModal;


