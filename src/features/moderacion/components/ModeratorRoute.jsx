import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '../../shared/hooks/useUserRole';

/**
 * Componente para proteger rutas que requieren rol de moderador
 * Solo permite acceso a usuarios con rol de moderador o Founder
 */
const ModeratorRoute = ({ children }) => {
    const { canModerate, user } = useUserRole();

    // Si no hay usuario autenticado, redirigir al login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Si el usuario no tiene permisos de moderación, redirigir al inicio
    if (!canModerate) {
        return <Navigate to="/" replace />;
    }

    // Si tiene permisos, mostrar el contenido
    return children;
};

export default ModeratorRoute;
