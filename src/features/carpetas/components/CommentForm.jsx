import { useState } from 'react'

const CommentForm = ({ currentUserAvatar, onSubmit }) => {
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    if (comment.trim() && onSubmit) {
      onSubmit(comment)
      setComment('')
    }
  }

  return (
    <div className="mt-auto pt-6 border-t border-[#E5E7EB] dark:border-[#374151]">
      <div className="flex items-start gap-4">
        <img
          alt="Current user avatar"
          className="w-10 h-10 rounded-full object-cover"
          src={currentUserAvatar || 'https://i.pravatar.cc/50?img=5'}
        />
        <div className="flex-1 flex flex-col gap-2">
          <textarea
            className="form-textarea w-full rounded-lg border-[#E5E7EB] dark:border-[#374151] bg-background-light dark:bg-[#111827] text-[#1F2937] dark:text-[#F9FAFB] placeholder:text-[#6B7280] dark:placeholder:text-[#9CA3AF] focus:ring-primary focus:border-primary transition"
            placeholder="Escribe un comentario..."
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <button
            onClick={handleSubmit}
            disabled={!comment.trim()}
            className="self-end flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="truncate">Publicar</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CommentForm


