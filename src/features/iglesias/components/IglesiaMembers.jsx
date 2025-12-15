import { useState, useEffect } from 'react';
import { ChevronRight, LayoutGrid, List } from 'lucide-react';
import iglesiaService from '../../../api/iglesiaService';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';
import { churchColors } from '../utils/colors';
import MemberCard from './MemberCard';
import { getSocket } from '../../../shared/lib/socket';

const IglesiaMembers = ({ iglesiaData, refetch, user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  const miembros = iglesiaData?.miembros || [];
  const solicitudes = iglesiaData?.solicitudes || [];
  const pastorId = iglesiaData?.pastorPrincipal?._id || iglesiaData?.pastorPrincipal;
  const isPastor = pastorId && user?._id && pastorId.toString() === user._id.toString();

  // Filtrar miembros
  const filteredMembers = miembros.filter((miembro) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    const fullName = `${miembro.nombres?.primero || ''} ${miembro.apellidos?.primero || ''}`.trim();
    return fullName.toLowerCase().includes(search);
  });

  // Socket.IO listeners para actualizaciones en tiempo real
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNuevaSolicitud = (data) => {
      if (String(data.iglesiaId) === String(iglesiaData._id)) {
        console.log('🔔 Nueva solicitud de iglesia recibida', data);
        refetch();
      }
    };

    const handleSolicitudProcesada = (data) => {
      if (String(data.iglesiaId) === String(iglesiaData._id)) {
        console.log('✅ Solicitud de iglesia procesada externamente', data);
        refetch();
      }
    };

    socket.on('nuevaSolicitudIglesia', handleNuevaSolicitud);
    socket.on('solicitudIglesiaProcesada', handleSolicitudProcesada);

    return () => {
      socket.off('nuevaSolicitudIglesia', handleNuevaSolicitud);
      socket.off('solicitudIglesiaProcesada', handleSolicitudProcesada);
    };
  }, [iglesiaData._id, refetch]);

  // Aprobar solicitud
  const handleApproveRequest = async (userId) => {
    try {
      setLoading(true);
      await iglesiaService.manageRequest(iglesiaData._id, userId, 'aprobar');
      await refetch();
    } catch (err) {
      console.error('Error approving request:', err);
      alert('Error al aprobar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  // Rechazar solicitud
  const handleRejectRequest = async (userId) => {
    try {
      setLoading(true);
      await iglesiaService.manageRequest(iglesiaData._id, userId, 'rechazar');
      await refetch();
    } catch (err) {
      console.error('Error rejecting request:', err);
      alert('Error al rechazar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 bg-gray-50 dark:bg-gray-900 scrollbar-thin">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header & Search */}
        <div className={`${churchColors.cardBg} rounded-lg shadow-sm p-6`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Miembros de la Iglesia
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {miembros.length} {miembros.length === 1 ? 'miembro' : 'miembros'}
              </p>
            </div>

            <div className="flex items-center gap-4 flex-1 md:justify-end">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined text-gray-400 absolute left-3 top-1/2 -translate-y-1/2">
                  search
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar miembros..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* View Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex-shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                  }`}
                  title="Vista Cuadrícula"
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                  }`}
                  title="Vista Lista"
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Requests (Pastor Only) */}
        {isPastor && solicitudes.length > 0 && (
          <div className={`${churchColors.warningLight} border border-yellow-200 dark:border-yellow-800 rounded-lg p-6`}>
            <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">notifications</span>
              Solicitudes Pendientes ({solicitudes.length})
            </h3>
            <div className="space-y-3">
              {solicitudes.map((solicitud) => {
                const usuario = solicitud.usuario;
                const fullName = `${usuario?.nombres?.primero || ''} ${usuario?.apellidos?.primero || ''}`.trim() || 'Usuario';

                return (
                  <div
                    key={solicitud._id || usuario?._id}
                    className={`${churchColors.cardBg} rounded-lg p-4 flex items-center justify-between gap-4 shadow-sm border ${churchColors.borderLight}`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 overflow-hidden flex-shrink-0 ring-2 ring-white dark:ring-gray-800">
                        <img
                          src={getUserAvatar(usuario)}
                          alt={fullName}
                          className="w-full h-full object-cover"
                          onError={(e) => e.target.src = '/avatars/default-avatar.png'}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{fullName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {solicitud.mensaje || 'Desea unirse a la iglesia'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleApproveRequest(usuario._id)}
                        disabled={loading}
                        className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 text-sm font-medium shadow-sm"
                        title="Aceptar solicitud"
                      >
                        <span className="material-symbols-outlined text-lg">check</span>
                        <span className="hidden sm:inline">Aceptar</span>
                      </button>
                      <button
                        onClick={() => handleRejectRequest(usuario._id)}
                        disabled={loading}
                        className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 text-sm font-medium shadow-sm"
                        title="Rechazar solicitud"
                      >
                        <span className="material-symbols-outlined text-lg">close</span>
                        <span className="hidden sm:inline">Rechazar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Members List/Grid */}
        {filteredMembers.length === 0 ? (
          <div className={`${churchColors.cardBg} rounded-xl shadow-lg p-12 text-center`}>
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700">
              person_search
            </span>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              No se encontraron miembros
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((miembro) => (
              <MemberCard 
                key={miembro._id} 
                member={miembro} 
                isPastor={miembro._id?.toString() === pastorId?.toString()}
                isCurrentUser={miembro._id?.toString() === user?._id?.toString()}
              />
            ))}
          </div>
        ) : (
          <div className={`${churchColors.cardBg} rounded-xl shadow-lg overflow-x-auto`}>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={`${churchColors.primaryLight}`}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Miembro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMembers.map((miembro) => {
                  const fullName = `${miembro.nombres?.primero || ''} ${miembro.apellidos?.primero || ''}`.trim() || 'Usuario';
                  const isCurrentUser = miembro._id?.toString() === user?._id?.toString();
                  const isPastorMember = miembro._id?.toString() === pastorId?.toString();

                  return (
                    <tr 
                      key={miembro._id} 
                      className={`hover:${churchColors.primaryLight} transition duration-150`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            className="h-10 w-10 rounded-full object-cover mr-4 border-2 border-indigo-300 dark:border-indigo-700" 
                            src={getUserAvatar(miembro)} 
                            alt={fullName}
                            onError={(e) => e.target.src = '/avatars/default-avatar.png'}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                              {fullName}
                              {isCurrentUser && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                  Tú
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                        {isPastorMember ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                            Pastor Principal
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            Miembro
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 hidden md:table-cell">
                        {miembro.email || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">
                          Ver más <ChevronRight className="w-4 h-4 inline-block ml-1" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Esta información es privada y solo visible para miembros activos de la iglesia.
        </p>

      </div>
    </div>
  );
};

export default IglesiaMembers;
