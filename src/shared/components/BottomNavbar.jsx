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
    <nav className="bottom-navbar">
      {navItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <button
            key={index}
            onClick={() => handleNavigation(item.path)}
            className={`bottom-navbar-item ${item.className} ${isActive ? 'active' : ''}`}
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


