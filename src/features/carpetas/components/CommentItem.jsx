const CommentItem = ({ author, avatar, time, text }) => {
  return (
    <div className="flex gap-4">
      <img
        alt={`${author} avatar`}
        className="w-10 h-10 rounded-full object-cover"
        src={avatar}
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-bold text-sm text-[#1F2937] dark:text-[#F9FAFB]">
            {author}
          </p>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
            {time}
          </p>
        </div>
        <p className="text-sm text-[#1F2937] dark:text-[#F9FAFB] mt-1">
          {text}
        </p>
      </div>
    </div>
  )
}

export default CommentItem


