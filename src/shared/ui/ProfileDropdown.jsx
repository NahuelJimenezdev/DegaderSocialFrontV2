import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Settings, Bell, Lock, HelpCircle, LogOut, Home, Users, MessageCircle, Video, Building2, Folder, User, Megaphone, Star, Shield, ShieldAlert, Compass, Smartphone, Activity } from 'lucide-react';
import { useUserRole } from '../hooks/useUserRole';
import { getUserAvatar } from '../utils/avatarUtils';
import { getNombreCompleto } from '../utils/userUtils';
import ThemeSwitcher from '../components/ThemeSwitcher';
import IOSAlert from '../components/IOSAlert';
import ProgressiveImage from '../components/ProgressiveImage';
import { useOnboardingContext } from '../../features/onboarding/components/OnboardingProvider';
import './ProfileDropdown.css';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showComingSoonAlert, setShowComingSoonAlert] = useState(false);
  const { user, logout } = useAuth();
  const { restartTour, isMobile } = useOnboardingContext();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const { canModerate, isFounder, hasPermission } = useUserRole();
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

    // Manejar prompt de instalación PWA
    const handleInstallPrompt = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    // Si ya está instalado o no es instalable
    if (window.matchMedia('(display-mode: standalone)').matches) {
        setShowInstallBtn(false);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, [isOpen]);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
        setShowInstallBtn(false);
    }
    setDeferredPrompt(null);
    setIsOpen(false);
  };

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

  if (isFounder() || hasPermission('security_dashboard_view')) {
    sidebarItems.push({ icon: Activity, label: 'Security Dashboard', path: '/admin/security-dashboard' });
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
      onClick: () => handleMenuClick('/configuracion')
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
      onClick: () => {
        setIsOpen(false);
        setShowComingSoonAlert(true);
      }
    }
  ];

  if (showInstallBtn) {
    menuItems.splice(1, 0, {
      icon: Smartphone,
      label: '📲 Descargar App',
      onClick: handleInstallApp,
      highlight: true
    });
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="profile-dropdown-trigger w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <ProgressiveImage
          src={avatarUrl}
          medium={user?.avatarObj?.medium}
          large={user?.avatarObj?.large}
          blurHash={user?.avatarObj?.blurHash}
          alt={fullName}
          className="w-full h-full object-cover"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-y-auto max-h-[75vh] animate-slideDown">
          {/* User Info Block */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <ProgressiveImage
                src={avatarUrl}
                medium={user?.avatarObj?.medium}
                large={user?.avatarObj?.large}
                blurHash={user?.avatarObj?.blurHash}
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
                    ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 colorMarcaDegader dark:text-indigo-400 hover:from-indigo-500/20 hover:to-purple-500/20 font-semibold'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}


            {/* Tour Guiado (Visible solo en Mobile) */}
            {isMobile && (
              <button
                onClick={() => {
                  restartTour();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Compass size={16} />
                <span>Reiniciar Tour Guiado</span>
              </button>
            )}

            <div className="menu-divider"></div>

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
        showCancelButton={false}
        icon="construction"
      />
    </div>
  );
};

export default ProfileDropdown;


