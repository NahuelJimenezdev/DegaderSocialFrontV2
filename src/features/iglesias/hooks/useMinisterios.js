import { useState, useEffect } from 'react';
import ministerioService from '../../../api/ministerioService';
import { logger } from '../../../shared/utils/logger';

// Constantes de ministerios (debe coincidir con el backend)
export const MINISTERIOS_DISPONIBLES = [
    { value: 'musica', label: 'Música' },
    { value: 'caballeros', label: 'Caballeros' },
    { value: 'damas', label: 'Damas' },
    { value: 'escuela_dominical', label: 'Escuela Dominical' },
    { value: 'evangelismo', label: 'Evangelismo' },
    { value: 'limpieza', label: 'Limpieza' },
    { value: 'cocina', label: 'Cocina' },
    { value: 'medios', label: 'Medios' },
    { value: 'juventud', label: 'Juventud' },
    { value: 'intercesion', label: 'Intercesión' },
    { value: 'consejeria', label: 'Consejería' },
    { value: 'visitacion', label: 'Visitación' },
    { value: 'seguridad', label: 'Seguridad' },
    { value: 'protocolo', label: 'Protocolo' }
];

export const CARGOS_MINISTERIO = [
    { value: 'lider', label: 'Líder' },
    { value: 'sublider', label: 'Sublíder' },
    { value: 'miembro', label: 'Miembro' }
];

/**
 * Custom hook para gestión de ministerios
 * @param {string} usuarioId - ID del usuario cuyos ministerios se gestionan
 */
export const useMinisterios = (usuarioId) => {
    const [ministerios, setMinisterios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cargar ministerios del usuario
    const cargarMinisterios = async () => {
        if (!usuarioId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await ministerioService.obtenerMinisteriosUsuario(usuarioId);

            if (response.success) {
                setMinisterios(response.data?.usuario?.ministerios || []);
            }
        } catch (err) {
            logger.error('Error al cargar ministerios:', err);
            setError(err.response?.data?.message || 'Error al cargar ministerios');
        } finally {
            setLoading(false);
        }
    };

    // Asignar ministerio
    const agregarMinisterio = async (ministerio, cargo, iglesiaId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await ministerioService.asignarMinisterio({
                usuarioId,
                ministerio,
                cargo,
                iglesiaId
            });

            if (response.success) {
                setMinisterios(response.data?.usuario?.ministerios || []);
                return { success: true };
            }
        } catch (err) {
            logger.error('Error al agregar ministerio:', err);
            const errorMsg = err.response?.data?.message || 'Error al agregar ministerio';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    // Actualizar cargo de ministerio
    const actualizarMinisterio = async (ministerioId, cargo) => {
        try {
            setLoading(true);
            setError(null);

            const response = await ministerioService.actualizarMinisterio(ministerioId, {
                usuarioId,
                cargo
            });

            if (response.success) {
                setMinisterios(response.data?.usuario?.ministerios || []);
                return { success: true };
            }
        } catch (err) {
            logger.error('Error al actualizar ministerio:', err);
            const errorMsg = err.response?.data?.message || 'Error al actualizar ministerio';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    // Eliminar ministerio
    const eliminarMinisterio = async (ministerioId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await ministerioService.removerMinisterio(ministerioId, usuarioId);

            if (response.success) {
                setMinisterios(response.data?.usuario?.ministerios || []);
                return { success: true };
            }
        } catch (err) {
            logger.error('Error al eliminar ministerio:', err);
            const errorMsg = err.response?.data?.message || 'Error al eliminar ministerio';
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    // Cargar ministerios al montar el componente
    useEffect(() => {
        cargarMinisterios();
    }, [usuarioId]);

    return {
        ministerios,
        loading,
        error,
        cargarMinisterios,
        agregarMinisterio,
        actualizarMinisterio,
        eliminarMinisterio
    };
};
