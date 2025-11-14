import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import groupService from '../../../api/groupService';

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
      console.log('📥 Datos del grupo recibidos:', response);

      // El backend devuelve { success: true, message: '...', data: group }
      const group = response?.data || response;
      console.log('✅ Grupo procesado:', group);
      setGroupData(group);
    } catch (err) {
      console.error('❌ Error loading group:', err);
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

  return { groupData, loading, error, refetch: loadGroupData };
};
