import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const COLORS = {
    primary: '#6366f1',
    success: '#10b981'
};

/**
 * Componente para mostrar gráfica de tendencias en el tiempo
 */
const PerformanceCharts = ({ trendsData, isGratuito = false }) => {
    if (!trendsData || trendsData.length === 0) {
        return null;
    }

    const impressionColor = isGratuito ? '#10b981' : COLORS.primary;
    const clickColor = isGratuito ? '#f59e0b' : COLORS.success;

    return (
        <div style={{
            backgroundColor: '#1a1a2e',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem'
        }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: isGratuito ? '#10b981' : 'var(--text-primary)' }}>
                Tendencias en el Tiempo
            </h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                    <XAxis
                        dataKey="date"
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                    />
                    <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1a1a2e',
                            border: '1px solid #2a2a3e',
                            borderRadius: '8px',
                            color: '#ffffff'
                        }}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="impressions"
                        stroke={impressionColor}
                        strokeWidth={isGratuito ? 3 : 2}
                        name="Impresiones"
                        dot={{ fill: impressionColor }}
                    />
                    <Line
                        type="monotone"
                        dataKey="clicks"
                        stroke={clickColor}
                        strokeWidth={2}
                        name="Clicks"
                        dot={{ fill: clickColor }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PerformanceCharts;
