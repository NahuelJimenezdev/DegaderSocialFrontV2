import {
    ThumbsDown,
    AlertTriangle,
    UserX,
    Shield,
    Heart,
    Skull,
    Eye,
    DollarSign,
    FileText,
    Copyright
} from 'lucide-react';

// Motivos principales de reporte con iconos y prioridades
export const REPORT_REASONS = [
    {
        id: 'no_me_gusta',
        label: 'No me gusta',
        description: 'Este contenido no es de mi agrado',
        icon: ThumbsDown,
        priority: 'baja',
        hasSubmotivos: false
    },
    {
        id: 'bullying_acoso',
        label: 'Bullying o acoso',
        description: 'Alguien está siendo intimidado o acosado',
        icon: AlertTriangle,
        priority: 'media',
        hasSubmotivos: true
    },
    {
        id: 'contacto_no_deseado',
        label: 'Contacto no deseado',
        description: 'Mensajes o interacciones no deseadas',
        icon: UserX,
        priority: 'media',
        hasSubmotivos: false
    },
    {
        id: 'violencia',
        label: 'Violencia',
        description: 'Contenido violento o que incita a la violencia',
        icon: Shield,
        priority: 'alta',
        hasSubmotivos: true
    },
    {
        id: 'odio',
        label: 'Odio',
        description: 'Discurso de odio o discriminación',
        icon: Heart,
        priority: 'alta',
        hasSubmotivos: true
    },
    {
        id: 'autolesion_suicidio',
        label: 'Autolesión o suicidio',
        description: 'Contenido sobre autolesión o suicidio',
        icon: Skull,
        priority: 'alta',
        hasSubmotivos: true
    },
    {
        id: 'desnudez_actividad_sexual',
        label: 'Desnudez o actividad sexual',
        description: 'Contenido sexual o desnudez inapropiada',
        icon: Eye,
        priority: 'media',
        hasSubmotivos: true
    },
    {
        id: 'estafa_fraude_spam',
        label: 'Estafa, fraude o spam',
        description: 'Contenido fraudulento o spam',
        icon: DollarSign,
        priority: 'baja',
        hasSubmotivos: true
    },
    {
        id: 'informacion_falsa',
        label: 'Información falsa',
        description: 'Desinformación o noticias falsas',
        icon: FileText,
        priority: 'baja',
        hasSubmotivos: true
    },
    {
        id: 'propiedad_intelectual',
        label: 'Propiedad intelectual',
        description: 'Violación de derechos de autor',
        icon: Copyright,
        priority: 'baja',
        hasSubmotivos: true
    }
];

// Submotivos por categoría
export const REPORT_SUBREASONS = {
    bullying_acoso: [
        { id: 'amenazas', label: 'Amenazas' },
        { id: 'hostigamiento', label: 'Hostigamiento' },
        { id: 'acoso_sexual', label: 'Acoso sexual' },
        { id: 'intimidacion', label: 'Intimidación' }
    ],
    violencia: [
        { id: 'violencia_explicita', label: 'Violencia explícita' },
        { id: 'violencia_grafica', label: 'Violencia gráfica' },
        { id: 'amenazas_violencia', label: 'Amenazas de violencia' },
        { id: 'incitacion_violencia', label: 'Incitación a la violencia' }
    ],
    odio: [
        { id: 'discurso_odio', label: 'Discurso de odio' },
        { id: 'discriminacion', label: 'Discriminación' },
        { id: 'simbolos_odio', label: 'Símbolos de odio' },
        { id: 'incitacion_odio', label: 'Incitación al odio' }
    ],
    autolesion_suicidio: [
        { id: 'autolesion', label: 'Autolesión' },
        { id: 'suicidio', label: 'Suicidio' },
        { id: 'trastornos_alimenticios', label: 'Trastornos alimenticios' },
        { id: 'glorificacion_autolesion', label: 'Glorificación de autolesión' }
    ],
    desnudez_actividad_sexual: [
        { id: 'desnudez', label: 'Desnudez' },
        { id: 'actividad_sexual', label: 'Actividad sexual' },
        { id: 'contenido_sexual_menores', label: 'Contenido sexual de menores' },
        { id: 'explotacion_sexual', label: 'Explotación sexual' }
    ],
    estafa_fraude_spam: [
        { id: 'estafa', label: 'Estafa' },
        { id: 'fraude', label: 'Fraude' },
        { id: 'spam', label: 'Spam' },
        { id: 'phishing', label: 'Phishing' },
        { id: 'contenido_comercial_no_deseado', label: 'Contenido comercial no deseado' }
    ],
    informacion_falsa: [
        { id: 'desinformacion', label: 'Desinformación' },
        { id: 'noticias_falsas', label: 'Noticias falsas' },
        { id: 'manipulacion_medios', label: 'Manipulación de medios' },
        { id: 'suplantacion_identidad', label: 'Suplantación de identidad' }
    ],
    propiedad_intelectual: [
        { id: 'derechos_autor', label: 'Derechos de autor' },
        { id: 'marca_registrada', label: 'Marca registrada' },
        { id: 'plagio', label: 'Plagio' },
        { id: 'uso_no_autorizado', label: 'Uso no autorizado' }
    ]
};

// Tipos de contenido reportable
export const CONTENT_TYPES = {
    post: 'Publicación',
    comment: 'Comentario',
    profile: 'Perfil',
    message: 'Mensaje'
};

// Estados de reporte
export const REPORT_STATUSES = {
    pendiente: 'Pendiente',
    en_revision: 'En revisión',
    valido: 'Válido',
    no_valido: 'No válido',
    duplicado: 'Duplicado',
    escalado: 'Escalado'
};

// Niveles de prioridad con colores
export const PRIORITY_LEVELS = {
    alta: {
        label: 'Alta Prioridad',
        color: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-100 dark:bg-red-900/30',
        badge: 'bg-red-500 dark:bg-red-600'
    },
    media: {
        label: 'Media Prioridad',
        color: 'text-orange-600 dark:text-orange-400',
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        badge: 'bg-orange-500 dark:bg-orange-600'
    },
    baja: {
        label: 'Baja Prioridad',
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        badge: 'bg-blue-500 dark:bg-blue-600'
    }
};

// Acciones de moderación
export const MODERATOR_ACTIONS = {
    ocultar_contenido: 'Ocultar contenido',
    eliminar_contenido: 'Eliminar contenido',
    advertir_usuario: 'Advertir usuario',
    suspension_1_dia: 'Suspensión 1 día',
    suspension_3_dias: 'Suspensión 3 días',
    suspension_7_dias: 'Suspensión 7 días',
    suspension_30_dias: 'Suspensión 30 días',
    suspension_permanente: 'Suspensión permanente',
    escalar_founder: 'Escalar al Founder',
    ninguna_accion: 'Ninguna acción'
};
