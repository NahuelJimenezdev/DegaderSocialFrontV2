import { AlertDialog } from '../../../shared/components/AlertDialog';
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
    handleTransferSuccess
  } = useGroupSettings(groupData, refetch, user, isOwner);

  // No bloqueamos acceso global, pero renderizamos condicionalmente las secciones

  return (
    <div className="h-full overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 scrollbar-thin">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Configuración del Grupo</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
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
