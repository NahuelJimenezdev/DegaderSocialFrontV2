import { territoryManager } from '../shared/utils/territoryManager';

/**
 * PAISES_DIVISIONES: 
 * Mantenemos el export por si algún componente accede directamente al objeto,
 * pero ahora se construye dinámicamente desde el TerritoryManager.
 */
export const PAISES_DIVISIONES = territoryManager.getCountries().reduce((acc, country) => {
    acc[country.name] = territoryManager.getCountryData(country.name);
    return acc;
}, {});

// Función helper para obtener países ordenados alfabéticamente
export const getPaisesOrdenados = () => {
    return territoryManager.getCountries().map(c => c.name);
};

// Función helper para obtener divisiones de un país
export const getDivisionesPais = (pais) => {
    return territoryManager.getDivisions(pais);
};

// Función helper para obtener el tipo de división (provincias, departamentos, estados)
export const getTipoDivision = (pais) => {
    return territoryManager.getDivisionType(pais);
};

// Función helper para obtener regiones de un país
export const getRegionesPais = (pais) => {
    return territoryManager.getRegiones(pais);
};
