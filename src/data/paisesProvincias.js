// ==========================================
// 🌍 PAÍSES Y DIVISIONES TERRITORIALES
// ==========================================
// Archivo con países y sus divisiones administrativas (provincias, departamentos, estados)
// Los países están ordenados alfabéticamente

export const PAISES_DIVISIONES = {
    "Argentina": {
        tipo: "provincias",
        divisiones: [
            "Buenos Aires",
            "Catamarca",
            "Chaco",
            "Chubut",
            "Córdoba",
            "Corrientes",
            "Entre Ríos",
            "Formosa",
            "Jujuy",
            "La Pampa",
            "La Rioja",
            "Mendoza",
            "Misiones",
            "Neuquén",
            "Río Negro",
            "Salta",
            "San Juan",
            "San Luis",
            "Santa Cruz",
            "Santa Fe",
            "Santiago del Estero",
            "Tierra del Fuego",
            "Tucumán"
        ]
    },
    "Colombia": {
        tipo: "departamentos",
        divisiones: [
            "Amazonas",
            "Antioquia",
            "Arauca",
            "Atlántico",
            "Bogotá D.C.",
            "Bolívar",
            "Boyacá",
            "Caldas",
            "Caquetá",
            "Casanare",
            "Cauca",
            "Cesar",
            "Chocó",
            "Córdoba",
            "Cundinamarca",
            "Guainía",
            "Guaviare",
            "Huila",
            "La Guajira",
            "Magdalena",
            "Meta",
            "Nariño",
            "Norte de Santander",
            "Putumayo",
            "Quindío",
            "Risaralda",
            "San Andrés y Providencia",
            "Santander",
            "Sucre",
            "Tolima",
            "Valle del Cauca",
            "Vaupés",
            "Vichada"
        ]
    },
    "Honduras": {
        tipo: "departamentos",
        divisiones: [
            "Atlántida",
            "Choluteca",
            "Colón",
            "Comayagua",
            "Copán",
            "Cortés",
            "El Paraíso",
            "Francisco Morazán",
            "Gracias a Dios",
            "Intibucá",
            "Islas de la Bahía",
            "La Paz",
            "Lempira",
            "Ocotepeque",
            "Olancho",
            "Santa Bárbara",
            "Valle",
            "Yoro"
        ]
    },
    "Nicaragua": {
        tipo: "departamentos",
        divisiones: [
            "Boaco",
            "Carazo",
            "Chinandega",
            "Chontales",
            "Costa Caribe Norte",
            "Costa Caribe Sur",
            "Estelí",
            "Granada",
            "Jinotega",
            "León",
            "Madriz",
            "Managua",
            "Masaya",
            "Matagalpa",
            "Nueva Segovia",
            "Río San Juan",
            "Rivas"
        ]
    },
    "Paraguay": {
        tipo: "departamentos",
        divisiones: [
            "Alto Paraguay",
            "Alto Paraná",
            "Amambay",
            "Asunción",
            "Boquerón",
            "Caaguazú",
            "Caazapá",
            "Canindeyú",
            "Central",
            "Concepción",
            "Cordillera",
            "Guairá",
            "Itapúa",
            "Misiones",
            "Ñeembucú",
            "Paraguarí",
            "Presidente Hayes",
            "San Pedro"
        ]
    },
    "Venezuela": {
        tipo: "estados",
        divisiones: [
            "Amazonas",
            "Anzoátegui",
            "Apure",
            "Aragua",
            "Barinas",
            "Bolívar",
            "Carabobo",
            "Cojedes",
            "Delta Amacuro",
            "Distrito Capital",
            "Falcón",
            "Guárico",
            "Lara",
            "Mérida",
            "Miranda",
            "Monagas",
            "Nueva Esparta",
            "Portuguesa",
            "Sucre",
            "Táchira",
            "Trujillo",
            "Vargas",
            "Yaracuy",
            "Zulia"
        ]
    }
};

// Función helper para obtener países ordenados alfabéticamente
export const getPaisesOrdenados = () => {
    return Object.keys(PAISES_DIVISIONES).sort();
};

// Función helper para obtener divisiones de un país
export const getDivisionesPais = (pais) => {
    return PAISES_DIVISIONES[pais]?.divisiones || [];
};

// Función helper para obtener el tipo de división (provincias, departamentos, estados)
export const getTipoDivision = (pais) => {
    return PAISES_DIVISIONES[pais]?.tipo || "divisiones";
};
