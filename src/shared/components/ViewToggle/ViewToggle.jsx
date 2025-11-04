const ViewToggle = ({ view, onViewChange, options = ['Grid', 'List'] }) => {
  return (
    <div className="flex h-10 items-center justify-center rounded-lg bg-white dark:bg-[#1F2937] p-1 border border-[#E5E7EB] dark:border-transparent">
      {options.map(option => (
        <label
          key={option}
          onClick={() => onViewChange(option)}
          className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-4 text-sm font-medium leading-normal ${
            view === option ? 'bg-primary text-white' : 'text-[#1F2937] dark:text-[#F9FAFB]'
          }`}
        >
          <span className="truncate">{option}</span>
          <input
            checked={view === option}
            onChange={() => onViewChange(option)}
            className="invisible w-0"
            name="view-toggle"
            type="radio"
            value={option}
          />
        </label>
      ))}
    </div>
  )
}

export default ViewToggle
