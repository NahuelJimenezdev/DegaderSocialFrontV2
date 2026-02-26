import React, { useState } from 'react';
import { logger } from '../../shared/utils/logger';
import { X, CheckCircle, XCircle, Calendar, Target, Users, MapPin, DollarSign } from 'lucide-react';
import adService from '../../api/adService';
import { AlertDialog } from '../../shared/components/AlertDialog';

export default function CampaignReviewModal({ campaign, onClose, onApprove, onReject }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, variant: 'info', message: '' });

  if (!campaign) return null;

  const handleApprove = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      await adService.approveCampaign(campaign._id, 'aprobar');
      onApprove(campaign._id);
      onClose();
    } catch (error) {
      logger.error('Error aprobando campaña:', error);
      setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al aprobar la campaña' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (isProcessing) return;

    if (!rejectReason.trim()) {
      setAlertConfig({ isOpen: true, variant: 'warning', message: 'Por favor ingresa un motivo de rechazo' });
      return;
    }

    try {
      setIsProcessing(true);
      await adService.approveCampaign(campaign._id, 'rechazar', rejectReason);
      onReject(campaign._id);
      onClose();
    } catch (error) {
      logger.error('Error rechazando campaña:', error);
      setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al rechazar la campaña' });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente_aprobacion: { color: 'bg-yellow-500', text: 'Pendiente' },
      activo: { color: 'bg-green-500', text: 'Activo' },
      pausado: { color: 'bg-gray-500', text: 'Pausado' },
      rechazado: { color: 'bg-red-500', text: 'Rechazado' },
      finalizado: { color: 'bg-blue-500', text: 'Finalizado' }
    };
    const badge = badges[estado] || { color: 'bg-gray-500', text: estado };
    return (
      <span className={`${badge.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '16px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          border: '1px solid var(--border-primary)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          backgroundColor: 'var(--bg-card)',
          zIndex: 10
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {campaign.nombreCliente}
            </h2>
            {getEstadoBadge(campaign.estado)}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* Preview de la imagen */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '1rem', fontWeight: '600' }}>
              Vista Previa
            </h3>
            <div style={{
              backgroundColor: 'var(--bg-main)',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid var(--border-primary)'
            }}>
              <img
                src={campaign.imagenUrl}
                alt={campaign.textoAlternativo}
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain',
                  backgroundColor: '#000'
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x400?text=Imagen+no+disponible';
                }}
              />
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-card)' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  {campaign.textoAlternativo}
                </p>
                <a
                  href={campaign.linkDestino}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#6366f1',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  🔗 {campaign.linkDestino}
                </a>
                <button style={{
                  marginTop: '1rem',
                  backgroundColor: '#6366f1',
                  color: '#ffffff',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: '100%'
                }}>
                  {campaign.callToAction}
                </button>
              </div>
            </div>
          </div>

          {/* Información del Cliente */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '1rem', fontWeight: '600' }}>
              Información del Cliente
            </h3>
            <div style={{
              backgroundColor: 'var(--bg-main)',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid var(--border-primary)'
            }}>
              <p style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                <strong>Nombre:</strong> {campaign.clienteId?.nombreCompleto || 'N/A'}
              </p>
              <p style={{ color: 'var(--text-primary)' }}>
                <strong>Email:</strong> {campaign.clienteId?.email || 'N/A'}
              </p>
            </div>
          </div>

          {/* Detalles de la Campaña */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '1rem', fontWeight: '600' }}>
              Detalles de la Campaña
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{
                backgroundColor: 'var(--bg-main)',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid var(--border-primary)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Calendar size={20} color="#6366f1" />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Fecha Inicio</span>
                </div>
                <p style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                  {formatDate(campaign.fechaInicio)}
                </p>
              </div>

              <div style={{
                backgroundColor: 'var(--bg-main)',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid var(--border-primary)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Calendar size={20} color="#6366f1" />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Fecha Fin</span>
                </div>
                <p style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                  {formatDate(campaign.fechaFin)}
                </p>
              </div>

              <div style={{
                backgroundColor: 'var(--bg-main)',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid var(--border-primary)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Target size={20} color="#6366f1" />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Prioridad</span>
                </div>
                <p style={{ color: 'var(--text-primary)', fontWeight: '600', textTransform: 'capitalize' }}>
                  {campaign.prioridad}
                </p>
              </div>

              <div style={{
                backgroundColor: 'var(--bg-main)',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid var(--border-primary)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <DollarSign size={20} color="#6366f1" />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Costo/Impresión</span>
                </div>
                <p style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                  {campaign.costoPorImpresion} crédito(s)
                </p>
              </div>
            </div>
          </div>

          {/* Segmentación */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '1rem', fontWeight: '600' }}>
              Segmentación
            </h3>
            <div style={{
              backgroundColor: 'var(--bg-main)',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid var(--border-primary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Users size={20} color="#6366f1" />
                <span style={{ color: 'var(--text-primary)' }}>
                  <strong>Edad:</strong> {campaign.segmentacion?.edadMin || 18} - {campaign.segmentacion?.edadMax || 65} años
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Users size={20} color="#6366f1" />
                <span style={{ color: 'var(--text-primary)' }}>
                  <strong>Género:</strong> {campaign.segmentacion?.genero === 'todos' ? 'Todos' : campaign.segmentacion?.genero}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <MapPin size={20} color="#6366f1" />
                <span style={{ color: 'var(--text-primary)' }}>
                  <strong>Alcance:</strong> {campaign.segmentacion?.ubicacion?.esGlobal ? 'Global' : `Local (${campaign.segmentacion?.ubicacion?.radioKm || 50} km)`}
                </span>
              </div>
              {campaign.segmentacion?.intereses?.length > 0 && (
                <div style={{ marginTop: '0.75rem' }}>
                  <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>Intereses:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {campaign.segmentacion.intereses.map((interes, idx) => (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: '#6366f1',
                          color: '#ffffff',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.85rem'
                        }}
                      >
                        {interes}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Métricas */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '1rem', fontWeight: '600' }}>
              Métricas Actuales
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{
                backgroundColor: 'var(--bg-main)',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid var(--border-primary)',
                textAlign: 'center'
              }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Impresiones</p>
                <p style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {campaign.metricas?.impresiones || 0}
                </p>
              </div>
              <div style={{
                backgroundColor: 'var(--bg-main)',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid var(--border-primary)',
                textAlign: 'center'
              }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Clicks</p>
                <p style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {campaign.metricas?.clicks || 0}
                </p>
              </div>
              <div style={{
                backgroundColor: 'var(--bg-main)',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid var(--border-primary)',
                textAlign: 'center'
              }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>CTR</p>
                <p style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {campaign.metricas?.ctr?.toFixed(2) || 0}%
                </p>
              </div>
              <div style={{
                backgroundColor: 'var(--bg-main)',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid var(--border-primary)',
                textAlign: 'center'
              }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Gastado</p>
                <p style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {campaign.creditosGastados || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Acciones - Solo para campañas pendientes */}
          {campaign.estado === 'pendiente_aprobacion' && (
            <div style={{
              borderTop: '1px solid var(--border-primary)',
              paddingTop: '1.5rem',
              position: 'sticky',
              bottom: 0,
              backgroundColor: 'var(--bg-card)',
              marginLeft: '-1.5rem',
              marginRight: '-1.5rem',
              marginBottom: '-1.5rem',
              padding: '1.5rem'
            }}>
              {!showRejectInput ? (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    style={{
                      flex: 1,
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: 'none',
                      fontWeight: '600',
                      fontSize: '1rem',
                      cursor: isProcessing ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      opacity: isProcessing ? 0.6 : 1
                    }}
                  >
                    <CheckCircle size={20} />
                    {isProcessing ? 'Procesando...' : 'Aprobar Campaña'}
                  </button>
                  <button
                    onClick={() => setShowRejectInput(true)}
                    disabled={isProcessing}
                    style={{
                      flex: 1,
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      padding: '1rem',
                      borderRadius: '12px',
                      border: 'none',
                      fontWeight: '600',
                      fontSize: '1rem',
                      cursor: isProcessing ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      opacity: isProcessing ? 0.6 : 1
                    }}
                  >
                    <XCircle size={20} />
                    Rechazar Campaña
                  </button>
                </div>
              ) : (
                <div>
                  <label style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Motivo del rechazo:
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Explica por qué se rechaza esta campaña..."
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--bg-main)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      marginBottom: '1rem',
                      minHeight: '100px',
                      fontFamily: 'inherit',
                      fontSize: '0.95rem'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={handleReject}
                      disabled={isProcessing || !rejectReason.trim()}
                      style={{
                        flex: 1,
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        padding: '1rem',
                        borderRadius: '12px',
                        border: 'none',
                        fontWeight: '600',
                        cursor: (isProcessing || !rejectReason.trim()) ? 'not-allowed' : 'pointer',
                        opacity: (isProcessing || !rejectReason.trim()) ? 0.6 : 1
                      }}
                    >
                      {isProcessing ? 'Procesando...' : 'Confirmar Rechazo'}
                    </button>
                    <button
                      onClick={() => {
                        setShowRejectInput(false);
                        setRejectReason('');
                      }}
                      disabled={isProcessing}
                      style={{
                        flex: 1,
                        backgroundColor: '#6b7280',
                        color: '#ffffff',
                        padding: '1rem',
                        borderRadius: '12px',
                        border: 'none',
                        fontWeight: '600',
                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                        opacity: isProcessing ? 0.6 : 1
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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



