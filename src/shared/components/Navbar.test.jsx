import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

// Mock dependencies
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('../../features/buscador/components/SearchBar', () => ({
    default: () => <div data-testid="search-bar">SearchBar</div>,
}));

vi.mock('../../features/notificaciones/components/NotificationsDropdown', () => ({
    default: () => <div data-testid="notifications-dropdown">Notifications</div>,
}));

vi.mock('../ui/ProfileDropdown', () => ({
    default: () => <div data-testid="profile-dropdown">Profile</div>,
}));

vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        user: {
            _id: 'user123',
            email: 'test@example.com',
            nombres: { primero: 'Juan' },
            apellidos: { primero: 'Pérez' },
        },
    }),
}));

vi.mock('../../hooks/useMessageCounter', () => ({
    useMessageCounter: vi.fn(() => 3), // 3 unread messages by default
}));

describe('Navbar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render navbar with all components', () => {
            render(
                <BrowserRouter>
                    <Navbar />
                </BrowserRouter>
            );

            // Logo
            expect(screen.getByText('Degader')).toBeInTheDocument();

            // SearchBar
            expect(screen.getByTestId('search-bar')).toBeInTheDocument();

            // Notifications
            expect(screen.getByTestId('notifications-dropdown')).toBeInTheDocument();

            // Profile
            expect(screen.getByTestId('profile-dropdown')).toBeInTheDocument();
        });

        it('should render messages button', () => {
            render(
                <BrowserRouter>
                    <Navbar />
                </BrowserRouter>
            );

            const messagesButton = screen.getByLabelText('Mensajes');
            expect(messagesButton).toBeInTheDocument();
        });

        it('should display unread message count badge', () => {
            render(
                <BrowserRouter>
                    <Navbar />
                </BrowserRouter>
            );

            // Should show badge with count
            expect(screen.getByText('3')).toBeInTheDocument();
        });
    });

    describe('Navigation', () => {
        it('should navigate to home when logo is clicked', () => {
            render(
                <BrowserRouter>
                    <Navbar />
                </BrowserRouter>
            );

            const logo = screen.getByText('Degader');
            fireEvent.click(logo);

            expect(mockNavigate).toHaveBeenCalledWith('/');
            expect(mockNavigate).toHaveBeenCalledTimes(1);
        });

        it('should navigate to messages when messages button is clicked', () => {
            render(
                <BrowserRouter>
                    <Navbar />
                </BrowserRouter>
            );

            const messagesButton = screen.getByLabelText('Mensajes');
            fireEvent.click(messagesButton);

            expect(mockNavigate).toHaveBeenCalledWith('/mensajes');
            expect(mockNavigate).toHaveBeenCalledTimes(1);
        });
    });

    describe('Styling', () => {
        it('should have fixed positioning', () => {
            const { container } = render(
                <BrowserRouter>
                    <Navbar />
                </BrowserRouter>
            );

            const nav = container.querySelector('nav');
            expect(nav).toHaveClass('fixed');
            expect(nav).toHaveClass('top-0');
        });

        it('should have dark mode classes', () => {
            const { container } = render(
                <BrowserRouter>
                    <Navbar />
                </BrowserRouter>
            );

            const nav = container.querySelector('nav');
            expect(nav).toHaveClass('dark:bg-gray-900');
            expect(nav).toHaveClass('dark:border-gray-800');
        });
    });
});
