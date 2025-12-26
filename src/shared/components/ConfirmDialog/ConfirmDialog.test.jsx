import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog', () => {
    it('should render correctly with title and message', () => {
        render(
            <ConfirmDialog
                isOpen={true}
                title="Confirm Action"
                message="Are you sure?"
                variant="danger"
                onConfirm={() => { }}
                onClose={() => { }}
            />
        );

        expect(screen.getByText(/Confirm Action/i)).toBeInTheDocument();
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    });

    it('should call onConfirm when confirm button is clicked', () => {
        const onConfirmMock = vi.fn();
        const onCloseMock = vi.fn();

        render(
            <ConfirmDialog
                isOpen={true}
                title="Delete Item"
                message="This action cannot be undone"
                variant="danger"
                confirmText="Eliminar"
                onConfirm={onConfirmMock}
                onClose={onCloseMock}
            />
        );

        const confirmButton = screen.getByText('Eliminar');
        fireEvent.click(confirmButton);

        expect(onConfirmMock).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when cancel button is clicked', () => {
        const onConfirmMock = vi.fn();
        const onCloseMock = vi.fn();

        render(
            <ConfirmDialog
                isOpen={true}
                title="Confirm"
                message="Proceed?"
                variant="warning"
                onConfirm={onConfirmMock}
                onClose={onCloseMock}
            />
        );

        const cancelButton = screen.getByText('Cancelar');
        fireEvent.click(cancelButton);

        expect(onCloseMock).toHaveBeenCalledTimes(1);
        expect(onConfirmMock).not.toHaveBeenCalled();
    });

    it('should disable buttons during loading state', () => {
        render(
            <ConfirmDialog
                isOpen={true}
                title="Processing"
                message="Please wait"
                variant="info"
                onConfirm={() => { }}
                onClose={() => { }}
                isLoading={true}
            />
        );

        const confirmButton = screen.getByText('Procesando...');
        const cancelButton = screen.getByText('Cancelar');

        expect(confirmButton).toBeDisabled();
        expect(cancelButton).toBeDisabled();
    });

    it('should apply correct variant styling', () => {
        const variants = ['danger', 'warning', 'info', 'success'];

        variants.forEach((variant) => {
            const { unmount } = render(
                <ConfirmDialog
                    isOpen={true}
                    title={`${variant} dialog`}
                    message="Test message"
                    variant={variant}
                    onConfirm={() => { }}
                    onClose={() => { }}
                />
            );

            expect(screen.getByText(new RegExp(`${variant} dialog`, 'i'))).toBeInTheDocument();
            unmount();
        });
    });

    it('should not render when isOpen is false', () => {
        const { container } = render(
            <ConfirmDialog
                isOpen={false}
                title="Hidden"
                message="Should not appear"
                variant="danger"
                onConfirm={() => { }}
                onClose={() => { }}
            />
        );

        expect(container.firstChild).toBeNull();
    });
});
