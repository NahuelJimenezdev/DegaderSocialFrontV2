import ProfileStats from './ProfileStats';

export default {
  title: 'PerfilUsuario/ProfileStats',
  component: ProfileStats,
  tags: ['autodocs'],
  argTypes: {
    stats: {
      description: 'Estadísticas del usuario',
      control: 'object',
    },
  },
};

export const Default = {
  args: {
    stats: {
      totalPosts: 42,
      totalAmigos: 128,
    },
  },
};

export const SinPublicaciones = {
  args: {
    stats: {
      totalPosts: 0,
      totalAmigos: 15,
    },
  },
};

export const SinAmigos = {
  args: {
    stats: {
      totalPosts: 10,
      totalAmigos: 0,
    },
  },
};

export const NuevoUsuario = {
  args: {
    stats: {
      totalPosts: 0,
      totalAmigos: 0,
    },
  },
};

export const UsuarioActivo = {
  args: {
    stats: {
      totalPosts: 1247,
      totalAmigos: 532,
    },
  },
};
