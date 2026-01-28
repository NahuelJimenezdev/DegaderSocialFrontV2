import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Users, X } from 'lucide-react';
import { useMinisterios, MINISTERIOS_DISPONIBLES, CARGOS_MINISTERIO } from '../hooks/useMinisterios';
import { AlertDialog } from '../../../shared/components/AlertDialog';

/**
 * Componente para gestión administrativa de ministerios
 * Solo visible para pastor_principal y adminIglesia
 */
const SeccionAdministrativaMinisterios = ({ usuario, iglesiaId, currentUser }) => {
    const {
        ministerios,
        loading,
        error,
        agregarMinisterio,
        actualizarMinisterio,
        eliminarMinisterio
    } = useMinisterios(usuario._id);

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [ministerioSeleccionado, setMinisterioSeleccionado] = useState('');
    const [cargoSeleccionado, setCargoSeleccionado] = useState('miembro');
    const [editandoMinisterio, setEditandoMinisterio] = useState(null);
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, variant: 'info', message: '' });

    // Verificar permisos
    const tienePermisos = () => {
        if (!currentUser.eclesiastico?.iglesia) {
            return false;
        }

        const esPastor = currentUser.eclesiastico.iglesia.toString() === iglesiaId &&
            currentUser.eclesiastico?.rolPrincipal === 'pastor_principal';
        const esAdmin = currentUser.eclesiastico.iglesia.toString() === iglesiaId &&
            currentUser.eclesiastico?.rolPrincipal === 'adminIglesia';

        return esPastor || esAdmin;
    };

    const permisos = tienePermisos();

    if (!permisos) {
        return null; // No renderizar nada si no tiene permisos
    }

    // Obtener ministerios disponibles (que no tiene el usuario)
    const ministeriosDisponibles = MINISTERIOS_DISPONIBLES.filter(
        m => !ministerios.some(userMin => userMin.nombre === m.value)
    );

    // Manejar agregar ministerio
    const handleAgregarMinisterio = async (e) => {
        e.preventDefault();

        if (!ministerioSeleccionado || !cargoSeleccionado) {
            setAlertConfig({ isOpen: true, variant: 'warning', message: 'Selecciona un ministerio y cargo' });
            return;
        }

        const result = await agregarMinisterio(ministerioSeleccionado, cargoSeleccionado, iglesiaId);

        if (result.success) {
            setAlertConfig({ isOpen: true, variant: 'success', message: 'Ministerio asignado exitosamente' });
            setMostrarFormulario(false);
            setMinisterioSeleccionado('');
            setCargoSeleccionado('miembro');
        } else {
            setAlertConfig({ isOpen: true, variant: 'error', message: result.error || 'Error al asignar ministerio' });
        }
    };

    // Manejar actualizar cargo
    const handleActualizarCargo = async (ministerioId, nuevoCargo) => {
        const result = await actualizarMinisterio(ministerioId, nuevoCargo);

        if (result.success) {
            setAlertConfig({ isOpen: true, variant: 'success', message: 'Cargo actualizado exitosamente' });
            setEditandoMinisterio(null);
        } else {
            setAlertConfig({ isOpen: true, variant: 'error', message: result.error || 'Error al actualizar cargo' });
        }
    };

    // Manejar eliminar ministerio
    const handleEliminarMinisterio = async (ministerioId, nombreMinisterio) => {
        if (!confirm(`¿Estás seguro de remover a este usuario del ministerio de ${nombreMinisterio}?`)) {
            return;
        }

        const result = await eliminarMinisterio(ministerioId);

        if (result.success) {
            setAlertConfig({ isOpen: true, variant: 'success', message: 'Ministerio removido exitosamente' });
        } else {
            setAlertConfig({ isOpen: true, variant: 'error', message: result.error || 'Error al remover ministerio' });
        }
    };

    // Obtener label de ministerio
    const getMinisterioLabel = (value) => {
        return MINISTERIOS_DISPONIBLES.find(m => m.value === value)?.label || value;
    };

    // Obtener label de cargo
    const getCargoLabel = (value) => {
        return CARGOS_MINISTERIO.find(c => c.value === value)?.label || value;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg">
                        <Users className="text-purple-500 w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Administración de Ministerios
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Solo visible para pastores y administradores
                        </p>
                    </div>
                </div>

                {!mostrarFormulario && ministeriosDisponibles.length > 0 && (
                    <button
                        onClick={() => setMostrarFormulario(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                    >
                        <Plus size={18} />
                        Agregar Ministerio
                    </button>
                )}
            </div>

            {/* Formulario para agregar ministerio */}
            {mostrarFormulario && (
                <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-md font-medium text-gray-900 dark:text-white">
                            Nuevo Ministerio
                        </h3>
                        <button
                            onClick={() => {
                                setMostrarFormulario(false);
                                setMinisterioSeleccionado('');
                                setCargoSeleccionado('miembro');
                            }}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleAgregarMinisterio} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Ministerio
                            </label>
                            <select
                                value={ministerioSeleccionado}
                                onChange={(e) => setMinisterioSeleccionado(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                required
                            >
                                <option value="">Selecciona un ministerio...</option>
                                {ministeriosDisponibles.map(m => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Cargo
                            </label>
                            <select
                                value={cargoSeleccionado}
                                onChange={(e) => setCargoSeleccionado(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                required
                            >
                                {CARGOS_MINISTERIO.map(c => (
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {loading ? 'Asignando...' : 'Asignar Ministerio'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setMostrarFormulario(false);
                                    setMinisterioSeleccionado('');
                                    setCargoSeleccionado('miembro');
                                }}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lista de ministerios actuales */}
            <div className="space-y-3">
                {ministerios.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Este usuario no tiene ministerios asignados</p>
                    </div>
                ) : (
                    ministerios.filter(m => m.activo).map((ministerio) => (
                        <div
                            key={ministerio._id}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                        >
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                    {getMinisterioLabel(ministerio.nombre)}
                                </h4>

                                {editandoMinisterio === ministerio._id ? (
                                    <div className="mt-2">
                                        <select
                                            defaultValue={ministerio.cargo}
                                            onChange={(e) => handleActualizarCargo(ministerio._id, e.target.value)}
                                            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        >
                                            {CARGOS_MINISTERIO.map(c => (
                                                <option key={c.value} value={c.value}>{c.label}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => setEditandoMinisterio(null)}
                                            className="ml-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Cargo: {getCargoLabel(ministerio.cargo)}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setEditandoMinisterio(editandoMinisterio === ministerio._id ? null : ministerio._id)}
                                    className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    title="Editar cargo"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleEliminarMinisterio(ministerio._id, ministerio.nombre)}
                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Remover ministerio"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            <AlertDialog
                isOpen={alertConfig.isOpen}
                onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
                variant={alertConfig.variant}
                message={alertConfig.message}
            />
        </div>
    );
};

export default SeccionAdministrativaMinisterios;
