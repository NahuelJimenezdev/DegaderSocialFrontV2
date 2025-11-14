import { useState } from 'react'
import ArchivoVideoView from './ArchivoVideoView'
import MediaControls from './MediaControls'

const ArchivoDetalle = ({ archivoName, onClose }) => {
  const [modoVideo, setModoVideo] = useState(false);

  if (!archivoName) return null; // No mostrar si no hay detalle seleccionado

  // ⚙️ Alternar entre modo detalle y modo video
  const handleVerVideo = () => setModoVideo(true);
  const handleCerrarVideo = () => setModoVideo(false);

  // Modo video expandido
  if (modoVideo) {
    return <ArchivoVideoView archivo={archivoName} onClose={handleCerrarVideo} />
  }

  // 🧾 --- MODO DETALLE NORMAL ---
  return (
    <div className="w-96 min-w-96 flex flex-col p-8 bg-white dark:bg-[#1F2937] border-l border-[#E5E7EB] dark:border-[#1F2937] shadow-xl fixed top-0 right-0 h-full z-[1100] transition-all duration-300">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1F2937] dark:text-[#F9FAFB]">
          Detalle del Archivo
        </h2>
        <button
          onClick={onClose}
          className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-primary"
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>
      </div>

      {/* CONTENIDO */}
      <div className="flex flex-col gap-4 overflow-y-auto">
        <h3 className="text-3xl font-bold text-[#1F2937] dark:text-[#F9FAFB] leading-tight">
          {archivoName.titulo || archivoName.nombre}
        </h3>
        <p className="text-lg text-[#6B7280] dark:text-[#9CA3AF]">{archivoName.autor}</p>
        <p className="text-base text-[#6B7280] dark:text-[#9CA3AF]">{archivoName.fecha}</p>

        <MediaControls
          variant="vertical"
          onVideoClick={handleVerVideo}
          onAudioClick={() => console.log('Audio clicked')}
          onPdfClick={() => console.log('PDF clicked')}
        />

        <p className="text-sm text-[#1F2937] dark:text-[#F9FAFB] leading-relaxed">
          {archivoName.descripcion}
        </p>

        <button
          onClick={handleVerVideo}
          className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] mt-4"
        >
          <span>Ver Video</span>
          <span className="material-symbols-outlined ml-2 text-base">arrow_right_alt</span>
        </button>

        <button className="flex items-center justify-center rounded-lg h-10 px-4 border border-primary text-primary text-sm font-bold leading-normal tracking-[0.015em]">
          <span>Escuchar Audio</span>
          <span className="material-symbols-outlined ml-2 text-base">arrow_right_alt</span>
        </button>
      </div>
    </div>
  );
};

export default ArchivoDetalle;
