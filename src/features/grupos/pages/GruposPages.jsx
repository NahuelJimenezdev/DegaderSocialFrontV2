import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import groupService from "../../../api/groupService";
import CreateGroupModal from "../components/CreateGroupModal";
import { getAvatarUrl } from "../../../shared/utils/avatarUtils";
import { getSocket } from "../../../shared/lib/socket";

const GruposPages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [section, setSection] = useState("Mis grupos");
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

  // Cargar grupos desde la API
  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await groupService.getAllGroups();
        console.log('📥 Grupos recibidos:', response);

        // El backend devuelve { success: true, data: { groups, pagination } }
        const groups = response?.data?.groups || response?.groups || response || [];
        console.log('✅ Grupos procesados:', groups);
        setAllGroups(Array.isArray(groups) ? groups : []);
      } catch (err) {
        console.error('Error loading groups:', err);
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
      console.log('🔔 Notificación recibida en GruposPages:', notification);

      // Si es una notificación de solicitud aprobada, recargar grupos
      if (notification.tipo === 'solicitud_grupo_aprobada') {
        console.log('✅ Solicitud de grupo aprobada - recargando lista de grupos');
        try {
          const response = await groupService.getAllGroups();
          const groups = response?.data?.groups || response?.groups || response || [];
          setAllGroups(Array.isArray(groups) ? groups : []);
          alert('¡Tu solicitud para unirte al grupo ha sido aprobada!');
        } catch (err) {
          console.error('Error recargando grupos:', err);
        }
      }
    };

    socket.on('newNotification', handleNewNotification);

    return () => {
      socket.off('newNotification', handleNewNotification);
    };
  }, []);

  // Filtrar grupos: "Mis grupos" vs "Grupos para unirse"
  const myGroups = (Array.isArray(allGroups) ? allGroups : []).filter((group) => {
    if (!user || !user._id) return false;
    // El backend devuelve 'miembros' con estructura { usuario: ObjectId, rol, fechaUnion }
    const miembros = group.miembros || group.members || [];
    return miembros.some(
      (member) => {
        const memberId = member.usuario?._id || member.usuario || member.user?._id || member.user;
        return String(memberId) === String(user._id);
      }
    );
  });

  const joinableGroups = (Array.isArray(allGroups) ? allGroups : []).filter((group) => {
    if (!user || !user._id) return true; // Mostrar todos si no hay usuario
    // Grupos en los que NO es miembro
    const miembros = group.miembros || group.members || [];
    const isMember = miembros.some(
      (member) => {
        const memberId = member.usuario?._id || member.usuario || member.user?._id || member.user;
        return String(memberId) === String(user._id);
      }
    );
    return !isMember;
  });

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

  // Clases para Grid (siempre 3 columnas)
  const gridClasses = "grid grid-cols-3 gap-4";

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
      const response = await groupService.joinGroup(groupId);
      console.log('📥 Respuesta de joinGroup:', response);

      // El backend devuelve diferentes mensajes según el tipo de grupo:
      // - Grupo público: "Te has unido al grupo exitosamente"
      // - Grupo privado: "Solicitud enviada. Espera la aprobación de un administrador"
      const message = response?.message || '';

      // Si se unió exitosamente (grupo público), recargar grupos
      if (message.toLowerCase().includes('unido') || message.toLowerCase().includes('exitosamente')) {
        console.log('✅ Usuario unido al grupo - recargando lista');
        const groupsResponse = await groupService.getAllGroups();
        const groups = groupsResponse?.data?.groups || groupsResponse?.groups || groupsResponse || [];
        setAllGroups(Array.isArray(groups) ? groups : []);
        alert('¡Te has unido al grupo exitosamente!');
      }
      // Si envió solicitud (grupo privado), NO recargar grupos
      else if (message.toLowerCase().includes('solicitud')) {
        console.log('📨 Solicitud enviada - esperando aprobación');
        alert('Solicitud enviada. Espera la aprobación del administrador del grupo.');
      }
      // Fallback
      else {
        console.log('ℹ️ Respuesta desconocida - recargando por si acaso');
        const groupsResponse = await groupService.getAllGroups();
        const groups = groupsResponse?.data?.groups || groupsResponse?.groups || groupsResponse || [];
        setAllGroups(Array.isArray(groups) ? groups : []);
        alert(message || 'Operación completada');
      }
    } catch (err) {
      console.error('❌ Error joining group:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Error al procesar la solicitud';
      alert(errorMessage);
    }
  };

  // Handler para crear grupo
  const handleGroupCreated = (newGroup) => {
    console.log('🎉 Nuevo grupo creado:', newGroup);
    console.log('🖼️ Imagen del nuevo grupo:', newGroup.imagen);
    console.log('🖼️ imagePerfilGroup del nuevo grupo:', newGroup.imagePerfilGroup);
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
          className="group relative bg-white dark:bg-[#1F2937] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
        >
          {/* Imagen o gradiente */}
          <div className={`h-32 ${hasImage ? '' : `bg-gradient-to-br ${getGroupColor(group._id)}`}`}>
            {hasImage ? (
              <img
                src={getAvatarUrl(groupImage)}
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
            <h3 className="font-semibold text-base text-[#1F2937] dark:text-[#F9FAFB] mb-1 line-clamp-1">
              {group.nombre}
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-3 line-clamp-2">
              {group.descripcion || 'Sin descripción'}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                <span className="material-symbols-outlined text-sm">group</span>
                <span>{memberCount} miembros</span>
              </div>
              {canJoin && (
                <button
                  onClick={(e) => handleJoinGroup(e, group._id)}
                  className="px-3 py-1 bg-primary text-white text-xs rounded-md hover:bg-primary/90 transition-colors"
                >
                  Unirse
                </button>
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
          className="flex items-center gap-3 p-3 bg-white dark:bg-[#1F2937] rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          {/* Avatar */}
          <div className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ${hasImage ? '' : `bg-gradient-to-br ${getGroupColor(group._id)}`}`}>
            {hasImage ? (
              <img
                src={getAvatarUrl(groupImage)}
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
            <h3 className="font-semibold text-sm text-[#1F2937] dark:text-[#F9FAFB] truncate">
              {group.nombre}
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">group</span>
              {memberCount} miembros
            </p>
          </div>

          {/* Botón */}
          {canJoin && (
            <button
              onClick={(e) => handleJoinGroup(e, group._id)}
              className="px-4 py-2 bg-primary text-white text-xs rounded-md hover:bg-primary/90 transition-colors flex-shrink-0"
            >
              Unirse
            </button>
          )}
        </div>
      );
    }
  };

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-3xl text-white">groups</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4 mb-1">
              <h1 className="text-3xl font-bold text-[#1F2937] dark:text-[#F9FAFB]">Mis Grupos</h1>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-xl">add</span>
                <span className="hidden sm:inline">Crear Grupo</span>
              </button>
            </div>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Explora y participa en comunidades relevantes</p>
          </div>
        </div>

        {/* Pestañas Grid/List Global */}
        <div className="flex justify-end">
          <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F2937] p-1">
            {["Grid", "List"].map((label) => (
              <button
                key={label}
                onClick={() => setView(label)}
                className={`flex items-center justify-center gap-2 px-4 h-10 rounded-md text-sm font-medium transition-all ${
                  view === label
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {label === "Grid" ? "grid_view" : "view_list"}
                </span>
                {!isMobile && <span>{label}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Dos Secciones Lado a Lado (PC) o Una Debajo de Otra (Mobile) */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SECCIÓN 1: Mis Grupos */}
            <div className="flex flex-col gap-4">
              {/* Header de la sección */}
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-[#1F2937] rounded-xl border border-gray-200 dark:border-gray-700">
                <span className="material-symbols-outlined text-2xl text-primary">groups</span>
                <div className="flex-1">
                  <h2 className="font-semibold text-lg text-[#1F2937] dark:text-[#F9FAFB]">Mis Grupos</h2>
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Comunidades en las que participas</p>
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-bold rounded-full">{filteredMyGroups.length}</span>
              </div>

              {/* Buscador */}
              <div className="relative">
                <span className="material-symbols-outlined text-gray-400 absolute left-3 top-1/2 -translate-y-1/2">search</span>
                <input
                  value={searchTermMyGroups}
                  onChange={(e) => setSearchTermMyGroups(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F2937] text-[#1F2937] dark:text-[#F9FAFB] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Buscar mis grupos..."
                />
              </div>

              {/* Lista de grupos */}
              {filteredMyGroups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4 bg-white dark:bg-[#1F2937] rounded-xl border border-gray-200 dark:border-gray-700">
                  <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700">groups</span>
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No perteneces a ningún grupo aún</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Explora grupos para unirte</p>
                  </div>
                </div>
              ) : (
                <div className={view === "Grid" ? gridClasses : listClasses}>
                  {filteredMyGroups.map((group) => renderGroupCard(group, false))}
                </div>
              )}
            </div>

            {/* SECCIÓN 2: Grupos para Unirse */}
            <div className="flex flex-col gap-4">
              {/* Header de la sección */}
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-[#1F2937] rounded-xl border border-gray-200 dark:border-gray-700">
                <span className="material-symbols-outlined text-2xl text-primary">group_add</span>
                <div className="flex-1">
                  <h2 className="font-semibold text-lg text-[#1F2937] dark:text-[#F9FAFB]">Grupos para Unirse</h2>
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Explora y únete a nuevos grupos</p>
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-bold rounded-full">{filteredJoinGroups.length}</span>
              </div>

              {/* Buscador */}
              <div className="relative">
                <span className="material-symbols-outlined text-gray-400 absolute left-3 top-1/2 -translate-y-1/2">search</span>
                <input
                  value={searchTermJoinGroups}
                  onChange={(e) => setSearchTermJoinGroups(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1F2937] text-[#1F2937] dark:text-[#F9FAFB] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Buscar grupos disponibles..."
                />
              </div>

              {/* Lista de grupos */}
              {filteredJoinGroups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4 bg-white dark:bg-[#1F2937] rounded-xl border border-gray-200 dark:border-gray-700">
                  <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700">group_add</span>
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No hay grupos disponibles</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ya eres miembro de todos los grupos</p>
                  </div>
                </div>
              ) : (
                <div className={view === "Grid" ? gridClasses : listClasses}>
                  {filteredJoinGroups.map((group) => renderGroupCard(group, true))}
                </div>
              )}
            </div>
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
    </main>
  );
};

export default GruposPages;
