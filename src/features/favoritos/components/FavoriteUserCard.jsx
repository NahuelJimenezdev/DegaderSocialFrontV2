import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, X, Users } from 'lucide-react';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';
import { useOnlineUsers } from '../../../contexts/OnlineUsersContext';

const FavoriteUserCard = ({ user, onRemove }) => {
    const navigate = useNavigate();
    const onlineUsers = useOnlineUsers();

    const handleCardClick = () => {
        const identifier = user.username || user._id;
        navigate(`/informacionUsuario/${identifier}`);
    };

    const handleRemoveClick = (e) => {
        e.stopPropagation();
        onRemove(user._id);
    };

    const avatar = getUserAvatar(user);
    const fullName = user.nombres && user.apellidos
        ? `${user.nombres.primero} ${user.apellidos.primero}`
        : user.nombreCompleto || 'Usuario';

    // Detectar estado online (similar a FriendCard)
    const isOnlineByLastConnection = () => {
        if (!user?.seguridad?.ultimaConexion) return false;
        const lastConnection = new Date(user.seguridad.ultimaConexion);
        const now = new Date();
        const diffMinutes = (now - lastConnection) / (1000 * 60);
        return diffMinutes <= 5;
    };

    const hasRealTimeData = onlineUsers !== null && onlineUsers !== undefined;
    const isOnlineRealTime = hasRealTimeData ? onlineUsers.has(user._id) : null;
    const isOnlineFallback = isOnlineByLastConnection();
    const online = isOnlineRealTime !== null ? isOnlineRealTime : isOnlineFallback;

    // Obtener número de seguidores
    const followersCount = user.seguidores || 0;

    return (
        <div
            onClick={handleCardClick}
            className="w-full flex flex-col gap-4 p-4 rounded-lg transition-all duration-300 cursor-pointer group relative bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-300 dark:border-gray-700 shadow-sm hover:shadow-lg dark:shadow-[0_6px_16px_-8px_rgba(129,140,248,0.25)]"

        >
            {/* Botón de eliminar (visible en hover) */}
            <button
                onClick={handleRemoveClick}
                className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:scale-105 transition-all duration-300 z-10"
                title="Quitar de favoritos"
            >
                <X size={16} />
            </button>

            {/* Imagen Cuadrada Estilo Álbum */}
            <div className="relative w-full aspect-square rounded-md overflow-hidden shadow-md group-hover:shadow-xl transition-shadow bg-gray-100 dark:bg-[#333]">
                {avatar ? (
                    <img
                        src={avatar}
                        alt={fullName}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white opacity-50">
                            {user.nombres?.primero?.charAt(0)}
                        </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1 w-full">
                <h3 className="font-bold text-gray-900 dark:text-white text-base truncate w-full" title={fullName}>
                    {fullName}
                </h3>
                <p className="text-gray-400 text-sm truncate">
                    @{user.username || 'usuario'}
                </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${online ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-600'}`}></div>
                        <span className={`text-xs font-medium ${online ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            {online ? 'En línea' : 'Desconectado'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {followersCount}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default FavoriteUserCard;
