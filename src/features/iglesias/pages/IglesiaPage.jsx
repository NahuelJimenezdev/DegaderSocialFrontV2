import { useState } from 'react'
import { Building2, Calendar, Users, FolderOpen, Mail } from 'lucide-react'
import styles from '../styles/IglesiaPage.module.css'
import IglesiaInfo from '../components/IglesiaInfo'
import IglesiaEventos from '../components/IglesiaEventos'
import IglesiaMiembros from '../components/IglesiaMiembros'
import IglesiaCarpetas from '../components/IglesiaCarpetas'
import IglesiaCorreo from '../components/IglesiaCorreo'
import mockUser from '../../../shared/data/church/mockChurchUser.json'

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

  // Renderizar contenido según pestaña activa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <IglesiaInfo user={mockUser} />
      case 'events':
        return <IglesiaEventos />
      case 'members':
        return <IglesiaMiembros />
      case 'folders':
        return <IglesiaCarpetas />
      case 'mail':
        return <IglesiaCorreo />
      default:
        return <IglesiaInfo user={mockUser} />
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
