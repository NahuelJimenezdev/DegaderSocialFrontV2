import { useState, useEffect } from 'react';
import { logger } from '../../../shared/utils/logger';
import groupService from '../../../api/groupService';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';

const TransferOwnershipModal = ({ groupId, onClose, onSuccess }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [transferring, setTransferring] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                setLoading(true);
                const response = await groupService.getGroupMembers(groupId);
                const allMembers = response?.data || response || [];

                // Filter out current user (assuming the caller handles this check, but good to be safe)
                // We'll filter in the render or here if we had userId context.
                // For now, let's just assume list is correct and we filter visually if needed.
                // But better to just show all eligible members (admins/members) except self.

                setMembers(Array.isArray(allMembers) ? allMembers : []);
            } catch (err) {
                logger.error('Error fetching members:', err);
                setError('Error al cargar miembros');
            } finally {
                setLoading(false);
            }
        };

        if (groupId) {
            fetchMembers();
        }
    }, [groupId]);

    const filteredMembers = members.filter((member) => {
        // Exclude self (ownership implies we are viewing this).
        // Since we don't have user context here easily without prop drilling or hook,
        // we'll rely on the fact that transfer logic in backend blocks self-transfer.
        // But UI wise, it's better to hide "Propietario" from list.

        if (member.rol === 'propietario' || member.role === 'owner') return false;

        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        const user = member.user || member;
        const fullName = `${user.nombres?.primero || ''} ${user.apellidos?.primero || ''} ${user.nombre || ''} ${user.apellido || ''}`.trim();
        return fullName.toLowerCase().includes(search);
    });

    const handleTransfer = async () => {
        if (!selectedMember) return;

        try {
            setTransferring(true);
            const memberId = selectedMember.user?._id || selectedMember.user || selectedMember._id;

            await groupService.transferOwnership(groupId, memberId);

            if (onSuccess) {
                onSuccess();
            }
            onClose();
        } catch (err) {
            logger.error('Error transferring ownership:', err);
            setError(err.response?.data?.message || 'Error al transferir la propiedad');
        } finally {
            setTransferring(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-purple-600">swap_horiz</span>
                        Transferir Propiedad
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 flex-1 overflow-y-auto min-h-0">
                    <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                            <span className="material-symbols-outlined text-base mt-0.5">info</span>
                            Selecciona un miembro para convertirlo en el nuevo propietario. Tú pasarás a ser administrador.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative mb-4">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar miembro..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                        />
                    </div>

                    {/* Members List */}
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 py-4 text-sm">{error}</div>
                    ) : filteredMembers.length === 0 ? (
                        <div className="text-center text-gray-500 py-8 text-sm">No se encontraron miembros elegibles.</div>
                    ) : (
                        <div className="space-y-2">
                            {filteredMembers.map((member) => {
                                const user = member.user || member;
                                const memberId = user._id || user;
                                const isSelected = selectedMember && (selectedMember.user?._id === memberId || selectedMember._id === memberId);
                                const fullName = `${user.nombres?.primero || ''} ${user.apellidos?.primero || ''}`.trim() || user.username || 'Usuario';

                                return (
                                    <div
                                        key={memberId}
                                        onClick={() => setSelectedMember(member)}
                                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer border transition-all ${isSelected
                                                ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500 ring-1 ring-purple-500'
                                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                            <img
                                                src={getUserAvatar(user)}
                                                alt={fullName}
                                                className="w-full h-full object-cover"
                                                onError={(e) => e.target.src = '/avatars/default-avatar.png'}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{fullName}</p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {member.rol === 'administrador' || member.role === 'admin' ? 'Administrador' : 'Miembro'}
                                            </p>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-purple-500 bg-purple-500' : 'border-gray-400'
                                            }`}>
                                            {isSelected && <span className="material-symbols-outlined text-white text-xs font-bold">check</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        disabled={transferring}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleTransfer}
                        disabled={!selectedMember || transferring}
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                        {transferring ? (
                            <>
                                <span className="animate-spin h-4 w-4 border-2 border-white/30 border-b-white rounded-full"></span>
                                Transfiriendo...
                            </>
                        ) : (
                            'Transferir Propiedad'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransferOwnershipModal;
