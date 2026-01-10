import { useAuth } from '../../context/AuthContext';

/**
 * Hook personalizado para verificar roles y permisos del usuario
 * 
 * @returns {Object} Objeto con funciones de verificación de roles
 */
export const useUserRole = () => {
    const { user } = useAuth();

    /**
     * Verifica si el usuario es Founder
     */
    const isFounder = () => {
        return user?.seguridad?.rolSistema === 'Founder' || user?.email === 'founderdegader@degader.org';
    };

    /**
     * Verifica si el usuario es moderador
     * (rol 'moderador' O permiso moderarContenido)
     */
    const isModerator = () => {
        return (
            user?.seguridad?.rolSistema === 'moderador' ||
            user?.seguridad?.permisos?.moderarContenido === true
        );
    };

    /**
     * Verifica si el usuario es moderador O Founder
     */
    const isTrustAndSafety = () => {
        return isFounder() || isModerator();
    };

    /**
     * Verifica si el usuario es admin
     */
    const isAdmin = () => {
        return user?.seguridad?.rolSistema === 'admin';
    };

    /**
     * Verifica si el usuario tiene un permiso específico
     * @param {string} permission - Nombre del permiso
     */
    const hasPermission = (permission) => {
        return user?.seguridad?.permisos?.[permission] === true;
    };

    /**
     * Obtiene el rol actual del usuario
     */
    const getRole = () => {
        return user?.seguridad?.rolSistema || 'usuario';
    };

    return {
        user,
        isFounder,
        isModerator,
        isTrustAndSafety,
        isAdmin,
        hasPermission,
        getRole,
        // Atajos útiles
        canModerate: isTrustAndSafety(),
        canAccessAdminPanel: isAdmin() || isFounder(),
        roleSistema: getRole()
    };
};

export default useUserRole;
