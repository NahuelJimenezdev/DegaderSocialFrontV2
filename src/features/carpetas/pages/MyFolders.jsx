import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import CarpetaCard from '../components/CarpetaCard'
import data from '../../../shared/json/CardsFolders.json'
import groupData from '../../../shared/json/CardsFoldersGroup.json'
import instData from '../../../shared/json/CardsFoldersInstitutional.json'
import { CalendarDays, FileText, FolderKanban, Image, Users, Wallet } from 'lucide-react'

const icons = { FileText, FolderKanban, CalendarDays, Users, Wallet, Image }
const MyFolders = () => {
  const navigate = useNavigate()
  const [view, setView] = useState('Grid')
  const [section, setSection] = useState('Mis Carpetas')
  const gridClasses =
    view === 'Grid'
      ? 'grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6'
      : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6'
  return (
    <main className="flex-1 p-8">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-5xl text-primary">folder_open</span>
          <div className="flex flex-col">
            <p className="text-[#1F2937] dark:text-[#F9FAFB] text-4xl font-black leading-tight tracking-[-0.033em]">
              Mis Carpetas
            </p>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] text-base font-normal leading-normal">
              Organiza y comparte tus documentos y recursos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div
            onClick={() => setSection('Mis Carpetas')}
            className={`flex gap-4 p-4 rounded-xl cursor-pointer ${section === 'Mis Carpetas'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-transparent hover:border-primary/50 dark:hover:border-primary/50'
              }`}
          >
            <span className="material-symbols-outlined text-2xl">folder</span>
            <div>
              <p className="font-bold">Mis Carpetas</p>
              <p className="text-sm opacity-80">Carpetas personales privadas</p>
            </div>
          </div>

          <div
            onClick={() => setSection('Carpetas Grupales')}
            className={`flex gap-4 p-4 rounded-xl cursor-pointer ${section === 'Carpetas Grupales'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-transparent hover:border-primary/50 dark:hover:border-primary/50'
              }`}
          >
            <span className="material-symbols-outlined text-2xl text-[#6B7280] dark:text-[#9CA3AF]">group</span>
            <div>
              <p className="font-bold text-[#1F2937] dark:text-[#F9FAFB]">Carpetas Grupales</p>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Carpetas compartidas con grupos</p>
            </div>
          </div>

          <div
            onClick={() => setSection('Institucionales')}
            className={`flex gap-4 p-4 rounded-xl cursor-pointer ${section === 'Institucionales'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-transparent hover:border-primary/50 dark:hover:border-primary/50'
              }`}
          >
            <span className="material-symbols-outlined text-2xl text-[#6B7280] dark:text-[#9CA3AF]">lock</span>
            <div>
              <p className="font-bold text-[#1F2937] dark:text-[#F9FAFB]">Institucionales</p>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Carpetas oficiales de la iglesia</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-grow max-w-md">
            <label className="flex flex-col min-w-40 h-12 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-[#6B7280] dark:text-[#9CA3AF] flex bg-white dark:bg-[#1F2937] items-center justify-center pl-4 rounded-l-lg border border-r-0 border-[#E5E7EB] dark:border-[#1F2937]">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-[#1F2937] dark:text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-primary border-l-0 border border-[#E5E7EB] dark:border-[#1F2937] bg-white dark:bg-[#1F2937] h-full placeholder:text-[#6B7280] dark:placeholder:text-[#9CA3AF] px-4 text-base font-normal leading-normal"
                  placeholder="Buscar carpetas…"
                />
              </div>
            </label>
          </div>

          <div className="flex h-10 items-center justify-center rounded-lg bg-white dark:bg-[#1F2937] p-1 border border-[#E5E7EB] dark:border-transparent">
            <label
              onClick={() => setView('Grid')}
              className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-4 text-sm font-medium leading-normal ${view === 'Grid' ? 'bg-primary text-white' : 'text-[#1F2937] dark:text-[#F9FAFB]'
                }`}
            >
              <span className="truncate">Grid</span>
              <input
                checked={view === 'Grid'}
                onChange={() => setView('Grid')}
                className="invisible w-0"
                name="view-toggle"
                type="radio"
                value="Grid"
              />
            </label>
            <label
              onClick={() => setView('List')}
              className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-4 text-sm font-medium leading-normal ${view === 'List' ? 'bg-primary text-white' : 'text-[#1F2937] dark:text-[#F9FAFB]'
                }`}
            >
              <span className="truncate">List</span>
              <input
                checked={view === 'List'}
                onChange={() => setView('List')}
                className="invisible w-0"
                name="view-toggle"
                type="radio"
                value="List"
              />
            </label>
          </div>
        </div>

        {/* Tarjetas */}
        <div className={gridClasses}>
          {(section === 'Mis Carpetas' ? data : section === 'Carpetas Grupales' ? groupData : instData).map(folder => (
            <div
              key={folder.id}
              onClick={() =>
                navigate(
                  `/folder/${section === 'Mis Carpetas' ? folder.id : section === 'Carpetas Grupales' ? `g-${folder.id}` : `i-${folder.id}`
                  }`
                )
              }
              className="flex flex-col bg-white dark:bg-[#1F2937] rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
            >
              {/* HEADER con thumbnail */}
              <div
                className={`relative h-32 bg-gradient-to-br ${folder.color} flex items-center justify-center text-white`}
              >
                <img
                  alt={`${folder.title} Preview`}
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                  src={folder.thumbnail}
                />
                <span className="material-symbols-outlined text-6xl opacity-80 relative z-10">
                  {folder.iconMain}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent text-xs text-white z-10">
                  <p className="font-medium truncate">{folder.lastUpdateText}</p>
                  <p className="opacity-80">{folder.timeAgo}</p>
                </div>
              </div>

              {/* BODY con info */}
              <div className="p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-3xl">
                  {folder.iconFolder}
                </span>
                <div>
                  <h4 className="font-bold text-lg text-[#1F2937] dark:text-[#F9FAFB]">
                    {folder.title}
                  </h4>
                  <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                    {folder.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default MyFolders