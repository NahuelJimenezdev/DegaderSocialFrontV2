// src/app/layout/AppLayout.jsx
import Sidebar from '../../shared/components/sidebar/Sidebar';
import AdsSidebar from '../../shared/components/AdsSidebar';
import BottomNavbar from '../../shared/components/BottomNavbar';
import SuspendedAccountScreen from '../../shared/components/SuspendedAccount/SuspendedAccountScreen';
import '../../shared/styles/index.css';
import '../../shared/styles/layout.mobile.css';
import '../../shared/styles/ads.mobile.css';
import '../../shared/styles/tailwind-mobile-overrides.css';
import { Outlet, useLocation } from 'react-router-dom';
import { hideAdsSidebarRoutes, hideSidebarRoutes } from '../../shared/config/hiddenRoutes';
import Navbar from '../../shared/components/Navbar';
import { useSuspensionCheck } from '../../shared/hooks/useSuspensionCheck';

const AppLayout = () => {
  const location = useLocation();
  const { suspended, suspensionInfo, loading } = useSuspensionCheck();

  // Rutas permitidas para usuarios suspendidos: notificaciones y detalles del sistema
  const allowedSuspendedRoutes = ['/notificaciones', '/Sistema'];
  const isAllowedRoute = allowedSuspendedRoutes.some(route => location.pathname.startsWith(route));

  // Verifica si la ruta actual coincide con alguna de las rutas donde ocultar
  const shouldHideAdsSidebar = hideAdsSidebarRoutes.some(pattern =>
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
        <main className={`main-content ${shouldHideAdsSidebar ? 'full-width' : ''} ${shouldHideSidebar ? 'no-sidebar' : ''}`}>
          {/* Si está suspendido y NO está en una ruta permitida, mostrar pantalla de suspensión */}
          {suspended && !isAllowedRoute && !loading ? (
            <SuspendedAccountScreen suspensionInfo={suspensionInfo} />
          ) : (
            <Outlet />
          )}
        </main>

        {/* AdsSidebar fijo a la derecha */}
        {!shouldHideAdsSidebar && <AdsSidebar />}
      </div>

      {/* Bottom navbar - only visible on mobile */}
      <BottomNavbar />
    </div>
  );
};

export default AppLayout;

