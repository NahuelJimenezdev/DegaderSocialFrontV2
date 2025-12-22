import React from 'react';

const StepBudget = ({ formData, updateField, errors, currentBalance }) => {
    return (
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
    );
};

export default StepBudget;
