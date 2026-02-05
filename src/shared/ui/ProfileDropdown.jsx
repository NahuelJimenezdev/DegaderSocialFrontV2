import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Settings, Bell, Lock, HelpCircle, LogOut, Home, Users, MessageCircle, Video, Building2, Folder, User, Megaphone, Star, Shield, ShieldAlert } from 'lucide-react';
import { useUserRole } from '../hooks/useUserRole';
import { getUserAvatar } from '../utils/avatarUtils';
import { getNombreCompleto } from '../utils/userUtils';
import ThemeSwitcher from '../components/ThemeSwitcher';
import IOSAlert from '../components/IOSAlert';
import './ProfileDropdown.css';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showComingSoonAlert, setShowComingSoonAlert] = useState(false);
  const { user, logout } = useAuth();
  const { canModerate, isFounder } = useUserRole();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Obtener nombre completo del usuario
  const fullName = useMemo(() => getNombreCompleto(user), [user]);

  // Memoizar avatar URL usando la función centralizada
  const avatarUrl = useMemo(() => getUserAvatar(user), [user]);

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

  const handleMenuClick = (path, state = null) => {
    navigate(path, { state });
    setIsOpen(false);
  };

  // Sidebar navigation items (visible on mobile only)
  const sidebarItems = [
    { icon: Home, label: 'Inicio', path: '/' },
    { icon: Users, label: 'Amigos', path: '/amigos' },
    { icon: Star, label: 'Favoritos', path: '/favoritos' },
    { icon: MessageCircle, label: 'Mensajes', path: '/mensajes' },
    { icon: Video, label: 'Mis Reuniones', path: '/Mis_reuniones' },
    { icon: () => <span className="material-symbols-outlined">groups</span>, label: 'Grupos', path: '/Mis_grupos' },
    { icon: Folder, label: 'Mis Carpetas', path: '/Mis_carpetas' },
    { icon: Building2, label: 'Iglesias', path: '/Mi_iglesia' },
    { icon: () => <span className="material-symbols-outlined">volunteer_activism</span>, label: 'Fundación', path: '/fundacion' },
    { icon: User, label: 'Perfil', path: '/Mi_perfil' }
  ];
  // Agregar links de administración para móvil
  if (canModerate) {
    sidebarItems.push({ icon: Shield, label: 'Moderación', path: '/moderador' });
  }

  if (isFounder()) {
    sidebarItems.push({ icon: ShieldAlert, label: 'Gestión Usuarios', path: '/founder/users' });
  }

  const menuItems = [
    {
      icon: Megaphone,
      label: '🎯 Publicidad',
      onClick: () => {
        // Redirigir según el rol del usuario (Check robusto V2)
        const isFounder =
          user?.role === 'Founder' ||
          user?.rol === 'Founder' ||
          user?.seguridad?.rolSistema === 'Founder' ||
          user?.seguridad?.rol === 'Founder';

        handleMenuClick(isFounder ? '/admin/publicidad' : '/publicidad');
      },
      highlight: true // Para destacarlo visualmente
    },
    {
      icon: Settings,
      label: 'Configuración',
      onClick: () => {
        setIsOpen(false);
        setShowComingSoonAlert(true);
      }
    },
    {
      icon: Bell,
      label: 'Notificaciones',
      onClick: () => handleMenuClick('/notificaciones')
    },
    {
      icon: Lock,
      label: 'Privacidad',
      onClick: () => {
        setIsOpen(false);
        setShowComingSoonAlert(true);
      }
    },
    {
      icon: HelpCircle,
      label: 'Ayuda',
      onClick: () => {
        setIsOpen(false);
        setShowComingSoonAlert(true);
      }
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
          onError={(e) => {
            // Si la imagen falla, usar un avatar con iniciales
            e.target.onerror = null; // Prevenir loop infinito
            const initials = fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'Usuario')}&background=3b82f6&color=fff&size=128`;
          }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-y-auto max-h-[75vh] animate-slideDown">
          {/* User Info Block */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'Usuario')}&background=3b82f6&color=fff&size=128`;
                }}
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
            {sidebarItems
              .filter(item => item.label !== 'Amigos') // Ocultar Amigos (se accede por icono de búsqueda)
              .map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleMenuClick(item.path, item.state)}
                    className="mobile-sidebar-nav-item dark:text-white dark:hover:bg-gray-700"
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
                  className={`flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors ${item.highlight
                    ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 hover:from-indigo-500/20 hover:to-purple-500/20 font-semibold'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
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

      {/* Coming Soon Alert */}
      <IOSAlert
        isOpen={showComingSoonAlert}
        title="Próximamente"
        message="Estamos trabajando en esta funcionalidad. ¡Pronto estará disponible!"
        onJoin={() => setShowComingSoonAlert(false)}
        onCancel={() => setShowComingSoonAlert(false)}
        mainActionText="Entendido"
        isPending={false}
      />
    </div>
  );
};

export default ProfileDropdown;


