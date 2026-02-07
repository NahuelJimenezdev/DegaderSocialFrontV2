import { Building2, Folder, Home, Settings, User, Users, MessageCircle, Video, Star, Shield, ShieldAlert, HelpCircle } from "lucide-react";
import { useState } from 'react';
import NavItem from "../navItem/NavItem";
import { useAuth } from '../../../context/AuthContext';
import { usePendingMessageCounter } from '../../../hooks/usePendingMessageCounter';
import { useUserRole } from "../../hooks/useUserRole";
import IOSAlert from '../IOSAlert';
import { useOnboardingContext } from '../../../features/onboarding/components/OnboardingProvider';
import styles from './styles/Sidebar.module.css';
import '../../../shared/styles/sidebar.style.css';

const Sidebar = () => {
  const { user } = useAuth();
  const pendingCount = usePendingMessageCounter(user?._id || user?.id);
  const { canModerate, isFounder } = useUserRole();
  const [showComingSoonAlert, setShowComingSoonAlert] = useState(false);
  const { restartTour } = useOnboardingContext();

  return (
    <>
      <aside className="sidebar">
        {/* Contenedor Superior: Menú Scrolleable */}
        <div className="sidebar-menu">
          <div className="sidebar-items">
            <NavItem to="/" icon={Home} label="Inicio" />
          </div>
          <div className="sidebar-items">
            <NavItem to="/amigos" icon={Users} label="Amigos" />
          </div>
          <div className="sidebar-items">
            <NavItem to="/favoritos" icon={Star} label="Favoritos" />
          </div>
          <div className="sidebar-items">
            <NavItem to="/mensajes" icon={MessageCircle} label="Mensajes" badge={pendingCount} />
          </div>
          <div className="sidebar-items">
            <NavItem to="/Mis_reuniones" icon={Video} label="Mis Reuniones" />
          </div>
          <div className="sidebar-items">
            <NavItem to="/Mis_grupos" icon={() => <span className="material-symbols-outlined">groups</span>} label="Grupos" />
          </div>
          <div className="sidebar-items">
            <NavItem to="/Mis_carpetas" icon={Folder} label="Mis Carpetas" />
          </div>

          <div className="sidebar-items">
            <NavItem to="/Mi_iglesia" icon={Building2} label="Iglesias" />
          </div>
          <div className="sidebar-items">
            <NavItem to="/fundacion" icon={() => <span className="material-symbols-outlined">volunteer_activism</span>} label="Fundación" />
          </div>

          <div className="sidebar-items">
            <NavItem to="/Mi_perfil" icon={User} label="Perfil" />
          </div>

          {/* Paneles de Administración */}
          {canModerate && (
            <div className="sidebar-items">
              <NavItem to="/moderador" icon={Shield} label="Moderación" />
            </div>
          )}

          {isFounder() && (
            <div className="sidebar-items">
              <NavItem to="/founder/users" icon={ShieldAlert} label="Gestión Usuarios" />
            </div>
          )}
        </div>

        {/* Contenedor Inferior: Configuración Fija */}
        <div className="sidebar-footer">
          <div className="border-t border-gray-200 dark:border-gray-700 mx-4 mb-4"></div>
          <div className="sidebar-items px-4 pb-4">
            {/* Tour Guiado Button */}
            <button
              onClick={restartTour}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left mb-2"
              title="Reiniciar tour guiado"
            >
              <HelpCircle size={20} />
              <span className="text-sm">Tour Guiado</span>
            </button>

            {/* Configuración Button */}
            <button
              onClick={() => setShowComingSoonAlert(true)}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <Settings size={20} />
              <span className="text-sm">Configuración</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Coming Soon Alert */}
      <IOSAlert
        isOpen={showComingSoonAlert}
        title="Próximamente"
        message="Estamos trabajando en esta funcionalidad. ¡Pronto estará disponible!"
        onJoin={() => setShowComingSoonAlert(false)}
        onCancel={() => setShowComingSoonAlert(false)}
        mainActionText="Entendido"
        isPending={false}
        showCancelButton={false}
        icon="construction"
      />
    </>
  );
};


export default Sidebar;
