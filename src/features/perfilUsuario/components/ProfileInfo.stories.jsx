import ProfileInfo from './ProfileInfo';

const mockUser = {
  nombreCompleto: 'María González Rodríguez',
  nombre: 'María',
  apellido: 'González',
  biografia: '¡Hola! Soy María, apasionada por la tecnología y el desarrollo web. Me encanta aprender cosas nuevas cada día 🚀',
  ciudad: 'Buenos Aires',
  cargo: 'Desarrolladora Full Stack',
  area: 'Tecnología',
  createdAt: '2023-06-15T10:30:00.000Z',
};

const mockUserMinimal = {
  nombreCompleto: 'Pedro López',
  nombre: 'Pedro',
  apellido: 'López',
  createdAt: '2024-01-10T08:00:00.000Z',
};

const mockStats = {
  totalPosts: 87,
  totalAmigos: 234,
};

const mockStatsNuevo = {
  totalPosts: 3,
  totalAmigos: 12,
};

export default {
  title: 'PerfilUsuario/ProfileInfo',
  component: ProfileInfo,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export const Completo = {
  args: {
    user: mockUser,
    stats: mockStats,
  },
};

export const Minimal = {
  args: {
    user: mockUserMinimal,
    stats: mockStatsNuevo,
  },
};

export const SinBiografia = {
  args: {
    user: {
      ...mockUser,
      biografia: null,
    },
    stats: mockStats,
  },
};

export const SinUbicacion = {
  args: {
    user: {
      ...mockUser,
      ciudad: null,
      cargo: null,
      area: null,
    },
    stats: mockStats,
  },
};
