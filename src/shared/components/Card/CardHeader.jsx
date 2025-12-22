const CardHeader = ({ thumbnail, color, icon, overlayText, timeAgo }) => {
  return (
    <div className={`relative h-32 bg-gradient-to-br ${color} flex items-center justify-center text-white`}>
      {thumbnail && (
        <img
          alt="Card preview"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          src={thumbnail}
        />
      )}
      {icon && (
        <span className="material-symbols-outlined text-6xl opacity-80 relative z-10">
          {icon}
        </span>
      )}
      {overlayText && (
        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent text-xs text-white z-10">
          <p className="font-medium truncate">{overlayText}</p>
          {timeAgo && <p className="opacity-80">{timeAgo}</p>}
        </div>
      )}
    </div>
  )
}

export default CardHeader


