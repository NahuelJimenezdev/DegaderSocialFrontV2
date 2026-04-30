import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Users, Shield, Search, ChevronLeft, Edit2, Trash2 } from 'lucide-react';
import { useFounderUsers } from '../../../shared/hooks/useFounderUsers';
import RoleBadge from '../components/RoleBadge';
import IosModal from '../../../shared/components/IosModal';
import { useToast } from '../../../shared/components/Toast/ToastProvider';
import nivelesPorPais from '../../fundacion/utils/nivelesPorPais';

export default function FounderCountryUsersPage() {
    const { countryName } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    // Normalizar el nombre del país para buscar la terminología
    const countryKey = countryName ? countryName.replace(/\s+/g, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
    const locationLabel = nivelesPorPais[countryKey]?.departamental || 'Departamento / Provincia';
    
    const [filters, setFilters] = useState({
        search: '',
        rol: '',
        estado: '',
        pais: countryName, // Filtro fijo por el país de la URL
        page: 1,
        limit: 20
    });

    const [selectedUser, setSelectedUser] = useState(null);
    const [showResetModal, setShowResetModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    const {
        users,
        geoStats,
        loading,
        error,
        pagination,
        fetchUsers,
        updateRole,
        removeUser,
        resetUserPassword,
        fetchGeoStats
    } = useFounderUsers(filters);

    // Obtener stats específicas de este país desde el array global de geoStats
    const countryStats = useMemo(() => {
        return geoStats.find(s => s.pais === countryName) || {
            pais: countryName,
            total: 0,
            directores: 0,
            secretarios: 0,
            afiliados: 0
        };
    }, [geoStats, countryName]);

    useEffect(() => {
        // Forzamos el país en cada fetch de esta página
        fetchUsers({ ...filters, pais: countryName });
    }, [filters, countryName, fetchUsers]);

    useEffect(() => {
        fetchGeoStats();
    }, [fetchGeoStats]);

    const handleChangeRole = async (userId, newRole) => {
        try {
            await updateRole(userId, { rol: newRole });
            toast.success('Rol actualizado exitosamente');
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
        try {
            await removeUser(userId);
            toast.success('Usuario eliminado exitosamente');
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await resetUserPassword(selectedUser._id, newPassword);
            toast.success('Contraseña actualizada exitosamente');
            setShowResetModal(false);
            setNewPassword('');
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
            {/* Breadcrumbs e Info Superior */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Link to="/founder/users" className="hover:text-blue-600">Gestión de Usuarios</Link>
                        <span>&gt;</span>
                        <span className="font-semibold text-gray-900 dark:text-white">Listado detallado: {countryName}</span>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => navigate('/founder/users')}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Usuarios en {countryName}
                                </h1>
                                <p className="text-sm text-gray-500">Panel administrativo por territorio</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats del País */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
                            <div className="flex items-center gap-2 mb-1 text-gray-500">
                                <Users size={16} />
                                <span className="text-xs font-semibold uppercase tracking-wider">Total Usuarios</span>
                            </div>
                            <p className="text-2xl font-black text-gray-900 dark:text-white">{countryStats.total}</p>
                        </div>
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                            <div className="flex items-center gap-2 mb-1 text-blue-600">
                                <Shield size={16} />
                                <span className="text-xs font-semibold uppercase tracking-wider">Directores</span>
                            </div>
                            <p className="text-2xl font-black text-blue-900 dark:text-blue-300">{countryStats.directores}</p>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/30">
                            <div className="flex items-center gap-2 mb-1 text-green-600">
                                <Shield size={16} />
                                <span className="text-xs font-semibold uppercase tracking-wider">Secretarios</span>
                            </div>
                            <p className="text-2xl font-black text-green-900 dark:text-green-300">{countryStats.secretarios}</p>
                        </div>
                        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-900/30">
                            <div className="flex items-center gap-2 mb-1 text-orange-600">
                                <Users size={16} />
                                <span className="text-xs font-semibold uppercase tracking-wider">Afiliados</span>
                            </div>
                            <p className="text-2xl font-black text-orange-900 dark:text-orange-300">{countryStats.afiliados}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row gap-3 mb-6">
                    <div className="flex-1 relative flex items-center">
                        <Search size={20} className="absolute left-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por email, username o nombre..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    <select
                        value={filters.rol}
                        onChange={(e) => setFilters({ ...filters, rol: e.target.value, page: 1 })}
                        className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="">Todos los roles</option>
                        <option value="moderador">Moderador</option>
                        <option value="admin">Admin</option>
                        <option value="usuario">Usuario</option>
                    </select>
                </div>

                {/* Tabla de Usuarios */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {loading ? (
                        <div className="p-20 text-center text-gray-500">Cargando usuarios de {countryName}...</div>
                    ) : users.length === 0 ? (
                        <div className="p-20 text-center text-gray-500">No se encontraron usuarios en este país</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Usuario</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">{locationLabel}</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Rol</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Estado</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {users.map(user => (
                                        <tr key={user._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">
                                                        {user.username?.[0]?.toUpperCase() || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-white">@{user.username}</p>
                                                        <p className="text-xs text-gray-500">{user.nombres?.primero} {user.apellidos?.primero}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{user.personal?.ubicacion?.estado || 'No especificado'}</span>
                                                    <span className="text-[10px] text-gray-400">{user.personal?.ubicacion?.ciudad}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <RoleBadge rol={user.rol} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded-full ${
                                                    user.seguridad?.estadoCuenta === 'activo'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                    {user.seguridad?.estadoCuenta}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => { setSelectedUser(user); setShowResetModal(true); }}
                                                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user._id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Paginación */}
                    {pagination.totalPages > 1 && (
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/20 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <p className="text-xs text-gray-500">
                                Mostrando <span className="font-bold">{((pagination.currentPage - 1) * pagination.limit) + 1}</span> - <span className="font-bold">{Math.min(pagination.currentPage * pagination.limit, pagination.total)}</span> de <span className="font-bold">{pagination.total}</span> usuarios
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                                    disabled={pagination.currentPage === 1}
                                    className="px-4 py-1.5 text-xs font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-30"
                                >
                                    Anterior
                                </button>
                                <button
                                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    className="px-4 py-1.5 text-xs font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg disabled:opacity-30"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Reset Password */}
            <IosModal
                isOpen={showResetModal}
                onClose={() => setShowResetModal(false)}
                title="Cambiar Contraseña"
            >
                <div>
                    <p className="text-sm text-gray-500 mb-4">
                        Nueva clave para <strong>{selectedUser?.username}</strong>
                    </p>
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <input 
                            type="text" 
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Escribe la nueva clave..."
                            required
                        />
                        <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl">
                            Confirmar Cambio
                        </button>
                    </form>
                </div>
            </IosModal>
        </div>
    );
}
