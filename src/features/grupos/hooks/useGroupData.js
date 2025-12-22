import { useState, useEffect } from 'react';
import { logger } from '../../../shared/utils/logger';
import { useNavigate } from 'react-router-dom';
import groupService from '../../../api/groupService';
import { getSocket } from '../../../shared/lib/socket';

export const useGroupData = (id) => {
  const navigate = useNavigate();
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadGroupData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await groupService.getGroupById(id);
      logger.log('📥 Datos del grupo recibidos:', response);

      // El backend devuelve { success: true, message: '...', data: group }
      const group = response?.data || response;
      logger.log('✅ Grupo procesado:', group);
      setGroupData(group);
    } catch (err) {
      logger.error('❌ Error loading group:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Error al cargar el grupo');
      if (err.response?.status === 404) {
        navigate('/Mis_grupos');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadGroupData();
    }
  }, [id]);

  // Escuchar actualizaciones del grupo en tiempo real
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !id) return;

    const handleGroupUpdated = (updatedGroup) => {
      // Verificar si la actualización es para este grupo
      if (String(updatedGroup._id) === String(id)) {
        logger.log('🔄 [SOCKET] Grupo actualizado:', updatedGroup);
        setGroupData(prev => ({ ...prev, ...updatedGroup }));
      }
    };

    socket.on('groupUpdated', handleGroupUpdated);

    return () => {
      socket.off('groupUpdated', handleGroupUpdated);
    };
  }, [id]);

  return { groupData, loading, error, refetch: loadGroupData };
};



