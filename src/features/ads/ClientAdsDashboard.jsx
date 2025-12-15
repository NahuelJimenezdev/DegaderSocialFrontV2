import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  TrendingUp, 
  Eye, 
  MousePointerClick, 
  DollarSign,
  Pause,
  Play,
  Trash2,
  Edit,
  BarChart3,
  Coins
} from 'lucide-react';
import * as adService from '../../api/adService';
import CreateCampaignModal from './CreateCampaignModal';
import EditCampaignModal from './EditCampaignModal';

/**
 * Dashboard de Cliente para gestionar campañas publicitarias
 */
const ClientAdsDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [campaignsRes, balanceRes] = await Promise.all([
        adService.getMyCampaigns(),
        adService.getBalance()
      ]);
      // El servicio ya devuelve response.data, así que usamos directamente
      setCampaigns(Array.isArray(campaignsRes) ? campaignsRes : []);
      setBalance(balanceRes);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCampaign = async (id) => {
    try {
      await adService.toggleCampaign(id);
      fetchData();
    } catch (error) {
      console.error('Error al pausar/reanudar:', error);
      alert('Error al cambiar estado de la campaña');
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta campaña?')) return;
    
    try {
      await adService.deleteCampaign(id);
      fetchData();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar la campaña');
    }
  };

  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setShowEditModal(true);
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

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#9ca3af' }}>Cargando...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '0.5rem' }}>
          Mis Campañas Publicitarias
        </h1>
        <p style={{ color: '#9ca3af' }}>
          Gestiona tus anuncios y monitorea su rendimiento
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Balance de Créditos */}
        <div style={{
          backgroundColor: '#0f1229',
          border: '1px solid #1a1f3a',
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Coins size={24} color="#6366f1" />
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>DegaCoins</span>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff' }}>
            {balance?.balance || 0}
          </p>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}>
            Créditos disponibles
          </p>
          <button
            onClick={() => alert('Función de compra en desarrollo')}
            style={{
              marginTop: '1rem',
              width: '100%',
              padding: '0.5rem',
              backgroundColor: '#6366f1',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}
          >
            Comprar Créditos
          </button>
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
            {campaigns.filter(c => c.estado === 'activo').length}
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
            {campaigns.reduce((sum, c) => sum + (c.metricas?.impresiones || 0), 0).toLocaleString()}
          </p>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}>
            Total de vistas
          </p>
        </div>

        {/* Total Clicks */}
        <div style={{
          backgroundColor: '#0f1229',
          border: '1px solid #1a1f3a',
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <MousePointerClick size={24} color="#f59e0b" />
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Clicks</span>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff' }}>
            {campaigns.reduce((sum, c) => sum + (c.metricas?.clicks || 0), 0).toLocaleString()}
          </p>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}>
            Total de clicks
          </p>
        </div>
      </div>

      {/* Botón Crear Campaña */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6366f1',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          <Plus size={20} />
          Nueva Campaña
        </button>
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
            Todas las Campañas
          </h2>
        </div>

        {campaigns.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>
              No tienes campañas aún
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6366f1',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              Crear Primera Campaña
            </button>
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
                    Estado
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>
                    Impresiones
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>
                    Clicks
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
                {campaigns.map((campaign) => (
                  <tr key={campaign._id} style={{ borderTop: '1px solid #1a1f3a' }}>
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
                    <td style={{ padding: '1rem' }}>
                      {getEstadoBadge(campaign.estado)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#ffffff' }}>
                      {campaign.metricas?.impresiones?.toLocaleString() || 0}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#ffffff' }}>
                      {campaign.metricas?.clicks?.toLocaleString() || 0}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#ffffff' }}>
                      {campaign.metricas?.ctr?.toFixed(2) || 0}%
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#ffffff' }}>
                      {campaign.creditosGastados || 0} 💎
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        {(campaign.estado === 'borrador' || campaign.estado === 'pausado' || campaign.estado === 'rechazado') && (
                          <button
                            onClick={() => handleEditCampaign(campaign)}
                            style={{
                              padding: '0.5rem',
                              backgroundColor: 'transparent',
                              border: '1px solid #3b82f6',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              color: '#3b82f6'
                            }}
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {(campaign.estado === 'activo' || campaign.estado === 'pausado') && (
                          <button
                            onClick={() => handleToggleCampaign(campaign._id)}
                            style={{
                              padding: '0.5rem',
                              backgroundColor: 'transparent',
                              border: '1px solid #1a1f3a',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              color: '#9ca3af'
                            }}
                            title={campaign.estado === 'activo' ? 'Pausar' : 'Reanudar'}
                          >
                            {campaign.estado === 'activo' ? <Pause size={16} /> : <Play size={16} />}
                          </button>
                        )}
                        <button
                          onClick={() => alert('Función de estadísticas en desarrollo')}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: 'transparent',
                            border: '1px solid #1a1f3a',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: '#9ca3af'
                          }}
                          title="Ver estadísticas"
                        >
                          <BarChart3 size={16} />
                        </button>
                        {campaign.estado === 'borrador' && (
                          <button
                            onClick={() => handleDeleteCampaign(campaign._id)}
                            style={{
                              padding: '0.5rem',
                              backgroundColor: 'transparent',
                              border: '1px solid #ef4444',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              color: '#ef4444'
                            }}
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Creación de Campaña */}
      <CreateCampaignModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          fetchData(); // Refresh data after creating campaign
        }}
        currentBalance={balance?.balance || 0}
      />

      {/* Modal de Edición de Campaña */}
      <EditCampaignModal
        isOpen={showEditModal}
        onClose={() => {
            setShowEditModal(false);
            setSelectedCampaign(null);
        }}
        onSuccess={() => {
          fetchData(); 
        }}
        currentBalance={balance?.balance || 0}
        campaign={selectedCampaign}
      />
    </div>
  );
};

export default ClientAdsDashboard;
