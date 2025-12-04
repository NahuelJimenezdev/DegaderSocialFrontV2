import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import iglesiaService from '../../../api/iglesiaService';

export const useIglesiaData = (id) => {
  const navigate = useNavigate();
  const [iglesiaData, setIglesiaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadIglesiaData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await iglesiaService.getById(id);
      console.log('📥 Datos de iglesia recibidos:', response);

      const iglesia = response?.data || response;
      setIglesiaData(iglesia);
    } catch (err) {
      console.error('❌ Error loading iglesia:', err);
      setError(err.response?.data?.message || 'Error al cargar la iglesia');
      if (err.response?.status === 404) {
        navigate('/Mi_iglesia');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadIglesiaData();
    }
  }, [id]);

  return { iglesiaData, loading, error, refetch: loadIglesiaData };
};
