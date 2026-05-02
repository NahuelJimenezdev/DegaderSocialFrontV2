import countryRegionData from '../../data/external/country-region-data.json';
import { DB_TO_MAP } from '../../features/founder/data/countryMapping';
import { COUNTRY_DATA } from '../../features/founder/data/countryColors';
import nivelesPorPais from '../../features/fundacion/utils/nivelesPorPais';

/**
 * CUSTOM_REGIONS: 
 * Agrupaciones geográficas personalizadas (NOA, NEA, Regiones Naturales).
 * Esto es lo que no viene en el repositorio mundial y nosotros aportamos.
 */
const CUSTOM_REGIONS = {
  "Argentina": ["Noroeste Argentino (NOA)", "Noreste Argentino (NEA)", "Región de Cuyo", "Región Pampeana", "Región Patagónica", "Región Metropolitana (AMBA)"],
  "Bolivia": ["Zona Andina", "Zona Subandina", "Zona de los Llanos"],
  "Brasil": ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sur"],
  "Chile": ["Norte Grande", "Norte Chico", "Zona Central", "Zona Sur", "Zona Austral"],
  "Colombia": ["Región Amazónica", "Región Andina", "Región Caribe", "Región de la Orinoquía", "Región del Pacífico", "Región Insular"],
  "Costa Rica": ["Región Central", "Región Chorotega", "Región Pacífico Central", "Región Brunca", "Región Huetar Atlántica", "Región Huetar Norte"],
  "Cuba": ["Occidental", "Central", "Oriental"],
  "Ecuador": ["Costa", "Sierra", "Oriente", "Insular (Galápagos)"],
  "El Salvador": ["Zona Occidental", "Zona Central", "Zona Oriental"],
  "España": ["Norte", "Sur", "Este", "Oeste", "Centro", "Canarias", "Baleares"],
  "Estados Unidos": ["Noreste", "Medio Oeste", "Sur", "Oeste"],
  "Honduras": ["Región Central", "Región Norte", "Región Sur", "Región Occidental", "Región Oriental"],
  "México": ["Norte", "Occidente", "Centro", "Sur", "Sureste"],
  "Nicaragua": ["Pacífico", "Central", "Caribe"],
  "Panamá": ["Metropolitana", "Interoceánica", "Central", "Occidental", "Oriental"],
  "Paraguay": ["Región Oriental", "Región Occidental (Chaco)"],
  "Perú": ["Costa", "Sierra", "Selva"],
  "Republica Dominicana": ["Norte (Cibao)", "Sur", "Este"],
  "Uruguay": ["Metropolitana", "Litoral", "Este", "Norte", "Centro"],
  "Venezuela": ["Capital", "Central", "Los Llanos", "Centro-Occidental", "Zuliana", "Los Andes", "Nor-Oriental", "Insular", "Guayana"]
};

/**
 * TERRITORY MANAGER
 * El "Monopolio" de datos territoriales.
 */
class TerritoryManager {
  constructor() {
    this.countries = countryRegionData;
    this.spanishToEnglish = {};
    this.englishToSpanish = {};

    // Inicializar mapeo inverso basado en countryMapping.js
    Object.entries(DB_TO_MAP).forEach(([es, en]) => {
      this.spanishToEnglish[es] = en;
      this.englishToSpanish[en] = es;
    });
  }

  /**
   * Obtiene la lista de todos los países en español (si están mapeados) o inglés.
   */
  getCountries() {
    return this.countries.map(c => {
      const spanishName = this.englishToSpanish[c.countryName];
      return {
        id: c.countryShortCode,
        name: spanishName || c.countryName,
        originalName: c.countryName
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Obtiene toda la metadata de un país por su nombre en español.
   */
  getCountryData(spanishName) {
    const englishName = this.spanishToEnglish[spanishName] || spanishName;
    const country = this.countries.find(c => c.countryName === englishName);
    
    if (!country) return null;

    // Obtener etiquetas de nivelesPorPais (normalizando el nombre para el objeto)
    const normalizedKey = spanishName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "");
    const nivelInfo = nivelesPorPais[normalizedKey] || nivelesPorPais[spanishName] || { departamental: "División" };

    return {
      iso: country.countryShortCode,
      name: spanishName,
      englishName: country.countryName,
      divisionType: nivelInfo.departamental,
      divisions: country.regions.map(r => r.name),
      regions: CUSTOM_REGIONS[spanishName] || [],
      color: COUNTRY_DATA[spanishName]?.color || "#94a3b8"
    };
  }

  /**
   * Obtiene las divisiones (provincias/deptos) de un país.
   */
  getDivisions(spanishName) {
    const data = this.getCountryData(spanishName);
    return data ? data.divisions : [];
  }

  /**
   * Obtiene el tipo de división (ej: "Provincia", "Estado").
   */
  getDivisionType(spanishName) {
    const data = this.getCountryData(spanishName);
    return data ? data.divisionType : "División";
  }

  /**
   * Obtiene las regiones geográficas (NOA, NEA, etc.).
   */
  getRegiones(spanishName) {
    const data = this.getCountryData(spanishName);
    return data ? data.regions : [];
  }
}

export const territoryManager = new TerritoryManager();
