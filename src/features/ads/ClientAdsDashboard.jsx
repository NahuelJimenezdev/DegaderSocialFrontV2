import React, { useState, useEffect } from 'react';
import { logger } from '../../shared/utils/logger';
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
import { AlertDialog } from '../../shared/components/AlertDialog';
import { ConfirmDialog } from '../../shared/components/ConfirmDialog';

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
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, variant: 'info', message: '' });
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

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
      logger.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCampaign = async (id) => {
    try {
      await adService.toggleCampaign(id);
      fetchData();
    } catch (error) {
      logger.error('Error al pausar/reanudar:', error);
      setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al cambiar estado de la campaña' });
    }
  };

  const handleDeleteCampaign = async (id) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Eliminar Campaña',
      message: '¿Estás seguro de eliminar esta campaña?',
      onConfirm: async () => {
        try {
          await adService.deleteCampaign(id);
          fetchData();
        } catch (error) {
          logger.error('Error al eliminar:', error);
          setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al eliminar la campaña' });
        }
      }
    });
  };

  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setShowEditModal(true);
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'borrador': { colorClass: 'bg-gray-500/20 text-gray-500 dark:bg-gray-500/30 dark:text-gray-400', text: 'Borrador' },
      'pendiente_aprobacion': { colorClass: 'bg-amber-500/20 text-amber-600 dark:bg-amber-500/30 dark:text-amber-400', text: 'Pendiente' },
      'activo': { colorClass: 'bg-emerald-500/20 text-emerald-600 dark:bg-emerald-500/30 dark:text-emerald-400', text: 'Activo' },
      'pausado': { colorClass: 'bg-blue-500/20 text-blue-600 dark:bg-blue-500/30 dark:text-blue-400', text: 'Pausado' },
      'finalizado': { colorClass: 'bg-gray-500/20 text-gray-500 dark:bg-gray-500/30 dark:text-gray-400', text: 'Finalizado' },
      'sin_creditos': { colorClass: 'bg-red-500/20 text-red-600 dark:bg-red-500/30 dark:text-red-400', text: 'Sin Créditos' },
      'rechazado': { colorClass: 'bg-red-500/20 text-red-600 dark:bg-red-500/30 dark:text-red-400', text: 'Rechazado' }
    };

    const badge = badges[estado] || badges.borrador;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.colorClass}`}>
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Mis Campañas Publicitarias
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gestiona tus anuncios y monitorea su rendimiento
        </p>
      </div>

      {/* Stats Cards - Grid dinámico original */}
      <div
        className="gap-6 mb-8"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
        }}
      >
        {/* Balance de Créditos */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Coins size={24} className="text-indigo-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">DegaCoins</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {balance?.balance || 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Créditos disponibles
          </p>
          <button
            onClick={() => setAlertConfig({ isOpen: true, variant: 'info', message: 'Función de compra en desarrollo' })}
            className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Comprar Créditos
          </button>
        </div>

        {/* Campañas Activas */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp size={24} className="text-emerald-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Activas</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {campaigns.filter(c => c.estado === 'activo').length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Campañas en ejecución
          </p>
        </div>

        {/* Total Impresiones */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Eye size={24} className="text-blue-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Impresiones</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {campaigns.reduce((sum, c) => sum + (c.metricas?.impresiones || 0), 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Total de vistas
          </p>
        </div>

        {/* Total Clicks */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <MousePointerClick size={24} className="text-amber-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Clicks</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {campaigns.reduce((sum, c) => sum + (c.metricas?.clicks || 0), 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Total de clicks
          </p>
        </div>
      </div>

      {/* Botón Crear Campaña */}
      <div className="mb-8">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-base font-semibold transition-colors"
        >
          <Plus size={20} />
          Nueva Campaña
        </button>
      </div>

      {/* Lista de Campañas */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Todas las Campañas
          </h2>
        </div>

        {campaigns.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No tienes campañas aún
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Crear Primera Campaña
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Campaña
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Impresiones
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    CTR
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Gastado
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {campaigns.map((campaign) => (
                  <tr key={campaign._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={campaign.imagenUrl}
                          alt={campaign.nombreCliente}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/48'; }}
                        />
                        <div>
                          <p className="text-gray-900 dark:text-white font-semibold text-sm">
                            {campaign.nombreCliente}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">
                            {new Date(campaign.fechaInicio).toLocaleDateString()} - {new Date(campaign.fechaFin).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getEstadoBadge(campaign.estado)}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-900 dark:text-white">
                      {campaign.metricas?.impresiones?.toLocaleString() || 0}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-900 dark:text-white">
                      {campaign.metricas?.clicks?.toLocaleString() || 0}
                    </td>
                    <td className="px-4 py-4 text-center text-gray-900 dark:text-white">
                      {campaign.metricas?.ctr?.toFixed(2) || 0}%
                    </td>
                    <td className="px-4 py-4 text-center text-gray-900 dark:text-white">
                      {campaign.creditosGastados || 0} 💎
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2 justify-end">
                        {(campaign.estado === 'borrador' || campaign.estado === 'pausado' || campaign.estado === 'rechazado') && (
                          <button
                            onClick={() => handleEditCampaign(campaign)}
                            className="p-2 border border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {(campaign.estado === 'activo' || campaign.estado === 'pausado') && (
                          <button
                            onClick={() => handleToggleCampaign(campaign._id)}
                            className="p-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            title={campaign.estado === 'activo' ? 'Pausar' : 'Reanudar'}
                          >
                            {campaign.estado === 'activo' ? <Pause size={16} /> : <Play size={16} />}
                          </button>
                        )}
                        <button
                          onClick={() => setAlertConfig({ isOpen: true, variant: 'info', message: 'Función de estadísticas en desarrollo' })}
                          className="p-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          title="Ver estadísticas"
                        >
                          <BarChart3 size={16} />
                        </button>
                        {campaign.estado === 'borrador' && (
                          <button
                            onClick={() => handleDeleteCampaign(campaign._id)}
                            className="p-2 border border-red-500 dark:border-red-400 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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

      {/* AlertDialog Component */}
      <AlertDialog
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        variant={alertConfig.variant}
        message={alertConfig.message}
      />

      {/* ConfirmDialog Component */}
      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          if (confirmConfig.onConfirm) confirmConfig.onConfirm();
          setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }}
        title={confirmConfig.title}
        message={confirmConfig.message}
        variant="danger"
      />
    </div>
  );
};

export default ClientAdsDashboard;
