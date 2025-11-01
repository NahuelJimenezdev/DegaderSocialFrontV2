// src/app/layout/AppLayout.jsx
import Navbar from '../../shared/components/Navbar';
import Sidebar from '../../shared/components/sidebar/Sidebar';
import QuickSearch from '../../shared/components/QuickSearch';
import '../../shared/styles/index.css';
import { Outlet, useLocation } from 'react-router-dom';
import { hideQuickSearchRoutes } from '../../shared/config/hiddenRoutes';

const AppLayout = () => {
  const location = useLocation();

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