import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Heart, ShieldCheck, ArrowRight } from 'lucide-react';
import { useFundacion } from '../hooks/useFundacion';
import DocumentCards from '../components/DocumentCards';
import SolicitudesList from '../components/SolicitudesList';
import '../../../shared/styles/headers.style.css';

export default function FundacionPage() {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    // Hook de Fundación
    const {
        loading,
        solicitudesPendientes,
        handleGestionarSolicitud
    } = useFundacion(user, updateUser);

    // Condicion para ver panel admin: Aceptado + Posee cargo (Director, Coordinador, etc.)
    const canSeeAdminPanel = user?.fundacion?.estadoAprobacion === 'aprobado' && 
        (user?.fundacion?.cargo?.includes('Director') || 
         user?.fundacion?.cargo?.includes('Coordinador') || 
         user?.seguridad?.rolSistema === 'Founder');

    return (
        <div className="page-container max-w-7xl mx-auto px-4 py-8">
            <div className="mb-mobile-30">
                {/* Header Mejorado */}
                <div className="flex items-start gap-4 mb-10">
                    <div className="flex-shrink-0 bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg rounded-xl w-12 h-12 flex items-center justify-center mt-1">
                        <Heart className="text-white" size={24} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">
                            Fundación Humanitaria Internacional Sol y Luna
                        </h1>
                        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mt-1">
                            Transformando vidas a través del amor y el servicio.
                        </p>
                    </div>
                </div>

                {/* Saludo Bienvenida */}
                <div className="mb-10 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-blue-900 dark:text-blue-100 mb-3">
                            Bienvenido, {user?.nombres?.primero} {user?.apellidos?.primero}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl">
                            Antes de formar parte de la Fundación Humanitaria Internacional Sol y Luna, debes completar los siguientes documentos obligatorios.
                        </p>
                    </div>
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-50 to-transparent dark:from-blue-900/10 dark:to-transparent pointer-events-none hidden md:block"></div>
                </div>

                {/* Panel Administrative Access (Director Feature) */}
                {canSeeAdminPanel && (
                    <div className="mb-10 p-6 bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 transition-transform hover:scale-[1.01]">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Panel de Control Administrativo</h3>
                                <p className="text-white/80 font-medium">Gestiona los usuarios y documentación bajo tu jurisdicción.</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate('/fundacion/admin')}
                            className="px-8 py-3 bg-white text-indigo-700 font-bold rounded-xl hover:bg-gray-100 transition flex items-center gap-2 shadow-md active:scale-95"
                        >
                            Acceder al Panel
                            <ArrowRight size={20} />
                        </button>
                    </div>
                )}

                {/* Sección de Documentos */}
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                    Documentación Requerida
                </h3>
                
                <DocumentCards 
                    user={user} 
                    onNavigate={(path, options) => navigate(path, options)} 
                />

                {/* Panel de Aprobaciones (Solo si aplica) */}
                {(solicitudesPendientes.length > 0) && (
                    <div className="mt-12">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
                            Solicitudes Pendientes de Revisión
                        </h3>
                        <SolicitudesList
                            solicitudes={solicitudesPendientes}
                            onGestionarSolicitud={handleGestionarSolicitud}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
