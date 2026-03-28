import nivelesPorPais from "./nivelesPorPais";

const capitalizar = (texto) =>
  texto ? texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase() : "";

const obtenerNivel = (usuario) => {
  const pais = usuario.fundacion?.territorio?.pais;
  const nivel = usuario.fundacion?.nivel?.toLowerCase();

  return nivelesPorPais[pais]?.[nivel] || capitalizar(nivel);
};

export default obtenerNivel;