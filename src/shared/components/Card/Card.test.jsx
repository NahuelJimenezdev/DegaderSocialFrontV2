import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from './Card';

describe('Card Component', () => {
    it('should render with title and subtitle', () => {
        render(
            <Card
                title="Test Title"
                subtitle="Test Subtitle"
            />
        );

        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('should call onClick when clicked', () => {
        const onClickMock = vi.fn();

        render(
            <Card
                title="Clickable Card"
                subtitle="Click me"
                onClick={onClickMock}
            />
        );

        const card = screen.getByText('Clickable Card').closest('div').parentElement;
        fireEvent.click(card);

        expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should render children correctly', () => {
        render(
            <Card
                title="Card with Children"
                subtitle="Subtitle"
            >
                <div>Child content</div>
            </Card>
        );

        expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('should render with thumbnail and overlay text', () => {
        render(
            <Card
                title="Card with Thumbnail"
                subtitle="Subtitle"
                thumbnail="/test-image.jpg"
                overlayText="Overlay"
                timeAgo="2 hours ago"
            />
        );

        expect(screen.getByText('Card with Thumbnail')).toBeInTheDocument();
        expect(screen.getByText('Overlay')).toBeInTheDocument();
        expect(screen.getByText('2 hours ago')).toBeInTheDocument();
    });
});
