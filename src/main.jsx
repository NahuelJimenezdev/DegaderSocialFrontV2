import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './shared/components/Toast/ToastProvider'
import { OnlineUsersProvider } from './contexts/OnlineUsersContext'
import './shared/styles/layout.mobile.css';
// import './index.css'
// import App from './App.jsx'

// 🎨 Inicializar tema ANTES de montar React
// Esto asegura que el tema se aplique inmediatamente al cargar la página
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

initializeTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <OnlineUsersProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </OnlineUsersProvider>
    </AuthProvider>
    {/* <App /> */}
  </StrictMode>,
)


