// src/shared/components/Navbar.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo y marca */}
        <div className="navbar-logo">
          <h1>Degader</h1>
        </div>

        {/* Links de navegación */}
        <div className="navbar-links">
          {/* Aquí irán tus links */}
        </div>

        {/* Acciones de usuario */}
        <div className="navbar-actions">
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm">
                {user.nombre} {user.apellido}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;