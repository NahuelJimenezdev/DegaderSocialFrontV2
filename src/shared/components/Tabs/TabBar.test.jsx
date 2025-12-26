import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TabBar from './TabBar';

// Mock TabItem
vi.mock('./TabItem', () => ({
    default: ({ tab, isActive, onClick }) => (
        <div
            data-testid={`tab-${tab.id}`}
            onClick={onClick}
            className={isActive ? 'active' : ''}
        >
            {tab.title}
        </div>
    ),
}));

describe('TabBar', () => {
    const mockTabs = [
        { id: 'tab1', title: 'Tab 1', icon: 'home' },
        { id: 'tab2', title: 'Tab 2', icon: 'settings' },
        { id: 'tab3', title: 'Tab 3', icon: 'profile' },
    ];

    const mockOnTabChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render all tabs', () => {
            render(
                <TabBar
                    tabs={mockTabs}
                    activeTab="tab1"
                    onTabChange={mockOnTabChange}
                />
            );

            expect(screen.getByTestId('tab-tab1')).toBeInTheDocument();
            expect(screen.getByTestId('tab-tab2')).toBeInTheDocument();
            expect(screen.getByTestId('tab-tab3')).toBeInTheDocument();
        });

        it('should display tab titles', () => {
            render(
                <TabBar
                    tabs={mockTabs}
                    activeTab="tab1"
                    onTabChange={mockOnTabChange}
                />
            );

            expect(screen.getByText('Tab 1')).toBeInTheDocument();
            expect(screen.getByText('Tab 2')).toBeInTheDocument();
            expect(screen.getByText('Tab 3')).toBeInTheDocument();
        });

        it('should apply grid layout by default', () => {
            const { container } = render(
                <TabBar
                    tabs={mockTabs}
                    activeTab="tab1"
                    onTabChange={mockOnTabChange}
                />
            );

            const tabContainer = container.firstChild;
            expect(tabContainer).toHaveClass('grid');
        });

        it('should apply flex layout when specified', () => {
            const { container } = render(
                <TabBar
                    tabs={mockTabs}
                    activeTab="tab1"
                    onTabChange={mockOnTabChange}
                    layout="flex"
                />
            );

            const tabContainer = container.firstChild;
            expect(tabContainer).toHaveClass('flex');
        });
    });

    describe('Tab Interaction', () => {
        it('should call onTabChange when tab is clicked', () => {
            render(
                <TabBar
                    tabs={mockTabs}
                    activeTab="tab1"
                    onTabChange={mockOnTabChange}
                />
            );

            const tab2 = screen.getByTestId('tab-tab2');
            fireEvent.click(tab2);

            expect(mockOnTabChange).toHaveBeenCalledWith('tab2');
            expect(mockOnTabChange).toHaveBeenCalledTimes(1);
        });

        it('should handle multiple tab clicks', () => {
            render(
                <TabBar
                    tabs={mockTabs}
                    activeTab="tab1"
                    onTabChange={mockOnTabChange}
                />
            );

            fireEvent.click(screen.getByTestId('tab-tab2'));
            fireEvent.click(screen.getByTestId('tab-tab3'));
            fireEvent.click(screen.getByTestId('tab-tab1'));

            expect(mockOnTabChange).toHaveBeenCalledTimes(3);
            expect(mockOnTabChange).toHaveBeenNthCalledWith(1, 'tab2');
            expect(mockOnTabChange).toHaveBeenNthCalledWith(2, 'tab3');
            expect(mockOnTabChange).toHaveBeenNthCalledWith(3, 'tab1');
        });
    });

    describe('Active State', () => {
        it('should mark correct tab as active', () => {
            render(
                <TabBar
                    tabs={mockTabs}
                    activeTab="tab2"
                    onTabChange={mockOnTabChange}
                />
            );

            const tab1 = screen.getByTestId('tab-tab1');
            const tab2 = screen.getByTestId('tab-tab2');
            const tab3 = screen.getByTestId('tab-tab3');

            expect(tab1).not.toHaveClass('active');
            expect(tab2).toHaveClass('active');
            expect(tab3).not.toHaveClass('active');
        });

        it('should update active state when activeTab prop changes', () => {
            const { rerender } = render(
                <TabBar
                    tabs={mockTabs}
                    activeTab="tab1"
                    onTabChange={mockOnTabChange}
                />
            );

            expect(screen.getByTestId('tab-tab1')).toHaveClass('active');

            rerender(
                <TabBar
                    tabs={mockTabs}
                    activeTab="tab3"
                    onTabChange={mockOnTabChange}
                />
            );

            expect(screen.getByTestId('tab-tab1')).not.toHaveClass('active');
            expect(screen.getByTestId('tab-tab3')).toHaveClass('active');
        });
    });
});
