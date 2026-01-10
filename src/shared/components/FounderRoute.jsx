import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import AccessDeniedPage from './AccessDeniedPage';

/**
 * Ruta protegida solo para usuarios Founder
 */
export default function FounderRoute({ children }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Verificar si es Founder por email o por rol del sistema
    const isFounder =
        user?.email === 'founderdegader@degader.org' ||
        user?.seguridad?.rolSistema === 'Founder';

    if (!isFounder) {
        return <AccessDeniedPage />;
    }

    return children;
}
