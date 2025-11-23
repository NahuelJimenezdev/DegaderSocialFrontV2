import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import '../styles/CarpetasHeader.css';

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
    <div className="carpetas-header">
      <div className="carpetas-header-content">
        <span className="carpetas-header-icon material-symbols-outlined text-primary">folder</span>
        <div className="flex flex-col">
          <p className="carpetas-header-title text-[#1F2937] dark:text-[#F9FAFB] font-black leading-tight tracking-[-0.033em]">
            Mis Carpetas
          </p>
          <p className="carpetas-header-subtitle text-[#6B7280] dark:text-[#9CA3AF] font-normal leading-normal">
            Gestiona tus carpetas y mantén tu contenido siempre ordenado
            {totalCarpetas > 0 && (
              <span className="text-gray-600 dark:text-indigo-400 pl-1">
                {totalCarpetas} {totalCarpetas === 1 ? 'carpeta' : 'carpetas'}
              </span>
            )}
          </p>
        </div>
      </div>
      <button
        onClick={onCrearCarpeta}
        className="carpetas-header-btn bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
      >
        <Plus />
        <span className="carpetas-header-btn-text">Nueva Carpeta</span>
      </button>
    </div>
  );
};

export default CarpetasHeader;
