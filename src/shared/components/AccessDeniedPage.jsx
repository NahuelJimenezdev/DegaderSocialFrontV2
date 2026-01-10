import React, { useEffect } from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sendSecurityAlert } from '../../api/founderService';

export default function AccessDeniedPage() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Enviar alerta silenciosa al servidor
        sendSecurityAlert({
            path: location.pathname,
            timestamp: new Date().toISOString()
        });
    }, [location]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                {/* Icono animado */}
                <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-red-100 dark:bg-red-900/30 rounded-full animate-pulse"></div>
                    <div className="relative flex items-center justify-center w-full h-full bg-red-100 dark:bg-red-900/50 rounded-full">
                        <ShieldAlert size={48} className="text-red-600 dark:text-red-400" />
                    </div>
                </div>

                {/* Textos */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Acceso Restringido
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        No tienes los permisos necesarios para acceder a esta sección. Esta área es exclusiva por motivos de seguridad.
                    </p>
                </div>

                {/* Detalles de seguridad (opcional, para dar look más "pro") */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-left text-sm">
                    <div className="flex justify-between text-gray-500 dark:text-gray-400 mb-1">
                        <span>Código de error:</span>
                        <span className="font-mono">403_FORBIDDEN</span>
                    </div>
                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                        <span>IP Registrada:</span>
                        <span className="font-mono">Monitorizada</span>
                    </div>
                </div>

                {/* Botón de acción */}
                <button
                    onClick={() => navigate('/moderador')}
                    className="group flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-red-600/20 hover:shadow-red-600/40"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Volver al Dashboard
                </button>
            </div>
        </div>
    );
}
