import React from 'react';

/**
 * Badge para mostrar el rol del usuario con colores distintivos
 */
export default function RoleBadge({ rol }) {
    const getRoleConfig = (role) => {
        switch (role) {
            case 'founder':
            case 'Founder':
                return {
                    label: 'Founder',
                    className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                };
            case 'admin':
                return {
                    label: 'Admin',
                    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                };
            case 'moderador':
                return {
                    label: 'Moderador',
                    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                };
            default:
                return {
                    label: 'Usuario',
                    className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                };
        }
    };

    const { label, className } = getRoleConfig(rol);

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}>
            {label}
        </span>
    );
}
