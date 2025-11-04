// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          DEFAULT: '#4a9eff',
          light: '#6bb1ff',
          dark: '#3a8eef',
        },
        accent: '#F59E0B',

        // Backgrounds
        'bg-primary': '#ffffff',
        'bg-primary-dark': '#0a0e27',
        'bg-secondary': '#f9fafb',
        'bg-secondary-dark': '#1F2937',
        'bg-card': '#ffffff',
        'bg-card-dark': '#1F2937',

        // Legacy background names (mantener compatibilidad)
        'background-light': '#F9FAFB',
        'background-dark': '#111827',
        'surface-light': '#FFFFFF',
        'surface-dark': '#1F2937',

        // Text colors
        'text-primary': '#1F2937',
        'text-primary-dark': '#F9FAFB',
        'text-secondary': '#6B7280',
        'text-secondary-dark': '#9CA3AF',

        // Legacy text names (mantener compatibilidad)
        'text-light-primary': '#111827',
        'text-dark-primary': '#F9FAFB',
        'text-light-secondary': '#6B7280',
        'text-dark-secondary': '#9CA3AF',

        // Border colors
        'border-default': '#E5E7EB',
        'border-default-dark': '#374151',

        // Legacy border names (mantener compatibilidad)
        'border-light': '#E5E7EB',
        'border-dark': '#374151',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0,0,0,0.06)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};
