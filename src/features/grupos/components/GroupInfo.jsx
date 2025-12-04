const GroupInfo = ({ groupData }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getOwner = () => {
    if (!groupData?.members) return null;
    const ownerMember = groupData.members.find(m => m.role === 'owner');
    if (!ownerMember) return null;
    const user = ownerMember.user;
    return user
      ? `${user.nombres?.primero || ''} ${user.apellidos?.primero || ''}`.trim()
      : 'No disponible';
  };

  const getAdminCount = () => {
    if (!groupData?.members) return 0;
    return groupData.members.filter(m => m.role === 'admin' || m.role === 'owner').length;
  };

  const getTipoLabel = (tipo) => {
    const tipos = {
      normal: 'Grupo Normal',
      fundacion: 'Fundación',
      iglesia: 'Iglesia'
    };
    return tipos[tipo] || 'Normal';
  };

  const getActivityBadge = (level) => {
    if (level >= 70) return { label: 'ALTA', color: 'bg-green-500' };
    if (level >= 40) return { label: 'MEDIA', color: 'bg-yellow-500' };
    return { label: 'BAJA', color: 'bg-gray-500' };
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 scrollbar-thin">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Información del Grupo</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Detalles y estadísticas del grupo
          </p>
        </div>

        {/* Información General - Diseño Profesional */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="material-symbols-outlined text-3xl">info</span>
              Información General
            </h3>
            <p className="text-white/80 mt-1 text-sm">Detalles y configuración del grupo</p>
          </div>
          
          <div className="p-6 lg:p-8">
            {/* Grid Adaptativo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              
              {/* Card: Nombre del Grupo */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 border border-blue-100 dark:border-blue-800 hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <span className="material-symbols-outlined text-2xl text-blue-600 dark:text-blue-400">
                        label
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Nombre del Grupo
                    </h4>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {groupData?.nombre || 'Sin nombre'}
                  </p>
                </div>
              </div>

              {/* Card: Tipo de Grupo */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 border border-purple-100 dark:border-purple-800 hover:shadow-lg transition-all duration-300">
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-500/10 rounded-full -ml-10 -mb-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <span className="material-symbols-outlined text-2xl text-purple-600 dark:text-purple-400">
                        category
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Tipo de Grupo
                    </h4>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {getTipoLabel(groupData?.tipo)}
                  </p>
                </div>
              </div>

              {/* Card: Descripción - Ocupa 2 columnas */}
              <div className="md:col-span-2 group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 border border-emerald-100 dark:border-emerald-800 hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <span className="material-symbols-outlined text-2xl text-emerald-600 dark:text-emerald-400">
                        description
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Descripción
                    </h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {groupData?.descripcion || 'Sin descripción'}
                  </p>
                </div>
              </div>

              {/* Card: Fecha de Creación */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 border border-amber-100 dark:border-amber-800 hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 left-0 w-20 h-20 bg-amber-500/10 rounded-full -ml-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      <span className="material-symbols-outlined text-2xl text-amber-600 dark:text-amber-400">
                        calendar_today
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Fecha de Creación
                    </h4>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatDate(groupData?.createdAt)}
                  </p>
                </div>
              </div>

              {/* Card: Propietario */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 p-6 border border-rose-100 dark:border-rose-800 hover:shadow-lg transition-all duration-300">
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-rose-500/10 rounded-full -mr-10 -mb-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-rose-500/10 rounded-lg">
                      <span className="material-symbols-outlined text-2xl text-rose-600 dark:text-rose-400">
                        person_crown
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Propietario
                    </h4>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {getOwner() || 'No disponible'}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Estadísticas - Diseño Profesional y Creativo */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="material-symbols-outlined text-3xl">analytics</span>
              Estadísticas del Grupo
            </h3>
            <p className="text-white/80 mt-1 text-sm">Métricas y datos en tiempo real</p>
          </div>
          
          <div className="p-6 lg:p-8">
            <style>{`
              .stats-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 1rem;
              }
              @media (min-width: 768px) {
                .stats-grid {
                  grid-template-columns: repeat(2, 1fr);
                  gap: 1.5rem;
                }
              }
            `}</style>
            {/* Grid Adaptativo con CSS puro - 1 columna en móvil, 2 en PC */}
            <div className="stats-grid">
              
              {/* Card 1: Miembros Totales - Destacada */}
              <div className="md:col-span-2 lg:col-span-1 group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <span className="material-symbols-outlined text-4xl text-white">
                        groups
                      </span>
                    </div>
                    <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                      <span className="text-xs font-semibold text-white">ACTIVO</span>
                    </div>
                  </div>
                  <p className="text-5xl lg:text-6xl font-black text-white mb-2">
                    {groupData?.members?.length || 0}
                  </p>
                  <p className="text-white/90 font-medium text-lg">
                    Miembros Totales
                  </p>
                  <p className="text-white/70 text-sm mt-1">
                    Comunidad activa
                  </p>
                </div>
              </div>

              {/* Card 2: Administradores */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <span className="material-symbols-outlined text-3xl text-white">
                        admin_panel_settings
                      </span>
                    </div>
                  </div>
                  <p className="text-4xl lg:text-5xl font-black text-white mb-2">
                    {getAdminCount()}
                  </p>
                  <p className="text-white/90 font-medium">
                    Administradores
                  </p>
                  <p className="text-white/70 text-sm mt-1">
                    Gestión del grupo
                  </p>
                </div>
              </div>

              {/* Card 3: Solicitudes Pendientes */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <span className="material-symbols-outlined text-3xl text-white">
                        person_add
                      </span>
                    </div>
                    {(groupData?.joinRequests?.filter(r => r.status === 'pending').length || 0) > 0 && (
                      <div className="px-2 py-1 bg-red-500 rounded-full">
                        <span className="text-xs font-bold text-white">NUEVO</span>
                      </div>
                    )}
                  </div>
                  <p className="text-4xl lg:text-5xl font-black text-white mb-2">
                    {groupData?.joinRequests?.filter(r => r.status === 'pending').length || 0}
                  </p>
                  <p className="text-white/90 font-medium">
                    Solicitudes
                  </p>
                  <p className="text-white/70 text-sm mt-1">
                    Pendientes de revisión
                  </p>
                </div>
              </div>

              {/* Card 4: Mensajes (Placeholder - puedes agregar datos reales) */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="absolute bottom-0 right-0 w-28 h-28 bg-white/10 rounded-full -mr-14 -mb-14 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <span className="material-symbols-outlined text-3xl text-white">
                        chat_bubble
                      </span>
                    </div>
                  </div>
                  <p className="text-4xl lg:text-5xl font-black text-white mb-2">
                    {groupData?.messageCount || '0'}
                  </p>
                  <p className="text-white/90 font-medium">
                    Mensajes
                  </p>
                  <p className="text-white/70 text-sm mt-1">
                    Total de conversaciones
                  </p>
                </div>
              </div>

              {/* Card 5: Archivos Compartidos */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <span className="material-symbols-outlined text-3xl text-white">
                        folder_shared
                      </span>
                    </div>
                  </div>
                  <p className="text-4xl lg:text-5xl font-black text-white mb-2">
                    {groupData?.fileCount || '0'}
                  </p>
                  <p className="text-white/90 font-medium">
                    Archivos
                  </p>
                  <p className="text-white/70 text-sm mt-1">
                    Multimedia compartida
                  </p>
                </div>
              </div>

              {/* Card 6: Actividad */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <span className="material-symbols-outlined text-3xl text-white">
                        trending_up
                      </span>
                    </div>
                    <div className={`px-2 py-1 ${getActivityBadge(groupData?.activityLevel || 0).color} rounded-full`}>
                      <span className="text-xs font-bold text-white">{getActivityBadge(groupData?.activityLevel || 0).label}</span>
                    </div>
                  </div>
                  <p className="text-4xl lg:text-5xl font-black text-white mb-2">
                    {groupData?.activityLevel || '0'}%
                  </p>
                  <p className="text-white/90 font-medium">
                    Actividad
                  </p>
                  <p className="text-white/70 text-sm mt-1">
                    Nivel de participación
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupInfo;
