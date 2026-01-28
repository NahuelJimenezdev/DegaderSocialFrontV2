import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getAvatarUrl } from '../../../shared/utils/avatarUtils';

const IglesiaExMiembroDetalle = () => {
    const { id } = useParams(); // ID iglesia
    const navigate = useNavigate();
    const location = useLocation();
    const [registro, setRegistro] = useState(null);

    useEffect(() => {
        // Intentar obtener datos del state (navegación desde lista)
        if (location.state?.registro) {
            setRegistro(location.state.registro);
        } else {
            // Si no hay state (navegación directa), redirigir a la lista
            // Idealmente aquí se haría otro fetch si se quisiera soportar acceso directo por URL sin state
            navigate(`/iglesias/${id}/miembros_salidos`);
        }
    }, [location, id, navigate]);

    if (!registro) return null;

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-6 min-h-screen flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 w-full overflow-hidden">
                {/* Header con gradiente suave */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(`/iglesias/${id}/miembros_salidos`)}
                            className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Detalle de Salida</h2>
                    </div>
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold rounded-full uppercase tracking-wider">
                        Ex-Miembro
                    </span>
                </div>

                <div className="p-8">
                    {/* Perfil del Usuario */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-purple-500 mb-4 shadow-lg">
                            <img
                                src={getAvatarUrl(registro.usuario?.social?.fotoPerfil)}
                                alt="Avatar"
                                className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800 bg-white"
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                            {registro.usuario?.nombres?.primero} {registro.usuario?.apellidos?.primero}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {registro.usuario?.email}
                        </p>
                        <div className="flex items-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 px-4 py-2 rounded-full border border-gray-100 dark:border-gray-700">
                            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                            Salió el {new Date(registro.fechaSalida).toLocaleDateString()} a las {new Date(registro.fechaSalida).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Motivo de Salida */}
                        <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-xl p-6 border border-indigo-100 dark:border-indigo-900/30 relative">
                            <span className="absolute -top-3 left-6 inline-block px-2 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                                Motivo Registrado
                            </span>
                            <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed italic font-medium">
                                "{registro.motivo}"
                            </p>
                        </div>

                        {/* Contexto Adicional */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Rol al salir</p>
                                <p className="text-gray-900 dark:text-white font-medium capitalize flex items-center gap-2">
                                    <span className="material-symbols-outlined text-indigo-500 text-sm">badge</span>
                                    {registro.rolAlSalir || 'Miembro'}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Tiempo en iglesia</p>
                                <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                                    <span className="material-symbols-outlined text-green-500 text-sm">timelapse</span>
                                    {registro.tiempoMembresia || 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Historial de Roles */}
                        {registro.historialRoles && registro.historialRoles.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                                    Trayectoria Eclesiástica
                                </h3>
                                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                    {registro.historialRoles.map((rol, idx) => (
                                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 dark:bg-gray-800 dark:border-gray-700">
                                                <span className="material-symbols-outlined text-sm text-indigo-500">
                                                    {idx === 0 ? 'verified' : 'history_edu'}
                                                </span>
                                            </div>
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                                                <div className="flex items-center justify-between space-x-2 mb-1">
                                                    <div className="font-bold text-gray-900 dark:text-white capitalize">
                                                        {rol.rol}
                                                    </div>
                                                    <time className="font-caveat font-medium text-indigo-500">
                                                        {new Date(rol.fechaInicio).toLocaleDateString()}
                                                    </time>
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {rol.fechaFin ? `Hasta ${new Date(rol.fechaFin).toLocaleDateString()}` : 'Rol Activo al Salir'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IglesiaExMiembroDetalle;
