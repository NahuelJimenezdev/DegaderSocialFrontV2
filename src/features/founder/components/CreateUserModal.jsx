import React, { useState } from 'react';
import { X } from 'lucide-react';

/**
 * Modal para crear nuevos usuarios con roles específicos
 */
export default function CreateUserModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        rol: 'moderador',
        nombres: { primero: '', segundo: '' },
        apellidos: { primero: '', segundo: '' },
        permisos: {
            moderarContenido: true,
            gestionarUsuarios: true,
            accesoPanelAdmin: true,
            gestionarPublicidad: false,
            gestionarIglesias: false,
            gestionarFundacion: false
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            await onSubmit(formData);
            // Resetear formulario
            setFormData({
                email: '',
                username: '',
                password: '',
                rol: 'moderador',
                nombres: { primero: '', segundo: '' },
                apellidos: { primero: '', segundo: '' },
                permisos: {
                    moderarContenido: true,
                    gestionarUsuarios: true,
                    accesoPanelAdmin: true,
                    gestionarPublicidad: false,
                    gestionarIglesias: false,
                    gestionarFundacion: false
                }
            });
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = (newRole) => {
        setFormData(prev => ({
            ...prev,
            rol: newRole,
            permisos: {
                moderarContenido: newRole === 'moderador' || newRole === 'admin',
                gestionarUsuarios: newRole === 'moderador' || newRole === 'admin',
                accesoPanelAdmin: newRole === 'moderador' || newRole === 'admin',
                gestionarPublicidad: newRole === 'admin',
                gestionarIglesias: newRole === 'admin',
                gestionarFundacion: newRole === 'admin'
            }
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Crear Nuevo Usuario
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="moderador@soporte.degader.org"
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Username *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="moderador1"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Contraseña *
                        </label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Contraseña temporal"
                        />
                    </div>

                    {/* Nombres y Apellidos */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Primer Nombre
                            </label>
                            <input
                                type="text"
                                value={formData.nombres.primero}
                                onChange={(e) => setFormData({ ...formData, nombres: { ...formData.nombres, primero: e.target.value } })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Primer Apellido
                            </label>
                            <input
                                type="text"
                                value={formData.apellidos.primero}
                                onChange={(e) => setFormData({ ...formData, apellidos: { ...formData.apellidos, primero: e.target.value } })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Rol */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Rol *
                        </label>
                        <div className="flex gap-3">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="moderador"
                                    checked={formData.rol === 'moderador'}
                                    onChange={(e) => handleRoleChange(e.target.value)}
                                    className="mr-2"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Moderador</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="admin"
                                    checked={formData.rol === 'admin'}
                                    onChange={(e) => handleRoleChange(e.target.value)}
                                    className="mr-2"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Admin</span>
                            </label>
                        </div>
                    </div>

                    {/* Permisos */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Permisos
                        </label>
                        <div className="space-y-2">
                            {Object.entries(formData.permisos).map(([key, value]) => (
                                <label key={key} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            permisos: { ...formData.permisos, [key]: e.target.checked }
                                        })}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Creando...' : 'Crear Usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
