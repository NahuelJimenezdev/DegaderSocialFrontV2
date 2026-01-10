import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../api/authService';
import { logger } from '../utils/logger';

/**
 * Hook para verificar si el usuario está suspendido
 * y obtener información de la suspensión
 */
export function useSuspensionCheck() {
    const [suspended, setSuspended] = useState(false);
    const [suspensionInfo, setSuspensionInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const checkSuspension = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            // Verificar primero en el objeto user local
            if (user.seguridad?.estadoCuenta === 'suspendido' || user.seguridad?.estadoCuenta === 'inactivo') {
                try {
                    // Fetch información completa de suspensión
                    const response = await authService.getSuspensionInfo();

                    if (response.data.suspended) {
                        setSuspended(true);
                        setSuspensionInfo(response.data);
                        logger.log('⚠️ Usuario suspendido detectado:', response.data);
                    }
                } catch (error) {
                    logger.error('Error al obtener info de suspensión:', error);
                    // Asumir suspendido si hay error accediendo al endpoint
                    setSuspended(true);
                    setSuspensionInfo({
                        suspended: true,
                        estado: user.seguridad.estadoCuenta,
                        isPermanente: true // Asumir permanente si no podemos obtener info
                    });
                }
            }

            setLoading(false);
        };

        checkSuspension();
    }, [user]);

    return { suspended, suspensionInfo, loading };
}
