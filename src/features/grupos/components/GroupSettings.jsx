import { AlertDialog } from '../../../shared/components/AlertDialog';
import { useGroupSettings } from '../hooks/useGroupSettings';
import GroupGeneralSettings from './GroupGeneralSettings';
import GroupPermissionsPanel from './GroupPermissionsPanel';
import GroupNotificationsPanel from './GroupNotificationsPanel';
import GroupDangerZone from './GroupDangerZone';

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
    cancelEdit
  } = useGroupSettings(groupData, refetch, user, isOwner);

  // Access control - only admins and owners
  if (!isAdmin && !isOwner) {
    return (
      <div className="h-full overflow-auto p-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-red-500 dark:text-red-400">
              block
            </span>
            <p className="text-red-800 dark:text-red-200 mt-4 font-medium">
              No tienes permisos para acceder a la configuración del grupo
            </p>
            <p className="text-sm text-red-600 dark:text-red-300 mt-2">
              Solo los administradores y propietarios pueden modificar la configuración
            </p>
          </div>
        </div>
      </div>
    );
  }

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

        {/* General Settings */}
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

        {/* Permissions */}
        <GroupPermissionsPanel groupData={groupData} />

        {/* Notifications */}
        <GroupNotificationsPanel />

        {/* Danger Zone */}
        <GroupDangerZone
          isOwner={isOwner}
          loading={loading}
          handleLeaveGroup={handleLeaveGroup}
          handleDeleteGroup={handleDeleteGroup}
        />
      </div>

      {/* AlertDialog Component */}
      <AlertDialog
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        variant={alertConfig.variant}
        message={alertConfig.message}
      />
    </div>
  );
};

export default GroupSettings;
