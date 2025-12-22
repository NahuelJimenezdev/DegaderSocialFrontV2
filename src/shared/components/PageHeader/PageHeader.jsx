const PageHeader = ({ icon, title, subtitle, actions }) => {
  return (
    <div className="flex items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-5xl text-primary">{icon}</span>
        <div className="flex flex-col">
          <p className="text-[#1F2937] dark:text-[#F9FAFB] text-4xl font-black leading-tight tracking-[-0.033em]">
            {title}
          </p>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] text-base font-normal leading-normal">
            {subtitle}
          </p>
        </div>
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  )
}

export default PageHeader


