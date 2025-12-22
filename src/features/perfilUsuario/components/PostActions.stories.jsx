import PostActions from './PostActions';

const mockUser = {
  _id: 'user123',
  nombreCompleto: 'Usuario Demo',
};

const mockPost = {
  _id: 'post123',
  likes: ['user456', 'user789'],
  comentarios: [{ _id: 'c1' }, { _id: 'c2' }, { _id: 'c3' }],
  compartidos: ['user111'],
};

const mockPostLiked = {
  ...mockPost,
  likes: ['user123', 'user456', 'user789'],
};

export default {
  title: 'PerfilUsuario/PostActions',
  component: PostActions,
  tags: ['autodocs'],
  argTypes: {
    onLike: { action: 'liked' },
    onSave: { action: 'saved' },
    onToggleComments: { action: 'toggle comments' },
  },
};

export const Default = {
  args: {
    post: mockPost,
    user: mockUser,
    savedPosts: [],
  },
};

export const PostLiked = {
  args: {
    post: mockPostLiked,
    user: mockUser,
    savedPosts: [],
  },
};

export const PostSaved = {
  args: {
    post: mockPost,
    user: mockUser,
    savedPosts: ['post123'],
  },
};

export const PostLikedAndSaved = {
  args: {
    post: mockPostLiked,
    user: mockUser,
    savedPosts: ['post123'],
  },
};

export const SinInteracciones = {
  args: {
    post: {
      _id: 'post456',
      likes: [],
      comentarios: [],
      compartidos: [],
    },
    user: mockUser,
    savedPosts: [],
  },
};


