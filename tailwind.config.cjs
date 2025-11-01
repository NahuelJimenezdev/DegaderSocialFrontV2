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
        primary: '#3B82F6',
        accent: '#F59E0B',

        // Fondos
        'background-light': '#F9FAFB',
        'background-dark': '#111827',
        'surface-light': '#FFFFFF',
        'surface-dark': '#37301fff',

        // Texto
        'text-light-primary': '#111827',
        'text-dark-primary': '#F9FAFB',
        'text-light-secondary': '#6B7280',
        'text-dark-secondary': '#9CA3AF',

        // Bordes
        'border-light': '#E5E7EB',
        'border-dark': '#374151',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};
