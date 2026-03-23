import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './shared/components/Toast/ToastProvider'
import { OnlineUsersProvider } from './contexts/OnlineUsersContext'
import { OnboardingProvider } from './features/onboarding/components/OnboardingProvider'
import './shared/styles/layout.mobile.css';
import './shared/styles/index.css';
import arenaLogoSvg from './features/LaSendadelReino/assets/logo.svg';

// 🚀 Precargar logo principal de La Senda del Reino apenas inicia la app
// Esto asegura que al entrar en /arena, la imagen ya esté disponible en caché
const preloadArenaAssets = () => {
  const img = new Image();
  img.src = arenaLogoSvg;
};
preloadArenaAssets();

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

// 🛠️ Registro de Service Worker para PWA e Infraestructura de Mensajería
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then(reg => console.log('✅ [SW] Service Worker registrado con éxito:', reg.scope))
      .catch(err => console.error('❌ [SW] Error al registrar Service Worker:', err));
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <OnlineUsersProvider>
        <ToastProvider>
          <OnboardingProvider>
            <RouterProvider router={router} />
          </OnboardingProvider>
        </ToastProvider>
      </OnlineUsersProvider>
    </AuthProvider>
    {/* <App /> */}
  </StrictMode>,
)


