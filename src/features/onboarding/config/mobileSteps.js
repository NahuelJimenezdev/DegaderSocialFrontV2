export const mobileSteps = [
    {
        target: '.bottom-navbar',
        content: 'Esta es tu barra de navegación principal. Desde aquí puedes acceder rápidamente a todas las secciones importantes.',
        title: 'Navegación Táctil',
        placement: 'top',
        disableBeacon: true,
        styles: {
            options: {
                zIndex: 10000,
            }
        }
    },
    {
        target: '.bottom-nav-home',
        content: 'Tu Feed principal: aquí verás las publicaciones de tus amigos y grupos.',
        title: 'Inicio',
        placement: 'top',
        disableBeacon: true,
    },
    {
        target: '.bottom-nav-search',
        content: 'Buscá personas, grupos o contenidos específicos en toda la plataforma.',
        title: 'Buscar',
        placement: 'top',
        disableBeacon: true,
    },
    {
        target: '.bottom-nav-groups',
        content: 'Accedé a tus grupos de interés y mantenete conectado con tu comunidad.',
        title: 'Grupos',
        placement: 'top',
        disableBeacon: true,
    },
    {
        target: '.bottom-nav-church',
        content: 'Información y actividades de tu institución o iglesia.',
        title: 'Institución',
        placement: 'top',
        disableBeacon: true,
    },
    {
        target: '.profile-dropdown-trigger',
        content: 'Tu menú personal. Tocá aquí para configurar tu perfil, ver notificaciones, cambiar a modo oscuro o reiniciar este tour.',
        title: 'Tu Perfil',
        placement: 'bottom',
        disableBeacon: true,
    }
];
