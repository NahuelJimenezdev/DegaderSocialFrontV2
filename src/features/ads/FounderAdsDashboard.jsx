import React, { useState, useEffect } from 'react';
import { logger } from '../../shared/utils/logger';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, DollarSign, TrendingUp, Eye, Filter, Search, 
  CheckCircle, XCircle, Settings, ShieldCheck, ShieldAlert, PlusCircle, Zap
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import adService from '../../api/adService';
import CampaignReviewModal from './CampaignReviewModal';
import CreateCampaignModal from './CreateCampaignModal';
import ProgressiveImage from '../../shared/components/ProgressiveImage';

// Datos falsos para generar las "Líneas de tendencia" visuales en las tarjetas
const trendDataSuccess = [{v: 10},{v: 25},{v: 15},{v: 30},{v: 28},{v: 45},{v: 60}];
const trendDataNeutral = [{v: 40},{v: 35},{v: 45},{v: 40},{v: 50},{v: 45},{v: 55}];

/**
 * Dashboard de Founder - Centro de Inteligencia de Ingresos
 */
const FounderAdsDashboard = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? (filter === 'gratuitos' ? { costoPorImpresion: 0 } : { estado: filter }) : {};
      const [campaignsRes, revenueRes] = await Promise.all([
        adService.getAllCampaigns(params),
        adService.getRevenue()
      ]);
      const campaignsArray = campaignsRes.campaigns || campaignsRes.data || [];
      setCampaigns(campaignsArray);
      setRevenue(revenueRes.data || revenueRes);
    } catch (error) {
      logger.error('❌ Error cargando datos en Founder Dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignClick = (campaign) => setSelectedCampaign(campaign);
  const handleCloseModal = () => setSelectedCampaign(null);

  const handleApproveCampaign = (campaignId, actionType = 'aprobar') => {
    if(actionType === 'aprobar'){
      setCampaigns(prev => prev.map(c => c._id === campaignId ? { ...c, estado: 'activo' } : c));
    } else {
      setCampaigns(prev => prev.map(c => c._id === campaignId ? { ...c, estado: 'rechazado' } : c));
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'borrador': { color: '#6b7280', text: 'Borrador', bg: 'rgba(107, 114, 128, 0.15)' },
      'pendiente_aprobacion': { color: '#f59e0b', text: 'Pendiente', bg: 'rgba(245, 158, 11, 0.15)' },
      'activo': { color: '#10b981', text: 'Activo', bg: 'rgba(16, 185, 129, 0.15)' },
      'pausado': { color: '#3b82f6', text: 'Pausado', bg: 'rgba(59, 130, 246, 0.15)' },
      'rechazado': { color: '#ef4444', text: 'Rechazado', bg: 'rgba(239, 68, 68, 0.15)' },
      'sin_creditos': { color: '#ef4444', text: 'Sin Créditos', bg: 'rgba(239, 68, 68, 0.15)' }
    };
    const badge = badges[estado] || badges.borrador;
    return (
      <span style={{
        padding: '0.35rem 0.85rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '700',
        backgroundColor: badge.bg,
        color: badge.color,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        border: `1px solid ${badge.color}40`
      }}>
        {estado === 'activo' && <div style={{width: 6, height: 6, borderRadius: '50%', background: badge.color, boxShadow: `0 0 8px ${badge.color}`}}></div>}
        {badge.text}
      </span>
    );
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Componente para la Gráfica de Fondo de las Cards
  const TinyChart = ({ data, color }) => (
    <div style={{ height: '60px', width: '100%', position: 'absolute', bottom: 0, left: 0, opacity: 0.3, zIndex: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`color${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={color} fillOpacity={1} fill={`url(#color${color})`} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      {/* HEADER PREMIUM */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Centro de Inteligencia <span style={{ color: '#10b981' }}>Publicitaria</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Monitorea el rendimiento global, ingresos en DegaCoins y audita campañas activas.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{
            backgroundColor: '#4f46e5',
            color: '#fff',
            border: 'none',
            padding: '0.75rem 1.25rem',
            borderRadius: '10px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)'
          }}
          onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusCircle size={18} />
            Crear Campaña Oficial
          </button>
          
          <button style={{
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            color: '#6366f1',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            padding: '0.75rem 1.25rem',
            borderRadius: '10px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.1)'}
          >
            <Settings size={18} />
            Configurar Precios CPM
          </button>
        </div>
      </div>

      {/* METRIC CARDS (META ADS STYLE) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        {/* Card 1: Ingresos DegaCoins */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '1.5rem', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '8px', borderRadius: '8px' }}>
                <DollarSign size={20} color="#10b981" />
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Ingresos Netos</span>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '12px' }}>+15.3%</span>
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', position: 'relative', zIndex: 1 }}>
            {revenue?.ingresosTotales?.toLocaleString() || 0} <span style={{fontSize: '1.2rem', color: '#10b981'}}>💎</span>
          </p>
          <TinyChart data={trendDataSuccess} color="#10b981" />
        </div>

        {/* Card 2: Costo CPM Promedio */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '1.5rem', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '8px', borderRadius: '8px' }}>
                <TrendingUp size={20} color="#6366f1" />
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>CPM Promedio</span>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af' }}>Global</span>
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', position: 'relative', zIndex: 1 }}>
            $4.20 <span style={{fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '500'}}>/ mil</span>
          </p>
          <TinyChart data={trendDataNeutral} color="#6366f1" />
        </div>

        {/* Card 3: Impresiones Totales */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '1.5rem', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '8px', borderRadius: '8px' }}>
                <Eye size={20} color="#3b82f6" />
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Tráfico Servido</span>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '12px' }}>+8.2%</span>
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', position: 'relative', zIndex: 1 }}>
            {revenue?.estadisticas?.totalImpresiones?.toLocaleString() || 0}
          </p>
          <TinyChart data={trendDataSuccess} color="#3b82f6" />
        </div>

        {/* Card 4: Action Center (Pendientes) */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', padding: '1.5rem', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '8px', borderRadius: '8px' }}>
                <Filter size={20} color="#f59e0b" />
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Por Revisar</span>
            </div>
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#f59e0b', position: 'relative', zIndex: 1 }}>
            {revenue?.estadisticas?.pendientes || 0} <span style={{fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '500'}}>Campañas</span>
          </p>
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '4px', background: '#f59e0b' }}></div>
        </div>
      </div>

      {/* FILTER TABS & SEARCH */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--border-primary)' }}>
          {['all', 'pendiente_aprobacion', 'activo', 'rechazado', 'gratuitos'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.6rem 1.2rem',
                backgroundColor: filter === f ? 'var(--primary)' : 'transparent',
                color: filter === f ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {f === 'gratuitos' && <Zap size={14} className={filter === f ? 'text-white' : 'text-emerald-500'} />}
              {f === 'all' ? 'Todas las Campañas' : f === 'pendiente_aprobacion' ? 'Pendientes de Audit' : f === 'gratuitos' ? 'Patrocinios' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, maxWidth: '350px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Buscar campaña por cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none' }}
          />
        </div>
      </div>

      {/* MEGA TABLE */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        
        {loading ? (
           <div style={{ padding: '4rem', textAlign: 'center', color: '#9ca3af' }}>Cargando Centro de Inteligencia...</div>
        ) : filteredCampaigns.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Filter size={32} color="#6366f1" />
            </div>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 'bold' }}>Sin resultados</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Ajusta los filtros para visualizar la carga de trabajo.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-primary)' }}>
                  <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Identidad del Anuncio</th>
                  <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Segmentación (Target)</th>
                  <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cumplimiento Legal</th>
                  <th style={{ padding: '1.25rem 1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Performance</th>
                  <th style={{ padding: '1.25rem 1.5rem', textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estado & Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => {
                  const hasLocationRisk = campaign.segmentacion?.ubicacion && !campaign.segmentacion.ubicacion.esGlobal;
                  const isGratuito = campaign.costoPorImpresion === 0;
                  
                  return (
                    <tr
                      key={campaign._id}
                      onClick={() => handleCampaignClick(campaign)}
                      style={{ 
                          borderBottom: '1px solid var(--border-primary)', 
                          cursor: 'pointer', 
                          transition: 'all 0.2s',
                          backgroundColor: isGratuito ? 'rgba(16, 185, 129, 0.03)' : 'transparent'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isGratuito ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isGratuito ? 'rgba(16, 185, 129, 0.03)' : 'transparent'}
                    >
                      {/* COLUMNA 1: IDENTIDAD */}
                      <td style={{ padding: '1.25rem 1.5rem', position: 'relative' }}>
                        {isGratuito && (
                          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', backgroundColor: '#10b981' }} />
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                          <ProgressiveImage src={campaign.imagenUrl} alt="Ad" style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover', border: isGratuito ? '2px solid rgba(16,185,129,0.5)' : '1px solid var(--border-primary)' }} />
                          <div>
                            <p style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '1rem', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {campaign.nombreCliente}
                              {isGratuito && <Zap size={14} color="#10b981" title="Campaña Oficial/Gratuita" />}
                            </p>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', background: 'var(--bg-main)', padding: '2px 8px', borderRadius: '4px' }}>
                               {campaign.clienteId?.nombres?.primero || 'Cliente'} {campaign.clienteId?.apellidos?.primero || ''}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* COLUMNA 2: SEGMENTACION ULTRA DETALLADA */}
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <p style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '600' }}>
                            {campaign.segmentacion?.edadMin || 18} - {campaign.segmentacion?.edadMax || 65} años • {campaign.segmentacion?.genero === 'todos' ? 'Ambos géneros' : campaign.segmentacion?.genero}
                          </p>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                             {campaign.segmentacion?.intereses?.slice(0, 3).map((int, i) => (
                               <span key={i} style={{fontSize: '0.7rem', color: '#6366f1', background: 'rgba(99,102,241,0.1)', padding: '2px 6px', borderRadius: '4px', fontWeight: '600'}}>
                                 {int}
                               </span>
                             ))}
                             {campaign.segmentacion?.intereses?.length > 3 && (
                               <span style={{fontSize: '0.7rem', color: 'var(--text-secondary)'}}>+{campaign.segmentacion.intereses.length - 3}</span>
                             )}
                          </div>
                        </div>
                      </td>

                      {/* COLUMNA 3: LEGAL Y PRIVACIDAD */}
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        {hasLocationRisk ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '6px 10px', borderRadius: '8px', width: 'fit-content' }}>
                            <ShieldAlert size={16} />
                            <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Uso de GPS (Revisar)</span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 10px', borderRadius: '8px', width: 'fit-content' }}>
                            <ShieldCheck size={16} />
                            <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>GDPR Compliant</span>
                          </div>
                        )}
                      </td>

                      {/* COLUMNA 4: PERFORMANCE */}
                      <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <span style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '1rem' }}>
                            {campaign.metricas?.impresiones?.toLocaleString() || 0} <Eye size={12} style={{display:'inline', color:'var(--text-secondary)'}}/>
                          </span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '600' }}>
                            CTR: {campaign.metricas?.ctr?.toFixed(2) || 0}%
                          </span>
                        </div>
                      </td>

                      {/* COLUMNA 5: ACCIONES Y ESTADO */}
                      <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem' }}>
                          {getEstadoBadge(campaign.estado)}
                          
                          {/* Botones Flotantes directos en Tabla */}
                          {campaign.estado === 'pendiente_aprobacion' && (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={(e) => { e.stopPropagation(); handleApproveCampaign(campaign._id, 'aprobar'); }} style={{ background: '#10b981', color: '#fff', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(16,185,129,0.3)' }} title="Aprobar de inmediato">
                                <CheckCircle size={16} />
                              </button>
                               <button onClick={(e) => { e.stopPropagation(); handleApproveCampaign(campaign._id, 'rechazar'); }} style={{ background: '#ef4444', color: '#fff', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(239,68,68,0.3)' }} title="Rechazar">
                                <XCircle size={16} />
                              </button>
                            </div>
                          )}

                           <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/publicidad/analytics/${campaign._id}`); }}
                            style={{ padding: '8px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-primary)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-primary)', transition: 'background 0.2s' }}
                            onMouseEnter={(e)=> e.currentTarget.style.background = 'var(--bg-hover)'}
                            onMouseLeave={(e)=> e.currentTarget.style.background = 'var(--bg-main)'}
                            title="Ver Analytics Completos"
                          >
                            <BarChart3 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedCampaign && (
        <CampaignReviewModal
          campaign={selectedCampaign}
          onClose={handleCloseModal}
          onApprove={(id) => handleApproveCampaign(id, 'aprobar')}
          onReject={(id) => handleApproveCampaign(id, 'rechazar')}
        />
      )}

      {/* Modal de Creación - Vista Administrativa */}
      <CreateCampaignModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchData}
        currentBalance={9999999}
        isFounderView={true}
      />
    </div>
  );
};

export default FounderAdsDashboard;
