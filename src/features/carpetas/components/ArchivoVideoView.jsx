import MediaControls from './MediaControls'
import CommentSection from './CommentSection'

const ArchivoVideoView = ({ archivo, onClose }) => {
  const mockComments = [
    {
      author: 'Ana Sofía',
      avatar: 'https://i.pravatar.cc/50?img=1',
      time: 'hace 2 horas',
      text: '¡Qué mensaje tan poderoso! Justo lo que necesitaba escuchar hoy.'
    },
    {
      author: 'Carlos Méndez',
      avatar: 'https://i.pravatar.cc/50?img=2',
      time: 'hace 5 horas',
      text: 'Amén. Este sermón nos da herramientas para fortalecer la fe.'
    }
  ]

  const handleAddComment = (comment) => {
    console.log('Nuevo comentario:', comment)
    // Aquí iría la lógica para agregar el comentario
  }

  return (
    <div className="fixed top-0 right-0 left-auto h-screen z-[1100] flex flex-col p-4 md:p-8 bg-white dark:bg-[#1F2937] border-l border-[#E5E7EB] dark:border-[#374151] shadow-2xl transition-all duration-300 w-[500px] md:w-1/2">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#1F2937] dark:text-[#F9FAFB]">
          {archivo.titulo || archivo.nombre}
        </h2>
        <button
          onClick={onClose}
          className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-primary"
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-6 flex-1 overflow-y-auto pr-2">
        {/* VIDEO PLAYER */}
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
          <p className="text-lg text-[#6B7280] dark:text-[#9CA3AF]">{archivo.autor}</p>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">{archivo.fecha}</p>
        </div>

        {/* MEDIA CONTROLS */}
        <MediaControls variant="horizontal" />

        {/* DESCRIPCIÓN */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">Descripción</h3>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
            {archivo.descripcion}
          </p>
        </div>

        {/* COMENTARIOS */}
        <CommentSection
          comments={mockComments}
          onAddComment={handleAddComment}
        />
      </div>
    </div>
  )
}

export default ArchivoVideoView
