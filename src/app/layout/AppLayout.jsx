// src/app/layout/AppLayout.jsx
import Navbar from '../../shared/components/Navbar';
import Sidebar from '../../shared/components/sidebar/Sidebar';
import QuickSearch from '../../shared/components/QuickSearch';
import '../../shared/styles/index.css';
import { Outlet, useLocation } from 'react-router-dom';

const AppLayout = () => {
  const location = useLocation();

  // Define las rutas donde NO quieres mostrar el QuickSearch
  const hideQuickSearchRoutes = [
    /^\/Mis_grupos\/\d+$/,  // Para /Mis_grupos/1, /Mis_grupos/2, etc.
    /^\/Mi_iglesia\//,  // Para /Mi_iglesia/1, /Mi_iglesia/2, etc.
    /^\/Mis_Carpetas\/\d+$/,      // Para /Mis_Carpetas/1, /Mis_Carpetas/2, etc.
    // Agrega más rutas aquí según necesites
  ];

  // Verifica si la ruta actual coincide con alguna de las rutas donde ocultar
  const shouldHideQuickSearch = hideQuickSearchRoutes.some(pattern =>
    pattern.test(location.pathname)
  );
  return (
    <div className="app-container">
      {/* Navbar fijo arriba */}
      <Navbar />

      <div className="app-content">
        {/* Sidebar fijo a la izquierda */}
        <Sidebar />

        {/* Contenido principal con scroll */}
        <main className={`main-content ${shouldHideQuickSearch ? 'full-width' : ''}`}>
          <Outlet />
        </main>

        {/* QuickSearch fijo a la derecha */}
        {!shouldHideQuickSearch && <QuickSearch />}
      </div>
    </div>
  );
};

export default AppLayout;