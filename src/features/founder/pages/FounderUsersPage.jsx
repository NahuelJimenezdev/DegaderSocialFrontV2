import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Ban, Search, Edit2, Trash2 } from 'lucide-react';
import { useFounderUsers } from '../../../shared/hooks/useFounderUsers';
import RoleBadge from '../components/RoleBadge';
import CreateUserModal from '../components/CreateUserModal';
import { useToast } from '../../../shared/components/Toast/ToastProvider';

/**
 * Página de gestión de usuarios para Founder
 */
export default function FounderUsersPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        rol: '',
        estado: '',
        page: 1,
        limit: 20
    });

    const {
        users,
        stats,
        loading,
        error,
        pagination,
        fetchUsers,
        createUser,
        updateRole,
        removeUser
    } = useFounderUsers(filters);

    const toast = useToast();

    useEffect(() => {
        fetchUsers(filters);
    }, [filters]);

    const handleCreateUser = async (userData) => {
        try {
            await createUser(userData);
            toast.success('Usuario creado exitosamente');
        } catch (err) {
            toast.error(err.message);
            throw err;
        }
    };

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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <Shield size={24} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Gestión de Usuarios
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Panel exclusivo Founder
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            <UserPlus size={20} />
                            Crear Usuario
                        </button>
                    </div>

                    {/* Stats */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                    <Users size={16} className="text-gray-600 dark:text-gray-400" />
                                    <span className="text-xs text-gray-600 dark:text-gray-400">Total Usuarios</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                            </div>
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                    <Shield size={16} className="text-blue-600 dark:text-blue-400" />
                                    <span className="text-xs text-blue-600 dark:text-blue-400">Moderadores</span>
                                </div>
                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{stats.moderadores}</p>
                            </div>
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                    <Shield size={16} className="text-red-600 dark:text-red-400" />
                                    <span className="text-xs text-red-600 dark:text-red-400">Admins</span>
                                </div>
                                <p className="text-2xl font-bold text-red-900 dark:text-red-300">{stats.admins}</p>
                            </div>
                            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                    <Ban size={16} className="text-orange-600 dark:text-orange-400" />
                                    <span className="text-xs text-orange-600 dark:text-orange-400">Suspendidos</span>
                                </div>
                                <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">{stats.suspendidos}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por email, username o nombre..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                    <select
                        value={filters.rol}
                        onChange={(e) => setFilters({ ...filters, rol: e.target.value, page: 1 })}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">Todos los roles</option>
                        <option value="moderador">Moderador</option>
                        <option value="admin">Admin</option>
                        <option value="usuario">Usuario</option>
                    </select>
                    <select
                        value={filters.estado}
                        onChange={(e) => setFilters({ ...filters, estado: e.target.value, page: 1 })}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">Todos los estados</option>
                        <option value="activo">Activo</option>
                        <option value="suspendido">Suspendido</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="max-w-7xl mx-auto px-4 pb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            Cargando usuarios...
                        </div>
                    ) : error ? (
                        <div className="p-8 text-center text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            No se encontraron usuarios
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Usuario</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Rol</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Estado</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {users.map(user => (
                                        <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                                        {user.username?.[0]?.toUpperCase() || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {user.username}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {user.nombres?.primero} {user.apellidos?.primero}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <RoleBadge rol={user.rol} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.seguridad?.estadoCuenta === 'activo'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}>
                                                    {user.seguridad?.estadoCuenta}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                {user.email !== 'founderdegader@degader.org' && (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <select
                                                            value={user.rol}
                                                            onChange={(e) => handleChangeRole(user._id, e.target.value)}
                                                            className="text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                                        >
                                                            <option value="usuario">Usuario</option>
                                                            <option value="moderador">Moderador</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                        <button
                                                            onClick={() => handleDeleteUser(user._id)}
                                                            disabled={user.seguridad.estadoCuenta === 'eliminado'}
                                                            className="colorMarcaDegader dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 disabled:opacity-30 disabled:cursor-not-allowed"
                                                            title={user.seguridad.estadoCuenta === 'eliminado' ? 'Cuenta eliminada' : 'Editar usuario'}
                                                        >
                                                            <Edit2 className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user._id)}
                                                            disabled={user.seguridad.estadoCuenta === 'eliminado'}
                                                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed"
                                                            title={user.seguridad.estadoCuenta === 'eliminado' ? 'Cuenta ya eliminada' : 'Eliminar usuario'}
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Mostrando {((pagination.currentPage - 1) * pagination.limit) + 1} - {Math.min(pagination.currentPage * pagination.limit, pagination.total)} de {pagination.total}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                                    disabled={pagination.currentPage === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Anterior
                                </button>
                                <button
                                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create User Modal */}
            <CreateUserModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateUser}
            />
        </div>
    );
}
