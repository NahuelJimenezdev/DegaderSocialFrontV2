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
      ? `${user.primernombreUsuario || ''} ${user.primerapellidoUsuario || ''}`.trim()
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

        {/* Información General */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined">info</span>
            Información General
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Nombre del Grupo
              </h4>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {groupData?.nombre || 'Sin nombre'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Tipo de Grupo
              </h4>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {getTipoLabel(groupData?.tipo)}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
              Descripción
            </h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {groupData?.descripcion || 'Sin descripción'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Fecha de Creación
              </h4>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {formatDate(groupData?.createdAt)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Propietario
              </h4>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {getOwner() || 'No disponible'}
              </p>
            </div>
          </div>
        </div>
      </div>

        {/* Estadísticas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined">bar_chart</span>
              Estadísticas
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-4xl text-blue-600 dark:text-blue-400">
                    group
                  </span>
                </div>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {groupData?.members?.length || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Miembros Totales
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-4xl text-purple-600 dark:text-purple-400">
                    shield_person
                  </span>
                </div>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {getAdminCount()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Administradores
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-4xl text-yellow-600 dark:text-yellow-400">
                    person_add
                  </span>
                </div>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {groupData?.joinRequests?.filter(r => r.status === 'pending').length || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Solicitudes Pendientes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupInfo;
