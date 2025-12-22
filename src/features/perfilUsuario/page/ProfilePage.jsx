import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ProfileProvider, useProfileContext } from '../context/ProfileContext';
import ProfileSkeleton from '../skeleton/ProfileSkeleton';
import EditProfileModal from '../components/EditProfileModal';
import ProfileCover from '../components/ProfileCover';
import ProfileInfo from '../components/ProfileInfo';
import ProfileTabs from '../components/ProfileTabs';
import PostList from '../components/PostList';
import CreatePostCard from '../../../shared/components/Post/CreatePostCard';
import { AlertDialog } from '../../../shared/components/AlertDialog';

/**
 * Componente interno que consume el ProfileContext
 */
const ProfilePageContent = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    user,
    avatarUrl,
    coverUrl,
    loading,
    userStats,
    handleProfileUpdate,
    createPost, // Exposed by ProfileContext via ...postComposer (now usePostComposer refactored)
    postError,  // Exposed by ProfileContext
    alertConfig,
    setAlertConfig
  } = useProfileContext();

  // Mostrar skeleton mientras carga
  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Cover + Avatar */}
      <ProfileCover
        user={user}
        avatarUrl={avatarUrl}
        coverUrl={coverUrl}
        onEditClick={() => setShowEditModal(true)}
      />

      {/* Info del usuario + Stats */}
      <ProfileInfo user={user} stats={userStats} />

      {/* Tabs */}
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Contenido */}
      <div className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        {/* Composer para crear publicación - REPLACED */}
        <CreatePostCard
          currentUser={user}
          onPostCreated={createPost}
          alwaysExpanded={true}
          error={postError}
        />

        {/* Lista de publicaciones */}
        <PostList activeTab={activeTab} />
      </div>

      {/* Modal de edición de perfil */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onUpdate={handleProfileUpdate}
        className="z-1000"
      />

      {/* AlertDialog para mensajes de error/éxito */}
      <AlertDialog
        isOpen={alertConfig.isOpen}
        variant={alertConfig.variant}
        message={alertConfig.message}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
      />
    </div>
  );
};

/**
 * Componente principal de la página de perfil
 * Orquesta todos los subcomponentes y provee el contexto
 */
const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  // Si no hay usuario, mostrar skeleton
  if (!user) {
    return <ProfileSkeleton />;
  }

  return (
    <ProfileProvider user={user} updateUser={updateUser}>
      <ProfilePageContent />
    </ProfileProvider>
  );
};

export default ProfilePage;


