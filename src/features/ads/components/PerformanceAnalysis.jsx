const COLORS = {
    primary: '#6366f1',
    success: '#10b981',
    warning: '#f59e0b',
    cyan: '#06b6d4'
};

/**
 * Componente para mostrar análisis de rendimiento detallado
 */
const PerformanceAnalysis = ({ metrics, campaign }) => {
    return (
        <div style={{
            backgroundColor: 'var(--bg-card)',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            border: '1px solid var(--border-primary)'
        }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                📊 Análisis de Rendimiento
            </h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem'
            }}>
                <div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        Tasa de Conversión
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: COLORS.success }}>
                        {metrics.totalClicks > 0 ? `${((metrics.totalClicks / metrics.totalImpressions) * 100).toFixed(2)}%` : '0%'}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        De impresiones a clicks
                    </p>
                </div>

                <div>
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        Costo por Impresión
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: COLORS.primary }}>
                        {campaign.costoPorImpresion || 1} crédito(s)
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Configurado en la campaña
                    </p>
                </div>

                <div>
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        Presupuesto Restante
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: COLORS.warning }}>
                        {((campaign.presupuesto || 0) - metrics.creditsSpent).toLocaleString()}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        De {campaign.presupuesto?.toLocaleString() || 0} créditos totales
                    </p>
                </div>

                <div>
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        Días Activos
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: COLORS.cyan }}>
                        {Math.ceil((new Date() - new Date(campaign.fechaInicio)) / (1000 * 60 * 60 * 24))}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        De {Math.ceil((new Date(campaign.fechaFin) - new Date(campaign.fechaInicio)) / (1000 * 60 * 60 * 24))} días totales
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PerformanceAnalysis;
