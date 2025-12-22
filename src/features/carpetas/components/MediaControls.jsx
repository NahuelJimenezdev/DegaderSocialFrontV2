const MediaControls = ({ onVideoClick, onAudioClick, onPdfClick, variant = 'horizontal' }) => {
  if (variant === 'horizontal') {
    return (
      <div className="flex items-center gap-2 border-y border-[#E5E7EB] dark:border-[#374151] py-3">
        <button
          onClick={onVideoClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium"
        >
          <span className="material-symbols-outlined">videocam</span>
          <span>Video</span>
        </button>
        <button
          onClick={onAudioClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium text-[#1F2937] dark:text-[#F9FAFB]"
        >
          <span className="material-symbols-outlined">headset</span>
          <span>Audio</span>
        </button>
        <button
          onClick={onPdfClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium text-[#1F2937] dark:text-[#F9FAFB]"
        >
          <span className="material-symbols-outlined">picture_as_pdf</span>
          <span>PDF</span>
        </button>
      </div>
    )
  }

  // Variant 'vertical'
  return (
    <div className="flex items-center gap-4 py-4 border-y border-[#E5E7EB] dark:border-[#374151]">
      <button
        onClick={onVideoClick}
        className="flex flex-col items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors"
      >
        <span className="material-symbols-outlined text-5xl">play_circle</span>
        <span className="text-sm font-medium">Video</span>
      </button>

      <button
        onClick={onAudioClick}
        className="flex flex-col items-center gap-1 text-green-500 hover:text-green-600 transition-colors"
      >
        <span className="material-symbols-outlined text-5xl">headphones</span>
        <span className="text-sm font-medium">Audio</span>
      </button>

      <button
        onClick={onPdfClick}
        className="flex flex-col items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
      >
        <span className="material-symbols-outlined text-5xl">description</span>
        <span className="text-sm font-medium">PDF</span>
      </button>
    </div>
  )
}

export default MediaControls


