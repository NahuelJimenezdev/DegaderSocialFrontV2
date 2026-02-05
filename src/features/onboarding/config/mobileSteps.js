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
        content: 'Tocá tu foto de perfil para acceder a todas las opciones: configuración, tema oscuro, notificaciones y más.',
        title: 'Menú de Perfil',
        placement: 'bottom',
        disableBeacon: true,
    }
];
