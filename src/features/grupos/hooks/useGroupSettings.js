import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logger } from '../../../shared/utils/logger';
import groupService from '../../../api/groupService';

/**
 * Custom hook para manejar la configuración de grupos
 * @param {Object} groupData - Datos del grupo
 * @param {Function} refetch - Función para refrescar datos
 * @param {Object} user - Usuario actual
 * @param {boolean} isOwner - Si el usuario es propietario
 * @returns {Object} Estado y funciones para configuración del grupo
 */
export const useGroupSettings = (groupData, refetch, user, isOwner) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageError, setImageError] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        variant: 'info',
        message: ''
    });

    const [formData, setFormData] = useState({
        nombre: groupData?.nombre || '',
        descripcion: groupData?.descripcion || '',
        tipo: groupData?.tipo || 'normal'
    });

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Submit form changes
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Update group data
            await groupService.updateGroup(groupData._id, formData);

            // Update image if selected
            if (imageFile) {
                await groupService.uploadGroupAvatar(groupData._id, imageFile);
            }

            await refetch();
            setEditMode(false);
            setImageFile(null);
            setImagePreview(null);
            setAlertConfig({ isOpen: true, variant: 'success', message: 'Grupo actualizado exitosamente' });
        } catch (err) {
            logger.error('Error updating group:', err);
            setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al actualizar el grupo' });
        } finally {
            setLoading(false);
        }
    };

    // Delete avatar
    const handleDeleteAvatar = async () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar la imagen del grupo?')) {
            try {
                setLoading(true);
                await groupService.deleteGroupAvatar(groupData._id);
                await refetch();
                setAlertConfig({ isOpen: true, variant: 'success', message: 'Imagen eliminada exitosamente' });
            } catch (err) {
                logger.error('Error deleting avatar:', err);
                setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al eliminar la imagen' });
            } finally {
                setLoading(false);
            }
        }
    };

    // Delete group
    const handleDeleteGroup = async () => {
        if (!isOwner) {
            setAlertConfig({ isOpen: true, variant: 'warning', message: 'Solo el propietario puede eliminar el grupo' });
            return;
        }

        const confirmation = window.prompt(
            `Esta acción es irreversible. Para confirmar, escribe el nombre del grupo: "${groupData.nombre}"`
        );

        if (confirmation === groupData.nombre) {
            try {
                setLoading(true);
                await groupService.deleteGroup(groupData._id);
                setAlertConfig({ isOpen: true, variant: 'success', message: 'Grupo eliminado exitosamente' });
                navigate('/Mis_grupos');
            } catch (err) {
                logger.error('Error deleting group:', err);

                // Si el error es 409 (Conflicto - tiene miembros), ofrecer opciones
                if (err.response?.status === 409) {
                    const shouldTransfer = window.confirm(
                        `No se puede eliminar el grupo porque tiene otros miembros.\n\n` +
                        `¿Deseas transferir la administración a otro miembro primero?\n\n` +
                        `- Aceptar: Transferir administración\n` +
                        `- Cancelar: Eliminar definitivamente (y expulsar a todos)`
                    );

                    if (shouldTransfer) {
                        setShowTransferModal(true);
                    } else {
                        // Intentar eliminación forzada
                        if (window.confirm('¿Estás SEGURO de eliminar definitivamente? Se eliminará todo el contenido y los miembros perderán acceso.')) {
                            try {
                                setLoading(true);
                                await groupService.deleteGroup(groupData._id, true); // force=true logic needs backend support or query param
                                setAlertConfig({ isOpen: true, variant: 'success', message: 'Grupo eliminado exitosamente' });
                                navigate('/Mis_grupos');
                            } catch (forceErr) {
                                logger.error('Error preventing force delete:', forceErr);
                                setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al eliminar el grupo forzosamente' });
                            }
                        }
                    }
                } else {
                    setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al eliminar el grupo' });
                }
            } finally {
                setLoading(false);
            }
        } else if (confirmation !== null) {
            setAlertConfig({ isOpen: true, variant: 'warning', message: 'El nombre no coincide. Operación cancelada.' });
        }
    };

    // Leave group
    const handleLeaveGroup = async () => {
        if (isOwner) {
            // Si es propietario, mostrar modal de transferencia en lugar de alerta de bloqueo
            setShowTransferModal(true);
            return;
        }

        if (window.confirm('¿Estás seguro de que quieres abandonar este grupo?')) {
            try {
                setLoading(true);
                await groupService.leaveGroup(groupData._id);
                navigate('/Mis_grupos');
            } catch (err) {
                logger.error('Error leaving group:', err);
                setAlertConfig({ isOpen: true, variant: 'error', message: 'Error al abandonar el grupo' });
            } finally {
                setLoading(false);
            }
        }
    };

    // Cancel edit mode
    const cancelEdit = () => {
        setEditMode(false);
        setFormData({
            nombre: groupData?.nombre || '',
            descripcion: groupData?.descripcion || '',
            tipo: groupData?.tipo || 'normal'
        });
        setImageFile(null);
        setImagePreview(null);
    };

    // Call callback when transfer is successful
    const handleTransferSuccess = async () => {
        setAlertConfig({ isOpen: true, variant: 'success', message: 'Propiedad transferida exitosamente' });
        await refetch();
        // Opcional: Si la intención era salir, quizás deberíamos permitir salir ahora que no es owner.
        // Por ahora, solo cerramos el modal y refrescamos. El usuario puede volver a dar click en "Abandonar" si quiere salir.
    };

    return {
        // State
        loading,
        editMode,
        imageFile,
        imagePreview,
        imageError,
        alertConfig,
        showTransferModal,
        formData,

        // Setters
        setEditMode,
        setImageError,
        setAlertConfig,
        setShowTransferModal,

        // Handlers
        handleChange,
        handleImageChange,
        handleSubmit,
        handleDeleteAvatar,
        handleDeleteGroup,
        handleDeleteGroup,
        handleLeaveGroup,
        handleTransferSuccess,
        cancelEdit
    };
};
