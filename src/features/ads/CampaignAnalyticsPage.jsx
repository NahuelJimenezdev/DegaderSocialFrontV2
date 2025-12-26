import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Globe } from 'lucide-react';
import { AlertDialog } from '../../shared/components/AlertDialog';
import { useCampaignAnalytics } from './hooks/useCampaignAnalytics';
import MetricsOverview from './components/MetricsOverview';
import PerformanceAnalysis from './components/PerformanceAnalysis';
import PerformanceCharts from './components/PerformanceCharts';
import AudienceInsights from './components/AudienceInsights';

const COLORS = {
  primary: '#6366f1',
  success: '#10b981'
};

export default function CampaignAnalyticsPage() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Use custom hook for analytics data
  const {
    loading,
    campaign,
    stats,
    metrics,
    trendsData,
    deviceData,
    browserData,
    alertConfig,
    setAlertConfig
  } = useCampaignAnalytics(campaignId, dateRange);

  // Loading state
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

  // No data state
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

      {/* Date Filters */}
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

      {/* Metrics Overview */}
      <MetricsOverview metrics={metrics} campaign={campaign} />

      {/* Performance Analysis */}
      <PerformanceAnalysis metrics={metrics} campaign={campaign} />

      {/* Performance Charts */}
      <PerformanceCharts trendsData={trendsData} />

      {/* Audience Insights */}
      <AudienceInsights deviceData={deviceData} browserData={browserData} />

      {/* Geography */}
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

      {/* Recent Events */}
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

      {/* AlertDialog Component */}
      <AlertDialog
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        variant={alertConfig.variant}
        message={alertConfig.message}
      />
    </div>
  );
}
