// src/app/layout/AppLayout.jsx
import Sidebar from '../../shared/components/sidebar/Sidebar';
import QuickSearch from '../../shared/components/QuickSearch';
import '../../shared/styles/index.css';
import { Outlet, useLocation } from 'react-router-dom';
import { hideQuickSearchRoutes, hideSidebarRoutes } from '../../shared/config/hiddenRoutes';
import Navbar from '../../shared/components/Navbar';

const AppLayout = () => {
  const location = useLocation();

  // Verifica si la ruta actual coincide con alguna de las rutas donde ocultar
  const shouldHideQuickSearch = hideQuickSearchRoutes.some(pattern =>
    pattern.test(location.pathname)
  );

  const shouldHideSidebar = hideSidebarRoutes.some(pattern =>
    pattern.test(location.pathname)
  );

  return (
    <div className="app-container">
      {/* Navbar fijo arriba */}
      <Navbar />

      <div className="app-content">
        {/* Sidebar fijo a la izquierda - se oculta en ciertas rutas */}
        {!shouldHideSidebar && <Sidebar />}

        {/* Contenido principal con scroll */}
        <main className={`main-content ${shouldHideQuickSearch ? 'full-width' : ''} ${shouldHideSidebar ? 'no-sidebar' : ''}`}>
          <Outlet />
        </main>

        {/* QuickSearch fijo a la derecha */}
        {!shouldHideQuickSearch && <QuickSearch />}
      </div>
    </div>
  );
};

export default AppLayout;