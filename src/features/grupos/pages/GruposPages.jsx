import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../../shared/components/Card/Card'
import PageHeader from '../../../shared/components/PageHeader/PageHeader'
import TabBar from '../../../shared/components/Tabs/TabBar'
import SearchInput from '../../../shared/components/Search/SearchInput'
import ViewToggle from '../../../shared/components/ViewToggle/ViewToggle'
import myGroups from '../../../shared/json/MyGroups.json'
import joinGroups from '../../../shared/json/JoinGroups.json'

const GruposPages = () => {
  const navigate = useNavigate()
  const [section, setSection] = useState('my-groups')
  const [view, setView] = useState('Grid')
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = [
    {
      id: 'join-groups',
      icon: 'group_add',
      title: 'Grupos para unirse',
      description: 'Explora y únete a nuevos grupos'
    },
    {
      id: 'my-groups',
      icon: 'groups',
      title: 'Mis grupos',
      description: 'Comunidades en las que participas'
    }
  ]

  const groups = section === 'my-groups' ? myGroups : joinGroups

  const handleCardClick = (group) => {
    if (section === 'my-groups') {
      navigate(`/Mis_grupos/${group.id}`)
    }
  }

  const gridClasses = view === 'Grid'
    ? 'grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
    : 'grid grid-cols-1 gap-4'

  return (
    <main className="flex-1 p-8">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
        {/* Page Header */}
        <PageHeader
          icon="groups"
          title="Mis Grupos"
          subtitle="Explora y participa en comunidades relevantes"
        />

        {/* Filter Tabs */}
        <TabBar
          tabs={tabs}
          activeTab={section}
          onTabChange={setSection}
          layout="grid"
          columns={2}
        />

        {/* Search and View Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SearchInput
            placeholder="Buscar grupos…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <ViewToggle
            view={view}
            onViewChange={setView}
            options={['Grid', 'List']}
          />
        </div>

        {/* Groups Grid */}
        <div className={gridClasses}>
          {groups.map(group => (
            <Card
              key={group.id}
              title={group.title}
              subtitle={group.desc}
              thumbnail={group.thumbnail}
              icon={group.icon}
              color={group.color}
              overlayText={group.date}
              timeAgo={group.members}
              onClick={() => handleCardClick(group)}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

export default GruposPages
