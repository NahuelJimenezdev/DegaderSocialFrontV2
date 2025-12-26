import { useState } from 'react';
import EmojiPicker from './EmojiPicker';

/**
 * @type {import('@storybook/react').Meta<typeof EmojiPicker>}
 */
const meta = {
    title: 'Components/EmojiPicker',
    component: EmojiPicker,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;

/**
 * Wrapper component to handle state
 * @param {any} args - Story args
 */
const EmojiPickerWrapper = (args) => {
    const [selectedEmoji, setSelectedEmoji] = useState('');

    return (
        <div>
            <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Selected Emoji: <span className="text-2xl">{selectedEmoji || '(none)'}</span>
                </p>
            </div>
            <EmojiPicker
                {...args}
                onEmojiSelect={(emoji) => {
                    setSelectedEmoji(emoji);
                    console.log('Selected emoji:', emoji);
                }}
            />
        </div>
    );
};

export const Default = {
    render: (args) => <EmojiPickerWrapper {...args} />,
    args: {
        onClose: () => console.log('Picker closed'),
    },
};

export const DarkMode = {
    render: (args) => (
        <div className="dark">
            <div className="bg-gray-900 p-8 rounded-lg">
                <EmojiPickerWrapper {...args} />
            </div>
        </div>
    ),
    args: {
        onClose: () => console.log('Picker closed'),
    },
};
