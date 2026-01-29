import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import iglesiaService from '../../../api/iglesiaService';
import { getAvatarUrl } from '../../../shared/utils/avatarUtils';

const IglesiaExMiembrosContent = ({ iglesiaId }) => {
    const navigate = useNavigate();
    const [exMiembros, setExMiembros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExMiembros = async () => {
            try {
                const response = await iglesiaService.getExMiembros(iglesiaId);
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
    }, [iglesiaId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="material-symbols-outlined animate-spin text-4xl text-indigo-600">progress_activity</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">lock</span>
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">Acceso Restringido</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Historial de Salidas
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Registro de miembros que han abandonado la congregación
                </p>
            </div>

            {exMiembros.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
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
                                                    src={getAvatarUrl(registro.usuario?.social?.fotoPerfil)}
                                                    alt="Avatar"
                                                    className="w-10 h-10 rounded-full object-cover bg-gray-200 dark:bg-gray-700 flex-shrink-0"
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
                                                    onClick={() => navigate(`/iglesias/${iglesiaId}/miembros_salidos/${registro.usuario?._id}/motivo`, { state: { registro } })}
                                                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium text-xs border border-indigo-200 dark:border-indigo-800 rounded-lg px-2 py-1 transition-colors whitespace-nowrap"
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
    );
};

export default IglesiaExMiembrosContent;
