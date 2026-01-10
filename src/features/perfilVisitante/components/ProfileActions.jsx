import { MessageSquare, UserPlus, UserMinus, UserCheck, Clock, MoreHorizontal, Flag } from 'lucide-react';

const ProfileActions = ({ estadoAmistad, onAccion }) => {
  const renderBotonPrincipal = () => {
    switch (estadoAmistad) {
      case 'default':
        return (
          <button
            onClick={() => onAccion('agregar')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <UserPlus size={18} />
            Agregar a amigos
          </button>
        );

      case 'enviada':
        return (
          <button
            onClick={() => onAccion('cancelar')}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            <Clock size={18} />
            Solicitud pendiente
          </button>
        );

      case 'recibida':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => onAccion('aceptar')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <UserCheck size={18} />
              Aceptar
            </button>
            <button
              onClick={() => onAccion('rechazar')}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <UserMinus size={18} />
              Rechazar
            </button>
          </div>
        );

      case 'aceptado':
        return (
          <button
            onClick={() => onAccion('eliminar')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <UserCheck size={18} />
            Amigos
          </button>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {renderBotonPrincipal()}
      <button
        onClick={() => onAccion('mensaje')}
        className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        title="Enviar mensaje"
      >
        <MessageSquare size={20} />
      </button>

      {/* Menú de opciones adicionales */}
      <div className="relative group">
        <button className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
          <MoreHorizontal size={20} />
        </button>

        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 py-1 hidden group-hover:block z-10">
          <button
            onClick={() => onAccion('reportar')}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <Flag size={16} />
            Reportar usuario
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileActions;


