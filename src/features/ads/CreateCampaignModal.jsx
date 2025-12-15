import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import * as adService from '../../api/adService';

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
      console.error('Error creando campaña:', error);
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
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #1a1f3a',
          overflowX: 'auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minWidth: '600px'
          }}>
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: currentStep >= step.number ? '#6366f1' : '#1a1f3a',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    transition: 'all 0.3s'
                  }}>
                    {currentStep > step.number ? <Check size={24} /> : step.icon}
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    color: currentStep >= step.number ? '#ffffff' : '#6b7280',
                    textAlign: 'center',
                    fontWeight: currentStep === step.number ? '600' : '400'
                  }}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: currentStep > step.number ? '#6366f1' : '#1a1f3a',
                    margin: '0 0.5rem 1.5rem',
                    transition: 'all 0.3s'
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem'
        }}>
          {/* Paso 1: Información Básica */}
          {currentStep === 1 && (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '1.5rem' }}>
                Información Básica del Anuncio
              </h3>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Nombre del Cliente/Empresa *
                </label>
                <input
                  type="text"
                  value={formData.nombreCliente}
                  onChange={(e) => updateField('nombreCliente', e.target.value)}
                  placeholder="Ej: Librería Cristiana Esperanza"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#1a1f3a',
                    border: `1px solid ${errors.nombreCliente ? '#ef4444' : '#374151'}`,
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                />
                {errors.nombreCliente && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {errors.nombreCliente}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Call to Action (Texto del Botón) *
                </label>
                <input
                  type="text"
                  value={formData.callToAction}
                  onChange={(e) => updateField('callToAction', e.target.value)}
                  placeholder="Ej: ¡Compra Ahora!"
                  maxLength={30}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#1a1f3a',
                    border: `1px solid ${errors.callToAction ? '#ef4444' : '#374151'}`,
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                  {errors.callToAction && (
                    <p style={{ color: '#ef4444', fontSize: '0.75rem' }}>
                      {errors.callToAction}
                    </p>
                  )}
                  <p style={{ color: '#6b7280', fontSize: '0.75rem', marginLeft: 'auto' }}>
                    {formData.callToAction.length}/30
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Link de Destino *
                </label>
                <input
                  type="url"
                  value={formData.linkDestino}
                  onChange={(e) => updateField('linkDestino', e.target.value)}
                  placeholder="https://ejemplo.com/producto"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#1a1f3a',
                    border: `1px solid ${errors.linkDestino ? '#ef4444' : '#374151'}`,
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                />
                {errors.linkDestino && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {errors.linkDestino}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Texto Alternativo (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.textoAlternativo}
                  onChange={(e) => updateField('textoAlternativo', e.target.value)}
                  placeholder="Descripción de la imagen para accesibilidad"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#1a1f3a',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
          )}

          {/* Paso 2: Imagen */}
          {currentStep === 2 && (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '1.5rem' }}>
                Imagen del Anuncio
              </h3>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  URL de la Imagen *
                </label>
                <input
                  type="url"
                  value={formData.imagenUrl}
                  onChange={(e) => updateField('imagenUrl', e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#1a1f3a',
                    border: `1px solid ${errors.imagenUrl ? '#ef4444' : '#374151'}`,
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                />
                {errors.imagenUrl && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {errors.imagenUrl}
                  </p>
                )}
                <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  Formatos soportados: JPG, PNG, WebP, GIF. Dimensiones recomendadas: 400x300px
                </p>
              </div>

              {/* Preview de la imagen */}
              {formData.imagenUrl && !errors.imagenUrl && (
                <div style={{ marginTop: '2rem' }}>
                  <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Vista Previa:
                  </p>
                  <div style={{
                    width: '100%',
                    maxWidth: '400px',
                    height: '300px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#1a1f3a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img
                      src={formData.imagenUrl}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Error+al+cargar+imagen';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Paso 3: Segmentación */}
          {currentStep === 3 && (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '1.5rem' }}>
                Segmentación de Audiencia
              </h3>

              {/* Rango de Edad */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Rango de Edad
                </label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <input
                      type="number"
                      min="13"
                      max="100"
                      value={formData.segmentacion.edadMin}
                      onChange={(e) => updateSegmentation('edadMin', parseInt(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#1a1f3a',
                        border: `1px solid ${errors.edadMin ? '#ef4444' : '#374151'}`,
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '1rem'
                      }}
                    />
                    <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem' }}>Mínima</p>
                  </div>
                  <span style={{ color: '#6b7280' }}>-</span>
                  <div style={{ flex: 1 }}>
                    <input
                      type="number"
                      min="13"
                      max="100"
                      value={formData.segmentacion.edadMax}
                      onChange={(e) => updateSegmentation('edadMax', parseInt(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: '#1a1f3a',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '1rem'
                      }}
                    />
                    <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem' }}>Máxima</p>
                  </div>
                </div>
                {errors.edadMin && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                    {errors.edadMin}
                  </p>
                )}
              </div>

              {/* Género */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Género
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {['todos', 'masculino', 'femenino'].map((genero) => (
                    <label key={genero} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="genero"
                        value={genero}
                        checked={formData.segmentacion.genero === genero}
                        onChange={(e) => updateSegmentation('genero', e.target.value)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ color: '#ffffff', fontSize: '0.875rem', textTransform: 'capitalize' }}>
                        {genero}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Intereses */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Intereses (Opcional)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  {['religión', 'deportes', 'tecnología', 'música', 'arte', 'educación'].map((interes) => (
                    <label key={interes} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.segmentacion.intereses.includes(interes)}
                        onChange={(e) => {
                          const newIntereses = e.target.checked
                            ? [...formData.segmentacion.intereses, interes]
                            : formData.segmentacion.intereses.filter(i => i !== interes);
                          updateSegmentation('intereses', newIntereses);
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ color: '#ffffff', fontSize: '0.875rem', textTransform: 'capitalize' }}>
                        {interes}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ubicación Global */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.segmentacion.ubicacion.esGlobal}
                    onChange={(e) => updateSegmentation('ubicacion', {
                      ...formData.segmentacion.ubicacion,
                      esGlobal: e.target.checked
                    })}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ color: '#ffffff', fontSize: '0.875rem' }}>
                    Mostrar a nivel global (sin restricciones geográficas)
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Paso 4: Configuración */}
          {currentStep === 4 && (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '1.5rem' }}>
                Configuración de Campaña
              </h3>

              {/* Fechas */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Fecha de Inicio *
                  </label>
                  <input
                    type="date"
                    value={formData.fechaInicio}
                    onChange={(e) => updateField('fechaInicio', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#1a1f3a',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    Fecha de Fin *
                  </label>
                  <input
                    type="date"
                    value={formData.fechaFin}
                    onChange={(e) => updateField('fechaFin', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#1a1f3a',
                      border: `1px solid ${errors.fechaFin ? '#ef4444' : '#374151'}`,
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '1rem'
                    }}
                  />
                  {errors.fechaFin && (
                    <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      {errors.fechaFin}
                    </p>
                  )}
                </div>
              </div>

              {/* Presupuesto */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Presupuesto (DegaCoins) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.presupuesto}
                  onChange={(e) => updateField('presupuesto', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#1a1f3a',
                    border: `1px solid ${errors.presupuesto ? '#ef4444' : '#374151'}`,
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                  {errors.presupuesto && (
                    <p style={{ color: '#ef4444', fontSize: '0.75rem' }}>
                      {errors.presupuesto}
                    </p>
                  )}
                  <p style={{ color: '#6b7280', fontSize: '0.75rem', marginLeft: 'auto' }}>
                    Balance disponible: {currentBalance} DegaCoins
                  </p>
                </div>
              </div>

              {/* Máximo de impresiones por usuario */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Máximo de Impresiones por Usuario
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.maxImpresionesUsuario}
                  onChange={(e) => updateField('maxImpresionesUsuario', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#1a1f3a',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                />
                <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  Recomendado: 3 (evita saturar a los usuarios)
                </p>
              </div>

              {/* Prioridad */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Prioridad
                </label>
                <select
                  value={formData.prioridad}
                  onChange={(e) => updateField('prioridad', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#1a1f3a',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                >
                  <option value="basica">Básica</option>
                  <option value="premium">Premium</option>
                  <option value="destacada">Destacada</option>
                </select>
              </div>
            </div>
          )}

          {/* Paso 5: Preview */}
          {currentStep === 5 && (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '1.5rem' }}>
                Vista Previa de tu Anuncio
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Preview del anuncio */}
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    Así se verá tu anuncio:
                  </p>
                  <div style={{
                    backgroundColor: '#1a1f3a',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid #374151'
                  }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={formData.imagenUrl}
                        alt={formData.textoAlternativo || formData.nombreCliente}
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '0.5rem',
                        left: '0.5rem',
                        padding: '0.25rem 0.5rem',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        borderRadius: '4px',
                        fontSize: '0.625rem',
                        color: '#ffffff',
                        fontWeight: '600'
                      }}>
                        PUBLICIDAD
                      </div>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <h4 style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                        {formData.nombreCliente}
                      </h4>
                      <button style={{
                        width: '100%',
                        padding: '0.5rem',
                        backgroundColor: '#6366f1',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        {formData.callToAction}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Resumen de configuración */}
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    Resumen de la campaña:
                  </p>
                  <div style={{ backgroundColor: '#1a1f3a', borderRadius: '12px', padding: '1.5rem', border: '1px solid #374151' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>Cliente</p>
                      <p style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: '600' }}>{formData.nombreCliente}</p>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>Segmentación</p>
                      <p style={{ color: '#ffffff', fontSize: '0.875rem' }}>
                        {formData.segmentacion.edadMin}-{formData.segmentacion.edadMax} años, {formData.segmentacion.genero}
                      </p>
                      {formData.segmentacion.intereses.length > 0 && (
                        <p style={{ color: '#ffffff', fontSize: '0.875rem' }}>
                          Intereses: {formData.segmentacion.intereses.join(', ')}
                        </p>
                      )}
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>Duración</p>
                      <p style={{ color: '#ffffff', fontSize: '0.875rem' }}>
                        {new Date(formData.fechaInicio).toLocaleDateString()} - {new Date(formData.fechaFin).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>Presupuesto</p>
                      <p style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: '600' }}>
                        {formData.presupuesto} DegaCoins
                      </p>
                      <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                        ≈ {formData.presupuesto} impresiones estimadas
                      </p>
                    </div>
                    <div>
                      <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>Prioridad</p>
                      <p style={{ color: '#ffffff', fontSize: '0.875rem', textTransform: 'capitalize' }}>
                        {formData.prioridad}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1.5rem',
          borderTop: '1px solid #1a1f3a',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'transparent',
              border: '1px solid #1a1f3a',
              borderRadius: '8px',
              color: currentStep === 1 ? '#6b7280' : '#ffffff',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            <ChevronLeft size={20} />
            Anterior
          </button>

          <div style={{ display: 'flex', gap: '1rem' }}>
            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#6366f1',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                Siguiente
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: loading ? '#6b7280' : '#10b981',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                {loading ? 'Creando...' : 'Crear Campaña'}
                <Check size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Error de submit */}
        {errors.submit && (
          <div style={{
            padding: '1rem 1.5rem',
            backgroundColor: '#ef444420',
            borderTop: '1px solid #ef4444',
            color: '#ef4444',
            fontSize: '0.875rem'
          }}>
            {errors.submit}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCampaignModal;
