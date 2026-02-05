export const desktopSteps = [
    {
        target: '.sidebar',
        content: 'Desde aquí accedés a todas las secciones principales de DegaderSocial: Inicio, Mensajes, Grupos, Iglesias y Fundación.',
        title: 'Navegación Principal',
        placement: 'right',
        disableBeacon: true,
        styles: {
            options: {
                zIndex: 10000,
            }
        }
    },
    {
        target: '.onboarding-create-post',
        content: 'Compartí tus pensamientos, fotos o videos con la comunidad. Hacé click aquí para crear una nueva publicación.',
        title: 'Crear Publicación',
        placement: 'bottom',
        disableBeacon: true,
    },
    {
        target: '.profile-dropdown-trigger',
        content: 'Desde acá podés personalizar tu experiencia, gestionar tu cuenta y cambiar del Modo Oscuro al Modo Claro.',
        title: 'Menú de Perfil',
        placement: 'bottom',
        disableBeacon: true,
    },
    {
        target: '.search-bar',
        content: 'Buscá personas, grupos, iglesias o contenido usando esta barra de búsqueda.',
        title: 'Búsqueda',
        placement: 'bottom',
        disableBeacon: true,
    },
    {
        target: '.notifications-button',
        content: 'Acá vas a ver todas tus notificaciones en tiempo real. Mantenete al día con lo que pasa en tu comunidad.',
        title: 'Notificaciones',
        placement: 'bottom',
        disableBeacon: true,
    }
];
