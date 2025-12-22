import { Building2, Folder, Home, Settings, User, Users, MessageCircle, Video } from "lucide-react";
import NavItem from "../navItem/NavItem";
import styles from './styles/Sidebar.module.css';

const Sidebar = () => {
  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-content">
          {/* Menú principal */}
          <div className="sidebar-items">
            <NavItem to="/" icon={Home} label="Inicio" />
          </div>
          <div className="sidebar-items">
            <NavItem to="/amigos" icon={Users} label="Amigos" />
          </div>
          <div className="sidebar-items">
            <NavItem to="/mensajes" icon={MessageCircle} label="Mensajes" />
          </div>
          <div className="sidebar-items">
            <NavItem to="/Mis_reuniones" icon={Video} label="Mis Reuniones" />
          </div>
          <div className="sidebar-items">
            <NavItem to="/Mis_grupos" icon={() => <span className="material-symbols-outlined">groups</span>} label="Grupos" />
          </div>
          <div className="sidebar-items">
            <NavItem to="/Mi_iglesia" icon={Building2} label="Institución" />
          </div>
          <div className="sidebar-items">
            <NavItem to="/Mis_carpetas" icon={Folder} label="Mis Carpetas" />
          </div>
          <div className="sidebar-items">
            <NavItem to="/Mi_perfil" icon={User} label="Perfil" />
          </div>
          {/* <div className="sidebar-items">
          </div> */}


          {/* Toggle tema oscuro */}
          <div className="sidebar-footer">
            <button className="theme-toggle">
              <NavItem to="/settings" icon={Settings} label="Configuración" />
              {/* <span>Dark</span> */}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};


export default Sidebar;

