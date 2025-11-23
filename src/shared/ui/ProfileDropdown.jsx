import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Settings, Bell, Lock, HelpCircle, LogOut, Home, Users, MessageCircle, Video, Building2, Folder, User } from 'lucide-react';
import { getAvatarUrl, getInitialsAvatar } from '../utils/avatarUtils';
import ThemeSwitcher from '../components/ThemeSwitcher';
import './ProfileDropdown.css';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Obtener nombre completo del usuario
  const fullName = useMemo(() => {
    if (!user) return 'Usuario';
    return `${user.nombre || ''} ${user.apellido || ''}`.trim() || 'Usuario';
  }, [user]);

  // Memoizar avatar URL - si no tiene avatar, usar iniciales
  const avatarUrl = useMemo(() => {
    const avatar = user?.avatar;
    // Si no hay avatar o es una ruta default, generar iniciales
    if (!avatar || avatar.includes('default-avatar')) {
      return getInitialsAvatar(fullName);
    }
    return getAvatarUrl(avatar);
  }, [user?.avatar, fullName]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate('/auth');
    setIsOpen(false);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  // Sidebar navigation items (visible on mobile only)
  const sidebarItems = [
    { icon: Home, label: 'Inicio', path: '/' },
    { icon: Users, label: 'Amigos', path: '/amigos' },
    { icon: MessageCircle, label: 'Mensajes', path: '/mensajes' },
    { icon: Video, label: 'Mis Reuniones', path: '/Mis_reuniones' },
    { icon: Building2, label: 'Grupos', path: '/Mis_grupos' },
    { icon: Building2, label: 'Iglesia', path: '/Mi_iglesia' },
    { icon: Folder, label: 'Mis Carpetas', path: '/Mis_carpetas' },
    { icon: User, label: 'Perfil', path: '/Mi_perfil' }
  ];

  const menuItems = [
    {
      icon: Settings,
      label: 'Configuración',
      onClick: () => handleMenuClick('/settings')
    },
    {
      icon: Bell,
      label: 'Notificaciones',
      onClick: () => handleMenuClick('/notificaciones')
    },
    {
      icon: Lock,
      label: 'Privacidad',
      onClick: () => handleMenuClick('/privacidad')
    },
    {
      icon: HelpCircle,
      label: 'Ayuda',
      onClick: () => handleMenuClick('/ayuda')
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <img
          src={avatarUrl}
          alt={fullName}
          className="w-full h-full object-cover"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-slideDown">
          {/* User Info Block */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white truncate">
                  {fullName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Navigation Items (Mobile Only) */}
          <div className="mobile-sidebar-nav">
            {sidebarItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleMenuClick(item.path)}
                  className="mobile-sidebar-nav-item"
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Theme Switcher */}
            <div className="px-1 py-1">
              <ThemeSwitcher />
            </div>
          </div>

          {/* Logout Button */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors font-medium"
            >
              <LogOut size={16} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
