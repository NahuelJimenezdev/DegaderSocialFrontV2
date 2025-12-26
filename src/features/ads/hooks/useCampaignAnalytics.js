import { useState, useEffect } from 'react';
import { logger } from '../../../shared/utils/logger';
import adService from '../../../api/adService';

/**
 * Custom hook para manejar datos de analíticas de campañas
 * @param {string} campaignId - ID de la campaña
 * @param {Object} dateRange - Rango de fechas para filtrar
 * @returns {Object} Estado y datos de analíticas
 */
export const useCampaignAnalytics = (campaignId, dateRange) => {
    const [loading, setLoading] = useState(true);
    const [campaign, setCampaign] = useState(null);
    const [stats, setStats] = useState(null);
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        variant: 'info',
        message: ''
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
            logger.log('📊 Analytics data:', data);

            setCampaign(data.campaign || data.ad);
            setStats(data);
        } catch (error) {
            logger.error('Error fetching analytics:', error);
            setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al cargar estadísticas' });
        } finally {
            setLoading(false);
        }
    };

    // Calculate metrics
    const metrics = stats?.metrics || {
        totalImpressions: campaign?.metricas?.impresiones || 0,
        totalClicks: campaign?.metricas?.clicks || 0,
        ctr: campaign?.metricas?.ctr || 0,
        creditsSpent: campaign?.creditosGastados || 0
    };

    // Prepare chart data
    const trendsData = stats?.trends?.daily || [];
    const deviceData = stats?.devices ? [
        { name: 'Desktop', value: stats.devices.desktop || 0, color: '#6366f1' },
        { name: 'Mobile', value: stats.devices.mobile || 0, color: '#10b981' },
        { name: 'Tablet', value: stats.devices.tablet || 0, color: '#f59e0b' }
    ].filter(d => d.value > 0) : [];

    const browserData = stats?.browsers ? Object.entries(stats.browsers).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value
    })) : [];

    return {
        loading,
        campaign,
        stats,
        metrics,
        trendsData,
        deviceData,
        browserData,
        alertConfig,
        setAlertConfig,
        refetch: fetchAnalytics
    };
};
