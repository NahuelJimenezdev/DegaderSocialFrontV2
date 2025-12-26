import Card from './Card';

/**
 * @type {import('@storybook/react').Meta<typeof Card>}
 */
const meta = {
    title: 'Components/Card',
    component: Card,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;

export const Default = {
    args: {
        title: 'Card Title',
        subtitle: 'Card subtitle with description',
        onClick: () => console.log('Card clicked'),
    },
};

export const WithThumbnail = {
    args: {
        title: 'Card with Image',
        subtitle: 'This card has a thumbnail image',
        thumbnail: 'https://via.placeholder.com/400x200',
        onClick: () => console.log('Card clicked'),
    },
};

export const WithOverlay = {
    args: {
        title: 'Event Card',
        subtitle: 'Annual Conference 2024',
        thumbnail: 'https://via.placeholder.com/400x200',
        overlayText: 'Featured',
        timeAgo: '2 hours ago',
        onClick: () => console.log('Card clicked'),
    },
};

export const WithChildren = {
    args: {
        title: 'Card with Custom Content',
        subtitle: 'This card has children elements',
        children: (
            <div className="p-4">
                <p className="text-gray-600 dark:text-gray-300">
                    Custom content can be added here as children.
                </p>
                <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg">
                    Action Button
                </button>
            </div>
        ),
        onClick: () => console.log('Card clicked'),
    },
};

export const WithIcon = {
    args: {
        title: 'Notification',
        subtitle: 'You have new messages',
        icon: '🔔',
        color: '#3b82f6',
        onClick: () => console.log('Card clicked'),
    },
};
