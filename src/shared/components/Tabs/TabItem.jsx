const TabItem = ({ tab, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex gap-4 p-4 rounded-xl cursor-pointer transition-all ${
        isActive
          ? 'bg-primary text-white shadow-lg'
          : 'bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-transparent hover:border-primary/50 dark:hover:border-primary/50'
      }`}
    >
      {tab.icon && (
        <span className={`material-symbols-outlined text-2xl ${
          !isActive ? 'text-[#6B7280] dark:text-[#9CA3AF]' : ''
        }`}>
          {tab.icon}
        </span>
      )}
      <div>
        <p className={`font-bold ${
          !isActive ? 'text-[#1F2937] dark:text-[#F9FAFB]' : ''
        }`}>
          {tab.title}
        </p>
        {tab.description && (
          <p className={`text-sm ${
            isActive ? 'opacity-80' : 'text-[#6B7280] dark:text-[#9CA3AF]'
          }`}>
            {tab.description}
          </p>
        )}
      </div>
    </div>
  )
}

export default TabItem
