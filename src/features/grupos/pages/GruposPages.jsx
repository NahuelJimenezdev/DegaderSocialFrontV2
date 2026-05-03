import { useState, useEffect } from "react";
import { logger } from '../../../shared/utils/logger';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import groupService from "../../../api/groupService";
import CreateGroupModal from "../components/CreateGroupModal";
import { getAvatarUrl } from "../../../shared/utils/avatarUtils";
import { getSocket } from "../../../shared/lib/socket";
import { AlertDialog } from '../../../shared/components/AlertDialog';
import GruposPageSkeleton from '../skeleton/GruposPageSkeleton';
import ProgressiveImage from '../../../shared/components/ProgressiveImage/ProgressiveImage';
import '../../../shared/styles/headers.style.css';
import '../../../shared/styles/layout.mobile.css';

const GruposPages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [section, setSection] = useState("Grupos para unirse");
  const [view, setView] = useState("Grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermMyGroups, setSearchTermMyGroups] = useState("");
  const [searchTermJoinGroups, setSearchTermJoinGroups] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es mobile o desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px es el breakpoint md de Tailwind
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Estado para grupos
  const [allGroups, setAllGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal de crear grupo
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, variant: 'info', message: '' });

  // Cargar grupos desde la API
  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await groupService.getAllGroups();
        logger.log('📥 Grupos recibidos:', response);

        // El backend devuelve { success: true, data: { groups, pagination } }
        const groups = response?.data?.groups || response?.groups || response || [];
        logger.log('✅ Grupos procesados:', groups);
        setAllGroups(Array.isArray(groups) ? groups : []);
      } catch (err) {
        logger.error('Error loading groups:', err);
        setError('Error al cargar los grupos. Por favor, intenta de nuevo.');
        setAllGroups([]);
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, []);

  // Escuchar notificaciones de aprobación de solicitud de grupo
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewNotification = async (notification) => {
      logger.log('🔔 Notificación recibida en GruposPages:', notification);

      // Si es una notificación de solicitud aprobada, recargar grupos
      if (notification.tipo === 'solicitud_grupo_aprobada') {
        logger.log('✅ Solicitud de grupo aprobada - recargando lista de grupos');
        try {
          const response = await groupService.getAllGroups();
          const groups = response?.data?.groups || response?.groups || response || [];
          setAllGroups(Array.isArray(groups) ? groups : []);
          setAlertConfig({ isOpen: true, variant: 'success', message: '¡Tu solicitud para unirte al grupo ha sido aprobada!' });
        } catch (err) {
          logger.error('Error recargando grupos:', err);
        }
      }
    };

    socket.on('newNotification', handleNewNotification);

    return () => {
      socket.off('newNotification', handleNewNotification);
    };
  }, []);

  // Helper para verificar membresía de forma robusta
  const isUserInGroup = (group) => {
    if (!user || !user._id || !group) return false;
    const userId = String(user._id);

    // 1. Verificar si es el creador
    const creatorId = group.creador?._id || group.creador;
    if (creatorId && String(creatorId) === userId) return true;

    // 2. Verificar en administradores (si existe el array)
    const admins = group.administradores || [];
    if (admins.some(admin => {
      const adminId = admin?._id || admin;
      return adminId && String(adminId) === userId;
    })) return true;

    // 3. Verificar en el array de miembros (soporta 'miembros' y 'members')
    const miembros = group.miembros || group.members || [];
    return miembros.some(m => {
      const mId = m.usuario?._id || m.usuario || m.user?._id || m.user || m._id;
      return mId && String(mId) === userId;
    });
  };

  // Filtrar grupos: "Mis grupos" vs "Grupos para unirse"
  const myGroups = (Array.isArray(allGroups) ? allGroups : []).filter(isUserInGroup);

  const joinableGroups = (Array.isArray(allGroups) ? allGroups : []).filter(group => !isUserInGroup(group));

  // Filtrar "Mis Grupos" por búsqueda
  const filteredMyGroups = myGroups.filter((group) => {
    if (!searchTermMyGroups) return true;
    const search = searchTermMyGroups.toLowerCase();
    return (
      group.nombre?.toLowerCase().includes(search) ||
      group.descripcion?.toLowerCase().includes(search)
    );
  });

  // Filtrar "Grupos para Unirse" por búsqueda
  const filteredJoinGroups = joinableGroups.filter((group) => {
    if (!searchTermJoinGroups) return true;
    const search = searchTermJoinGroups.toLowerCase();
    return (
      group.nombre?.toLowerCase().includes(search) ||
      group.descripcion?.toLowerCase().includes(search)
    );
  });

  // Grupos a mostrar según la sección activa (DEPRECATED - ahora usamos las dos columnas)
  const groups = section === "Mis grupos" ? myGroups : joinableGroups;

  // Filtrar por búsqueda (DEPRECATED - ahora usamos filtros separados)
  const filteredGroups = groups.filter((group) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      group.nombre?.toLowerCase().includes(search) ||
      group.descripcion?.toLowerCase().includes(search)
    );
  });

  // Clases para Grid (responsivo: 2 columnas en móvil, 3 en desktop)
  const gridClasses = "grid grid-cols-2 md:grid-cols-3 gap-4";

  // Clases para List (una sola columna, diseño horizontal compacto)
  const listClasses = "flex flex-col gap-2";

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Colores de gradiente para grupos sin imagen
  const defaultColors = [
    "from-indigo-500 to-purple-500",
    "from-green-500 to-emerald-600",
    "from-yellow-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-blue-500 to-cyan-600",
    "from-red-500 to-pink-500",
  ];

  const getGroupColor = (groupId) => {
    if (!groupId) return defaultColors[0];
    const index = parseInt(groupId.toString().slice(-1), 16) % defaultColors.length;
    return defaultColors[index];
  };

  // Handler para unirse a un grupo
  const handleJoinGroup = async (e, groupId) => {
    e.stopPropagation();
    try {
      // Optimistic update: marcar como pendiente localmente si es posible
      // Pero mejor esperar a la respuesta para saber si fue exitoso o solicitud
      const response = await groupService.joinGroup(groupId);
      logger.log('📥 Respuesta de joinGroup:', response);

      const message = response?.message || '';

      // Si se unió exitosamente (grupo público), recargar grupos
      if (message.toLowerCase().includes('unido') || message.toLowerCase().includes('exitosamente')) {
        logger.log('✅ Usuario unido al grupo - recargando lista');
        const groupsResponse = await groupService.getAllGroups();
        const groups = groupsResponse?.data?.groups || groupsResponse?.groups || groupsResponse || [];
        setAllGroups(Array.isArray(groups) ? groups : []);
        setAlertConfig({ isOpen: true, variant: 'success', message: '¡Te has unido al grupo exitosamente!' });
      }
      // Si envió solicitud (grupo privado), actualizar estado local
      else if (message.toLowerCase().includes('solicitud')) {
        logger.log('📨 Solicitud enviada - esperando aprobación');
        
        // Actualizar el estado local del grupo específico para mostrar "Pendiente" sin recargar todo
        setAllGroups(prev => prev.map(g => {
          if (String(g._id) === String(groupId)) {
            return {
              ...g,
              solicitudesPendientes: [...(g.solicitudesPendientes || []), { usuario: user._id }]
            };
          }
          return g;
        }));

        setAlertConfig({ isOpen: true, variant: 'info', message: 'Solicitud enviada. Espera la aprobación del administrador del grupo.' });
      }
      // Fallback
      else {
        logger.log('ℹ️ Respuesta desconocida - recargando por si acaso');
        const groupsResponse = await groupService.getAllGroups();
        const groups = groupsResponse?.data?.groups || groupsResponse?.groups || groupsResponse || [];
        setAllGroups(Array.isArray(groups) ? groups : []);
      }
    } catch (err) {
      logger.error('❌ Error joining group:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Error al procesar la solicitud';
      setAlertConfig({ isOpen: true, variant: 'error', message: errorMessage });
    }
  };

  // Handler para crear grupo
  const handleGroupCreated = (newGroup) => {
    logger.log('🎉 Nuevo grupo creado:', newGroup);
    logger.log('🖼️ Imagen del nuevo grupo:', newGroup.imagen);
    logger.log('🖼️ imagePerfilGroup del nuevo grupo:', newGroup.imagePerfilGroup);
    setAllGroups([newGroup, ...allGroups]);
    setShowCreateModal(false);
    // Cambiar a la sección "Mis grupos" automáticamente
    setSection("Mis grupos");
  };

  // Renderizar tarjeta de grupo
  const renderGroupCard = (group, canJoin = false) => {
    const memberCount = group.miembros?.length || group.members?.length || 0;
    const groupImage = group.imagen || group.imagePerfilGroup;
    const hasImage = groupImage && !groupImage.includes('default');

    if (view === "Grid") {
      // Vista Grid
      return (
        <div
          key={group._id}
          onClick={() => navigate(`/Mis_grupos/${group._id}`)}
          className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
        >
          {/* Imagen o gradiente */}
          <div className={`h-32 ${hasImage ? '' : `bg-gradient-to-br ${getGroupColor(group._id)}`}`}>
            {hasImage ? (
              <ProgressiveImage
                src={getAvatarUrl(groupImage)}
                blurHash={group.avatar?.blurHash}
                alt={group.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-white/80">groups</span>
              </div>
            )}
          </div>

          {/* Contenido */}
          <div className="p-4">
            <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">
              {group.nombre}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {group.descripcion || 'Sin descripción'}
            </p>
              <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <span className="material-symbols-outlined text-sm">group</span>
                <span>{memberCount} miembros</span>
              </div>
              {canJoin && (
                (() => {
                  const isPending = group.solicitudesPendientes?.some(s => 
                    String(s.usuario?._id || s.usuario) === String(user?._id)
                  );
                  
                  return isPending ? (
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-md border border-gray-200 dark:border-gray-600 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">hourglass_top</span>
                      Pendiente
                    </span>
                  ) : (
                    <button
                      onClick={(e) => handleJoinGroup(e, group._id)}
                      className="px-3 py-1 bg-primary text-white text-xs rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Unirse
                    </button>
                  );
                })()
              )}
            </div>
          </div>
        </div>
      );
    } else {
      // Vista List
      return (
        <div
          key={group._id}
          onClick={() => navigate(`/Mis_grupos/${group._id}`)}
          className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {/* Avatar */}
          <div className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ${hasImage ? '' : `bg-gradient-to-br ${getGroupColor(group._id)}`}`}>
            {hasImage ? (
              <ProgressiveImage
                src={getAvatarUrl(groupImage)}
                blurHash={group.avatar?.blurHash}
                alt={group.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-white">groups</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
              {group.nombre}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">group</span>
              {memberCount} miembros
            </p>
          </div>

          {/* Botón */}
          {canJoin && (
            (() => {
              const isPending = group.solicitudesPendientes?.some(s => 
                String(s.usuario?._id || s.usuario) === String(user?._id)
              );

              return isPending ? (
                <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-md border border-gray-200 dark:border-gray-600 flex items-center gap-1 flex-shrink-0">
                  <span className="material-symbols-outlined text-sm">hourglass_top</span>
                  Pendiente
                </span>
              ) : (
                <button
                  onClick={(e) => handleJoinGroup(e, group._id)}
                  className="px-4 py-2 bg-primary text-white text-xs rounded-md hover:bg-primary/90 transition-colors flex-shrink-0"
                >
                  Unirse
                </button>
              );
            })()
          )}
        </div>
      );
    }
  };

  // Guard: No renderizar hasta que user esté cargado
  if (!user || !user._id) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="w-full mx-auto flex flex-col gap-6 mb-mobile-30">
        {/* Header */}
        <div className="section-header">
          {/* Icono en caja con fondo */}
          <div className="section-header__icon-box">
            <span className="material-symbols-outlined section-header__icon">
              groups
            </span>
          </div>

          {/* Contenido: Título + Subtítulo */}
          <div className="section-header__content">
            <h1 className="section-header__title section-header__title--heavy">
              Mis Grupos
            </h1>
            <p className="section-header__subtitle">
              Explora y participa en comunidades relevantes
            </p>
          </div>

          {/* Botón CTA */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="section-header__button section-header__button--indigo"
          >
            <span className="material-symbols-outlined section-header__button-icon">
              add
            </span>
            <span className="section-header__button-text">Nuevo Grupo</span>
          </button>
        </div>

        {/* Toolbar unificada con clases BEM (definidas en layout.mobile.css) */}
        <div className="groups-toolbar shadow-sm border border-gray-200 dark:border-gray-700">

          {/* Pestañas de Sección (groups-toolbar__tabs) */}
          <div className="groups-toolbar__tabs">
            <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-900/50 rounded-xl overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setSection("Grupos para unirse")}
                className={`flex items-center gap-2 pestañasTabs px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${section === "Grupos para unirse"
                  ? "bg-white dark:bg-gray-800 text-primary shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
              >
                <span className="material-symbols-outlined text-lg">group_add</span>
                <span>Explorar</span>
                <span className={`ml-1 px-2 py-0.5 text-xs font-bold rounded-full ${section === "Grupos para unirse"
                  ? "bg-primary/10 text-primary"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                  }`}>
                  {filteredJoinGroups.length}
                </span>
              </button>
              <button
                onClick={() => setSection("Mis grupos")}
                className={`flex items-center gap-4 pestañasTabs px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${section === "Mis grupos"
                  ? "bg-white dark:bg-gray-800 text-primary shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
              >
                <span className="material-symbols-outlined text-lg">groups</span>
                <span>Mis Grupos</span>
                <span className={`ml-1 px-2 py-0.5 text-xs font-bold rounded-full ${section === "Mis grupos"
                  ? "bg-primary/10 text-primary"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                  }`}>
                  {filteredMyGroups.length}
                </span>
              </button>

            </div>
          </div>

          {/* Toggle Grid/List (groups-toolbar__view) */}
          <div className="groups-toolbar__view">
            <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-900/50 rounded-xl">
              {["Grid", "List"].map((label) => (
                <button
                  key={label}
                  onClick={() => setView(label)}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${view === label
                    ? "bg-white dark:bg-gray-800 text-primary shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    }`}
                  title={`Vista ${label}`}
                >
                  <span className="material-symbols-outlined text-xl">
                    {label === "Grid" ? "grid_view" : "view_list"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && <GruposPageSkeleton />}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Contenido por Pestaña */}
        {!loading && !error && (
          <div className="w-full">
            {section === "Mis grupos" ? (
              /* SECCIÓN 1: Mis Grupos */
              <div className="flex flex-col gap-6">
                {/* Header de la sección (Opcional, ya está en tabs, pero el usuario pidió "debajo los datos de cada uno") */}

                {/* Buscador Mis Grupos */}
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-xl text-gray-400">search</span>
                  <input
                    value={searchTermMyGroups}
                    onChange={(e) => setSearchTermMyGroups(e.target.value)}
                    className="w-full h-12 pl-12 pr-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm" placeholder="Buscar en mis grupos..."
                  />
                  {searchTermMyGroups && (
                    <button
                      onClick={() => setSearchTermMyGroups('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                      title="Limpiar búsqueda"
                    >
                      <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                  )}
                </div>

                {/* Lista Mis Grupos */}
                {filteredMyGroups.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600">groups</span>
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No perteneces a ningún grupo aún</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Ve a la pestaña <span className="font-bold text-primary cursor-pointer" onClick={() => setSection("Grupos para unirse")}>Explorar</span> para unirte a uno.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className={view === "Grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-3"}>
                    {filteredMyGroups.map((group) => renderGroupCard(group, false))}
                  </div>
                )}
              </div>
            ) : (
              /* SECCIÓN 2: Grupos para Unirse */
              <div className="flex flex-col gap-6">
                {/* Buscador Explorar */}
                <div className="relative">
                  <span className="material-symbols-outlined text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 text-xl">search</span>
                  <input
                    value={searchTermJoinGroups}
                    onChange={(e) => setSearchTermJoinGroups(e.target.value)}
                    className="w-full h-12 pl-12 pr-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm"
                    placeholder="Explorar nuevos grupos..."
                  />
                  {searchTermJoinGroups && (
                    <button
                      onClick={() => setSearchTermJoinGroups('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                      title="Limpiar búsqueda"
                    >
                      <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                  )}
                </div>

                {/* Lista Explorar */}
                {filteredJoinGroups.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600">travel_explore</span>
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No hay grupos nuevos disponibles</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ya eres miembro de todos los grupos existentes</p>
                    </div>
                  </div>
                ) : (
                  <div className={view === "Grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-3"}>
                    {filteredJoinGroups.map((group) => renderGroupCard(group, true))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Crear Grupo */}
      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleGroupCreated}
        />
      )}

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

export default GruposPages;
