import { Eye, MousePointer, TrendingUp, DollarSign } from 'lucide-react';

const COLORS = {
    primary: '#6366f1',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444'
};

/**
 * Componente para mostrar las métricas principales de la campaña
 */
const MetricsOverview = ({ metrics, campaign }) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
        }}>
            <MetricCard
                icon={<Eye size={24} />}
                title="Impresiones Totales"
                value={metrics.totalImpressions.toLocaleString()}
                subtitle={`${(metrics.totalImpressions / ((campaign.metricas?.impresionesMaxPorUsuario || 3))).toFixed(0)} usuarios alcanzados`}
                color={COLORS.primary}
            />
            <MetricCard
                icon={<MousePointer size={24} />}
                title="Clicks Totales"
                value={metrics.totalClicks.toLocaleString()}
                subtitle={`${metrics.totalClicks > 0 ? ((metrics.totalImpressions / metrics.totalClicks).toFixed(1)) : 'N/A'} impresiones por click`}
                color={COLORS.success}
            />
            <MetricCard
                icon={<TrendingUp size={24} />}
                title="CTR (Click-Through Rate)"
                value={`${metrics.ctr.toFixed(2)}%`}
                subtitle={metrics.ctr > 2 ? '🎯 Excelente rendimiento' : metrics.ctr > 1 ? '✅ Buen rendimiento' : '⚠️ Mejorable'}
                color={COLORS.warning}
            />
            <MetricCard
                icon={<DollarSign size={24} />}
                title="Costo por Click (CPC)"
                value={metrics.totalClicks > 0 ? `${(metrics.creditsSpent / metrics.totalClicks).toFixed(2)} créditos` : 'N/A'}
                subtitle={`Total gastado: ${metrics.creditsSpent} créditos`}
                color={COLORS.danger}
            />
        </div>
    );
};

// Componente de Card de Métrica
function MetricCard({ icon, title, value, subtitle, color }) {
    return (
        <div style={{
            backgroundColor: '#1a1a2e',
            padding: '1.5rem',
            borderRadius: '12px',
            border: `1px solid ${color}20`
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem'
            }}>
                <div style={{
                    color: color,
                    backgroundColor: `${color}20`,
                    padding: '0.75rem',
                    borderRadius: '12px'
                }}>
                    {icon}
                </div>
                <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{title}</span>
            </div>
            <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: color,
                marginBottom: subtitle ? '0.5rem' : 0
            }}>
                {value}
            </div>
            {subtitle && (
                <div style={{
                    fontSize: '0.875rem',
                    color: '#6b7280'
                }}>
                    {subtitle}
                </div>
            )}
        </div>
    );
}

export default MetricsOverview;
