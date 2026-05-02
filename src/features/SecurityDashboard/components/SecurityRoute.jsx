import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '../../../shared/hooks/useUserRole';

/**
 * Protege rutas de seguridad (Security Dashboard)
 * Permite acceso a Founder, o a Admin/Moderador que tengan el permiso explícito `security_dashboard_view`
 */
const SecurityRoute = ({ children }) => {
    const { user, isFounder, hasPermission } = useUserRole();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const canView = isFounder() || hasPermission('security_dashboard_view');

    if (!canView) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default SecurityRoute;
