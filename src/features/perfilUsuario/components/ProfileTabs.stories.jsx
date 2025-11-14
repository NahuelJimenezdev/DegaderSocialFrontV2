import { useState } from 'react';
import ProfileTabs from './ProfileTabs';

export default {
  title: 'PerfilUsuario/ProfileTabs',
  component: ProfileTabs,
  tags: ['autodocs'],
  argTypes: {
    activeTab: {
      control: 'select',
      options: ['posts', 'media', 'likes'],
    },
    onTabChange: { action: 'tab changed' },
  },
};

// Story interactivo con estado
export const Interactive = () => {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <ProfileTabs
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
};

export const PostsActive = {
  args: {
    activeTab: 'posts',
  },
};

export const MediaActive = {
  args: {
    activeTab: 'media',
  },
};

export const LikesActive = {
  args: {
    activeTab: 'likes',
  },
};
