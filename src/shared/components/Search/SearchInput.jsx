const SearchInput = ({
  placeholder = "Buscar...",
  value,
  onChange,
  icon = "search"
}) => {
  return (
    <div className="flex-grow max-w-md">
      <label className="flex flex-col min-w-40 h-12 w-full">
        <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
          <div className="text-[#6B7280] dark:text-[#9CA3AF] flex bg-white dark:bg-[#1F2937] items-center justify-center pl-4 rounded-l-lg border border-r-0 border-[#E5E7EB] dark:border-[#1F2937]">
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <input
            value={value}
            onChange={onChange}
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-[#1F2937] dark:text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-primary border-l-0 border border-[#E5E7EB] dark:border-[#1F2937] bg-white dark:bg-[#1F2937] h-full placeholder:text-[#6B7280] dark:placeholder:text-[#9CA3AF] px-4 text-base font-normal leading-normal"
            placeholder={placeholder}
          />
        </div>
      </label>
    </div>
  )
}

export default SearchInput
