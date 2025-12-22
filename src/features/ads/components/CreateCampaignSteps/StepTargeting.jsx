import React from 'react';

const StepTargeting = ({ formData, updateSegmentation, errors }) => {
    return (
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
    );
};

export default StepTargeting;
