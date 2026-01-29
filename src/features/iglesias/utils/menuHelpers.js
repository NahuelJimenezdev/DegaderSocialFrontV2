/**
 * Utilidades para generar menús de iglesia basados en permisos de usuario
 */

/**
 * Obtiene los elementos de menú permitidos para un usuario en una iglesia
 * @param {Object} iglesiaData - Datos de la iglesia
 * @param {Object} user - Usuario actual
 * @returns {Object} - { menuItems, isPastor, isMember, hasAccess }
 */
export const getIglesiaMenuItems = (iglesiaData, user) => {
    if (!iglesiaData || !user) {
        return {
            menuItems: [],
            isPastor: false,
            isMember: false,
            hasAccess: false
        };
    }

    // Verificar si es pastor
    const isPastor = iglesiaData?.pastorPrincipal?._id === user?._id ||
        iglesiaData?.pastorPrincipal === user?._id;

    // Verificar si es miembro
    const isMember = iglesiaData?.miembros?.some(m => {
        const memberId = m._id || m;
        return memberId.toString() === user?._id?.toString();
    });

    const hasAccess = isPastor || isMember;

    // Menú completo para miembros y pastores
    const allMenuItems = [
        { id: 'info', icon: 'info', label: 'Información' },
        { id: 'comentarios', icon: 'forum', label: 'Comentarios' },
        { id: 'members', icon: 'group', label: 'Miembros' },
        { id: 'chat', icon: 'chat', label: 'Chat' },
        { id: 'events', icon: 'event', label: 'Reuniones' },
        { id: 'multimedia', icon: 'collections', label: 'Multimedia' },
        { id: 'settings', icon: 'settings', label: 'Configuración' },
    ];

    // ✅ Solo para pastores: insertar "Historial Salidas" después de "Miembros"
    if (isPastor) {
        allMenuItems.splice(3, 0, {
            id: 'ex_miembros',
            icon: 'history',
            label: 'Historial Salidas'
        });
    }

    // Menú reducido para visitantes (no miembros)
    const visitorMenuItems = [
        { id: 'info', icon: 'info', label: 'Información' },
        { id: 'comentarios', icon: 'forum', label: 'Comentarios' },
    ];

    return {
        menuItems: hasAccess ? allMenuItems : visitorMenuItems,
        isPastor,
        isMember,
        hasAccess
    };
};
