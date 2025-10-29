import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import data from '../../../shared/json/CardsFolders.json'
import archivos from '../../../shared/json/ArchivosFolder.json'
import ArchivoDetalle from '../components/ArchivoDetalle'

const FolderDetail = () => {
  const { id } = useParams()
  const folder = data.find(f => f.id === parseInt(id))
  const [detalle, setDetalle] = useState(null)

  if (!folder) return <p>Carpeta no encontrada</p>

  return (
    <main className="flex-1 p-8">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#6B7280] dark:text-[#9CA3AF]">
          <Link to="/" className="hover:text-primary">Mis Carpetas</Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="font-semibold text-[#1F2937] dark:text-[#F9FAFB]">{folder.title}</span>
        </div>

        {/* Header */}
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-5xl text-primary">{folder.iconMain}</span>
          <div>
            <p className="text-4xl font-black">{folder.title}</p>
            <p className="text-[#6B7280]">{folder.subtitle}</p>
          </div>
        </div>

        {/* Lista de archivos */}
        <div className="bg-white dark:bg-[#1F2937] p-4 rounded-lg shadow-md">
          <p className="font-semibold mb-2">Archivos:</p>
          <ul className="divide-y divide-[#E5E7EB] dark:divide-[#374151]">
            {archivos.map(archivo => (
              <li key={archivo.id} onClick={() => setDetalle(archivo)} className="py-2 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                  {archivo.tipo === 'video'
                    ? 'movie'
                    : archivo.tipo === 'audio'
                      ? 'headphones'
                      : 'description'}
                </span>
                <span>{archivo.nombre}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Panel lateral (detalle) */}
      {detalle && (
        <ArchivoDetalle archivoName={detalle} onClose={() => setDetalle(null)} />
      )}
    </main>
  )
}

export default FolderDetail
