// src/app/layout/AppLayout.jsx
import Navbar from '../../shared/components/Navbar';
import Sidebar from '../../shared/components/sidebar/Sidebar';
import QuickSearch from '../../shared/components/QuickSearch';
import '../../shared/styles/index.css';
import { Outlet } from 'react-router-dom';

const AppLayout = ({ children }) => {
  return (
    <div className="app-container">
      {/* Navbar fijo arriba */}
      <Navbar />

      <div className="app-content">
        {/* Sidebar fijo a la izquierda */}
        <Sidebar />

        {/* Contenido principal con scroll */}
        <main className="main-content">
          <Outlet />
        </main>

        {/* QuickSearch fijo a la derecha */}
        <QuickSearch />
      </div>
    </div>
  );
};

export default AppLayout;