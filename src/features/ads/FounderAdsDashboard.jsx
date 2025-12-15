import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, DollarSign, TrendingUp, Users, Eye, MousePointer, Filter, Search, CheckCircle, XCircle } from 'lucide-react';
import adService from '../../api/adService';
import CampaignReviewModal from './CampaignReviewModal';

/**
 * Dashboard de Founder para administrar todas las campañas
 */
const FounderAdsDashboard = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pendiente_aprobacion, activo, pausado
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { estado: filter } : {};
      
      console.log('📡 Fetching founder data...');
      const [campaignsRes, revenueRes] = await Promise.all([
        adService.getAllCampaigns(params),
        adService.getRevenue()
      ]);
      
      console.log('📦 Founder Campaigns Response:', campaignsRes);
      console.log('💰 Revenue Response:', revenueRes);

      // La API devuelve { campaigns: [...], total, ... }
      // Aseguramos que seteamos el array
      const campaignsArray = campaignsRes.campaigns || campaignsRes.data || [];
      console.log('✅ Campaigns Array to Set:', campaignsArray);
      
      setCampaigns(campaignsArray);
      setRevenue(revenueRes.data || revenueRes);
    } catch (error) {
      console.error('❌ Error cargando datos en Founder Dashboard:', error);
      if (error.response) {
        console.error('Response Status:', error.response.status);
        console.error('Response Data:', error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handlers para el modal
  const handleCampaignClick = (campaign) => {
    setSelectedCampaign(campaign);
  };

  const handleCloseModal = () => {
    setSelectedCampaign(null);
  };

  const handleApproveCampaign = (campaignId) => {
    // Actualizar la lista de campañas
    setCampaigns(prev => prev.map(c => 
      c._id === campaignId ? { ...c, estado: 'activo' } : c
    ));
  };

  const handleRejectCampaign = (campaignId) => {
    // Actualizar la lista de campañas
    setCampaigns(prev => prev.map(c => 
      c._id === campaignId ? { ...c, estado: 'rechazado' } : c
    ));
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'borrador': { color: '#6b7280', text: 'Borrador' },
      'pendiente_aprobacion': { color: '#f59e0b', text: 'Pendiente' },
      'activo': { color: '#10b981', text: 'Activo' },
      'pausado': { color: '#3b82f6', text: 'Pausado' },
      'finalizado': { color: '#6b7280', text: 'Finalizado' },
      'sin_creditos': { color: '#ef4444', text: 'Sin Créditos' },
      'rechazado': { color: '#ef4444', text: 'Rechazado' }
    };
    
    const badge = badges[estado] || badges.borrador;
    
    return (
      <span style={{
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600',
        backgroundColor: badge.color + '20',
        color: badge.color
      }}>
        {badge.text}
      </span>
    );
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#9ca3af' }}>Cargando...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '0.5rem' }}>
          Panel de Administración - Publicidad
        </h1>
        <p style={{ color: '#9ca3af' }}>
          Gestiona todas las campañas publicitarias y monitorea los ingresos
        </p>
        
        {/* DEBUG PANEL - REMOVE AFTER FIX */}
        <div style={{ padding: '1rem', marginTop: '1rem', background: '#111', border: '1px solid yellow', borderRadius: '8px', fontFamily: 'monospace', fontSize: '10px', color: '#fff', maxHeight: '200px', overflow: 'auto' }}>
           <strong>DEBUG INFO (Visible solo para testing):</strong><br/>
           Loading: {loading ? 'YES' : 'NO'}<br/>
           Filter: {filter}<br/>
           Revenue: {JSON.stringify(revenue)}<br/>
           Campaigns Count: {campaigns.length}<br/>
           Campaigns Raw Data:<br/>
           {JSON.stringify(campaigns, null, 2)}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Ingresos Totales */}
        <div style={{
          backgroundColor: '#0f1229',
          border: '1px solid #1a1f3a',
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <DollarSign size={24} color="#10b981" />
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Ingresos</span>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff' }}>
            {revenue?.ingresosTotales?.toLocaleString() || 0} 💎
          </p>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}>
            DegaCoins vendidos
          </p>
        </div>

        {/* Campañas Pendientes */}
        <div style={{
          backgroundColor: '#0f1229',
          border: '1px solid #1a1f3a',
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Filter size={24} color="#f59e0b" />
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Pendientes</span>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff' }}>
            {revenue?.estadisticas?.pendientes || 0}
          </p>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}>
            Requieren aprobación
          </p>
        </div>

        {/* Campañas Activas */}
        <div style={{
          backgroundColor: '#0f1229',
          border: '1px solid #1a1f3a',
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <TrendingUp size={24} color="#10b981" />
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Activas</span>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff' }}>
            {revenue?.estadisticas?.activas || 0}
          </p>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}>
            Campañas en ejecución
          </p>
        </div>

        {/* Total Impresiones */}
        <div style={{
          backgroundColor: '#0f1229',
          border: '1px solid #1a1f3a',
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Eye size={24} color="#3b82f6" />
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Impresiones</span>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff' }}>
            {revenue?.estadisticas?.totalImpresiones?.toLocaleString() || 0}
          </p>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}>
            Total de vistas
          </p>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {/* Filtros de Estado */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'pendiente_aprobacion', 'activo', 'rechazado'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: filter === f ? '#6366f1' : '#1a1f3a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              {f === 'all' ? 'Todas' : f === 'pendiente_aprobacion' ? 'Pendientes' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Búsqueda */}
        <div style={{ flex: 1, maxWidth: '400px', position: 'relative' }}>
          <Search 
            size={20} 
            style={{ 
              position: 'absolute', 
              left: '1rem', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#9ca3af' 
            }} 
          />
          <input
            type="text"
            placeholder="Buscar por nombre de campaña..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 1rem 0.5rem 3rem',
              backgroundColor: '#1a1f3a',
              border: '1px solid #2a2f4a',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '0.875rem'
            }}
          />
        </div>
      </div>

      {/* Lista de Campañas */}
      <div style={{
        backgroundColor: '#0f1229',
        border: '1px solid #1a1f3a',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1a1f3a' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff' }}>
            Todas las Campañas ({filteredCampaigns.length})
          </h2>
        </div>

        {filteredCampaigns.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: '#9ca3af' }}>
              No hay campañas que coincidan con los filtros
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#1a1f3a' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>
                    Campaña
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>
                    Cliente
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>
                    Estado
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>
                    Impresiones
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>
                    CTR
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>
                    Gastado
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'right', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => (
                  <tr 
                    key={campaign._id} 
                    onClick={() => handleCampaignClick(campaign)}
                    style={{ 
                      borderTop: '1px solid #1a1f3a',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1f3a'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img 
                          src={campaign.imagenUrl} 
                          alt={campaign.nombreCliente}
                          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/48'; }}
                        />
                        <div>
                          <p style={{ color: '#ffffff', fontWeight: '600', fontSize: '0.875rem' }}>
                            {campaign.nombreCliente}
                          </p>
                          <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                            {new Date(campaign.fechaInicio).toLocaleDateString()} - {new Date(campaign.fechaFin).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#ffffff' }}>
                      {campaign.clienteId?.nombres?.primero || 'N/A'} {campaign.clienteId?.apellidos?.primero || ''}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {getEstadoBadge(campaign.estado)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#ffffff' }}>
                      {campaign.metricas?.impresiones?.toLocaleString() || 0}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#ffffff' }}>
                      {campaign.metricas?.ctr?.toFixed(2) || 0}%
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#ffffff' }}>
                      {campaign.creditosGastados || 0} 💎
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        {campaign.estado === 'pendiente_aprobacion' && (
                          <>
                            <button
                              onClick={() => handleApproveCampaign(campaign._id, 'aprobar')}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#10b981',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                color: '#ffffff',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                              title="Aprobar"
                            >
                              <CheckCircle size={14} />
                              Aprobar
                            </button>
                            <button
                              onClick={() => handleApproveCampaign(campaign._id, 'rechazar')}
                              style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: '#ef4444',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                color: '#ffffff',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                              title="Rechazar"
                            >
                              <XCircle size={14} />
                              Rechazar
                            </button>
                          </>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/publicidad/analytics/${campaign._id}`);
                          }}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: 'transparent',
                            border: '1px solid #1a1f3a',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: '#9ca3af'
                          }}
                          title="Ver estadísticas detalladas"
                        >
                          <BarChart3 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de revisión de campaña */}
      {selectedCampaign && (
        <CampaignReviewModal
          campaign={selectedCampaign}
          onClose={handleCloseModal}
          onApprove={handleApproveCampaign}
          onReject={handleRejectCampaign}
        />
      )}
    </div>
  );
};

export default FounderAdsDashboard;
