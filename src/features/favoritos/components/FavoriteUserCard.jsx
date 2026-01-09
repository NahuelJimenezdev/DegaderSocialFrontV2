import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, X } from 'lucide-react';
import { getUserAvatar } from '../../../utils/avatarUtils';

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
            className="group relative bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all duration-300 cursor-pointer flex flex-col items-center gap-4 shadow-sm hover:shadow-md"
        >
            {/* Botón de eliminar (visible en hover) */}
            <button
                onClick={handleRemoveClick}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:scale-110 transition-all duration-300 z-10"
                title="Quitar de favoritos"
            >
                <X size={16} />
            </button>

            {/* Avatar Circular Grande */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                {avatar ? (
                    <img
                        src={avatar}
                        alt={fullName}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <User size={48} className="text-white" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="text-center w-full">
                <h3 className="font-bold text-white text-lg truncate w-full mb-1">
                    {fullName}
                </h3>
                <p className="text-gray-400 text-sm truncate">
                    @{user.username || 'usuario'}
                </p>
            </div>
        </div>
    );
};

export default FavoriteUserCard;
