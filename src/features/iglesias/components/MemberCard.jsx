import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Mail, User, ChevronDown } from 'lucide-react';
import { getUserAvatar } from '../../../shared/utils/avatarUtils';
import { MINISTERIOS_DISPONIBLES } from '../hooks/useMinisterios';

const MemberCard = ({ member, iglesiaId, isPastor, isCurrentUser }) => {
  const navigate = useNavigate();
  const [showRolesDropdown, setShowRolesDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const fullName = `${member.nombres?.primero || ''} ${member.apellidos?.primero || ''}`.trim() || 'Usuario';

  // Manejar cierre al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowRolesDropdown(false);
      }
    };

    if (showRolesDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRolesDropdown]);

  const handleVerMas = () => {
    navigate(`/Mi_iglesia/${iglesiaId}?member=${member._id}`);
  };

  // Obtener ministerios activos
  const activeMinistries = member.eclesiastico?.ministerios?.filter(m => m.activo) || [];

  // Determinar rol principal a mostrar
  let displayRole = 'Miembro';
  let roleColor = 'text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';

  if (isPastor) {
    displayRole = 'Pastor';
    roleColor = 'text-purple-800 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300';
  } else if (activeMinistries.length > 0) {
    // Tomar el primer ministerio activo
    const min = activeMinistries[0];
    const minName = MINISTERIOS_DISPONIBLES.find(m => m.value === min.nombre)?.label || min.nombre;
    const cargo = min.cargo === 'lider' ? 'Líder' : min.cargo === 'sublider' ? 'Sublíder' : 'Miembro';
    displayRole = `${cargo} de ${minName}`;
    roleColor = 'text-blue-800 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300';
  }

  // Verificar si tiene múltiples roles para mostrar dropdown (aunque ahora lo mostramos siempre si quiere ver detalles)
  const hasMultipleRoles = activeMinistries.length > 0 || isPastor;

  // Debug para verificar ministerios (puedes descomentar si necesitas ver datos en consola)
  // console.log(`[MemberCard] ${fullName} Active Ministries:`, activeMinistries);

  const displayUsername = member.social?.username ? `@${member.social.username}` : (member.email || 'Sin email público');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow relative group overflow-hidden">

      {/* Badge de Rol con Dropdown */}
      <div className="absolute top-4 right-4 z-10" ref={dropdownRef}>
        <button
          onClick={() => setShowRolesDropdown(!showRolesDropdown)}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${roleColor} hover:opacity-90`}
        >
          <span className="truncate max-w-[120px]">{displayRole}</span>
          <ChevronDown size={12} className={`transition-transform duration-200 ${showRolesDropdown ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {showRolesDropdown && (
          <div className="absolute right-0 mt-2 w-89 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
            <div className="py-1">
              <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cargos y Ministerios
                </p>
              </div>

              {isPastor && (
                <div className="px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Pastor Principal</p>
                  <p className="text-xs text-gray-500">Liderazo General</p>
                </div>
              )}

              {activeMinistries.map((min, idx) => {
                const minName = MINISTERIOS_DISPONIBLES.find(m => m.value === min.nombre)?.label || min.nombre;
                const cargo = min.cargo === 'lider' ? 'Líder' : min.cargo === 'sublider' ? 'Sublíder' : 'Miembro';
                return (
                  <div key={idx} className="px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{cargo}</p>
                    <p className="text-xs text-gray-500">Ministerio de {minName}</p>
                  </div>
                );
              })}

              <div className="px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-300">Miembro Oficial</p>
                {activeMinistries.length === 0 && !isPastor && (
                  <p className="text-xs text-gray-400">Sin ministerios asignados</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700 shadow-md overflow-hidden mb-4 bg-gray-100 dark:bg-gray-700 mt-2">
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

      <div className="w-full overflow-hidden px-2">
        <p
          className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 break-all"
          title={displayUsername}
        >
          {displayUsername}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 w-full mt-auto">
        <button
          onClick={handleVerMas}
          className="flex-1 py-2 px-4 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
        >
          Ver más
        </button>
      </div>
    </div>
  );
};

export default MemberCard;
