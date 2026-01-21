import { useState } from 'react';
import { UserX, Calendar, AlertTriangle } from 'lucide-react';
import { useSuspendedUsers } from '../../../shared/hooks/useSuspendedUsers';
import LiftSuspensionModal from '../components/LiftSuspensionModal';

export default function SuspendedUsersPage() {
    const { users, loading, liftSuspension } = useSuspendedUsers();
    const [selectedUser, setSelectedUser] = useState(null);

    const calcularDiasRestantes = (fechaFin) => {
        if (!fechaFin) return null;
        const diff = new Date(fechaFin) - new Date();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    if (loading) {
        return (
            <div className="page-container">
                <p className="text-gray-600 dark:text-gray-400">Cargando usuarios suspendidos...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="flex items-center gap-3 mb-6">
                <UserX className="w-6 h-6 text-red-500" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Usuarios Suspendidos
                </h1>
                <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 
                       rounded-full text-sm font-medium">
                    {users.length}
                </span>
            </div>

            {users.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-600 dark:text-gray-400">No hay usuarios suspendidos</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {users.map((user) => {
                        // Helpers de visualización (seguros contra null/undefined)
                        const nombre = user.nombreCompleto ||
                            (user.nombres?.primero && user.apellidos?.primero ? `${user.nombres.primero} ${user.apellidos.primero}` : 'Usuario');

                        const avatar = user.social?.fotoPerfil || user.avatar;

                        // Lógica de fechas (Fallback para suspensiones antiguas usando updatedAt)
                        const fechaInicio = user.seguridad?.fechaSuspension || user.updatedAt;
                        const fechaFin = user.seguridad?.suspensionFin; // Nombre corregido según modelo

                        const diasRestantes = calcularDiasRestantes(fechaFin);

                        // Validación de fecha inicio
                        const fechaInicioObj = fechaInicio ? new Date(fechaInicio) : null;
                        const esFechaValida = fechaInicioObj && !isNaN(fechaInicioObj.getTime());

                        const diasTranscurridos = esFechaValida
                            ? Math.floor((new Date() - fechaInicioObj) / (1000 * 60 * 60 * 24))
                            : 0;

                        return (
                            <div
                                key={user._id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        {/* Avatar Logic */}
                                        {avatar ? (
                                            <img src={avatar} alt={nombre} className="w-12 h-12 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                                <span className="text-lg font-bold text-gray-600 dark:text-gray-300">{nombre[0]?.toUpperCase()}</span>
                                            </div>
                                        )}

                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white">{nombre}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>

                                            <div className="mt-3 space-y-1 text-sm">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>
                                                        Suspendido: {esFechaValida ? fechaInicioObj.toLocaleDateString() : 'Fecha desconocida'}
                                                        {esFechaValida && <span className="font-semibold text-gray-800 dark:text-gray-200 ml-1">({diasTranscurridos} días transcurridos)</span>}
                                                    </span>
                                                </div>

                                                {diasRestantes !== null ? (
                                                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                                                        <AlertTriangle className="w-4 h-4" />
                                                        <span>Días restantes: {diasRestantes > 0 ? diasRestantes : 'Finaliza hoy'}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                                        <AlertTriangle className="w-4 h-4" />
                                                        <span className="font-medium">Suspensión permanente</span>
                                                    </div>
                                                )}

                                                {user.seguridad?.motivoSuspension && (
                                                    <p className="text-gray-700 dark:text-gray-300 mt-2">
                                                        <span className="font-medium">Motivo:</span> {user.seguridad.motivoSuspension}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedUser(user)}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium 
                             rounded-lg transition-colors"
                                    >
                                        Levantar Suspensión
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedUser && (
                <LiftSuspensionModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onConfirm={liftSuspension}
                />
            )}
        </div>
    );
}
