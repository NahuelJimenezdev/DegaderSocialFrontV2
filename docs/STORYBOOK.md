# 📚 Storybook - Guía de Uso

Esta aplicación utiliza Storybook para el desarrollo aislado y documentación de componentes.

---

## 🚀 Iniciar Storybook

```bash
# Instalar dependencias de Storybook
npm install --save-dev @storybook/react-vite @storybook/addon-essentials @storybook/addon-interactions

# Iniciar Storybook
npm run storybook
```

Storybook se abrirá automáticamente en `http://localhost:6006`

---

## 📁 Estructura de Stories

```
src/features/perfilUsuario/components/
├── ProfileStats.jsx
├── ProfileStats.stories.jsx  ← Story del componente
├── ProfileTabs.jsx
├── ProfileTabs.stories.jsx
└── ...
```

---

## ✍️ Cómo Escribir Stories

### **Estructura Básica:**

```jsx
import ComponentName from './ComponentName';

export default {
  title: 'PerfilUsuario/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  argTypes: {
    propName: {
      description: 'Descripción de la prop',
      control: 'text', // o 'boolean', 'select', 'object', etc.
    },
  },
};

export const Default = {
  args: {
    propName: 'valor por defecto',
  },
};

export const Variant = {
  args: {
    propName: 'otro valor',
  },
};
```

---

## 🎨 Ejemplos de Stories

### **1. Story Simple (ProfileStats)**

```jsx
import ProfileStats from './ProfileStats';

export default {
  title: 'PerfilUsuario/ProfileStats',
  component: ProfileStats,
  tags: ['autodocs'],
};

export const Default = {
  args: {
    stats: {
      totalPosts: 42,
      totalAmigos: 128,
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
```

---

### **2. Story Interactivo (ProfileTabs)**

```jsx
import { useState } from 'react';
import ProfileTabs from './ProfileTabs';

export default {
  title: 'PerfilUsuario/ProfileTabs',
  component: ProfileTabs,
  tags: ['autodocs'],
};

export const Interactive = () => {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <ProfileTabs
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
};
```

---

### **3. Story con Actions (PostActions)**

```jsx
import PostActions from './PostActions';

const mockPost = {
  _id: 'post123',
  likes: ['user456', 'user789'],
  comentarios: [{ _id: 'c1' }],
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
    user: { _id: 'user123' },
    savedPosts: [],
  },
};
```

---

## 🎯 Addons Disponibles

### **1. Controls**
Permite modificar props en tiempo real desde la UI.

```jsx
export default {
  argTypes: {
    backgroundColor: { control: 'color' },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    disabled: { control: 'boolean' },
  },
};
```

---

### **2. Actions**
Registra eventos disparados por el componente.

```jsx
export default {
  argTypes: {
    onClick: { action: 'clicked' },
    onSubmit: { action: 'submitted' },
  },
};
```

---

### **3. Docs (Autodocs)**
Genera documentación automática del componente.

```jsx
export default {
  tags: ['autodocs'], // ← Habilita documentación automática
};
```

---

## 📐 Layouts

Personalizar el layout del canvas:

```jsx
export default {
  parameters: {
    layout: 'centered', // 'centered', 'fullscreen', 'padded'
  },
};
```

---

## 🌗 Temas (Dark/Light)

Los componentes heredan el tema del proyecto. Para cambiar el fondo en Storybook:

```jsx
// .storybook/preview.js
export default {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f9fafb' },
        { name: 'dark', value: '#111827' },
      ],
    },
  },
};
```

---

## 🧪 Testing con Storybook

### **Interaction Tests:**

```jsx
import { expect } from '@storybook/jest';
import { within, userEvent } from '@storybook/testing-library';

export const ClickTest = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await userEvent.click(button);
    await expect(button).toHaveClass('active');
  },
};
```

---

## 📦 Scripts de NPM

Agregar a `package.json`:

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

---

## 🚀 Build para Producción

```bash
npm run build-storybook
```

Esto genera una versión estática en `storybook-static/` que podés deployar a:
- GitHub Pages
- Netlify
- Vercel
- Cualquier hosting estático

---

## 📚 Recursos

- [Documentación Oficial de Storybook](https://storybook.js.org/)
- [Storybook para React](https://storybook.js.org/docs/react/get-started/introduction)
- [Addons de Storybook](https://storybook.js.org/addons)
- [Best Practices](https://storybook.js.org/docs/react/writing-stories/introduction)

---

**¡Happy Coding!** 🎨
