import { Building2, Folder, Home, Settings, User, Users } from "lucide-react";
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
            <NavItem to="/Mis_grupos" icon={Users} label="Grupos" />
          </div>
          <div className="sidebar-items">
            <NavItem to="/iglesia" icon={Building2} label="Iglesia" />
          </div>
          <div className="sidebar-items">
            <NavItem to="/Mis_carpetas" icon={Folder} label="Mis Carpetas" />
          </div>
          <div className="sidebar-items">
            <NavItem to="/perfil" icon={User} label="Perfil" />
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