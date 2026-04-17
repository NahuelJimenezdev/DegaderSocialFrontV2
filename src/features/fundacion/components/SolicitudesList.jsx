import { Users, Check, X, Clock } from 'lucide-react';
import { getTerritorioString } from '../../../shared/utils/userUtils';
import { getUserAvatar, handleImageError } from '../../../shared/utils/avatarUtils';

/**
 * Formatea una fecha en formato "HH:mm DD/MM/YY"
 */
const formatFechaSolicitud = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        
        return `${hours}:${minutes} ${day}/${month}/${year}`;
    } catch (e) {
        return '';
    }
};

/**
 * Formatea la información de fundación de un usuario para mostrar en etiquetas
 */
const formatInfoFundacion = (f) => {
    if (!f) return '';
    const partes = [
        f.cargo,
        f.area && `en la ${f.area}`,
        f.subArea && `de la ${f.subArea}`,
        f.programa && `del ${f.programa}`,
        f.nivel && `a nivel ${f.nivel}`,
        f.territorio?.pais && `en el país ${f.territorio.pais}`
    ];
    const info = partes.filter(Boolean).join(' ');
    return info ? `(${info})` : '';
};

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
                {solicitudes.map((solicitud) => {
                    const f = solicitud.fundacion;

                    const nombreReferente = f.referenteId?.nombres
                        ? `${f.referenteId.nombres.primero} ${f.referenteId.apellidos?.primero || ''} ${formatInfoFundacion(f.referenteId.fundacion)}`.trim()
                        : f.referenteId || 'su referente';

                    const textoAfiliado = `es afiliado de ${nombreReferente}`;

                    const textoNormal = [
                        f.cargo,
                        f.area && `en la ${f.area}`,
                        f.subArea && `de la ${f.subArea}`,
                        f.programa && `del ${f.programa}`,
                        f.nivel && `a nivel ${f.nivel}`,
                        f.territorio?.pais && `en el país ${f.territorio.pais}`
                    ]
                        .filter(Boolean)
                        .join(' ');

                    return (
                        <div
                            key={solicitud._id}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                            <div className="flex-1">
                                {/* FILA SUPERIOR: Avatar y Nombre */}
                                <div className="flex items-center gap-3 mb-2">
                                    <img 
                                        src={getUserAvatar(solicitud)} 
                                        alt={`${solicitud.nombres.primero} ${solicitud.apellidos.primero}`}
                                        className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600 shadow-sm shrink-0"
                                        onError={handleImageError}
                                    />
                                    <p className="font-semibold text-gray-900 dark:text-white uppercase text-lg">
                                        {solicitud.nombres.primero} {solicitud.apellidos.primero}
                                    </p>
                                </div>
                                
                                {/* RESTO DE INFORMACIÓN DEBAJO */}
                                <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1.5 font-medium">
                                    <Clock size={12} className="text-amber-500" />
                                    {formatFechaSolicitud(solicitud.fundacion?.fechaSolicitud || solicitud.fundacion?.fechaIngreso || solicitud.createdAt)}
                                </p>

                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-3">
                                    Solicita: {f.nivel === 'afiliado' ? textoAfiliado : textoNormal}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700/50 mr-4">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">Área:</span> {solicitud.fundacion.area || (['Director General (Pastor)', 'Director General', 'Sub-Director General'].includes(solicitud.fundacion.cargo) ? 'Dirección General' : 'N/A')}
                                    </p>
                                    {solicitud.fundacion.subArea && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold text-gray-700 dark:text-gray-300">Sub-Área:</span> {solicitud.fundacion.subArea}
                                        </p>
                                    )}
                                    {solicitud.fundacion.programa && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold text-gray-700 dark:text-gray-300">Proyecto:</span> {solicitud.fundacion.programa}
                                        </p>
                                    )}
                                    {solicitud.fundacion.territorio?.pais && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold text-gray-700 dark:text-gray-300">País:</span> {solicitud.fundacion.territorio.pais}
                                        </p>
                                    )}
                                    {solicitud.fundacion.territorio?.departamento && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold text-gray-700 dark:text-gray-300">Departamento:</span> {solicitud.fundacion.territorio.departamento}
                                        </p>
                                    )}
                                    {solicitud.fundacion?.nivel && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold text-gray-700 dark:text-gray-300">Nivel:</span> <span className="capitalize">{solicitud.fundacion.nivel}</span>
                                        </p>
                                    )}
                                    {getTerritorioString(solicitud) && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate pr-2">
                                            <span className="font-semibold text-gray-700 dark:text-gray-300">Territorio:</span> {getTerritorioString(solicitud)}
                                        </p>
                                    )}
                                </div>
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
                    );
                })}
            </div>
        </div>
    );
};

export default SolicitudesList;
