import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAmistad } from '../../amistades/hooks/useAmistad';
import api from '../../../api/config';
import ProfileHeader from '../components/ProfileHeader';
import {
  Building2 as Building2Icon,
  Church as ChurchIcon,
  MapPin as MapPinIcon,
  Briefcase as BriefcaseIcon,
  Globe as GlobeIcon,
  Calendar as CalendarIcon,
  Info as InfoIcon,
  LayoutGrid as LayoutGridIcon,
  FileText as FileTextIcon,
  Lock as LockIcon
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import useFeed from '../../feed/hooks/useFeed';
import PostCard from '../../../shared/components/Post/PostCard';

const PerfilVisitantePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('muro'); // 'muro' | 'info'
  const { estado, agregarAmigo, aceptarAmigo, cancelarAmigo, rechazarAmigo } = useAmistad(id);
  const { user: currentUser } = useAuth();
  const {
    posts,
    loading: loadingFeed,
    hasMore,
    loadMore,
    handleLike,
    handleAddComment,
    handleShare
  } = useFeed(id, currentUser);

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
    if (accion === 'eliminar') cancelarAmigo();
    if (accion === 'mensaje') navigate(`/mensajes/user:${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) return <div className="p-6 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  if (error) return <div className="p-6 text-red-600 text-center">Error: {error}</div>;
  if (!usuario) return <div className="p-6 text-center">Usuario no encontrado</div>;

  const isFriend = estado === 'aceptado';

  // --- COMPONENTES INTERNOS ---

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === id
        ? 'border-indigo-500 colorMarcaDegader dark:text-indigo-400'
        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
        }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  const InfoCard = ({ title, icon: Icon, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-700">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg colorMarcaDegader dark:text-indigo-400">
          <Icon size={20} />
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );

  const InfoItem = ({ label, value, icon: ItemIcon }) => (
    <div className="flex items-start gap-3">
      {ItemIcon && <ItemIcon size={16} className="mt-1 text-gray-400" />}
      <div>
        <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        <span className="text-gray-900 dark:text-gray-200">{value || 'No especificado'}</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
        <ProfileHeader
          usuario={usuario}
          estadoAmistad={estado}
          onAccionAmistad={handleAccionAmistad}
        />

        {/* --- VISTA HÍBRIDA (Pública para Info, Privada para Muro) --- */}
        <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FileTextIcon size={20} className="text-gray-500" />
            Biografía
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic mb-6">
            {usuario.social?.biografia || 'Este usuario aún no tiene biografía.'}
          </p>

          {/* Sección de Información Adicional (Pública) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 p-6 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-700/50">
            <div className="space-y-5">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Detalles Personales</h4>

              <InfoItem
                label="Ubicación"
                value={`${usuario.personal?.ubicacion?.ciudad || ''}, ${usuario.personal?.ubicacion?.pais || ''}`}
                icon={MapPinIcon}
              />

              <InfoItem
                label="Fecha de Nacimiento"
                value={formatDate(usuario.personal?.fechaNacimiento)}
                icon={CalendarIcon}
              />

              {usuario.social?.privacidad?.mostrarEmail && (
                <InfoItem label="Correo" value={usuario.email} icon={GlobeIcon} />
              )}

              {usuario.social?.privacidad?.mostrarTelefono && (
                <InfoItem label="Teléfono" value={usuario.personal?.celular} icon={BriefcaseIcon} />
              )}
            </div>

            <div className="space-y-5">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Vinculación Ministerial</h4>

              {usuario.esMiembroIglesia ? (
                <InfoItem
                  label="Iglesia"
                  value={usuario.eclesiastico?.iglesia?.nombre || 'Miembro Activo'}
                  icon={ChurchIcon}
                />
              ) : (
                <p className="text-sm text-gray-500 italic">No vinculado a una iglesia pública</p>
              )}

              {usuario.esMiembroFundacion ? (
                <InfoItem
                  label="Fundación"
                  value={`Fundación Sol y Luna - ${usuario.fundacion?.cargo || 'Miembro'}`}
                  icon={Building2Icon}
                />
              ) : (
                <p className="text-sm text-gray-500 italic">No vinculado a la fundación</p>
              )}
            </div>
          </div>
        </div>

        {/* --- BLOQUEO DE MURO (Solo si no son amigos) --- */}
        {!isFriend && (
          <div className="px-6 py-10 border-t border-gray-100 dark:border-gray-800 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <LockIcon size={32} />
            </div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Muro Privado</h4>
            <p className="text-gray-500 max-w-sm mx-auto">
              Agrega a {usuario.nombres?.primero} a tus amigos para interactuar y ver todas sus publicaciones.
            </p>
          </div>
        )}

        {/* --- VISTA PARA AMIGOS (Tabs Completos) --- */}
        {isFriend && (
          <div className="mt-2">
            {/* Tabs Navigation */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 px-4">
              <TabButton id="muro" label="Muro" icon={LayoutGridIcon} />
              <TabButton id="info" label="Información" icon={InfoIcon} />
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-900/50 min-h-[400px]">

              {/* TAB: MURO */}
              {activeTab === 'muro' && (
                <div className="space-y-4">
                  {loadingFeed && posts.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">Cargando publicaciones...</div>
                  ) : posts.length > 0 ? (
                    <>
                      {posts.map(post => (
                        <PostCard
                          key={post._id}
                          post={post}
                          currentUser={currentUser}
                          onLike={handleLike}
                          onAddComment={handleAddComment}
                          onShare={handleShare}
                          variant="feed"
                        />
                      ))}
                      {hasMore && (
                        <div className="flex justify-center pt-4">
                          <button
                            onClick={loadMore}
                            disabled={loadingFeed}
                            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            {loadingFeed ? 'Cargando...' : 'Ver más publicaciones'}
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                      <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3 text-gray-400">
                        <LayoutGridIcon size={24} />
                      </div>
                      <h3 className="text-gray-900 dark:text-white font-medium mb-1">Aún no hay publicaciones</h3>
                      <p className="text-gray-500 text-sm">Las publicaciones de {usuario.nombres?.primero} aparecerán aquí.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: INFORMACIÓN */}
              {activeTab === 'info' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">

                  {/* 1. Biografía y Personal (Full Width en mobile, izq en desktop) */}
                  <div className="space-y-6">
                    <InfoCard title="Sobre Mí" icon={FileTextIcon}>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {usuario.social?.biografia || 'Sin biografía.'}
                      </p>
                      {usuario.social?.sitioWeb && (
                        <div className="pt-2">
                          <InfoItem
                            label="Sitio Web"
                            value={<a href={usuario.social.sitioWeb} target="_blank" rel="noopener noreferrer" className="colorMarcaDegader hover:underline">{usuario.social.sitioWeb}</a>}
                            icon={GlobeIcon}
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <InfoItem
                          label="Ubicación"
                          value={`${usuario.personal?.ubicacion?.ciudad || ''}, ${usuario.personal?.ubicacion?.pais || ''}`}
                          icon={MapPinIcon}
                        />
                        <InfoItem
                          label="Miembro desde"
                          value={formatDate(usuario.createdAt)}
                          icon={CalendarIcon}
                        />
                      </div>
                    </InfoCard>

                    {/* Estadísticas Rápidas */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl text-center shadow-sm">
                        <span className="block text-2xl font-bold colorMarcaDegader">{usuario.social?.stats?.amigos || 0}</span>
                        <span className="text-xs text-gray-500 uppercase">Amigos</span>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl text-center shadow-sm">
                        <span className="block text-2xl font-bold colorMarcaDegader">{usuario.social?.stats?.seguidores || 0}</span>
                        <span className="text-xs text-gray-500 uppercase">Seguidores</span>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl text-center shadow-sm">
                        <span className="block text-2xl font-bold colorMarcaDegader">{usuario.social?.stats?.posts || 0}</span>
                        <span className="text-xs text-gray-500 uppercase">Posts</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Institucional y Eclesiástico (Columna derecha) */}
                  <div className="space-y-6">

                    {/* Fundación */}
                    {usuario.esMiembroFundacion && (
                      <InfoCard title="Fundación Sol y Luna" icon={Building2Icon}>
                        <InfoItem label="Cargo" value={usuario.fundacion?.cargo} icon={BriefcaseIcon} />
                        <InfoItem label="Área" value={usuario.fundacion?.area} />
                        <InfoItem label="Nivel" value={`Nivel ${usuario.fundacion?.nivel}`} />
                        {usuario.fundacion?.territorio?.pais && (
                          <InfoItem label="Territorio" value={`${usuario.fundacion.territorio.pais} ${usuario.fundacion.territorio.departamento ? '- ' + usuario.fundacion.territorio.departamento : ''}`} />
                        )}
                        <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                          Miembro Activo
                        </span>
                      </InfoCard>
                    )}

                    {/* Eclesiástico */}
                    {usuario.esMiembroIglesia && (
                      <InfoCard title="Información Eclesiástica" icon={ChurchIcon}>
                        {/* Como es referencia (ObjectId), en front solemos tener solo el ID a menos que el endpoint popule 'eclesiastico.iglesia'
                            Si no está poblado, mostrar 'Iglesia Vinculada' genérico o manejar la lógica de fallbacks */}
                        <InfoItem label="Iglesia" value={usuario.eclesiastico?.iglesia?.nombre || 'Vinculado a una congregación'} />
                        <InfoItem label="Rol Principal" value={usuario.eclesiastico?.rolPrincipal?.replace('_', ' ')} />

                        {usuario.eclesiastico?.ministerios?.length > 0 && (
                          <div className="mt-3">
                            <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Ministerios</span>
                            <div className="flex flex-wrap gap-2">
                              {usuario.eclesiastico.ministerios.map((min, idx) => (
                                <span key={idx} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs rounded-md border border-indigo-100 dark:border-indigo-800">
                                  {min.nombre}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </InfoCard>
                    )}

                    {!usuario.esMiembroFundacion && !usuario.esMiembroIglesia && (
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 text-center text-gray-500">
                        <p>Este usuario no tiene vinculaciones públicas con la Fundación o Iglesias.</p>
                      </div>
                    )}

                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PerfilVisitantePage;

