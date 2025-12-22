import React from 'react';

const StepPreview = ({ formData, onSubmit, loading, errors }) => {
    return (
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
                        Resumen de Configuración:
                    </p>
                    <div style={{
                        backgroundColor: '#1a1f3a',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '1px solid #374151',
                        fontSize: '0.875rem'
                    }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <p style={{ color: '#9ca3af', marginBottom: '0.25rem' }}>Segmentación:</p>
                            <p style={{ color: '#ffffff' }}>
                                {formData.segmentacion.edadMin}-{formData.segmentacion.edadMax} años,
                                {' '}{formData.segmentacion.genero},
                                {' '}{formData.segmentacion.ubicacion.esGlobal ? 'Global' : 'Local'}
                            </p>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <p style={{ color: '#9ca3af', marginBottom: '0.25rem' }}>Fechas:</p>
                            <p style={{ color: '#ffffff' }}>
                                {formData.fechaInicio} al {formData.fechaFin}
                            </p>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <p style={{ color: '#9ca3af', marginBottom: '0.25rem' }}>Presupuesto Total:</p>
                            <p style={{ color: '#10b981', fontWeight: 'bold' }}>
                                {formData.presupuesto} DegaCoins
                            </p>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <button
                            onClick={onSubmit}
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                backgroundColor: '#10b981',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                cursor: loading ? 'wait' : 'pointer',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Creando Campaña...' : 'Confirmar y Crear Campaña'}
                        </button>
                        {errors.submit && (
                            <p style={{ color: '#ef4444', textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
                                {errors.submit}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepPreview;
