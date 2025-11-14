import CarpetaCard from './CarpetaCard';

const CarpetasGrid = ({
  carpetas,
  onAbrirCarpeta,
  onEditarCarpeta,
  onEliminarCarpeta,
  menuAbierto,
  setMenuAbierto,
  formatearTamaño,
  formatearFecha
}) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {carpetas.map((carpeta) => (
        <CarpetaCard
          key={carpeta._id}
          carpeta={carpeta}
          onAbrir={onAbrirCarpeta}
          onEditar={onEditarCarpeta}
          onEliminar={onEliminarCarpeta}
          menuAbierto={menuAbierto}
          onMenuToggle={setMenuAbierto}
          formatearTamaño={formatearTamaño}
          formatearFecha={formatearFecha}
        />
      ))}
    </div>
  );
};

export default CarpetasGrid;
