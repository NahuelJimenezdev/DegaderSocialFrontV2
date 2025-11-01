import { useState } from 'react'
import { Building2, Calendar, Users, FolderOpen, Mail } from 'lucide-react'
import styles from '../styles/IglesiaPage.module.css'
import MailPage from '../../mail/pages/MailPage'

// Tabs principales
const tabs = [
  { id: 'overview', icon: Building2, label: 'Información General' },
  { id: 'events', icon: Calendar, label: 'Eventos' },
  { id: 'members', icon: Users, label: 'Miembros' },
  { id: 'folders', icon: FolderOpen, label: 'Carpetas Grupales' },
  { id: 'mail', icon: Mail, label: 'Correo Interno' }
]

export default function IglesiaPage() {
  const [activeTab, setActiveTab] = useState('overview')

  // 🧩 MockUp de usuario institucional
  const user = {
    rolUsuario: 'Director de Jóvenes',
    estructuraOrganizacional: {
      area: 'Ministerio Juvenil',
      nivel: 'Regional Norte'
    }
  }

  // 🔄 Render dinámico según pestaña activa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Bienvenido a tu Iglesia</h3>
            <p className={styles.cardSubtitle}>
              Aquí encontrarás toda la información y recursos de tu comunidad de fe.
            </p>

            {user?.estructuraOrganizacional && (
              <div className={styles.userInfo}>
                <h4 className={styles.sectionTitle}>Tu información institucional</h4>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <strong>Área:</strong> {user.estructuraOrganizacional.area}
                  </div>
                  <div className={styles.infoItem}>
                    <strong>Nivel:</strong> {user.estructuraOrganizacional.nivel}
                  </div>
                  <div className={styles.infoItem}>
                    <strong>Rol:</strong> {user.rolUsuario}
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 'events':
        return (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Eventos de la Iglesia</h3>
            <ul className={styles.list}>
              <li><strong>Retiro Juvenil:</strong> 15 - 17 Noviembre</li>
              <li><strong>Conferencia Regional:</strong> 5 Diciembre</li>
              <li><strong>Ayuno Congregacional:</strong> 12 Diciembre</li>
            </ul>
          </div>
        )

      case 'members':
        return (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Directorio de Miembros</h3>
            <ul className={styles.list}>
              <li>Juan Pérez — Líder de Alabanza</li>
              <li>Ana Gómez — Maestra de Escuela Dominical</li>
              <li>Carlos Ruiz — Coordinador de Jóvenes</li>
            </ul>
          </div>
        )

      case 'folders':
        return (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Carpetas Grupales</h3>
            <ul className={styles.list}>
              <li>📁 Recursos Juveniles</li>
              <li>📁 Material de Oración</li>
              <li>📁 Planes de Estudio Bíblico</li>
            </ul>
          </div>
        )

      case 'mail':
        return (
          <MailPage />
        )

      default:
        return null
    }
  }

  return (
    <div className={styles.iglesiaPage}>
      {/* Header */}
      {/* <div className="flex items-center gap-4 mb-8">
        <span className="material-symbols-outlined text-5xl text-primary">church</span>
        <div className="flex flex-col">
          <p className="text-[#1F2937] dark:text-[#F9FAFB] text-4xl font-black leading-tight tracking-[-0.033em]">
            Mi Iglesia
          </p>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-base font-normal leading-normal">
            Panel de administración y recursos institucionales
          </p>
        </div>
      </div> */}

      {/* Tabs */}
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div className={styles.content}>
        {renderTabContent()}
      </div>
    </div>
  )
}
