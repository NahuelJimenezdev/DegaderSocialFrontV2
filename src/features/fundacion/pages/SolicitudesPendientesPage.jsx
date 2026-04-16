import React from 'react'
import SolicitudesList from '../components/SolicitudesList'
import { useAuth } from '../../../context/AuthContext';
import { useFundacion } from '../hooks/useFundacion';
import { useNavigate } from 'react-router-dom';
import { Loader2, ChevronLeft, Users } from 'lucide-react';

const SolicitudesPendientesPage = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    // Hook de Fundación
    const {
        loading,
        solicitudesPendientes,
        handleGestionarSolicitud
    } = useFundacion(user, updateUser);
    
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-blue-200 font-medium tracking-wide">Cargando solicitudes...</p>
            </div>
        );
    }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Header con Botón Volver */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate('/fundacion')}
                    className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 transition-all text-gray-600 dark:text-gray-400 active:scale-95"
                >
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Panel de Control Fundación
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Gestiona el personal bajo tu jurisdicción ({user?.fundacion?.nivel?.replace(/_/g, ' ')} - {user?.fundacion?.area})
                    </p>
                </div>
            </div>

            {/* Contador de Usuarios Pendientes */}
            <div className="flex items-center gap-5 py-4 px-7 bg-amber-50 dark:bg-amber-900/20 rounded-[2rem] border border-amber-100 dark:border-amber-800/50 shadow-sm animate-in fade-in zoom-in duration-500">
                <div className="flex items-center justify-center w-14 h-14 bg-amber-100 dark:bg-amber-800/30 rounded-2xl text-amber-600 dark:text-amber-400">
                    <Users size={32} />
                </div>
                <div className="flex flex-col">
                    <span className="text-3xl font-black text-amber-600 dark:text-amber-400 leading-none">
                        {solicitudesPendientes.length}
                    </span>
                    <span className="text-[10px] font-black text-amber-700 dark:text-amber-200 uppercase tracking-[0.1em] mt-1">
                        Usuarios <br /> Pendientes
                    </span>
                </div>
            </div>
        </div>

        <div className='page-container px-0 shadow-none border-none bg-transparent'>
            <SolicitudesList
                solicitudes={solicitudesPendientes}
                onGestionarSolicitud={handleGestionarSolicitud}
            />
        </div>
    </div>
  )
}

export default SolicitudesPendientesPage