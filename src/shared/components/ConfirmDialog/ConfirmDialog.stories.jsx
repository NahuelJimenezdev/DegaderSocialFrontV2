import { ConfirmDialog } from './ConfirmDialog';

/**
 * @type {import('@storybook/react').Meta<typeof ConfirmDialog>}
 */
const meta = {
    title: 'Components/ConfirmDialog',
    component: ConfirmDialog,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['danger', 'warning', 'info', 'success'],
        },
        isOpen: {
            control: 'boolean',
        },
        isLoading: {
            control: 'boolean',
        },
    },
};

export default meta;

export const DeleteConfirmation = {
    args: {
        isOpen: true,
        title: 'Eliminar Elemento',
        message: '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.',
        variant: 'danger',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        isLoading: false,
        onConfirm: () => console.log('Confirmed'),
        onClose: () => console.log('Cancelled'),
    },
};

export const Warning = {
    args: {
        isOpen: true,
        title: 'Cambios sin Guardar',
        message: 'Tienes cambios sin guardar. ¿Deseas salir sin guardar?',
        variant: 'warning',
        confirmText: 'Salir sin Guardar',
        cancelText: 'Volver',
        isLoading: false,
        onConfirm: () => console.log('Confirmed'),
        onClose: () => console.log('Cancelled'),
    },
};

export const Info = {
    args: {
        isOpen: true,
        title: 'Actualizar Aplicación',
        message: 'Hay una nueva versión disponible. ¿Deseas actualizar ahora?',
        variant: 'info',
        confirmText: 'Actualizar',
        cancelText: 'Más Tarde',
        isLoading: false,
        onConfirm: () => console.log('Confirmed'),
        onClose: () => console.log('Cancelled'),
    },
};

export const Loading = {
    args: {
        isOpen: true,
        title: 'Procesando',
        message: 'Espera mientras procesamos tu solicitud...',
        variant: 'info',
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        isLoading: true,
        onConfirm: () => console.log('Confirmed'),
        onClose: () => console.log('Cancelled'),
    },
};

export const Success = {
    args: {
        isOpen: true,
        title: 'Confirmar Acción',
        message: '¿Deseas continuar con esta operación?',
        variant: 'success',
        confirmText: 'Sí, Continuar',
        cancelText: 'No, Cancelar',
        isLoading: false,
        onConfirm: () => console.log('Confirmed'),
        onClose: () => console.log('Cancelled'),
    },
};
