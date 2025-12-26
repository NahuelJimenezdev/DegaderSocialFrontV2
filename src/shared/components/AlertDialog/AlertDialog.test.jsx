import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AlertDialog } from './AlertDialog';

describe('AlertDialog', () => {
    it('should render correctly with message', () => {
        render(
            <AlertDialog
                isOpen={true}
                message="Test message"
                variant="success"
                onClose={() => { }}
            />
        );

        expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should call onClose when button is clicked', () => {
        const onCloseMock = vi.fn();

        render(
            <AlertDialog
                isOpen={true}
                message="Test message"
                variant="info"
                buttonText="Aceptar"
                onClose={onCloseMock}
            />
        );

        const button = screen.getByText('Aceptar');
        fireEvent.click(button);

        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('should not render when isOpen is false', () => {
        const { container } = render(
            <AlertDialog
                isOpen={false}
                message="Test message"
                variant="success"
                onClose={() => { }}
            />
        );

        expect(container.firstChild).toBeNull();
    });

    it('should render with custom title', () => {
        render(
            <AlertDialog
                isOpen={true}
                title="Custom Title"
                message="Test message"
                variant="error"
                onClose={() => { }}
            />
        );

        expect(screen.getByText(/Custom Title/i)).toBeInTheDocument();
    });
});
