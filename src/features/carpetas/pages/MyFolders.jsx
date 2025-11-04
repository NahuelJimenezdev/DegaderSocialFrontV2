import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Card from '../../../shared/components/Card/Card'
import PageHeader from '../../../shared/components/PageHeader/PageHeader'
import TabBar from '../../../shared/components/Tabs/TabBar'
import SearchInput from '../../../shared/components/Search/SearchInput'
import ViewToggle from '../../../shared/components/ViewToggle/ViewToggle'
import data from '../../../shared/json/CardsFolders.json'
import groupData from '../../../shared/json/CardsFoldersGroup.json'
import instData from '../../../shared/json/CardsFoldersInstitutional.json'

const MyFolders = () => {
  const navigate = useNavigate()
  const [view, setView] = useState('Grid')
  const [section, setSection] = useState('personal')
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = [
    {
      id: 'personal',
      icon: 'folder',
      title: 'Mis Carpetas',
      description: 'Carpetas personales privadas'
    },
    {
      id: 'group',
      icon: 'group',
      title: 'Carpetas Grupales',
      description: 'Carpetas compartidas con grupos'
    },
    {
      id: 'institutional',
      icon: 'lock',
      title: 'Institucionales',
      description: 'Carpetas oficiales de la iglesia'
    }
  ]

  const getCurrentData = () => {
    switch (section) {
      case 'personal':
        return data
      case 'group':
        return groupData
      case 'institutional':
        return instData
      default:
        return data
    }
  }

  const handleCardClick = (folder) => {
    const prefix = section === 'personal' ? '' : section === 'group' ? 'g-' : 'i-'
    navigate(`/Mis_carpetas/${prefix}${folder.id}`)
  }

  const gridClasses = view === 'Grid'
    ? 'grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6'

  return (
    <main className="flex-1 p-8">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
        {/* Page Header */}
        <PageHeader
          icon="folder_open"
          title="Mis Carpetas"
          subtitle="Organiza y comparte tus documentos y recursos"
        />

        {/* Filter Tabs */}
        <TabBar
          tabs={tabs}
          activeTab={section}
          onTabChange={setSection}
          layout="grid"
          columns={3}
        />

        {/* Search and View Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SearchInput
            placeholder="Buscar carpetas…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <ViewToggle
            view={view}
            onViewChange={setView}
            options={['Grid', 'List']}
          />
        </div>

        {/* Folders Grid */}
        <div className={gridClasses}>
          {getCurrentData().map(folder => (
            <Card
              key={folder.id}
              title={folder.title}
              subtitle={folder.subtitle}
              thumbnail={folder.thumbnail}
              icon={folder.iconMain}
              iconBody={folder.iconFolder}
              color={folder.color}
              overlayText={folder.lastUpdateText}
              timeAgo={folder.timeAgo}
              onClick={() => handleCardClick(folder)}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

export default MyFolders
