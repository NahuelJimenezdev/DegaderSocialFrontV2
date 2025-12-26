import { useState, useEffect } from 'react';
import fundacionService from '../../../api/fundacionService';
import logger from '../../../shared/utils/logger';

const useFounderMonitoring = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        pages: 1,
        limit: 20
    });
    const [filters, setFilters] = useState({
        estado: '',
        nivel: '',
        pais: '',
        area: ''
    });

    // Cargar solicitudes
    const cargarSolicitudes = async (page = 1) => {
        setLoading(true);
        try {
            const response = await fundacionService.getAllSolicitudes({
                ...filters,
                page,
                limit: pagination.limit
            });

            if (response.success) {
                setSolicitudes(response.data.solicitudes);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            logger.error('Error cargando solicitudes:', error);
        } finally {
            setLoading(false);
        }
    };

    // Aplicar filtros
    const aplicarFiltros = (nuevosFiltros) => {
        setFilters(nuevosFiltros);
        setPagination(prev => ({ ...prev, page: 1 })); // Reset a página 1
    };

    // Limpiar filtros
    const limpiarFiltros = () => {
        setFilters({
            estado: '',
            nivel: '',
            pais: '',
            area: ''
        });
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    // Cambiar página
    const cambiarPagina = (nuevaPagina) => {
        setPagination(prev => ({ ...prev, page: nuevaPagina }));
    };

    // Cargar solicitudes cuando cambian filtros o página
    useEffect(() => {
        cargarSolicitudes(pagination.page);
    }, [filters, pagination.page]);

    // 📡 Escuchar actualizaciones en tiempo real de solicitudes
    useEffect(() => {
        const socket = window.socket;
        if (!socket) return;

        const handleSolicitudActualizada = (data) => {
            logger.log('📡 Solicitud actualizada en tiempo real (Monitoreo):', data);

            // Actualizar lista de solicitudes
            setSolicitudes(prev => {
                const index = prev.findIndex(s => s._id === data.userId);

                if (index !== -1) {
                    // Actualizar solicitud existente
                    const updated = [...prev];
                    updated[index] = {
                        ...updated[index],
                        fundacion: {
                            ...updated[index].fundacion,
                            ...data.solicitud.fundacion
                        }
                    };
                    return updated;
                }

                return prev;
            });

            // Recargar para mantener sincronizado
            cargarSolicitudes(pagination.page);
        };

        socket.on('fundacion:solicitudActualizada', handleSolicitudActualizada);

        return () => {
            socket.off('fundacion:solicitudActualizada', handleSolicitudActualizada);
        };
    }, [pagination.page]);

    return {
        solicitudes,
        loading,
        pagination,
        filters,
        aplicarFiltros,
        limpiarFiltros,
        cambiarPagina,
        recargar: () => cargarSolicitudes(pagination.page)
    };
};

export default useFounderMonitoring;
