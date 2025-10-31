import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import myGroups from "../../../shared/json/MyGroups.json";
import joinGroups from "../../../shared/json/JoinGroups.json";

const GruposPages = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState("Mis grupos");
  const [view, setView] = useState("Grid");

  const gridClasses =
    view === "Grid"
      ? "grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      : "grid grid-cols-1 gap-4";

  const groups = section === "Mis grupos" ? myGroups : joinGroups;

  return (
    <main className="flex-1 p-8">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-5xl text-primary">groups</span>
          <div className="flex flex-col">
            <p className="text-[#1F2937] dark:text-[#F9FAFB] text-4xl font-black leading-tight tracking-[-0.033em]">
              Mis Grupos
            </p>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] text-base font-normal leading-normal">
              Explora y participa en comunidades relevantes
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {["Grupos para unirse", "Mis grupos"].map((label) => (
            <div
              key={label}
              onClick={() => setSection(label)}
              className={`flex gap-4 p-4 rounded-xl cursor-pointer ${section === label
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-transparent hover:border-primary/50 dark:hover:border-primary/50"
                }`}
            >
              <span className="material-symbols-outlined text-2xl">
                {label === "Mis grupos" ? "groups" : "group_add"}
              </span>
              <div>
                <p className="font-bold">{label}</p>
                <p className="text-sm opacity-80">
                  {label === "Mis grupos"
                    ? "Comunidades en las que participas"
                    : "Explora y únete a nuevos grupos"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Buscador + Vista */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex-grow max-w-md">
            <label className="flex flex-col min-w-40 h-12 w-full">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                <div className="text-[#6B7280] dark:text-[#9CA3AF] flex bg-white dark:bg-[#1F2937] items-center justify-center pl-4 rounded-l-lg border border-r-0 border-[#E5E7EB] dark:border-[#1F2937]">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-[#1F2937] dark:text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-primary border-l-0 border border-[#E5E7EB] dark:border-[#1F2937] bg-white dark:bg-[#1F2937] h-full placeholder:text-[#6B7280] dark:placeholder:text-[#9CA3AF] px-4 text-base font-normal leading-normal"
                  placeholder="Buscar grupos…"
                />
              </div>
            </label>
          </div>

          <div className="flex h-10 items-center justify-center rounded-lg bg-white dark:bg-[#1F2937] p-1 border border-[#E5E7EB] dark:border-transparent">
            {["Grid", "List"].map((label) => (
              <label
                key={label}
                onClick={() => setView(label)}
                className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-4 text-sm font-medium leading-normal ${view === label
                    ? "bg-primary text-white"
                    : "text-[#1F2937] dark:text-[#F9FAFB]"
                  }`}
              >
                <span className="truncate">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className={gridClasses}>
          {groups.map((group) => (
            <div
              key={group.id}
              onClick={() => section === "Mis grupos" && navigate(`/Mis_grupos/${group.id}`)}
              className="flex flex-col bg-white dark:bg-[#1F2937] rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
            >
              <div
                className={`relative h-32 bg-gradient-to-br ${group.color} flex items-center justify-center text-white`}
              >
                <img
                  alt={`${group.title} Preview`}
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                  src={group.thumbnail}
                />
                <span className="material-symbols-outlined text-6xl opacity-80 relative z-10">
                  {group.icon}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent text-xs text-white z-10">
                  <p className="font-medium truncate">{group.date}</p>
                  <p className="opacity-80">{group.members}</p>
                </div>
              </div>

              <div className="p-4 flex flex-col gap-2">
                <h4 className="font-bold text-lg text-[#1F2937] dark:text-[#F9FAFB]">
                  {group.title}
                </h4>
                <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
                  {group.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default GruposPages;
