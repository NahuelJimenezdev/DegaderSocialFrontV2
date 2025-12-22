import React from 'react';

const StepBasicInfo = ({ formData, updateField, errors }) => {
    return (
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
    );
};

export default StepBasicInfo;
