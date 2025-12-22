import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Leer tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Aplicar tema al html element (requerido por Tailwind)
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    // Toggle dark class en html element (requerido por Tailwind)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
    >
      {theme === 'dark' ? (
        <>
          <Sun size={16} />
          <span>Modo Claro</span>
        </>
      ) : (
        <>
          <Moon size={16} />
          <span>Modo Oscuro</span>
        </>
      )}
    </button>
  );
};

export default ThemeSwitcher;


