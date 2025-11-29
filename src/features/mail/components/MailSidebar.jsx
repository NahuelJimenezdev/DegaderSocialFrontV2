import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { getAvatarUrl } from "../../../shared/utils/avatarUtils";
import styles from "../styles/MailSidebar.module.css";

const menuItems = [
  { id: "inbox", icon: "inbox", label: "Recibidos" },
  { id: "starred", icon: "star", label: "Destacados" },
  { id: "sent", icon: "send", label: "Enviados" },
  { id: "drafts", icon: "drafts", label: "Borradores" },
  { id: "trash", icon: "delete", label: "Papelera" },
];

export default function MailSidebar({ activeSection, onSelectSection, onCompose }) {
  const { user } = useAuth();
  const avatarUrl = getAvatarUrl(user?.social?.fotoPerfil);

  return (
    <aside className={styles.sidebar}>
      {/* Header */}
      <div className={styles.sidebarHeader}>
        <div
          className={styles.avatar}
          style={{
            backgroundImage: `url('${avatarUrl}')`,
          }}
        />
        <div>
          <h1>Church Mail</h1>
          <p>Bandeja de Entrada</p>
        </div>
      </div>

      {/* Botón Redactar */}
      <button onClick={onCompose} className={styles.composeBtn}>
        <span className="material-symbols-outlined">edit</span>
        <span>Redactar</span>
      </button>

      {/* Menú */}
      <div className={styles.menu}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectSection(item.id)}
            className={`${styles.menuBtn} ${activeSection === item.id ? styles.active : ""}`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button className={styles.footerBtn}>
          <span className="material-symbols-outlined">settings</span>
          <span>Ajustes</span>
        </button>
      </div>
    </aside>
  );
}
