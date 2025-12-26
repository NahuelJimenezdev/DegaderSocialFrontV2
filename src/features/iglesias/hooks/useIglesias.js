import { useState, useEffect } from 'react';
import { logger } from '../../../shared/utils/logger';
import { useToast } from '../../../shared/components/Toast/ToastProvider';
import iglesiaService from '../../../api/iglesiaService';

/**
 * Custom hook para manejar la lógica de iglesias
 * @param {Object} user - Usuario actual
 * @returns {Object} Estado y funciones para manejar iglesias
 */
export const useIglesias = (user) => {
    const toast = useToast();
    const [iglesias, setIglesias] = useState([]);
    const [busquedaIglesia, setBusquedaIglesia] = useState('');
    const [loadingIglesias, setLoadingIglesias] = useState(false);
    const [filters, setFilters] = useState({ denominacion: '', ubicacion: '' });
    const [sort, setSort] = useState('newest');
    const [viewMode, setViewMode] = useState('grid');
    const [mostrarFormIglesia, setMostrarFormIglesia] = useState(false);
    const [formIglesia, setFormIglesia] = useState({
        nombre: '',
        denominacion: '',
        pais: 'Colombia',
        ciudad: '',
        direccion: ''
    });
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        variant: 'info',
        message: ''
    });

    // Cargar iglesias
    const cargarIglesias = async () => {
        try {
            setLoadingIglesias(true);
            const response = await iglesiaService.getAll({ q: busquedaIglesia });
            const todasIglesias = response.data || [];

            // Filtrar iglesias: si el usuario ya es miembro de una iglesia, solo mostrar esa
            const iglesiaDelUsuario = todasIglesias.find(iglesia => {
                const pastorId = iglesia.pastorPrincipal?._id || iglesia.pastorPrincipal;
                const isPastor = pastorId && user?._id && pastorId.toString() === user._id.toString();

                const isMember = iglesia.miembros?.some(m => {
                    const memberId = m._id || m;
                    return memberId.toString() === user?._id?.toString();
                });

                return isPastor || isMember;
            });

            // Si el usuario ya pertenece a una iglesia, solo mostrar esa
            // Si no pertenece a ninguna, mostrar todas para que pueda unirse
            setIglesias(iglesiaDelUsuario ? [iglesiaDelUsuario] : todasIglesias);
        } catch (error) {
            logger.error('Error cargando iglesias:', error);
            toast.error('Error al cargar las iglesias');
        } finally {
            setLoadingIglesias(false);
        }
    };

    // Filtrar y ordenar iglesias
    const getFilteredIglesias = () => {
        let result = [...iglesias];

        // Filtrar por denominación
        if (filters.denominacion) {
            result = result.filter(i => i.denominacion === filters.denominacion);
        }

        // Filtrar por ubicación (ciudad)
        if (filters.ubicacion) {
            result = result.filter(i => i.ubicacion?.ciudad === filters.ubicacion);
        }

        // Ordenar
        switch (sort) {
            case 'name_asc':
                result.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
            case 'name_desc':
                result.sort((a, b) => b.nombre.localeCompare(a.nombre));
                break;
            case 'members_desc':
                result.sort((a, b) => (b.miembros?.length || 0) - (a.miembros?.length || 0));
                break;
            case 'oldest':
                result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
                break;
            case 'newest':
            default:
                result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                break;
        }

        return result;
    };

    // Crear iglesia
    const handleCrearIglesia = async (e, updateUser) => {
        e.preventDefault();
        try {
            await iglesiaService.create({
                nombre: formIglesia.nombre,
                denominacion: formIglesia.denominacion,
                ubicacion: {
                    pais: formIglesia.pais,
                    ciudad: formIglesia.ciudad,
                    direccion: formIglesia.direccion
                }
            });
            toast.success('¡Iglesia creada exitosamente!');
            setMostrarFormIglesia(false);
            cargarIglesias();

            // Refrescar usuario para ver rol de pastor
            if (updateUser) {
                await updateUser();
            }
        } catch (error) {
            logger.error('Error creando iglesia:', error);
            toast.error('Error al crear la iglesia');
        }
    };

    // Unirse a iglesia
    const handleUnirseIglesia = async (id) => {
        try {
            await iglesiaService.join(id, 'Deseo unirme a esta iglesia');
            setAlertConfig({
                isOpen: true,
                variant: 'success',
                message: 'Solicitud enviada al pastor'
            });
        } catch (error) {
            setAlertConfig({
                isOpen: true,
                variant: 'error',
                message: error.response?.data?.message || 'Error al unirse'
            });
        }
    };

    // Calcular estadísticas
    const stats = {
        churches: iglesias.length,
        members: iglesias.reduce((acc, curr) => acc + (curr.miembros?.length || 0), 0),
        events: iglesias.reduce((acc, curr) => acc + (curr.reuniones?.length || 0), 0)
    };

    return {
        // Estado
        iglesias,
        busquedaIglesia,
        loadingIglesias,
        filters,
        sort,
        viewMode,
        mostrarFormIglesia,
        formIglesia,
        alertConfig,

        // Datos computados
        filteredIglesias: getFilteredIglesias(),
        stats,

        // Setters
        setBusquedaIglesia,
        setFilters,
        setSort,
        setViewMode,
        setMostrarFormIglesia,
        setFormIglesia,
        setAlertConfig,

        // Funciones
        cargarIglesias,
        handleCrearIglesia,
        handleUnirseIglesia
    };
};
