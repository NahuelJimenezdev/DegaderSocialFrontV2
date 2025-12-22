import React from 'react';
import { MoreVertical, Mail, User } from 'lucide-react';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';

const MemberCard = ({ member, isPastor, isCurrentUser }) => {
  const fullName = `${member.nombres?.primero || ''} ${member.apellidos?.primero || ''}`.trim() || 'Usuario';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow relative group">
      
      {/* Badge de Rol */}
      <div className="absolute top-4 right-4">
        {isPastor ? (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
            Pastor
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            Miembro
          </span>
        )}
      </div>

      {/* Avatar */}
      <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700 shadow-md overflow-hidden mb-4 bg-gray-100 dark:bg-gray-700">
        <img
          src={getUserAvatar(member)}
          alt={fullName}
          className="w-full h-full object-cover"
          onError={(e) => e.target.src = '/avatars/default-avatar.png'}
        />
      </div>

      {/* Info */}
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2 justify-center">
        {fullName}
        {isCurrentUser && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
            Tú
          </span>
        )}
      </h3>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-1">
        {member.email || 'Sin email público'}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2 w-full mt-auto">
        <button className="flex-1 py-2 px-4 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
          Ver Perfil
        </button>
        {/* <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <MoreVertical size={18} />
        </button> */}
      </div>
    </div>
  );
};

export default MemberCard;


