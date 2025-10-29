import React, { useState } from "react";

const ArchivoDetalle = ({ archivoName, onClose }) => {
  const [modoVideo, setModoVideo] = useState(false);

  if (!archivoName) return null; // No mostrar si no hay detalle seleccionado

  // ⚙️ Alternar entre modo detalle y modo video
  const handleVerVideo = () => setModoVideo(true);
  const handleCerrarVideo = () => setModoVideo(false);

  // 🎥 --- MODO VIDEO ---
  if (modoVideo) {
    return (
      <div className="fixed top-0 right-0 left-auto h-screen z-[1100] flex flex-col p-4 md:p-8 bg-white dark:bg-[#1F2937] border-l border-[#E5E7EB] dark:border-[#374151] shadow-2xl transition-all duration-300 w-[500px] md:w-1/2">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1F2937] dark:text-[#F9FAFB]">
            {archivoName.titulo || archivoName.nombre}
          </h2>
          <button
            onClick={handleCerrarVideo}
            className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-primary"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        {/* VIDEO PLAYER */}
        <div className="flex flex-col gap-6 flex-1 overflow-y-auto pr-2">
          {/* Responsive fallback for iframe: uses padding-top 56.25% (16:9) so it works even without Tailwind */}
          <div style={{ position: 'relative', paddingTop: '56.25%' }} className="w-full bg-black rounded-xl overflow-hidden">
            <iframe
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              className="w-full h-full"
              src="https://www.youtube.com/embed/1HMN9Fkec3E?si=OHK5cI8hmo3y_wJn"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>

          {/* INFO */}
          <div>
            <p className="text-lg text-[#6B7280] dark:text-[#9CA3AF]">{archivoName.autor}</p>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">{archivoName.fecha}</p>
          </div>

          {/* BOTONES */}
          <div className="flex items-center gap-2 border-y border-[#E5E7EB] dark:border-[#374151] py-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium">
              <span className="material-symbols-outlined">videocam</span>
              <span>Video</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium text-[#1F2937] dark:text-[#F9FAFB]">
              <span className="material-symbols-outlined">headset</span>
              <span>Audio</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium text-[#1F2937] dark:text-[#F9FAFB]">
              <span className="material-symbols-outlined">picture_as_pdf</span>
              <span>PDF</span>
            </button>
          </div>

          {/* DESCRIPCIÓN */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Descripción</h3>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
              {archivoName.descripcion}
            </p>
          </div>

          {/* COMENTARIOS */}
          <div className="flex flex-col gap-6 pt-6 border-t border-[#E5E7EB] dark:border-[#374151]">
            <h3 className="text-lg font-bold text-[#1F2937] dark:text-[#F9FAFB]">Comentarios</h3>

            <div className="flex flex-col gap-6">
              <div className="flex gap-4">
                <img
                  alt="User avatar"
                  className="w-10 h-10 rounded-full"
                  src="https://i.pravatar.cc/50?img=1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-[#1F2937] dark:text-[#F9FAFB]">Ana Sofía</p>
                    <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">hace 2 horas</p>
                  </div>
                  <p className="text-sm text-[#1F2937] dark:text-[#F9FAFB] mt-1">
                    ¡Qué mensaje tan poderoso! Justo lo que necesitaba escuchar hoy.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <img
                  alt="User avatar"
                  className="w-10 h-10 rounded-full"
                  src="https://i.pravatar.cc/50?img=2"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-[#1F2937] dark:text-[#F9FAFB]">
                      Carlos Méndez
                    </p>
                    <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">hace 5 horas</p>
                  </div>
                  <p className="text-sm text-[#1F2937] dark:text-[#F9FAFB] mt-1">
                    Amén. Este sermón nos da herramientas para fortalecer la fe.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* NUEVO COMENTARIO */}
          <div className="mt-auto pt-6 border-t border-[#E5E7EB] dark:border-[#374151]">
            <div className="flex items-start gap-4">
              <img
                alt="Current user avatar"
                className="w-10 h-10 rounded-full"
                src="https://i.pravatar.cc/50?img=5"
              />
              <div className="flex-1 flex flex-col gap-2">
                <textarea
                  className="form-textarea w-full rounded-lg border-[#E5E7EB] dark:border-[#374151] bg-background-light dark:bg-[#111827] text-[#1F2937] dark:text-[#F9FAFB] placeholder:text-[#6B7280] dark:placeholder:text-[#9CA3AF] focus:ring-primary focus:border-primary transition"
                  placeholder="Escribe un comentario..."
                  rows="3"
                ></textarea>
                <button className="self-end flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em]">
                  <span className="truncate">Publicar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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

        <div className="flex items-center gap-4 py-4 border-y border-[#E5E7EB] dark:border-[#374151]">
          {/* ✅ AHORA ESTE BOTÓN TAMBIÉN ABRE EL VIDEO */}
          <button
            onClick={handleVerVideo}
            className="flex flex-col items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined text-5xl">play_circle</span>
            <span className="text-sm font-medium">Video</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-green-500 hover:text-green-600 transition-colors">
            <span className="material-symbols-outlined text-5xl">headphones</span>
            <span className="text-sm font-medium">Audio</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-red-500 hover:text-red-600 transition-colors">
            <span className="material-symbols-outlined text-5xl">description</span>
            <span className="text-sm font-medium">PDF</span>
          </button>
        </div>

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
