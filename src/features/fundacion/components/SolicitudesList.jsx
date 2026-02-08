import { Users, Check, X } from 'lucide-react';
import { getTerritorioString } from '../../../shared/utils/userUtils';

/**
 * Lista de solicitudes pendientes de aprobación
 */
const SolicitudesList = ({ solicitudes, onGestionarSolicitud }) => {
    if (!solicitudes || solicitudes.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Users className="colorMarcaDegader" />
                    Solicitudes Pendientes (0)
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No hay solicitudes pendientes en este momento.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Users className="colorMarcaDegader" />
                Solicitudes Pendientes ({solicitudes.length})
            </h3>
            <div className="space-y-4">
                {solicitudes.map((solicitud) => (
                    <div
                        key={solicitud._id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {solicitud.nombres.primero} {solicitud.apellidos.primero}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Solicita: <strong>{solicitud.fundacion.cargo}</strong> ({solicitud.fundacion.nivel})
                            </p>
                            <p className="text-xs text-gray-500">
                                Área: {solicitud.fundacion.area}
                                {solicitud.fundacion.subArea && ` • Sub-Área: ${solicitud.fundacion.subArea}`}
                                {solicitud.fundacion.programa && ` • Programa: ${solicitud.fundacion.programa}`}
                                {getTerritorioString(solicitud) && ` • ${getTerritorioString(solicitud)}`}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onGestionarSolicitud(solicitud._id, 'rechazar')}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                                title="Rechazar"
                            >
                                <X size={20} />
                            </button>
                            <button
                                onClick={() => onGestionarSolicitud(solicitud._id, 'aprobar')}
                                className="p-2 text-green-600 hover:bg-green-100 rounded-full"
                                title="Aprobar"
                            >
                                <Check size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SolicitudesList;
