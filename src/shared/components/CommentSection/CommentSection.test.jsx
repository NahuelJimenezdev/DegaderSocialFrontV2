import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CommentSection from './CommentSection';

// Mock dependencies
vi.mock('./CommentItem', () => ({
    default: ({ comment }) => (
        <div data-testid={`comment-${comment._id}`}>
            <p>{comment.contenido}</p>
        </div>
    ),
}));

vi.mock('../../utils/avatarUtils', () => ({
    getUserAvatar: vi.fn(() => 'https://avatar.com/user.jpg'),
}));

vi.mock('../../components/EmojiPicker/EmojiPicker', () => ({
    default: ({ onEmojiSelect, onClose }) => (
        <div data-testid="emoji-picker">
            <button onClick={() => onEmojiSelect('😀')}>Select Emoji</button>
            <button onClick={onClose}>Close</button>
        </div>
    ),
}));

describe('CommentSection', () => {
    const mockCurrentUser = {
        _id: 'user123',
        email: 'test@example.com',
        nombres: { primero: 'Juan' },
        apellidos: { primero: 'Pérez' },
    };

    const mockComments = [
        {
            _id: 'comment1',
            contenido: 'Primer comentario',
            usuario: {
                _id: 'user456',
                email: 'otro@example.com',
            },
            createdAt: new Date('2024-01-01'),
        },
        {
            _id: 'comment2',
            contenido: 'Segundo comentario',
            usuario: mockCurrentUser,
            createdAt: new Date('2024-01-02'),
        },
    ];

    const mockOnAddComment = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render comment list', () => {
            render(
                <CommentSection
                    comments={mockComments}
                    postId="post123"
                    onAddComment={mockOnAddComment}
                    currentUser={mockCurrentUser}
                />
            );

            expect(screen.getByTestId('comment-comment1')).toBeInTheDocument();
            expect(screen.getByTestId('comment-comment2')).toBeInTheDocument();
        });

        it('should render comment input', () => {
            render(
                <CommentSection
                    comments={[]}
                    postId="post123"
                    onAddComment={mockOnAddComment}
                    currentUser={mockCurrentUser}
                />
            );

            const input = screen.getByPlaceholderText(/Escribe un comentario/i);
            expect(input).toBeInTheDocument();
        });

        it('should render action buttons', () => {
            render(
                <CommentSection
                    comments={[]}
                    postId="post123"
                    onAddComment={mockOnAddComment}
                    currentUser={mockCurrentUser}
                />
            );

            expect(screen.getByTitle(/Agregar emoji/i)).toBeInTheDocument();
            expect(screen.getByTitle(/Agregar imagen/i)).toBeInTheDocument();
        });
    });

    describe('Adding Comments', () => {
        it('should call onAddComment when submit button is clicked', async () => {
            mockOnAddComment.mockResolvedValue();

            render(
                <CommentSection
                    comments={[]}
                    postId="post123"
                    onAddComment={mockOnAddComment}
                    currentUser={mockCurrentUser}
                />
            );

            const input = screen.getByPlaceholderText(/Escribe un comentario/i);
            const form = input.closest('form');

            fireEvent.change(input, { target: { value: 'Nuevo comentario' } });
            fireEvent.submit(form);

            await waitFor(() => {
                expect(mockOnAddComment).toHaveBeenCalledWith(
                    'post123',
                    'Nuevo comentario',
                    null,
                    null
                );
            });
        });

        it('should clear input after submitting', async () => {
            mockOnAddComment.mockResolvedValue();

            render(
                <CommentSection
                    comments={[]}
                    postId="post123"
                    onAddComment={mockOnAddComment}
                    currentUser={mockCurrentUser}
                />
            );

            const input = screen.getByPlaceholderText(/Escribe un comentario/i);
            const form = input.closest('form');

            fireEvent.change(input, { target: { value: 'Test comment' } });
            fireEvent.submit(form);

            await waitFor(() => {
                expect(input.value).toBe('');
            });
        });

        it('should not submit empty comment', () => {
            render(
                <CommentSection
                    comments={[]}
                    postId="post123"
                    onAddComment={mockOnAddComment}
                    currentUser={mockCurrentUser}
                />
            );

            const input = screen.getByPlaceholderText(/Escribe un comentario/i);
            const form = input.closest('form');

            fireEvent.submit(form);

            expect(mockOnAddComment).not.toHaveBeenCalled();
        });
    });

    describe('Emoji Picker', () => {
        it('should toggle emoji picker', () => {
            render(
                <CommentSection
                    comments={[]}
                    postId="post123"
                    onAddComment={mockOnAddComment}
                    currentUser={mockCurrentUser}
                />
            );

            const emojiButton = screen.getByTitle(/Agregar emoji/i);

            // Initially hidden
            expect(screen.queryByTestId('emoji-picker')).not.toBeInTheDocument();

            // Click to show
            fireEvent.click(emojiButton);
            expect(screen.getByTestId('emoji-picker')).toBeInTheDocument();
        });

        it('should add emoji to input', () => {
            render(
                <CommentSection
                    comments={[]}
                    postId="post123"
                    onAddComment={mockOnAddComment}
                    currentUser={mockCurrentUser}
                />
            );

            const input = screen.getByPlaceholderText(/Escribe un comentario/i);
            const emojiButton = screen.getByTitle(/Agregar emoji/i);

            fireEvent.click(emojiButton);
            const selectButton = screen.getByText('Select Emoji');
            fireEvent.click(selectButton);

            expect(input.value).toBe('😀');
        });
    });
});
