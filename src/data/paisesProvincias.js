import { territoryManager } from '../shared/utils/territoryManager';

/**
 * PAISES_DIVISIONES: 
 * Ahora es un objeto que se puebla bajo demanda (lazy-loading).
 * Esto evita errores de inicialización ("Cannot access before initialization")
 * si hay dependencias circulares en el bundle de producción.
 */
let _paises_divisiones_cache = null;

const getPaisesDivisiones = () => {
    if (!_paises_divisiones_cache) {
        try {
            _paises_divisiones_cache = territoryManager.getCountries().reduce((acc, country) => {
                acc[country.name] = territoryManager.getCountryData(country.name);
                return acc;
            }, {});
        } catch (error) {
            console.error('❌ Error initializing PAISES_DIVISIONES:', error);
            return {};
        }
    }
    return _paises_divisiones_cache;
};

// Mantenemos el export del objeto para compatibilidad, pero usando un Proxy para lazy-loading
export const PAISES_DIVISIONES = new Proxy({}, {
    get: (target, prop) => {
        return getPaisesDivisiones()[prop];
    },
    ownKeys: () => {
        return Object.keys(getPaisesDivisiones());
    },
    getOwnPropertyDescriptor: (target, prop) => {
        return {
            enumerable: true,
            configurable: true,
            value: getPaisesDivisiones()[prop]
        };
    }
});

// Función helper para obtener países ordenados alfabéticamente
export const getPaisesOrdenados = () => {
    try {
        return territoryManager.getCountries().map(c => c.name);
    } catch (error) {
        console.error('❌ Error in getPaisesOrdenados:', error);
        return [];
    }
};

// Función helper para obtener divisiones de un país
export const getDivisionesPais = (pais) => {
    try {
        return territoryManager.getDivisions(pais);
    } catch (error) {
        console.error(`❌ Error getting divisions for ${pais}:`, error);
        return [];
    }
};

// Función helper para obtener el tipo de división (provincias, departamentos, estados)
export const getTipoDivision = (pais) => {
    try {
        return territoryManager.getDivisionType(pais);
    } catch (error) {
        console.error(`❌ Error getting division type for ${pais}:`, error);
        return "División";
    }
};

// Función helper para obtener regiones de un país
export const getRegionesPais = (pais) => {
    try {
        return territoryManager.getRegiones(pais);
    } catch (error) {
        console.error(`❌ Error getting regions for ${pais}:`, error);
        return [];
    }
};

