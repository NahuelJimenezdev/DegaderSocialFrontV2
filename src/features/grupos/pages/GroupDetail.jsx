import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGroupData } from '../hooks/useGroupData'
import SidebarGroup from '../components/SidebarGroup'
import GroupChat from '../components/GroupChat'
import GroupFeed from '../components/GroupFeed'
import GroupInfo from '../components/GroupInfo'
import GroupMembers from '../components/GroupMembers'
import GroupMultimedia from '../components/GroupMultimedia'
import GroupFiles from '../components/GroupFiles'
import GroupLinks from '../components/GroupLinks'
import GroupEvents from '../components/GroupEvents'
import GroupSettings from '../components/GroupSettings'

const GroupDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [activeSection, setActiveSection] = useState('feed')

  // Usar custom hook para obtener los datos del grupo
  const { groupData, loading } = useGroupData(id)

  const menuItems = [
    { id: 'feed', icon: 'article', label: 'Feed' },
    { id: 'chat', icon: 'chat', label: 'Chat' },
    { id: 'detail', icon: 'info', label: 'Detalle' },
    { id: 'members', icon: 'group', label: 'Miembros' },
    { id: 'multimedia', icon: 'collections', label: 'Multimedia' },
    { id: 'files', icon: 'folder', label: 'Archivos' },
    { id: 'links', icon: 'link', label: 'Enlaces' },
    { id: 'events', icon: 'event', label: 'Destacados' },
    { id: 'settings', icon: 'settings', label: 'Configuración' }
  ]

  // Renderizar el componente según la sección activa
  const renderSection = () => {
    switch (activeSection) {
      case 'feed':
        return <GroupFeed groupData={groupData} />
      case 'chat':
        return <GroupChat groupData={groupData} />
      case 'detail':
        return <GroupInfo groupData={groupData} />
      case 'members':
        return <GroupMembers groupData={groupData} />
      case 'multimedia':
        return <GroupMultimedia groupData={groupData} />
      case 'files':
        return <GroupFiles groupData={groupData} />
      case 'links':
        return <GroupLinks groupData={groupData} />
      case 'events':
        return <GroupEvents groupData={groupData} />
      case 'settings':
        return <GroupSettings groupData={groupData} />
      default:
        return <GroupFeed groupData={groupData} />
    }
  }

  // Mostrar loading mientras se cargan los datos
  if (loading || !groupData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl text-[#64748b] dark:text-[#94a3b8]">Cargando grupo...</p>
      </div>
    )
  }

  return (
    <div className="flex">
      {/* Sidebar del grupo - Fijo en la pantalla */}
      <div className="fixed left-251 top-0 w-64 z-10">
        <SidebarGroup
          groupData={groupData}
          navigate={navigate}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          menuItems={menuItems}
        />
      </div>

      {/* Contenido principal - Con margen para el sidebar */}
      <main className="flex-1 ml-64 flex flex-col">
        {renderSection()}
      </main>
    </div>
  )
}

export default GroupDetail
