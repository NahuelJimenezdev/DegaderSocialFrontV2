import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  MousePointer, 
  Eye, 
  DollarSign,
  Calendar,
  Monitor,
  Smartphone,
  Tablet,
  Globe
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import adService from '../../api/adService';

const COLORS = {
  primary: '#6366f1',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#a855f7',
  cyan: '#06b6d4'
};

export default function CampaignAnalyticsPage() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);
  const [stats, setStats] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchAnalytics();
  }, [campaignId, dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = {};
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;
      
      const data = await adService.getCampaignStats(campaignId, params);
      console.log('📊 Analytics data:', data);
      
      setCampaign(data.campaign || data.ad);
      setStats(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      alert('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0f0f1e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '3rem',
            marginBottom: '1rem',
            animation: 'spin 1s linear infinite'
          }}>📊</div>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (!campaign || !stats) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0f0f1e',
        padding: '2rem',
        color: '#ffffff'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            color: '#6366f1',
            cursor: 'pointer',
            fontSize: '1rem',
            marginBottom: '2rem'
          }}
        >
          <ArrowLeft size={20} />
          Volver
        </button>
        <p>No se encontraron datos de la campaña</p>
      </div>
    );
  }

  const metrics = stats.metrics || {
    totalImpressions: campaign.metricas?.impresiones || 0,
    totalClicks: campaign.metricas?.clicks || 0,
    ctr: campaign.metricas?.ctr || 0,
    creditsSpent: campaign.creditosGastados || 0
  };

  // Preparar datos para gráficas
  const trendsData = stats.trends?.daily || [];
  const deviceData = stats.devices ? [
    { name: 'Desktop', value: stats.devices.desktop || 0, color: COLORS.primary },
    { name: 'Mobile', value: stats.devices.mobile || 0, color: COLORS.success },
    { name: 'Tablet', value: stats.devices.tablet || 0, color: COLORS.warning }
  ].filter(d => d.value > 0) : [];

  const browserData = stats.browsers ? Object.entries(stats.browsers).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  })) : [];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f0f1e',
      padding: '2rem',
      color: '#ffffff'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            color: '#6366f1',
            cursor: 'pointer',
            fontSize: '1rem',
            marginBottom: '1rem'
          }}
        >
          <ArrowLeft size={20} />
          Volver
        </button>
        
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold',
          marginBottom: '0.5rem'
        }}>
          Estadísticas Detalladas
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '1.1rem' }}>
          {campaign.nombreCliente}
        </p>
      </div>

      {/* Filtros de Fecha */}
      <div style={{
        backgroundColor: '#1a1a2e',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <Calendar size={20} color="#6366f1" />
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Desde</span>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            style={{
              backgroundColor: '#0f0f1e',
              border: '1px solid #2a2a3e',
              borderRadius: '8px',
              padding: '0.5rem',
              color: '#ffffff'
            }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Hasta</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            style={{
              backgroundColor: '#0f0f1e',
              border: '1px solid #2a2a3e',
              borderRadius: '8px',
              padding: '0.5rem',
              color: '#ffffff'
            }}
          />
        </label>
      </div>

      {/* Métricas Principales - MEJORADAS */}
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

      {/* Métricas Adicionales de Rendimiento */}
      <div style={{
        backgroundColor: '#1a1a2e',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '2rem'
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
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
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
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
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
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
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
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              De {Math.ceil((new Date(campaign.fechaFin) - new Date(campaign.fechaInicio)) / (1000 * 60 * 60 * 24))} días totales
            </p>
          </div>
        </div>
      </div>

      {/* Gráfica de Tendencias */}
      {trendsData.length > 0 && (
        <div style={{
          backgroundColor: '#1a1a2e',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
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
                stroke={COLORS.primary} 
                strokeWidth={2}
                name="Impresiones"
                dot={{ fill: COLORS.primary }}
              />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke={COLORS.success} 
                strokeWidth={2}
                name="Clicks"
                dot={{ fill: COLORS.success }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Distribución de Dispositivos y Navegadores */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Dispositivos */}
        {deviceData.length > 0 && (
          <div style={{
            backgroundColor: '#1a1a2e',
            padding: '1.5rem',
            borderRadius: '12px'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
              Dispositivos
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a2e', 
                    border: '1px solid #2a2a3e',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Navegadores */}
        {browserData.length > 0 && (
          <div style={{
            backgroundColor: '#1a1a2e',
            padding: '1.5rem',
            borderRadius: '12px'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
              Navegadores
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={browserData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af' }}
                />
                <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a2e', 
                    border: '1px solid #2a2a3e',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill={COLORS.primary} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Geografía */}
      {stats.geography && stats.geography.length > 0 && (
        <div style={{
          backgroundColor: '#1a1a2e',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={20} color={COLORS.primary} />
            Distribución Geográfica
          </h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {stats.geography.slice(0, 10).map((location, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: '#0f0f1e',
                  borderRadius: '8px'
                }}
              >
                <span>{location.city || location.country || 'Desconocido'}</span>
                <span style={{ 
                  color: COLORS.primary,
                  fontWeight: '600'
                }}>
                  {location.count} vistas
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Eventos Recientes */}
      {stats.recentEvents && stats.recentEvents.length > 0 && (
        <div style={{
          backgroundColor: '#1a1a2e',
          padding: '1.5rem',
          borderRadius: '12px'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
            Eventos Recientes
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2a2a3e' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#9ca3af', fontSize: '0.875rem' }}>Tipo</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#9ca3af', fontSize: '0.875rem' }}>Fecha</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#9ca3af', fontSize: '0.875rem' }}>Dispositivo</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', color: '#9ca3af', fontSize: '0.875rem' }}>Ubicación</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentEvents.slice(0, 20).map((event, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #2a2a3e' }}>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        backgroundColor: event.type === 'click' ? COLORS.success : COLORS.primary,
                        color: '#ffffff',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.875rem'
                      }}>
                        {event.type === 'click' ? 'Click' : 'Impresión'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#e5e7eb' }}>
                      {new Date(event.timestamp).toLocaleString('es-ES')}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#e5e7eb' }}>
                      {event.device || 'Desconocido'}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#e5e7eb' }}>
                      {event.location || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

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
