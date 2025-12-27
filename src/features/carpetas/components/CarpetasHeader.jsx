import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import '../../../shared/styles/headers.style.css';

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
    <div className="section-header">
      {/* Icono en caja con fondo */}
      <div className="section-header__icon-box">
        <span className="material-symbols-outlined section-header__icon">
          folder
        </span>
      </div>

      {/* Contenido: Título + Subtítulo */}
      <div className="section-header__content">
        <h1 className="section-header__title section-header__title--heavy">
          Mis Carpetas
        </h1>
        <p className="section-header__subtitle">
          Gestiona tus carpetas y mantén tu contenido siempre ordenado
          {totalCarpetas > 0 && (
            <span style={{ color: 'var(--accent-primary)', paddingLeft: '0.25rem' }}>
              · {totalCarpetas} {totalCarpetas === 1 ? 'carpeta' : 'carpetas'}
            </span>
          )}
        </p>
      </div>

      {/* Botón CTA */}
      <button
        onClick={onCrearCarpeta}
        className="section-header__button section-header__button--indigo"
      >
        <Plus className="section-header__button-icon" size={20} />
        <span className="section-header__button-text">Nueva Carpeta</span>
      </button>
    </div>
  );
};

export default CarpetasHeader;

