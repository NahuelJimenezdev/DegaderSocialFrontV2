import React from 'react';
import { Search, Loader, User } from 'lucide-react';
import { getUserAvatar, handleImageError } from '../../../../shared/utils/avatarUtils';

/**
 * GlobalSearch - Búsqueda global de usuarios para iniciar conversaciones
 * @param {string} busquedaGlobal - Valor actual de la búsqueda
 * @param {Function} handleBusquedaGlobal - Handler para cambios en el input
 * @param {Array} resultadosBusqueda - Array de usuarios encontrados
 * @param {boolean} cargandoBusqueda - Estado de carga
 * @param {Function} seleccionarUsuarioBusqueda - Handler para seleccionar un usuario
 */
const GlobalSearch = ({
    busquedaGlobal,
    handleBusquedaGlobal,
    resultadosBusqueda,
    cargandoBusqueda,
    seleccionarUsuarioBusqueda
}) => {
    return (
        <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Buscar usuario para chatear:
            </p>
            <div className="relative">
                <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                />
                <input
                    type="text"
                    placeholder="Buscar personas..."
                    value={busquedaGlobal}
                    onChange={handleBusquedaGlobal}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                    aria-label="Buscar personas para chatear"
                />
            </div>

            {/* Resultados de búsqueda */}
            {(cargandoBusqueda || resultadosBusqueda.length > 0) && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
                    {cargandoBusqueda ? (
                        <div className="flex items-center justify-center p-4 text-gray-500">
                            <Loader size={20} className="animate-spin mr-2" />
                            Buscando...
                        </div>
                    ) : resultadosBusqueda.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            No se encontraron usuarios
                        </div>
                    ) : (
                        resultadosBusqueda.map((usuario) => (
                            <div
                                key={usuario._id}
                                onClick={() => seleccionarUsuarioBusqueda(usuario)}
                                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') seleccionarUsuarioBusqueda(usuario);
                                }}
                            >
                                <img
                                    src={getUserAvatar(usuario)}
                                    alt={`${usuario?.nombres?.primero} ${usuario?.apellidos?.primero}`}
                                    className="w-10 h-10 rounded-full object-cover"
                                    onError={handleImageError}
                                />
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                                        {usuario?.nombres?.primero} {usuario?.apellidos?.primero}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {usuario?.seguridad?.rolSistema || 'Usuario'} · {usuario?.personal?.ubicacion?.ciudad || 'Sin ubicación'}
                                    </div>
                                </div>
                                <User size={16} className="text-gray-400" />
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
