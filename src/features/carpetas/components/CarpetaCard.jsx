import React from "react";

function CarpetaCard({
  title = "Estudios Bíblicos",
  subtitle = "PDFs y guías de estudio",
  image = "https://lh3.googleusercontent.com/aida-public/AB6AXuBw93nZzGc8FqU5VbYOQgMLSZwo__Yk3p3LwvFF43xIeNalVhZt3lU0yt9wSvVW6AarSsJeWaFpdoAmDC3xcZp8o0J4zyTurb4Eb3nRcwK2AotCpIewXZC16VmNHk6xt5ceQ92J21Sejal0s9WdCD9w_vMWhhSgqYP5sFndQPUGsiJwZnEB10yYQKFmzdA17iyjIwZpzJDI1TVpFMX21AGhwQyWaSCru-0c0UAFHX4DMyuR0XOxK6DlmAQox1G4PL6R228Ysb6lPSfk",
  highlight = 'Nuevo: "El Libro de Proverbios"',
  time = "Ayer",
  icon = "folder",
  iconColor = "text-green-600",
}) {
  return (
    <div
      className="flex flex-col bg-white dark:bg-[#1F2937] rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
    >
      <div className="relative h-32 bg-gradient-to-br from-green-500/80 to-green-400 flex items-center justify-center text-white">
        <img
          alt="Preview"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          src={image}
        />
        <span className="material-symbols-outlined text-6xl opacity-80 relative z-10">description</span>
        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent text-xs text-white z-10">
          <p className="font-medium truncate">{highlight}</p>
          <p className="opacity-80">{time}</p>
        </div>
      </div>

      <div className="p-4 flex items-center gap-3">
        <span className={`material-symbols-outlined ${iconColor} text-3xl`}>{icon}</span>
        <div>
          <h4 className="font-bold text-lg text-[#1F2937] dark:text-[#F9FAFB]">{title}</h4>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default CarpetaCard;
