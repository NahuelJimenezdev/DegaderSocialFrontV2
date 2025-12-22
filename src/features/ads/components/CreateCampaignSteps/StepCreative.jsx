import React from 'react';

const StepCreative = ({ formData, updateField, errors }) => {
    return (
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
    );
};

export default StepCreative;
