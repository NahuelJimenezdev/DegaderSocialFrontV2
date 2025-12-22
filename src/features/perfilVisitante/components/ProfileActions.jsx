import { MessageSquare, UserPlus, UserMinus, UserCheck, Clock } from 'lucide-react';

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
    </div>
  );
};

export default ProfileActions;


