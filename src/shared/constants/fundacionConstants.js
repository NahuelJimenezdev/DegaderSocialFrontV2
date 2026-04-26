// ==========================================
// 🔹 CONSTANTES FRONTEND DE LA FUNDACIÓN
// Mantiene sincronía con DegaderSocialBackV2
// ==========================================

export const NIVELES_FUNDACION = [
  "directivo_general",
  "organo_control",
  "organismo_internacional",
  "internacional",
  "continental",
  "nacional",
  "regional",
  "departamental",
  "municipal",
  "local",
  "barrial",
  "afiliado"
];

// Helper para display bonito
export const NIVELES_DISPLAY = {
  directivo_general: "Directivo General",
  organo_control: "Órgano de Control",
  organismo_internacional: "Organismo Internacional",
  internacional: "Nivel Internacional",
  continental: "Nivel Continental",
  nacional: "Nivel Nacional",
  regional: "Nivel Regional",
  departamental: "Nivel Departamental",
  municipal: "Nivel Municipal",
  local: "Nivel Local",
  barrial: "Nivel Barrial",
  afiliado: "Afiliado"
};

export const NIVELES_ORDENADOS_ASC = [
  "afiliado", "local", "barrial", "municipal",
  "departamental", "regional", "nacional",
  "continental", "internacional",
  "organismo_internacional", "organo_control", "directivo_general"
];

// Reutilizamos esta constante en múltiples tarjetas y menús
export const CARGOS_DIRECTIVOS = [
  'Presidente-Representante Legal',
  'Director General',
  'Subdirector General',
  'Secretario Director General',
  'Secretario Subdirector General',
  'Director Nacional',
  'Subdirector Nacional',
  'Director Regional',
  'Subdirector Regional',
  'Director Departamental',
  'Subdirector Departamental',
  'Coordinador Municipal',
  'Subdirector Municipal',
  // Legacy backups:
  'Director General (Pastor)',
  'Sub-Director General',
  'secretario Director General',
  'secretario Sub-Director General'
];

export const esCargoDirectivo = (cargo) => {
  if (!cargo) return false;
  return CARGOS_DIRECTIVOS.includes(cargo);
};
