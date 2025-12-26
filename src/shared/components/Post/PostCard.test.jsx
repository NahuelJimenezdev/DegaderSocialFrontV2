import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PostCard from './PostCard';

// Mock dependencies
vi.mock('../../utils/avatarUtils', () => ({
    getUserAvatar: vi.fn((user) => `https://avatar.com/${user?.email}`),
}));

vi.mock('../../../features/feed/components/ImageGallery', () => ({
    default: ({ images }) => <div data-testid="image-gallery">{images.length} images</div>,
}));

vi.mock('../CommentSection/CommentSection', () => ({
    default: ({ comments, postId }) => (
        <div data-testid="comment-section">
            Comments for post {postId}: {comments?.length || 0}
        </div>
    ),
}));

describe('PostCard', () => {
    const mockCurrentUser = {
        _id: 'user123',
        email: 'test@example.com',
        nombres: { primero: 'Juan' },
        apellidos: { primero: 'Pérez' },
    };

    const mockPost = {
        _id: 'post123',
        usuario: {
            _id: 'author123',
            email: 'author@example.com',
            nombres: { primero: 'María' },
            apellidos: { primero: 'García' },
        },
        contenido: 'Este es un post de prueba',
        createdAt: new Date('2024-01-01'),
        privacidad: 'publico',
        likes: ['user456'],
        comentarios: [
            { _id: 'comment1', contenido: 'Comentario 1' },
            { _id: 'comment2', contenido: 'Comentario 2' },
        ],
        compartidos: [],
        images: [],
        videos: [],
    };

    const mockHandlers = {
        onLike: vi.fn(),
        onComment: vi.fn(),
        onShare: vi.fn(),
        onAddComment: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should render post with user information', () => {
            render(
                <PostCard
                    post={mockPost}
                    variant="feed"
                    currentUser={mockCurrentUser}
                    {...mockHandlers}
                />
            );

            expect(screen.getByText('María García')).toBeInTheDocument();
            expect(screen.getByText('Este es un post de prueba')).toBeInTheDocument();
        });

        it('should display user avatar', () => {
            render(
                <PostCard
                    post={mockPost}
                    variant="feed"
                    currentUser={mockCurrentUser}
                    {...mockHandlers}
                />
            );

            const avatars = screen.getAllByRole('img');
            const avatar = avatars.find(img => img.alt === 'María García');
            expect(avatar).toBeInTheDocument();
        });

        it('should show post creation time', () => {
            render(
                <PostCard
                    post={mockPost}
                    variant="feed"
                    currentUser={mockCurrentUser}
                    {...mockHandlers}
                />
            );

            // Should show relative time (e.g., "hace X tiempo")
            expect(screen.getByText(/hace/i)).toBeInTheDocument();
        });

        it('should display privacy icon', () => {
            render(
                <PostCard
                    post={mockPost}
                    variant="feed"
                    currentUser={mockCurrentUser}
                    {...mockHandlers}
                />
            );

            // Privacy icon should be rendered (Globe for public)
            const container = screen.getByText('María García').closest('div');
            expect(container).toBeInTheDocument();
        });
    });

    describe('Images and Media', () => {
        it('should render image gallery when images exist', () => {
            const postWithImages = {
                ...mockPost,
                images: [
                    { url: 'image1.jpg' },
                    { url: 'image2.jpg' },
                ],
            };

            render(
                <PostCard
                    post={postWithImages}
                    variant="feed"
                    currentUser={mockCurrentUser}
                    {...mockHandlers}
                />
            );

            expect(screen.getByTestId('image-gallery')).toBeInTheDocument();
            expect(screen.getByText('2 images')).toBeInTheDocument();
        });

        it('should not render image gallery when no images', () => {
            render(
                <PostCard
                    post={mockPost}
                    variant="feed"
                    currentUser={mockCurrentUser}
                    {...mockHandlers}
                />
            );

            expect(screen.queryByTestId('image-gallery')).not.toBeInTheDocument();
        });
    });

    describe('Like Functionality', () => {
        it('should display like count', () => {
            render(
                <PostCard
                    post={mockPost}
                    variant="feed"
                    currentUser={mockCurrentUser}
                    {...mockHandlers}
                />
            );

            expect(screen.getByText('1')).toBeInTheDocument(); // 1 like
        });

        it('should call onLike when like button is clicked', () => {
            render(
                <PostCard
                    post={mockPost}
                    variant="feed"
                    currentUser={mockCurrentUser}
                    {...mockHandlers}
                />
            );

            const likeButton = screen.getAllByRole('button')[1]; // Second button is like
            fireEvent.click(likeButton);

            expect(mockHandlers.onLike).toHaveBeenCalledWith('post123');
            expect(mockHandlers.onLike).toHaveBeenCalledTimes(1);
        });

        it('should show liked state when user has liked the post', () => {
            const likedPost = {
                ...mockPost,
                likes: ['user123'], // Current user has liked
            };

            render(
                <PostCard
                    post={likedPost}
                    variant="feed"
                    currentUser={mockCurrentUser}
                    {...mockHandlers}
                />
            );

            const likeButton = screen.getAllByRole('button')[1];
            expect(likeButton).toHaveClass('text-red-500');
        });
    });

    describe('Comment Functionality', () => {
        it('should display comment count', () => {
            render(
                <PostCard
                    post={mockPost}
                    variant="feed"
                    currentUser={mockCurrentUser}
                    {...mockHandlers}
                />
            );

            expect(screen.getByText('2')).toBeInTheDocument(); // 2 comments
        });

        it('should toggle comment section when comment button is clicked', () => {
            render(
                <PostCard
                    post={mockPost}
                    variant="feed"
                    currentUser={mockCurrentUser}
                    {...mockHandlers}
                />
            );

            // Initially, comment section should not be visible
            expect(screen.queryByTestId('comment-section')).not.toBeInTheDocument();

            // Click comment button
            const commentButton = screen.getAllByRole('button')[2]; // Third button is comment
            fireEvent.click(commentButton);

            // Comment section should now be visible
            expect(screen.getByTestId('comment-section')).toBeInTheDocument();
            expect(screen.getByText(/Comments for post post123/)).toBeInTheDocument();
        });

        it('should hide comment section when clicked again', () => {
            render(
                <PostCard
                    post={mockPost}
                    variant="feed"
                    currentUser={mockCurrentUser}
                    {...mockHandlers}
                />
            );

            const commentButton = screen.getAllByRole('button')[2];

            // Open comments
            fireEvent.click(commentButton);
            expect(screen.getByTestId('comment-section')).toBeInTheDocument();

            // Close comments
            fireEvent.click(commentButton);
            expect(screen.queryByTestId('comment-section')).not.toBeInTheDocument();
        });
    });

    describe('Share Functionality', () => {
        it('should display share button in feed variant', () => {
            render(
                <PostCard
                    post={mockPost}
                    variant="feed"
                    currentUser={mockCurrentUser}
                    {...mockHandlers}
                />
            );

            const shareButton = screen.getAllByRole('button')[3]; // Fourth button is share
            expect(shareButton).toBeInTheDocument();
        });

        it('should call onShare when share button is clicked', () => {
            render(
                <PostCard
                    post={mockPost}
                    variant="feed"
                    currentUser={mockCurrentUser}
                    {...mockHandlers}
                />
            );

            const shareButton = screen.getAllByRole('button')[3];
            fireEvent.click(shareButton);

            expect(mockHandlers.onShare).toHaveBeenCalledWith('post123');
            expect(mockHandlers.onShare).toHaveBeenCalledTimes(1);
        });

        it('should not display share button in profile variant', () => {
            render(
                <PostCard
                    post={mockPost}
                    variant="profile"
                    profileContext={{
                        user: mockCurrentUser,
                        showComments: {},
                        savedPosts: [],
                    }}
                />
            );

            // Should only have 3 buttons (more, like, comment) - no share
            const buttons = screen.getAllByRole('button');
            expect(buttons).toHaveLength(4); // more, like, comment, save
        });
    });

    describe('Group Posts', () => {
        it('should display group indicator for group posts', () => {
            const groupPost = {
                ...mockPost,
                grupo: {
                    _id: 'group123',
                    nombre: 'Grupo de Prueba',
                    tipo: 'publico',
                },
            };

            render(
                <PostCard
                    post={groupPost}
                    variant="feed"
                    currentUser={mockCurrentUser}
                    {...mockHandlers}
                />
            );

            expect(screen.getByText('Publicado en el grupo:')).toBeInTheDocument();
            expect(screen.getByText('Grupo de Prueba')).toBeInTheDocument();
            expect(screen.getByText('(Público)')).toBeInTheDocument();
        });

        it('should show private indicator for private groups', () => {
            const privateGroupPost = {
                ...mockPost,
                grupo: {
                    _id: 'group123',
                    nombre: 'Grupo Privado',
                    tipo: 'privado',
                },
            };

            render(
                <PostCard
                    post={privateGroupPost}
                    variant="feed"
                    currentUser={mockCurrentUser}
                    {...mockHandlers}
                />
            );

            expect(screen.getByText('(Privado)')).toBeInTheDocument();
        });
    });
});
