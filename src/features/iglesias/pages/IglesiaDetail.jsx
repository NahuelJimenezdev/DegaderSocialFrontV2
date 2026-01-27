import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useIglesiaData } from '../hooks/useIglesiaData';
import IglesiaSidebar from '../components/IglesiaSidebar';
import IglesiaInfo from '../components/IglesiaInfo';
import IglesiaMembers from '../components/IglesiaMembers';
import IglesiaChat from '../components/IglesiaChat';
import IglesiaEvents from '../components/IglesiaEvents';

import IglesiaMultimedia from '../components/IglesiaMultimedia';
import IglesiaHeader from '../components/IglesiaHeader';
import IglesiaSettings from '../components/IglesiaSettings';
import IglesiaComentarios from '../components/IglesiaComentarios';

const IglesiaDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('info');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { iglesiaData, loading, refetch } = useIglesiaData(id);

  // Verificar si el usuario es miembro o pastor
  const isPastor = iglesiaData?.pastorPrincipal?._id === user?._id ||
    iglesiaData?.pastorPrincipal === user?._id;

  const isMember = iglesiaData?.miembros?.some(m => {
    const memberId = m._id || m;
    return memberId.toString() === user?._id?.toString();
  });

  const hasAccess = isPastor || isMember;

  // Menú completo para miembros y pastor
  const allMenuItems = [
    { id: 'info', icon: 'info', label: 'Información' },
    { id: 'comentarios', icon: 'forum', label: 'Comentarios' },
    { id: 'members', icon: 'group', label: 'Miembros' },
    { id: 'chat', icon: 'chat', label: 'Chat' },
    { id: 'events', icon: 'event', label: 'Reuniones' },
    { id: 'multimedia', icon: 'collections', label: 'Multimedia' },
    { id: 'settings', icon: 'settings', label: 'Configuración' },
  ];

  // Menú limitado para visitantes (solo información y comentarios para leer)
  const visitorMenuItems = [
    { id: 'info', icon: 'info', label: 'Información' },
    { id: 'comentarios', icon: 'forum', label: 'Comentarios' },
  ];

  const menuItems = hasAccess ? allMenuItems : visitorMenuItems;

  // Si no tiene acceso y intenta ver otra sección restringida, redirigir a info
  useEffect(() => {
    // Permitir acceso a info y comentarios para visitantes
    const publicSections = ['info', 'comentarios'];
    if (!hasAccess && !publicSections.includes(activeSection)) {
      setActiveSection('info');
    }
  }, [hasAccess, activeSection]);

  const renderSection = () => {
    switch (activeSection) {
      case 'info':
        return <IglesiaInfo iglesiaData={iglesiaData} />;
      case 'comentarios':
        return <IglesiaComentarios iglesiaData={iglesiaData} />;
      case 'members':
        return <IglesiaMembers iglesiaData={iglesiaData} refetch={refetch} user={user} />;
      case 'chat':
        return <IglesiaChat iglesiaData={iglesiaData} user={user} />;
      case 'events':
        return <IglesiaEvents iglesiaData={iglesiaData} />;
      case 'multimedia':
        return <IglesiaMultimedia iglesiaData={iglesiaData} refetch={refetch} />;
      case 'settings':
        return <IglesiaSettings iglesiaData={iglesiaData} refetch={refetch} />;
      default:
        return <IglesiaInfo iglesiaData={iglesiaData} />;
    }
  };

  if (loading || !iglesiaData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Cargando iglesia...</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Toggle - Ocultar en chat para evitar duplicados */}
      {isMobile && activeSection !== 'chat' && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-20 left-4 z-[60] p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <span className="material-symbols-outlined text-2xl text-gray-700 dark:text-gray-300">
            {sidebarOpen ? 'close' : 'menu'}
          </span>
        </button>
      )}

      {/* Backdrop para móvil */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[140]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar de Iglesia - Reemplaza al sidebar global */}
      <div
        className={`
          fixed top-[65px] bottom-0 w-[280px] bg-white dark:bg-gray-800 
          transition-transform duration-300 ease-in-out lg:transition-none
          ${isMobile
            ? `right-0 z-[150] sidebar-right-mobile ${sidebarOpen ? 'open' : ''}`
            : 'left-0 z-40 translate-x-0'}
        `}
      >
        <IglesiaSidebar
          iglesiaData={iglesiaData}
          activeSection={activeSection}
          setActiveSection={(section) => {
            setActiveSection(section);
            setSidebarOpen(false);
          }}
          menuItems={menuItems}
          isMobile={isMobile}
        />
      </div>

      {/* Main Content */}
      <div className={`w-full h-full overflow-y-auto overflow-x-hidden scrollbar-thin ${activeSection === 'chat' ? '' : 'mb-mobile-67'}`}>
        {activeSection === 'info' && <IglesiaHeader iglesia={iglesiaData} user={user} />}
        <div className={activeSection === 'chat' ? 'h-full relative z-[100]' : 'p-4 md:p-8 pt-0'}>
          {activeSection === 'chat' ? (
            <IglesiaChat
              iglesiaData={iglesiaData}
              user={user}
              setSidebarOpen={setSidebarOpen}
              setActiveSection={setActiveSection}
              isMobile={isMobile}
            />
          ) : (
            renderSection()
          )}
        </div>
      </div>
    </>
  );
};

export default IglesiaDetail;


