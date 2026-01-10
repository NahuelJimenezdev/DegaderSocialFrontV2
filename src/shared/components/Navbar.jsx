import { useNavigate } from 'react-router-dom';
import { Mail, Shield } from 'lucide-react';
import SearchBar from '../../features/buscador/components/SearchBar';
import NotificationsDropdown from '../../features/notificaciones/components/NotificationsDropdown';
import ProfileDropdown from '../ui/ProfileDropdown';
import { useAuth } from '../../context/AuthContext';
import { useMessageCounter } from '../../hooks/useMessageCounter';
import { useUserRole } from '../hooks/useUserRole';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { canModerate } = useUserRole();
  const unreadMessages = useMessageCounter(user?._id || user?.id);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo + SearchBar */}
          <div className="flex items-center gap-4 flex-1">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex-shrink-0"
            >
              Degader
            </button>

            {/* SearchBar - Hidden on mobile via CSS */}
            <div className="navbar-search-container">
              <SearchBar />
            </div>
          </div>

          {/* Right Section: Notifications + Messages + Profile */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <NotificationsDropdown />

            {/* Moderation (only for moderators) */}
            {canModerate && (
              <button
                onClick={() => navigate('/moderacion')}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
                aria-label="Moderación"
                title="Panel de Moderación"
              >
                <Shield size={20} />
              </button>
            )}

            {/* Messages */}
            <button
              onClick={() => navigate('/mensajes')}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300 relative"
              aria-label="Mensajes"
            >
              <Mail size={20} />
              {unreadMessages > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadMessages > 99 ? '99+' : unreadMessages}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <ProfileDropdown />
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;


