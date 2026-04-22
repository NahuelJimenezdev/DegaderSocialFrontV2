import { AlertDialog } from '../../../shared/components/AlertDialog';
import IosModal from '../../../shared/components/IosModal';
import { useGroupSettings } from '../hooks/useGroupSettings';
import GroupGeneralSettings from './GroupGeneralSettings';
import GroupPermissionsPanel from './GroupPermissionsPanel';
import GroupNotificationsPanel from './GroupNotificationsPanel';
import GroupDangerZone from './GroupDangerZone';
import TransferOwnershipModal from './TransferOwnershipModal';

const GroupSettings = ({ groupData, refetch, user, userRole, isAdmin, isOwner }) => {
  // Use custom hook for all business logic
  const {
    loading,
    editMode,
    imageFile,
    imagePreview,
    imageError,
    alertConfig,
    formData,
    setEditMode,
    setImageError,
    setAlertConfig,
    handleChange,
    handleImageChange,
    handleSubmit,
    handleDeleteAvatar,
    handleDeleteGroup,
    handleLeaveGroup,
    cancelEdit,
    showTransferModal,
    setShowTransferModal,
    handleTransferSuccess,
    confirmDialog,
    closeConfirmDialog,
    showDeleteGroupDialog,
    setShowDeleteGroupDialog,
    deleteGroupName,
    setDeleteGroupName,
    confirmDeleteGroup
  } = useGroupSettings(groupData, refetch, user, isOwner);

  // No bloqueamos acceso global, pero renderizamos condicionalmente las secciones

  return (
    <div className="h-full overflow-y-auto p-6 scrollbar-thin" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="rounded-lg shadow-sm p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Configuración del Grupo</h2>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
            Administra la información y configuración del grupo
          </p>
        </div>

        {/* General Settings - Solo Admins y Owners */}
        {(isAdmin || isOwner) && (
          <GroupGeneralSettings
            groupData={groupData}
            editMode={editMode}
            formData={formData}
            imagePreview={imagePreview}
            imageError={imageError}
            loading={loading}
            handleChange={handleChange}
            handleImageChange={handleImageChange}
            handleDeleteAvatar={handleDeleteAvatar}
            handleSubmit={handleSubmit}
            cancelEdit={cancelEdit}
            setEditMode={setEditMode}
            setImageError={setImageError}
          />
        )}

        {/* Permissions - Solo Admins y Owners */}
        {(isAdmin || isOwner) && (
          <GroupPermissionsPanel groupData={groupData} />
        )}

        {/* Notifications - Visible para TODOS */}
        <GroupNotificationsPanel groupId={groupData._id} currentSettings={groupData.notificaciones} />

        {/* Danger Zone - Visible para TODOS (Lógica interna maneja permisos) */}
        <GroupDangerZone
          isOwner={isOwner}
          loading={loading}
          handleLeaveGroup={handleLeaveGroup}
          handleDeleteGroup={handleDeleteGroup}
        />
      </div>

      <AlertDialog
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        variant={alertConfig.variant}
        message={alertConfig.message}
      />

      <AlertDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        variant={confirmDialog.variant}
        title={confirmDialog.title}
        message={confirmDialog.message}
        showCancelButton={true}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        onConfirm={confirmDialog.onConfirm}
      />

      {/* Delete Group Prompt Modal */}
      <IosModal
        isOpen={showDeleteGroupDialog}
        onClose={() => setShowDeleteGroupDialog(false)}
        title="Eliminar Grupo"
      >
        <div className="space-y-4">
          <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
            ⚠️ Esta acción es irreversible.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Para confirmar, escribe el nombre del grupo: <strong>{groupData.nombre}</strong>
          </p>
          <input
            type="text"
            className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            placeholder={groupData.nombre}
            value={deleteGroupName}
            onChange={(e) => setDeleteGroupName(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => setShowDeleteGroupDialog(false)}
              className="px-4 py-2 text-gray-600 bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              Cancelar
            </button>
            <button
              onClick={confirmDeleteGroup}
              disabled={deleteGroupName !== groupData.nombre || loading}
              className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Eliminando...' : 'Eliminar grupo'}
            </button>
          </div>
        </div>
      </IosModal>

      {/* Transfer Ownership Modal */}
      {showTransferModal && (
        <TransferOwnershipModal
          groupId={groupData._id}
          onClose={() => setShowTransferModal(false)}
          onSuccess={handleTransferSuccess}
        />
      )}
    </div>
  );
};

export default GroupSettings;
