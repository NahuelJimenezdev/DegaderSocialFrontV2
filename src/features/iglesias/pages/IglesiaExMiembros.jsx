import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import iglesiaService from '../../../api/iglesiaService';
import { getUserAvatar, handleImageError } from '../../../shared/utils/avatarUtils';
import { useAuth } from '../../../context/AuthContext';
import IglesiaSidebar from '../components/IglesiaSidebar';
import { useIglesiaData } from '../hooks/useIglesiaData';
import { getIglesiaMenuItems } from '../utils/menuHelpers';

const IglesiaExMiembros = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [exMiembros, setExMiembros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ Usar datos de iglesia y sidebar
    const { iglesiaData, loading: iglesiaLoading } = useIglesiaData(id);
    const { menuItems, isPastor } = getIglesiaMenuItems(iglesiaData, user);
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Detectar mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const fetchExMiembros = async () => {
            try {
                const response = await iglesiaService.getExMiembros(id);
                if (response.success) {
                    setExMiembros(response.data);
                }
            } catch (err) {
                console.error('Error fetching ex-miembros:', err);
                setError('No tienes permisos para ver esta sección o hubo un error.');
            } finally {
                setLoading(false);
            }
        };

        fetchExMiembros();
    }, [id]);

    const handleSectionChange = (section) => {
        // Cerrar sidebar en móvil al cambiar de sección
        if (isMobile) {
            setSidebarOpen(false);
        }
        // Navegar a la ruta de la iglesia con la sección seleccionada
        navigate(`/Mi_iglesia/${id}`, { state: { section } });
    };

    if (loading || iglesiaLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="material-symbols-outlined animate-spin text-4xl colorMarcaDegader">progress_activity</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">lock</span>
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">Acceso Restringido</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">{error}</p>
                <button
                    onClick={() => navigate(`/Mi_iglesia/${id}`)}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    Volver a la Iglesia
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Mobile Toggle */}
            {isMobile && (
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="fixed top-20 left-4 z-[60] p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                >
                    <span className="material-symbols-outlined text-2xl text-gray-700 dark:text-gray-300">
                        {sidebarOpen ? 'close' : 'menu'}
                    </span>
                </button>
            )}

            {/* Backdrop para móvil */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[140]"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ✅ Sidebar de Iglesia con posicionamiento fijo */}
            <div
                className={`
                    fixed top-[65px] bottom-0 w-[280px] bg-white dark:bg-gray-800 
                    transition-transform duration-300 ease-in-out lg:transition-none
                    ${isMobile
                        ? `right-0 z-[150] sidebar-right-mobile ${sidebarOpen ? 'open' : ''}`
                        : 'left-0 z-40 translate-x-0'}
                `}
            >
                <IglesiaSidebar
                    iglesiaData={iglesiaData}
                    activeSection="ex_miembros"
                    setActiveSection={handleSectionChange}
                    menuItems={menuItems}
                    isMobile={isMobile}
                />
            </div>

            {/* Main Content */}
            <div className="p-4 md:p-6 lg:ml-[280px]">
                {/* Header sin botón atrás - Centrado */}
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Historial de Salidas
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Registro de miembros que han abandonado la congregación
                    </p>
                </div>

                {exMiembros.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 w-full">
                        <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">history_toggle_off</span>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No hay registros de salidas aún.</p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/3">Usuario</th>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/4">Fecha Salida</th>
                                        <th className="py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Motivo</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {exMiembros.map((registro, index) => (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={getUserAvatar(registro.usuario)}
                                                        alt={`${registro.usuario?.nombres?.primero || 'Usuario'} ${registro.usuario?.apellidos?.primero || ''}`}
                                                        className="w-10 h-10 rounded-full object-cover bg-gray-200 dark:bg-gray-700 flex-shrink-0"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = getUserAvatar({ ...registro.usuario, social: { fotoPerfil: '' } });
                                                        }}
                                                    />
                                                    <div className="overflow-hidden">
                                                        <p className="font-semibold text-gray-900 dark:text-white truncate max-w-[180px]">
                                                            {registro.usuario?.nombres?.primero} {registro.usuario?.apellidos?.primero}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                                                            {registro.usuario?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {new Date(registro.fechaSalida).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-500">
                                                        {new Date(registro.fechaSalida).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px] italic" title={registro.motivo}>
                                                        &quot;{registro.motivo}&quot;
                                                    </p>
                                                    <button
                                                        onClick={() => navigate(`/Mi_iglesia/${id}/miembros_salidos/${registro.usuario?._id}/motivo`, { state: { registro } })}
                                                        className="colorMarcaDegader dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium text-xs border border-indigo-200 dark:border-indigo-800 rounded-lg px-2 py-1 transition-colors whitespace-nowrap"
                                                    >
                                                        Ver Detalle
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default IglesiaExMiembros;
