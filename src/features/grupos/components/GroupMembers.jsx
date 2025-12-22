import { useState } from 'react';
import { logger } from '../../../shared/utils/logger';
import groupService from '../../../api/groupService';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';
import { AlertDialog } from '../../../shared/components/AlertDialog';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';

const GroupMembers = ({ groupData, refetch, user, userRole, isAdmin, isOwner }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(null);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, variant: 'info', message: '' });
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null, variant: 'warning' });

  const members = groupData?.members || [];
  const joinRequests = groupData?.joinRequests || [];

  // Filtrar miembros por búsqueda
  const filteredMembers = members.filter((member) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    const fullName = member.fullName || `${member.user?.nombres?.primero || ''} ${member.user?.apellidos?.primero || ''}`.trim();
    return fullName.toLowerCase().includes(search);
  });

  // Pending requests (solo visibles para admins/owners)
  const pendingRequests = joinRequests.filter((req) => req.status === 'pending');

  // Aprobar solicitud
  const handleApproveRequest = async (requestId) => {
    try {
      setLoading(true);
      await groupService.acceptJoinRequest(groupData._id, requestId);
      await refetch();
    } catch (err) {
      logger.error('Error approving request:', err);
      setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al aprobar la solicitud' });
    } finally {
      setLoading(false);
    }
  };

  // Rechazar solicitud
  const handleRejectRequest = async (requestId) => {
    try {
      setLoading(true);
      await groupService.rejectJoinRequest(groupData._id, requestId);
      await refetch();
    } catch (err) {
      logger.error('Error rejecting request:', err);
      setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al rechazar la solicitud' });
    } finally {
      setLoading(false);
    }
  };

  // Cambiar rol de miembro
  const handleChangeRole = async (memberId, newRole) => {
    try {
      setLoading(true);
      await groupService.updateMemberRole(groupData._id, memberId, newRole);
      await refetch();
      setShowRoleMenu(null);
    } catch (err) {
      logger.error('Error changing role:', err);
      setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al cambiar el rol' });
    } finally {
      setLoading(false);
    }
  };

  // Transferir propiedad
  const handleTransferOwnership = async (newOwnerId) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Transferir Propiedad',
      message: '¿Estás seguro de que quieres transferir la propiedad de este grupo? Perderás todos los privilegios de propietario.',
      variant: 'danger',
      onConfirm: async () => {
        try {
          setLoading(true);
          await groupService.transferOwnership(groupData._id, newOwnerId);
          await refetch();
          setShowRoleMenu(null);
          setAlertConfig({ isOpen: true, variant: 'success', message: 'Propiedad transferida exitosamente' });
        } catch (err) {
          logger.error('Error transferring ownership:', err);
          const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Error al transferir la propiedad';
          console.log('🔴 [DEBUG] Setting alertConfig:', { isOpen: true, variant: 'error', message: errorMessage });
          setAlertConfig({ isOpen: true, variant: 'error', message: errorMessage });
        } finally {
          setLoading(false);
          setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // Expulsar miembro
  const handleRemoveMember = async (memberId, memberName) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Expulsar Miembro',
      message: `¿Estás seguro de que quieres expulsar a ${memberName} del grupo?`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          setLoading(true);
          await groupService.removeMember(groupData._id, memberId);
          await refetch();
          setShowRoleMenu(null);
          setAlertConfig({ isOpen: true, variant: 'success', message: 'Miembro expulsado exitosamente' });
        } catch (err) {
          logger.error('Error removing member:', err);
          const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Error al expulsar miembro';
          setAlertConfig({ isOpen: true, variant: 'error', message: errorMessage });
        } finally {
          setLoading(false);
          setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  // Obtener badge de rol
  const getRoleBadge = (role) => {
    const badges = {
      owner: { label: 'Propietario', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
      admin: { label: 'Administrador', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
      member: { label: 'Miembro', color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' },
    };
    return badges[role] || badges.member;
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 scrollbar-thin">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header y Búsqueda */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-left sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Miembros del Grupo
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {members.length} {members.length === 1 ? 'miembro' : 'miembros'}
              </p>
            </div>

            {/* Búsqueda */}
            <div className="flex-1 max-w-md">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-gray-400 absolute left-3">
                  search
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar miembros..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
              </div>
            </div>
          </div>
        </div>

        {/* Solicitudes Pendientes (solo admins/owners) */}
        {(isAdmin || isOwner) && pendingRequests.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">notifications</span>
              Solicitudes Pendientes ({pendingRequests.length})
            </h3>
            <div className="space-y-3">
              {pendingRequests.map((request) => {
                const requestUser = request.user;

                // Helper to get full name from UserV2 structure
                const getFullName = (user) => {
                  if (!user) return 'Usuario';
                  // UserV2 structure
                  const nombre = user.nombres?.primero || '';
                  const apellido = user.apellidos?.primero || '';
                  return `${nombre} ${apellido}`.trim() || 'Usuario';
                };

                const fullName = getFullName(requestUser);
                const avatar = requestUser?.social?.fotoPerfil;

                return (
                  <div
                    key={request._id}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between gap-4 shadow-sm border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 overflow-hidden flex-shrink-0 ring-2 ring-white dark:ring-gray-800">
                        <img
                          src={getUserAvatar(requestUser)}
                          alt={fullName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/avatars/default-avatar.png';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{fullName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          desea ingresar al grupo
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleApproveRequest(request._id)}
                        disabled={loading}
                        className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 text-sm font-medium shadow-sm"
                        title="Aceptar solicitud"
                      >
                        <span className="material-symbols-outlined text-lg">check</span>
                        <span className="hidden sm:inline">Aceptar</span>
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request._id)}
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

        {/* Lista de Miembros */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
          {filteredMembers.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700">
                person_search
              </span>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                No se encontraron miembros
              </p>
            </div>
          ) : (
            filteredMembers.map((member) => {
              const memberUser = member.user;
              const memberId = memberUser?._id || memberUser;

              // Helper to get full name from UserV2 structure
              const getFullName = (user) => {
                if (!user) return 'Usuario';
                // UserV2 structure
                const nombre = user.nombres?.primero || '';
                const apellido = user.apellidos?.primero || '';
                return `${nombre} ${apellido}`.trim() || 'Usuario';
              };

              const fullName = getFullName(memberUser);
              const avatar = memberUser?.social?.fotoPerfil;
              const role = member.role || 'member';
              const badge = getRoleBadge(role);
              const isCurrentUser = String(memberId) === String(user?._id);
              const canManage = (isAdmin || isOwner) && !isCurrentUser;

              return (
                <div
                  key={member._id || memberId}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Avatar */}
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 overflow-hidden flex-shrink-0">
                        <img
                          src={getUserAvatar(memberUser)}
                          alt={fullName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/avatars/default-avatar.png';
                          }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">
                            {fullName}
                          </p>
                          {isCurrentUser && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              Tú
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    {canManage && (
                      <div className="relative">
                        <button
                          onClick={() => setShowRoleMenu(showRoleMenu === member._id ? null : member._id)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>

                        {showRoleMenu === member._id && (
                          <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[180px]">
                            {/* Cambiar rol */}
                            {role !== 'owner' && (
                              <>
                                <button
                                  onClick={() => handleChangeRole(memberId, 'admin')}
                                  disabled={loading || role === 'admin'}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                                >
                                  <span className="material-symbols-outlined text-lg">shield_person</span>
                                  {role === 'admin' ? '✓ Administrador' : 'Hacer Admin'}
                                </button>
                                <button
                                  onClick={() => handleChangeRole(memberId, 'member')}
                                  disabled={loading || role === 'member'}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                                >
                                  <span className="material-symbols-outlined text-lg">person</span>
                                  {role === 'member' ? '✓ Miembro' : 'Hacer Miembro'}
                                </button>
                                <hr className="border-gray-200 dark:border-gray-700" />
                              </>
                            )}

                            {/* Transferir propiedad (solo owner) */}
                            {isOwner && role !== 'owner' && (
                              <>
                                <button
                                  onClick={() => handleTransferOwnership(memberId)}
                                  disabled={loading}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 disabled:opacity-50"
                                >
                                  <span className="material-symbols-outlined text-lg">swap_horiz</span>
                                  Transferir propiedad
                                </button>
                                <hr className="border-gray-200 dark:border-gray-700" />
                              </>
                            )}

                            {/* Expulsar miembro */}
                            {role !== 'owner' && (
                              <button
                                onClick={() => handleRemoveMember(memberId, fullName)}
                                disabled={loading}
                                className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                              >
                                <span className="material-symbols-outlined text-lg">person_remove</span>
                                Expulsar
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* AlertDialog Component */}
      <AlertDialog
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        variant={alertConfig.variant}
        message={alertConfig.message}
      />

      {/* ConfirmDialog Component */}
      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        variant={confirmConfig.variant}
        isLoading={loading}
      />
    </div>
  );
};

export default GroupMembers;



