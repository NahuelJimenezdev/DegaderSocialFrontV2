import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, X } from 'lucide-react';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';

const FavoriteUserCard = ({ user, onRemove }) => {
    const navigate = useNavigate();

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

    return (
        <div
            onClick={handleCardClick}
            className="group relative p-4 rounded-md bg-[#181818] hover:bg-[#282828] transition-all duration-300 cursor-pointer flex flex-col gap-4 shadow-sm hover:shadow-lg w-full"
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
            <div className="relative w-full aspect-square rounded-md overflow-hidden shadow-md group-hover:shadow-xl transition-shadow bg-[#333]">
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
                <h3 className="font-bold text-white text-base truncate w-full" title={fullName}>
                    {fullName}
                </h3>
                <p className="text-gray-400 text-sm truncate">
                    @{user.username || 'usuario'}
                </p>
                <div className="mt-1 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-400">Usuario</span>
                </div>
            </div>
        </div>
    );

};

export default FavoriteUserCard;
