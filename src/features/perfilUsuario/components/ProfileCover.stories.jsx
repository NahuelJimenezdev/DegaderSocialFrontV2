import ProfileCover from './ProfileCover';

const mockUser = {
  _id: 'user123',
  nombreCompleto: 'Juan Pérez García',
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'juan.perez@degader.com',
  avatar: '/uploads/avatars/avatar123.jpg',
};

const mockUserSinAvatar = {
  ...mockUser,
  avatar: null,
};

export default {
  title: 'PerfilUsuario/ProfileCover',
  component: ProfileCover,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onEditClick: { action: 'edit clicked' },
  },
};

export const Default = {
  args: {
    user: mockUser,
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    coverUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop',
  },
};

export const SinAvatar = {
  args: {
    user: mockUserSinAvatar,
    avatarUrl: 'https://ui-avatars.com/api/?name=Juan+Perez&background=3b82f6&color=fff',
    coverUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop',
  },
};

export const CoverAlternativo = {
  args: {
    user: mockUser,
    avatarUrl: 'https://i.pravatar.cc/150?img=8',
    coverUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=300&fit=crop',
  },
};
