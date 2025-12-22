const CardBody = ({ title, subtitle, icon, children }) => {
  return (
    <div className="p-4 flex items-center gap-3">
      {icon && (
        <span className="material-symbols-outlined text-primary text-3xl">
          {icon}
        </span>
      )}
      <div className="flex-1">
        <h4 className="font-bold text-lg text-[#1F2937] dark:text-[#F9FAFB]">
          {title}
        </h4>
        {subtitle && (
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}

export default CardBody


