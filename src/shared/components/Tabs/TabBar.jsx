import TabItem from './TabItem'

const TabBar = ({ tabs, activeTab, onTabChange, layout = 'grid', columns = 3 }) => {
  const layoutClass = layout === 'grid'
    ? `grid grid-cols-${columns} sm:grid-cols-2 md:grid-cols-${columns} gap-4`
    : 'flex gap-2 flex-wrap'

  return (
    <div className={layoutClass}>
      {tabs.map(tab => (
        <TabItem
          key={tab.id}
          tab={tab}
          isActive={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        />
      ))}
    </div>
  )
}

export default TabBar
