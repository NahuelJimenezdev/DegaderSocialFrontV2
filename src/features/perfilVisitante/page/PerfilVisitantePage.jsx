import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAmistad } from '../../amistades/hooks/useAmistad';
import api from '../../../api/config';
import ProfileHeader from '../components/ProfileHeader';

const PerfilVisitantePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { estado, agregarAmigo, aceptarAmigo, cancelarAmigo, rechazarAmigo } = useAmistad(id);

  useEffect(() => {
    setLoading(true);
    api.get(`/usuarios/${id}`)
      .then(res => setUsuario(res.data.data || res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAccionAmistad = (accion) => {
    if (accion === 'agregar') agregarAmigo();
    if (accion === 'aceptar') aceptarAmigo();
    if (accion === 'cancelar') cancelarAmigo();
    if (accion === 'rechazar') rechazarAmigo();
    if (accion === 'eliminar') cancelarAmigo(); // Mismo endpoint
    if (accion === 'mensaje') navigate(`/mensajes/user:${id}`);
  };

  if (loading) return <div className="p-6">Cargando...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!usuario) return <div className="p-6">Usuario no encontrado</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
        <ProfileHeader
          usuario={usuario}
          estadoAmistad={estado}
          onAccionAmistad={handleAccionAmistad}
        />

        {/* Biografía */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-2">Biografía</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {usuario.biografia || 'Este usuario aún no tiene biografía.'}
          </p>
        </div>

        {/* Publicaciones (solo si son amigos) */}
        {estado === 'aceptado' ? (
          <div className="px-6 py-4">
            <h3 className="text-lg font-semibold mb-4">Publicaciones</h3>
            <p className="text-gray-500">Cargando publicaciones...</p>
          </div>
        ) : (
          <div className="px-6 py-4 text-center text-gray-500">
            Solo los amigos pueden ver las publicaciones de este usuario.
          </div>
        )}
      </div>
    </div>
  );
};

export default PerfilVisitantePage;