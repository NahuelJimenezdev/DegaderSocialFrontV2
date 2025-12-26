import { AlertDialog } from './AlertDialog';

/**
 * @type {import('@storybook/react').Meta<typeof AlertDialog>}
 */
const meta = {
    title: 'Components/AlertDialog',
    component: AlertDialog,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['success', 'error', 'warning', 'info'],
        },
        isOpen: {
            control: 'boolean',
        },
    },
};

export default meta;

export const Success = {
    args: {
        isOpen: true,
        title: 'Operación Exitosa',
        message: 'Los cambios se han guardado correctamente.',
        variant: 'success',
        buttonText: 'Aceptar',
        onClose: () => console.log('Dialog closed'),
    },
};

export const Error = {
    args: {
        isOpen: true,
        title: 'Error',
        message: 'No se pudo completar la operación. Por favor, intenta de nuevo.',
        variant: 'error',
        buttonText: 'Entendido',
        onClose: () => console.log('Dialog closed'),
    },
};

export const Warning = {
    args: {
        isOpen: true,
        title: 'Advertencia',
        message: 'Esta acción puede tener consecuencias. ¿Estás seguro de continuar?',
        variant: 'warning',
        buttonText: 'Continuar',
        onClose: () => console.log('Dialog closed'),
    },
};

export const Info = {
    args: {
        isOpen: true,
        title: 'Información',
        message: 'Tu sesión expirará en 5 minutos. Guarda tu trabajo.',
        variant: 'info',
        buttonText: 'OK',
        onClose: () => console.log('Dialog closed'),
    },
};

export const LongMessage = {
    args: {
        isOpen: true,
        title: 'Mensaje Largo',
        message: 'Este es un mensaje muy largo que demuestra cómo el componente maneja texto extenso. El diseño debe adaptarse correctamente y mantener la legibilidad incluso con múltiples líneas de texto.',
        variant: 'info',
        buttonText: 'Aceptar',
        onClose: () => console.log('Dialog closed'),
    },
};
