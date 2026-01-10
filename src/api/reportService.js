import api from './config';

/**
 * Servicio para gestión de reportes
 */

// Motivos de reporte (Sincronizado con Backend)
import {
    Flag,
    MessageSquareX,
    UserX,
    Swords,
    AlertTriangle,
    HeartCrack,
    EyeOff,
    ShieldAlert,
    FileWarning,
    Copyright
} from 'lucide-react';

// Motivos de reporte (Sincronizado con Backend y Frontend)
export const REPORT_REASONS = [
    {
        id: 'no_me_gusta',
        value: 'no_me_gusta',
        label: 'No me gusta',
        description: 'No es algo que quiera ver en mi feed',
        icon: Flag,
        hasSubmotivos: false
    },
    {
        id: 'bullying_acoso',
        value: 'bullying_acoso',
        label: 'Bullying o acoso',
        description: 'Alguien está siendo atacado o amenazado',
        icon: MessageSquareX,
        hasSubmotivos: true
    },
    {
        id: 'contacto_no_deseado',
        value: 'contacto_no_deseado',
        label: 'Contacto no deseado',
        description: 'El usuario me está molestando',
        icon: UserX,
        hasSubmotivos: false
    },
    {
        id: 'violencia',
        value: 'violencia',
        label: 'Violencia',
        description: 'Violencia gráfica, amenazas o incitación',
        icon: Swords,
        hasSubmotivos: true
    },
    {
        id: 'odio',
        value: 'odio',
        label: 'Discurso de odio',
        description: 'Ataques por identidad, raza o religión',
        icon: AlertTriangle,
        hasSubmotivos: true
    },
    {
        id: 'autolesion_suicidio',
        value: 'autolesion_suicidio',
        label: 'Autolesión o suicidio',
        description: 'Riesgo de daño físico autoinfligido',
        icon: HeartCrack,
        hasSubmotivos: true
    },
    {
        id: 'desnudez_actividad_sexual',
        value: 'desnudez_actividad_sexual',
        label: 'Desnudez o actividad sexual',
        description: 'Contenido sexual explícito o no deseado',
        icon: EyeOff,
        hasSubmotivos: true
    },
    {
        id: 'estafa_fraude_spam',
        value: 'estafa_fraude_spam',
        label: 'Estafa, fraude o spam',
        description: 'Suplantación, engaños o contenido comercial',
        icon: ShieldAlert,
        hasSubmotivos: true
    },
    {
        id: 'informacion_falsa',
        value: 'informacion_falsa',
        label: 'Información falsa',
        description: 'Noticias falsas o teorías conspirativas',
        icon: FileWarning,
        hasSubmotivos: true
    },
    {
        id: 'propiedad_intelectual',
        value: 'propiedad_intelectual',
        label: 'Propiedad intelectual',
        description: 'Infracción de derechos de autor',
        icon: Copyright,
        hasSubmotivos: false
    }
];

// Submotivos
export const REPORT_SUBREASONS = {
    'bullying_acoso': [
        { id: 'amenazas', value: 'amenazas', label: 'Amenazas' },
        { id: 'hostigamiento', value: 'hostigamiento', label: 'Hostigamiento' },
        { id: 'acoso_sexual', value: 'acoso_sexual', label: 'Acoso sexual' },
        { id: 'intimidacion', value: 'intimidacion', label: 'Intimidación' }
    ],
    'violencia': [
        { id: 'violencia_explicita', value: 'violencia_explicita', label: 'Violencia explícita' },
        { id: 'violencia_grafica', value: 'violencia_grafica', label: 'Violencia gráfica' },
        { id: 'amenazas_violencia', value: 'amenazas_violencia', label: 'Amenazas de violencia' },
        { id: 'incitacion_violencia', value: 'incitacion_violencia', label: 'Incitación a la violencia' }
    ],
    'odio': [
        { id: 'discurso_odio', value: 'discurso_odio', label: 'Discurso de odio' },
        { id: 'discriminacion', value: 'discriminacion', label: 'Discriminación' },
        { id: 'simbolos_odio', value: 'simbolos_odio', label: 'Símbolos de odio' },
        { id: 'incitacion_odio', value: 'incitacion_odio', label: 'Incitación al odio' }
    ],
    'autolesion_suicidio': [
        { id: 'autolesion', value: 'autolesion', label: 'Autolesión' },
        { id: 'suicidio', value: 'suicidio', label: 'Suicidio' },
        { id: 'trastornos_alimenticios', value: 'trastornos_alimenticios', label: 'Trastornos alimenticios' },
        { id: 'glorificacion_autolesion', value: 'glorificacion_autolesion', label: 'Glorificación de autolesión' }
    ],
    'desnudez_actividad_sexual': [
        { id: 'desnudez', value: 'desnudez', label: 'Desnudez' },
        { id: 'actividad_sexual', value: 'actividad_sexual', label: 'Actividad sexual' },
        { id: 'contenido_sexual_menores', value: 'contenido_sexual_menores', label: 'Contenido sexual de menores' },
        { id: 'explotacion_sexual', value: 'explotacion_sexual', label: 'Explotación sexual' }
    ],
    'estafa_fraude_spam': [
        { id: 'estafa', value: 'estafa', label: 'Estafa' },
        { id: 'fraude', value: 'fraude', label: 'Fraude' },
        { id: 'spam', value: 'spam', label: 'Spam' },
        { id: 'phishing', value: 'phishing', label: 'Phishing' },
        { id: 'contenido_comercial_no_deseado', value: 'contenido_comercial_no_deseado', label: 'Contenido comercial no deseado' }
    ],
    'informacion_falsa': [
        { id: 'desinformacion', value: 'desinformacion', label: 'Desinformación' },
        { id: 'noticias_falsas', value: 'noticias_falsas', label: 'Noticias falsas' },
        { id: 'manipulacion_medios', value: 'manipulacion_medios', label: 'Manipulación de medios' },
        { id: 'suplantacion_identidad', value: 'suplantacion_identidad', label: 'Suplantación de identidad' }
    ]
};

// Crear un reporte
export const createReport = async (reportData) => {
    // reportData: { contentType, contentId, reason, subreason?, comment? }
    const response = await api.post('/reports', reportData);
    return response.data;
};

// Obtener mis reportes
export const getMyReports = async (page = 1, limit = 20) => {
    const response = await api.get(`/reports/my-reports?page=${page}&limit=${limit}`);
    return response.data;
};

export default {
    REPORT_REASONS,
    REPORT_SUBREASONS,
    createReport,
    getMyReports
};
