import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useProfileData } from '../hooks/useProfileData';
import { usePostActions } from '../hooks/usePostActions';
import { usePostComposer } from '../hooks/usePostComposer';
import { getUserAvatar, getBannerUrl } from '../../../shared/utils/avatarUtils';
import { userService } from '../../../api';

const ProfileContext = createContext(null);

/**
 * Hook para acceder al contexto del perfil
 * @throws {Error} Si se usa fuera del ProfileProvider
 * @returns {Object} Contexto del perfil
 */
export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfileContext debe usarse dentro de ProfileProvider');
  }
  return context;
};

/**
 * Provider del contexto del perfil
 * Centraliza el estado y la lógica del perfil del usuario
 * Optimizado con useMemo y useCallback
 */
export const ProfileProvider = ({ user, updateUser, children }) => {
  // Debug: ver cuando cambia el user
  React.useEffect(() => {
    console.log('🔄 [ProfileProvider] user cambió:', user);
    console.log('🔄 [ProfileProvider] Avatar:', user?.social?.fotoPerfil);
  }, [user]);

  // Hook para datos del perfil
  const {
    posts,
    setPosts,
    loading,
    userStats,
    setUserStats,
    savedPosts,
    setSavedPosts,
    refetchAll,
    loadSavedPosts
  } = useProfileData(user);

  // Hook para acciones sobre posts
  const postActions = usePostActions(
    user,
    posts,
    setPosts,
    savedPosts,
    setSavedPosts,
    loadSavedPosts
  );

  // Memoizar callback cuando se crea un post
  const handlePostCreated = useCallback((newPost) => {
    setPosts(prev => [newPost, ...prev]);
    setUserStats(prev => ({ ...prev, totalPosts: prev.totalPosts + 1 }));
  }, [setPosts, setUserStats]);

  // Hook para el composer de posts
  const postComposer = usePostComposer(user, handlePostCreated);

  // Memoizar callback para actualizar el perfil
  const handleProfileUpdate = useCallback((updatedUser) => {
    console.log('🔄 handleProfileUpdate llamado con:', updatedUser);
    updateUser(updatedUser);
  }, [updateUser]);

  // Memoizar callback para actualizar el banner
  const handleBannerUpdate = useCallback(async (file) => {
    try {
      console.log('🖼️ [ProfileProvider] Actualizando banner...');
      const response = await userService.uploadBanner(user._id || user.id, file);
      console.log('✅ [ProfileProvider] Banner actualizado:', response);

      // Actualizar el usuario localmente con el nuevo banner
      const updatedUser = {
        ...user,
        social: {
          ...user.social,
          fotoBanner: response.banner
        }
      };
      updateUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('❌ [ProfileProvider] Error al actualizar banner:', error);
      return { success: false, error: error.message };
    }
  }, [user, updateUser]);

  // Memoizar URLs calculadas
  const avatarUrl = useMemo(() => {
    const url = getUserAvatar(user);
    console.log('🖼️ [ProfileProvider] avatarUrl recalculado:', url);
    console.log('🖼️ [ProfileProvider] user.social?.fotoPerfil:', user?.social?.fotoPerfil);
    return url;
  }, [user]);

  const coverUrl = useMemo(() => {
    const url = getBannerUrl(user?.social?.fotoBanner, 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop');
    console.log('🖼️ [ProfileProvider] coverUrl recalculado:', url);
    return url;
  }, [user]);

  // Memoizar el valor del contexto completo
  const value = useMemo(() => ({
    // Usuario
    user,
    avatarUrl,
    coverUrl,

    // Datos del perfil
    posts,
    loading,
    userStats,
    savedPosts,

    // Acciones sobre posts
    ...postActions,

    // Composer
    ...postComposer,

    // Callbacks
    handleProfileUpdate,
    handleBannerUpdate
  }), [
    user,
    avatarUrl,
    coverUrl,
    posts,
    loading,
    userStats,
    savedPosts,
    postActions,
    postComposer,
    handleProfileUpdate,
    handleBannerUpdate
  ]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};


