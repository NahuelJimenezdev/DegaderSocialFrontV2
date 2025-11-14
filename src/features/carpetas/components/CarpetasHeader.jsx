import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

const CarpetasHeader = ({ onCrearCarpeta, totalCarpetas }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex flex-col">
        <div className="flex items-center gap-4">
          {!isMobile ? (
            <span className="block material-symbols-outlined text-5xl text-primary">folder</span>
          ) : (
            <span className="hidden material-symbols-outlined text-5xl text-primary">folder</span>
          )}

          <div className="flex flex-col">
            <p className="text-[#1F2937] dark:text-[#F9FAFB] text-4xl font-black leading-tight tracking-[-0.033em]">
              Mis Carpeta
            </p>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] text-base font-normal leading-normal">
              Gestiona tus carpetas y mantén tu contenido siempre ordenado: {totalCarpetas > 0 && ( <span className="text-gray-600 dark:text-indigo-400 pl-1"> {totalCarpetas} {totalCarpetas === 1 ? 'carpeta' : 'carpetas'} </span> )}
            </p>
          </div>
        </div>        
      </div>
      <button
        onClick={onCrearCarpeta}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
      >
        <Plus size={20} />
        <span className="hidden sm:inline">Nueva Carpeta</span>
      </button>
    </div>
  );
};

export default CarpetasHeader;
