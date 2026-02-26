import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Building2, Folder } from 'lucide-react';
import './BottomNavbar.css';


const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: Home,
      label: 'Inicio',
      path: '/',
      className: 'bottom-nav-home'
    },
    {
      icon: Search,
      label: 'Buscar',
      path: '/Amigos',
      className: 'bottom-nav-search'
    },
    {
      icon: () => <span className="material-symbols-outlined">groups</span>,
      label: 'Grupos',
      path: '/Mis_grupos',
      className: 'bottom-nav-groups'
    },
    {
      icon: Building2,
      label: 'Institución',
      path: '/Mi_iglesia',
      className: 'bottom-nav-church'
    },
    {
      icon: Folder,
      label: 'Carpetas',
      path: '/Mis_carpetas',
      className: 'bottom-nav-folders'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="bottom-navbar bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-[0_-2px_8px_rgba(0,0,0,0.1)] transition-colors duration-300">
      {navItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <button
            key={index}
            onClick={() => handleNavigation(item.path)}
            className={`bottom-navbar-item ${item.className} ${isActive
              ? 'text-indigo-600 dark:text-indigo-400 active'
              : 'text-gray-500 dark:text-gray-400'
              } transition-all duration-200`}
            aria-label={item.label}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavbar;


