export const mobileSteps = [
    {
        target: '.bottom-navbar',
        content: 'Tu navegación rápida está acá abajo. Accedé a Inicio, Buscar, Grupos, Institución y Carpetas con un toque.',
        title: 'Navegación Móvil',
        placement: 'top',
        disableBeacon: true,
        styles: {
            options: {
                zIndex: 10000,
            }
        }
    },
    {
        target: '.profile-dropdown-trigger',
        content: 'Tocá tu foto para ver todas las opciones y secciones disponibles en el menú.',
        title: 'Menú Principal',
        placement: 'bottom',
        disableBeacon: true,
    },
    {
        target: '.onboarding-create-post',
        content: 'Compartí desde cualquier lugar con un toque. Creá publicaciones rápidamente.',
        title: 'Crear Publicación',
        placement: 'bottom',
        disableBeacon: true,
    },
    {
        target: '.notifications-button',
        content: 'Mantenete al día con tus notificaciones. Todas tus actualizaciones en un solo lugar.',
        title: 'Notificaciones',
        placement: 'bottom',
        disableBeacon: true,
    }
];
