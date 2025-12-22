import CarpetaCard from './CarpetaCard';
import '../styles/CarpetasGrid.css';

const CarpetasGrid = ({
  carpetas,
  onAbrirCarpeta,
  onEditarCarpeta,
  onEliminarCarpeta,
  menuAbierto,
  setMenuAbierto,
  onCompartirCarpeta,
  formatearTamaño,
  formatearFecha
}) => {
  return (
    <div className="carpetas-grid">
      {carpetas.map((carpeta) => (
        <CarpetaCard
          key={carpeta._id}
          carpeta={carpeta}
          onAbrir={onAbrirCarpeta}
          onEditar={onEditarCarpeta}
          onEliminar={onEliminarCarpeta}
          menuAbierto={menuAbierto}
          onMenuToggle={setMenuAbierto}
          onCompartir={onCompartirCarpeta}
          formatearTamaño={formatearTamaño}
          formatearFecha={formatearFecha}
        />
      ))}
    </div>
  );
};

export default CarpetasGrid;


